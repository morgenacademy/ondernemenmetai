export type TreeRow = { kind: 'folder' | 'file'; name: string; depth: number; path: string };

export function treeRows(paths: string[]): TreeRow[] {
  const rows: TreeRow[] = [];
  const seen = new Set<string>();
  for (const path of [...paths].sort()) {
    const parts = path.split('/');
    for (let i = 0; i < parts.length - 1; i++) {
      const folder = parts.slice(0, i + 1).join('/');
      if (!seen.has(folder)) {
        seen.add(folder);
        rows.push({ kind: 'folder', name: parts[i], depth: i, path: folder });
      }
    }
    rows.push({ kind: 'file', name: parts[parts.length - 1], depth: parts.length - 1, path });
  }
  return rows;
}
