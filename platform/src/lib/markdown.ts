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

export function countListItems(text: string | undefined | null): number {
  if (text == null) return 0;
  const { body } = parseMarkdown(text);
  return body.split('\n').filter((line) => /^\s*[-*]\s+\S/.test(line)).length;
}
