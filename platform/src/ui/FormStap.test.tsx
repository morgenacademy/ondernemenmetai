import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { level0 } from '../lib/levels/level0';
import { level1 } from '../lib/levels/level1';
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
