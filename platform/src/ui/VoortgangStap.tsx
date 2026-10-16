import { filledFilesIn, mdFilesIn } from '../lib/levels/checks';
import type { VoortgangStep } from '../lib/levels/types';
import type { RepoSnapshot } from '../lib/repo/types';
import { CheckIcon, CircleIcon } from './icons';

/** Vakken die afvinken zodra een interview in je repo staat. Je AI zet het interview erin; het platform uploadt niets. */
export function VoortgangStap({ step, snapshot }: { step: VoortgangStep; snapshot: RepoSnapshot }) {
  const need = step.required(snapshot);
  const files = mdFilesIn(snapshot, step.folder);
  const filled = new Set(filledFilesIn(snapshot, step.folder));
  const slots = Array.from({ length: Math.max(need, files.length) }, (_, i) => files[i] ?? null);

  return (
    <div className="mt-4">
      <p className="text-sm font-semibold text-white">
        {filled.size} van de {need} interviews in je repo
      </p>
      <ol className="upload-vakken">
        {slots.map((path, i) => (
          <li key={path ?? `leeg-${i}`} className={path && filled.has(path) ? 'gevuld' : ''}>
            {path && filled.has(path) ? <CheckIcon /> : <CircleIcon />}
            <span>
              {path ? path.split('/').pop() : `Interview ${i + 1}`}
              {path && !filled.has(path) ? ' (nog niet ingevuld)' : ''}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
