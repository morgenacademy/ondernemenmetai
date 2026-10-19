// Wist het sessiecookie.
import { origineKlopt } from '../lib/github';
import { SESSIE_COOKIE, wisCookie } from '../lib/sessie';
import { standaardDeps, type Deps } from '../lib/deps';

export async function verwerk(req: Request, _deps: Deps): Promise<Response> {
  if (req.method !== 'POST') return new Response(null, { status: 405 });
  if (!origineKlopt(req)) return new Response(null, { status: 403 });
  return new Response(null, { status: 204, headers: { 'Set-Cookie': wisCookie(req, SESSIE_COOKIE) } });
}

export default (req: Request) => verwerk(req, standaardDeps());
export const config = { path: '/api/uitloggen' };
