import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { DEMO_FORMS } from '../demo/formulieren';
import { demoVoorStap } from '../demo/vullen';
import { filterVariants, setupFrom, stepContent, type Setup } from '../lib/content';
import { LEVELS } from '../lib/levels';
import { evaluateLevel } from '../lib/levels/evaluate';
import type { FileWrite, LevelDef } from '../lib/levels/types';
import type { RepoSnapshot } from '../lib/repo/types';
import { TweePlekken } from '../ui/TweePlekken';
import { BELEVING, HALTES, type BegripBeeld, type Scene } from './beleving';
import { StapVenster } from './StapVenster';
import { stapStatussen, strookUitsnede, type StapStatus } from './voortgang';
import { Voorbeeld, plekLabel } from './Voorbeeld';
import { useZichtbaar } from './zichtbaar';

type Props = {
  level: LevelDef;
  snapshot: RepoSnapshot;
  levelAf: boolean;
  handmatig: Set<string>;
  onHandmatig: (stepId: string) => void;
  onSave: (w: FileWrite) => Promise<boolean>;
  onDemo: (stepId: string) => void;
  onFillLevel: () => void;
};

/** De eerste zin van de uitleg bij een stap, zonder opmaak: de korte tekst op de kaart. */
export function eersteZin(md: string | undefined, setup: Setup): string {
  if (!md) return '';
  const regel =
    filterVariants(md, setup)
      .replace(/<!--[\s\S]*?-->/g, '')
      .split('\n')
      .map((r) => r.trim())
      .find((r) => r.length > 0 && !/^(#|[-*]\s|\d+\.\s|```|>)/.test(r)) ?? '';
  const schoon = regel.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/`([^`]+)`/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  return schoon.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? schoon;
}

function BegripBeeldje({ beeld, level }: { beeld: BegripBeeld; level: number }) {
  if (beeld === 'twee-plekken') return <TweePlekken level={level} />;
  if (beeld === 'repo') {
    return (
      <div className="bl-map">
        <svg viewBox="0 0 500 420" aria-hidden="true">
          <defs>
            <linearGradient id="bl-mapkleur" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#9B6FCF" />
              <stop offset="1" stopColor="#5B2D8E" />
            </linearGradient>
          </defs>
          <path d="M60 140 h120 l28 30 h232 a18 18 0 0 1 18 18 v190 a18 18 0 0 1 -18 18 H60 a18 18 0 0 1 -18 -18 V158 a18 18 0 0 1 18 -18z" fill="url(#bl-mapkleur)" />
          <path d="M42 206 h416 v172 a18 18 0 0 1 -18 18 H60 a18 18 0 0 1 -18 -18z" fill="#7B4DAE" opacity=".92" />
          <text x="250" y="312" textAnchor="middle" fontFamily="Barlow" fontWeight="900" fontSize="36" fill="#fff">mijn-onderneming</text>
          <text x="250" y="346" textAnchor="middle" fontFamily="Barlow" fontWeight="600" fontSize="17" fill="#D8CCEC">privé · alleen jij en je AI</text>
        </svg>
        {[
          ['💡 idee.md', '6%', '30%', '-140px', '-110px', '-14deg', '.3s'],
          ['🎯 doelgroep.md', '29%', '21%', '-40px', '-180px', '10deg', '.6s'],
          ['🎙️ interviews/', '56%', '27%', '110px', '-170px', '-8deg', '.9s'],
          ['📊 analyse.md', '34%', '37%', '180px', '-70px', '12deg', '1.2s'],
        ].map(([tekst, left, top, vx, vy, r, d]) => (
          <span key={tekst} className="bl-chip" style={{ left, top, '--vx': vx, '--vy': vy, '--r': r, animationDelay: d } as CSSProperties}>
            {tekst}
          </span>
        ))}
        <span className="bl-orb" aria-hidden="true" />
      </div>
    );
  }
  if (beeld === 'versies') {
    return (
      <div className="bl-versies">
        {[
          ['madlib.md', 'je eerste idee', 'biedt bezorging voor apotheken'],
          ['madlib.md', 'na je interviews', 'biedt bezorging binnen twee uur voor zelfstandige apotheken'],
          ['madlib.md', 'voor je oplossing', 'biedt vaste koeriers die je patiënten kennen'],
        ].map(([naam, label, regel], i) => (
          <div key={label} className="bl-bestand">
            <div className="naam">
              {naam}
              <span className="bl-versie-label">{label}</span>
            </div>
            <div className="regels">
              <span className={i === 2 ? 'nieuw' : ''}>Mijn bedrijf, Trapzorg, {regel}.</span>
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (beeld === 'geheugen') {
    return (
      <div className="bl-geheugen">
        <div className="bl-bestand">
          <div className="naam">interviews/01-apotheker.md</div>
          <div className="regels">
            <span className="kop">## Meest genoemde klacht</span>
            <br />
            &quot;Medicijnen komen te laat bij de patiënt.&quot;
          </div>
        </div>
        <span className="pijl" aria-hidden="true">→</span>
        <div className="bl-bestand">
          <div className="naam">Je AI, in level 4</div>
          <div className="regels">
            <span className="nieuw">Vraag 01-apotheker of bezorgen binnen twee uur dat oplost.</span>
          </div>
        </div>
      </div>
    );
  }
  const [naam, regels] =
    beeld === 'agents'
      ? ['AGENTS.md', ['## Over mijn onderneming', '+ Klanten: zelfstandige apotheken in Breda', '+ Product: bezorging binnen twee uur', '+ Prijs: 6 euro per bezorging']]
      : ['skills/verkopen/SKILL.md', ['## Zo verkoop ik', '+ 1. Bel de apotheker-eigenaar, niet de assistent', '+ 2. Laat de proef van een week zien', '+ 3. Vraag om een vast tijdslot']];
  return (
    <div className="bl-bestand">
      <div className="naam">{naam}</div>
      <div className="regels">
        {regels.map((r) => (
          <div key={r} className={r.startsWith('+') ? 'nieuw' : 'kop'}>
            {r}
          </div>
        ))}
      </div>
    </div>
  );
}

function SceneBlok({ scene, level }: { scene: Scene; level: number }) {
  if (scene.soort === 'beeld') {
    return (
      <section className="bl-scene">
        <div className="bl-beeld" style={{ backgroundImage: `url('${scene.beeld}')` }} />
        <div className="bl-tekst">
          <div className="bl-label bl-in">{scene.label}</div>
          <h2 className="bl-in d1">{scene.kop}</h2>
          <p className="bl-zin bl-in d2">
            {scene.zin}
            {scene.accent && (
              <>
                {' '}
                <span className="bl-accent">{scene.accent}</span>
              </>
            )}
          </p>
        </div>
      </section>
    );
  }
  return (
    <section className="bl-begrip">
      <div>
        <div className="bl-label bl-in">{scene.label}</div>
        <h2 className="bl-in d1">{scene.kop}</h2>
        <p className="bl-zin bl-in d2">{scene.zin}</p>
        <div className="bl-woord bl-in d2">
          <b>{scene.woord}</b> {scene.uitleg}
        </div>
      </div>
      <div className="bl-begrip-beeld bl-in">
        <BegripBeeldje beeld={scene.beeld} level={level} />
      </div>
    </section>
  );
}

/** Een level als pagina: beeld, scènes, de stappen als kaarten (één tegelijk aan de beurt) en het slotscherm. */
export function LevelScherm({ level, snapshot, levelAf, handmatig, onHandmatig, onSave, onDemo, onFillLevel }: Props) {
  const wortel = useRef<HTMLDivElement>(null);
  const kaarten = useRef<(HTMLButtonElement | null)[]>([]);
  const [open, setOpen] = useState<number | null>(null);
  const vorigAf = useRef(levelAf);
  useZichtbaar(wortel, level.id);

  // Wordt het level af terwijl je hier bent, dan scrol je naar het slotscherm.
  useEffect(() => {
    if (levelAf && !vorigAf.current) {
      setOpen(null);
      setTimeout(() => {
        const slot = document.getElementById('bl-afronding');
        slot?.scrollIntoView({ behavior: 'smooth' });
        slot?.classList.add('gevierd');
        setTimeout(() => document.getElementById('bl-naar-route')?.focus({ preventScroll: true }), 900);
      }, 50);
    }
    vorigAf.current = levelAf;
  }, [levelAf]);

  const b = BELEVING[level.id];
  const setup = setupFrom(snapshot);
  const evaluation = evaluateLevel(level, snapshot);
  const status = stapStatussen(level, evaluation, handmatig, levelAf);
  const genummerd = level.steps.filter((s) => !s.optional);
  const aantalAf = genummerd.filter((s) => status[s.id] === 'af').length;
  const nu = genummerd.find((s) => status[s.id] === 'nu');
  const nog = genummerd.length - aantalAf;
  const volgendeLevel = LEVELS.find((l) => l.id === level.id + 1);

  const demoVoor = (stepId: string) => {
    const step = level.steps.find((s) => s.id === stepId);
    if (!step) return undefined;
    const demo = demoVoorStap(step);
    if (demo?.soort === 'simulatie') return { label: demo.label, onRun: () => onDemo(stepId) };
    if (demo?.soort === 'formulier') return { waarden: DEMO_FORMS[stepId](snapshot) };
    return undefined;
  };

  const openStap = level.steps[open ?? -1];
  const strookVan = HALTES[level.id];
  const strookNaar = HALTES[level.id + 1] ?? strookVan;
  const uitsnede = strookUitsnede(strookVan, strookNaar);
  const kaartStaat = (st: StapStatus) => (st === 'straks' ? 'straks' : st);

  return (
    <div ref={wortel}>
      <section className="bl-scene">
        <div className="bl-beeld" style={{ backgroundImage: `url('${b.beeld}')` }} />
        <div className="bl-tekst">
          <div className="bl-label bl-in">
            Level {level.id} · {level.name}
          </div>
          <h1 className="bl-in d1">{b.kop}</h1>
          <p className="bl-zin bl-in d2">{b.zin}</p>
        </div>
        <a className="bl-scroll-hint" href={`#/level/${level.id}`} onClick={(e) => { e.preventDefault(); document.getElementById('bl-stappen')?.scrollIntoView({ behavior: 'smooth' }); }}>
          Meteen naar de stappen ↓
        </a>
      </section>

      {b.scenes.map((s) => (
        <SceneBlok key={s.kop} scene={s} level={level.id} />
      ))}

      <section className="bl-stappen licht" id="bl-stappen" aria-labelledby="bl-stappen-kop">
        <div className="bl-stappen-kop bl-in">
          <div>
            <div className="bl-label">Stap voor stap</div>
            <h2 id="bl-stappen-kop">{b.stappenKop}</h2>
            <p className="bl-doel">
              <b>Je doel:</b> {level.doel}
            </p>
          </div>
          <div className="bl-stappen-rechts">
            <p className="bl-voortgang">
              <b>
                {aantalAf} van {genummerd.length}
              </b>{' '}
              klaar
            </p>
          </div>
        </div>
        <div className="bl-balk">
          <span style={{ width: `${(aantalAf / Math.max(1, genummerd.length)) * 100}%` }} />
        </div>
        <div className="bl-grid">
          {level.steps.map((step, i) => {
            const st = status[step.id];
            const nr = step.optional ? null : genummerd.indexOf(step) + 1;
            return (
              <button
                key={step.id}
                ref={(el) => {
                  kaarten.current[i] = el;
                }}
                type="button"
                className={`bl-stapkaart ${kaartStaat(st)}`}
                disabled={st === 'straks'}
                title={st === 'straks' && nu ? `Eerst stap ${genummerd.indexOf(nu) + 1}` : undefined}
                aria-label={`${nr ? `Stap ${nr}` : 'Optioneel'}: ${step.title}, ${st === 'af' ? 'klaar' : st === 'nu' ? 'nu aan de beurt' : st === 'optioneel' ? 'optioneel' : 'nog niet aan de beurt'}`}
                onClick={() => setOpen(i)}
              >
                <div className="voorbeeld">
                  <Voorbeeld step={step} snapshot={snapshot} beeld={b.beeld} />
                  {st === 'af' && <span className="bl-vinkje" aria-hidden="true">✓</span>}
                  {st === 'straks' && <span className="bl-slotje" aria-hidden="true">🔒</span>}
                </div>
                <div className="tekstvak">
                  <div className="nr">
                    {nr ? `Stap ${nr}` : 'Optioneel'}
                    {st === 'nu' && (
                      <>
                        {' · '}
                        <span className="nu-label">Nu</span>
                      </>
                    )}
                    {st === 'af' && ' · Klaar'}
                  </div>
                  <h3>{step.title}</h3>
                  <p>{eersteZin(stepContent(level.id, step.id), setup)}</p>
                  <div className="bl-plekken">
                    {step.waar.map((p) => (
                      <span key={p} className={`bl-plek${p === 'platform' ? ' hier' : ''}`}>
                        {plekLabel(p)}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {!levelAf && (
          <div className="bl-stappen-demo">
            <button type="button" className="bl-knop-demo" onClick={onFillLevel}>
              Vul het hele level met demo content
            </button>
            <span>Demo: zet de content van elke stap in je repo, alsof jij en je AI het deden.</span>
          </div>
        )}
      </section>

      <section className={`bl-afronding${levelAf ? ' is-af' : ''}`} id="bl-afronding" aria-labelledby="bl-afronding-titel">
        <div className="bl-af-inhoud">
          <div className="bl-af-links">
            <div className="bl-label">{levelAf ? `Level ${level.id} · Afgerond` : `Level ${level.id} · ${level.name}`}</div>
            <h2 id="bl-afronding-titel">{levelAf ? b.slot.af : b.slot.straks}</h2>
            <p className="bl-zin" style={{ maxWidth: '36ch' }}>
              {levelAf ? 'Dit heb je nu:' : 'Dit heb je straks:'}
            </p>
            <ul className="bl-heb">
              {b.slot.heb.map((h) => {
                const ja = status[h.stepId] === 'af';
                return (
                  <li key={h.stepId} className={ja ? 'ja' : ''}>
                    <span className="bol" aria-hidden="true">
                      {ja ? '✓' : ''}
                    </span>
                    <span>
                      <span dangerouslySetInnerHTML={{ __html: h.tekst }} />
                      {!ja && <span className="sr-only"> (nog niet)</span>}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="bl-af-rechts">
            <div className="bl-strook" aria-hidden="true">
              <div className="bl-strook-laag" style={{ width: `${uitsnede.zoom * 100}%`, left: `${uitsnede.left}%`, top: `${uitsnede.top}%` }}>
                <img className="plaat" src="/beelden/start-leeg.webp" alt="" />
                <img className="bl-strook-jij" src="/beelden/jij.webp" alt="" style={{ left: `${strookVan.jx}%`, top: `${strookVan.jy}%`, height: `${strookVan.h}%` }} />
                {levelAf && <span className="bl-strook-af" style={{ left: `${strookVan.x}%`, top: `${strookVan.y}%` }}>✓</span>}
                {volgendeLevel && (
                  <>
                    <span className="bl-strook-volgende" style={{ left: `${strookNaar.x}%`, top: `${strookNaar.y}%` }} />
                    <span className="bl-strook-label" style={{ left: `${strookNaar.x}%`, top: `${strookNaar.y}%` }}>
                      {volgendeLevel.id} · {volgendeLevel.name}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="bl-label" style={{ marginTop: 28 }}>
              {b.volgende ? 'Volgende stop' : 'Einde van de route'}
            </div>
            <h2 className="bl-af-volgende">{b.volgende?.kop ?? 'Proof of Concept.'}</h2>
            <p className="bl-zin" style={{ maxWidth: '40ch' }}>
              {b.volgende?.zin ?? 'Je eerste betalende klant, en je weet hoe je verkoopt. Schaalbaar verkopen en positieve cashflow komen in module 2.'}
            </p>
            <a
              className="bl-knop"
              href={`#/route?van=${level.id}`}
              aria-disabled={!levelAf}
              tabIndex={levelAf ? undefined : -1}
              id="bl-naar-route"
              onClick={(e) => {
                if (!levelAf) e.preventDefault();
              }}
            >
              {b.volgende?.knop ?? 'Bekijk je route'} →
            </a>
            {!levelAf && <p className="bl-af-hint">Nog {nog} {nog === 1 ? 'stap' : 'stappen'}; daarna kun je verder.</p>}
          </div>
        </div>
      </section>

      {openStap && open !== null && (
        <StapVenster
          level={level}
          step={openStap}
          status={status[openStap.id]}
          snapshot={snapshot}
          evaluation={evaluation}
          setup={setup}
          onSave={onSave}
          onKlaar={onHandmatig}
          demo={demoVoor(openStap.id)}
          onVorige={open > 0 ? () => setOpen(open - 1) : undefined}
          onVolgende={open < level.steps.length - 1 ? () => setOpen(open + 1) : undefined}
          onSluit={() => {
            const i = open;
            setOpen(null);
            kaarten.current[i]?.focus();
          }}
        />
      )}
    </div>
  );
}
