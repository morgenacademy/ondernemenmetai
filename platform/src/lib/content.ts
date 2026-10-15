import { frontmatterOf } from './levels/checks';
import { AI_OPTIONS, OS_OPTIONS, SETUP_PATH } from './levels/level0';
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

const OS_VALUES = OS_OPTIONS.map((o) => o.value);
const AI_VALUES = AI_OPTIONS.map((o) => o.value);

/** Alleen een waarde uit de lijst telt als gekozen; een onbekende waarde is hetzelfde als niets kiezen. */
function chosen(values: string[], value: string | undefined): string | undefined {
  return value !== undefined && values.includes(value) ? value : undefined;
}

/**
 * Houdt alleen de blokken over die bij de gekozen computer en AI-tool horen.
 * Is de computer of de AI-tool niet (geldig) gekozen, dan blijven alle blokken daarvoor staan.
 */
export function filterVariants(md: string, setup: Setup): string {
  const os = chosen(OS_VALUES, setup.os);
  const ai = chosen(AI_VALUES, setup.ai);
  return md.replace(/<!-- alleen:([a-z-]+) -->\n?([\s\S]*?)<!-- \/alleen -->\n?/g, (_match, tag: string, inner: string) => {
    if (OS_VALUES.includes(tag)) return !os || tag === os ? inner : '';
    if (AI_VALUES.includes(tag)) return !ai || tag === ai ? inner : '';
    return os || ai ? '' : inner;
  });
}

export function setupFrom(s: RepoSnapshot): Setup {
  const fm = frontmatterOf(s, SETUP_PATH);
  const setup: Setup = {};
  if (typeof fm.os === 'string') setup.os = fm.os;
  if (typeof fm.ai === 'string') setup.ai = fm.ai;
  return setup;
}
