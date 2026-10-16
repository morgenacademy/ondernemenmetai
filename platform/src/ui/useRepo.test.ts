import { describe, expect, it } from 'vitest';
import { MockRepoAdapter, type StorageLike } from '../lib/repo/mockRepo';
import { opslagMelding } from './useRepo';

const fullStorage: StorageLike = {
  getItem: () => null,
  setItem: () => {
    throw new DOMException('Quota overschreden', 'QuotaExceededError');
  },
  removeItem: () => {},
};

describe('opslagMelding', () => {
  it('zegt niets zolang het werk bewaard wordt', async () => {
    const data = new Map<string, string>();
    const storage: StorageLike = {
      getItem: (k) => data.get(k) ?? null,
      setItem: (k, v) => void data.set(k, v),
      removeItem: (k) => void data.delete(k),
    };
    const repo = new MockRepoAdapter(storage, {});
    await repo.writeFile('a.md', 'x', 'm');
    expect(opslagMelding(repo)).toBeNull();
  });

  it('waarschuwt dat het werk verloren gaat als de opslag vol is', async () => {
    const repo = new MockRepoAdapter(fullStorage, {});
    await repo.writeFile('a.md', 'x', 'm');
    expect(opslagMelding(repo)).toMatch(/niet .*bewaard|kwijt/);
  });
});
