import type { LevelDef } from '../lib/levels/types';
import type { StapStatus } from './voortgang';

export type Icoon = 'account' | 'repo' | 'koppelen' | 'setup' | 'app' | 'desktop' | 'clonen' | 'push';

/** Het korte label en het icoon van elk rondje op het pad van level 0, uit de schets level0-bord. */
export const PAD: Record<string, { naam: string; icoon: Icoon }> = {
  'l0-account': { naam: 'Account', icoon: 'account' },
  'l0-repo': { naam: 'Repo', icoon: 'repo' },
  'l0-koppelen': { naam: 'Koppelen', icoon: 'koppelen' },
  'l0-setup': { naam: 'Setup', icoon: 'setup' },
  'l0-download': { naam: 'AI-app', icoon: 'app' },
  'l0-github-desktop': { naam: 'Desktop', icoon: 'desktop' },
  'l0-clonen': { naam: 'Clonen', icoon: 'clonen' },
  'l0-eerste-opdracht': { naam: '1e push', icoon: 'push' },
};

export type PadStand = {
  /** De stap die nu aan de beurt is, of null als alles klaar is. */
  nu: string | null;
  klaar: number;
  totaal: number;
  /** Hoe ver de lijn oplicht, in procenten: tot het rondje dat nu aan de beurt is, of helemaal als alles klaar is. */
  lijn: number;
};

export function padStand(level: LevelDef, statussen: Record<string, StapStatus>): PadStand {
  const stappen = level.steps.filter((s) => !s.optional);
  const index = stappen.findIndex((s) => statussen[s.id] === 'nu');
  const klaar = stappen.filter((s) => statussen[s.id] === 'af').length;
  const laatste = Math.max(1, stappen.length - 1);
  return {
    nu: index === -1 ? null : stappen[index].id,
    klaar,
    totaal: stappen.length,
    lijn: index === -1 ? (klaar === stappen.length ? 100 : 0) : (index / laatste) * 100,
  };
}

export function standLabel(st: StapStatus): string {
  return st === 'af' ? 'klaar' : st === 'nu' ? 'nu aan de beurt' : st === 'optioneel' ? 'optioneel' : 'nog niet aan de beurt';
}

/**
 * Welke stap open staat nadat de stand veranderde. Stond de stap open die net een vinkje kreeg,
 * dan schuift hij door naar de nieuwe stap van nu. Keek je naar een andere stap, dan blijft die open.
 */
export function volgendeKeuze(gekozen: string | null, vorigeNu: string | null, nu: string | null): string | null {
  if (gekozen === null || gekozen === vorigeNu) return nu;
  return gekozen;
}
