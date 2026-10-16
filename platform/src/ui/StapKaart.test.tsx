import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { evaluateLevel } from '../lib/levels/evaluate';
import { level1 } from '../lib/levels/level1';
import { starterFiles } from '../lib/repo/starterFiles';
import { StapKaart } from './StapKaart';

describe('StapKaart', () => {
  it('de stapkop is een h2, direct onder de h1 van het level', () => {
    const snapshot = { files: starterFiles, mergedPullRequests: 0 };
    const html = renderToStaticMarkup(
      <StapKaart level={level1} step={level1.steps[0]} index={0} snapshot={snapshot} evaluation={evaluateLevel(level1, snapshot)} setup={{}} onSave={async () => true} />,
    );
    expect(html).toMatch(/<h2 class="stap-titel">/);
    expect(html).not.toContain('<h3');
  });
});
