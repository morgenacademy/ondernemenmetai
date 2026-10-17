import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { LEVELS } from '../lib/levels';
import type { LevelState } from '../lib/levels/types';
import { STATE_LABEL } from '../ui/labels';
import { BELEVING, HALTES } from './beleving';
import { huidigLevel } from './voortgang';

type Props = {
  status: Record<number, LevelState>;
  /** Het level dat je net afrondde: dan loop je zichtbaar door, en wijst de wijzer je volgende level aan. */
  van: number | null;
  /** Welk level onder de kaart staat bij het openen; standaard je huidige (of het afgeronde level, na afronden). */
  begin?: number;
  /** Bijvoorbeeld de knop "Ik heb een klant". */
  children?: ReactNode;
  /** Demo: spring naar een level; de levels ervoor worden met demo-content gevuld. */
  demo?: { onVoortgang: (levelId: number) => void; bezig: boolean };
};

const KLASSE: Record<LevelState, string> = { done: 'af', active: 'nu', locked: 'dicht' };

function rustig(): boolean {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/** Het padbeeld als levelkaart: zeven lichtjes, jij op je huidige plek, en het level dat je kiest eronder. */
export function Routekaart({ status, van, begin, children, demo }: Props) {
  const huidig = huidigLevel(status);
  const naAfronden = van !== null && van !== huidig;
  const [gekozen, setGekozen] = useState(begin ?? (naAfronden ? van : huidig));
  const [jijBij, setJijBij] = useState(naAfronden ? van : huidig);
  const [wijzer, setWijzer] = useState<'wacht' | 'aan' | 'weg'>(naAfronden ? 'wacht' : 'weg');
  const [melding, setMelding] = useState(false);

  useEffect(() => {
    if (!naAfronden) {
      // Ook na een demosprong: jij en het paneel gaan mee naar je huidige level.
      setJijBij(huidig);
      if (begin === undefined) setGekozen(huidig);
      return;
    }
    const snel = rustig();
    const lopen = setTimeout(() => {
      setJijBij(huidig);
      setMelding(true);
    }, snel ? 0 : 700);
    const wijs = setTimeout(() => setWijzer((w) => (w === 'wacht' ? 'aan' : w)), snel ? 0 : 3000);
    const stil = setTimeout(() => setMelding(false), 5200);
    return () => [lopen, wijs, stil].forEach(clearTimeout);
  }, [naAfronden, huidig, begin]);

  const kies = (id: number) => {
    setGekozen(id);
    if (id === huidig) setWijzer('weg');
  };

  const level = LEVELS.find((l) => l.id === gekozen) ?? LEVELS[0];
  const staat = status[level.id];
  const jij = HALTES[jijBij];
  const doel = HALTES[huidig];

  let actie: ReactNode;
  if (staat === 'locked') {
    actie = (
      <p className="bl-slot-uitleg">
        🔒 {level.opensEarly ? `Gaat open zodra je een klant hebt, of nadat je level ${level.id - 1} hebt afgerond.` : `Gaat open zodra je level ${level.id - 1} hebt afgerond.`}
      </p>
    );
  } else if (staat === 'done') {
    actie = (
      <>
        {level.id === van && wijzer !== 'weg' ? (
          <p className="bl-volgende-hint">
            ✓ Afgerond. <b>Klik op de kaart op het lichtje van level {huidig}</b> om verder te gaan.
          </p>
        ) : (
          <p className="bl-volgende-hint">✓ Afgerond.</p>
        )}
        <a className="bl-knop-tweede" href={`#/level/${level.id}`}>
          Bekijk dit level opnieuw
        </a>
      </>
    );
  } else {
    actie = (
      <a className="bl-knop" href={`#/level/${level.id}`}>
        {BELEVING[level.id]?.knop ?? `Open level ${level.id}`} →
      </a>
    );
  }

  return (
    <>
      <section className="bl-kaart" aria-label="Jouw route">
        <div className="bl-laag">
          <img className="plaat" src="/beelden/start-leeg.webp" alt="Een pad door de heuvels met zeven lichtjes, op weg naar een stad met een raket." />
          <img className="bl-jij" src="/beelden/jij.webp" alt="" style={{ left: `${jij.jx}%`, top: `${jij.jy}%`, height: `${jij.h}%` }} />
          {LEVELS.map((l, i) => {
            const h = HALTES[l.id];
            const s = status[l.id];
            return (
              <button
                key={l.id}
                type="button"
                className={`bl-halte ${KLASSE[s]}${l.id === gekozen ? ' gekozen' : ''}`}
                style={{ left: `${h.x}%`, top: `${h.y}%`, '--d': `${Math.max(22, 54 - i * 5)}px` } as CSSProperties}
                aria-label={`Level ${l.id}: ${l.name}, ${s === 'done' ? 'afgerond' : s === 'active' ? 'nu bezig' : 'op slot'}`}
                aria-pressed={l.id === gekozen}
                onClick={() => kies(l.id)}
              >
                <span className="ring" />
                <span className={`kaartje ${h.kant}`} aria-hidden="true">
                  <span className="nr">{l.id}</span>
                  {l.name}
                  {s === 'done' ? ' ✓' : s === 'locked' ? ' 🔒' : ''}
                </span>
              </button>
            );
          })}
          {naAfronden && wijzer !== 'weg' && (
            <button
              type="button"
              className={`bl-wijzer${wijzer === 'aan' ? ' aan' : ''}`}
              style={{ left: `${doel.x}%`, top: `${doel.y}%` }}
              tabIndex={-1}
              aria-hidden="true"
              onClick={() => kies(huidig)}
            >
              <span className="bl-wijzer-tekst">Je volgende level</span>
              <span className="bl-wijzer-pijl">↓</span>
            </button>
          )}
        </div>
      </section>

      <main className="bl-onder">
        <p className="bl-label">
          Level {level.id} · {STATE_LABEL[staat]}
        </p>
        <h1 className="bl-level-titel">{level.name}</h1>
        <p className="bl-doel">
          <b>Je doel:</b> {level.doel}
        </p>
        {level.milestone !== level.doel && <p className="bl-mijlpaal">Mijlpaal: {level.milestone}</p>}
        {actie}
        {children}
        {demo && (
          <details className="bl-demo">
            <summary>Demo: zet je voortgang</summary>
            <p>Vult de levels vóór het gekozen level met demo-content, alsof jij en je AI het deden.</p>
            <div className="rij">
              {LEVELS.map((l) => (
                <button key={l.id} type="button" className={l.id === huidig ? 'aan' : undefined} disabled={demo.bezig} onClick={() => demo.onVoortgang(l.id)}>
                  {`${l.id} ${l.name}`}
                </button>
              ))}
            </div>
          </details>
        )}
      </main>

      {naAfronden && (
        <div className={`bl-gevierd${melding ? ' aan' : ''}`} role="status">
          Level {van} afgerond. Op naar {(LEVELS.find((l) => l.id === huidig)?.name ?? '').toLowerCase()}!
        </div>
      )}
    </>
  );
}
