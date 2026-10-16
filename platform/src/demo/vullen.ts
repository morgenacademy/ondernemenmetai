import type { LevelDef, Step } from '../lib/levels/types';
import type { MockRepoAdapter } from '../lib/repo/mockRepo';
import { buildSnapshot } from '../lib/repo/snapshot';
import { DEMO_FORMS } from './formulieren';
import { SIMULATIONS } from './simulations';

/** Wat de knop "Vul met demo content" bij een stap doet: een formulier invullen, of nadoen wat je AI of jij buiten het platform doet. */
export type StapDemo = { soort: 'formulier' } | { soort: 'simulatie'; label: string };

export function demoVoorStap(step: Step): StapDemo | null {
  if (step.kind === 'form') return DEMO_FORMS[step.id] ? { soort: 'formulier' } : null;
  const sim = SIMULATIONS[step.id];
  return sim ? { soort: 'simulatie', label: sim.label } : null;
}

/** Zet de demo-content van één stap in de repo: bij een formulier wat het formulier zou opslaan. */
export async function vulStap(step: Step, repo: MockRepoAdapter): Promise<void> {
  const s = await buildSnapshot(repo);
  const waarden = DEMO_FORMS[step.id];
  if (step.kind === 'form' && waarden) {
    const w = step.toFile(waarden(s), s);
    await repo.writeFile(w.path, w.content, w.message);
    return;
  }
  await SIMULATIONS[step.id]?.run(repo, s);
}

/** Vult stap voor stap tot elke check van het level groen is. Optionele kaarten blijven leeg. */
export async function vulLevel(level: LevelDef, repo: MockRepoAdapter): Promise<void> {
  for (const step of level.steps) {
    const checks = level.checks.filter((c) => c.stepId === step.id);
    if (step.optional || checks.length === 0 || !demoVoorStap(step)) continue;
    // Een stap als "interview" zet er per keer één bij; de grens voorkomt een eindeloze lus als een check niet groen kan worden.
    for (let i = 0; i < 60; i++) {
      const s = await buildSnapshot(repo);
      if (checks.every((c) => c.run(s).ok)) break;
      await vulStap(step, repo);
    }
  }
}
