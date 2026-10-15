import type { LevelDef, LevelState } from '../lib/levels/types';
import { CheckIcon, LockIcon } from './icons';
import { STATE_LABEL } from './labels';

type Props = { levels: LevelDef[]; status: Record<number, LevelState>; selected: number; onSelect: (id: number) => void };

export function LevelKaart({ levels, status, selected, onSelect }: Props) {
  return (
    <nav aria-label="Levels" className="level-kaart mt-6">
      <ol className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {levels.map((level) => {
          const state = status[level.id];
          const isSelected = level.id === selected;
          return (
            <li key={level.id}>
              <button
                type="button"
                onClick={() => onSelect(level.id)}
                aria-current={isSelected ? 'step' : undefined}
                className={`level-node level-${state}${isSelected ? ' is-selected' : ''}`}
              >
                <span className="level-bol">
                  {state === 'done' ? <CheckIcon /> : state === 'locked' ? <LockIcon /> : level.id}
                </span>
                <span className="level-naam">{level.name}</span>
                <span className="level-status">{STATE_LABEL[state]}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
