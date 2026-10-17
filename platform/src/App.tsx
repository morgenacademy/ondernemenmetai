import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { HANDMATIG_KEY, INTRO_KEY, leesHandmatig, leesVlag, schrijfHandmatig, zetVlag } from './beleving/handmatig';
import { LevelScherm } from './beleving/LevelScherm';
import { parseRoute, routeHash, type Route } from './beleving/route';
import { Routekaart } from './beleving/Routekaart';
import { huidigLevel } from './beleving/voortgang';
import { Welkom } from './beleving/Welkom';
import { vulLevel, vulStap } from './demo/vullen';
import { LEVELS } from './lib/levels';
import { evaluateLevel } from './lib/levels/evaluate';
import type { FileWrite } from './lib/levels/types';
import type { MockRepoAdapter, StorageLike } from './lib/repo/mockRepo';
import { RepoPaneel } from './ui/RepoPaneel';
import { useRepo } from './ui/useRepo';

type Props = { repo: MockRepoAdapter; storage?: StorageLike | null };

export default function App({ repo, storage = null }: Props) {
  const r = useRepo(repo);
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.hash, leesVlag(storage, INTRO_KEY)));
  const [handmatig, setHandmatig] = useState<Set<string>>(() => leesHandmatig(storage));
  const [lade, setLade] = useState(false);
  const [bezig, setBezig] = useState(false);
  const { snapshot, status, info } = r;

  useEffect(() => {
    const wissel = () => setRoute(parseRoute(window.location.hash, leesVlag(storage, INTRO_KEY)));
    window.addEventListener('hashchange', wissel);
    return () => window.removeEventListener('hashchange', wissel);
  }, [storage]);

  const navigeer = useCallback((naar: Route) => {
    window.location.hash = routeHash(naar);
    setRoute(naar);
  }, []);

  // Elk nieuw scherm begint bovenaan. Pas na het tekenen: anders springt de oude, kortere pagina terug.
  const schermSleutel = routeHash(route);
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [schermSleutel]);

  if (!snapshot || !status || !info) return <p className="p-6">Laden…</p>;

  const vinkAf = (stepId: string) => {
    const nieuw = new Set(handmatig).add(stepId);
    setHandmatig(nieuw);
    schrijfHandmatig(storage, nieuw);
  };
  const demo = async (actie: () => Promise<void>) => {
    setBezig(true);
    await r.run(actie);
    setBezig(false);
  };
  const reset = async () => {
    if (!window.confirm('Alles wissen en opnieuw beginnen?')) return;
    await repo.reset();
    setHandmatig(new Set());
    try {
      storage?.removeItem(HANDMATIG_KEY);
    } catch {
      // Geblokkeerde opslag: het geheugen is al leeg.
    }
    zetVlag(storage, INTRO_KEY, false);
    await r.refresh();
    navigeer({ scherm: 'welkom' });
  };
  // Demo: vult de levels vóór het gekozen level. Wil je terug, dan begint de demo eerst opnieuw.
  const demoVoortgang = (tot: number) =>
    void demo(async () => {
      if (tot < huidigLevel(status)) await repo.reset();
      for (const level of LEVELS.filter((l) => l.id < tot)) await vulLevel(level, repo);
    });
  const klant = async (w: FileWrite) => {
    const ok = await r.write(w);
    if (ok) navigeer({ scherm: 'level', level: 6 });
    return ok;
  };

  const balk = (
    <div className="bl-top">
      <button type="button" className="bl-logo" onClick={() => navigeer({ scherm: 'route', van: null })} aria-label="Naar je route">
        MORGEN<em>.</em>
      </button>
      <div className="bl-top-rechts">
        {route.scherm === 'welkom' && (
          <button type="button" className="bl-top-knop" onClick={() => (zetVlag(storage, INTRO_KEY, true), navigeer({ scherm: 'route', van: null }))}>
            Sla de intro over
          </button>
        )}
        {route.scherm === 'route' && (
          <button type="button" className="bl-top-knop" onClick={() => navigeer({ scherm: 'welkom' })}>
            ↺ Bekijk de intro opnieuw
          </button>
        )}
        {route.scherm === 'level' && (
          <button type="button" className="bl-top-knop" onClick={() => navigeer({ scherm: 'route', van: null })}>
            ← Jouw route
          </button>
        )}
        {route.scherm !== 'welkom' && (
          <button type="button" className="bl-top-knop" aria-expanded={lade} onClick={() => setLade(!lade)}>
            Jouw repo
          </button>
        )}
      </div>
    </div>
  );

  const level = route.scherm === 'level' ? LEVELS.find((l) => l.id === route.level) : undefined;

  return (
    <div className="bl">
      {balk}
      {route.scherm === 'welkom' && (
        <Welkom
          onNaarRoute={() => {
            zetVlag(storage, INTRO_KEY, true);
            navigeer({ scherm: 'route', van: null });
          }}
        />
      )}
      {route.scherm === 'route' && (
        <Routekaart
          key={route.van ?? 'route'}
          status={status}
          van={route.van}
          snapshot={snapshot}
          bezig={bezig}
          onOpen={(id) => navigeer({ scherm: 'level', level: id })}
          onDemoVoortgang={demoVoortgang}
          onReset={() => void reset()}
          onKlant={klant}
          onAangekomen={() => window.history.replaceState(null, '', routeHash({ scherm: 'route', van: null }))}
        />
      )}
      {level && (
        <LevelScherm
          key={level.id}
          level={level}
          state={status[level.id]}
          status={status}
          snapshot={snapshot}
          evaluation={evaluateLevel(level, snapshot)}
          handmatig={handmatig}
          onHandmatig={vinkAf}
          onSave={r.write}
          onDemoStap={(stepId) => {
            const step = level.steps.find((s) => s.id === stepId);
            if (step) void demo(() => vulStap(step, repo));
          }}
          onFillLevel={() => void demo(() => vulLevel(level, repo))}
          onNaarRoute={(van) => navigeer({ scherm: 'route', van })}
        />
      )}
      {lade && (
        <aside className="bl-lade" aria-label="Jouw repo">
          <button type="button" className="bl-top-knop bl-lade-sluit" onClick={() => setLade(false)}>
            Sluiten
          </button>
          <RepoPaneel info={info} snapshot={snapshot} commits={r.commits} lastWritten={r.lastWritten} showPullRequests={status[2] !== 'locked'} />
        </aside>
      )}
      {(r.error || r.warning) && (
        <p role="alert" className="bl-melding">
          {r.error ?? r.warning}
        </p>
      )}
    </div>
  );
}
