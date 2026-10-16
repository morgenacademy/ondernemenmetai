import type { RepoSnapshot } from '../repo/types';
import type { LevelDef, LevelEvaluation, LevelState } from './types';

export function evaluateLevel(level: LevelDef, s: RepoSnapshot): LevelEvaluation {
  const results = level.checks.map((check) => ({ id: check.id, stepId: check.stepId, label: check.label, ...check.run(s) }));
  return { levelId: level.id, done: level.ready && results.every((r) => r.ok), results };
}

/** Een level gaat pas open als alle levels ervoor af zijn. */
export function levelStatus(levels: LevelDef[], s: RepoSnapshot): Record<number, LevelState> {
  const status: Record<number, LevelState> = {};
  let blocked = false;
  for (const level of levels) {
    if (blocked) {
      status[level.id] = 'locked';
    } else if (evaluateLevel(level, s).done) {
      status[level.id] = 'done';
    } else {
      status[level.id] = 'active';
      blocked = true;
    }
  }
  return status;
}
