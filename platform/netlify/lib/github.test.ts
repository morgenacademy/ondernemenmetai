import { describe, expect, it } from 'vitest';
import { ghApi, isDruk, json, metSessie, origineKlopt, vernieuwToken, wisselCode, type Haal } from './github';
import { SESSIE_COOKIE, open, sluit, type Sessie } from './sessie';
import type { Omgeving } from './omgeving';

const sleutel = Buffer.alloc(32, 7).toString('base64');
const o: Omgeving = { clientId: 'cid', clientSecret: 'csecret', appSlug: 'app', sessieSleutel: sleutel };
const nu = () => 1_000_000;

type Aanroep = { url: string; method: string; headers: Headers; body: string };

function nepHaal(antwoorden: Array<Response | (() => Response)>) {
  const aanroepen: Aanroep[] = [];
  const haal = (async (input: RequestInfo | URL, init?: RequestInit) => {
    aanroepen.push({
      url: String(input),
      method: init?.method ?? 'GET',
      headers: new Headers(init?.headers),
      body: typeof init?.body === 'string' ? init.body : String(init?.body ?? ''),
    });
    const volgende = antwoorden.shift();
    if (!volgende) throw new Error('geen antwoord meer klaar');
    return typeof volgende === 'function' ? volgende() : volgende;
  }) as Haal;
  return { haal, aanroepen };
}

const tokenAntwoord = (extra: Record<string, unknown> = {}) =>
  json({ access_token: 'ghu_nieuw', refresh_token: 'ghr_nieuw', expires_in: 28800, ...extra });

const sessie: Sessie = { token: 'ghu_oud', refresh: 'ghr_oud', verloopt: nu() + 3_600_000, login: 'deelnemer', repo: 'deelnemer/mijn-repo' };

async function verzoek(s: Sessie | null, url = 'https://platform.test/api/x'): Promise<Request> {
  const headers: Record<string, string> = {};
  if (s) headers.cookie = `${SESSIE_COOKIE}=${await sluit(s, sleutel)}`;
  return new Request(url, { headers });
}

function sessieUitCookie(res: Response): Promise<Sessie | null> {
  const c = res.headers.get('set-cookie') ?? '';
  const m = c.match(/^oma_sessie=([^;]*)/);
  return open(m ? m[1] : '', sleutel);
}

describe('wisselCode', () => {
  it('post client_id, client_secret, code en redirect_uri en rekent verloopt uit', async () => {
    const { haal, aanroepen } = nepHaal([tokenAntwoord()]);
    const t = await wisselCode('de-code', 'https://platform.test/api/inloggen', o, haal, nu);
    expect(t).toEqual({ token: 'ghu_nieuw', refresh: 'ghr_nieuw', verloopt: 1_000_000 + 28_800_000 });
    expect(aanroepen).toHaveLength(1);
    const a = aanroepen[0];
    expect(a.url).toBe('https://github.com/login/oauth/access_token');
    expect(a.method).toBe('POST');
    expect(a.headers.get('accept')).toBe('application/json');
    const body = new URLSearchParams(a.body);
    expect(body.get('client_id')).toBe('cid');
    expect(body.get('client_secret')).toBe('csecret');
    expect(body.get('code')).toBe('de-code');
    expect(body.get('redirect_uri')).toBe('https://platform.test/api/inloggen');
  });

  it('gooit bij status 200 met een error-veld, zonder code of secret in de melding', async () => {
    const { haal } = nepHaal([json({ error: 'bad_verification_code', error_description: 'x' })]);
    const fout = await wisselCode('geheime-code', 'https://platform.test/cb', o, haal, nu).catch((e: Error) => e);
    expect(fout).toBeInstanceOf(Error);
    expect((fout as Error).message).toContain('bad_verification_code');
    expect((fout as Error).message).not.toContain('geheime-code');
    expect((fout as Error).message).not.toContain('csecret');
  });

  it('gooit bij een niet-2xx status en bij een ontbrekende access_token', async () => {
    const a = nepHaal([new Response('nee', { status: 500 })]);
    await expect(wisselCode('c', 'r', o, a.haal, nu)).rejects.toThrow();
    const b = nepHaal([json({ refresh_token: 'x' })]);
    await expect(wisselCode('c', 'r', o, b.haal, nu)).rejects.toThrow();
  });

  it('valt terug op 8 uur als expires_in ontbreekt', async () => {
    const { haal } = nepHaal([json({ access_token: 'a', refresh_token: 'r' })]);
    expect((await wisselCode('c', 'r', o, haal, nu)).verloopt).toBe(1_000_000 + 8 * 3_600_000);
  });
});

describe('vernieuwToken', () => {
  it('post grant_type=refresh_token en geeft de nieuwe refresh-token terug', async () => {
    const { haal, aanroepen } = nepHaal([tokenAntwoord()]);
    const t = await vernieuwToken('ghr_oud', o, haal, nu);
    expect(t.refresh).toBe('ghr_nieuw');
    const body = new URLSearchParams(aanroepen[0].body);
    expect(body.get('grant_type')).toBe('refresh_token');
    expect(body.get('refresh_token')).toBe('ghr_oud');
    expect(body.get('client_id')).toBe('cid');
    expect(body.get('client_secret')).toBe('csecret');
  });
});

describe('ghApi', () => {
  it('zet de vier headers en voegt api.github.com voor een pad', async () => {
    const { haal, aanroepen } = nepHaal([json({})]);
    await ghApi('ghu_x', haal)('/user');
    expect(aanroepen[0].url).toBe('https://api.github.com/user');
    expect(aanroepen[0].headers.get('authorization')).toBe('Bearer ghu_x');
    expect(aanroepen[0].headers.get('accept')).toBe('application/vnd.github+json');
    expect(aanroepen[0].headers.get('x-github-api-version')).toBe('2022-11-28');
    expect(aanroepen[0].headers.get('user-agent')).toBe('ondernemen-met-ai');
  });

  it('gebruikt een volledige URL zoals die is en behoudt eigen headers en methode', async () => {
    const { haal, aanroepen } = nepHaal([json({})]);
    await ghApi('t', haal)('https://api.github.com/graphql', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    expect(aanroepen[0].url).toBe('https://api.github.com/graphql');
    expect(aanroepen[0].method).toBe('POST');
    expect(aanroepen[0].headers.get('content-type')).toBe('application/json');
    expect(aanroepen[0].headers.get('authorization')).toBe('Bearer t');
  });
});

describe('json', () => {
  it('zet status en Content-Type', async () => {
    const r = json({ a: 1 }, 201, { 'X-Test': '1' });
    expect(r.status).toBe(201);
    expect(r.headers.get('content-type')).toBe('application/json');
    expect(r.headers.get('x-test')).toBe('1');
    expect(await r.json()).toEqual({ a: 1 });
  });
});

describe('origineKlopt', () => {
  it('klopt bij gelijke Origin, niet bij een andere of ontbrekende', () => {
    const url = 'https://platform.test/api/x';
    expect(origineKlopt(new Request(url, { headers: { origin: 'https://platform.test' } }))).toBe(true);
    expect(origineKlopt(new Request(url, { headers: { origin: 'https://kwaad.test' } }))).toBe(false);
    expect(origineKlopt(new Request(url))).toBe(false);
  });
});

describe('isDruk', () => {
  it('herkent 429 en 403 met x-ratelimit-remaining 0, maar geen gewone 403', () => {
    expect(isDruk(new Response('', { status: 429 }))).toBe(true);
    expect(isDruk(new Response('', { status: 403, headers: { 'x-ratelimit-remaining': '0' } }))).toBe(true);
    expect(isDruk(new Response('', { status: 403 }))).toBe(false);
    expect(isDruk(new Response('', { status: 200, headers: { 'x-ratelimit-remaining': '0' } }))).toBe(false);
  });
});

describe('metSessie', () => {
  it('geeft 401 en roept doe niet aan zonder cookie', async () => {
    let geroepen = false;
    const { haal } = nepHaal([]);
    const res = await metSessie(await verzoek(null), o, haal, async () => { geroepen = true; return { antwoord: json({}) }; }, nu);
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ fout: 'uit' });
    expect(geroepen).toBe(false);
  });

  it('geeft 401 bij een ongeldig cookie', async () => {
    const { haal } = nepHaal([]);
    const req = new Request('https://platform.test/api/x', { headers: { cookie: `${SESSIE_COOKIE}=rommel` } });
    const res = await metSessie(req, o, haal, async () => ({ antwoord: json({}) }), nu);
    expect(res.status).toBe(401);
  });

  it('roept doe aan zonder vernieuwen of cookie als de token nog lang geldig is', async () => {
    const { haal, aanroepen } = nepHaal([]);
    const res = await metSessie(await verzoek(sessie), o, haal, async (s, api) => {
      expect(s).toEqual(sessie);
      expect(typeof api).toBe('function');
      return { antwoord: json({ ok: true }) };
    }, nu);
    expect(res.status).toBe(200);
    expect(res.headers.get('set-cookie')).toBeNull();
    expect(aanroepen).toHaveLength(0);
  });

  it('vernieuwt een token die over 30 seconden verloopt en zet het nieuwe cookie', async () => {
    const { haal, aanroepen } = nepHaal([tokenAntwoord()]);
    const bijna: Sessie = { ...sessie, verloopt: nu() + 30_000 };
    let kreeg: Sessie | null = null;
    const res = await metSessie(await verzoek(bijna), o, haal, async (s) => {
      kreeg = s;
      return { antwoord: new Response('hoi', { status: 200, headers: { Location: '/ergens' } }) };
    }, nu);
    expect(aanroepen).toHaveLength(1);
    expect(aanroepen[0].url).toBe('https://github.com/login/oauth/access_token');
    expect(new URLSearchParams(aanroepen[0].body).get('grant_type')).toBe('refresh_token');
    expect(res.headers.get('set-cookie')).toContain('oma_sessie=');
    expect(res.headers.get('location')).toBe('/ergens');
    expect(await res.text()).toBe('hoi');
    expect(kreeg).toMatchObject({ token: 'ghu_nieuw', login: 'deelnemer', repo: 'deelnemer/mijn-repo' });
    expect(await sessieUitCookie(res)).toEqual({ token: 'ghu_nieuw', refresh: 'ghr_nieuw', verloopt: 1_000_000 + 28_800_000, login: 'deelnemer', repo: 'deelnemer/mijn-repo' });
  });

  it('geeft 401 en wist het cookie als vernieuwen mislukt, zonder doe aan te roepen', async () => {
    const { haal } = nepHaal([json({ error: 'bad_refresh_token' })]);
    let geroepen = false;
    const res = await metSessie(await verzoek({ ...sessie, verloopt: nu() + 10_000 }), o, haal, async () => { geroepen = true; return { antwoord: json({}) }; }, nu);
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ fout: 'uit' });
    expect(res.headers.get('set-cookie')).toMatch(/^oma_sessie=;.*Max-Age=0/);
    expect(geroepen).toBe(false);
  });

  it('zet een nieuw cookie als doe een sessie teruggeeft', async () => {
    const { haal } = nepHaal([]);
    const res = await metSessie(await verzoek(sessie), o, haal, async (s) => ({ antwoord: json({ ok: 1 }), sessie: { ...s, repo: 'deelnemer/andere' } }), nu);
    expect((await sessieUitCookie(res))?.repo).toBe('deelnemer/andere');
    expect(res.headers.get('content-type')).toBe('application/json');
  });

  it('geeft na vernieuwen de sessie van doe voorrang in het cookie', async () => {
    const { haal } = nepHaal([tokenAntwoord()]);
    const res = await metSessie(await verzoek({ ...sessie, verloopt: nu() + 1_000 }), o, haal, async (s) => ({ antwoord: json({}), sessie: { ...s, repo: null } }), nu);
    const uit = await sessieUitCookie(res);
    expect(uit?.repo).toBeNull();
    expect(uit?.token).toBe('ghu_nieuw');
  });

  it('laat het cookie staan en geeft 502 bij een netwerkfout tijdens vernieuwen', async () => {
    const haal = (async () => { throw new TypeError('netwerk'); }) as Haal;
    const res = await metSessie(await verzoek({ ...sessie, verloopt: nu() + 10_000 }), o, haal, async () => ({ antwoord: json({}) }), nu);
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ fout: 'github' });
    expect(res.headers.get('set-cookie')).toBeNull();
  });

  it('geeft 502 zonder cookie te wissen bij een 5xx tijdens vernieuwen', async () => {
    const { haal } = nepHaal([new Response('stuk', { status: 503 })]);
    const res = await metSessie(await verzoek({ ...sessie, verloopt: nu() + 10_000 }), o, haal, async () => ({ antwoord: json({}) }), nu);
    expect(res.status).toBe(502);
    expect(res.headers.get('set-cookie')).toBeNull();
  });

  it('geeft 429 druk zonder cookie te wissen bij een rate limit tijdens vernieuwen', async () => {
    const { haal } = nepHaal([new Response('', { status: 429 })]);
    const res = await metSessie(await verzoek({ ...sessie, verloopt: nu() + 10_000 }), o, haal, async () => ({ antwoord: json({}) }), nu);
    expect(res.status).toBe(429);
    expect(await res.json()).toEqual({ fout: 'druk' });
    expect(res.headers.get('set-cookie')).toBeNull();
  });

  it('bewaart de vernieuwde sessie als doe na het vernieuwen gooit', async () => {
    const { haal } = nepHaal([tokenAntwoord()]);
    const res = await metSessie(await verzoek({ ...sessie, verloopt: nu() + 30_000 }), o, haal, async () => { throw new Error('boem'); }, nu);
    expect(res.status).toBe(502);
    expect((await sessieUitCookie(res))?.refresh).toBe('ghr_nieuw');
  });

  it('zet geen cookie als doe gooit zonder dat er vernieuwd is', async () => {
    const { haal } = nepHaal([]);
    const res = await metSessie(await verzoek(sessie), o, haal, async () => { throw new Error('boem'); }, nu);
    expect(res.status).toBe(502);
    expect(res.headers.get('set-cookie')).toBeNull();
  });
});
