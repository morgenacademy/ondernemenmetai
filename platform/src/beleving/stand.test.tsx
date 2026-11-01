import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { LEVELS } from '../lib/levels';
import { evaluateLevel } from '../lib/levels/evaluate';
import type { LevelState } from '../lib/levels/types';
import { starterFiles } from '../lib/repo/starterFiles';
import { LevelScherm } from './LevelScherm';
import { Routekaart } from './Routekaart';
import { ECHT_VOORBEELD, StandContext } from './stand';

const snapshot = { files: starterFiles, mergedPullRequests: 0 };
const level = (id: number) => LEVELS.find((l) => l.id === id)!;
const status = (actief: number): Record<number, LevelState> =>
  Object.fromEntries(LEVELS.map((l) => [l.id, l.id < actief ? 'done' : l.id === actief ? 'active' : 'locked']));
const niets = () => {};

const routekaart = () => (
  <Routekaart status={status(1)} van={null} snapshot={snapshot} onOpen={niets} onDemoVoortgang={niets} onReset={niets} onKlant={async () => true} bezig={false} />
);
const echt = (kind: React.ReactElement) => renderToStaticMarkup(<StandContext.Provider value={ECHT_VOORBEELD}>{kind}</StandContext.Provider>);

const levelScherm = (id: number) => {
  const l = level(id);
  return (
    <LevelScherm
      level={l}
      state={status(id)[id]}
      status={status(id)}
      snapshot={snapshot}
      evaluation={evaluateLevel(l, snapshot)}
      handmatig={new Set()}
      onHandmatig={niets}
      onSave={async () => true}
      onDemoStap={niets}
      onFillLevel={niets}
      onNaarRoute={niets}
      onVervers={niets}
    />
  );
};

describe('de echte stand', () => {
  it('Routekaart in de echte stand heeft geen demoblok, maar wel "Ik heb een klant"', () => {
    const html = echt(routekaart());
    expect(html).not.toContain('Demo: zet je voortgang');
    expect(html).toContain('Ik heb een klant');
  });

  for (const id of [1, 0]) {
    it(`level ${id} in de echte stand heeft geen demoknoppen`, () => {
      const html = echt(levelScherm(id));
      expect(html).not.toContain('Vul het hele level met demo content');
      expect(html).not.toContain('Vul met demo content');
      expect(html).not.toContain('btn-demo');
    });
  }

  it('zonder provider staan de demoknoppen er wel', () => {
    expect(renderToStaticMarkup(routekaart())).toContain('Demo: zet je voortgang');
    expect(renderToStaticMarkup(levelScherm(1))).toContain('Vul met demo content');
  });
});
