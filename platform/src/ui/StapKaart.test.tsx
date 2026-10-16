import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { evaluateLevel } from '../lib/levels/evaluate';
import { level1 } from '../lib/levels/level1';
import { EERSTE_DOELGROEP_PATH, level2 } from '../lib/levels/level2';
import { level3 } from '../lib/levels/level3';
import type { LevelDef } from '../lib/levels/types';
import { starterFiles } from '../lib/repo/starterFiles';
import { StapKaart } from './StapKaart';

const kaart = (level: LevelDef, stepId: string, extra: Partial<Parameters<typeof StapKaart>[0]> = {}, files: Record<string, string> = {}) => {
  const snapshot = { files: { ...starterFiles, ...files }, mergedPullRequests: 0 };
  const step = level.steps.find((s) => s.id === stepId)!;
  return renderToStaticMarkup(
    <StapKaart level={level} step={step} nummer={1} snapshot={snapshot} evaluation={evaluateLevel(level, snapshot)} setup={{}} onSave={async () => true} {...extra} />,
  );
};

describe('StapKaart', () => {
  it('zegt waar je de stap doet, in volgorde', () => {
    const html = kaart(level2, 'l2-canvas');
    expect(html).toContain('aria-label="Waar: AI-app, daarna GitHub Desktop, daarna GitHub"');
    expect(html).toMatch(/<li class="plek">AI-app<\/li>[\s\S]*<li class="plek">GitHub Desktop<\/li>[\s\S]*<li class="plek">GitHub<\/li>/);
  });

  it('heeft bij een AI-stap een knop "Vul met demo content" met uitleg wat hij nadoet', () => {
    const html = kaart(level2, 'l2-analyse', { demo: { label: 'doet alsof je AI de analyse schreef', onRun: () => {} } });
    expect(html).toMatch(/<button type="button" class="btn-demo">Vul met demo content<\/button>/);
    expect(html).toContain('doet alsof je AI de analyse schreef');
  });

  it('zet de How Might We-vraag boven de oplossingenstap', () => {
    const files = { [EERSTE_DOELGROEP_PATH]: '---\ngevonden: ja\ndoelgroep: apothekers\nprobleem: spoedbezorging\n---\n# E\n\nx' };
    expect(kaart(level3, 'l3-oplossingen', {}, files)).toMatch(/<blockquote class="stap-hint">Hoe kunnen we apothekers helpen met spoedbezorging\?<\/blockquote>/);
  });

  it('de stapkop is een h2, direct onder de h1 van het level', () => {
    const snapshot = { files: starterFiles, mergedPullRequests: 0 };
    const html = renderToStaticMarkup(
      <StapKaart level={level1} step={level1.steps[1]} nummer={1} snapshot={snapshot} evaluation={evaluateLevel(level1, snapshot)} setup={{}} onSave={async () => true} />,
    );
    expect(html).toMatch(/<h2 class="stap-titel">/);
    expect(html).not.toContain('<h3');
  });
});
