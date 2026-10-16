import { useEffect, useRef, useState } from 'react';
import { vulLevel, vulStap } from './demo/vullen';
import { LEVELS } from './lib/levels';
import type { FileWrite, LevelState } from './lib/levels/types';
import type { MockRepoAdapter } from './lib/repo/mockRepo';
import { DemoBalk } from './ui/DemoBalk';
import { KlantKnop } from './ui/KlantKnop';
import { LevelKaart } from './ui/LevelKaart';
import { LevelPagina } from './ui/LevelPagina';
import { RepoPaneel } from './ui/RepoPaneel';
import { Tussenscherm, afgerondLevel } from './ui/Tussenscherm';
import { useRepo } from './ui/useRepo';

export default function App({ repo }: { repo: MockRepoAdapter }) {
  const r = useRepo(repo);
  const [selected, setSelected] = useState<number | null>(null);
  const [tussenscherm, setTussenscherm] = useState<number | null>(null);
  const vorige = useRef<Record<number, LevelState> | null>(null);
  const { snapshot, status, info } = r;

  const activeId = status ? (LEVELS.find((l) => status[l.id] === 'active')?.id ?? LEVELS[LEVELS.length - 1].id) : 0;
  const current = LEVELS.find((l) => l.id === (selected ?? activeId)) ?? LEVELS[0];

  // Werd het level waar je aan werkt net af, dan komt het tussenscherm naar het volgende level.
  useEffect(() => {
    if (!status) return;
    const af = afgerondLevel(vorige.current, status, current.id);
    vorige.current = status;
    if (af !== null) {
      setTussenscherm(af);
      window.scrollTo({ top: 0 });
    }
  }, [status, current.id]);

  if (!snapshot || !status || !info) return <p className="p-6">Laden…</p>;

  const kiesLevel = (id: number | null) => {
    setTussenscherm(null);
    setSelected(id);
  };
  const reset = async () => {
    await repo.reset();
    vorige.current = null;
    kiesLevel(null);
    await r.refresh();
  };
  // Wie op een level werkt, blijft daar staan: zo ziet de deelnemer het tussenscherm
  // in plaats van ongemerkt door te springen naar het volgende level.
  const save = (w: FileWrite) => {
    setSelected(current.id);
    return r.write(w);
  };
  const demoStap = (stepId: string) => {
    const step = current.steps.find((s) => s.id === stepId);
    if (!step) return;
    setSelected(current.id);
    void r.run(() => vulStap(step, repo));
  };
  const demoLevel = () => {
    setSelected(current.id);
    void r.run(() => vulLevel(current, repo));
  };
  const klant = async (w: FileWrite) => {
    const ok = await r.write(w);
    if (ok) kiesLevel(6);
    return ok;
  };
  const nextLevel = LEVELS.find((l) => l.id === current.id + 1);
  const afLevel = LEVELS.find((l) => l.id === tussenscherm);
  const naAf = LEVELS.find((l) => l.id === (tussenscherm ?? -1) + 1);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="logo">
          MORGEN<em>.</em>
        </div>
        <span className="eyebrow" style={{ marginBottom: 0 }}>
          Ondernemen met AI
        </span>
      </header>
      <DemoBalk onReset={reset} />
      <LevelKaart levels={LEVELS} status={status} selected={current.id} onSelect={kiesLevel} />
      {status[1] !== 'locked' && status[6] === 'locked' && <KlantKnop snapshot={snapshot} onSave={klant} />}
      {r.error && (
        <p role="alert" className="card mt-4 text-sm">
          {r.error}
        </p>
      )}
      {r.warning && (
        <p role="alert" className="card mt-4 text-sm">
          {r.warning}
        </p>
      )}
      <div className="hoofd-grid mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        {afLevel ? (
          <Tussenscherm
            level={afLevel}
            volgende={naAf}
            onVolgende={naAf ? () => kiesLevel(naAf.id) : undefined}
            onTerug={() => kiesLevel(afLevel.id)}
          />
        ) : (
          <LevelPagina
            level={current}
            state={status[current.id]}
            snapshot={snapshot}
            onSave={save}
            onDemo={demoStap}
            onFillLevel={demoLevel}
            onNext={nextLevel ? () => kiesLevel(nextLevel.id) : undefined}
          />
        )}
        <RepoPaneel info={info} snapshot={snapshot} commits={r.commits} lastWritten={r.lastWritten} showPullRequests={status[2] !== 'locked'} />
      </div>
    </div>
  );
}
