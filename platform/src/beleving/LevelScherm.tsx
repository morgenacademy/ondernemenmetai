import { useEffect, useRef, useState } from 'react';
import { setupFrom } from '../lib/content';
import type { FileWrite, LevelDef, LevelEvaluation, LevelState } from '../lib/levels/types';
import type { RepoSnapshot } from '../lib/repo/types';
import { PLEK_LABEL } from '../ui/labels';
import { Afronding } from './Afronding';
import { BegripBeeld } from './BegripBeeld';
import { BELEVING } from './beleving';
import { KORT } from './kort';
import { LevelBord } from './LevelBord';
import { StapVenster } from './StapVenster';
import { useZichtbaar } from './useZichtbaar';
import { Voorbeeld } from './Voorbeeld';
import { stapStatussen } from './voortgang';

type Props = {
  level: LevelDef;
  state: LevelState;
  status: Record<number, LevelState>;
  snapshot: RepoSnapshot;
  evaluation: LevelEvaluation;
  handmatig: Set<string>;
  onHandmatig: (stepId: string) => void;
  onSave: (w: FileWrite) => Promise<boolean>;
  onDemoStap: (stepId: string) => void;
  onFillLevel: () => void;
  /** Naar de routekaart; van = het level dat je net afrondde. */
  onNaarRoute: (van: number | null) => void;
  /** Kijkt opnieuw in je repo. */
  onVervers: () => void;
};

/**
 * Eén level. Level 0 als in de schets level0-v7: beeld, het nieuwe woord, stap voor stap in een venster, en het slotscherm.
 * Level 1 tot en met 6 hebben een eigen speelbord (schets speelborden, 18 oktober), met hetzelfde slotscherm.
 */
export function LevelScherm({ level, state, status, snapshot, evaluation, handmatig, onHandmatig, onSave, onDemoStap, onFillLevel, onNaarRoute, onVervers }: Props) {
  const b = BELEVING[level.id];
  const wortel = useZichtbaar<HTMLDivElement>();
  const afronding = useRef<HTMLElement>(null);
  const [licht, setLicht] = useState(true);
  const [open, setOpen] = useState<number | null>(null);
  const [gevierd, setGevierd] = useState(false);
  const levelAf = state === 'done';
  const statussen = stapStatussen(level, evaluation, handmatig, levelAf);
  const telt = level.steps.filter((s) => !s.optional);
  const klaar = telt.filter((s) => statussen[s.id] === 'af').length;
  const setup = setupFrom(snapshot);

  // Wordt het level af terwijl je bezig bent, dan sluit het venster en kom je bij het slotscherm.
  const vorigeAf = useRef(levelAf);
  useEffect(() => {
    if (levelAf && !vorigeAf.current) {
      setOpen(null);
      afronding.current?.scrollIntoView({ behavior: 'smooth' });
      window.setTimeout(() => setGevierd(true), 500);
    }
    vorigeAf.current = levelAf;
  }, [levelAf]);

  const naarStappen = () => document.getElementById('bl-stappen')?.scrollIntoView({ behavior: 'smooth' });
  const naarAfronding = () => {
    setOpen(null);
    afronding.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const openStap = (i: number) => setOpen(i);
  const volgende = (vanaf: number) => {
    const nog = level.steps.findIndex((s, i) => i > vanaf && !s.optional);
    if (nog === -1) naarAfronding();
    else setOpen(nog);
  };

  if (state === 'locked') {
    return (
      <div ref={wortel}>
        <section className="bl-scene">
          <div className="bl-beeld" style={{ backgroundImage: `url('${b.beeld}')` }} />
          <div className="bl-tekst">
            <div className="bl-label bl-in">
              Level {level.id} · Op slot
            </div>
            <h1 className="bl-in d1">{b.kop}</h1>
            <p className="bl-zin bl-in d2">🔒 Dit level gaat open zodra je level {level.id - 1} hebt afgerond.</p>
            <button type="button" className="bl-knop bl-in d3" onClick={() => onNaarRoute(null)}>
              Terug naar je route →
            </button>
          </div>
        </section>
      </div>
    );
  }

  const afrondingScherm = (
    <Afronding ref={afronding} level={level} status={status} statussen={statussen} levelAf={levelAf} gevierd={gevierd} onNaarRoute={(van) => onNaarRoute(van)} />
  );

  if (level.id > 0)
    return (
      <div ref={wortel}>
        <LevelBord
          level={level}
          snapshot={snapshot}
          evaluation={evaluation}
          statussen={statussen}
          levelAf={levelAf}
          onSave={onSave}
          onDemoStap={onDemoStap}
          onHandmatig={onHandmatig}
          onFillLevel={onFillLevel}
          onVervers={onVervers}
        />
        {afrondingScherm}
      </div>
    );

  return (
    <div ref={wortel}>
      <section className="bl-scene">
        <div className="bl-beeld" style={{ backgroundImage: `url('${b.beeld}')` }} />
        <div className="bl-tekst">
          <div className="bl-label bl-in">
            Level {level.id} · {level.name}
          </div>
          <h1 className="bl-in d1">{b.kop}</h1>
          <p className="bl-zin bl-in d2">{b.zin}</p>
        </div>
        <button type="button" className="bl-scroll-hint" onClick={naarStappen}>
          Meteen naar de stappen ↓<span className="streep" aria-hidden="true" />
        </button>
      </section>

      {b.scenes.map((scene) =>
        scene.soort === 'beeld' ? (
          <section key={scene.kop} className="bl-scene">
            <div className="bl-beeld" style={{ backgroundImage: `url('${scene.beeld}')` }} />
            <div className="bl-tekst">
              <div className="bl-label bl-in">{scene.label}</div>
              <h2 className="bl-in d1">{scene.kop}</h2>
              <p className="bl-zin bl-in d2">
                {scene.zin} {scene.accent && <span className="bl-accent">{scene.accent}</span>}
              </p>
            </div>
          </section>
        ) : (
          <section key={scene.kop} className="bl-begrip">
            <div>
              <div className="bl-label bl-in">{scene.label}</div>
              <h2 className="bl-in d1">{scene.kop}</h2>
              <p className="bl-zin bl-in d2">{scene.zin}</p>
              <div className="bl-woord bl-in d2">
                <b>{scene.woord}</b> {scene.uitleg}
              </div>
            </div>
            <BegripBeeld soort={scene.beeld} level={level.id} />
          </section>
        ),
      )}

      <section className={`bl-stappen${licht ? ' licht' : ''}`} id="bl-stappen">
        <div className="bl-stappen-kop bl-in">
          <div>
            <div className="bl-label">Stap voor stap</div>
            <h2>{b.stappenKop}</h2>
          </div>
          <div className="bl-stappen-rechts">
            <p className="bl-voortgang">
              <b>
                {klaar} van {telt.length}
              </b>{' '}
              klaar
            </p>
            <div className="bl-thema" role="group" aria-label="Weergave van de stappen">
              <button type="button" aria-pressed={!licht} onClick={() => setLicht(false)}>
                Donker
              </button>
              <button type="button" aria-pressed={licht} onClick={() => setLicht(true)}>
                Licht
              </button>
            </div>
          </div>
        </div>
        <div className="bl-balk bl-in">
          <span style={{ width: `${(klaar / telt.length) * 100}%` }} />
        </div>
        <div className="bl-grid">
          {level.steps.map((step, i) => {
            const st = statussen[step.id];
            const nummer = step.optional ? null : telt.indexOf(step) + 1;
            const label = st === 'nu' ? 'Nu aan de beurt' : st === 'af' ? 'klaar' : st === 'optioneel' ? 'optioneel' : 'nog niet aan de beurt';
            return (
              <button
                key={step.id}
                type="button"
                className={`bl-stapkaart ${st}`}
                disabled={st === 'straks'}
                title={st === 'straks' ? 'Eerst de stap die nu aan de beurt is' : undefined}
                aria-label={`${nummer ? `Stap ${nummer}` : 'Optioneel'}: ${step.title}, ${label}`}
                onClick={() => openStap(i)}
              >
                <div className="voorbeeld">
                  <Voorbeeld step={step} setup={setup} />
                  {st === 'af' && (
                    <span className="bl-vinkje" aria-hidden="true">
                      ✓
                    </span>
                  )}
                  {st === 'straks' && (
                    <span className="bl-slotje" aria-hidden="true">
                      🔒
                    </span>
                  )}
                </div>
                <div className="tekstvak">
                  <div className="nr">
                    {nummer ? `Stap ${nummer}` : 'Optioneel'}
                    {st === 'nu' && (
                      <>
                        {' · '}
                        <span className="nu-label">Nu</span>
                      </>
                    )}
                    {st === 'af' && ' · Klaar'}
                  </div>
                  <h3>{step.title}</h3>
                  <p>{KORT[step.id]}</p>
                  <div className="bl-plekken">
                    {step.waar.map((p) => (
                      <span key={p} className={`bl-plek${p === 'platform' ? ' hier' : ''}`}>
                        {PLEK_LABEL[p]}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {!levelAf && (
          <div className="bl-stappen-demo">
            <button type="button" className="bl-knop-demo" onClick={onFillLevel}>
              Vul het hele level met demo content
            </button>
            <span>Demo: zet de content van elke stap in je repo, alsof jij en je AI het deden.</span>
          </div>
        )}
      </section>

      {afrondingScherm}

      {open !== null && level.steps[open] && (
        <StapVenster
          level={level}
          step={level.steps[open]}
          nummer={level.steps[open].optional ? undefined : telt.indexOf(level.steps[open]) + 1}
          totaal={telt.length}
          status={statussen[level.steps[open].id]}
          snapshot={snapshot}
          evaluation={evaluation}
          licht={licht}
          onSave={onSave}
          onDemo={() => onDemoStap(level.steps[open].id)}
          onKlaar={() => {
            onHandmatig(level.steps[open].id);
            volgende(open);
          }}
          onVorige={() => {
            const vorige = level.steps.map((s, i) => ({ s, i })).filter(({ s, i }) => i < open && !s.optional).pop();
            if (vorige) setOpen(vorige.i);
          }}
          onVolgende={() => volgende(open)}
          onSluit={() => setOpen(null)}
        />
      )}
    </div>
  );
}
