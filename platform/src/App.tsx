import { useCallback, useEffect, useState } from 'react';
import { HANDMATIG_KEY, INTRO_KEY, leesHandmatig, leesVlag, schrijfHandmatig, zetVlag } from './beleving/handmatig';
import { LevelScherm } from './beleving/LevelScherm';
import { parseRoute, routeHash, type Route } from './beleving/route';
import { Routekaart } from './beleving/Routekaart';
import { repoZichtbaar } from './beleving/voortgang';
import { Welkom } from './beleving/Welkom';
import { vulLevel, vulStap } from './demo/vullen';
import { LEVELS } from './lib/levels';
import type { FileWrite } from './lib/levels/types';
import type { MockRepoAdapter, StorageLike } from './lib/repo/mockRepo';
import { KlantKnop } from './ui/KlantKnop';
import { RepoPaneel } from './ui/RepoPaneel';
import { useRepo } from './ui/useRepo';

type Props = { repo: MockRepoAdapter; storage?: StorageLike | null };

function huidigeHash(): string {
  try {
    return window.location.hash;
  } catch {
    return '';
  }
}

export default function App({ repo, storage = null }: Props) {
  const r = useRepo(repo);
  const [introGezien, setIntroGezien] = useState(() => leesVlag(storage, INTRO_KEY));
  const [route, setRoute] = useState<Route>(() => parseRoute(huidigeHash(), introGezien));
  const [handmatig, setHandmatig] = useState(() => leesHandmatig(storage));
  const [lade, setLade] = useState(false);
  const { snapshot, status, info } = r;

  useEffect(() => {
    const opWijziging = () => setRoute(parseRoute(huidigeHash(), leesVlag(storage, INTRO_KEY)));
    window.addEventListener('hashchange', opWijziging);
    return () => window.removeEventListener('hashchange', opWijziging);
  }, [storage]);

  // Wie het welkomstscherm verlaat, heeft de intro gezien; de volgende keer begin je op de route.
  useEffect(() => {
    if (route.scherm !== 'welkom' && !introGezien) {
      zetVlag(storage, INTRO_KEY, true);
      setIntroGezien(true);
    }
    window.scrollTo({ top: 0 });
  }, [route, introGezien, storage]);

  const gaNaar = useCallback((naar: Route) => {
    window.location.hash = routeHash(naar);
  }, []);

  const vinkAf = useCallback(
    (stepId: string) => {
      setHandmatig((oud) => {
        const nieuw = new Set(oud).add(stepId);
        schrijfHandmatig(storage, nieuw);
        return nieuw;
      });
    },
    [storage],
  );

  if (!snapshot || !status || !info) return <p className="p-6">Laden…</p>;

  const reset = async () => {
    if (!window.confirm('Alles wissen en opnieuw beginnen?')) return;
    await repo.reset();
    try {
      storage?.removeItem(HANDMATIG_KEY);
    } catch {
      // Geblokkeerde opslag: de vinkjes gelden dan alleen in dit tabblad.
    }
    setHandmatig(new Set());
    setLade(false);
    await r.refresh();
    gaNaar({ scherm: 'route', van: null });
  };

  const level = route.scherm === 'level' ? LEVELS.find((l) => l.id === route.level) : undefined;
  const opLevel = level && status[level.id] !== 'locked' ? level : undefined;
  const demoStap = (stepId: string) => {
    const step = opLevel?.steps.find((s) => s.id === stepId);
    if (step) void r.run(() => vulStap(step, repo));
  };
  const demoLevel = () => {
    if (opLevel) void r.run(() => vulLevel(opLevel, repo));
  };
  const klant = async (w: FileWrite) => {
    const ok = await r.write(w);
    if (ok) gaNaar({ scherm: 'level', level: 6 });
    return ok;
  };
  const toonRepo = repoZichtbaar(handmatig, status);

  return (
    <div className="bl">
      <header className="bl-top">
        <a className="bl-logo" href="#/route" aria-label="Morgen, naar je route">
          MORGEN<em>.</em>
        </a>
        <nav className="bl-top-rechts" aria-label="Platform">
          {route.scherm === 'welkom' && (
            <a className="bl-top-knop" href="#/route">
              Sla de intro over
            </a>
          )}
          {route.scherm === 'level' && (
            <a className="bl-top-knop" href="#/route">
              ← Jouw route
            </a>
          )}
          {route.scherm === 'route' && (
            <a className="bl-top-knop" href="#/welkom">
              ↺ Bekijk de intro opnieuw
            </a>
          )}
          {route.scherm !== 'welkom' && toonRepo && (
            <button type="button" className="bl-top-knop" aria-expanded={lade} aria-controls="bl-lade" onClick={() => setLade((o) => !o)}>
              Jouw repo
            </button>
          )}
          {route.scherm !== 'welkom' && (
            <button type="button" className="bl-top-knop" onClick={() => void reset()}>
              Demo opnieuw
            </button>
          )}
        </nav>
      </header>

      {(r.error || r.warning) && (
        <div className="bl-meldingen">
          {r.error && <p role="alert">{r.error}</p>}
          {r.warning && <p role="alert">{r.warning}</p>}
        </div>
      )}

      {route.scherm === 'welkom' && <Welkom />}
      {route.scherm === 'route' && (
        <Routekaart key={`route-${route.van}`} status={status} van={route.van}>
          {status[1] !== 'locked' && status[6] === 'locked' && (
            <div className="bl-klant">
              <KlantKnop snapshot={snapshot} onSave={klant} />
            </div>
          )}
        </Routekaart>
      )}
      {route.scherm === 'level' && !opLevel && <Routekaart key={`slot-${route.level}`} status={status} van={null} begin={route.level} />}
      {opLevel && (
        <LevelScherm
          key={opLevel.id}
          level={opLevel}
          snapshot={snapshot}
          levelAf={status[opLevel.id] === 'done'}
          handmatig={handmatig}
          onHandmatig={vinkAf}
          onSave={r.write}
          onDemo={demoStap}
          onFillLevel={demoLevel}
        />
      )}

      {lade && toonRepo && (
        <aside className="bl-lade" id="bl-lade" aria-label="Jouw repo">
          <button type="button" className="bl-top-knop bl-lade-sluit" onClick={() => setLade(false)}>
            Sluiten
          </button>
          <RepoPaneel info={info} snapshot={snapshot} commits={r.commits} lastWritten={r.lastWritten} showPullRequests={status[2] !== 'locked'} />
        </aside>
      )}
    </div>
  );
}
