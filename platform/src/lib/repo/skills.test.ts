import { describe, expect, it } from 'vitest';
import { parseMarkdown } from '../markdown';
import { starterFiles } from './starterFiles';

const SKILLS = ['propositie-validator', 'interviewhulp', 'transcriberen', 'interview-analyse'];

describe('skills', () => {
  for (const name of SKILLS) {
    it(`${name} heeft geldige frontmatter, zodat de AI hem via AGENTS.md vindt`, () => {
      const path = `skills/${name}/SKILL.md`;
      expect(starterFiles[path], path).toBeDefined();
      const { frontmatter, error } = parseMarkdown(starterFiles[path]);
      expect(error).toBeUndefined();
      expect(frontmatter.name).toBe(name);
      expect(typeof frontmatter.description).toBe('string');
      expect((frontmatter.description as string).length).toBeGreaterThan(40);
    });
  }
});
