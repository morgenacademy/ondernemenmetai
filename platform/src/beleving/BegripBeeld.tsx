import { TweePlekken } from '../ui/TweePlekken';
import type { BegripBeeld as Soort } from './beleving';

type Chip = { tekst: string; left: string; top: string; vx: string; vy: string; r: string; vertraging: string };

const CHIPS: Chip[] = [
  { tekst: '💡 idee.md', left: '6%', top: '30%', vx: '-140px', vy: '-110px', r: '-14deg', vertraging: '.3s' },
  { tekst: '🎯 doelgroep.md', left: '29%', top: '21%', vx: '-40px', vy: '-180px', r: '10deg', vertraging: '.6s' },
  { tekst: '🎙️ interviews/', left: '56%', top: '27%', vx: '110px', vy: '-170px', r: '-8deg', vertraging: '.9s' },
  { tekst: '📊 analyse.md', left: '34%', top: '37%', vx: '180px', vy: '-70px', r: '12deg', vertraging: '1.2s' },
];

/** Uit de schets: losse bestanden vliegen in één map, met je AI als lichtbol erbij. */
function Repo() {
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
        <text x="250" y="312" textAnchor="middle" fontFamily="Barlow" fontWeight="900" fontSize="36" fill="#fff">
          mijn-onderneming
        </text>
        <text x="250" y="346" textAnchor="middle" fontFamily="Barlow" fontWeight="600" fontSize="17" fill="#D8CCEC">
          privé · alleen jij en je AI
        </text>
      </svg>
      {CHIPS.map((c) => (
        <span
          key={c.tekst}
          className="bl-chip"
          aria-hidden="true"
          style={{ left: c.left, top: c.top, animationDelay: c.vertraging, ['--vx' as string]: c.vx, ['--vy' as string]: c.vy, ['--r' as string]: c.r }}
        >
          {c.tekst}
        </span>
      ))}
      <span className="bl-orb" aria-hidden="true" />
    </div>
  );
}

function Bestand({ naam, regels, label }: { naam: string; regels: { tekst: string; soort?: 'kop' | 'nieuw' | 'weg' }[]; label?: string }) {
  return (
    <div className="bl-bestand">
      <div className="naam">
        {naam}
        {label && <span className="bl-versie-label">{label}</span>}
      </div>
      <div className="regels">
        {regels.map((r, i) => (
          <div key={i} className={r.soort ?? ''}>
            {r.tekst}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Drie versies van je madlib: je eerste idee, na je interviews, voor je oplossing. */
function Versies() {
  return (
    <div className="bl-versies">
      <Bestand naam="madlib.md" label="level 1" regels={[{ tekst: '… biedt bezorging per bakfiets binnen twee uur …' }]} />
      <Bestand naam="madlib.md" label="level 2" regels={[{ tekst: '… biedt bezorging per bakfiets binnen twee uur …', soort: 'weg' }, { tekst: '… voor apotheken die hun assistent kwijt zijn …', soort: 'nieuw' }]} />
      <Bestand naam="madlib.md" label="level 3" regels={[{ tekst: '… biedt spoedbezorging rond het middaguur …', soort: 'nieuw' }]} />
    </div>
  );
}

/** Wat 01-apotheker in level 2 vertelde, komt terug op het spiekbriefje van level 4. */
function Geheugen() {
  return (
    <div className="bl-geheugen">
      <Bestand naam="interviews/01-apotheker.md" regels={[{ tekst: '## 8. Meest genoemde klacht', soort: 'kop' }, { tekst: 'Parkeren kost veel tijd.' }, { tekst: 'terugbellen: ja', soort: 'nieuw' }]} />
      <span className="pijl" aria-hidden="true">
        →
      </span>
      <Bestand naam="feedback/01-apotheker.md" regels={[{ tekst: '## Spiekbriefje ronde 1', soort: 'kop' }, { tekst: 'Opening: "Weet je nog, je zei dat parkeren…"', soort: 'nieuw' }]} />
    </div>
  );
}

function Agents() {
  return (
    <Bestand
      naam="AGENTS.md"
      regels={[
        { tekst: '# Instructies voor je AI', soort: 'kop' },
        { tekst: '…' },
        { tekst: '## Over mijn onderneming', soort: 'kop' },
        { tekst: 'Trapzorg bezorgt spoedrecepten per bakfiets', soort: 'nieuw' },
        { tekst: 'Klanten: zelfstandige apotheken', soort: 'nieuw' },
        { tekst: 'Prijs: €40 per maand', soort: 'nieuw' },
      ]}
    />
  );
}

function Skill() {
  return (
    <Bestand
      naam="skills/verkoopaanpak/SKILL.md"
      regels={[
        { tekst: 'name: verkoopaanpak', soort: 'nieuw' },
        { tekst: 'description: bereidt een verkoopgesprek voor', soort: 'nieuw' },
        { tekst: '## Verkenning', soort: 'kop' },
        { tekst: 'Ga langs rond 10 uur, voor de drukte.' },
        { tekst: '## Voorstel', soort: 'kop' },
        { tekst: 'Eerste maand gratis, daarna €40.' },
      ]}
    />
  );
}

export function BegripBeeld({ soort, level }: { soort: Soort; level: number }) {
  return (
    <div className="bl-begrip-beeld bl-in">
      {soort === 'repo' && <Repo />}
      {soort === 'twee-plekken' && <TweePlekken level={level} />}
      {soort === 'versies' && <Versies />}
      {soort === 'geheugen' && <Geheugen />}
      {soort === 'agents' && <Agents />}
      {soort === 'skill' && <Skill />}
    </div>
  );
}
