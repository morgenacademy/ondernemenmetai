import { useCallback, useEffect, useState } from 'react';
import { GeenRepo, type RepoFout } from '../lib/repo/fouten';
import { KIEZEN_MISLUKT, SESSIE_MISLUKT, UITLOGGEN_MISLUKT, haalSessie, kiesRepo, uitloggen, type SessieStand } from '../lib/sessie';
import { alsRepoFout } from './meldingen';

/**
 * Met welke repo dit tabblad rekent na een nieuwe sessie. Gekoppeld: die repo. Ben je in een lopend tabblad
 * uitgelogd, dan blijft de vorige repo staan, en daarmee je ingevulde formulieren. Is je repo weg (GeenRepo), dan geen.
 * Bij het openen is er nog geen vorige, dus zonder koppeling rekent App dan met de lege repo.
 */
export function repoNaSessie(vorige: string | null, nieuw: SessieStand, reden: RepoFout | null): string | null {
  if (nieuw.stand === 'gekoppeld') return nieuw.repo;
  return reden instanceof GeenRepo ? null : vorige;
}

/**
 * De sessie in de echte stand: of je bent ingelogd, en met welke repo dit tabblad rekent (zie repoNaSessie).
 * In de demo (aan is false) haalt hij niets op en leest hij het adres niet.
 */
export function useEchteSessie(aan: boolean) {
  const [sessie, setSessie] = useState<SessieStand | null>(null);
  const [repo, setRepo] = useState<string | null>(null);
  const [fout, setFout] = useState<RepoFout | null>(null);
  // Een mislukte inlog komt terug als ?fout=inloggen. Eén keer lezen, dan uit de adresbalk (zie het effect hieronder).
  const [zoek] = useState(() => (aan ? window.location.search : ''));

  /**
   * Haalt de sessie op. Kwam je hier door een fout (uitgelogd, of je repo is weg), dan blijft die melding staan
   * tot je weer gekoppeld bent.
   */
  const laad = useCallback(async (reden: RepoFout | null = null) => {
    try {
      const nieuw = await haalSessie();
      setSessie(nieuw);
      setRepo((vorige) => repoNaSessie(vorige, nieuw, reden));
      setFout(nieuw.stand === 'gekoppeld' ? null : reden);
    } catch (e) {
      setFout(alsRepoFout(e, SESSIE_MISLUKT));
    }
  }, []);

  useEffect(() => {
    if (aan) void laad();
  }, [aan, laad]);

  useEffect(() => {
    if (zoek) window.history.replaceState(null, '', window.location.pathname + window.location.hash);
  }, [zoek]);

  /** Koppelt de gekozen repo en haalt dan de sessie opnieuw op. Lukt het niet, dan komt er een melding. */
  const kies = useCallback(
    async (repo: string) => {
      try {
        await kiesRepo(repo);
      } catch (e) {
        setFout(alsRepoFout(e, KIEZEN_MISLUKT));
        return;
      }
      await laad();
    },
    [laad],
  );

  /** Logt uit en begint op `/` opnieuw, zodat er niets van je repo in dit tabblad blijft staan. */
  const loguit = useCallback(async () => {
    try {
      await uitloggen();
    } catch (e) {
      setFout(alsRepoFout(e, UITLOGGEN_MISLUKT));
      return;
    }
    window.location.assign('/');
  }, []);

  return { sessie, repo, fout, zoek, laad, kies, loguit };
}
