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
  it('lege tekstvelden zie je zelf: de knop staat uit, zonder regel erbij', () => {
    const html = render(formStep(level1, 'l1-idee'));
    expect(html).toMatch(/<button type="submit"[^>]*disabled=""/);
    expect(html).not.toContain('Nog leeg');
    expect(html).not.toContain('aria-describedby');
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
    // Een keuzelijst zonder keuzes zie je niet; daar zegt de regel waarom de knop niet werkt.
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

describe('FormStap met keuzeknoppen', () => {
  it('de setup kiest met knoppen, zoals in de schets', () => {
    const html = render(formStep(level0, 'l0-setup'));
    expect(html).toMatch(/<div role="group" aria-label="Mijn computer" class="keuzes"><button type="button" class="keuze-knop" aria-pressed="true">Mac<\/button><button type="button" class="keuze-knop" aria-pressed="false">Windows<\/button>/);
    expect(html).not.toContain('<select');
  });
});
