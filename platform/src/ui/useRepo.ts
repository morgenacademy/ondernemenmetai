import { useCallback, useEffect, useMemo, useState } from 'react';
import { LEVELS } from '../lib/levels';
import { levelStatus } from '../lib/levels/evaluate';
import type { FileWrite } from '../lib/levels/types';
import type { Commit, MockRepoAdapter } from '../lib/repo/mockRepo';
import { buildSnapshot } from '../lib/repo/snapshot';
import type { RepoInfo, RepoSnapshot } from '../lib/repo/types';

export const NIET_BEWAARD_MELDING =
  'Je browser bewaart de demo niet meer: de opslag is vol of geblokkeerd. Je werk staat alleen in dit tabblad. Herlaad je de pagina, dan ben je het kwijt.';

/** Melding als de demo-opslag het werk niet meer bewaart, anders null. */
export function opslagMelding(repo: MockRepoAdapter): string | null {
  return repo.isPersisted() ? null : NIET_BEWAARD_MELDING;
}

type Luisteraar = Pick<EventTarget, 'addEventListener' | 'removeEventListener'>;

/**
 * Ververst als je terugkomt: in dit tabblad, of uit een andere app zoals je AI-app of GitHub Desktop.
 * Komen beide signalen tegelijk, dan ververst hij één keer.
 */
export function verversBijTerugkomst(win: Luisteraar, doc: Luisteraar & Pick<Document, 'visibilityState'>, refresh: () => void, klok: () => number = Date.now): () => void {
  let vorige = Number.NEGATIVE_INFINITY;
  const ververs = () => {
    if (doc.visibilityState !== 'visible' || klok() - vorige < 1000) return;
    vorige = klok();
    refresh();
  };
  doc.addEventListener('visibilitychange', ververs);
  win.addEventListener('focus', ververs);
  return () => {
    doc.removeEventListener('visibilitychange', ververs);
    win.removeEventListener('focus', ververs);
  };
}

export function useRepo(repo: MockRepoAdapter) {
  const [snapshot, setSnapshot] = useState<RepoSnapshot | null>(null);
  const [info, setInfo] = useState<RepoInfo | null>(null);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [lastWritten, setLastWritten] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const [nextSnapshot, nextInfo, nextCommits] = await Promise.all([buildSnapshot(repo), repo.getInfo(), repo.commits()]);
    setSnapshot(nextSnapshot);
    setInfo(nextInfo);
    setCommits(nextCommits);
    setWarning(opslagMelding(repo));
  }, [repo]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => verversBijTerugkomst(window, document, () => void refresh()), [refresh]);

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

  return { snapshot, info, commits, status, lastWritten, error, warning, write, run, refresh };
}
