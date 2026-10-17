import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { LevelState } from '../lib/levels/types';
import { HALTES } from './beleving';
import { Routekaart } from './Routekaart';

const stand = (huidig: number): Record<number, LevelState> =>
  Object.fromEntries([0, 1, 2, 3, 4, 5, 6].map((id) => [id, id < huidig ? 'done' : id === huidig ? 'active' : 'locked'])) as Record<number, LevelState>;

const render = (status: Record<number, LevelState>, van: number | null = null) => renderToStaticMarkup(<Routekaart status={status} van={van} />);
const haltes = (html: string) => [...html.matchAll(/<button[^>]*class="bl-halte ([^"]+)"[^>]*aria-label="([^"]+)"/g)].map((m) => [m[1], m[2]]);

describe('Routekaart', () => {
  it('heeft zeven lichtjes met hun staat, ook voor wie niet kijkt', () => {
    const lijst = haltes(render(stand(1)));
    expect(lijst).toHaveLength(7);
    expect(lijst[0]).toEqual(['af', 'Level 0: Werkplek, afgerond']);
    expect(lijst[1][0]).toMatch(/^nu gekozen$/);
    expect(lijst[1][1]).toBe('Level 1: Idee, nu bezig');
    expect(lijst[2]).toEqual(['dicht', 'Level 2: Probleem-validatie, op slot']);
  });

  it('jij staat bij je huidige level', () => {
    const html = render(stand(2));
    expect(html).toMatch(new RegExp(`class="bl-jij"[^>]*style="left:${HALTES[2].jx}%;top:${HALTES[2].jy}%;height:${HALTES[2].h}%"`));
  });

  it('onder de kaart staat je huidige level met een knop erheen', () => {
    const html = render(stand(0));
    expect(html).toContain('Level 0 · Nu bezig');
    expect(html).toContain('>Werkplek</h1>');
    expect(html).toMatch(/<a class="bl-knop" href="#\/level\/0">Begin met je werkplek →<\/a>/);
  });

  it('na een afgerond level staat jij nog bij dat level, met de melding en de wijzer naar het volgende', () => {
    const html = render(stand(1), 0);
    expect(html).toMatch(new RegExp(`class="bl-jij"[^>]*style="left:${HALTES[0].jx}%`));
    expect(html).toContain('Level 0 · Afgerond');
    expect(html).toContain('Klik op de kaart op het lichtje van level 1</b> om verder te gaan.');
    expect(html).not.toContain('href="#/level/1"');
    expect(html).toContain('Level 0 afgerond. Op naar idee!');
    expect(html).toMatch(new RegExp(`class="bl-wijzer"[^>]*style="left:${HALTES[1].x}%;top:${HALTES[1].y}%"`));
    expect(html).toContain('Je volgende level');
  });

  it('een level op slot zegt wanneer het opengaat', () => {
    const html = renderToStaticMarkup(<Routekaart status={stand(1)} van={null} begin={3} />);
    expect(html).toContain('Level 3 · Op slot');
    expect(html).toContain('Gaat open zodra je level 2 hebt afgerond.');
    expect(html).not.toContain('href="#/level/3"');
  });

  it('heeft in de demo knoppen om je voortgang te zetten, met je huidige level aan', () => {
    const html = renderToStaticMarkup(<Routekaart status={stand(2)} van={null} demo={{ onVoortgang: () => {}, bezig: false }} />);
    expect(html).toContain('<summary>Demo: zet je voortgang</summary>');
    const knoppen = [...html.matchAll(/<button type="button"( class="aan")?>(\d) ([^<]+)<\/button>/g)].map((m) => [m[2], Boolean(m[1])]);
    expect(knoppen).toHaveLength(7);
    expect(knoppen.filter(([, aan]) => aan)).toEqual([['2', true]]);
  });

  it('zonder demo staan die knoppen er niet', () => {
    expect(render(stand(2))).not.toContain('Demo: zet je voortgang');
  });
});
