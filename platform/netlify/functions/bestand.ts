// Schrijft een formulier als één Markdown-bestand naar de repo van de deelnemer.
import { omgeving } from '../lib/omgeving';
import { json, metSessie, origineKlopt } from '../lib/github';
import { SchrijfConflict, SchrijfFout, padToegestaan, schrijfBestand } from '../lib/schrijven';
import { standaardDeps, type Deps } from '../lib/deps';

type Invoer = { path: string; content: string; message: string };

// Precies drie strings: path, content en message.
function leesInvoer(data: unknown): Invoer | null {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) return null;
  const d = data as Record<string, unknown>;
  const sleutels = Object.keys(d);
  if (sleutels.length !== 3 || !['path', 'content', 'message'].every((k) => typeof d[k] === 'string')) return null;
  return { path: d.path as string, content: d.content as string, message: d.message as string };
}

export async function verwerk(req: Request, deps: Deps): Promise<Response> {
  if (req.method !== 'POST') return new Response(null, { status: 405 });
  if (!origineKlopt(req)) return json({ fout: 'origin' }, 403);
  let invoer: Invoer | null = null;
  try {
    invoer = leesInvoer(await req.json());
  } catch {
    // geen geldige JSON
  }
  if (!invoer || !padToegestaan(invoer.path)) return json({ fout: 'ongeldig' }, 400);
  const b = invoer;

  const o = omgeving(deps.env);
  return metSessie(
    req,
    o,
    deps.haal,
    async (s, api) => {
      // Een 409 van deze function betekent in de browser altijd "geen repo".
      if (!s.repo) return { antwoord: json({ fout: 'geen-repo' }, 409) };
      try {
        await schrijfBestand(api, s.repo, b);
        return { antwoord: new Response(null, { status: 204 }) };
      } catch (e) {
        if (e instanceof SchrijfConflict) return { antwoord: json({ fout: 'conflict' }, 500) };
        if (e instanceof SchrijfFout && e.soort === 'druk') return { antwoord: json({ fout: 'druk' }, 429) };
        if (e instanceof SchrijfFout && e.soort === 'geen-repo') {
          return { antwoord: json({ fout: 'geen-repo' }, 409), sessie: { ...s, repo: null } };
        }
        return { antwoord: json({ fout: 'github' }, 502) };
      }
    },
    deps.nu,
  );
}

export default (req: Request) => verwerk(req, standaardDeps());
export const config = { path: '/api/bestand' };
