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
