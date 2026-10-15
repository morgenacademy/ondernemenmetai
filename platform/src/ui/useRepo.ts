import { useCallback, useEffect, useMemo, useState } from 'react';
import { LEVELS } from '../lib/levels';
import { levelStatus } from '../lib/levels/evaluate';
import type { FileWrite } from '../lib/levels/types';
import type { Commit, MockRepoAdapter } from '../lib/repo/mockRepo';
import { buildSnapshot } from '../lib/repo/snapshot';
import type { RepoInfo, RepoSnapshot } from '../lib/repo/types';

export function useRepo(repo: MockRepoAdapter) {
  const [snapshot, setSnapshot] = useState<RepoSnapshot | null>(null);
  const [info, setInfo] = useState<RepoInfo | null>(null);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [lastWritten, setLastWritten] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const [nextSnapshot, nextInfo, nextCommits] = await Promise.all([buildSnapshot(repo), repo.getInfo(), repo.commits()]);
    setSnapshot(nextSnapshot);
    setInfo(nextInfo);
    setCommits(nextCommits);
  }, [repo]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const write = useCallback(
    async (w: FileWrite): Promise<boolean> => {
      try {
        await repo.writeFile(w.path, w.content, w.message);
        setLastWritten(w.path);
        setError(null);
        await refresh();
        return true;
      } catch {
        setError(`Opslaan van ${w.path} is mislukt. Je invoer staat er nog; probeer het opnieuw.`);
        return false;
      }
    },
    [repo, refresh],
  );

  const run = useCallback(
    async (action: () => Promise<void>) => {
      try {
        await action();
        const log = await repo.commits();
        setLastWritten(log[0]?.path ?? null);
        setError(null);
        await refresh();
      } catch {
        setError('Deze demo-actie is mislukt. Probeer het opnieuw.');
      }
    },
    [repo, refresh],
  );

  const status = useMemo(() => (snapshot ? levelStatus(LEVELS, snapshot) : null), [snapshot]);

  return { snapshot, info, commits, status, lastWritten, error, write, run, refresh };
}
