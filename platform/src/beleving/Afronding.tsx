import { forwardRef } from 'react';
import { LEVELS } from '../lib/levels';
import type { LevelDef, LevelState } from '../lib/levels/types';
import { BELEVING, HALTES } from './beleving';
import type { StapStatus } from './voortgang';
import { strookUitsnede } from './voortgang';

type Props = {
  level: LevelDef;
  status: Record<number, LevelState>;
  statussen: Record<string, StapStatus>;
  levelAf: boolean;
  gevierd: boolean;
  /** Naar de routekaart; van = dit level, zodat je daar zichtbaar doorloopt. */
  onNaarRoute: (van: number) => void;
};

/** Slotscherm onder de stappen: wat je nu hebt, en waar je staat op de route. Uit de schets level0-v7. */
export const Afronding = forwardRef<HTMLElement, Props>(function Afronding({ level, statussen, levelAf, gevierd, onNaarRoute }, ref) {
  const b = BELEVING[level.id];
  const volgendeLevel = LEVELS.find((l) => l.id === level.id + 1);
  const hier = HALTES[level.id];
  const daar = volgendeLevel ? HALTES[volgendeLevel.id] : hier;
  const uitsnede = strookUitsnede(hier, daar);
  const klaar = b.slot.heb.filter((h) => statussen[h.stepId] === 'af').length;
  const nog = level.steps.filter((s) => !s.optional && statussen[s.id] !== 'af').length;

  return (
    <section ref={ref} className={`bl-afronding${levelAf ? ' is-af' : ''}${gevierd ? ' gevierd' : ''}`} aria-labelledby="bl-afronding-titel">
      <div className="bl-af-inhoud">
        <div className="bl-af-links">
          <div className="bl-label">
            Level {level.id} · {levelAf ? 'Afgerond' : level.name}
          </div>
          <h2 id="bl-afronding-titel">{levelAf ? b.slot.af : `Dit heb je na level ${level.id}.`}</h2>
          <p className="bl-zin" style={{ maxWidth: '36ch' }}>
            {levelAf ? 'Dit heb je nu:' : `${klaar} van ${b.slot.heb.length} af:`}
          </p>
          <ul className="bl-heb">
            {b.slot.heb.map((h) => {
              const ja = statussen[h.stepId] === 'af';
              return (
                <li key={h.stepId} className={ja ? 'ja' : ''}>
                  <span className="bol" aria-hidden="true">
                    {ja ? '✓' : ''}
                  </span>
                  <span>
                    <span dangerouslySetInnerHTML={{ __html: h.tekst }} />
                    {!ja && <span className="sr-only"> (nog niet)</span>}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="bl-af-rechts">
          <div className="bl-strook" aria-hidden="true">
            <div className="bl-strook-laag" style={{ left: `${uitsnede.left}%`, top: `${uitsnede.top}%`, width: `${uitsnede.zoom * 100}%` }}>
              <img className="plaat" src="/beelden/start-leeg.webp" alt="" />
              <img className="bl-strook-jij" src="/beelden/jij.webp" alt="" style={{ left: `${hier.jx}%`, top: `${hier.jy}%`, height: `${hier.h}%` }} />
              {levelAf && (
                <span className="bl-strook-af" style={{ left: `${hier.x}%`, top: `${hier.y}%` }}>
                  ✓
                </span>
              )}
              {volgendeLevel && (
                <>
                  <span className="bl-strook-volgende" style={{ left: `${daar.x}%`, top: `${daar.y}%` }} />
                  <span className="bl-strook-label" style={{ left: `${daar.x}%`, top: `${daar.y}%` }}>
                    {volgendeLevel.id} · {volgendeLevel.name}
                  </span>
                </>
              )}
            </div>
          </div>
          {b.volgende ? (
            <>
              <div className="bl-label" style={{ marginTop: 28 }}>
                Volgende stop
              </div>
              <h2 className="bl-af-volgende">{b.volgende.kop}</h2>
              <p className="bl-zin" style={{ maxWidth: '40ch' }}>
                {b.volgende.zin}
              </p>
              <button type="button" className="bl-knop" aria-disabled={!levelAf} onClick={() => levelAf && onNaarRoute(level.id)}>
                {b.volgende.knop} →
              </button>
            </>
          ) : (
            <>
              <div className="bl-label" style={{ marginTop: 28 }}>
                Hierna
              </div>
              <h2 className="bl-af-volgende">Op naar module 2.</h2>
              <p className="bl-zin" style={{ maxWidth: '40ch' }}>
                Je hebt Proof of Concept: je eerste betalende klant, en je weet hoe je verkoopt. Schaalbaar verkopen en positieve cashflow komen in module 2.
              </p>
              <button type="button" className="bl-knop" aria-disabled={!levelAf} onClick={() => levelAf && onNaarRoute(level.id)}>
                Bekijk je route →
              </button>
            </>
          )}
          {!levelAf && (
            <p className="bl-af-hint">
              Nog {nog} {nog === 1 ? 'stap' : 'stappen'}, {volgendeLevel ? `dan gaat level ${volgendeLevel.id} open` : 'dan is module 1 af'}.
            </p>
          )}
        </div>
      </div>
    </section>
  );
});
