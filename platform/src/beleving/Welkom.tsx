import { useState } from 'react';
import { HALTES } from './beleving';
import { useZichtbaar } from './useZichtbaar';

const ICONEN = (
  <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
    <symbol id="bl-i-werkplek" viewBox="0 0 24 24"><path d="M3 19L12 4l9 15z" /><path d="M12 4v15" /><path d="M9.5 19l2.5-5 2.5 5" /></symbol>
    <symbol id="bl-i-idee" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z" /><path d="M9.5 19h5" /><path d="M10.5 21.5h3" /></symbol>
    <symbol id="bl-i-probleem" viewBox="0 0 24 24"><circle cx="10" cy="10" r="6" /><path d="M14.5 14.5L20 20" /></symbol>
    <symbol id="bl-i-prototype" viewBox="0 0 24 24"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" /><path d="M12 12l8-4.5" /><path d="M12 12v9" /><path d="M12 12L4 7.5" /></symbol>
    <symbol id="bl-i-feedback" viewBox="0 0 24 24"><path d="M4 5h16v10H9l-5 4z" /><path d="M8 9h8" /><path d="M8 12h5" /></symbol>
    <symbol id="bl-i-validatie" viewBox="0 0 24 24"><path d="M9 3h6" /><path d="M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3" /><path d="M7.5 15h9" /></symbol>
    <symbol id="bl-i-lancering" viewBox="0 0 24 24"><path d="M12 2c3 2 5 6 5 10l-2 4H9l-2-4c0-4 2-8 5-10z" /><circle cx="12" cy="10" r="1.8" /><path d="M9 16l-2 4 3-1" /><path d="M15 16l2 4-3-1" /></symbol>
  </svg>
);

/** De levels op het pad van start.webp; de plek van elk lichtje staat in HALTES. kant: aan welke kant van het lichtje het kaartje staat. */
type Stop = { nr: number; icoon: string; naam: string; wat: string; kant: 'links' | 'rechts'; vertraging: string; basis?: boolean };

const STOPS: Stop[] = [
  { nr: 0, icoon: 'werkplek', naam: 'Werkplek', wat: 'Je basiskamp', kant: 'rechts', vertraging: '.2s', basis: true },
  { nr: 1, icoon: 'idee', naam: 'Idee', wat: 'Wat ga je doen?', kant: 'links', vertraging: '.6s' },
  { nr: 2, icoon: 'probleem', naam: 'Probleem-validatie', wat: 'Hebben ze dit probleem?', kant: 'rechts', vertraging: '1s' },
  { nr: 3, icoon: 'prototype', naam: 'Prototype', wat: 'Je eerste versie', kant: 'links', vertraging: '1.4s' },
  { nr: 4, icoon: 'feedback', naam: 'Markt feedback', wat: 'Wat vinden ze ervan?', kant: 'links', vertraging: '1.8s' },
  { nr: 5, icoon: 'validatie', naam: 'Product-validatie', wat: 'Willen ze ervoor betalen?', kant: 'rechts', vertraging: '2.2s' },
  { nr: 6, icoon: 'lancering', naam: 'Lancering', wat: 'Je eerste klanten', kant: 'links', vertraging: '2.6s' },
];

/** Tussen idee en probleem-validatie, en tussen markt feedback en product-validatie, loopt een lichtje heen en weer over het pad. Coördinaten in pixels van start.webp. */
const ITERATIES = [
  { pad: 'M1127 711 C1190 712 1262 690 1280 635', label: { x: 79.5, y: 67.8 } },
  { pad: 'M1300 511 C1330 506 1360 494 1367 472', label: { x: 88.3, y: 51.6 } },
];

const SCENES = ['start', 'route', 'werkplek', 'markt', 'klanten'];

/** Het welkomstscherm uit de schets welkom-v4: vijf scènes om doorheen te scrollen. */
export function Welkom({ onNaarRoute }: { onNaarRoute: () => void }) {
  const [aan, setAan] = useState(0);
  const wortel = useZichtbaar<HTMLDivElement>((el) => {
    const i = SCENES.indexOf(el.id.replace('bl-welkom-', ''));
    if (i >= 0) setAan(i);
  });
  return (
    <div ref={wortel} className="bl-welkom">
      {ICONEN}
      <nav className="bl-dots" aria-label="Hoofdstukken">
        {SCENES.map((s, i) => (
          <a key={s} href={`#bl-welkom-${s}`} className={i === aan ? 'aan' : ''} aria-label={`Naar hoofdstuk ${i + 1}`} onClick={(e) => {
            e.preventDefault();
            document.getElementById(`bl-welkom-${s}`)?.scrollIntoView({ behavior: 'smooth' });
          }} />
        ))}
      </nav>

      <section className="bl-scene" id="bl-welkom-start">
        <div className="bl-beeld" style={{ backgroundImage: "url('/beelden/start.webp')" }} />
        <div className="bl-tekst">
          <div className="bl-label bl-in">Ondernemen met AI</div>
          <h1 className="bl-in d1">Je start je eigen bedrijf.</h1>
          <p className="bl-zin bl-in d2">
            Van idee tot je eerste klanten. <span className="bl-accent">Met AI naast je.</span>
          </p>
        </div>
        <button type="button" className="bl-scroll-hint" onClick={() => document.getElementById('bl-welkom-route')?.scrollIntoView({ behavior: 'smooth' })}>
          Zo gaan we het doen<span className="streep" aria-hidden="true" />
        </button>
      </section>

      <section className="bl-scene bl-route-scene" id="bl-welkom-route">
        <h2 className="bl-in">Zes stappen naar de markt</h2>
        {/* De route op het pad uit de eerste scène: elk lichtje is een level. */}
        <div
          className="bl-pad"
          role="img"
          aria-label="De route over het pad: werkplek, idee, probleem-validatie, prototype, markt feedback, product-validatie en lancering. Tussen idee en probleem-validatie, en tussen markt feedback en product-validatie, doe je een paar rondes: iteratie."
        >
          <div className="bl-pad-laag">
            <img className="plaat" src="/beelden/start.webp" alt="" />
            <svg className="bl-pad-iteratie" viewBox="0 0 1536 1024" aria-hidden="true">
              {ITERATIES.map((it) => (
                <circle key={it.pad} className="lichtje" r="6">
                  <animateMotion dur="2.4s" repeatCount="indefinite" path={it.pad} keyPoints="0;1;0" keyTimes="0;0.5;1" calcMode="linear" />
                </circle>
              ))}
            </svg>
            {ITERATIES.map((it) => (
              <span key={it.pad} className="bl-pad-lus" aria-hidden="true" style={{ left: `${it.label.x}%`, top: `${it.label.y}%` }}>
                ↻ iteratie
              </span>
            ))}
            {STOPS.map((s) => (
              <span
                key={s.nr}
                className={`bl-pad-halte${s.basis ? ' basis' : ''}`}
                aria-hidden="true"
                style={{ left: `${HALTES[s.nr].x}%`, top: `${HALTES[s.nr].y}%`, transitionDelay: s.vertraging, ['--d' as string]: `${3.4 - s.nr * 0.3}cqw` }}
              >
                <span className="ring" />
                <span className={`kaartje ${s.kant}`}>
                  {s.basis && <span className="begin">Jij begint hier</span>}
                  <span className="naam">
                    <span className="nr">{s.nr}</span> {s.naam}
                  </span>
                  <span className="wat">{s.wat}</span>
                </span>
              </span>
            ))}
          </div>
        </div>
        <ol className="bl-route-lijst bl-in d1">
          {STOPS.map((h) => (
            <li key={h.nr} className={h.basis ? 'basis' : ''}>
              <span className="blob" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <use href={`#bl-i-${h.icoon}`} />
                </svg>
              </span>
              <span>
                <span className="nr">Level {h.nr}</span>
                <span className="naam">{h.naam}</span>
                <span className="wat">{h.wat}</span>
              </span>
              {(h.nr === 1 || h.nr === 4) && <span className="lus">↻ iteratie met level {h.nr + 1}</span>}
            </li>
          ))}
        </ol>
      </section>

      <section className="bl-scene" id="bl-welkom-werkplek">
        <div className="bl-beeld" style={{ backgroundImage: "url('/beelden/werkplek.webp')" }} />
        <div className="bl-tekst">
          <div className="bl-label bl-in">Level 0 · Werkplek</div>
          <h2 className="bl-in d1">Eerst je basiskamp.</h2>
          <p className="bl-zin bl-in d2">
            Even pas op de plaats. Alles wat je bij je doelgroep ophaalt, komt op één plek. <span className="bl-accent">Je AI leest mee.</span>
          </p>
        </div>
      </section>

      <section className="bl-scene" id="bl-welkom-markt">
        <div className="bl-beeld" style={{ backgroundImage: "url('/beelden/markt.webp')" }} />
        <div className="bl-tekst">
          <div className="bl-label bl-in">Level 1 t/m 5</div>
          <h2 className="bl-in d1">Dan de markt op.</h2>
          <p className="bl-zin bl-in d2">
            Jij praat met echte mensen. <span className="bl-accent">Je AI ordent, zoekt uit en schrijft mee.</span>
          </p>
        </div>
      </section>

      <section className="bl-scene" id="bl-welkom-klanten">
        <div className="bl-beeld" style={{ backgroundImage: "url('/beelden/klanten.webp')" }} />
        <div className="bl-tekst">
          <div className="bl-label bl-in">Level 6 · Lancering</div>
          <h2 className="bl-in d1">Tot je eerste klant.</h2>
          <p className="bl-zin bl-in d2">En een manier van werken met AI waar je nog jaren op bouwt.</p>
          <button type="button" className="bl-knop bl-in d3" onClick={onNaarRoute}>
            Bekijk je route →
          </button>
        </div>
      </section>
    </div>
  );
}
