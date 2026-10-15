import { useState } from 'react';
import { LEVELS } from './lib/levels';
import type { MockRepoAdapter } from './lib/repo/mockRepo';
import { DemoBalk } from './ui/DemoBalk';
import { LevelKaart } from './ui/LevelKaart';
import { RepoPaneel } from './ui/RepoPaneel';
import { useRepo } from './ui/useRepo';

export default function App({ repo }: { repo: MockRepoAdapter }) {
  const r = useRepo(repo);
  const [selected, setSelected] = useState<number | null>(null);
  const { snapshot, status, info } = r;
  if (!snapshot || !status || !info) return <p className="p-6">Laden…</p>;

  const activeId = LEVELS.find((l) => status[l.id] === 'active')?.id ?? LEVELS[LEVELS.length - 1].id;
  const current = LEVELS.find((l) => l.id === (selected ?? activeId)) ?? LEVELS[0];
  const reset = async () => {
    await repo.reset();
    setSelected(null);
    await r.refresh();
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="logo">
          MORGEN<em>.</em>
        </div>
        <span className="eyebrow" style={{ marginBottom: 0 }}>Ondernemen met AI</span>
      </header>
      <DemoBalk onReset={reset} />
      <LevelKaart levels={LEVELS} status={status} selected={current.id} onSelect={setSelected} />
      {r.error && (
        <p role="alert" className="card mt-4 text-sm">
          {r.error}
        </p>
      )}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <section className="card">
          <p className="eyebrow">Level {current.id}</p>
          <h1 className="level-titel">{current.name}</h1>
          <p className="mt-2">{current.summary}</p>
        </section>
        <RepoPaneel info={info} snapshot={snapshot} commits={r.commits} lastWritten={r.lastWritten} />
      </div>
    </div>
  );
}
