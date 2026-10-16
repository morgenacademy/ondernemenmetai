import { useState, type ChangeEvent } from 'react';
import { filledFilesIn, mdFilesIn } from '../lib/levels/checks';
import { TRANSCRIPT_EXTENSIONS, TRANSCRIPT_WEIGERTEKST, isTranscriptFileName, transcriptFromUpload } from '../lib/levels/level2';
import type { FileWrite, UploadStep } from '../lib/levels/types';
import type { RepoSnapshot } from '../lib/repo/types';
import { CheckIcon, CircleIcon } from './icons';

type Props = { step: UploadStep; snapshot: RepoSnapshot; onSave: (w: FileWrite) => Promise<boolean> };

export function UploadStap({ step, snapshot, onSave }: Props) {
  const [rol, setRol] = useState('');
  const [melding, setMelding] = useState<string | null>(null);
  const need = step.required(snapshot);
  const files = mdFilesIn(snapshot, step.folder);
  const filled = new Set(filledFilesIn(snapshot, step.folder));
  const slots = Array.from({ length: Math.max(need, files.length) }, (_, i) => files[i] ?? null);

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!isTranscriptFileName(file.name)) {
      setMelding(TRANSCRIPT_WEIGERTEKST);
      return;
    }
    const result = transcriptFromUpload(file.name, await file.text(), rol, snapshot);
    if ('error' in result) {
      setMelding(result.error);
      return;
    }
    if (await onSave(result)) {
      setMelding(`${result.path.split('/').pop()} staat in je repo.`);
      setRol('');
    }
  };

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
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[12rem] flex-1">
          <label htmlFor={`${step.id}-rol`} className="veld-label">
            Rol van de geïnterviewde
          </label>
          <input id={`${step.id}-rol`} className="veld" placeholder="bijvoorbeeld apotheker" value={rol} onChange={(e) => setRol(e.target.value)} />
        </div>
        <label className="btn-o">
          Upload transcript (.md, .txt of .vtt)
          <input
            type="file"
            accept={[...TRANSCRIPT_EXTENSIONS, 'text/plain', 'text/markdown', 'text/vtt'].join(',')}
            className="sr-only"
            aria-describedby={`${step.id}-privacy`}
            onChange={onFile}
          />
        </label>
      </div>
      <p id={`${step.id}-privacy`} className="mt-2 text-sm text-[var(--text-secondary)]">
        Namen eruit: gebruik een rol en initialen, nooit iemands volledige naam.
      </p>
      {melding && (
        <p role="status" className="mt-2 text-sm">
          {melding}
        </p>
      )}
    </div>
  );
}
