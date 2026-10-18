import { forwardRef } from 'react';
import { DEMO_FORMS } from '../demo/formulieren';
import type { FileWrite, LevelDef, LevelEvaluation } from '../lib/levels/types';
import type { RepoSnapshot } from '../lib/repo/types';
import { FormStap } from '../ui/FormStap';
import { InfoPopup } from '../ui/InfoPopup';
import { KopieerBlok } from '../ui/KopieerBlok';
import { Paneel } from '../ui/Paneel';
import { GesprekkenWerkblad } from './GesprekkenWerkblad';
import { KORT } from './kort';
import { MadlibWerkblad } from './MadlibWerkblad';
import { aiBestand, aiResultaat } from './resultaat';
import { DemoRegel, Uitleg, WerkbladKader } from './WerkbladDelen';
import { werkbladNaam, werkbladVorm, type Vorm, type Werkblad as WerkbladData } from './werkbladen';

type Props = {
  level: LevelDef;
  werkblad: WerkbladData;
  snapshot: RepoSnapshot;
  evaluation: LevelEvaluation;
  onSave: (w: FileWrite) => Promise<boolean>;
  onDemoStap: (stepId: string) => void;
  onHandmatig: (stepId: string) => void;
  onVervers: () => void;
};

/** Het werkblad waar je nu bent, in de vorm die bij de stap past. */
export const Werkblad = forwardRef<HTMLHeadingElement, Props>(function Werkblad({ level, werkblad, snapshot, evaluation, onSave, onDemoStap, onHandmatig, onVervers }, kop) {
  const step = werkblad.stappen.find((s) => s.id === werkblad.id) ?? werkblad.stappen[0];
  const naam = werkbladNaam(werkblad.id, step.title);
  const demo = () => onDemoStap(step.id);

  if (step.kind === 'form' && step.id === 'l1-madlib')
    return <MadlibWerkblad ref={kop} level={level} step={step} naam={naam} snapshot={snapshot} onSave={onSave} />;
  if (step.kind === 'voortgang') return <GesprekkenWerkblad ref={kop} id={werkblad.id} naam={naam} step={step} snapshot={snapshot} onSave={onSave} onVervers={onVervers} onDemo={demo} />;

  const hint = step.hint?.(snapshot);
  if (step.kind === 'form')
    return (
      <WerkbladKader ref={kop} id={werkblad.id} naam={naam}>
        {hint && <blockquote className="stap-hint">{hint}</blockquote>}
        <FormStap step={step} snapshot={snapshot} alreadyDone={false} onSave={onSave} demoWaarden={DEMO_FORMS[step.id]?.(snapshot)} />
        {step.paneel && <Paneel soort={step.paneel} snapshot={snapshot} />}
        {step.popup && <InfoPopup levelId={level.id} popup={step.popup} link />}
        <Uitleg levelId={level.id} step={step} snapshot={snapshot} />
      </WerkbladKader>
    );

  // Een AI-stap: het vlak waar het resultaat komt, en de opdracht voor je AI.
  const checks = evaluation.results.filter((r) => r.stepId === step.id);
  const handmatig = checks.length === 0;
  const resultaat = aiResultaat(step.id, snapshot);
  const pad = aiBestand(step.id, snapshot);
  return (
    <WerkbladKader ref={kop} id={werkblad.id} naam={naam}>
      {KORT[step.id] && <p className="bl-wb-zin">{KORT[step.id]}</p>}
      {hint && <blockquote className="stap-hint">{hint}</blockquote>}
      <div className="bl-wb-twee">
        <div className="bl-wb-vlak">
          {resultaat ? (
            <div className="bl-wb-bestand">
              <div className="naam">{resultaat.pad}</div>
              <pre>{resultaat.regels.join('\n')}</pre>
            </div>
          ) : (
            <div className="bl-wb-leeg">
              {pad && <code>{pad}</code>}
              <span>Hier komt wat je AI maakt.</span>
            </div>
          )}
        </div>
        <div className="bl-wb-opdracht">
          {step.aiPrompt && <KopieerBlok prompt={step.aiPrompt} />}
          {step.popup && <InfoPopup levelId={level.id} popup={step.popup} link />}
          {handmatig ? (
            <button type="button" className="bl-wb-knop" onClick={() => onHandmatig(step.id)}>
              Klaar, volgende stap
            </button>
          ) : (
            <p className="bl-wb-hint">
              Staat je wijziging op GitHub, dan krijgt deze stap vanzelf een vinkje.{' '}
              <button type="button" className="bl-linkknop" onClick={onVervers}>
                Ververs
              </button>
            </p>
          )}
        </div>
      </div>
      <Uitleg levelId={level.id} step={step} snapshot={snapshot} kop="Zo doe je het" />
      <DemoRegel step={step} onDemo={demo} />
    </WerkbladKader>
  );
});

/** Wat door de grijze laag van een gesloten werkblad schemert. */
function VormVlak({ vorm }: { vorm: Vorm }) {
  const n = (k: number, cls: string) => Array.from({ length: k }, (_, i) => <i key={i} className={cls} />);
  if (vorm === 'canvas')
    return (
      <div className="bl-vorm rij midden">
        <i className="vak groot" />
        <i className="vak groot rond" />
      </div>
    );
  if (vorm === 'vakken') return <div className="bl-vorm rij">{n(5, 'vak')}</div>;
  if (vorm === 'blok') return <div className="bl-vorm">{n(1, 'vak breed')}</div>;
  if (vorm === 'ronde')
    return (
      <div className="bl-vorm rij">
        <i className="vak groot rond" />
        <span className="kolom">{n(2, 'lijn')}</span>
      </div>
    );
  if (vorm === 'keuze') return <div className="bl-vorm rij">{n(2, 'vak laag')}</div>;
  if (vorm === 'bmc') return <div className="bl-vorm rij">{n(5, 'vak laag')}</div>;
  if (vorm === 'drie') return <div className="bl-vorm rij">{n(3, 'vak laag')}</div>;
  return <div className="bl-vorm">{n(3, 'lijn')}</div>;
}

/** Een werkblad dat nog komt: grijs, op slot, met een korte reden. Er valt niets te bedienen. */
export function GeslotenWerkblad({ id, naam, reden }: { id: string; naam: string; reden: string }) {
  return (
    <section className="bl-gesloten">
      <h3>{naam}</h3>
      <div aria-hidden="true">
        <VormVlak vorm={werkbladVorm(id)} />
      </div>
      <div className="bl-slot">
        <span className="bl-slot-ikoon" aria-hidden="true">
          🔒
        </span>
        <span className="sr-only">Op slot: </span>
        <span className="bl-slot-reden">{reden}</span>
      </div>
    </section>
  );
}
