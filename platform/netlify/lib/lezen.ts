// De hele repo in één GraphQL-aanroep lezen en omzetten naar het RepoAntwoord van de browser.
import type { Commit, RepoAntwoord } from '../../src/lib/repo/types';

const DIEPTE = 7; // lijsten met entries (de root plus zes mappen); het diepste pad dat doorkomt is a/b/c/d/e/f/bestand.md

// Bouwt het geneste Tree-fragment: elke laag vraagt de bestanden en de mappen eronder.
function boom(niveau: number): string {
  const onder = niveau > 1 ? ` ... on Tree { entries ${boom(niveau - 1)} }` : '';
  return `{ name type object { ... on Blob { text isBinary }${onder} } }`;
}

export const REPO_QUERY = `query($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    name
    isPrivate
    url
    owner { login }
    pullRequests(states: MERGED) { totalCount }
    defaultBranchRef {
      name
      target {
        ... on Commit {
          history(first: 20) { nodes { messageHeadline committedDate author { name user { login } } } }
        }
      }
    }
    object(expression: "HEAD:") {
      ... on Tree { entries ${boom(DIEPTE)} }
    }
  }
}`;

type Rij = Record<string, unknown>;
const rij = (x: unknown): Rij => (x !== null && typeof x === 'object' ? (x as Rij) : {});
const lijst = (x: unknown): unknown[] => (Array.isArray(x) ? x : []);
const tekst = (x: unknown): string => (typeof x === 'string' ? x : '');

function verzamel(entries: unknown, voorvoegsel: string, files: Record<string, string>): void {
  for (const e of lijst(entries)) {
    const { name, type, object } = rij(e);
    if (typeof name !== 'string') continue;
    const pad = `${voorvoegsel}${name}`;
    if (type === 'blob') {
      const blob = rij(object);
      files[pad] = blob.isBinary === true ? '' : tekst(blob.text);
    } else if (type === 'tree') {
      verzamel(rij(object).entries, `${pad}/`, files);
    }
    // Andere typen (commit = submodule) vallen weg.
  }
}

export function vertaalRepo(data: unknown): RepoAntwoord {
  const repo = rij(rij(data).repository);
  const url = tekst(repo.url);

  const files: Record<string, string> = {};
  verzamel(rij(repo.object).entries, '', files);

  const commits: Commit[] = lijst(rij(rij(rij(repo.defaultBranchRef).target).history).nodes).map((n) => {
    const c = rij(n);
    const auteur = rij(c.author);
    const login = rij(auteur.user).login;
    const naam = typeof login === 'string' && login !== '' ? login : tekst(auteur.name);
    return { message: tekst(c.messageHeadline), at: tekst(c.committedDate), ...(naam ? { auteur: naam } : {}) };
  });

  const merged = rij(repo.pullRequests).totalCount;
  return {
    info: {
      name: tekst(repo.name),
      owner: tekst(rij(repo.owner).login),
      isPrivate: repo.isPrivate === true,
      mergedPullRequests: typeof merged === 'number' ? merged : 0,
      ...(url ? { url } : {}),
    },
    files,
    commits,
  };
}
