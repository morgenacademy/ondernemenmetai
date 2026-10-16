import { filterVariants, stepContent, type Setup } from '../lib/content';
import type { FileWrite, LevelDef, LevelEvaluation, Step } from '../lib/levels/types';
import type { RepoSnapshot } from '../lib/repo/types';
import { FormStap } from './FormStap';
import { DownloadStap } from './DownloadStap';
import { CheckIcon, CircleIcon } from './icons';
import { KopieerBlok } from './KopieerBlok';
import { Markdown } from './Markdown';
import { UploadStap } from './UploadStap';

type Props = {
  level: LevelDef;
  step: Step;
  index: number;
  snapshot: RepoSnapshot;
  evaluation: LevelEvaluation;
  setup: Setup;
  onSave: (w: FileWrite) => Promise<boolean>;
  simulation?: { label: string; onRun: () => void };
};

export function StapKaart({ level, step, index, snapshot, evaluation, setup, onSave, simulation }: Props) {
  const checks = evaluation.results.filter((r) => r.stepId === step.id);
  const done = checks.length > 0 && checks.every((c) => c.ok);
  const content = stepContent(level.id, step.id);
  return (
    <article className={`card${done ? ' stap-af' : ''}`}>
      <header className="flex items-start gap-3">
        <span className="stap-nr">{done ? <CheckIcon /> : index + 1}</span>
        <h2 className="stap-titel">{step.title}</h2>
      </header>
      {content && <Markdown text={filterVariants(content, setup)} />}
      {step.kind === 'form' && <FormStap step={step} snapshot={snapshot} alreadyDone={done} onSave={onSave} />}
      {step.kind === 'uploads' && <UploadStap step={step} snapshot={snapshot} onSave={onSave} />}
      {step.kind === 'download' && <DownloadStap setup={setup} />}
      {step.aiPrompt && <KopieerBlok prompt={step.aiPrompt} />}
      {checks.length > 0 && (
        <ul className="checks" aria-label="Checks op je repo">
          {checks.map((c) => (
            <li key={c.id} className={c.ok ? 'ok' : ''}>
              {c.ok ? <CheckIcon /> : <CircleIcon />}
              <span>
                {c.label}: {c.reason}
              </span>
            </li>
          ))}
        </ul>
      )}
      {simulation && (
        <button type="button" className="btn-demo" onClick={simulation.onRun}>
          Demo: {simulation.label}
        </button>
      )}
    </article>
  );
}
