import { useState } from 'react';
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

type Halte = { nr: number; icoon: string; naam: string; wat: string; x: number; y: number; boven: boolean; vertraging: string; basis?: boolean };

const HALTES: Halte[] = [
  { nr: 0, icoon: 'werkplek', naam: 'Werkplek', wat: 'Je basiskamp', x: 100, y: 330, boven: false, vertraging: '.1s', basis: true },
  { nr: 1, icoon: 'idee', naam: 'Idee', wat: 'Wat ga je doen?', x: 270, y: 170, boven: true, vertraging: '.6s' },
  { nr: 2, icoon: 'probleem', naam: 'Probleem-validatie', wat: 'Hebben ze dit probleem?', x: 420, y: 390, boven: false, vertraging: '1s' },
  { nr: 3, icoon: 'prototype', naam: 'Prototype', wat: 'Je eerste versie', x: 610, y: 220, boven: true, vertraging: '1.5s' },
  { nr: 4, icoon: 'feedback', naam: 'Markt feedback', wat: 'Wat vinden ze ervan?', x: 820, y: 140, boven: true, vertraging: '1.9s' },
  { nr: 5, icoon: 'validatie', naam: 'Product-validatie', wat: 'Willen ze ervoor betalen?', x: 930, y: 390, boven: false, vertraging: '2.3s' },
  { nr: 6, icoon: 'lancering', naam: 'Lancering', wat: 'Je eerste klanten', x: 1110, y: 230, boven: true, vertraging: '3s' },
];

const PIJLEN = [
  ['M130 292 C160 230 190 200 222 188', '.3s'],
  ['M236 214 C200 300 290 385 368 396', '.8s'],
  ['M452 352 C478 280 392 176 320 170', '1.2s'],
  ['M468 382 C522 362 542 286 568 254', '1.6s'],
  ['M658 204 C700 180 738 162 770 152', '2s'],
  ['M796 188 C770 276 818 366 880 388', '2.4s'],
  ['M962 352 C990 280 934 176 868 150', '2.8s'],
  ['M978 378 C1030 352 1052 296 1070 268', '3.2s'],
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
        <svg
          className="bl-zigzag"
          viewBox="0 0 1200 560"
          role="img"
          aria-label="De route: werkplek, idee, probleem-validatie, prototype, markt feedback, product-validatie en lancering. Tussen idee en probleem-validatie, en tussen markt feedback en product-validatie, ga je een paar keer heen en weer."
        >
          <defs>
            <marker id="bl-punt" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
              <path d="M0 0L10 5L0 10z" fill="#9B6FCF" />
            </marker>
          </defs>
          {PIJLEN.map(([d, vertraging]) => (
            <path key={d} className="pijl" pathLength={1} markerEnd="url(#bl-punt)" style={{ transitionDelay: vertraging }} d={d} />
          ))}
          <circle className="lichtje" r="7">
            <animateMotion dur="3.2s" repeatCount="indefinite" path="M270 170 C200 300 290 385 420 390 C478 280 392 176 270 170" />
          </circle>
          <circle className="lichtje" r="7">
            <animateMotion dur="3.2s" repeatCount="indefinite" path="M820 140 C770 276 818 366 930 390 C990 280 934 176 820 140" />
          </circle>
          <text className="lus-tekst" x="352" y="290">
            ↻ heen en weer
          </text>
          <text className="lus-tekst" x="884" y="276">
            ↻ heen en weer
          </text>
          {HALTES.map((h) => (
            <g key={h.nr} className="node" style={{ transitionDelay: h.vertraging }} transform={`translate(${h.x} ${h.y})`}>
              {h.basis && (
                <>
                  <rect x="-70" y="-98" width="140" height="28" rx="9" fill="#D8FE56" />
                  <text x="0" y="-79" textAnchor="middle" fontSize="13" fontWeight="800" fill="#1A1A2E" letterSpacing="1.5">
                    JIJ BEGINT HIER
                  </text>
                </>
              )}
              <ellipse rx="46" ry="44" fill={h.basis ? '#fff' : '#D8FE56'} />
              <use href={`#bl-i-${h.icoon}`} x="-22" y="-22" width="44" height="44" stroke="#5B2D8E" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <circle className="badge" cx="36" cy="-34" r="15" />
              <text className="badge-nr" x="36" y="-34">
                {h.nr}
              </text>
              <text className="naam" y={h.boven ? -80 : 74}>
                {h.naam}
              </text>
              <text className="wat" y={h.boven ? -58 : 96}>
                {h.wat}
              </text>
            </g>
          ))}
        </svg>
        <ol className="bl-route-lijst bl-in d1">
          {HALTES.map((h) => (
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
              {(h.nr === 1 || h.nr === 4) && <span className="lus">↻ heen en weer met level {h.nr + 1}</span>}
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
