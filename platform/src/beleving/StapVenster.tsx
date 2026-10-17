import { useEffect, useRef, useState } from 'react';
import { filterVariants, stepContent, type Setup } from '../lib/content';
import type { FileWrite, FormValues, LevelDef, LevelEvaluation, Step } from '../lib/levels/types';
import type { RepoSnapshot } from '../lib/repo/types';
import { DownloadStap } from '../ui/DownloadStap';
import { FormStap } from '../ui/FormStap';
import { CheckIcon, CircleIcon } from '../ui/icons';
import { InfoPopup } from '../ui/InfoPopup';
import { KopieerBlok } from '../ui/KopieerBlok';
import { Markdown } from '../ui/Markdown';
import { Paneel } from '../ui/Paneel';
import { VoortgangStap } from '../ui/VoortgangStap';
import { BELEVING } from './beleving';
import { KOPPEL_HANDELINGEN, KoppelDemo, type KoppelFase } from './KoppelDemo';
import type { StapStatus } from './voortgang';
import { EXTERN, Voorbeeld, plekLabel } from './Voorbeeld';

/** Wat je zegt als je een stap zelf afvinkt. */
const KLAAR_TEKST: Record<string, string> = {
  'l0-account': 'Klaar, ik heb een account',
  'l0-repo': 'Klaar, mijn repo staat',
  'l0-download': 'Klaar, de app werkt',
  'l0-github-desktop': 'Klaar, ik ben ingelogd',
  'l0-clonen': 'Klaar, mijn AI antwoordt',
};

type Props = {
  level: LevelDef;
  step: Step;
  status: StapStatus;
  snapshot: RepoSnapshot;
  evaluation: LevelEvaluation;
  setup: Setup;
  onSave: (w: FileWrite) => Promise<boolean>;
  /** Vinkt een stap zonder check af. */
  onKlaar: (stepId: string) => void;
  onSluit: () => void;
  onVorige?: () => void;
  onVolgende?: () => void;
  demo?: { waarden?: FormValues; label?: string; onRun?: () => void };
};

/** Eén stap groot open: links wat je doet (echt, of een nagetekend scherm), rechts de uitleg en de volgende stap. */
export function StapVenster({ level, step, status, snapshot, evaluation, setup, onSave, onKlaar, onSluit, onVorige, onVolgende, demo }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titel = useRef<HTMLHeadingElement>(null);
  const [koppel, setKoppel] = useState<KoppelFase>(status === 'af' ? 3 : 0);

  useEffect(() => {
    const d = dialog.current;
    if (d && !d.open) d.showModal?.();
    titel.current?.focus();
  }, [step.id]);
  useEffect(() => setKoppel(status === 'af' ? 3 : 0), [step.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const checks = evaluation.results.filter((r) => r.stepId === step.id);
  const af = status === 'af';
  const handmatig = checks.length === 0;
  const genummerd = level.steps.filter((s) => !s.optional);
  const nummer = genummerd.indexOf(step) + 1;
  const content = stepContent(level.id, step.id);
  const hint = step.hint?.(snapshot);
  const extern = EXTERN[step.id];
  const isKoppel = step.id === 'l0-koppelen';
  const beeld = BELEVING[level.id]?.beeld ?? '';

  let bediening;
  if (isKoppel) {
    bediening = (
      <KoppelDemo
        fase={af ? 3 : koppel}
        onFase={(f) => {
          setKoppel(f);
          if (f === 3) onKlaar(step.id);
        }}
      />
    );
  } else if (step.kind === 'form') {
    bediening = (
      <div className="bl-paneel-echt">
        <FormStap step={step} snapshot={snapshot} alreadyDone={af} onSave={onSave} demoWaarden={demo?.waarden} />
      </div>
    );
  } else if (step.kind === 'download') {
    bediening = <DownloadStap setup={setup} />;
  } else if (step.kind === 'voortgang') {
    bediening = (
      <div className="bl-paneel-echt">
        <VoortgangStap step={step} snapshot={snapshot} />
      </div>
    );
  } else {
    bediening = (
      <>
        <Voorbeeld step={step} snapshot={snapshot} beeld={beeld} />
        {extern && (
          <a className="bl-vknop o" href={extern.url} target="_blank" rel="noopener noreferrer">
            {extern.tekst} ↗<span className="sr-only"> (opent in een nieuw tabblad)</span>
          </a>
        )}
      </>
    );
  }

  const koppelBij = af ? 3 : koppel === 0 ? 0 : koppel === 1 ? 1 : koppel === 2 ? 2 : 3;
  const kanVerder = af || handmatig;
  const volgendeTekst = af ? (onVolgende ? 'Volgende stap' : 'Naar je slotscherm') : handmatig ? (KLAAR_TEKST[step.id] ?? 'Klaar, volgende stap') : 'Volgende stap';

  return (
    <dialog
      ref={dialog}
      className="bl-open licht"
      aria-labelledby="bl-venster-titel"
      onClose={onSluit}
      onClick={(e) => {
        if (e.target === dialog.current) dialog.current?.close();
      }}
    >
      <div className="bl-vel">
        <button type="button" className="bl-sluit" aria-label="Sluiten" onClick={() => dialog.current?.close()}>
          ×
        </button>
        <div className="bl-groot">{bediening}</div>
        <div className="bl-uitleg">
          <div className="bl-eyebrow">
            {step.optional ? 'Optioneel' : `Stap ${nummer} van ${genummerd.length}`} ·
            {step.waar.map((p) => (
              <span key={p} className={`bl-plek${p === 'platform' ? ' hier' : ''}`}>
                {plekLabel(p)}
              </span>
            ))}
          </div>
          <h3 id="bl-venster-titel" tabIndex={-1} ref={titel}>
            {step.title}
          </h3>
          {hint && <blockquote className="stap-hint">{hint}</blockquote>}
          {isKoppel ? (
            <ol className="bl-meelopen">
              {KOPPEL_HANDELINGEN.map((t, j) => {
                const st = j < koppelBij ? 'gedaan' : j === koppelBij ? 'nu' : 'later';
                return (
                  <li key={t} className={st}>
                    {st === 'gedaan' && <span className="sr-only">Gedaan: </span>}
                    <span dangerouslySetInnerHTML={{ __html: t }} />
                  </li>
                );
              })}
            </ol>
          ) : (
            content && <Markdown text={filterVariants(content, setup)} />
          )}
          {step.popup && <InfoPopup levelId={level.id} popup={step.popup} />}
          {step.aiPrompt && <KopieerBlok prompt={step.aiPrompt} />}
          {step.paneel && <Paneel soort={step.paneel} snapshot={snapshot} />}
          {checks.length > 0 && (
            <ul className="bl-checks" aria-label="Checks op je repo">
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
          {demo?.onRun && !af && (
            <div className="bl-demo-stap">
              <button type="button" className="bl-knop-demo" onClick={demo.onRun}>
                Vul met demo content
              </button>
              {demo.label && <span>Demo: {demo.label}</span>}
            </div>
          )}
          <div className="bl-acties">
            {onVorige && (
              <button type="button" className="bl-vknop o" onClick={onVorige}>
                Vorige
              </button>
            )}
            <button
              type="button"
              className="bl-vknop p"
              disabled={!kanVerder}
              aria-describedby={kanVerder ? undefined : 'bl-waarom-niet'}
              onClick={() => {
                if (!af && handmatig) onKlaar(step.id);
                if (onVolgende) onVolgende();
                else dialog.current?.close();
              }}
            >
              {volgendeTekst}
            </button>
          </div>
          {!kanVerder && (
            <p className="bl-hint" id="bl-waarom-niet">
              {isKoppel ? 'Rond eerst de stappen links af; daarna gaat dit vanzelf door.' : 'Dit gaat vanzelf door zodra de check hieronder klopt.'}
            </p>
          )}
        </div>
      </div>
    </dialog>
  );
}
