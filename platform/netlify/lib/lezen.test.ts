import { describe, expect, it } from 'vitest';
import { REPO_QUERY, vertaalRepo } from './lezen';

const blob = (text: string | null, isBinary = false) => ({ type: 'blob', object: { text, isBinary } });
const map = (entries: unknown[]) => ({ type: 'tree', object: { entries } });
const met = (naam: string, e: object) => ({ name: naam, ...e });

function antwoord(over: Record<string, unknown> = {}) {
  return {
    repository: {
      name: 'mijn-onderneming',
      isPrivate: true,
      url: 'https://github.com/harmen/mijn-onderneming',
      owner: { login: 'harmen' },
      pullRequests: { totalCount: 2 },
      defaultBranchRef: { name: 'main', target: { history: { nodes: [] } } },
      object: { entries: [] },
      ...over,
    },
  };
}

describe('REPO_QUERY', () => {
  it('vraagt zeven lijsten entries: de root plus zes mappen', () => {
    expect(REPO_QUERY.match(/entries/g)).toHaveLength(7);
  });
});

describe('vertaalRepo', () => {
  it('zet een boom om in paden', () => {
    const data = antwoord({
      object: {
        entries: [
          met('level-0-werkplek', map([met('setup.md', blob('# Setup'))])),
          met('level-2-probleemvalidatie', map([met('interviews', map([met('01-apotheker.md', blob('Apotheker'))]))])),
        ],
      },
    });
    expect(vertaalRepo(data).files).toEqual({
      'level-0-werkplek/setup.md': '# Setup',
      'level-2-probleemvalidatie/interviews/01-apotheker.md': 'Apotheker',
    });
  });

  it('laat a/b/c/d/e/f/bestand.md door', () => {
    let laag: unknown = [met('bestand.md', blob('diep'))];
    for (const m of ['f', 'e', 'd', 'c', 'b', 'a']) laag = [met(m, map(laag as unknown[]))];
    expect(vertaalRepo(antwoord({ object: { entries: laag } })).files).toEqual({ 'a/b/c/d/e/f/bestand.md': 'diep' });
  });

  it('geeft een binair bestand een lege inhoud', () => {
    const data = antwoord({
      object: { entries: [met('level-3-prototype', map([met('mvp', map([met('logo.png', blob(null, true))]))]))] },
    });
    expect(vertaalRepo(data).files).toEqual({ 'level-3-prototype/mvp/logo.png': '' });
  });

  it('houdt alleen de tekst van .md-bestanden, zodat het antwoord ook met een prototype in de repo klein blijft', () => {
    const data = antwoord({
      object: { entries: [met('level-3-prototype', map([met('mvp', map([met('index.html', blob('<html>')), met('README.md', blob('# MVP'))]))]))] },
    });
    expect(vertaalRepo(data).files).toEqual({ 'level-3-prototype/mvp/index.html': '', 'level-3-prototype/mvp/README.md': '# MVP' });
  });

  it('laat submodules weg', () => {
    const data = antwoord({ object: { entries: [met('vendor', { type: 'commit', object: null }), met('a.md', blob('x'))] } });
    expect(Object.keys(vertaalRepo(data).files)).toEqual(['a.md']);
  });

  it('overleeft een lege repo', () => {
    const r = vertaalRepo(antwoord({ defaultBranchRef: null, object: null }));
    expect(r.files).toEqual({});
    expect(r.commits).toEqual([]);
  });

  it('neemt de login als auteur, en anders de naam', () => {
    const nodes = [
      { messageHeadline: 'Een', committedDate: '2026-10-01T10:00:00Z', author: { name: 'Harmen van Heist', user: { login: 'harmen' } } },
      { messageHeadline: 'Twee', committedDate: '2026-10-02T10:00:00Z', author: { name: 'Anoniem', user: null } },
    ];
    const r = vertaalRepo(antwoord({ defaultBranchRef: { name: 'main', target: { history: { nodes } } } }));
    expect(r.commits).toEqual([
      { message: 'Een', at: '2026-10-01T10:00:00Z', auteur: 'harmen' },
      { message: 'Twee', at: '2026-10-02T10:00:00Z', auteur: 'Anoniem' },
    ]);
  });

  it('neemt info over', () => {
    expect(vertaalRepo(antwoord()).info).toEqual({
      owner: 'harmen',
      name: 'mijn-onderneming',
      isPrivate: true,
      url: 'https://github.com/harmen/mijn-onderneming',
      mergedPullRequests: 2,
    });
  });
});
