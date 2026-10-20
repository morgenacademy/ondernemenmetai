import { GeenRepo, NietIngelogd, RepoFout } from '../lib/repo/fouten';

/** Een melding bovenaan, met wat je dan kunt doen: inloggen, opnieuw proberen, of niets (de zin zegt waar je heen moet). */
export type Melding = { tekst: string; actie: 'inloggen' | 'opnieuw' | null };

export const INLOGGEN_MISLUKT = 'Inloggen bij GitHub lukte niet. Probeer het opnieuw.';

/** De melding bij een fout van de echte repo of sessie, of bij een mislukte inlog (`?fout=inloggen` in het adres). */
export function meldingVoor(fout: Error | null, zoek: string): Melding | null {
  if (fout instanceof NietIngelogd) return { tekst: fout.message, actie: 'inloggen' };
  if (fout instanceof GeenRepo) return { tekst: fout.message, actie: null };
  if (fout instanceof RepoFout) return { tekst: fout.message, actie: 'opnieuw' };
  if (!fout && zoek === '?fout=inloggen') return { tekst: INLOGGEN_MISLUKT, actie: 'inloggen' };
  return null;
}

/** Een RepoFout blijft zichzelf; iets anders, zoals een netwerkfout, krijgt de zin `anders`. */
export function alsRepoFout(e: unknown, anders: string): RepoFout {
  return e instanceof RepoFout ? e : new RepoFout(anders);
}
