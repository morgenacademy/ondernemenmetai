import { SIMULATIONS } from '../demo/simulations';
import { setupFrom } from '../lib/content';
import { evaluateLevel } from '../lib/levels/evaluate';
import type { FileWrite, LevelDef, LevelState } from '../lib/levels/types';
import type { RepoSnapshot } from '../lib/repo/types';
import { STATE_LABEL } from './labels';
import { StapKaart } from './StapKaart';

type Props = {
  level: LevelDef;
  state: LevelState;
  snapshot: RepoSnapshot;
  onSave: (w: FileWrite) => Promise<boolean>;
  onSimulate: (stepId: string) => void;
  onNext?: () => void;
};

export function LevelPagina({ level, state, snapshot, onSave, onSimulate, onNext }: Props) {
  const header = (
    <header className="mb-6">
      <p className="eyebrow">
        Level {level.id} · {STATE_LABEL[state]}
      </p>
      <h1 className="level-titel">{level.name}</h1>
      <p className="mt-3">{level.summary}</p>
      <p className="mijlpaal">Mijlpaal: {level.milestone}</p>
    </header>
  );

  if (state === 'locked' || !level.ready) {
    return (
      <section className="card">
        {header}
        <p className="text-[var(--text-secondary)]">
          {state === 'locked'
            ? 'Dit level gaat open zodra je het vorige level hebt afgerond.'
            : 'Dit level komt in een volgende versie van het platform.'}
        </p>
      </section>
    );
  }

  const evaluation = evaluateLevel(level, snapshot);
  const setup = setupFrom(snapshot);
  return (
    <section>
      {header}
      {state === 'done' && (
        <div className="card mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="font-semibold text-white">Level af. Je repo laat zien dat je de mijlpaal hebt gehaald.</p>
          {onNext && (
            <button type="button" className="btn-p" onClick={onNext}>
              Naar het volgende level
            </button>
          )}
        </div>
      )}
      <div className="space-y-4">
        {level.steps.map((step) => {
          const sim = SIMULATIONS[step.id];
          // Optionele kaarten tellen niet mee: zo blijft de toets in level 1 stap 5.
          const nummer = step.optional ? undefined : level.steps.filter((s) => !s.optional).indexOf(step) + 1;
          return (
            <StapKaart
              key={step.id}
              level={level}
              step={step}
              nummer={nummer}
              snapshot={snapshot}
              evaluation={evaluation}
              setup={setup}
              onSave={onSave}
              simulation={sim ? { label: sim.label, onRun: () => onSimulate(step.id) } : undefined}
            />
          );
        })}
      </div>
    </section>
  );
}
