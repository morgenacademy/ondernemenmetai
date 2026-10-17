/** De drie handelingen bij koppelen, in de volgorde waarin je ze doet. De uitleg rechts loopt hiermee mee. */
export const KOPPEL_HANDELINGEN = [
  'Klik links op <b>Verbind met GitHub</b>.',
  'Je bent nu op GitHub. Kies <b>Only select repositories</b> en dan je repo.',
  'Klik op <b>Install</b>. Je komt terug op het platform en de stap is af.',
];

/** 0: nog niet verbonden · 1: op GitHub · 2: repo gekozen · 3: gekoppeld. */
export type KoppelFase = 0 | 1 | 2 | 3;

function Waar({ nr, tekst }: { nr: number; tekst: string }) {
  return (
    <div className="bl-waar">
      <span className="bl-waar-nr">{nr}</span>
      {nr} · {tekst}
    </div>
  );
}

/**
 * Koppelen, nagebootst: je begint hier op het platform, gaat naar GitHub en komt terug.
 * In het echt opent GitHub in een nieuw tabblad.
 */
export function KoppelDemo({ fase, onFase }: { fase: KoppelFase; onFase: (f: KoppelFase) => void }) {
  if (fase === 3) {
    return (
      <div className="bl-paneel-echt" style={{ textAlign: 'center' }}>
        <Waar nr={3} tekst="Terug op het platform" />
        <p className="bl-gelukt">✓ Gekoppeld met jij/fietskoerier-apotheken</p>
        <p className="bl-hint">Het platform kan nu in die ene repo kijken en er je keuzes in zetten.</p>
      </div>
    );
  }
  if (fase === 0) {
    return (
      <div className="bl-paneel-echt" style={{ textAlign: 'center' }}>
        <Waar nr={1} tekst="Hier op het platform" />
        <p className="bl-hint" style={{ margin: '18px 0' }}>
          Het platform vraagt GitHub om toegang tot één repo.
        </p>
        <button type="button" className="bl-vknop p bl-markeer" onClick={() => onFase(1)}>
          Verbind met GitHub
        </button>
      </div>
    );
  }
  const gekozen = fase === 2;
  return (
    <div className="bl-paneel-echt">
      <Waar nr={2} tekst="Nu ben je op GitHub" />
      <p className="bl-hint" style={{ margin: '6px 0 14px' }}>
        In het echt opent GitHub in een nieuw tabblad. Hier is het nagebootst.
      </p>
      <div className="bl-scherm">
        <div className="balk"><i /><i /><i /><span className="url">github.com/apps/ondernemen-met-ai</span></div>
        <div className="inhoud">
          <div style={{ fontSize: '1.35em', fontWeight: 600, marginBottom: '.6em' }}>Install Ondernemen met AI</div>
          <div className="gh-radio"><span className="r" />All repositories</div>
          <button
            type="button"
            className={`gh-radio${gekozen ? ' on' : ' markeer'}`}
            style={{ width: '100%', color: 'inherit', font: 'inherit', background: 'none', cursor: 'pointer' }}
            aria-pressed={gekozen}
            onClick={() => onFase(2)}
          >
            <span className="r" />
            Only select: <b>&nbsp;fietskoerier-apotheken</b>
          </button>
          <div style={{ marginTop: '1em' }}>
            <button type="button" className={`gh-knop${gekozen ? ' markeer' : ''}`} disabled={!gekozen} style={gekozen ? undefined : { opacity: 0.5 }} onClick={() => onFase(3)}>
              Install
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
