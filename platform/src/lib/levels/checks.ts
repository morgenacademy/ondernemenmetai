import { countListItems, isFilled, parseMarkdown } from '../markdown';
import type { RepoSnapshot } from '../repo/types';
import type { Check } from './types';

function folderPrefix(folder: string): string {
  return folder.endsWith('/') ? folder : `${folder}/`;
}

/** Markdown-bestanden direct in een map, zonder README en zonder submappen. */
export function mdFilesIn(s: RepoSnapshot, folder: string): string[] {
  const prefix = folderPrefix(folder);
  return Object.keys(s.files)
    .filter((path) => {
      if (!path.startsWith(prefix) || !path.endsWith('.md')) return false;
      const rest = path.slice(prefix.length);
      return !rest.includes('/') && rest.toLowerCase() !== 'readme.md';
    })
    .sort();
}

export function filledFilesIn(s: RepoSnapshot, folder: string): string[] {
  return mdFilesIn(s, folder).filter((path) => isFilled(s.files[path]));
}

export function frontmatterOf(s: RepoSnapshot, path: string): Record<string, unknown> {
  const text = s.files[path];
  return text === undefined ? {} : parseMarkdown(text).frontmatter;
}

export function fileFilled(id: string, stepId: string, path: string, label: string): Check {
  return {
    id,
    stepId,
    label,
    run: (s) => {
      const text = s.files[path];
      if (text === undefined) return { ok: false, reason: `${path} staat nog niet in je repo` };
      const { error } = parseMarkdown(text);
      if (error) return { ok: false, reason: `${path}: ${error}` };
      return isFilled(text)
        ? { ok: true, reason: `${path} is ingevuld` }
        : { ok: false, reason: `${path} is nog niet ingevuld` };
    },
  };
}

export function minListItems(id: string, stepId: string, path: string, min: number, label: string): Check {
  return {
    id,
    stepId,
    label,
    run: (s) => {
      const text = s.files[path];
      if (text === undefined) return { ok: false, reason: `${path} staat nog niet in je repo` };
      if (!isFilled(text)) return { ok: false, reason: `${path} is nog niet ingevuld` };
      const count = countListItems(text);
      return { ok: count >= min, reason: `${count} van de ${min}` };
    },
  };
}

export function minFilledFiles(
  id: string,
  stepId: string,
  folder: string,
  required: (s: RepoSnapshot) => number,
  label: string,
): Check {
  return {
    id,
    stepId,
    label,
    run: (s) => {
      const need = required(s);
      const count = filledFilesIn(s, folder).length;
      return { ok: count >= need, reason: `${count} van de ${need}` };
    },
  };
}

export function minMergedPullRequests(id: string, stepId: string, min: number, label: string): Check {
  return {
    id,
    stepId,
    label,
    run: (s) => ({ ok: s.mergedPullRequests >= min, reason: `${s.mergedPullRequests} van de ${min}` }),
  };
}

function hasValue(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

/** Het bestand staat er, is ingevuld en het veld heeft deze waarde (hoofdletters en spaties tellen niet). */
export function frontmatterIs(id: string, stepId: string, path: string, field: string, value: string, label: string): Check {
  return {
    id,
    stepId,
    label,
    run: (s) => {
      const text = s.files[path];
      if (text === undefined) return { ok: false, reason: `${path} staat nog niet in je repo` };
      const { frontmatter, error } = parseMarkdown(text);
      if (error) return { ok: false, reason: `${path}: ${error}` };
      if (!isFilled(text)) return { ok: false, reason: `${path} is nog niet ingevuld` };
      const actual = frontmatter[field];
      if (!hasValue(actual)) return { ok: false, reason: `${field} is nog leeg` };
      const shown = String(actual).trim();
      return { ok: shown.toLowerCase() === value.toLowerCase(), reason: `${field}: ${shown}` };
    },
  };
}

export type FrontmatterTarget = { path: string } | { folder: string; min: (s: RepoSnapshot) => number };

/** Deze velden hebben een waarde: in één bestand, of in minstens zoveel bestanden direct in een map. */
export function frontmatterFilled(id: string, stepId: string, target: FrontmatterTarget, fields: string[], label: string): Check {
  const missing = (s: RepoSnapshot, path: string) => fields.filter((field) => !hasValue(frontmatterOf(s, path)[field]));
  return {
    id,
    stepId,
    label,
    run: (s) => {
      if ('folder' in target) {
        const need = target.min(s);
        const count = mdFilesIn(s, target.folder).filter((path) => missing(s, path).length === 0).length;
        return { ok: count >= need, reason: `${count} van de ${need}` };
      }
      const { path } = target;
      if (s.files[path] === undefined) return { ok: false, reason: `${path} staat nog niet in je repo` };
      const empty = missing(s, path);
      return empty.length === 0 ? { ok: true, reason: 'alle velden ingevuld' } : { ok: false, reason: `nog leeg: ${empty.join(', ')}` };
    },
  };
}

/** De map bevat minstens één bestand van welk type ook, ook in submappen. README.md en .gitkeep tellen niet. */
export function anyFileIn(id: string, stepId: string, folder: string, label: string): Check {
  const prefix = folderPrefix(folder);
  return {
    id,
    stepId,
    label,
    run: (s) => {
      const count = Object.keys(s.files).filter((path) => {
        if (!path.startsWith(prefix)) return false;
        const rest = path.slice(prefix.length);
        const name = rest.split('/').pop() ?? '';
        return rest.toLowerCase() !== 'readme.md' && name !== '.gitkeep';
      }).length;
      if (count === 0) return { ok: false, reason: `${prefix} is nog leeg` };
      return { ok: true, reason: `${count} ${count === 1 ? 'bestand' : 'bestanden'} in ${prefix}` };
    },
  };
}

export function fileExists(id: string, stepId: string, path: string, label: string): Check {
  return {
    id,
    stepId,
    label,
    run: (s) =>
      s.files[path] === undefined
        ? { ok: false, reason: `${path} staat nog niet in je repo` }
        : { ok: true, reason: `${path} staat in je repo` },
  };
}

/** Onder deze kop staat tekst, tot de volgende kop van hetzelfde of een hoger niveau. Koppen en HTML-commentaar tellen niet. */
export function sectionFilled(id: string, stepId: string, path: string, heading: string, label: string): Check {
  return {
    id,
    stepId,
    label,
    run: (s) => {
      const text = s.files[path];
      if (text === undefined) return { ok: false, reason: `${path} staat nog niet in je repo` };
      const lines = parseMarkdown(text).body.split('\n');
      const start = lines.findIndex((line) => line.match(/^(#{1,6})\s+(.*?)\s*#*\s*$/)?.[2].toLowerCase() === heading.toLowerCase());
      if (start === -1) return { ok: false, reason: `${path} heeft nog geen kop "${heading}"` };
      const level = lines[start].match(/^#+/)?.[0].length ?? 1;
      const rest = lines.slice(start + 1);
      const end = rest.findIndex((line) => (line.match(/^(#{1,6})\s/)?.[1].length ?? 7) <= level);
      const section = (end === -1 ? rest : rest.slice(0, end))
        .filter((line) => !/^\s*#/.test(line))
        .join('\n')
        .replace(/<!--[\s\S]*?-->/g, '');
      return section.trim().length > 0
        ? { ok: true, reason: `${heading} is ingevuld` }
        : { ok: false, reason: `Onder "${heading}" staat nog niets` };
    },
  };
}
