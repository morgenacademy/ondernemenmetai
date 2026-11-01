// Bewaart welke van de gekoppelde repo's de deelnemer gebruikt.
import { omgeving } from '../lib/omgeving';
import { json, metSessie, origineKlopt } from '../lib/github';
import { reposVanGebruiker } from '../lib/installaties';
import { standaardDeps, type Deps } from '../lib/deps';

export async function verwerk(req: Request, deps: Deps): Promise<Response> {
  if (req.method !== 'POST') return new Response(null, { status: 405 });
  if (!origineKlopt(req)) return new Response(null, { status: 403 });
  const o = omgeving(deps.env);
  let repo: unknown;
  try {
    repo = ((await req.json()) as { repo?: unknown } | null)?.repo;
  } catch {
    repo = undefined;
  }
  if (typeof repo !== 'string' || repo === '') return json({ fout: 'repo' }, 400);
  const gekozen = repo;
  return metSessie(
    req,
    o,
    deps.haal,
    async (s, api) => {
      if (!(await reposVanGebruiker(api)).includes(gekozen)) return { antwoord: json({ fout: 'repo' }, 400) };
      return { antwoord: new Response(null, { status: 204 }), sessie: { ...s, repo: gekozen } };
    },
    deps.nu,
  );
}

export default (req: Request) => verwerk(req, standaardDeps());
export const config = { path: '/api/repo-kiezen' };
