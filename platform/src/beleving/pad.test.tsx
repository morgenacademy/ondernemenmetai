import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { LEVELS } from '../lib/levels';
import { evaluateLevel } from '../lib/levels/evaluate';
import { starterFiles } from '../lib/repo/starterFiles';
import { PAD, padStand, volgendeKeuze } from './pad';
import { stapStatussen } from './voortgang';
import { WerkplekBord } from './WerkplekBord';

const level0 = LEVELS.find((l) => l.id === 0)!;
const snapshot = { files: starterFiles, mergedPullRequests: 0 };
const niets = () => {};
const statussen = (handmatig: string[], levelAf = false) => stapStatussen(level0, evaluateLevel(level0, snapshot), new Set(handmatig), levelAf);
const bord = (handmatig: string[], levelAf = false) =>
  renderToStaticMarkup(
    <WerkplekBord level={level0} snapshot={snapshot} evaluation={evaluateLevel(level0, snapshot)} statussen={statussen(handmatig, levelAf)} levelAf={levelAf} onSave={async () => true} onDemoStap={niets} onHandmatig={niets} onFillLevel={niets} />,
  );

describe('het pad van level 0', () => {
  it('elke stap van level 0 heeft een kort label, in de volgorde van de schets', () => {
    expect(level0.steps.map((s) => PAD[s.id]?.naam)).toEqual(['Account', 'Repo', 'Koppelen', 'Setup', 'AI-app', 'Desktop', 'Clonen', '1e push']);
  });

  it('de lijn licht op tot de stap die nu aan de beurt is', () => {
    expect(padStand(level0, statussen([]))).toEqual({ nu: 'l0-account', klaar: 0, totaal: 8, lijn: 0 });
    const stand = padStand(level0, statussen(['l0-account', 'l0-repo']));
    expect(stand.nu).toBe('l0-koppelen');
    expect(stand.klaar).toBe(2);
    expect(stand.lijn).toBeCloseTo((2 / 7) * 100);
  });

  it('is level 0 af, dan is de lijn helemaal aan en is er geen stap van nu', () => {
    expect(padStand(level0, statussen([], true))).toEqual({ nu: null, klaar: 8, totaal: 8, lijn: 100 });
  });

  it('krijgt de open stap een vinkje, dan schuift het werkblad door; keek je naar een andere stap, dan blijft die open', () => {
    expect(volgendeKeuze('l0-account', 'l0-account', 'l0-repo')).toBe('l0-repo');
    expect(volgendeKeuze('l0-setup', 'l0-account', 'l0-repo')).toBe('l0-setup');
    expect(volgendeKeuze(null, 'l0-account', 'l0-repo')).toBe('l0-repo');
    expect(volgendeKeuze('l0-eerste-opdracht', 'l0-eerste-opdracht', null)).toBeNull();
  });
});

describe('WerkplekBord', () => {
  it('toont de opdracht, één zin en de teller', () => {
    const html = bord(['l0-account']);
    expect(html).toMatch(/<h1[^>]*>Richt je werkplek in\.<\/h1>/);
    expect(html).toContain('Acht stappen. Na je eerste push is level 0 af.');
    expect(html).toMatch(/<b>1<small> \/ 8<\/small><\/b>klaar/);
  });

  it('elk rondje is een knop met zijn stand; alleen de stap van nu heeft het Jij-label', () => {
    const html = bord(['l0-account']);
    expect(html).toContain('aria-label="Account, klaar"');
    expect(html).toContain('aria-label="Repo, nu aan de beurt"');
    expect(html).toContain('aria-label="1e push, nog niet aan de beurt"');
    expect(html.match(/class="bl-pad-jij"/g)).toHaveLength(1);
    expect(html.match(/<button[^>]*class="bl-rondje/g)).toHaveLength(8);
    // Ook een stap die nog niet aan de beurt is, kun je openen.
    expect(html).not.toMatch(/<button[^>]*class="bl-rondje[^"]*"[^>]*disabled/);
  });

  it('het werkblad van de stap van nu staat open, en zijn rondje is gekozen', () => {
    const html = bord(['l0-account']);
    expect(html).toMatch(/class="bl-rondje nu gekozen" aria-pressed="true"[^>]*aria-label="Repo, nu aan de beurt"/);
    expect(html).toMatch(/<h3[^>]*>Maak je repo<\/h3>/);
    expect(html).toContain('Stap 2 van 8');
  });

  it('is level 0 af, dan staat er geen werkblad open en geen demoknop', () => {
    const html = bord([], true);
    expect(html).not.toContain('bl-stapblad');
    expect(html).not.toContain('aria-pressed="true"');
    expect(html).not.toContain('Vul het hele level met demo content');
    expect(html.match(/, klaar"/g)).toHaveLength(8);
  });
});
