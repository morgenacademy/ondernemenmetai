import { DEMO_FORMS } from '../demo/formulieren';
import { demoVoorStap } from '../demo/vullen';
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
  /** Demo: zet de demo-content van een stap in de repo (voor stappen die je AI of jij buiten het platform doet). */
  onDemo: (stepId: string) => void;
  /** Demo: vult het hele level met demo-content, stap voor stap. */
  onFillLevel: () => void;
  onNext?: () => void;
};

export function LevelPagina({ level, state, snapshot, onSave, onDemo, onFillLevel, onNext }: Props) {
  const header = (
    <header className="mb-6">
      <p className="eyebrow">
        Level {level.id} · {STATE_LABEL[state]}
      </p>
      <h1 className="level-titel">{level.name}</h1>
      {level.vraag && <p className="level-vraag">{level.vraag}</p>}
      <div className="level-doel">
        <p className="eyebrow">Je doel</p>
        <p>{level.doel}</p>
      </div>
      {level.milestone !== level.doel && <p className="mijlpaal">Mijlpaal: {level.milestone}</p>}
    </header>
  );

  if (state === 'locked' || !level.ready) {
    return (
      <section className="card">
        {header}
        <p className="text-[var(--text-secondary)]">
          {state === 'locked' ? 'Dit level gaat open zodra je het vorige level hebt afgerond.' : 'Dit level komt in een volgende versie van het platform.'}
        </p>
        <p className="mt-3">{level.summary}</p>
      </section>
    );
  }

  const evaluation = evaluateLevel(level, snapshot);
  const setup = setupFrom(snapshot);
  const nummers = level.steps.filter((s) => !s.optional);
  return (
    <section>
      {header}
      {state === 'done' ? (
        <div className="card mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="font-semibold text-white">Level af. Je repo laat zien dat je de mijlpaal hebt gehaald.</p>
          {onNext && (
            <button type="button" className="btn-p" onClick={onNext}>
              Naar het volgende level
            </button>
          )}
        </div>
      ) : (
        <div className="demo-level mb-4">
          <button type="button" className="btn-demo btn-demo-groot" onClick={onFillLevel}>
            Vul het hele level met demo content
          </button>
          <span className="demo-uitleg">Demo: zet de content van elke stap in je repo, alsof jij en je AI het deden.</span>
        </div>
      )}
      <div className="space-y-4">
        {level.steps.map((step) => {
          const demo = demoVoorStap(step);
          const waarden = demo?.soort === 'formulier' ? DEMO_FORMS[step.id](snapshot) : undefined;
          return (
            <StapKaart
              key={step.id}
              level={level}
              step={step}
              // Optionele kaarten tellen niet mee: zo blijft de toets in level 1 stap 5.
              nummer={step.optional ? undefined : nummers.indexOf(step) + 1}
              snapshot={snapshot}
              evaluation={evaluation}
              setup={setup}
              onSave={onSave}
              demo={demo?.soort === 'simulatie' ? { label: demo.label, onRun: () => onDemo(step.id) } : waarden ? { waarden } : undefined}
            />
          );
        })}
      </div>
    </section>
  );
}
