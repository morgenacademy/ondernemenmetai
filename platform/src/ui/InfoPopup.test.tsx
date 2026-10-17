import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { level0 } from '../lib/levels/level0';
import { level1 } from '../lib/levels/level1';
import { level2 } from '../lib/levels/level2';
import type { LevelDef } from '../lib/levels/types';
import { InfoPopup } from './InfoPopup';

const step = level0.steps.find((s) => s.id === 'l0-repo')!;
const html = renderToStaticMarkup(<InfoPopup levelId={0} popup={step.popup!} />);

describe('pop-up "Waarom een repo?"', () => {
  it('heeft een knop die zegt dat hij een dialoog opent', () => {
    const knop = html.match(/<button[^>]*aria-haspopup="dialog"[^>]*>([^<]*)<\/button>/);
    expect(knop?.[1]).toBe('Waarom een repo en geen gedeelde map?');
    const controls = knop?.[0].match(/aria-controls="([^"]+)"/)?.[1];
    expect(html).toContain(`<dialog id="${controls}"`);
  });

  it('de dialoog heeft een kop die de deelnemer aanspreekt en een sluitknop', () => {
    const labelId = html.match(/<dialog[^>]*aria-labelledby="([^"]+)"/)?.[1];
    expect(html).toMatch(new RegExp(`<h2[^>]*id="${labelId}"[^>]*>Wat een gedeelde map niet kan</h2>`));
    expect(html).toMatch(/<dialog[\s\S]*<button[^>]*>Sluiten<\/button>[\s\S]*<\/dialog>/);
  });

  it('de titel kan de focus krijgen, zodat je bij openen bovenaan begint', () => {
    expect(html).toMatch(/<h2[^>]*tabindex="-1"[^>]*>Wat een gedeelde map niet kan<\/h2>/);
  });

  it('bevat de vier redenen', () => {
    for (const kop of ['Het platform kan niet in je map meekijken', 'Je ziet niet terug wat je AI deed', 'Je kunt niet eerst nakijken', 'Je AI kan er niet in de cloud in werken']) {
      expect(html).toContain(`<h3>${kop}</h3>`);
    }
  });
});

const popupVan = (level: LevelDef, stepId: string) => {
  const stap = level.steps.find((s) => s.id === stepId)!;
  const kaart = renderToStaticMarkup(<InfoPopup levelId={level.id} popup={stap.popup!} />);
  return kaart.slice(kaart.indexOf('<dialog'));
};

describe('pop-up "Wat haalde mijn AI op?" (level 1)', () => {
  const popup = popupVan(level1, 'l1-propositie');
  const plaatje = popup.match(/<figure[\s\S]*?<\/figure>/)?.[0] ?? '';

  it('toont het plaatje met je computer en GitHub', () => {
    expect(plaatje).toContain('Je computer');
    expect(plaatje).toContain('GitHub');
  });

  it('het plaatje heeft in level 1 pull erbij, maar nog geen map die alleen op je computer staat', () => {
    expect(plaatje).toMatch(/commit en push/i);
    expect(plaatje).toMatch(/pull/i);
    expect(plaatje).not.toContain('opnames/');
  });

  it('noemt de vraag die altijd werkt', () => {
    expect(popup).toContain('Is alles in sync?');
  });
});

describe('pop-up "Wat is een pull request?" (level 2)', () => {
  const popup = popupVan(level2, 'l2-canvas');
  const plaatje = popup.match(/<figure[\s\S]*?<\/figure>/)?.[0] ?? '';

  it('het plaatje krijgt een map die alleen op je computer staat, en merge', () => {
    expect(plaatje).toContain('opnames/');
    expect(plaatje).toMatch(/merge/i);
    expect(plaatje).toMatch(/pull/i);
  });

  it('legt uit waar je klikt: Publish branch, Create Pull Request en Merge pull request', () => {
    for (const knop of ['Publish branch', 'Create Pull Request', 'Merge pull request']) expect(popup).toContain(knop);
  });
});
