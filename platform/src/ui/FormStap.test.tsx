import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { level0 } from '../lib/levels/level0';
import { level1 } from '../lib/levels/level1';
import { FEEDBACK_DIR, level4 } from '../lib/levels/level4';
import type { FormStep, LevelDef } from '../lib/levels/types';
import { starterFiles } from '../lib/repo/starterFiles';
import { FormStap, missingFieldsHint } from './FormStap';

const formStep = (level: LevelDef, id: string) => level.steps.find((s): s is FormStep => s.id === id && s.kind === 'form')!;
const render = (step: FormStep) =>
  renderToStaticMarkup(<FormStap step={step} snapshot={{ files: starterFiles, mergedPullRequests: 0 }} alreadyDone={false} onSave={async () => true} />);

describe('FormStap', () => {
  it('zegt bij een uitgeschakelde knop welk veld nog leeg is', () => {
    const html = render(formStep(level1, 'l1-idee'));
    const id = html.match(/<button[^>]*disabled=""[^>]*aria-describedby="([^"]+)"|<button[^>]*aria-describedby="([^"]+)"[^>]*disabled=""/);
    const hintId = id?.[1] ?? id?.[2];
    expect(hintId).toBeTruthy();
    expect(html).toContain(`id="${hintId}"`);
    expect(html).toContain('Nog leeg: Wat ga je doen? en nog 2 velden');
  });

  it('toont geen hint als er niets in te vullen is', () => {
    const html = render(formStep(level0, 'l0-setup'));
    expect(html).not.toContain('Nog leeg');
    expect(html).not.toContain('aria-describedby');
  });

  it('missingFieldsHint noemt het eerste lege veld en telt de rest', () => {
    expect(missingFieldsHint([])).toBeNull();
    expect(missingFieldsHint(['Voor wie?'])).toBe('Nog leeg: Voor wie?');
    expect(missingFieldsHint(['Voor wie?', 'Waarom jij?'])).toBe('Nog leeg: Voor wie? en nog 1 veld');
  });
});

describe('FormStap met keuzes uit de repo en demo-content', () => {
  const voorstel = formStep(level4, 'l4-voorstel');

  it('zonder mensen in feedback/ kan het formulier niet worden opgeslagen', () => {
    const html = render(voorstel);
    expect(html).toContain('Nog leeg: Met wie sprak je?');
    expect(html).toMatch(/<button type="submit"[^>]*disabled=""/);
  });

  it('toont de mensen uit feedback/ als keuzes', () => {
    const files = { ...starterFiles, [`${FEEDBACK_DIR}/01-apotheker.md`]: '---\npersoon: 01-apotheker\n---\n# 01' };
    const html = renderToStaticMarkup(<FormStap step={voorstel} snapshot={{ files, mergedPullRequests: 0 }} alreadyDone={false} onSave={async () => true} />);
    expect(html).toContain('<option value="01-apotheker" selected="">01-apotheker</option>');
  });

  it('heeft een knop die het formulier met demo-content vult', () => {
    const html = renderToStaticMarkup(
      <FormStap step={formStep(level1, 'l1-idee')} snapshot={{ files: starterFiles, mergedPullRequests: 0 }} alreadyDone={false} onSave={async () => true} demoWaarden={{ wat: 'a', voorWie: 'b', waaromJij: 'c' }} />,
    );
    expect(html).toMatch(/<button type="button" class="btn-demo[^"]*">Vul met demo content<\/button>/);
  });
});
