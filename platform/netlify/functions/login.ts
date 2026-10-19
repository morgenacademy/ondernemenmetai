// Stuurt de deelnemer naar GitHub om in te loggen.
import { omgeving } from '../lib/omgeving';
import { STATE_COOKIE, TERUG_COOKIE, TIEN_MINUTEN, zetCookie } from '../lib/sessie';
import { geldigTerug, omleiding, standaardDeps, type Deps } from '../lib/deps';

export async function verwerk(req: Request, deps: Deps): Promise<Response> {
  const o = omgeving(deps.env);
  const url = new URL(req.url);
  const state = (deps.willekeurig ?? (() => crypto.randomUUID()))();
  const cookies = [zetCookie(req, STATE_COOKIE, state, TIEN_MINUTEN)];
  // Zonder geldige terug blijft een bestaande oma_terug staan: de callback stuurt hierheen terug.
  const terug = geldigTerug(url.searchParams.get('terug'));
  if (terug) cookies.push(zetCookie(req, TERUG_COOKIE, encodeURIComponent(terug), TIEN_MINUTEN));
  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.searchParams.set('client_id', o.clientId);
  authorize.searchParams.set('state', state);
  authorize.searchParams.set('redirect_uri', `${url.origin}/api/callback`);
  return omleiding(authorize.toString(), cookies);
}

export default (req: Request) => verwerk(req, standaardDeps());
export const config = { path: '/api/login' };
