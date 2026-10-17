import type { LevelDef, LevelEvaluation, LevelState } from '../lib/levels/types';
import type { Halte } from './beleving';

export type StapStatus = 'af' | 'nu' | 'straks' | 'optioneel';

/**
 * Status per stap, zoals in de schets: wat af is, de ene stap die nu aan de beurt is, en wat straks komt.
 * Een stap met een check is af als de check groen is; een stap zonder check als je hem zelf afvinkte.
 * Is het level af, dan is elke stap af.
 */
export function stapStatussen(level: LevelDef, evaluation: LevelEvaluation, handmatig: Set<string>, levelAf: boolean): Record<string, StapStatus> {
  const status: Record<string, StapStatus> = {};
  let nuGezien = false;
  for (const step of level.steps) {
    if (step.optional) {
      status[step.id] = 'optioneel';
      continue;
    }
    const checks = evaluation.results.filter((r) => r.stepId === step.id);
    const af = levelAf || (checks.length > 0 ? checks.every((c) => c.ok) : handmatig.has(step.id));
    if (af) status[step.id] = 'af';
    else if (!nuGezien) {
      status[step.id] = 'nu';
      nuGezien = true;
    } else status[step.id] = 'straks';
  }
  return status;
}

/** Waar je op de route staat: het eerste level dat bezig is, of het laatste als alles af is. */
export function huidigLevel(status: Record<number, LevelState>): number {
  const ids = Object.keys(status).map(Number).sort((a, b) => a - b);
  return ids.find((id) => status[id] === 'active') ?? ids[ids.length - 1];
}

/**
 * Uitsnede van de routeplaat voor de strook op het slotscherm (verhouding 2:1).
 * Het midden tussen twee haltes komt in het midden; verre haltes liggen dichter bij elkaar, dus daar zoomt hij verder in.
 * left en top zijn procenten van de strook, zoom is de breedte van de plaat als veelvoud van de strook.
 */
export function strookUitsnede(van: Halte, naar: Halte): { left: number; top: number; zoom: number } {
  const zoom = Math.min(4, Math.max(1.6, 40 / Math.max(1, Math.abs(naar.x - van.x))));
  const midX = (van.x + naar.x) / 2;
  const midY = (van.y + naar.y) / 2;
  // De plaat is 1536 x 1024: zijn hoogte is zoom * 2/3 van de strookbreedte, en de strook is half zo hoog als breed.
  return { left: 50 - midX * zoom, top: 50 - (midY * zoom * 4) / 3, zoom };
}
