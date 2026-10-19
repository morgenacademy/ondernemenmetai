import { useCallback, useEffect, useMemo, useState } from 'react';
import { LEVELS } from '../lib/levels';
import { levelStatus } from '../lib/levels/evaluate';
import type { FileWrite } from '../lib/levels/types';
import type { MockRepoAdapter } from '../lib/repo/mockRepo';
import { RepoFout } from '../lib/repo/fouten';
import { buildSnapshot } from '../lib/repo/snapshot';
import type { Commit, RepoAdapter, RepoInfo, RepoSnapshot } from '../lib/repo/types';

export const NIET_BEWAARD_MELDING =
  'Je browser bewaart de demo niet meer: de opslag is vol of geblokkeerd. Je werk staat alleen in dit tabblad. Herlaad je de pagina, dan ben je het kwijt.';

/** Melding als de demo-opslag het werk niet meer bewaart, anders null. */
export function opslagMelding(repo: RepoAdapter): string | null {
  if (!('isPersisted' in repo)) return null;
  return (repo as MockRepoAdapter).isPersisted() ? null : NIET_BEWAARD_MELDING;
}

/** Vernieuwt de adapter en leest dan bestanden, info en commits. */
export async function haalRepoOp(repo: RepoAdapter): Promise<{ snapshot: RepoSnapshot; info: RepoInfo; commits: Commit[] }> {
  await repo.refresh();
  const [snapshot, info, commits] = await Promise.all([buildSnapshot(repo), repo.getInfo(), repo.commits()]);
  return { snapshot, info, commits };
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

export function useRepo(repo: RepoAdapter) {
  const [snapshot, setSnapshot] = useState<RepoSnapshot | null>(null);
  const [info, setInfo] = useState<RepoInfo | null>(null);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [lastWritten, setLastWritten] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [fout, setFout] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    try {
      const next = await haalRepoOp(repo);
      setSnapshot(next.snapshot);
      setInfo(next.info);
      setCommits(next.commits);
      setWarning(opslagMelding(repo));
      setFout(null);
    } catch (e) {
      setFout(e instanceof Error ? e : new Error(String(e)));
    }
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
        setFout(null);
        await refresh();
        return true;
      } catch (e) {
        setFout(e instanceof Error ? e : new Error(String(e)));
        setError(e instanceof RepoFout ? e.message : `Opslaan van ${w.path} is mislukt. Je invoer staat er nog; probeer het opnieuw.`);
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

  return { snapshot, info, commits, status, lastWritten, error, warning, write, run, refresh, fout };
}
