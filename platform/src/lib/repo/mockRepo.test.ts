import { describe, expect, it } from 'vitest';
import { DEMO_STORAGE_KEY, MockRepoAdapter, type StorageLike } from './mockRepo';
import { buildSnapshot } from './snapshot';

class MapStorage implements StorageLike {
  data = new Map<string, string>();
  getItem(key: string) {
    return this.data.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.data.set(key, value);
  }
  removeItem(key: string) {
    this.data.delete(key);
  }
}

class BrokenStorage implements StorageLike {
  getItem(): string | null {
    throw new Error('geblokkeerd');
  }
  setItem(): void {
    throw new Error('vol');
  }
  removeItem(): void {
    throw new Error('geblokkeerd');
  }
}

const seed = { 'README.md': '# Start\n' };

describe('MockRepoAdapter', () => {
  it('begint met de starter-bestanden en is privé', async () => {
    const repo = new MockRepoAdapter(new MapStorage(), seed);
    expect(await repo.listFiles()).toEqual(['README.md']);
    expect((await repo.getInfo()).isPrivate).toBe(true);
  });

  it('schrijft, leest en logt een commit', async () => {
    const repo = new MockRepoAdapter(new MapStorage(), seed);
    await repo.writeFile('level-1-idee/idee.md', '# Idee\n\nTekst\n', 'Idee vastgelegd');
    expect(await repo.readFile('level-1-idee/idee.md')).toBe('# Idee\n\nTekst\n');
    expect((await repo.commits())[0]).toMatchObject({ message: 'Idee vastgelegd', path: 'level-1-idee/idee.md' });
  });

  it('bewaart de stand voor een volgende sessie', async () => {
    const storage = new MapStorage();
    await new MockRepoAdapter(storage, seed).writeFile('a.md', 'x', 'm');
    expect(await new MockRepoAdapter(storage, seed).readFile('a.md')).toBe('x');
  });

  it('werkt in het geheugen als de opslag geblokkeerd is', async () => {
    const repo = new MockRepoAdapter(new BrokenStorage(), seed);
    await repo.writeFile('a.md', 'x', 'm');
    await repo.mergePullRequest();
    expect(await repo.readFile('a.md')).toBe('x');
    expect((await repo.getInfo()).mergedPullRequests).toBe(1);
  });

  it('valt terug op de starter-repo bij kapotte opslag', async () => {
    const storage = new MapStorage();
    storage.setItem(DEMO_STORAGE_KEY, '{kapot');
    expect(await new MockRepoAdapter(storage, seed).listFiles()).toEqual(['README.md']);
  });

  it('reset zet alles terug', async () => {
    const storage = new MapStorage();
    const repo = new MockRepoAdapter(storage, seed);
    await repo.writeFile('a.md', 'x', 'm');
    await repo.mergePullRequest();
    await repo.reset();
    expect(await repo.listFiles()).toEqual(['README.md']);
    expect((await repo.getInfo()).mergedPullRequests).toBe(0);
    expect(storage.getItem(DEMO_STORAGE_KEY)).toBeNull();
  });

  it('buildSnapshot bundelt bestanden en PR-teller', async () => {
    const repo = new MockRepoAdapter(new MapStorage(), seed);
    await repo.mergePullRequest();
    expect(await buildSnapshot(repo)).toEqual({ files: { 'README.md': '# Start\n' }, mergedPullRequests: 1 });
  });
});
