// Tokens van GitHub, de API-helper en de sessie rond elk verzoek.
import type { Omgeving } from './omgeving';
import { SESSIE_COOKIE, ZES_MAANDEN, leesCookie, open, sluit, wisCookie, zetCookie, type Sessie } from './sessie';

export type Haal = typeof fetch;
export type Tokens = { token: string; refresh: string; verloopt: number };
export type Api = (pad: string, init?: RequestInit) => Promise<Response>; // pad zoals '/user' of volledige URL

const TOKEN_URL = 'https://github.com/login/oauth/access_token';
const API_URL = 'https://api.github.com';
const VERNIEUW_MARGE = 60_000; // ms: verloopt de token binnen een minuut, dan eerst vernieuwen
const STANDAARD_GELDIG = 8 * 3_600_000; // ms: GitHub geeft 8 uur als expires_in ontbreekt

// soort: afgewezen = GitHub weigert de code of refresh-token definitief; druk = rate limit; tijdelijk = de rest.
export class TokenFout extends Error {
  constructor(public soort: 'afgewezen' | 'druk' | 'tijdelijk', bericht: string) {
    super(bericht);
  }
}

async function haalTokens(body: Record<string, string>, haal: Haal, nu: () => number): Promise<Tokens> {
  const res = await haal(TOKEN_URL, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(body).toString(),
  });
  if (!res.ok) {
    const soort = isDruk(res) ? 'druk' : res.status >= 400 && res.status < 500 ? 'afgewezen' : 'tijdelijk';
    throw new TokenFout(soort, `GitHub gaf status ${res.status} bij het wisselen van tokens`);
  }
  const data = (await res.json()) as Record<string, unknown>;
  // GitHub meldt fouten als status 200 met een veld error.
  if (typeof data.error === 'string') throw new TokenFout('afgewezen', `GitHub weigerde de token: ${data.error}`);
  if (typeof data.access_token !== 'string' || typeof data.refresh_token !== 'string') {
    throw new TokenFout('tijdelijk', 'GitHub gaf geen token terug');
  }
  // Zonder expires_in staan verlopende tokens uit; reken dan met de standaard van 8 uur.
  const geldig = typeof data.expires_in === 'number' ? data.expires_in * 1000 : STANDAARD_GELDIG;
  return { token: data.access_token, refresh: data.refresh_token, verloopt: nu() + geldig };
}

export function wisselCode(code: string, redirectUri: string, o: Omgeving, haal: Haal, nu: () => number = Date.now): Promise<Tokens> {
  return haalTokens({ client_id: o.clientId, client_secret: o.clientSecret, code, redirect_uri: redirectUri }, haal, nu);
}

// Een refresh-token werkt één keer; bewaar de nieuwe uit het antwoord.
export function vernieuwToken(refresh: string, o: Omgeving, haal: Haal, nu: () => number = Date.now): Promise<Tokens> {
  return haalTokens(
    { client_id: o.clientId, client_secret: o.clientSecret, grant_type: 'refresh_token', refresh_token: refresh },
    haal,
    nu,
  );
}

export function ghApi(token: string, haal: Haal): Api {
  return (pad, init = {}) => {
    const headers = new Headers(init.headers);
    headers.set('Authorization', `Bearer ${token}`);
    headers.set('Accept', 'application/vnd.github+json');
    headers.set('X-GitHub-Api-Version', '2022-11-28');
    headers.set('User-Agent', 'ondernemen-met-ai');
    return haal(pad.startsWith('/') ? `${API_URL}${pad}` : pad, { ...init, headers });
  };
}

export function json(data: unknown, status = 200, headers?: HeadersInit): Response {
  const h = new Headers(headers);
  h.set('Content-Type', 'application/json');
  return new Response(JSON.stringify(data), { status, headers: h });
}

export function origineKlopt(req: Request): boolean {
  const origin = req.headers.get('origin');
  return origin !== null && origin === new URL(req.url).origin;
}

export function isDruk(res: Response): boolean {
  return res.status === 429 || (res.status === 403 && res.headers.get('x-ratelimit-remaining') === '0');
}

function metCookie(res: Response, cookie: string): Response {
  const headers = new Headers(res.headers);
  headers.append('Set-Cookie', cookie);
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}

export async function metSessie(
  req: Request,
  o: Omgeving,
  haal: Haal,
  doe: (s: Sessie, api: Api) => Promise<{ antwoord: Response; sessie?: Sessie }>,
  nu: () => number = Date.now,
): Promise<Response> {
  const waarde = leesCookie(req, SESSIE_COOKIE);
  const huidig = waarde ? await open(waarde, o.sessieSleutel) : null;
  if (!huidig) return json({ fout: 'uit' }, 401);

  let sessie = huidig;
  let vernieuwd = false;
  if (sessie.verloopt - nu() < VERNIEUW_MARGE) {
    try {
      sessie = { ...sessie, ...(await vernieuwToken(sessie.refresh, o, haal, nu)) };
      vernieuwd = true;
    } catch (e) {
      const soort = e instanceof TokenFout ? e.soort : 'tijdelijk';
      // Alleen bij een definitieve afwijzing uitloggen; bij een tijdelijke fout blijft het cookie staan.
      if (soort === 'afgewezen') return json({ fout: 'uit' }, 401, { 'Set-Cookie': wisCookie(req, SESSIE_COOKIE) });
      if (soort === 'druk') return json({ fout: 'druk' }, 429);
      return json({ fout: 'github' }, 502);
    }
  }

  let uitkomst: { antwoord: Response; sessie?: Sessie };
  try {
    uitkomst = await doe(sessie, ghApi(sessie.token, haal));
  } catch {
    // De oude refresh-token is al verbruikt: schrijf de nieuwe weg, anders raakt de deelnemer uitgelogd.
    const fout = json({ fout: 'github' }, 502);
    return vernieuwd ? metCookie(fout, zetCookie(req, SESSIE_COOKIE, await sluit(sessie, o.sessieSleutel), ZES_MAANDEN)) : fout;
  }
  const { antwoord, sessie: nieuw } = uitkomst;
  const laatste = nieuw ?? (vernieuwd ? sessie : null);
  if (!laatste) return antwoord;
  return metCookie(antwoord, zetCookie(req, SESSIE_COOKIE, await sluit(laatste, o.sessieSleutel), ZES_MAANDEN));
}
