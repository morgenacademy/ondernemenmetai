import { useEffect, useRef, useState } from 'react';
import type { FileWrite, LevelDef, LevelEvaluation, LevelState } from '../lib/levels/types';
import type { RepoSnapshot } from '../lib/repo/types';
import { Afronding } from './Afronding';
import { BegripBeeld } from './BegripBeeld';
import { BELEVING } from './beleving';
import { LevelBord } from './LevelBord';
import { useZichtbaar } from './useZichtbaar';
import { WerkplekBord } from './WerkplekBord';
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
 * Eén level. Level 0 als in de schets level0-v7: beeld en het nieuwe woord, dan het speelbord uit de schets level0-bord en het slotscherm.
 * Level 1 tot en met 6 hebben een eigen speelbord (schets speelborden, 18 oktober), met hetzelfde slotscherm.
 */
export function LevelScherm({ level, state, status, snapshot, evaluation, handmatig, onHandmatig, onSave, onDemoStap, onFillLevel, onNaarRoute, onVervers }: Props) {
  const b = BELEVING[level.id];
  const wortel = useZichtbaar<HTMLDivElement>();
  const afronding = useRef<HTMLElement>(null);
  const [gevierd, setGevierd] = useState(false);
  const levelAf = state === 'done';
  const statussen = stapStatussen(level, evaluation, handmatig, levelAf);

  // Wordt het level af terwijl je bezig bent, dan kom je bij het slotscherm.
  const vorigeAf = useRef(levelAf);
  useEffect(() => {
    if (levelAf && !vorigeAf.current) {
      afronding.current?.scrollIntoView({ behavior: 'smooth' });
      window.setTimeout(() => setGevierd(true), 500);
    }
    vorigeAf.current = levelAf;
  }, [levelAf]);

  const naarStappen = () => document.getElementById('bl-stappen')?.scrollIntoView({ behavior: 'smooth' });

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
            <p className="bl-zin bl-in d2">🔒 Maak eerst level {level.id - 1} af: {BELEVING[level.id - 1].knop}.</p>
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

      <WerkplekBord
        level={level}
        snapshot={snapshot}
        evaluation={evaluation}
        statussen={statussen}
        levelAf={levelAf}
        onSave={onSave}
        onDemoStap={onDemoStap}
        onHandmatig={onHandmatig}
        onFillLevel={onFillLevel}
      />

      {afrondingScherm}
    </div>
  );
}
