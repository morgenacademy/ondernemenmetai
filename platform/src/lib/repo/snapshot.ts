import type { RepoAdapter, RepoSnapshot } from './types';

export async function buildSnapshot(adapter: RepoAdapter): Promise<RepoSnapshot> {
  const [info, paths] = await Promise.all([adapter.getInfo(), adapter.listFiles()]);
  const entries = await Promise.all(
    paths.map(async (path) => [path, (await adapter.readFile(path)) ?? ''] as const),
  );
  return { files: Object.fromEntries(entries), mergedPullRequests: info.mergedPullRequests };
}
