import { describe, expect, it } from 'vitest';
import { json } from '../lib/github';
import { SESSIE_COOKIE, open, sluit, type Sessie } from '../lib/sessie';
import type { Deps } from '../lib/deps';
import { verwerk as repo } from '../functions/repo';

const sleutel = Buffer.alloc(32, 9).toString('base64');
const env = { GITHUB_CLIENT_ID: 'Iv1.test', GITHUB_CLIENT_SECRET: 'geheim', GITHUB_APP_SLUG: 'ondernemen-met-ai', SESSIE_SLEUTEL: sleutel };
const NU = 1_000_000;

const gesloten = (s: Partial<Sessie> = {}) =>
  sluit({ token: 'ghu_t', refresh: 'ghr_t', verloopt: NU + 3_600_000, login: 'harmen', repo: 'harmen/mijn-onderneming', ...s }, sleutel);

function maak(antwoord: () => Response) {
  const aanroepen: { url: string; body: string }[] = [];
  const haal = (async (input: RequestInfo | URL, init?: RequestInit) => {
    aanroepen.push({ url: String(input), body: typeof init?.body === 'string' ? init.body : '' });
    return antwoord();
  }) as typeof fetch;
  const deps: Deps = { haal, env, nu: () => NU };
  return { deps, aanroepen };
}

const vraag = async (deps: Deps, s: Partial<Sessie> = {}, method = 'GET') =>
  repo(
    new Request('http://localhost:8888/api/repo', { method, headers: { cookie: `${SESSIE_COOKIE}=${await gesloten(s)}` } }),
    deps,
  );

describe('repo', () => {
  it('zonder gekozen repo geeft 409 zonder GitHub aan te roepen', async () => {
    const { deps, aanroepen } = maak(() => json({}));
    const res = await vraag(deps, { repo: null });
    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({ fout: 'geen-repo' });
    expect(aanroepen).toHaveLength(0);
  });

  it('geeft de vertaalde repo terug', async () => {
    const data = {
      repository: {
        name: 'mijn-onderneming',
        isPrivate: false,
        url: 'https://github.com/harmen/mijn-onderneming',
        owner: { login: 'harmen' },
        pullRequests: { totalCount: 1 },
        defaultBranchRef: null,
        object: { entries: [{ name: 'README.md', type: 'blob', object: { text: 'hoi', isBinary: false } }] },
      },
    };
    const { deps, aanroepen } = maak(() => json({ data }));
    const res = await vraag(deps);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.files).toEqual({ 'README.md': 'hoi' });
    expect(body.info.owner).toBe('harmen');
    expect(aanroepen[0].url).toBe('https://api.github.com/graphql');
    expect(JSON.parse(aanroepen[0].body).variables).toEqual({ owner: 'harmen', name: 'mijn-onderneming' });
  });

  it('die GitHub niet meer kent, geeft 409 en wist de repo in het cookie', async () => {
    const { deps } = maak(() => json({ data: { repository: null }, errors: [{ type: 'NOT_FOUND' }] }));
    const res = await vraag(deps);
    expect(res.status).toBe(409);
    const regel = res.headers.getSetCookie().find((c) => c.startsWith(`${SESSIE_COOKIE}=`))!;
    const s = await open(regel.split(';')[0].split('=')[1], sleutel);
    expect(s?.repo).toBeNull();
    expect(s?.login).toBe('harmen');
  });

  it('wist de repo ook bij HTTP 404', async () => {
    const { deps } = maak(() => json({ message: 'Not Found' }, 404));
    const res = await vraag(deps);
    expect(res.status).toBe(409);
    expect(res.headers.getSetCookie().some((c) => c.startsWith(`${SESSIE_COOKIE}=`))).toBe(true);
  });

  it('bij een rate limit geeft 429', async () => {
    const { deps } = maak(() => json({ message: 'limiet' }, 403, { 'x-ratelimit-remaining': '0' }));
    const res = await vraag(deps);
    expect(res.status).toBe(429);
    expect(await res.json()).toEqual({ fout: 'druk' });
  });

  it('bij een RATE_LIMITED-fout in GraphQL geeft 429', async () => {
    const { deps } = maak(() => json({ errors: [{ type: 'RATE_LIMITED' }] }));
    expect((await vraag(deps)).status).toBe(429);
  });

  it('bij een serverfout van GitHub geeft 502', async () => {
    const { deps } = maak(() => json({}, 500));
    const res = await vraag(deps);
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ fout: 'github' });
  });

  it('weigert iets anders dan GET', async () => {
    const { deps } = maak(() => json({}));
    expect((await vraag(deps, {}, 'POST')).status).toBe(405);
  });

  it('zonder cookie geeft 401', async () => {
    const { deps } = maak(() => json({}));
    const res = await repo(new Request('http://localhost:8888/api/repo'), deps);
    expect(res.status).toBe(401);
  });
});
