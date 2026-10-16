import YAML from 'yaml';

export const MARKER = '<!-- invullen -->';

export type Frontmatter = Record<string, unknown>;
export type ParsedMarkdown = { frontmatter: Frontmatter; body: string; error?: string };

export function toMarkdown(frontmatter: Frontmatter | null, body: string): string {
  const trimmed = body.trim();
  if (!frontmatter || Object.keys(frontmatter).length === 0) return `${trimmed}\n`;
  return `---\n${YAML.stringify(frontmatter)}---\n\n${trimmed}\n`;
}

export function parseMarkdown(text: string): ParsedMarkdown {
  const normalized = text.replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n')) return { frontmatter: {}, body: normalized };
  const end = normalized.indexOf('\n---', 4);
  if (end === -1) {
    return { frontmatter: {}, body: normalized, error: 'Frontmatter wordt niet afgesloten met ---' };
  }
  const rawYaml = normalized.slice(4, end);
  const body = normalized.slice(end + 4).replace(/^\n+/, '');
  try {
    const data: unknown = YAML.parse(rawYaml);
    if (data === null || data === undefined) return { frontmatter: {}, body };
    if (typeof data !== 'object' || Array.isArray(data)) {
      return { frontmatter: {}, body, error: 'Frontmatter is geen lijst van velden' };
    }
    return { frontmatter: data as Frontmatter, body };
  } catch {
    return { frontmatter: {}, body, error: 'Frontmatter is geen geldige YAML' };
  }
}

export function isFilled(text: string | undefined | null): boolean {
  if (text == null) return false;
  if (text.includes(MARKER)) return false;
  const { body } = parseMarkdown(text);
  const content = body
    .split('\n')
    .filter((line) => !/^\s*#/.test(line))
    .join('\n');
  return content.trim().length > 0;
}

/** Telt lijstregels met inhoud. Een regel met alleen een label, zoals "- [wens]", telt niet. */
export function countListItems(text: string | undefined | null): number {
  if (text == null) return 0;
  const { body } = parseMarkdown(text);
  return body.split('\n').filter((line) => {
    const item = line.match(/^\s*[-*]\s+(.*)$/);
    return item !== null && item[1].replace(/^\[[^\]]*\]/, '').trim().length > 0;
  }).length;
}

/** Zet velden in de frontmatter en laat de rest van het bestand staan. */
export function withFrontmatter(text: string, fields: Frontmatter): string {
  const { frontmatter, body } = parseMarkdown(text);
  return toMarkdown({ ...frontmatter, ...fields }, body);
}

/** Vervangt de tekst onder "## kop" tot de volgende ##-kop, of zet de sectie onderaan als hij er nog niet is. */
export function upsertSection(body: string, heading: string, content: string): string {
  const lines = body.replace(/\s+$/, '').split('\n');
  const start = lines.findIndex((line) => line.trim() === `## ${heading}`);
  const block = [`## ${heading}`, '', content.trim()];
  if (start === -1) return `${lines.join('\n')}\n\n${block.join('\n')}\n`;
  const rest = lines.slice(start + 1);
  const next = rest.findIndex((line) => /^#{1,2}\s/.test(line));
  const after = next === -1 ? [] : ['', ...rest.slice(next)];
  return `${[...lines.slice(0, start), ...block, ...after].join('\n')}\n`;
}
