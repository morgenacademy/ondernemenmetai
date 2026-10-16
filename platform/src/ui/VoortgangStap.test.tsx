import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { evaluateLevel } from '../lib/levels/evaluate';
import { INTERVIEWS_DIR, level2 } from '../lib/levels/level2';
import { starterFiles } from '../lib/repo/starterFiles';
import { StapKaart } from './StapKaart';

const step = level2.steps.find((s) => s.id === 'l2-interviews')!;
const render = (files: Record<string, string>) => {
  const snapshot = { files: { ...starterFiles, ...files }, mergedPullRequests: 0 };
  return renderToStaticMarkup(
    <StapKaart level={level2} step={step} nummer={4} snapshot={snapshot} evaluation={evaluateLevel(level2, snapshot)} setup={{}} onSave={async () => true} />,
  );
};

describe('interviewvakken', () => {
  it('uploaden kan niet meer: wat het platform uploadt, staat direct op GitHub', () => {
    const html = render({});
    expect(html).not.toContain('type="file"');
    expect(html).not.toMatch(/Upload/);
  });

  it('toont per interview een vak dat afvinkt zodra het in je repo staat', () => {
    const html = render({ [`${INTERVIEWS_DIR}/01-apotheker.md`]: '# Interview 1\n\nInhoud.' });
    expect(html).toContain('1 van de 5 interviews in je repo');
    expect(html.match(/<li class="gevuld">/g)).toHaveLength(1);
    expect(html).toContain('01-apotheker.md');
    expect(html).toContain('Interview 5');
  });

  it('geeft de opdracht voor skill transcriberen als kopieerblok', () => {
    expect(render({})).toMatch(/<textarea[^>]*>Gebruik skill transcriberen\. Zet het nieuwe interview in opnames\/ om\.<\/textarea>/);
  });
});
