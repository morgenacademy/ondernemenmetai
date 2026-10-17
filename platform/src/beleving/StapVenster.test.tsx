import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { DEMO_FORMS } from '../demo/formulieren';
import { evaluateLevel } from '../lib/levels/evaluate';
import { level1 } from '../lib/levels/level1';
import { EERSTE_DOELGROEP_PATH, level2 } from '../lib/levels/level2';
import { level3 } from '../lib/levels/level3';
import type { LevelDef } from '../lib/levels/types';
import { starterFiles } from '../lib/repo/starterFiles';
import { LevelScherm } from './LevelScherm';
import { StapVenster } from './StapVenster';
import { stapStatussen } from './voortgang';

const venster = (level: LevelDef, stepId: string, extra: Partial<Parameters<typeof StapVenster>[0]> = {}, files: Record<string, string> = {}) => {
  const snapshot = { files: { ...starterFiles, ...files }, mergedPullRequests: 0 };
  const step = level.steps.find((s) => s.id === stepId)!;
  const evaluation = evaluateLevel(level, snapshot);
  return renderToStaticMarkup(
    <StapVenster level={level} step={step} status={stapStatussen(level, evaluation, new Set(), false)[stepId]} snapshot={snapshot} evaluation={evaluation} setup={{}} onSave={async () => true} onKlaar={() => {}} onSluit={() => {}} {...extra} />,
  );
};

describe('StapVenster, overgenomen uit de stapkaart', () => {
  it('zegt waar je de stap doet, in volgorde', () => {
    expect(venster(level2, 'l2-canvas')).toMatch(/<span class="bl-plek">AI-app<\/span><span class="bl-plek">GitHub Desktop<\/span><span class="bl-plek">GitHub<\/span>/);
  });

  it('heeft bij een AI-stap een knop "Vul met demo content" met uitleg wat hij nadoet', () => {
    const html = venster(level2, 'l2-analyse', { demo: { label: 'doet alsof je AI de analyse schreef', onRun: () => {} } });
    expect(html).toMatch(/<button type="button" class="bl-knop-demo">Vul met demo content<\/button>/);
    expect(html).toContain('doet alsof je AI de analyse schreef');
  });

  it('geeft een formulier demo-waarden mee', () => {
    const snapshot = { files: starterFiles, mergedPullRequests: 0 };
    expect(venster(level1, 'l1-idee', { demo: { waarden: DEMO_FORMS['l1-idee'](snapshot) } })).toContain('Vul met demo content');
  });

  it('zet de How Might We-vraag boven de oplossingenstap', () => {
    const files = { [EERSTE_DOELGROEP_PATH]: '---\ngevonden: ja\ndoelgroep: apothekers\nprobleem: spoedbezorging\n---\n# E\n\nx' };
    expect(venster(level3, 'l3-oplossingen', {}, files)).toMatch(/<blockquote class="stap-hint">Hoe kunnen we apothekers helpen met spoedbezorging\?<\/blockquote>/);
  });
});

describe('LevelScherm, level 1', () => {
  const render = (levelAf: boolean) =>
    renderToStaticMarkup(
      <LevelScherm level={level1} snapshot={{ files: starterFiles, mergedPullRequests: 0 }} levelAf={levelAf} handmatig={new Set()} onHandmatig={() => {}} onSave={async () => true} onDemo={() => {}} onFillLevel={() => {}} />,
    );
  const html = render(false);
  const kaarten = html.split('<button type="button" class="bl-stapkaart').slice(1);

  it('de vrije kaart "Nog geen idee?" heet optioneel en krijgt geen nummer; daarna tellen de stappen vanaf 1', () => {
    expect(kaarten[0]).toContain('Nog geen idee?');
    expect(kaarten[0]).toContain('<div class="nr">Optioneel</div>');
    expect(kaarten[1]).toMatch(/<div class="nr">Stap 1[\s\S]*Zet je idee uiteen/);
    expect(kaarten[5]).toMatch(/<div class="nr">Stap 5[\s\S]*Maak de eerste versie van je waardepropositie/);
  });

  it('toont het doel van het level bij de stappen', () => {
    expect(html).toContain('<p class="bl-doel"><b>Je doel:</b> Je idee staat in één zin, en je hebt een eerste waardepropositie vol aannames.</p>');
  });

  it('heeft een knop die het hele level met demo-content vult, zolang het level bezig is', () => {
    expect(html).toContain('Vul het hele level met demo content');
    expect(render(true)).not.toContain('Vul het hele level met demo content');
  });
});
