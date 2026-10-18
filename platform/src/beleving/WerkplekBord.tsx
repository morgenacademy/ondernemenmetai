import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { FileWrite, LevelDef, LevelEvaluation } from '../lib/levels/types';
import type { RepoSnapshot } from '../lib/repo/types';
import { BELEVING } from './beleving';
import { PAD, padStand, standLabel, volgendeKeuze, type Icoon } from './pad';
import { StapBlad } from './StapBlad';
import type { StapStatus } from './voortgang';

const PADEN: Record<Icoon | 'vink', ReactNode> = {
  account: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0" />,
  repo: <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />,
  koppelen: (
    <>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
      <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
    </>
  ),
  setup: (
    <>
      <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12" />
      <circle cx="16" cy="6" r="2" />
      <circle cx="10" cy="12" r="2" />
      <circle cx="18" cy="18" r="2" />
    </>
  ),
  app: <path d="M12 4v11m-4-4 4 4 4-4M5 20h14" />,
  desktop: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </>
  ),
  clonen: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </>
  ),
  push: <path d="M12 19V7m-5 5 5-5 5 5M5 4h14" />,
  vink: <path d="m5 12.5 4.5 4.5L19 7.5" />,
};

function Icoon({ naam }: { naam: Icoon | 'vink' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {PADEN[naam]}
    </svg>
  );
}

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
};

/**
 * Het speelbord van level 0 (schets level0-bord, 18 oktober): acht rondjes aan een lijn.
 * De kleur zegt waar je staat, het "Jij"-label staat bij de stap van nu, en het werkblad van het gekozen rondje staat eronder.
 */
export function WerkplekBord({ level, snapshot, evaluation, statussen, levelAf, onSave, onDemoStap, onHandmatig, onFillLevel }: Props) {
  const b = BELEVING[level.id];
  const stappen = level.steps.filter((s) => !s.optional);
  const stand = padStand(level, statussen);
  const [gekozen, setGekozen] = useState<string | null>(stand.nu);
  const titel = useRef<HTMLHeadingElement>(null);
  // Na een wissel die je niet zelf op het pad koos, gaat de focus naar de titel van het nieuwe werkblad.
  const focusNaWissel = useRef(false);
  const kies = (id: string | null, focus: boolean) => {
    focusNaWissel.current = focus;
    setGekozen(id);
  };
  useEffect(() => {
    if (!focusNaWissel.current) return;
    focusNaWissel.current = false;
    titel.current?.focus({ preventScroll: true });
  }, [gekozen]);

  // Krijgt de open stap een vinkje, dan schuift het werkblad door naar de volgende, met de focus op de titel.
  const vorigeNu = useRef(stand.nu);
  useEffect(() => {
    if (vorigeNu.current === stand.nu) return;
    const volgende = volgendeKeuze(gekozen, vorigeNu.current, stand.nu);
    vorigeNu.current = stand.nu;
    if (volgende !== gekozen) kies(volgende, true);
  }, [stand.nu, gekozen]);

  const open = stappen.find((s) => s.id === gekozen) ?? null;
  const nuIndex = stappen.findIndex((s) => s.id === stand.nu);

  return (
    <section className="bl-bord bl-werkplek" id="bl-stappen" aria-labelledby="bl-bord-vraag">
      <div className="bl-doek">
        <div className="bl-held" style={{ backgroundImage: `linear-gradient(0deg, #14102a 2%, rgba(20,16,42,.25) 55%, rgba(20,16,42,.55)), url('${b.beeld}')` }}>
          <div>
            <div className="bl-label">
              Level {level.id} · {level.name}
            </div>
            <h1 id="bl-bord-vraag">{b.bord?.vraag ?? b.kop}</h1>
            <p className="bl-zin">{b.bord?.zin ?? b.zin}</p>
          </div>
          <p className="bl-teller">
            <b>
              {stand.klaar}
              <small> / {stand.totaal}</small>
            </b>
            klaar
          </p>
        </div>
        <div className="bl-bord-inhoud">
          <div className="bl-pad">
            <div className="bl-pad-lijn" aria-hidden="true">
              <i style={{ width: `${stand.lijn}%` }} />
            </div>
            <ol>
              {stappen.map((step) => {
                const st = statussen[step.id];
                const pad = PAD[step.id] ?? { naam: step.title, icoon: 'account' as const };
                return (
                  <li key={step.id}>
                    <button
                      type="button"
                      className={`bl-rondje ${st}${step.id === gekozen ? ' gekozen' : ''}`}
                      aria-pressed={step.id === gekozen}
                      aria-controls={open ? 'bl-stapblad' : undefined}
                      aria-label={`${pad.naam}, ${standLabel(st)}`}
                      onClick={() => kies(step.id, false)}
                    >
                      {st === 'nu' && (
                        <span className="bl-pad-jij" aria-hidden="true">
                          Jij
                        </span>
                      )}
                      <span className="rond">
                        <Icoon naam={st === 'af' ? 'vink' : pad.icoon} />
                      </span>
                      <span className="naam">{pad.naam}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
          {open && (
            <StapBlad
              key={open.id}
              titelRef={titel}
              level={level}
              step={open}
              nummer={stappen.indexOf(open) + 1}
              totaal={stappen.length}
              status={statussen[open.id]}
              snapshot={snapshot}
              evaluation={evaluation}
              onSave={onSave}
              onDemo={() => onDemoStap(open.id)}
              onKlaar={() => onHandmatig(open.id)}
              eerst={nuIndex === -1 ? undefined : { nummer: nuIndex + 1, step: stappen[nuIndex] }}
              onNaarEerst={() => kies(stand.nu, true)}
            />
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
