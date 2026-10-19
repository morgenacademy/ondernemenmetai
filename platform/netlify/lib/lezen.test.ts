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
  it('schrijft zes mappen diep uit', () => {
    expect(REPO_QUERY.match(/\.\.\. on Tree/g)).toHaveLength(6);
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

  it('geeft een binair bestand een lege inhoud', () => {
    const data = antwoord({
      object: { entries: [met('level-3-prototype', map([met('mvp', map([met('logo.png', blob(null, true))]))]))] },
    });
    expect(vertaalRepo(data).files).toEqual({ 'level-3-prototype/mvp/logo.png': '' });
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
