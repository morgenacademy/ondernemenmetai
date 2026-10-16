import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { toMarkdown } from '../lib/markdown';
import { FEEDBACK_DIR, resultaatPath, testkaartPath } from '../lib/levels/level4';
import { Paneel } from './Paneel';

const persoon = (naam: string, rondes: string[]) =>
  toMarkdown({ persoon: naam, ronde: rondes.length, antwoord: rondes.at(-1) ?? null }, `# ${naam}\n\n${rondes.map((a, i) => `## Ronde ${i + 1}\n\n- Antwoord: ${a}`).join('\n\n')}`);

describe('Paneel', () => {
  it('"mensen" toont per persoon het antwoord per ronde', () => {
    const files = { [`${FEEDBACK_DIR}/01-apotheker.md`]: persoon('01-apotheker', ['ja', 'ja']), [`${FEEDBACK_DIR}/02-apotheker.md`]: persoon('02-apotheker', ['nee']) };
    const html = renderToStaticMarkup(<Paneel soort="mensen" snapshot={{ files, mergedPullRequests: 0 }} />);
    expect(html).toContain('<th scope="col">Ronde 2</th>');
    expect(html).toMatch(/<th scope="row">01-apotheker<\/th><td>ja<\/td><td>ja<\/td>/);
    expect(html).toMatch(/<th scope="row">02-apotheker<\/th><td>nee<\/td><td>–<\/td>/);
  });

  it('"rondes" zet testkaart en resultaat per ronde op één bord', () => {
    const files = {
      [testkaartPath(1)]: toMarkdown({ ronde: 1, hypothese: 'Ze willen door', succesdrempel: '2 van de 3' }, '# T'),
      [resultaatPath(1)]: toMarkdown({ ronde: 1, besluit: 'doorontwikkelen' }, '# R\n\n## 1. Gemeten waarde\n\n1 van de 3 zeiden ja.\n\n## 2. Vergelijking'),
    };
    const html = renderToStaticMarkup(<Paneel soort="rondes" snapshot={{ files, mergedPullRequests: 0 }} />);
    expect(html).toMatch(/<th scope="row">Ronde 1<\/th><td>Ze willen door<\/td><td>2 van de 3<\/td><td>1 van de 3 zeiden ja\.<\/td><td>doorontwikkelen<\/td>/);
  });

  it('zonder bestanden zegt het paneel dat er nog niets is', () => {
    expect(renderToStaticMarkup(<Paneel soort="mensen" snapshot={{ files: {}, mergedPullRequests: 0 }} />)).toContain('Nog niemand');
    expect(renderToStaticMarkup(<Paneel soort="rondes" snapshot={{ files: {}, mergedPullRequests: 0 }} />)).toContain('Nog geen ronde');
  });
});
