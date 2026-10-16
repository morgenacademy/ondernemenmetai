// Leest alle Markdown-bestanden uit /starter-repo in als beginstand van de demo-repo.
const raw = import.meta.glob('../../../../starter-repo/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export const starterFiles: Record<string, string> = Object.fromEntries(
  Object.entries(raw).map(([path, text]) => [path.replace(/^.*starter-repo\//, ''), text]),
);
