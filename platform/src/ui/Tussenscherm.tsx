import type { LevelDef, LevelState } from '../lib/levels/types';
import { CheckIcon } from './icons';

/** Het level dat door de laatste actie af werd, of null. Bij het laden van de pagina (geen vorige stand) nooit. */
export function afgerondLevel(vorige: Record<number, LevelState> | null, nieuwe: Record<number, LevelState>, huidig: number): number | null {
  if (!vorige) return null;
  return vorige[huidig] !== 'done' && nieuwe[huidig] === 'done' ? huidig : null;
}

type Props = { level: LevelDef; volgende?: LevelDef; onVolgende?: () => void; onTerug: () => void };

/** Tussenscherm tussen twee levels: wat je haalde, wat je leerde, en wat er nu komt. */
export function Tussenscherm({ level, volgende, onVolgende, onTerug }: Props) {
  return (
    <section className="card tussenscherm" aria-labelledby="tussenscherm-titel">
      <p className="eyebrow">Level {level.id} af</p>
      <h1 id="tussenscherm-titel" className="level-titel">
        <span className="tussenscherm-vink" aria-hidden="true">
          <CheckIcon />
        </span>
        {level.name}
      </h1>
      <dl className="tussenscherm-lijst">
        <div>
          <dt>Gehaald</dt>
          <dd>{level.doel}</dd>
        </div>
        <div>
          <dt>Mijlpaal</dt>
          <dd>{level.milestone}</dd>
        </div>
        {level.begrip && (
          <div>
            <dt>Wat je leerde</dt>
            <dd>{level.begrip}</dd>
          </div>
        )}
        {level.kern && (
          <div>
            <dt>Staat in je repo</dt>
            <dd>
              <ul className="tussenscherm-kern">
                {level.kern.map((pad) => (
                  <li key={pad}>
                    <code>{pad}</code>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        )}
      </dl>
      {volgende ? (
        <div className="tussenscherm-volgende">
          <p className="eyebrow">Hierna</p>
          <h2 className="stap-titel">
            Level {volgende.id} · {volgende.name}
          </h2>
          {volgende.vraag && <p className="level-vraag">{volgende.vraag}</p>}
          <p className="mt-2">Je doel: {volgende.doel}</p>
        </div>
      ) : (
        <div className="tussenscherm-volgende">
          <p className="eyebrow">Hierna</p>
          <p>
            Je hebt Proof of Concept: je eerste betalende klant, en je weet hoe je verkoopt. Schaalbaar verkopen en positieve cashflow komen in module 2.
          </p>
        </div>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        {volgende && onVolgende && (
          <button type="button" className="btn-p" onClick={onVolgende}>
            Naar level {volgende.id}
          </button>
        )}
        <button type="button" className="btn-o" onClick={onTerug}>
          Terug naar level {level.id}
        </button>
      </div>
    </section>
  );
}
