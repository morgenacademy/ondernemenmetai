import { createContext, useContext } from 'react';
import { DEMO_FORMS } from '../demo/formulieren';
import type { FormValues } from '../lib/levels/types';
import type { RepoSnapshot } from '../lib/repo/types';
import type { SessieStand } from '../lib/sessie';

/** Welke stand draait: de demo (mock-repo, alle demoknoppen) of de echte versie (echte GitHub-repo, geen demoknoppen). */
export type Stand =
  | { demo: true }
  | { demo: false; sessie: SessieStand; kiesRepo: (repo: string) => Promise<void>; terug: string };

/** Standaard de demo, zodat bestaande tests en de demo niets merken. */
export const StandContext = createContext<Stand>({ demo: true });

export function useStand(): Stand {
  return useContext(StandContext);
}

/** De demo-waarden van een formulier; in de echte stand niets, zodat de demoknop wegblijft. */
export function useDemoWaarden(stepId: string, snapshot: RepoSnapshot): FormValues | undefined {
  const stand = useStand();
  return stand.demo ? DEMO_FORMS[stepId]?.(snapshot) : undefined;
}

/** Een echte stand voor tests. */
export const ECHT_VOORBEELD: Stand = {
  demo: false,
  sessie: { stand: 'gekoppeld', login: 'harmen', repo: 'harmen/mijn-onderneming' },
  kiesRepo: async () => {},
  terug: '#/level/0',
};
