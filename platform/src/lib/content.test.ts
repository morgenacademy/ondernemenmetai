import { describe, expect, it } from 'vitest';
import { filterVariants, setupFrom, stepContent } from './content';
import { LEVELS } from './levels';
import { SETUP_PATH } from './levels/level0';

const md = 'Intro\n<!-- alleen:mac -->\nMac-tekst\n<!-- /alleen -->\n<!-- alleen:windows -->\nWindows-tekst\n<!-- /alleen -->\n<!-- alleen:codex -->\nCodex-tekst\n<!-- /alleen -->\nSlot';

describe('content', () => {
  it('elke stap van een uitgewerkt level heeft uitleg', () => {
    for (const level of LEVELS.filter((l) => l.ready)) {
      for (const step of level.steps) {
        expect(stepContent(level.id, step.id), `${level.id}/${step.id}`).toBeTruthy();
      }
    }
  });

  it('filterVariants houdt alleen de gekozen setup over', () => {
    expect(filterVariants(md, { os: 'mac', ai: 'claude-code' })).toBe('Intro\nMac-tekst\nSlot');
    expect(filterVariants(md, { os: 'windows', ai: 'codex' })).toBe('Intro\nWindows-tekst\nCodex-tekst\nSlot');
  });

  it('filterVariants toont alles zolang er geen setup is', () => {
    expect(filterVariants(md, {})).toBe('Intro\nMac-tekst\nWindows-tekst\nCodex-tekst\nSlot');
  });

  it('setupFrom leest setup.md', () => {
    expect(setupFrom({ files: { [SETUP_PATH]: '---\nos: windows\nai: codex\n---\n# Setup' }, mergedPullRequests: 0 })).toEqual({ os: 'windows', ai: 'codex' });
    expect(setupFrom({ files: {}, mergedPullRequests: 0 })).toEqual({});
  });
});
