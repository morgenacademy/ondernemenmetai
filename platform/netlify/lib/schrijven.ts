// Schrijft één Markdown-bestand naar de repo van de deelnemer, als één commit op de standaardbranch.
import { isDruk, type Api } from './github';

const MAPPEN = [
  'level-0-werkplek/',
  'level-1-idee/',
  'level-2-probleemvalidatie/',
  'level-3-prototype/',
  'level-4-marktfeedback/',
  'level-5-productvalidatie/',
  'level-6-lancering/',
  'skills/',
];

// Alleen .md-paden in de eigen mappen van het platform, nooit buiten de repo of in .github.
export function padToegestaan(pad: string): boolean {
  if (!pad.endsWith('.md') || pad.includes('\\') || pad.startsWith('/')) return false;
  if (!MAPPEN.some((m) => pad.startsWith(m))) return false;
  const segmenten = pad.split('/');
  return !segmenten.some((s) => s === '' || s === '.' || s === '..' || s === '.github');
}

export function contentsUrl(repo: string, pad: string): string {
  return `/repos/${repo}/contents/${pad.split('/').map(encodeURIComponent).join('/')}`;
}

// Twee keer een conflict op rij: iemand anders schrijft tegelijk naar hetzelfde bestand.
export class SchrijfConflict extends Error {}

// Wat GitHub antwoordde, zodat de function er een eigen antwoord van kan maken.
export class SchrijfFout extends Error {
  constructor(public soort: 'geen-repo' | 'geweigerd' | 'druk' | 'github', bericht: string) {
    super(bericht);
  }
}

// Vertaalt een mislukt antwoord van GitHub. 404: de repo is weg. 403: weg of tijdelijk geweigerd; de function zoekt dat uit.
function fout(res: Response, wat: string): SchrijfFout {
  const bericht = `GitHub gaf status ${res.status} bij ${wat}`;
  if (isDruk(res)) return new SchrijfFout('druk', bericht);
  if (res.status === 404) return new SchrijfFout('geen-repo', bericht);
  if (res.status === 403) return new SchrijfFout('geweigerd', bericht);
  return new SchrijfFout('github', bericht);
}

async function haalSha(api: Api, repo: string, pad: string, branch: string): Promise<string | undefined> {
  const res = await api(`${contentsUrl(repo, pad)}?ref=${encodeURIComponent(branch)}`);
  if (res.status === 404 && !isDruk(res)) return undefined; // nieuw bestand
  if (!res.ok) throw fout(res, 'het ophalen van het bestand');
  const body = (await res.json()) as { sha?: unknown } | unknown[];
  if (Array.isArray(body) || typeof body.sha !== 'string') throw new SchrijfFout('github', 'GitHub gaf geen bestand terug');
  return body.sha;
}

export async function schrijfBestand(api: Api, repo: string, b: { path: string; content: string; message: string }): Promise<void> {
  const repoRes = await api(`/repos/${repo}`);
  if (!repoRes.ok) throw fout(repoRes, 'het ophalen van de repo');
  const branch = ((await repoRes.json()) as { default_branch?: unknown }).default_branch;
  if (typeof branch !== 'string') throw new SchrijfFout('github', 'GitHub gaf geen standaardbranch terug');

  const content = Buffer.from(b.content, 'utf8').toString('base64');
  for (let poging = 0; poging < 2; poging++) {
    const sha = await haalSha(api, repo, b.path, branch);
    const res = await api(contentsUrl(repo, b.path), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: b.message, content, branch, ...(sha ? { sha } : {}) }),
    });
    if (res.ok) return;
    // 409: de sha is verouderd. 422: het bestand verscheen tussendoor terwijl we geen sha stuurden.
    if (res.status === 409 || res.status === 422) continue;
    throw fout(res, 'het opslaan van het bestand');
  }
  throw new SchrijfConflict('Het bestand veranderde twee keer tijdens het opslaan');
}
