import { useState } from 'react';
import type { Commit } from '../lib/repo/mockRepo';
import type { RepoInfo, RepoSnapshot } from '../lib/repo/types';
import { treeRows } from './tree';

type Props = { info: RepoInfo; snapshot: RepoSnapshot; commits: Commit[]; lastWritten: string | null };

export function RepoPaneel({ info, snapshot, commits, lastWritten }: Props) {
  const [open, setOpen] = useState<string | null>(null);
  const prs = info.mergedPullRequests;
  return (
    <aside className="card self-start" aria-label="Jouw repo">
      <p className="eyebrow">Jouw repo</p>
      <h2 className="text-xl font-extrabold text-white">
        {info.owner}/{info.name}
      </h2>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        {info.isPrivate ? 'Privé' : 'Openbaar'} · {prs} gemergde pull request{prs === 1 ? '' : 's'}
      </p>
      <ul className="repo-boom">
        {treeRows(Object.keys(snapshot.files)).map((row) => (
          <li key={row.path} style={{ paddingLeft: `${row.depth * 0.9}rem` }}>
            {row.kind === 'folder' ? (
              <span className="repo-map">{row.name}/</span>
            ) : (
              <>
                <button
                  type="button"
                  className={`repo-bestand${row.path === lastWritten ? ' is-nieuw' : ''}`}
                  aria-expanded={open === row.path}
                  onClick={() => setOpen(open === row.path ? null : row.path)}
                >
                  {row.name}
                </button>
                {open === row.path && <pre className="repo-inhoud">{snapshot.files[row.path]}</pre>}
              </>
            )}
          </li>
        ))}
      </ul>
      {commits.length > 0 && (
        <div className="mt-4">
          <p className="eyebrow">Laatste commits</p>
          <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
            {commits.slice(0, 3).map((c) => (
              <li key={`${c.at}-${c.path}`}>{c.message}</li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
