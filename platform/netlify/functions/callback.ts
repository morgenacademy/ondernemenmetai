// GitHub stuurt de deelnemer hierheen na inloggen of installeren.
import { omgeving } from '../lib/omgeving';
import { ghApi, wisselCode } from '../lib/github';
import { reposVanGebruiker } from '../lib/installaties';
import { SESSIE_COOKIE, STATE_COOKIE, TERUG_COOKIE, ZES_MAANDEN, leesCookie, sluit, wisCookie, zetCookie } from '../lib/sessie';
import { geldigTerug, omleiding, standaardDeps, type Deps } from '../lib/deps';

const MISLUKT = '/?fout=inloggen#/route';

export async function verwerk(req: Request, deps: Deps): Promise<Response> {
  const o = omgeving(deps.env);
  const nu = deps.nu ?? Date.now;
  const url = new URL(req.url);
  const state = url.searchParams.get('state');
  const bewaard = leesCookie(req, STATE_COOKIE);
  // Na het installeren geeft GitHub geen state mee; log dan opnieuw in. oma_terug blijft staan.
  if (!state || !bewaard || state !== bewaard) return omleiding('/api/login');

  const code = url.searchParams.get('code');
  if (!code) return omleiding(MISLUKT);
  try {
    const tokens = await wisselCode(code, `${url.origin}/api/callback`, o, deps.haal, nu);
    const api = ghApi(tokens.token, deps.haal);
    const gebruiker = await api('/user');
    if (!gebruiker.ok) throw new Error(`GitHub gaf status ${gebruiker.status} bij het ophalen van de gebruiker`);
    const login = ((await gebruiker.json()) as { login?: unknown }).login;
    if (typeof login !== 'string') throw new Error('GitHub gaf geen login terug');
    const repos = await reposVanGebruiker(api);
    const sessie = { ...tokens, login, repo: repos.length === 1 ? repos[0] : null };
    const terug = geldigTerug(decodeUitCookie(leesCookie(req, TERUG_COOKIE)));
    return omleiding(`/${terug ?? '#/route'}`, [
      zetCookie(req, SESSIE_COOKIE, await sluit(sessie, o.sessieSleutel), ZES_MAANDEN),
      wisCookie(req, STATE_COOKIE),
      wisCookie(req, TERUG_COOKIE),
    ]);
  } catch {
    return omleiding(MISLUKT);
  }
}

function decodeUitCookie(waarde: string | null): string | null {
  if (!waarde) return null;
  try {
    return decodeURIComponent(waarde);
  } catch {
    return null;
  }
}

export default (req: Request) => verwerk(req, standaardDeps());
export const config = { path: '/api/callback' };
