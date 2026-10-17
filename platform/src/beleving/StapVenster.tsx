import { useEffect, useRef, useState } from 'react';
import { DEMO_FORMS } from '../demo/formulieren';
import { demoVoorStap } from '../demo/vullen';
import { filterVariants, setupFrom, stepContent } from '../lib/content';
import type { FileWrite, LevelDef, LevelEvaluation, Step } from '../lib/levels/types';
import type { RepoSnapshot } from '../lib/repo/types';
import { DownloadStap } from '../ui/DownloadStap';
import { FormStap } from '../ui/FormStap';
import { InfoPopup } from '../ui/InfoPopup';
import { KopieerBlok } from '../ui/KopieerBlok';
import { PLEK_LABEL } from '../ui/labels';
import { Markdown } from '../ui/Markdown';
import { Paneel } from '../ui/Paneel';
import { VoortgangStap } from '../ui/VoortgangStap';
import { aiResultaat } from './resultaat';
import { Voorbeeld } from './Voorbeeld';
import type { StapStatus } from './voortgang';

/** De knoptekst van een stap die je zelf afvinkt, uit de schets van level 0. */
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
  /** Ontbreekt bij een optionele kaart. */
  nummer?: number;
  totaal: number;
  status: StapStatus;
  snapshot: RepoSnapshot;
  evaluation: LevelEvaluation;
  licht: boolean;
  onSave: (w: FileWrite) => Promise<boolean>;
  onDemo: () => void;
  /** Vinkt een stap zonder check af en gaat door. */
  onKlaar: () => void;
  onVorige: () => void;
  onVolgende: () => void;
  onSluit: () => void;
};

/** Koppelen in drie stappen, zoals in de schets: verbind op het platform, kies je repo op GitHub, terug op het platform. */
function Koppelen({ af, onKlaar }: { af: boolean; onKlaar: () => void }) {
  const [fase, setFase] = useState<1 | 2>(1);
  const [gekozen, setGekozen] = useState(false);
  const kop = (n: number, tekst: string) => (
    <div className="bl-waar">
      <span className="bl-waar-nr">{n}</span>
      {tekst}
    </div>
  );
  if (af)
    return (
      <div className="bl-paneel-echt" style={{ textAlign: 'center' }}>
        {kop(3, 'Terug op het platform')}
        <p className="bl-gelukt">✓ Gekoppeld met jij/mijn-onderneming</p>
        <p className="bl-hint">Het platform kan nu in die ene repo kijken en er je keuzes in zetten.</p>
      </div>
    );
  if (fase === 1)
    return (
      <div className="bl-paneel-echt" style={{ textAlign: 'center' }}>
        {kop(1, 'Hier op het platform')}
        <p className="bl-veldlabel">Het platform vraagt GitHub om toegang tot één repo.</p>
        <button type="button" className="bl-vknop p bl-markeer-knop" onClick={() => setFase(2)}>
          Verbind met GitHub
        </button>
      </div>
    );
  return (
    <div className="bl-paneel-echt">
      {kop(2, 'Nu ben je op GitHub')}
      <p className="bl-hint">In het echt opent GitHub in een nieuw tabblad. Hier is het nagebootst.</p>
      <div className="bl-scherm">
        <div className="balk">
          <i />
          <i />
          <i />
          <span className="url">github.com/apps/ondernemen-met-ai</span>
        </div>
        <div className="inhoud">
          <div style={{ fontSize: '1.35em', fontWeight: 600, marginBottom: '.6em' }}>Install Ondernemen met AI</div>
          <div className="gh-radio">
            <span className="r" />
            All repositories
          </div>
          <button type="button" className={`gh-radio${gekozen ? ' on' : ' markeer'}`} style={{ width: '100%', color: 'inherit', font: 'inherit', background: 'none', cursor: 'pointer' }} onClick={() => setGekozen(true)}>
            <span className="r" />
            Only select: <b>&nbsp;mijn-onderneming</b>
          </button>
          <div style={{ marginTop: '1em' }}>
            <button type="button" className={`gh-knop${gekozen ? ' markeer' : ''}`} disabled={!gekozen} style={gekozen ? undefined : { opacity: 0.5 }} onClick={onKlaar}>
              Install
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StapVenster({ level, step, nummer, totaal, status, snapshot, evaluation, licht, onSave, onDemo, onKlaar, onVorige, onVolgende, onSluit }: Props) {
  const titel = useRef<HTMLHeadingElement>(null);
  const vel = useRef<HTMLDivElement>(null);
  const groot = useRef<HTMLDivElement>(null);
  const setup = setupFrom(snapshot);
  const checks = evaluation.results.filter((r) => r.stepId === step.id);
  const handmatig = checks.length === 0 && !step.optional;
  const af = status === 'af';
  const laatste = nummer === totaal;
  const demo = demoVoorStap(step);
  const content = stepContent(level.id, step.id);
  const hint = step.hint?.(snapshot);
  const resultaat = af ? aiResultaat(step.id, snapshot) : null;

  // Elke stap begint bovenaan, ook als je in de vorige stap naar beneden scrolde.
  useEffect(() => {
    if (vel.current) vel.current.scrollTop = 0;
    if (groot.current) groot.current.scrollTop = 0;
    titel.current?.focus({ preventScroll: true });
  }, [step.id]);
  useEffect(() => {
    const toets = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.querySelector('dialog[open]')) onSluit();
    };
    document.addEventListener('keydown', toets);
    return () => document.removeEventListener('keydown', toets);
  }, [onSluit]);

  const links = (() => {
    if (step.id === 'l0-koppelen') return <Koppelen af={af} onKlaar={onKlaar} />;
    if (step.kind === 'form')
      return (
        <div className="bl-paneel-echt">
          <FormStap step={step} snapshot={snapshot} alreadyDone={af} onSave={onSave} demoWaarden={DEMO_FORMS[step.id]?.(snapshot)} />
          {step.paneel && <Paneel soort={step.paneel} snapshot={snapshot} />}
        </div>
      );
    if (step.kind === 'download')
      return (
        <div className="bl-paneel-echt">
          <DownloadStap setup={setup} />
        </div>
      );
    if (step.kind === 'voortgang')
      return (
        <div className="bl-paneel-echt">
          <VoortgangStap step={step} snapshot={snapshot} />
        </div>
      );
    return (
      <>
        <div className="bl-scherm-groot">
          <Voorbeeld step={step} setup={setup} />
        </div>
        {resultaat && (
          <div className="bl-resultaat">
            <p className="bl-resultaat-label">Je AI maakte</p>
            <div className="bl-bestand">
              <div className="naam">{resultaat.pad}</div>
              <pre className="regels">{resultaat.regels.join('\n')}</pre>
            </div>
          </div>
        )}
        {step.paneel && (
          <div className="bl-paneel-echt">
            <Paneel soort={step.paneel} snapshot={snapshot} />
          </div>
        )}
      </>
    );
  })();

  return (
    <div
      className={`bl-open${licht ? ' licht' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="bl-venster-titel"
      onClick={(e) => {
        if (e.target === e.currentTarget) onSluit();
      }}
    >
      <div className="bl-vel" ref={vel}>
        <button type="button" className="bl-sluit" aria-label="Sluiten" onClick={onSluit}>
          ×
        </button>
        <div className="bl-groot" ref={groot}>
          {links}
        </div>
        <div className="bl-uitleg">
          <div className="bl-eyebrow">
            <span>{nummer ? `Stap ${nummer} van ${totaal}` : 'Optioneel'}</span>
            {step.waar.map((p) => (
              <span key={p} className={`bl-plek${p === 'platform' ? ' hier' : ''}`}>
                {PLEK_LABEL[p]}
              </span>
            ))}
          </div>
          <h3 id="bl-venster-titel" ref={titel} tabIndex={-1}>
            {step.title}
          </h3>
          {hint && <blockquote className="stap-hint">{hint}</blockquote>}
          {content && <Markdown text={filterVariants(content, setup)} />}
          {step.popup && <InfoPopup levelId={level.id} popup={step.popup} />}
          {step.aiPrompt && <KopieerBlok prompt={step.aiPrompt} />}
          {checks.length > 0 && (
            <ul className="bl-checks" aria-label="Checks op je repo">
              {checks.map((c) => (
                <li key={c.id} className={c.ok ? 'ok' : ''}>
                  <span aria-hidden="true">{c.ok ? '✓' : '○'}</span>
                  <span>
                    {c.label}: {c.reason}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {/* Na afronden geen demoknop meer, behalve bij de interviewvakken: daar zet hij er telkens één bij. */}
          {demo?.soort === 'simulatie' && (!af || step.kind === 'voortgang') && (
            <div className="bl-demo-stap">
              <button type="button" className="bl-knop-demo" onClick={onDemo}>
                Vul met demo content
              </button>
              <span>Demo: {demo.label}</span>
            </div>
          )}
          <div className="bl-acties">
            {nummer !== undefined && nummer > 1 && (
              <button type="button" className="bl-vknop o" onClick={onVorige}>
                Vorige
              </button>
            )}
            {step.optional ? (
              <button type="button" className="bl-vknop p" onClick={onSluit}>
                Sluiten
              </button>
            ) : handmatig && !af ? (
              <button type="button" className="bl-vknop p" onClick={onKlaar}>
                {KLAAR_TEKST[step.id] ?? 'Klaar, volgende stap'}
              </button>
            ) : (
              <button type="button" className="bl-vknop p" disabled={!af} aria-describedby={af ? undefined : 'bl-waarom-niet'} onClick={onVolgende}>
                {af && laatste ? 'Klaar met dit level' : 'Volgende stap'}
              </button>
            )}
          </div>
          {!af && !handmatig && !step.optional && (
            <p className="bl-hint" id="bl-waarom-niet">
              Dit gaat vanzelf door zodra je repo het laat zien.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
