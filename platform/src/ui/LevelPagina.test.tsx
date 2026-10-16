import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { level1 } from '../lib/levels/level1';
import type { LevelState } from '../lib/levels/types';
import { starterFiles } from '../lib/repo/starterFiles';
import { LevelPagina } from './LevelPagina';

const render = (state: LevelState) =>
  renderToStaticMarkup(
    <LevelPagina level={level1} state={state} snapshot={{ files: starterFiles, mergedPullRequests: 0 }} onSave={async () => true} onDemo={() => {}} onFillLevel={() => {}} />,
  );
const html = render('active');
const kaarten = html.split('<article').slice(1);

describe('LevelPagina', () => {
  it('de vrije kaart "Nog geen idee?" heet optioneel en krijgt geen nummer', () => {
    expect(kaarten[0]).toContain('Nog geen idee?');
    expect(kaarten[0]).toContain('Optioneel');
    expect(kaarten[0]).not.toMatch(/<span class="stap-nr">\d/);
  });

  it('de stappen daarna tellen vanaf 1, tot en met stap 5', () => {
    expect(kaarten[1]).toMatch(/<span class="stap-nr">1<\/span>[\s\S]*Zet je idee uiteen/);
    expect(kaarten[5]).toMatch(/<span class="stap-nr">5<\/span>[\s\S]*Maak de eerste versie van je waardepropositie/);
  });
});

describe('LevelPagina-kop en demo', () => {
  it('toont de vraag en het doel van het level', () => {
    expect(html).toContain('<p class="level-vraag">Wat is mijn idee, en wat neem ik daarbij aan?</p>');
    expect(html).toMatch(/Je doel[\s\S]*Je idee staat in één zin, en je hebt een eerste waardepropositie vol aannames\./);
  });

  it('heeft een knop die het hele level met demo-content vult, zolang het level bezig is', () => {
    expect(html).toContain('Vul het hele level met demo content');
    expect(render('done')).not.toContain('Vul het hele level met demo content');
    expect(render('locked')).not.toContain('Vul het hele level met demo content');
  });

  it('geeft formulieren demo-waarden mee en AI-stappen een demoknop', () => {
    expect(kaarten[1]).toMatch(/Zet je idee uiteen[\s\S]*Vul met demo content/);
    expect(kaarten[5]).toMatch(/Vul met demo content[\s\S]*doet alsof je AI je propositie toetste/);
    expect(kaarten[0]).not.toContain('Vul met demo content');
  });
});
