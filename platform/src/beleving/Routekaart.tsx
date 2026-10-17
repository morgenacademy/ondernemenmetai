import { useEffect, useState } from 'react';
import { LEVELS } from '../lib/levels';
import type { FileWrite, LevelState } from '../lib/levels/types';
import type { RepoSnapshot } from '../lib/repo/types';
import { KlantKnop } from '../ui/KlantKnop';
import { BELEVING, HALTES } from './beleving';
import { huidigLevel } from './voortgang';

type Props = {
  status: Record<number, LevelState>;
  /** Het level dat je net afrondde: dan loop je zichtbaar door naar het volgende lichtje. */
  van: number | null;
  snapshot: RepoSnapshot;
  onOpen: (levelId: number) => void;
  onDemoVoortgang: (levelId: number) => void;
  onReset: () => void;
  onKlant: (w: FileWrite) => Promise<boolean>;
  /** Demo bezig: de demoknoppen wachten even. */
  bezig: boolean;
  onAangekomen?: () => void;
};

const STAAT: Record<LevelState, { kort: 'af' | 'nu' | 'dicht'; label: string; aria: string }> = {
  done: { kort: 'af', label: 'Afgerond', aria: 'afgerond' },
  active: { kort: 'nu', label: 'Nu bezig', aria: 'nu bezig' },
  locked: { kort: 'dicht', label: 'Op slot', aria: 'op slot' },
};

/** De routekaart uit de schets levelkaart-v2: het pad met zeven lichtjes, en jij erop. */
export function Routekaart({ status, van, snapshot, onOpen, onDemoVoortgang, onReset, onKlant, bezig, onAangekomen }: Props) {
  const huidig = huidigLevel(status);
  const komtAan = van !== null && van < huidig;
  const [jijBij, setJijBij] = useState(komtAan ? van : huidig);
  const [gekozen, setGekozen] = useState(komtAan ? van : huidig);
  const [gevierd, setGevierd] = useState<string | null>(null);
  const [wijzer, setWijzer] = useState<number | null>(null);

  // Kom je net van een afgerond level, dan loop je naar het volgende lichtje. Dat level kies je daarna zelf: de wijzer laat zien waar.
  useEffect(() => {
    if (!komtAan) {
      setJijBij(huidig);
      return;
    }
    const timers = [
      window.setTimeout(() => {
        setJijBij(huidig);
        setGevierd(`Level ${van} afgerond. Op naar ${LEVELS[huidig].name.toLowerCase()}!`);
      }, 700),
      window.setTimeout(() => setGevierd(null), 4900),
      window.setTimeout(() => {
        setWijzer(huidig);
        onAangekomen?.();
      }, 3000),
    ];
    return () => timers.forEach((t) => window.clearTimeout(t));
    // Alleen bij aankomst; daarna volgt de kaart de stand van je repo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [komtAan, huidig]);

  const jij = HALTES[jijBij];
  const level = LEVELS.find((l) => l.id === gekozen) ?? LEVELS[0];
  const staat = STAAT[status[level.id]];
  const b = BELEVING[level.id];

  return (
    <div className="bl-route">
      <section className="bl-kaart" aria-label="Jouw route">
        <div className="bl-laag">
          <img className="plaat" src="/beelden/start-leeg.jpg" alt="Een pad door de heuvels met zeven lichtjes, op weg naar een stad met een raket." />
          <img className="bl-jij" src="/beelden/jij.png" alt="" style={{ left: `${jij.jx}%`, top: `${jij.jy}%`, height: `${jij.h}%` }} />
          {LEVELS.map((l, i) => {
            const h = HALTES[l.id];
            const s = STAAT[status[l.id]];
            return (
              <button
                key={l.id}
                type="button"
                className={`bl-halte ${s.kort}${l.id === gekozen ? ' gekozen' : ''}`}
                style={{ left: `${h.x}%`, top: `${h.y}%`, ['--d' as string]: `${Math.max(22, 54 - i * 5)}px` }}
                aria-label={`Level ${l.id}: ${l.name}, ${s.aria}`}
                aria-pressed={l.id === gekozen}
                onClick={() => {
                  setGekozen(l.id);
                  if (l.id === wijzer) setWijzer(null);
                }}
              >
                <span className="ring" />
                <span className={`kaartje ${h.kant}`} aria-hidden="true">
                  <span className="nr">{l.id}</span>
                  {l.name}
                  {s.kort === 'af' ? ' ✓' : s.kort === 'dicht' ? ' 🔒' : ''}
                </span>
              </button>
            );
          })}
          {wijzer !== null && (
            <button
              type="button"
              className="bl-wijzer aan"
              tabIndex={-1}
              aria-hidden="true"
              style={{ left: `${HALTES[wijzer].x}%`, top: `${HALTES[wijzer].y}%` }}
              onClick={() => {
                setGekozen(wijzer);
                setWijzer(null);
              }}
            >
              <span className="bl-wijzer-tekst">Je volgende level</span>
              <span className="bl-wijzer-pijl">↓</span>
            </button>
          )}
        </div>
      </section>

      <main className="bl-onder">
        <p className="bl-label">
          Level {level.id} · {staat.label}
        </p>
        <h1 className="bl-level-titel">{level.name}</h1>
        {level.vraag && <p className="bl-samenvatting">{level.vraag}</p>}
        <p className="bl-doel">
          <b>Je doel:</b> {level.doel}
        </p>
        {level.milestone !== level.doel && <p className="bl-mijlpaal">Mijlpaal: {level.milestone}</p>}
        {staat.kort === 'nu' && (
          <button type="button" className="bl-knop" onClick={() => onOpen(level.id)}>
            {b.knop} →
          </button>
        )}
        {staat.kort === 'af' && (
          <>
            {level.id !== huidig && (
              <p className="bl-volgende-hint">
                ✓ Afgerond. <b>Klik op de kaart op het lichtje van level {huidig}</b> om verder te gaan.
              </p>
            )}
            <button type="button" className="bl-knop-tweede" onClick={() => onOpen(level.id)}>
              Bekijk dit level opnieuw
            </button>
          </>
        )}
        {staat.kort === 'dicht' && (
          <p className="bl-slot-uitleg">
            🔒 Gaat open zodra je level {level.id - 1} hebt afgerond.
            {level.opensEarly && ' Of eerder: zodra je een klant hebt.'}
          </p>
        )}
        {status[1] !== 'locked' && status[6] === 'locked' && (
          <div className="bl-klant">
            <KlantKnop snapshot={snapshot} onSave={onKlant} />
          </div>
        )}
        <details className="bl-demo">
          <summary>Demo: zet je voortgang</summary>
          <p>Vult de levels vóór het gekozen level met demo content, alsof jij en je AI het deden.</p>
          <div className="rij">
            {LEVELS.map((l) => (
              <button key={l.id} type="button" className={l.id === huidig ? 'aan' : ''} disabled={bezig} onClick={() => onDemoVoortgang(l.id)}>
                {l.id} {l.name}
              </button>
            ))}
            <button type="button" disabled={bezig} onClick={onReset}>
              Opnieuw beginnen
            </button>
          </div>
        </details>
      </main>
      <div className={`bl-gevierd${gevierd ? ' aan' : ''}`} role="status">
        {gevierd}
      </div>
    </div>
  );
}
