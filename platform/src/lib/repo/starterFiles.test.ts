import { describe, expect, it } from 'vitest';
import { MARKER, parseMarkdown } from '../markdown';
import { starterFiles } from './starterFiles';

const TEMPLATES = [
  'level-0-werkplek/werkplek.md',
  'level-1-idee/idee.md',
  'level-1-idee/visie.md',
  'level-1-idee/madlib.md',
  'level-1-idee/aannames.md',
  'level-2-probleemvalidatie/doelgroep.md',
  'level-2-probleemvalidatie/interviewvragen.md',
  'level-2-probleemvalidatie/analyse.md',
];

describe('starter-repo', () => {
  it('bevat README, AGENTS.md, CLAUDE.md en alle templates', () => {
    for (const path of ['README.md', 'AGENTS.md', 'CLAUDE.md', 'level-2-probleemvalidatie/interviews/README.md', ...TEMPLATES]) {
      expect(starterFiles[path], path).toBeDefined();
    }
  });

  it('elk template bevat de marker precies één keer', () => {
    for (const path of TEMPLATES) {
      expect(starterFiles[path].split(MARKER).length - 1, path).toBe(1);
    }
  });

  it('geen ander bestand bevat de marker', () => {
    for (const [path, text] of Object.entries(starterFiles)) {
      if (!TEMPLATES.includes(path)) expect(text.includes(MARKER), path).toBe(false);
    }
  });

  it('AGENTS.md laat de eigenaar via GitHub Desktop pushen, zonder branches of pull requests', () => {
    const agents = starterFiles['AGENTS.md'];
    expect(agents).toContain('Leg wijzigingen vast met een duidelijke commit; de eigenaar pusht via GitHub Desktop. Branches en pull requests komen in een later level.');
    expect(agents).not.toContain('Wijzigingen gaan via een branch en een pull request');
  });

  it('het werkplek-template gaat niet meer over branches en pull requests', () => {
    expect(starterFiles['level-0-werkplek/werkplek.md']).not.toMatch(/pull request|branch/i);
  });

  it('CLAUDE.md importeert AGENTS.md', () => {
    expect(starterFiles['CLAUDE.md'].trim()).toBe('@AGENTS.md');
  });

  it('doelgroep.md heeft geldige frontmatter met alleen het type, zodat het aantal interviews meegaat met B2B of B2C', () => {
    const parsed = parseMarkdown(starterFiles['level-2-probleemvalidatie/doelgroep.md']);
    expect(parsed.error).toBeUndefined();
    expect(parsed.frontmatter).toEqual({ type: 'B2B' });
  });
});
