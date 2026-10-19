import { describe, expect, it } from 'vitest';
import { json, ghApi } from './github';
import { SchrijfConflict, SchrijfFout, contentsUrl, padToegestaan, schrijfBestand } from './schrijven';

describe('padToegestaan', () => {
  it.each([
    'level-0-werkplek/setup.md',
    'level-2-probleemvalidatie/interviews/01-apotheker.md',
    'level-6-lancering/klanten.md',
    'skills/verkoopaanpak/SKILL.md',
  ])('staat %s toe', (pad) => expect(padToegestaan(pad)).toBe(true));

  it.each([
    'AGENTS.md',
    '.github/workflows/x.md',
    'level-1-idee/.github/x.md',
    '../x.md',
    '/level-1-idee/idee.md',
    'level-1-idee/idee.txt',
    'level-7-extra/a.md',
    'level-1-idee/../../x.md',
    'level-1-idee//x.md',
    'level-1-idee\\x.md',
  ])('weigert %s', (pad) => expect(padToegestaan(pad)).toBe(false));
});

describe('contentsUrl', () => {
  it('codeert elk segment', () => {
    expect(contentsUrl('harmen/mijn-onderneming', 'level-2-probleemvalidatie/interviews/01 apotheker ’s-hertogenbosch.md')).toBe(
      '/repos/harmen/mijn-onderneming/contents/level-2-probleemvalidatie/interviews/01%20apotheker%20%E2%80%99s-hertogenbosch.md',
    );
  });
});

type Aanroep = { methode: string; url: string; body: Record<string, unknown> | null };
function maak(antwoorden: ((a: Aanroep) => Response)[]) {
  const aanroepen: Aanroep[] = [];
  const haal = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const a: Aanroep = {
      methode: init?.method ?? 'GET',
      url: String(input),
      body: typeof init?.body === 'string' ? JSON.parse(init.body) : null,
    };
    aanroepen.push(a);
    return antwoorden[aanroepen.length - 1](a);
  }) as typeof fetch;
  return { api: ghApi('ghu_t', haal), aanroepen };
}

const b = { path: 'level-1-idee/idee.md', content: 'hoi', message: 'Idee opgeslagen' };
const repoOk = () => json({ default_branch: 'master' });
const nieuw = () => json({ message: 'Not Found' }, 404);
const bestaat = (sha: string) => () => json({ sha });

describe('schrijfBestand', () => {
  it('schrijft een nieuw bestand naar de standaardbranch', async () => {
    const { api, aanroepen } = maak([repoOk, nieuw, () => json({}, 201)]);
    await schrijfBestand(api, 'harmen/r', b);
    expect(aanroepen[0].url).toBe('https://api.github.com/repos/harmen/r');
    expect(aanroepen[1].url).toBe('https://api.github.com/repos/harmen/r/contents/level-1-idee/idee.md?ref=master');
    expect(aanroepen[2].methode).toBe('PUT');
    expect(aanroepen[2].url).toBe('https://api.github.com/repos/harmen/r/contents/level-1-idee/idee.md');
    expect(aanroepen[2].body).toEqual({ message: 'Idee opgeslagen', content: 'aG9p', branch: 'master' });
    expect(aanroepen[2].body).not.toHaveProperty('sha');
  });

  it('werkt een bestand bij met zijn sha en codeert UTF-8 als base64', async () => {
    const { api, aanroepen } = maak([repoOk, bestaat('abc'), () => json({})]);
    await schrijfBestand(api, 'harmen/r', { ...b, content: 'é' });
    expect(aanroepen[2].body).toEqual({ message: 'Idee opgeslagen', content: 'w6k=', branch: 'master', sha: 'abc' });
  });

  it('probeert het na een 409 één keer opnieuw met de nieuwe sha', async () => {
    const { api, aanroepen } = maak([repoOk, bestaat('een'), () => json({}, 409), bestaat('twee'), () => json({})]);
    await schrijfBestand(api, 'harmen/r', b);
    const puts = aanroepen.filter((a) => a.methode === 'PUT');
    expect(puts).toHaveLength(2);
    expect(puts[1].body?.sha).toBe('twee');
  });

  it('probeert het ook opnieuw na een 422 (bestand verscheen zonder sha)', async () => {
    const { api, aanroepen } = maak([repoOk, nieuw, () => json({}, 422), bestaat('nieuw'), () => json({})]);
    await schrijfBestand(api, 'harmen/r', b);
    expect(aanroepen.filter((a) => a.methode === 'PUT')[1].body?.sha).toBe('nieuw');
  });

  it('geeft SchrijfConflict bij twee keer 409', async () => {
    const { api } = maak([repoOk, bestaat('een'), () => json({}, 409), bestaat('twee'), () => json({}, 409)]);
    await expect(schrijfBestand(api, 'harmen/r', b)).rejects.toBeInstanceOf(SchrijfConflict);
  });

  it.each([
    ['repo 404', [() => json({}, 404)], 'geen-repo'],
    ['repo 403', [() => json({}, 403)], 'geen-repo'],
    ['repo druk', [() => json({}, 403, { 'x-ratelimit-remaining': '0' })], 'druk'],
    ['contents 403', [repoOk, () => json({}, 403)], 'geen-repo'],
    ['contents druk', [repoOk, () => json({}, 429)], 'druk'],
    ['contents 500', [repoOk, () => json({}, 500)], 'github'],
    ['put 404', [repoOk, nieuw, () => json({}, 404)], 'geen-repo'],
    ['put 403', [repoOk, nieuw, () => json({}, 403)], 'geen-repo'],
    ['put druk', [repoOk, nieuw, () => json({}, 429)], 'druk'],
    ['put 500', [repoOk, nieuw, () => json({}, 500)], 'github'],
  ] as const)('%s wordt soort %s', async (_naam, antwoorden, soort) => {
    const { api } = maak([...antwoorden]);
    const fout = await schrijfBestand(api, 'harmen/r', b).catch((e) => e);
    expect(fout).toBeInstanceOf(SchrijfFout);
    expect(fout.soort).toBe(soort);
  });
});
