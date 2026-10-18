import { describe, expect, it } from 'vitest';
import { MockRepoAdapter, type StorageLike } from '../lib/repo/mockRepo';
import { opslagMelding, verversBijTerugkomst } from './useRepo';

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

describe('verversBijTerugkomst', () => {
  const nep = () => {
    const luisteraars = new Map<string, () => void>();
    return {
      visibilityState: 'visible' as DocumentVisibilityState,
      addEventListener: (type: string, f: () => void) => void luisteraars.set(type, f),
      removeEventListener: (type: string) => void luisteraars.delete(type),
      vuur: (type: string) => luisteraars.get(type)?.(),
      luisteraars,
    };
  };

  it('ververst zodra je terugkomt in het tabblad', () => {
    const doc = nep();
    const win = nep();
    let keer = 0;
    verversBijTerugkomst(win, doc, () => keer++, () => 0);
    doc.visibilityState = 'hidden';
    doc.vuur('visibilitychange');
    expect(keer).toBe(0);
    doc.visibilityState = 'visible';
    doc.vuur('visibilitychange');
    expect(keer).toBe(1);
  });

  it('ververst ook als je terugkomt uit een andere app, maar niet twee keer tegelijk', () => {
    const doc = nep();
    const win = nep();
    let keer = 0;
    let nu = 0;
    verversBijTerugkomst(win, doc, () => keer++, () => nu);
    win.vuur('focus');
    doc.vuur('visibilitychange');
    expect(keer).toBe(1);
    nu = 5000;
    win.vuur('focus');
    expect(keer).toBe(2);
  });

  it('ruimt zijn luisteraars op', () => {
    const doc = nep();
    const win = nep();
    const stop = verversBijTerugkomst(win, doc, () => {}, () => 0);
    stop();
    expect(doc.luisteraars.size + win.luisteraars.size).toBe(0);
  });
});
