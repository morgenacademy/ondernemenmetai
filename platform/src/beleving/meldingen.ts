import { GeenRepo, NietIngelogd, RepoFout } from '../lib/repo/fouten';
import { OPHALEN_MISLUKT } from '../lib/repo/githubRepo';

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

/** Wat App bovenaan laat zien. `bron` zegt wat "Opnieuw" doet: de repo opnieuw ophalen, of de sessie. */
export type TeTonen = Melding & { bron: 'repo' | 'sessie' };

/**
 * De melding in App, uit de stand van useRepo en de sessie.
 * - In de demo: de schrijffout of de opslagmelding, zonder knop, zoals altijd.
 * - Een schrijffout van vóór de laatste wissel van repo (zoals vóór het opnieuw koppelen) telt niet meer;
 *   useRepo wist hem pas na een geslaagde schrijfactie.
 * - Een fout van de repo gaat voor een fout van de sessie. Een gewone Error krijgt de zin van ophalen,
 *   zodat je nooit eeuwig "Laden…" ziet zonder uitleg.
 * - Komt de fout van een mislukte schrijfactie, dan geen "Opnieuw": die zou alleen verversen, en de melding
 *   laten verdwijnen alsof het opgeslagen is. Je klikt opnieuw op de knop van het formulier.
 */
export function toonMelding(p: {
  echt: boolean;
  fout: Error | null;
  error: string | null;
  errorBijWissel: string | null;
  warning: string | null;
  sessieFout: RepoFout | null;
  zoek: string;
}): TeTonen | null {
  const zonderKnop = (tekst: string | null): TeTonen | null => (tekst ? { tekst, actie: null, bron: 'repo' } : null);
  if (!p.echt) return zonderKnop(p.error ?? p.warning);
  const error = p.error !== p.errorBijWissel ? p.error : null;
  const fout = p.fout ? alsRepoFout(p.fout, OPHALEN_MISLUKT) : p.sessieFout;
  const melding = meldingVoor(fout, p.zoek);
  if (!melding) return zonderKnop(error ?? p.warning);
  const vanSchrijven = p.fout !== null && error !== null && error === p.fout.message;
  return { tekst: melding.tekst, actie: melding.actie === 'opnieuw' && vanSchrijven ? null : melding.actie, bron: p.fout ? 'repo' : 'sessie' };
}
