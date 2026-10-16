import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { level1 } from '../lib/levels/level1';
import { starterFiles } from '../lib/repo/starterFiles';
import { LevelPagina } from './LevelPagina';

const html = renderToStaticMarkup(
  <LevelPagina level={level1} state="active" snapshot={{ files: starterFiles, mergedPullRequests: 0 }} onSave={async () => true} onSimulate={() => {}} />,
);
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
