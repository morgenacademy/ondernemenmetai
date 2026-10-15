import type { RepoAdapter, RepoInfo } from './types';

export type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
export type Commit = { message: string; path: string; at: string };
type State = { files: Record<string, string>; mergedPullRequests: number; commits: Commit[] };

export const DEMO_STORAGE_KEY = 'ondernemen-met-ai.demo-repo.v1';

/** Wist de opgeslagen demo-stand, zodat de demo na herladen opnieuw begint vanaf de starter-repo. */
export function clearDemoStorage(storage: StorageLike | null): void {
  try {
    storage?.removeItem(DEMO_STORAGE_KEY);
  } catch {
    // Geblokkeerde opslag: er staat dan ook niets dat de demo kan laten vastlopen.
  }
}

function isState(value: unknown): value is State {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Partial<State>;
  return typeof v.files === 'object' && v.files !== null && typeof v.mergedPullRequests === 'number' && Array.isArray(v.commits);
}

/** Nagebootste repo voor de klikbare demo. Bewaart in localStorage, valt terug op geheugen. */
export class MockRepoAdapter implements RepoAdapter {
  private memory: State | null = null;
  private persisted = true;

  constructor(
    private readonly storage: StorageLike | null,
    private readonly seed: Record<string, string>,
    private readonly repoName = 'mijn-onderneming',
  ) {}

  private initial(): State {
    return { files: { ...this.seed }, mergedPullRequests: 0, commits: [] };
  }

  private load(): State {
    if (this.memory) return this.memory;
    let state = this.initial();
    try {
      const raw = this.storage?.getItem(DEMO_STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (isState(parsed)) state = parsed;
      }
    } catch {
      // Kapotte of geblokkeerde opslag: begin opnieuw vanaf de starter-repo.
    }
    this.memory = state;
    return state;
  }

  private save(state: State): void {
    this.memory = state;
    try {
      if (!this.storage) throw new Error('geen opslag');
      this.storage.setItem(DEMO_STORAGE_KEY, JSON.stringify(state));
      this.persisted = true;
    } catch {
      // Opslag vol of geblokkeerd: de demo werkt verder in het geheugen, maar meldt dat via isPersisted().
      this.persisted = false;
    }
  }

  /** false = de laatste wijziging staat alleen in het geheugen en is weg na herladen. */
  isPersisted(): boolean {
    return this.persisted;
  }

  async getInfo(): Promise<RepoInfo> {
    return { name: this.repoName, owner: 'demo', isPrivate: true, mergedPullRequests: this.load().mergedPullRequests };
  }

  async listFiles(): Promise<string[]> {
    return Object.keys(this.load().files).sort();
  }

  async readFile(path: string): Promise<string | null> {
    return this.load().files[path] ?? null;
  }

  async writeFile(path: string, content: string, message: string): Promise<void> {
    const state = this.load();
    const commit: Commit = { message, path, at: new Date().toISOString() };
    this.save({ ...state, files: { ...state.files, [path]: content }, commits: [commit, ...state.commits].slice(0, 50) });
  }

  async mergePullRequest(): Promise<void> {
    const state = this.load();
    this.save({ ...state, mergedPullRequests: state.mergedPullRequests + 1 });
  }

  async commits(): Promise<Commit[]> {
    return this.load().commits;
  }

  async reset(): Promise<void> {
    this.memory = this.initial();
    try {
      this.storage?.removeItem(DEMO_STORAGE_KEY);
      this.persisted = true;
    } catch {
      // Het geheugen is al teruggezet, maar de oude stand komt terug na herladen.
      this.persisted = false;
    }
  }
}
