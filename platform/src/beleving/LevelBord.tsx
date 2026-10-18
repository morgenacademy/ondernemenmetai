import { useEffect, useRef, useState } from 'react';
import type { FileWrite, LevelDef, LevelEvaluation } from '../lib/levels/types';
import type { RepoSnapshot } from '../lib/repo/types';
import { KopieerBlok } from '../ui/KopieerBlok';
import { BELEVING } from './beleving';
import type { StapStatus } from './voortgang';
import { GeslotenWerkblad, Werkblad } from './Werkblad';
import { Uitleg } from './WerkbladDelen';
import { afRegel, bordVan, slotRedenen, werkbladNaam } from './werkbladen';

/** Wat er op de omlijnde regel van een optionele stap staat, na de titel. */
const OPTIE_ZIN: Record<string, string> = { 'l1-ideeen': 'Laat je AI drie richtingen bedenken' };

type Props = {
  level: LevelDef;
  snapshot: RepoSnapshot;
  evaluation: LevelEvaluation;
  statussen: Record<string, StapStatus>;
  levelAf: boolean;
  onSave: (w: FileWrite) => Promise<boolean>;
  onDemoStap: (stepId: string) => void;
  onHandmatig: (stepId: string) => void;
  onFillLevel: () => void;
  onVervers: () => void;
};

/**
 * Het speelbord van level 1 tot en met 6: het level donker, met één vraag en één zin.
 * Wat af is, staat bovenaan met een vinkje. De stap waar je bent, is één licht werkblad. Wat nog komt, ligt eronder op slot.
 */
export function LevelBord({ level, snapshot, evaluation, statussen, levelAf, onSave, onDemoStap, onHandmatig, onFillLevel, onVervers }: Props) {
  const b = BELEVING[level.id];
  const bord = bordVan(level, statussen);
  const slots = slotRedenen(level, bord, snapshot);
  const kop = useRef<HTMLHeadingElement>(null);
  const [optie, setOptie] = useState<string | null>(null);
  const opties = levelAf ? [] : bord.opties;

  // Is een werkblad af, dan gaat de focus naar het volgende: zo weet je met het toetsenbord waar je bent.
  const nuId = bord.nu?.id ?? null;
  const vorige = useRef(nuId);
  useEffect(() => {
    if (nuId && vorige.current !== nuId) kop.current?.focus();
    vorige.current = nuId;
  }, [nuId]);

  // De knop op een slotje brengt je naar het werkblad waar je nu bent.
  const naarNu = () => {
    kop.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    kop.current?.focus({ preventScroll: true });
  };

  return (
    <section className="bl-bord" aria-labelledby="bl-bord-vraag">
      <div className="bl-doek">
        <div className="bl-held" style={{ backgroundImage: `linear-gradient(0deg, #14102a 2%, rgba(20,16,42,.25) 55%, rgba(20,16,42,.55)), url('${b.beeld}')` }}>
          <div>
            <div className="bl-label">
              Level {level.id} · {level.name}
            </div>
            <h1 id="bl-bord-vraag">{b.bord?.vraag ?? b.kop}</h1>
            <p className="bl-zin">{b.bord?.zin ?? b.zin}</p>
          </div>
        </div>
        <div className="bl-bord-inhoud">
          {(bord.af.length > 0 || opties.length > 0) && (
            <ul className="bl-regels">
              {bord.af.map((w) => (
                <li key={w.id} className="bl-af-regel">
                  <span className="v" aria-hidden="true">
                    ✓
                  </span>
                  {afRegel(w.id, snapshot)}
                  <span className="sr-only">, af</span>
                </li>
              ))}
              {opties.map((step) => (
                // Een optionele stap: een omlijnde regel die openklapt met de opdracht voor je AI.
                <li key={step.id}>
                  <button type="button" className="bl-optie" aria-expanded={optie === step.id} aria-controls={`bl-optie-${step.id}`} onClick={() => setOptie(optie === step.id ? null : step.id)}>
                    <span className="v" aria-hidden="true">
                      ?
                    </span>
                    {step.title} {OPTIE_ZIN[step.id] ?? ''}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {opties.map((step) => (
            <div key={step.id} id={`bl-optie-${step.id}`} className="bl-optie-paneel" hidden={optie !== step.id}>
              {step.aiPrompt && <KopieerBlok prompt={step.aiPrompt} />}
              <Uitleg levelId={level.id} step={step} snapshot={snapshot} />
            </div>
          ))}
          {bord.nu && (
            <Werkblad
              key={bord.nu.id}
              ref={kop}
              level={level}
              werkblad={bord.nu}
              snapshot={snapshot}
              evaluation={evaluation}
              onSave={onSave}
              onDemoStap={onDemoStap}
              onHandmatig={onHandmatig}
              onVervers={onVervers}
            />
          )}
          {bord.straks.length > 0 && (
            <div className="bl-straks">
              {bord.straks.map((w) => (
                <GeslotenWerkblad key={w.id} id={w.id} naam={werkbladNaam(w.id, w.stappen[0].title)} slot={slots[w.id]} onNaar={naarNu} />
              ))}
            </div>
          )}
          {!levelAf && (
            <div className="bl-bord-demo">
              <button type="button" className="bl-knop-demo" onClick={onFillLevel}>
                Vul het hele level met demo content
              </button>
              <span>Demo: zet de content van elke stap in je repo, alsof jij en je AI het deden.</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
