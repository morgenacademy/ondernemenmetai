import { expect, it } from 'vitest';
import { treeRows } from './tree';

it('treeRows zet mappen boven hun bestanden', () => {
  expect(treeRows(['level-1-idee/idee.md', 'README.md', 'level-1-idee/sub/x.md'])).toEqual([
    { kind: 'file', name: 'README.md', depth: 0, path: 'README.md' },
    { kind: 'folder', name: 'level-1-idee', depth: 0, path: 'level-1-idee' },
    { kind: 'file', name: 'idee.md', depth: 1, path: 'level-1-idee/idee.md' },
    { kind: 'folder', name: 'sub', depth: 1, path: 'level-1-idee/sub' },
    { kind: 'file', name: 'x.md', depth: 2, path: 'level-1-idee/sub/x.md' },
  ]);
});
