export type RepoInfo = { name: string; owner: string; isPrivate: boolean; mergedPullRequests: number; url?: string };

export type Commit = { message: string; at: string; path?: string; auteur?: string };

export type RepoSnapshot = { files: Record<string, string>; mergedPullRequests: number };

export type RepoAntwoord = { info: RepoInfo; files: Record<string, string>; commits: Commit[] };

export interface RepoAdapter {
  getInfo(): Promise<RepoInfo>;
  listFiles(): Promise<string[]>;
  readFile(path: string): Promise<string | null>;
  writeFile(path: string, content: string, message: string): Promise<void>;
  commits(): Promise<Commit[]>;
  refresh(): Promise<void>;
}
