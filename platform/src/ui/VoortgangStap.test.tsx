import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { INTERVIEWS_DIR, level2 } from '../lib/levels/level2';
import type { VoortgangStep } from '../lib/levels/types';
import { starterFiles } from '../lib/repo/starterFiles';
import { VoortgangStap } from './VoortgangStap';

const step = level2.steps.find((s): s is VoortgangStep => s.id === 'l2-interviews' && s.kind === 'voortgang')!;
const render = (files: Record<string, string>) =>
  renderToStaticMarkup(<VoortgangStap step={step} snapshot={{ files: { ...starterFiles, ...files }, mergedPullRequests: 0 }} />);

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

});
