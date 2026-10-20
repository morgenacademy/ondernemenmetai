import { RepoFout } from './fouten';
import type { Commit, RepoAdapter, RepoInfo } from './types';

/** De repo vóór het koppelen: geen bestanden, en schrijven kan nog niet. */
export class LegeRepo implements RepoAdapter {
  async getInfo(): Promise<RepoInfo> {
    return { name: '', owner: '', isPrivate: true, mergedPullRequests: 0 };
  }
  async listFiles(): Promise<string[]> {
    return [];
  }
  async readFile(_path: string): Promise<string | null> {
    return null;
  }
  async writeFile(_path: string, _content: string, _message: string): Promise<void> {
    throw new RepoFout('Koppel eerst je repo in stap 3 van level 0.');
  }
  async commits(): Promise<Commit[]> {
    return [];
  }
  async refresh(): Promise<void> {}
}
