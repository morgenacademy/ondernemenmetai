import { frontmatterOf } from './levels/checks';
import { SETUP_PATH } from './levels/level0';
import type { RepoSnapshot } from './repo/types';

const raw = import.meta.glob('../../../content/levels/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const byKey: Record<string, string> = {};
for (const [path, text] of Object.entries(raw)) {
  const match = path.match(/content\/levels\/level-(\d+)\/([^/]+)\.md$/);
  if (match) byKey[`${match[1]}/${match[2]}`] = text;
}

export function stepContent(levelId: number, stepId: string): string | undefined {
  return byKey[`${levelId}/${stepId}`];
}

export type Setup = { os?: string; ai?: string };

/** Houdt alleen de blokken over die bij de gekozen computer en AI-tool horen. Zonder setup blijft alles staan. */
export function filterVariants(md: string, setup: Setup): string {
  return md.replace(/<!-- alleen:([a-z-]+) -->\n?([\s\S]*?)<!-- \/alleen -->\n?/g, (_match, tag: string, inner: string) => {
    if (!setup.os && !setup.ai) return inner;
    return tag === setup.os || tag === setup.ai ? inner : '';
  });
}

export function setupFrom(s: RepoSnapshot): Setup {
  const fm = frontmatterOf(s, SETUP_PATH);
  const setup: Setup = {};
  if (typeof fm.os === 'string') setup.os = fm.os;
  if (typeof fm.ai === 'string') setup.ai = fm.ai;
  return setup;
}
