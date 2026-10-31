import { describe, expect, it } from 'vitest';
import { json } from '../lib/github';
import { SESSIE_COOKIE, STATE_COOKIE, TERUG_COOKIE, UITGELOGD_COOKIE, open, sluit, type Sessie } from '../lib/sessie';
import type { Deps } from '../lib/deps';
import { verwerk as koppel } from '../functions/koppel';
import { verwerk as login } from '../functions/login';
import { verwerk as callback } from '../functions/callback';
import { verwerk as sessie } from '../functions/sessie';
import { verwerk as repoKiezen } from '../functions/repo-kiezen';
import { verwerk as uitloggen } from '../functions/uitloggen';

const sleutel = Buffer.alloc(32, 9).toString('base64');
const env = {
  GITHUB_CLIENT_ID: 'Iv1.test',
  GITHUB_CLIENT_SECRET: 'geheim',
  GITHUB_APP_SLUG: 'ondernemen-met-ai',
  SESSIE_SLEUTEL: sleutel,
};
const NU = 1_000_000;
const BASIS = 'http://localhost:8888';

type Aanroep = { url: string; method: string; body: string; auth: string | null };

// Nep-fetch die op URL routeert en bijhoudt wat er is aangeroepen.
function nep(opties: { repos?: string[]; tokenOk?: boolean; token?: Response; api401?: boolean; intrekken?: Response | 'stuk' } = {}) {
  const repos = opties.repos ?? ['harmen/mijn-onderneming'];
  const aanroepen: Aanroep[] = [];
  const haal = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    aanroepen.push({ url, method: init?.method ?? 'GET', body: typeof init?.body === 'string' ? init.body : '', auth: new Headers(init?.headers).get('authorization') });
    if (url === 'https://github.com/login/oauth/access_token') {
      if (opties.token) return opties.token;
      if (opties.tokenOk === false) return json({ error: 'bad_verification_code' });
      return json({ access_token: 'ghu_a', refresh_token: 'ghr_a', expires_in: 28800 });
    }
    if (url === 'https://api.github.com/applications/Iv1.test/token') {
      if (opties.intrekken === 'stuk') throw new TypeError('netwerk');
      return opties.intrekken ?? new Response(null, { status: 204 });
    }
    if (opties.api401 && url.startsWith('https://api.github.com/')) return json({ message: 'Bad credentials' }, 401);
    if (url === 'https://api.github.com/user') return json({ login: 'harmen' });
    if (url === 'https://api.github.com/user/installations?per_page=100') {
      return json({ installations: [{ id: 7 }] });
    }
    if (url === 'https://api.github.com/user/installations/7/repositories?per_page=100') {
      return json({ repositories: repos.map((full_name) => ({ full_name })) });
    }
    return json({ message: 'onbekend' }, 404);
  }) as typeof fetch;
  const deps: Deps = { haal, env, nu: () => NU, willekeurig: () => 'state-123' };
  return { deps, aanroepen };
}

const verzoek = (pad: string, init: RequestInit = {}) => new Request(`${BASIS}${pad}`, init);
const metCookie = (pad: string, cookie: string, init: RequestInit = {}) =>
  verzoek(pad, { ...init, headers: { cookie, ...(init.headers as Record<string, string>) } });
const post = (pad: string, body: unknown, cookie = '', origin: string | null = BASIS) =>
  verzoek(pad, {
    method: 'POST',
    headers: { ...(cookie ? { cookie } : {}), ...(origin ? { origin } : {}), 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

const gesloten = (s: Partial<Sessie> = {}) =>
  sluit({ token: 'ghu_t', refresh: 'ghr_t', verloopt: NU + 3_600_000, login: 'harmen', repo: null, ...s }, sleutel);
const cookieVan = (res: Response, naam: string) => {
  const regel = res.headers.getSetCookie().find((c) => c.startsWith(`${naam}=`));
  return regel ?? null;
};
const waardeVan = (regel: string | null) => (regel ? regel.split(';')[0].split('=')[1] : null);

describe('koppel', () => {
  it('stuurt door naar de installatiepagina en onthoudt #/level/0', async () => {
    const { deps } = nep();
    const res = await koppel(verzoek('/api/koppel?terug=%23%2Flevel%2F0'), deps);
    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toBe('https://github.com/apps/ondernemen-met-ai/installations/new');
    expect(cookieVan(res, TERUG_COOKIE)).toContain('Max-Age=600');
    expect(decodeURIComponent(waardeVan(cookieVan(res, TERUG_COOKIE))!)).toBe('#/level/0');
  });

  it('onthoudt geen terug buiten de site', async () => {
    const { deps } = nep();
    const res = await koppel(verzoek('/api/koppel?terug=https%3A%2F%2Fevil.example'), deps);
    expect(res.status).toBe(302);
    expect(cookieVan(res, TERUG_COOKIE)).toBeNull();
  });
});

describe('login', () => {
  it('stuurt door naar authorize en zet oma_state', async () => {
    const { deps } = nep();
    const res = await login(verzoek('/api/login'), deps);
    expect(res.status).toBe(302);
    const loc = res.headers.get('location')!;
    expect(loc).toContain('https://github.com/login/oauth/authorize?');
    expect(loc).toContain('client_id=Iv1.test');
    expect(loc).toContain('state=state-123');
    expect(loc).toContain('redirect_uri=http%3A%2F%2Flocalhost%3A8888%2Fapi%2Fcallback');
    expect(waardeVan(cookieVan(res, STATE_COOKIE))).toBe('state-123');
    expect(cookieVan(res, STATE_COOKIE)).toContain('Max-Age=600');
  });

  it('zet oma_terug alleen bij een geldige terug en wist een bestaande niet', async () => {
    const { deps } = nep();
    const goed = await login(verzoek('/api/login?terug=%23%2Froute'), deps);
    expect(decodeURIComponent(waardeVan(cookieVan(goed, TERUG_COOKIE))!)).toBe('#/route');
    const fout = await login(metCookie('/api/login?terug=http%3A%2F%2Fevil', `${TERUG_COOKIE}=x`), deps);
    expect(cookieVan(fout, TERUG_COOKIE)).toBeNull();
    const zonder = await login(metCookie('/api/login', `${TERUG_COOKIE}=x`), deps);
    expect(cookieVan(zonder, TERUG_COOKIE)).toBeNull();
  });

  it('vraagt na uitloggen eerst welk GitHub-account, anders niet', async () => {
    const { deps } = nep();
    const na = await login(metCookie('/api/login', `${UITGELOGD_COOKIE}=1`), deps);
    expect(new URL(na.headers.get('location')!).searchParams.get('prompt')).toBe('select_account');
    const gewoon = await login(verzoek('/api/login'), deps);
    expect(new URL(gewoon.headers.get('location')!).searchParams.get('prompt')).toBeNull();
  });
});

describe('callback', () => {
  const MET_STATE = `${STATE_COOKIE}=state-123`;

  it('zonder state stuurt hij door naar /api/login', async () => {
    const { deps, aanroepen } = nep();
    const res = await callback(metCookie('/api/callback?code=abc', `${MET_STATE}; ${TERUG_COOKIE}=${encodeURIComponent('#/level/0')}`), deps);
    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toBe('/api/login');
    expect(cookieVan(res, TERUG_COOKIE)).toBeNull();
    expect(aanroepen).toHaveLength(0);
  });

  it('met een andere state, een lege state of zonder oma_state stuurt hij ook door', async () => {
    const { deps, aanroepen } = nep();
    const andere = await callback(metCookie('/api/callback?code=abc&state=anders', MET_STATE), deps);
    expect(andere.headers.get('location')).toBe('/api/login');
    const leeg = await callback(metCookie('/api/callback?code=abc&state=', `${STATE_COOKIE}=`), deps);
    expect(leeg.headers.get('location')).toBe('/api/login');
    const zonderCookie = await callback(verzoek('/api/callback?code=abc&state=state-123'), deps);
    expect(zonderCookie.headers.get('location')).toBe('/api/login');
    expect(aanroepen).toHaveLength(0);
  });

  it('met één repo kiest hij die en stuurt terug naar #/level/0', async () => {
    const { deps, aanroepen } = nep();
    const res = await callback(
      metCookie('/api/callback?code=abc&state=state-123', `${MET_STATE}; ${TERUG_COOKIE}=${encodeURIComponent('#/level/0')}`),
      deps,
    );
    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toBe('/#/level/0');
    const s = await open(waardeVan(cookieVan(res, SESSIE_COOKIE))!, sleutel);
    expect(s?.repo).toBe('harmen/mijn-onderneming');
    expect(s?.login).toBe('harmen');
    expect(s?.verloopt).toBe(NU + 28_800_000);
    expect(cookieVan(res, STATE_COOKIE)).toContain('Max-Age=0');
    expect(cookieVan(res, TERUG_COOKIE)).toContain('Max-Age=0');
    expect(cookieVan(res, UITGELOGD_COOKIE)).toContain('Max-Age=0');
    const wissel = aanroepen.find((a) => a.url.endsWith('/access_token'))!;
    expect(wissel.body).toContain('redirect_uri=http%3A%2F%2Flocalhost%3A8888%2Fapi%2Fcallback');
  });

  it('zonder terug gaat hij naar /#/route', async () => {
    const { deps } = nep();
    const res = await callback(metCookie('/api/callback?code=abc&state=state-123', MET_STATE), deps);
    expect(res.headers.get('location')).toBe('/#/route');
  });

  it("met twee repo's laat hij de keuze open", async () => {
    const { deps } = nep({ repos: ['harmen/b', 'harmen/a'] });
    const res = await callback(metCookie('/api/callback?code=abc&state=state-123', MET_STATE), deps);
    const s = await open(waardeVan(cookieVan(res, SESSIE_COOKIE))!, sleutel);
    expect(s?.repo).toBeNull();
  });

  it('stuurt naar /?fout=inloggen#/route als de code niet te wisselen is', async () => {
    const { deps } = nep({ tokenOk: false });
    const res = await callback(metCookie('/api/callback?code=abc&state=state-123', MET_STATE), deps);
    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toBe('/?fout=inloggen#/route');
    expect(cookieVan(res, SESSIE_COOKIE)).toBeNull();
  });

  it('stuurt naar /?fout=inloggen#/route als de repo-lijst niet lukt', async () => {
    const { deps } = nep();
    const kapot = (async (input: RequestInfo | URL, init?: RequestInit) =>
      String(input).includes('/installations?') ? json({}, 500) : deps.haal(input, init)) as typeof fetch;
    const res = await callback(metCookie('/api/callback?code=abc&state=state-123', MET_STATE), { ...deps, haal: kapot });
    expect(res.headers.get('location')).toBe('/?fout=inloggen#/route');
  });
});

describe('sessie', () => {
  it('geeft uit zonder cookie en bij een kapot cookie', async () => {
    const { deps } = nep();
    const res = await sessie(verzoek('/api/sessie'), deps);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ stand: 'uit' });
    const kapot = await sessie(metCookie('/api/sessie', `${SESSIE_COOKIE}=kapot`), deps);
    expect(await kapot.json()).toEqual({ stand: 'uit' });
  });

  it('geeft gekoppeld zonder GitHub aan te roepen', async () => {
    const { deps, aanroepen } = nep();
    const c = await gesloten({ repo: 'harmen/mijn-onderneming' });
    const res = await sessie(metCookie('/api/sessie', `${SESSIE_COOKIE}=${c}`), deps);
    expect(await res.json()).toEqual({ stand: 'gekoppeld', login: 'harmen', repo: 'harmen/mijn-onderneming' });
    expect(aanroepen).toHaveLength(0);
  });

  it('geeft kies-repo met de lijst zonder repo', async () => {
    const { deps } = nep({ repos: ['harmen/b', 'harmen/a'] });
    const c = await gesloten();
    const res = await sessie(metCookie('/api/sessie', `${SESSIE_COOKIE}=${c}`), deps);
    const tekst = await res.text();
    expect(JSON.parse(tekst)).toEqual({ stand: 'kies-repo', login: 'harmen', repos: ['harmen/a', 'harmen/b'] });
    expect(tekst).not.toContain('ghu_');
  });

  it('geeft uit zonder het cookie aan te raken als de refresh wordt afgewezen', async () => {
    const { deps } = nep({ tokenOk: false });
    const c = await gesloten({ verloopt: NU });
    const res = await sessie(metCookie('/api/sessie', `${SESSIE_COOKIE}=${c}`), deps);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ stand: 'uit' });
    expect(res.headers.get('set-cookie')).toBeNull();
  });

  it('geeft uit en wist het cookie als GitHub de token weigert', async () => {
    const { deps } = nep({ api401: true });
    const c = await gesloten();
    const res = await sessie(metCookie('/api/sessie', `${SESSIE_COOKIE}=${c}`), deps);
    expect(await res.json()).toEqual({ stand: 'uit' });
    expect(cookieVan(res, SESSIE_COOKIE)).toContain('Max-Age=0');
  });

  it('kiest zelf de repo als er precies één is, zodat opnieuw koppelen niet vastloopt', async () => {
    const { deps } = nep({ repos: ['harmen/nieuwe-naam'] });
    const c = await gesloten();
    const res = await sessie(metCookie('/api/sessie', `${SESSIE_COOKIE}=${c}`), deps);
    expect(await res.json()).toEqual({ stand: 'gekoppeld', login: 'harmen', repo: 'harmen/nieuwe-naam' });
    const s = await open(waardeVan(cookieVan(res, SESSIE_COOKIE))!, sleutel);
    expect(s?.repo).toBe('harmen/nieuwe-naam');
  });

  it('geeft een tijdelijke fout door', async () => {
    const { deps } = nep({ token: json({}, 503) });
    const c = await gesloten({ verloopt: NU });
    const res = await sessie(metCookie('/api/sessie', `${SESSIE_COOKIE}=${c}`), deps);
    expect(res.status).toBe(502);
  });
});

describe('repo-kiezen', () => {
  it('bewaart een repo uit de installatie en geeft 204 met nieuw cookie', async () => {
    const { deps } = nep({ repos: ['harmen/b', 'harmen/a'] });
    const c = await gesloten();
    const res = await repoKiezen(post('/api/repo-kiezen', { repo: 'harmen/a' }, `${SESSIE_COOKIE}=${c}`), deps);
    expect(res.status).toBe(204);
    const s = await open(waardeVan(cookieVan(res, SESSIE_COOKIE))!, sleutel);
    expect(s?.repo).toBe('harmen/a');
  });

  it('weigert een repo buiten de installatie (400) en een andere Origin (403)', async () => {
    const { deps } = nep();
    const c = await gesloten();
    const buiten = await repoKiezen(post('/api/repo-kiezen', { repo: 'iemand/anders' }, `${SESSIE_COOKIE}=${c}`), deps);
    expect(buiten.status).toBe(400);
    expect(cookieVan(buiten, SESSIE_COOKIE)).toBeNull();
    const vreemd = await repoKiezen(post('/api/repo-kiezen', { repo: 'harmen/mijn-onderneming' }, `${SESSIE_COOKIE}=${c}`, 'https://evil.example'), deps);
    expect(vreemd.status).toBe(403);
    const zonderOrigin = await repoKiezen(post('/api/repo-kiezen', { repo: 'harmen/mijn-onderneming' }, `${SESSIE_COOKIE}=${c}`, null), deps);
    expect(zonderOrigin.status).toBe(403);
  });

  it('weigert een ontbrekende of niet-tekst repo (400), geen sessie (401) en GET (405)', async () => {
    const { deps } = nep();
    const c = await gesloten();
    expect((await repoKiezen(post('/api/repo-kiezen', {}, `${SESSIE_COOKIE}=${c}`), deps)).status).toBe(400);
    expect((await repoKiezen(post('/api/repo-kiezen', { repo: 5 }, `${SESSIE_COOKIE}=${c}`), deps)).status).toBe(400);
    expect((await repoKiezen(post('/api/repo-kiezen', { repo: 'harmen/mijn-onderneming' }), deps)).status).toBe(401);
    expect((await repoKiezen(verzoek('/api/repo-kiezen'), deps)).status).toBe(405);
  });
});

describe('uitloggen', () => {
  it('wist oma_sessie', async () => {
    const { deps, aanroepen } = nep();
    const res = await uitloggen(post('/api/uitloggen', {}), deps);
    expect(res.status).toBe(204);
    expect(cookieVan(res, SESSIE_COOKIE)).toContain('Max-Age=0');
    expect(aanroepen).toHaveLength(0);
  });

  it('trekt de token in bij GitHub en laat de volgende login een account kiezen', async () => {
    const { deps, aanroepen } = nep();
    const c = await gesloten();
    const res = await uitloggen(post('/api/uitloggen', {}, `${SESSIE_COOKIE}=${c}`), deps);
    expect(res.status).toBe(204);
    expect(cookieVan(res, SESSIE_COOKIE)).toContain('Max-Age=0');
    expect(waardeVan(cookieVan(res, UITGELOGD_COOKIE))).toBe('1');
    expect(aanroepen).toHaveLength(1);
    expect(aanroepen[0]).toMatchObject({ url: 'https://api.github.com/applications/Iv1.test/token', method: 'DELETE' });
    expect(aanroepen[0].auth).toBe(`Basic ${Buffer.from('Iv1.test:geheim').toString('base64')}`);
    expect(JSON.parse(aanroepen[0].body)).toEqual({ access_token: 'ghu_t' });
  });

  it('logt ook uit als intrekken mislukt', async () => {
    for (const intrekken of ['stuk', json({}, 500)] as const) {
      const { deps } = nep({ intrekken });
      const res = await uitloggen(post('/api/uitloggen', {}, `${SESSIE_COOKIE}=${await gesloten()}`), deps);
      expect(res.status).toBe(204);
      expect(cookieVan(res, SESSIE_COOKIE)).toContain('Max-Age=0');
    }
  });

  it('weigert een andere Origin (403) en GET (405)', async () => {
    const { deps } = nep();
    expect((await uitloggen(post('/api/uitloggen', {}, '', 'https://evil.example'), deps)).status).toBe(403);
    expect((await uitloggen(verzoek('/api/uitloggen'), deps)).status).toBe(405);
  });
});
