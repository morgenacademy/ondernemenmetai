import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { HANDMATIG_KEY, INTRO_KEY, handmatigSleutel, leesHandmatig, leesVlag, schrijfHandmatig, zetVlag } from './beleving/handmatig';
import { LevelScherm } from './beleving/LevelScherm';
import { toonMelding } from './beleving/meldingen';
import { parseRoute, routeHash, type Route } from './beleving/route';
import { Routekaart } from './beleving/Routekaart';
import { StandContext, type Stand } from './beleving/stand';
import { useEchteSessie } from './beleving/useEchteSessie';
import { huidigLevel, metKoppeling, repoZichtbaar } from './beleving/voortgang';
import { Welkom } from './beleving/Welkom';
import { vulLevel, vulStap } from './demo/vullen';
import { LEVELS } from './lib/levels';
import { evaluateLevel } from './lib/levels/evaluate';
import type { FileWrite } from './lib/levels/types';
import { GeenRepo, NietIngelogd } from './lib/repo/fouten';
import type { GitHubRepoAdapter } from './lib/repo/githubRepo';
import { LegeRepo } from './lib/repo/legeRepo';
import type { MockRepoAdapter, StorageLike } from './lib/repo/mockRepo';
import type { RepoAdapter, RepoSnapshot } from './lib/repo/types';
import { inlogUrl } from './lib/sessie';
import { RepoPaneel } from './ui/RepoPaneel';
import { useRepo } from './ui/useRepo';

/** De demo draait op een mock-repo in de browser; de echte stand op de GitHub-repo van de deelnemer. */
export type AppStand = { soort: 'demo'; repo: MockRepoAdapter } | { soort: 'echt'; github: GitHubRepoAdapter };

type Props = { stand: AppStand; storage?: StorageLike | null };

// Zonder koppeling rekent de echte stand met een lege repo. Eén instantie: een nieuwe zou useRepo bij elke render laten ophalen.
const LEGE_REPO = new LegeRepo();
const DEMO: Stand = { demo: true };

export default function App({ stand, storage = null }: Props) {
  const echt = stand.soort === 'echt';
  const mock = stand.soort === 'demo' ? stand.repo : null;
  // gekoppeldMet: de repo waarmee dit tabblad rekent. Ben je hier uitgelogd, dan blijft hij staan, met je ingevulde formulieren.
  const { sessie, repo: gekoppeldMet, fout: sessieFout, zoek, laad, kies, loguit } = useEchteSessie(echt);
  const gekoppeld = gekoppeldMet !== null;
  const repo: RepoAdapter = stand.soort === 'demo' ? stand.repo : gekoppeld ? stand.github : LEGE_REPO;
  const r = useRepo(repo);
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.hash, leesVlag(storage, INTRO_KEY)));
  const [lade, setLade] = useState(false);
  const [bezig, setBezig] = useState(false);
  const { status, info } = r;

  // Vinkjes horen bij een sleutel, in de echte stand per repo. Wisselt de sleutel (sessie binnen, repo gekozen), dan lees je ze opnieuw.
  const sleutel = handmatigSleutel(stand.soort, gekoppeldMet);
  const [vinkjes, setVinkjes] = useState(() => ({ sleutel, ids: leesHandmatig(storage, sleutel) }));
  if (vinkjes.sleutel !== sleutel) setVinkjes({ sleutel, ids: leesHandmatig(storage, sleutel) });
  const handmatig = useMemo(() => metKoppeling(vinkjes.ids, gekoppeld), [vinkjes.ids, gekoppeld]);

  // Wisselt de repo (leeg ↔ gekoppeld), dan telt de stand van de vorige niet meer: tot de nieuwe binnen is, staat er "Laden…".
  // Anders zie je even een lege repo, en viert een level dat al af was zijn slotscherm opnieuw.
  // Ook een schrijffout van vóór de wissel (bijv. vóór het opnieuw koppelen) telt niet meer in de melding.
  const [repoWissel, setRepoWissel] = useState<{ repo: RepoAdapter; oud: RepoSnapshot | null; error: string | null }>({ repo, oud: null, error: null });
  if (repoWissel.repo !== repo) setRepoWissel({ repo, oud: r.snapshot, error: r.error });
  const snapshot = r.snapshot !== repoWissel.oud ? r.snapshot : null;

  // Uitgelogd, of je repo is weg: haal de sessie opnieuw op. Na GeenRepo rekent App met de lege repo. Na uitloggen blijft de repo
  // staan, en zeggen de melding en de bovenbalk dat je moet inloggen.
  // Geen lus: blijft de repo, dan blijft r.fout dezelfde fout; met de lege repo is r.fout daarna leeg. Dan draait dit effect niet opnieuw.
  useEffect(() => {
    if (echt && (r.fout instanceof NietIngelogd || r.fout instanceof GeenRepo)) void laad(r.fout);
  }, [echt, r.fout, laad]);

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

  // De melding bovenaan, met wat je kunt doen (zie toonMelding). In de demo de melding van opslaan, zoals altijd.
  const melding = toonMelding({ echt, fout: r.fout, error: r.error, errorBijWissel: repoWissel.error, warning: r.warning, sessieFout, zoek });
  const meldingBlok = melding && (
    <p role="alert" className="bl-melding">
      {melding.tekst}
      {melding.actie === 'inloggen' && (
        <>
          <br />
          <a className="bl-knop-tweede" href={inlogUrl(routeHash(route))}>
            Log in met GitHub
          </a>
        </>
      )}
      {melding.actie === 'opnieuw' && (
        <>
          <br />
          <button type="button" className="bl-knop-tweede" onClick={() => void (melding.bron === 'repo' ? r.refresh() : laad())}>
            Opnieuw
          </button>
        </>
      )}
    </p>
  );

  if (!snapshot || !status || !info || (echt && !sessie)) {
    if (!echt) return <p className="p-6">Laden…</p>;
    return <div className="bl">{meldingBlok ?? <p className="p-6">Laden…</p>}</div>;
  }

  const vinkAf = (stepId: string) => {
    const nieuw = new Set(vinkjes.ids).add(stepId);
    setVinkjes({ sleutel, ids: nieuw });
    schrijfHandmatig(storage, nieuw, sleutel);
  };
  // De demohandlers werken alleen in de demo. In de echte stand doen ze niets (en hun knoppen staan er niet).
  const demo = async (actie: () => Promise<void>) => {
    setBezig(true);
    await r.run(actie);
    setBezig(false);
  };
  const reset = async () => {
    if (!mock) return;
    if (!window.confirm('Alles wissen en opnieuw beginnen?')) return;
    await mock.reset();
    setVinkjes({ sleutel, ids: new Set() });
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
  const demoVoortgang = (tot: number) => {
    if (!mock) return;
    void demo(async () => {
      if (tot < huidigLevel(status)) await mock.reset();
      for (const level of LEVELS.filter((l) => l.id < tot)) await vulLevel(level, mock);
    });
  };
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
            <span className="bl-lang">Sla de intro over</span>
            <span className="bl-kort">Overslaan</span>
          </button>
        )}
        {route.scherm === 'route' && (
          <button type="button" className="bl-top-knop" onClick={() => navigeer({ scherm: 'welkom' })}>
            ↺ <span className="bl-lang">Bekijk de intro opnieuw</span>
            <span className="bl-kort">Intro</span>
          </button>
        )}
        {route.scherm === 'level' && (
          <button type="button" className="bl-top-knop" onClick={() => navigeer({ scherm: 'route', van: null })}>
            ← <span className="bl-lang">Jouw route</span>
            <span className="bl-kort">Route</span>
          </button>
        )}
        {route.scherm !== 'welkom' && repoZichtbaar(handmatig, status) && (
          <button type="button" className="bl-top-knop" aria-expanded={lade} onClick={() => setLade(!lade)}>
            Jouw repo
          </button>
        )}
        {sessie?.stand === 'uit' && (
          <a className="bl-top-knop" href={inlogUrl(routeHash(route))}>
            Log in met GitHub
          </a>
        )}
        {sessie && sessie.stand !== 'uit' && (
          <>
            <span className="bl-lang self-center text-sm font-semibold text-[var(--bl-text-2)]">{sessie.login}</span>
            <button type="button" className="bl-top-knop" onClick={() => void loguit()}>
              Uitloggen
            </button>
          </>
        )}
      </div>
    </div>
  );

  const level = route.scherm === 'level' ? LEVELS.find((l) => l.id === route.level) : undefined;
  const standWaarde: Stand = sessie ? { demo: false, sessie, kiesRepo: kies, terug: routeHash(route) } : DEMO;

  return (
    <StandContext.Provider value={standWaarde}>
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
              if (mock && step) void demo(() => vulStap(step, mock));
            }}
            onFillLevel={() => {
              if (mock) void demo(() => vulLevel(level, mock));
            }}
            onNaarRoute={(van) => navigeer({ scherm: 'route', van })}
            onVervers={() => void r.refresh()}
          />
        )}
        {lade && repoZichtbaar(handmatig, status) && (
          <aside className="bl-lade" aria-label="Jouw repo">
            <button type="button" className="bl-top-knop bl-lade-sluit" onClick={() => setLade(false)}>
              Sluiten
            </button>
            <RepoPaneel info={info} snapshot={snapshot} commits={r.commits} lastWritten={r.lastWritten} showPullRequests={status[2] !== 'locked'} />
          </aside>
        )}
        {meldingBlok}
      </div>
    </StandContext.Provider>
  );
}
