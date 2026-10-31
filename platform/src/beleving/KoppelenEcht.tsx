import { useState } from 'react';
import { lijktStarterRepo, TEMPLATE_URL } from '../lib/repo/starter';
import type { RepoSnapshot } from '../lib/repo/types';
import { koppelUrl } from '../lib/sessie';
import { useStand } from './stand';

/** Koppelen met de echte GitHub App: installeren op GitHub, een repo kiezen als die er al is, en zien dat het gelukt is. */
export function KoppelenEcht({ af, snapshot }: { af: boolean; snapshot: RepoSnapshot }) {
  const stand = useStand();
  const [bezig, setBezig] = useState(false);
  if (stand.demo) return null;
  const { sessie, kiesRepo, terug } = stand;

  if (sessie.stand === 'gekoppeld')
    return (
      <div className="bl-paneel-echt" style={{ textAlign: 'center' }}>
        <p className="bl-gelukt">✓ Gekoppeld met {sessie.repo}</p>
        {af && <p className="bl-hint">Dit platform kan nu in die ene repo kijken en er je keuzes in zetten.</p>}
        {!lijktStarterRepo(snapshot) && (
          <>
            <p className="bl-hint">Deze repo lijkt niet gemaakt met de starter-repo.</p>
            <a className="bl-vknop o" href={TEMPLATE_URL} target="_blank" rel="noreferrer">
              Maak een repo met de starter-repo
            </a>
          </>
        )}
      </div>
    );

  if (sessie.stand === 'kies-repo' && sessie.repos.length >= 1)
    return (
      <div className="bl-paneel-echt" style={{ textAlign: 'center' }}>
        <p className="bl-veldlabel">Welke repo is van je onderneming?</p>
        {sessie.repos.map((repo) => (
          <button
            key={repo}
            type="button"
            className="bl-vknop p"
            disabled={bezig}
            onClick={async () => {
              setBezig(true);
              try {
                await kiesRepo(repo);
              } finally {
                setBezig(false);
              }
            }}
          >
            {repo}
          </button>
        ))}
      </div>
    );

  return (
    <div className="bl-paneel-echt" style={{ textAlign: 'center' }}>
      <a className="bl-vknop p" href={koppelUrl(terug)}>
        Koppel met GitHub
      </a>
      <p className="bl-hint">
        Op GitHub kies je <b>Only select repositories</b> en je repo, en klik je op <b>Install</b>. Dan krijgt deze stap vanzelf een vinkje.
      </p>
    </div>
  );
}
