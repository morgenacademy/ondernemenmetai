// Stuurt de deelnemer naar GitHub om de app te installeren.
import { omgeving } from '../lib/omgeving';
import { TERUG_COOKIE, TIEN_MINUTEN, zetCookie } from '../lib/sessie';
import { geldigTerug, omleiding, standaardDeps, type Deps } from '../lib/deps';

export async function verwerk(req: Request, deps: Deps): Promise<Response> {
  const o = omgeving(deps.env);
  const terug = geldigTerug(new URL(req.url).searchParams.get('terug'));
  const cookies = terug ? [zetCookie(req, TERUG_COOKIE, encodeURIComponent(terug), TIEN_MINUTEN)] : [];
  return omleiding(`https://github.com/apps/${o.appSlug}/installations/new`, cookies);
}

export default (req: Request) => verwerk(req, standaardDeps());
export const config = { path: '/api/koppel' };
