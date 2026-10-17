import { describe, expect, it } from 'vitest';
import { LEVELS } from '../lib/levels';
import { evaluateLevel } from '../lib/levels/evaluate';
import { level0 } from '../lib/levels/level0';
import { level1 } from '../lib/levels/level1';
import { starterFiles } from '../lib/repo/starterFiles';
import { HALTES } from './beleving';
import { leesHandmatig, schrijfHandmatig } from './handmatig';
import { parseRoute, routeHash } from './route';
import { huidigLevel, repoZichtbaar, stapStatussen, strookUitsnede } from './voortgang';

const snap = (files: Record<string, string> = {}) => ({ files: { ...starterFiles, ...files }, mergedPullRequests: 0 });

describe('parseRoute', () => {
  it('begint bij het welkomstscherm, tot je de intro hebt gezien', () => {
    expect(parseRoute('', false)).toEqual({ scherm: 'welkom' });
    expect(parseRoute('', true)).toEqual({ scherm: 'route', van: null });
  });

  it('leest de route, met het level waar je vandaan komt', () => {
    expect(parseRoute('#/welkom', true)).toEqual({ scherm: 'welkom' });
    expect(parseRoute('#/route', false)).toEqual({ scherm: 'route', van: null });
    expect(parseRoute('#/route?van=2', false)).toEqual({ scherm: 'route', van: 2 });
    expect(parseRoute('#/level/3', false)).toEqual({ scherm: 'level', level: 3 });
  });

  it('een onbekend level of adres gaat naar de route', () => {
    expect(parseRoute('#/level/9', true)).toEqual({ scherm: 'route', van: null });
    expect(parseRoute('#/iets', true)).toEqual({ scherm: 'route', van: null });
  });

  it('routeHash is de omgekeerde van parseRoute', () => {
    for (const r of [{ scherm: 'welkom' } as const, { scherm: 'route', van: null } as const, { scherm: 'route', van: 1 } as const, { scherm: 'level', level: 4 } as const]) {
      expect(parseRoute(routeHash(r), true)).toEqual(r);
    }
  });
});

describe('stapStatussen', () => {
  it('de eerste stap is aan de beurt, de rest komt straks', () => {
    const s = snap();
    const status = stapStatussen(level0, evaluateLevel(level0, s), new Set(), false);
    expect(status['l0-account']).toBe('nu');
    expect(status['l0-repo']).toBe('straks');
  });

  it('een stap zonder check is af als je hem zelf afvinkt', () => {
    const s = snap();
    const status = stapStatussen(level0, evaluateLevel(level0, s), new Set(['l0-account']), false);
    expect(status['l0-account']).toBe('af');
    expect(status['l0-repo']).toBe('nu');
  });

  it('een stap met een check is af als de check groen is, ook zonder afvinken', () => {
    const s = snap({ 'level-0-werkplek/setup.md': '---\nos: mac\nai: codex\n---\n# Setup\n\nMac' });
    const status = stapStatussen(level0, evaluateLevel(level0, s), new Set(['l0-account', 'l0-repo', 'l0-koppelen']), false);
    expect(status['l0-setup']).toBe('af');
    expect(status['l0-download']).toBe('nu');
  });

  it('is het level af, dan zijn alle stappen af', () => {
    const status = stapStatussen(level0, evaluateLevel(level0, snap()), new Set(), true);
    expect(Object.values(status).every((s) => s === 'af')).toBe(true);
  });

  it('een optionele kaart telt niet mee', () => {
    const status = stapStatussen(level1, evaluateLevel(level1, snap()), new Set(), false);
    expect(status['l1-ideeen']).toBe('optioneel');
    expect(status['l1-idee']).toBe('nu');
  });
});

describe('huidigLevel', () => {
  it('is het eerste level dat bezig is, of het laatste als alles af is', () => {
    expect(huidigLevel({ 0: 'done', 1: 'active', 2: 'locked', 3: 'locked', 4: 'locked', 5: 'locked', 6: 'active' })).toBe(1);
    expect(huidigLevel(Object.fromEntries(LEVELS.map((l) => [l.id, 'done' as const])))).toBe(6);
  });
});

describe('route en strook', () => {
  it('heeft voor elk level een halte op de kaart', () => {
    for (const l of LEVELS) expect(HALTES[l.id], `level ${l.id}`).toBeDefined();
  });

  it('de strook zet het midden tussen deze halte en de volgende in beeld, en zoomt verder in op de verre levels', () => {
    const dichtbij = strookUitsnede(HALTES[0], HALTES[1]);
    const ver = strookUitsnede(HALTES[3], HALTES[4]);
    expect(ver.zoom).toBeGreaterThan(dichtbij.zoom);
    expect(dichtbij.zoom).toBeGreaterThanOrEqual(1.6);
    expect(ver.zoom).toBeLessThanOrEqual(4);
    // het midden tussen de twee haltes valt in het midden van de strook
    const midX = (HALTES[0].x + HALTES[1].x) / 2;
    expect(dichtbij.left + (midX / 100) * dichtbij.zoom * 100).toBeCloseTo(50, 0);
  });
});

describe('handmatig afgevinkte stappen', () => {
  it('blijven bewaard en komen terug', () => {
    const opslag = new Map<string, string>();
    const storage = { getItem: (k: string) => opslag.get(k) ?? null, setItem: (k: string, v: string) => void opslag.set(k, v), removeItem: (k: string) => void opslag.delete(k) };
    schrijfHandmatig(storage, new Set(['l0-account', 'l0-repo']));
    expect([...leesHandmatig(storage)].sort()).toEqual(['l0-account', 'l0-repo']);
  });

  it('kapotte of geblokkeerde opslag geeft een lege set', () => {
    expect(leesHandmatig({ getItem: () => '{kapot', setItem: () => {}, removeItem: () => {} }).size).toBe(0);
    expect(leesHandmatig({ getItem: () => { throw new Error('geblokkeerd'); }, setItem: () => {}, removeItem: () => {} }).size).toBe(0);
    expect(leesHandmatig(null).size).toBe(0);
  });
});

describe('repoZichtbaar', () => {
  it('"Jouw repo" verschijnt pas als je repo gekoppeld is, of level 0 af is', () => {
    const stand = { 0: 'active', 1: 'locked' } as const;
    expect(repoZichtbaar(new Set(), stand)).toBe(false);
    expect(repoZichtbaar(new Set(['l0-account', 'l0-repo']), stand)).toBe(false);
    expect(repoZichtbaar(new Set(['l0-koppelen']), stand)).toBe(true);
    expect(repoZichtbaar(new Set(), { 0: 'done', 1: 'active' })).toBe(true);
  });
});
