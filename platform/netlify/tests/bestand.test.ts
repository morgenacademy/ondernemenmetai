import { describe, expect, it } from 'vitest';
import { json } from '../lib/github';
import { SESSIE_COOKIE, open, sluit, type Sessie } from '../lib/sessie';
import type { Deps } from '../lib/deps';
import { verwerk as bestand } from '../functions/bestand';

const sleutel = Buffer.alloc(32, 9).toString('base64');
const env = { GITHUB_CLIENT_ID: 'Iv1.test', GITHUB_CLIENT_SECRET: 'geheim', GITHUB_APP_SLUG: 'ondernemen-met-ai', SESSIE_SLEUTEL: sleutel };
const NU = 1_000_000;

const gesloten = (s: Partial<Sessie> = {}) =>
  sluit({ token: 'ghu_t', refresh: 'ghr_t', verloopt: NU + 3_600_000, login: 'harmen', repo: 'harmen/mijn-onderneming', ...s }, sleutel);

function maak(antwoorden: (() => Response)[]) {
  const aanroepen: { url: string; methode: string }[] = [];
  const haal = (async (input: RequestInfo | URL, init?: RequestInit) => {
    aanroepen.push({ url: String(input), methode: init?.method ?? 'GET' });
    return antwoorden[Math.min(aanroepen.length - 1, antwoorden.length - 1)]();
  }) as typeof fetch;
  const deps: Deps = { haal, env, nu: () => NU };
  return { deps, aanroepen };
}

const GELDIG = { path: 'level-1-idee/idee.md', content: 'hoi', message: 'Idee opgeslagen' };

async function vraag(deps: Deps, body: unknown = GELDIG, opties: { s?: Partial<Sessie>; method?: string; origin?: string | null } = {}) {
  const headers: Record<string, string> = { cookie: `${SESSIE_COOKIE}=${await gesloten(opties.s)}`, 'content-type': 'application/json' };
  const origin = opties.origin === undefined ? 'http://localhost:8888' : opties.origin;
  if (origin) headers.origin = origin;
  return bestand(
    new Request('http://localhost:8888/api/bestand', {
      method: opties.method ?? 'POST',
      headers,
      body: opties.method === 'GET' ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
    }),
    deps,
  );
}

const repoOk = () => json({ default_branch: 'main' });
const nieuw = () => json({}, 404);

describe('bestand', () => {
  it('weigert iets anders dan POST (405)', async () => {
    const { deps, aanroepen } = maak([() => json({})]);
    expect((await vraag(deps, GELDIG, { method: 'GET' })).status).toBe(405);
    expect(aanroepen).toHaveLength(0);
  });

  it('weigert een andere Origin (403) en een ongeldige body of pad (400), zonder fetch aan te roepen', async () => {
    const { deps, aanroepen } = maak([() => json({})]);
    expect((await vraag(deps, GELDIG, { origin: 'https://kwaad.example' })).status).toBe(403);
    expect((await vraag(deps, GELDIG, { origin: null })).status).toBe(403);
    expect((await vraag(deps, { ...GELDIG, path: 'AGENTS.md' })).status).toBe(400);
    expect((await vraag(deps, { ...GELDIG, path: '../x.md' })).status).toBe(400);
    expect((await vraag(deps, { ...GELDIG, content: 5 })).status).toBe(400);
    expect((await vraag(deps, { path: GELDIG.path, content: 'x' })).status).toBe(400);
    expect((await vraag(deps, { ...GELDIG, extra: 'x' })).status).toBe(400);
    expect((await vraag(deps, 'geen json')).status).toBe(400);
    expect(aanroepen).toHaveLength(0);
  });

  it('zonder gekozen repo geeft 409 zonder GitHub aan te roepen', async () => {
    const { deps, aanroepen } = maak([() => json({})]);
    const res = await vraag(deps, GELDIG, { s: { repo: null } });
    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({ fout: 'geen-repo' });
    expect(aanroepen).toHaveLength(0);
  });

  it('zonder cookie geeft 401', async () => {
    const { deps } = maak([() => json({})]);
    const res = await bestand(
      new Request('http://localhost:8888/api/bestand', {
        method: 'POST',
        headers: { origin: 'http://localhost:8888' },
        body: JSON.stringify(GELDIG),
      }),
      deps,
    );
    expect(res.status).toBe(401);
  });

  it('schrijft het bestand en geeft 204', async () => {
    const { deps, aanroepen } = maak([repoOk, nieuw, () => json({}, 201)]);
    const res = await vraag(deps);
    expect(res.status).toBe(204);
    expect(aanroepen.map((a) => a.methode)).toEqual(['GET', 'GET', 'PUT']);
  });

  it('een repo die GitHub niet meer kent geeft 409 en wist de repo in het cookie', async () => {
    const { deps } = maak([() => json({ message: 'Not Found' }, 404)]);
    const res = await vraag(deps);
    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({ fout: 'geen-repo' });
    const regel = res.headers.getSetCookie().find((c) => c.startsWith(`${SESSIE_COOKIE}=`))!;
    const s = await open(regel.split(';')[0].split('=')[1], sleutel);
    expect(s?.repo).toBeNull();
    expect(s?.login).toBe('harmen');
  });

  it('een 403 bij het schrijven (geen rechten meer) geeft ook 409 met gewist cookie', async () => {
    const { deps } = maak([repoOk, nieuw, () => json({}, 403)]);
    const res = await vraag(deps);
    expect(res.status).toBe(409);
    expect(res.headers.getSetCookie().some((c) => c.startsWith(`${SESSIE_COOKIE}=`))).toBe(true);
  });

  it('bij een rate limit geeft 429', async () => {
    const { deps } = maak([() => json({}, 403, { 'x-ratelimit-remaining': '0' })]);
    const res = await vraag(deps);
    expect(res.status).toBe(429);
    expect(await res.json()).toEqual({ fout: 'druk' });
  });

  it('twee keer een conflict geeft 500 conflict, nooit 409', async () => {
    const { deps } = maak([repoOk, () => json({ sha: 'a' }), () => json({}, 409), () => json({ sha: 'b' }), () => json({}, 409)]);
    const res = await vraag(deps);
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ fout: 'conflict' });
  });

  it('bij een serverfout van GitHub geeft 502', async () => {
    const { deps } = maak([repoOk, nieuw, () => json({}, 500)]);
    const res = await vraag(deps);
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ fout: 'github' });
  });
});
