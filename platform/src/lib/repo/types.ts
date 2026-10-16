export type RepoInfo = { name: string; owner: string; isPrivate: boolean; mergedPullRequests: number };

export type RepoSnapshot = { files: Record<string, string>; mergedPullRequests: number };

export interface RepoAdapter {
  getInfo(): Promise<RepoInfo>;
  listFiles(): Promise<string[]>;
  readFile(path: string): Promise<string | null>;
  writeFile(path: string, content: string, message: string): Promise<void>;
}
