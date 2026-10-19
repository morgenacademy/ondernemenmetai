// Leest de gekozen repo van de deelnemer in één aanroep.
import { omgeving } from '../lib/omgeving';
import { isDruk, json, metSessie } from '../lib/github';
import { REPO_QUERY, vertaalRepo } from '../lib/lezen';
import { standaardDeps, type Deps } from '../lib/deps';

export async function verwerk(req: Request, deps: Deps): Promise<Response> {
  if (req.method !== 'GET') return new Response(null, { status: 405 });
  const o = omgeving(deps.env);
  return metSessie(
    req,
    o,
    deps.haal,
    async (s, api) => {
      if (!s.repo) return { antwoord: json({ fout: 'geen-repo' }, 409) };
      const [owner, name] = s.repo.split('/');
      const res = await api('https://api.github.com/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: REPO_QUERY, variables: { owner, name } }),
      });
      // De repo is hernoemd of uit de installatie gehaald: wis hem uit het cookie.
      const weg = { antwoord: json({ fout: 'geen-repo' }, 409), sessie: { ...s, repo: null } };
      if (isDruk(res)) return { antwoord: json({ fout: 'druk' }, 429) };
      if (res.status === 404 || res.status === 403) return weg;
      if (!res.ok) return { antwoord: json({ fout: 'github' }, 502) };
      const body = (await res.json()) as { data?: { repository?: unknown } | null; errors?: { type?: string }[] };
      const fouten = Array.isArray(body.errors) ? body.errors : [];
      if (fouten.some((f) => f?.type === 'RATE_LIMITED')) return { antwoord: json({ fout: 'druk' }, 429) };
      if (fouten.some((f) => f?.type === 'NOT_FOUND') || body.data?.repository === null) return weg;
      if (!body.data) return { antwoord: json({ fout: 'github' }, 502) };
      return { antwoord: json(vertaalRepo(body.data)) };
    },
    deps.nu,
  );
}

export default (req: Request) => verwerk(req, standaardDeps());
export const config = { path: '/api/repo' };
