// Wist het sessiecookie en trekt de token in. Op een gedeelde computer is github.com vaak nog ingelogd
// als de vorige deelnemer; daarom vraagt de volgende login eerst welk GitHub-account.
import { omgeving } from '../lib/omgeving';
import { origineKlopt, trekTokenIn } from '../lib/github';
import { SESSIE_COOKIE, UITGELOGD_COOKIE, ZES_MAANDEN, leesCookie, open, wisCookie, zetCookie } from '../lib/sessie';
import { standaardDeps, type Deps } from '../lib/deps';

export async function verwerk(req: Request, deps: Deps): Promise<Response> {
  if (req.method !== 'POST') return new Response(null, { status: 405 });
  if (!origineKlopt(req)) return new Response(null, { status: 403 });
  const o = omgeving(deps.env);
  const waarde = leesCookie(req, SESSIE_COOKIE);
  const sessie = waarde ? await open(waarde, o.sessieSleutel) : null;
  if (sessie) await trekTokenIn(sessie.token, o, deps.haal);
  const headers = new Headers();
  headers.append('Set-Cookie', wisCookie(req, SESSIE_COOKIE));
  headers.append('Set-Cookie', zetCookie(req, UITGELOGD_COOKIE, '1', ZES_MAANDEN));
  return new Response(null, { status: 204, headers });
}

export default (req: Request) => verwerk(req, standaardDeps());
export const config = { path: '/api/uitloggen' };
