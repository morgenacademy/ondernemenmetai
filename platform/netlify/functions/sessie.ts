// Vertelt de browser of de deelnemer is ingelogd en gekoppeld. Geeft nooit een token terug.
import { omgeving } from '../lib/omgeving';
import { json, metSessie } from '../lib/github';
import { reposVanGebruiker } from '../lib/installaties';
import { SESSIE_COOKIE, leesCookie, open } from '../lib/sessie';
import { standaardDeps, type Deps } from '../lib/deps';

export async function verwerk(req: Request, deps: Deps): Promise<Response> {
  const o = omgeving(deps.env);
  const waarde = leesCookie(req, SESSIE_COOKIE);
  const huidig = waarde ? await open(waarde, o.sessieSleutel) : null;
  if (!huidig) return json({ stand: 'uit' });
  // Met een repo is GitHub niet nodig, tenzij de token eerst vernieuwd moet worden.
  if (huidig.repo && huidig.verloopt - (deps.nu ?? Date.now)() >= 60_000) {
    return json({ stand: 'gekoppeld', login: huidig.login, repo: huidig.repo });
  }
  const res = await metSessie(
    req,
    o,
    deps.haal,
    async (s, api) => {
      if (s.repo) return { antwoord: json({ stand: 'gekoppeld', login: s.login, repo: s.repo }) };
      return { antwoord: json({ stand: 'kies-repo', login: s.login, repos: await reposVanGebruiker(api) }) };
    },
    deps.nu,
  );
  // Definitief uitgelogd is geen fout voor de browser: hij krijgt gewoon 'uit', met het gewiste cookie.
  if (res.status === 401) return json({ stand: 'uit' }, 200, { 'Set-Cookie': res.headers.get('set-cookie') ?? '' });
  return res;
}

export default (req: Request) => verwerk(req, standaardDeps());
export const config = { path: '/api/sessie' };
