import { describe, expect, it } from 'vitest';
import { filterVariants, setupFrom, stepContent } from './content';
import { LEVELS } from './levels';
import { SETUP_PATH, level0 } from './levels/level0';

const md = 'Intro\n<!-- alleen:mac -->\nMac-tekst\n<!-- /alleen -->\n<!-- alleen:windows -->\nWindows-tekst\n<!-- /alleen -->\n<!-- alleen:codex -->\nCodex-tekst\n<!-- /alleen -->\nSlot';

describe('content', () => {
  it('elke stap van een uitgewerkt level heeft uitleg', () => {
    for (const level of LEVELS.filter((l) => l.ready)) {
      for (const step of level.steps) {
        expect(stepContent(level.id, step.id), `${level.id}/${step.id}`).toBeTruthy();
      }
    }
  });

  it('elke pop-up heeft uitleg', () => {
    for (const level of LEVELS) {
      for (const step of level.steps) {
        if (step.popup) expect(stepContent(level.id, step.popup.contentId), step.popup.contentId).toBeTruthy();
      }
    }
  });

  it('de uitleg van level 0 werkt zonder terminal', () => {
    const ids = level0.steps.flatMap((s) => [s.id, ...(s.popup ? [s.popup.contentId] : [])]);
    for (const id of ids) {
      expect(stepContent(0, id) ?? '', id).not.toMatch(/brew|winget|\bgh\b|terminal|powershell|```/i);
    }
  });

  it('alleen Windows met Claude Code krijgt de regel over Git for Windows', () => {
    const tekst = stepContent(0, 'l0-github-desktop') ?? '';
    expect(filterVariants(tekst, { os: 'windows', ai: 'claude-code' })).toContain('git-scm.com/download/win');
    expect(filterVariants(tekst, { os: 'windows', ai: 'codex' })).not.toContain('git-scm.com');
    expect(filterVariants(tekst, { os: 'mac', ai: 'claude-code' })).not.toContain('git-scm.com');
  });

  it('filterVariants houdt alleen de gekozen setup over', () => {
    expect(filterVariants(md, { os: 'mac', ai: 'claude-code' })).toBe('Intro\nMac-tekst\nSlot');
    expect(filterVariants(md, { os: 'windows', ai: 'codex' })).toBe('Intro\nWindows-tekst\nCodex-tekst\nSlot');
  });

  it('filterVariants behandelt een onbekende computer of AI-tool als niet gekozen', () => {
    expect(filterVariants(md, { os: 'linux', ai: 'codex' })).toBe('Intro\nMac-tekst\nWindows-tekst\nCodex-tekst\nSlot');
    expect(filterVariants(md, { os: 'mac', ai: 'chatgpt' })).toBe('Intro\nMac-tekst\nCodex-tekst\nSlot');
    expect(filterVariants(md, { os: 'Linux', ai: 'gemini' })).toBe('Intro\nMac-tekst\nWindows-tekst\nCodex-tekst\nSlot');
  });

  it('filterVariants toont een gecombineerd blok alleen als alle keuzes kloppen', () => {
    const gecombineerd = 'Start\n<!-- alleen:windows+claude-code -->\nGit for Windows\n<!-- /alleen -->\nEind';
    expect(filterVariants(gecombineerd, { os: 'windows', ai: 'claude-code' })).toBe('Start\nGit for Windows\nEind');
    expect(filterVariants(gecombineerd, { os: 'mac', ai: 'claude-code' })).toBe('Start\nEind');
    expect(filterVariants(gecombineerd, { os: 'windows', ai: 'codex' })).toBe('Start\nEind');
    expect(filterVariants(gecombineerd, { os: 'windows' })).toBe('Start\nGit for Windows\nEind');
    expect(filterVariants(gecombineerd, {})).toBe('Start\nGit for Windows\nEind');
  });

  it('filterVariants toont alles zolang er geen setup is', () => {
    expect(filterVariants(md, {})).toBe('Intro\nMac-tekst\nWindows-tekst\nCodex-tekst\nSlot');
  });

  it('setupFrom leest setup.md', () => {
    expect(setupFrom({ files: { [SETUP_PATH]: '---\nos: windows\nai: codex\n---\n# Setup' }, mergedPullRequests: 0 })).toEqual({ os: 'windows', ai: 'codex' });
    expect(setupFrom({ files: {}, mergedPullRequests: 0 })).toEqual({});
  });
});
