import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { evaluateLevel } from '../lib/levels/evaluate';
import { level0 } from '../lib/levels/level0';
import { starterFiles } from '../lib/repo/starterFiles';
import { StapKaart } from './StapKaart';

const snapshot = { files: starterFiles, mergedPullRequests: 0 };
const step = level0.steps.find((s) => s.id === 'l0-repo')!;
const html = renderToStaticMarkup(
  <StapKaart level={level0} step={step} index={4} snapshot={snapshot} evaluation={evaluateLevel(level0, snapshot)} setup={{}} onSave={async () => true} />,
);

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

  it('bevat de vier redenen', () => {
    for (const kop of ['Het platform kan niet in je map meekijken', 'Je ziet niet terug wat je AI deed', 'Je kunt niet eerst nakijken', 'Je AI kan er niet in de cloud in werken']) {
      expect(html).toContain(`<h3>${kop}</h3>`);
    }
  });
});
