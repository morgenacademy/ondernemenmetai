import { forwardRef, useEffect, useRef, useState, type FormEvent } from 'react';
import type { FileWrite, VoortgangStep } from '../lib/levels/types';
import type { RepoSnapshot } from '../lib/repo/types';
import { aantekeningenBestand, gesprekkenVan, netBinnen, vandaagIso } from './gesprekken';
import { DemoRegel, WerkbladKader } from './WerkbladDelen';

const OPDRACHT = 'Schrijf mijn nieuwe interviews uit.';

/** Een zin om te kopiëren, met een knop ernaast. Lukt kopiëren niet, dan selecteer je hem zelf. */
function KopieerRegel({ tekst }: { tekst: string }) {
  const [stand, setStand] = useState<'klaar' | 'ok' | 'fout'>('klaar');
  const kopieer = async () => {
    try {
      await navigator.clipboard.writeText(tekst);
      setStand('ok');
    } catch {
      setStand('fout');
    }
  };
  return (
    <>
      <div className="bl-kopieer">
        <span>{tekst}</span>
        <button type="button" onClick={() => void kopieer()}>
          {stand === 'ok' ? 'Gekopieerd' : 'Kopieer'}
        </button>
      </div>
      {stand === 'fout' && <p className="bl-vul-klein">Kopiëren lukt hier niet. Selecteer de zin en kopieer hem zelf.</p>}
    </>
  );
}

type VulProps = {
  open: boolean;
  snapshot: RepoSnapshot;
  onSluit: () => void;
  onSave: (w: FileWrite) => Promise<boolean>;
  onVervers: () => void;
  /** Na "Zet bij je gesprekken": het pad van het nieuwe gesprek. */
  onGezet?: (pad: string) => void;
};

/** Klapt open onder de vakken: zo vul je een vak, of zet je aantekeningen erbij. */
export function ZoVulJeEenVak({ open, snapshot, onSluit, onSave, onVervers, onGezet }: VulProps) {
  const kop = useRef<HTMLHeadingElement>(null);
  const [wie, setWie] = useState('');
  const [notities, setNotities] = useState('');
  const [bezig, setBezig] = useState(false);
  const [ververst, setVerverst] = useState(false);

  useEffect(() => {
    if (open) kop.current?.focus();
  }, [open]);

  const zet = async (e: FormEvent) => {
    e.preventDefault();
    if (!wie.trim() || !notities.trim()) return;
    setBezig(true);
    const w = aantekeningenBestand(snapshot, wie, notities, vandaagIso());
    const ok = await onSave(w);
    setBezig(false);
    if (!ok) return;
    setWie('');
    setNotities('');
    onGezet?.(w.path);
  };

  const ververs = () => {
    onVervers();
    setVerverst(true);
    window.setTimeout(() => setVerverst(false), 2000);
  };

  return (
    <div
      id="bl-vul"
      className="bl-vul"
      hidden={!open}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onSluit();
      }}
    >
      <div className="bl-vul-kop">
        <h4 ref={kop} tabIndex={-1}>
          Zo vul je een vak
        </h4>
        <button type="button" className="bl-sluitrond" aria-label="Sluiten" onClick={onSluit}>
          ×
        </button>
      </div>
      <ol className="bl-vul-stappen">
        <li>
          <span className="n" aria-hidden="true">
            1
          </span>
          <div>
            <div className="waar">Buiten</div>
            <b>Neem het gesprek op</b>
            <p>Vraag eerst of je mag opnemen.</p>
          </div>
        </li>
        <li>
          <span className="n" aria-hidden="true">
            2
          </span>
          <div>
            <div className="waar">Je computer</div>
            <b>Zet de opname in je map</b>
            <p>
              In <code>interviews/</code> in je repo. Hij blijft op je computer.
            </p>
          </div>
        </li>
        <li>
          <span className="n" aria-hidden="true">
            3
          </span>
          <div>
            <div className="waar">AI-app</div>
            <b>Vraag je AI om hem uit te schrijven</b>
            <KopieerRegel tekst={OPDRACHT} />
          </div>
        </li>
        <li>
          <span className="n" aria-hidden="true">
            4
          </span>
          <div>
            <div className="waar">Hier</div>
            <b>Het vak gaat vanzelf aan</b>
            <p>
              Zodra je AI het interview pusht en je terug bent in dit tabblad.{' '}
              <button type="button" className="bl-linkknop" onClick={ververs}>
                Ververs
              </button>
              <span className="bl-vul-klein" aria-live="polite">
                {ververst ? ' Bijgewerkt.' : ''}
              </span>
            </p>
          </div>
        </li>
      </ol>
      <details className="bl-vul-ander">
        <summary>Geen opname, wel aantekeningen?</summary>
        <form onSubmit={zet}>
          <label>
            Met wie sprak je?
            <input value={wie} placeholder="Bijvoorbeeld: apotheker, Houten" onChange={(e) => setWie(e.target.value)} />
          </label>
          <p className="bl-vul-klein">Rol en plaats, geen naam.</p>
          <label>
            Je aantekeningen
            <textarea rows={4} value={notities} placeholder="Plak hier wat je opschreef tijdens het gesprek." onChange={(e) => setNotities(e.target.value)} />
          </label>
          <button type="submit" className="bl-wb-knop" disabled={bezig || !wie.trim() || !notities.trim()}>
            {bezig ? 'Bezig…' : 'Zet bij je gesprekken'}
          </button>
        </form>
      </details>
    </div>
  );
}

type Props = {
  id: string;
  naam: string;
  step: VoortgangStep;
  snapshot: RepoSnapshot;
  onSave: (w: FileWrite) => Promise<boolean>;
  onVervers: () => void;
  onDemo: () => void;
};

/** Level 2: een vak per gesprek. Het aantal volgt uit je doelgroep; een leeg vak is een knop. */
export const GesprekkenWerkblad = forwardRef<HTMLHeadingElement, Props>(function GesprekkenWerkblad({ id, naam, step, snapshot, onSave, onVervers, onDemo }, kop) {
  const { nodig, vol, vanVandaag } = gesprekkenVan(snapshot, vandaagIso());
  // Wat er al stond toen je keek: een vak dat daarna binnenkomt, is net binnen.
  const bijOpenen = useRef<Set<string> | null>(null);
  if (bijOpenen.current === null) bijOpenen.current = new Set(vol.map((v) => v.pad));
  const net = netBinnen(vol, bijOpenen.current, vanVandaag);
  const [open, setOpen] = useState(false);
  const [focusOp, setFocusOp] = useState<string | null>(null);
  const volgende = useRef<HTMLButtonElement>(null);
  const nieuw = useRef<HTMLLIElement>(null);
  const leeg = Math.max(nodig, vol.length) - vol.length;

  useEffect(() => {
    if (focusOp && nieuw.current) {
      nieuw.current.focus();
      setFocusOp(null);
    }
  }, [focusOp, vol.length]);

  const sluit = () => {
    setOpen(false);
    volgende.current?.focus();
  };

  return (
    <WerkbladKader ref={kop} id={id} naam={naam} teller={<><b>{vol.length}</b> van {nodig}</>} deel={vol.length / nodig}>
      <ol className="bl-vakken">
        {vol.map((v) => (
          <li key={v.pad} ref={v.pad === focusOp ? nieuw : undefined} tabIndex={-1} className={`bl-vak vol${v.pad === net ? ' net' : ''}`} aria-label={`Gesprek ${v.nr}: ${v.wie}`}>
            {v.pad === net && <span className="bl-netbinnen">Net binnen</span>}
            <span className="vink" aria-hidden="true">
              ✓
            </span>
            <div className="nr">{v.nr}</div>
            <div className="wie">{v.wie}</div>
            {v.wanneer && <div className="wanneer">{v.wanneer}</div>}
            {v.uitspraak && <q className="citaat">{v.uitspraak}</q>}
          </li>
        ))}
        {Array.from({ length: leeg }, (_, i) => {
          const nr = String(vol.length + i + 1).padStart(2, '0');
          const wat = i === 0 ? 'Je volgende gesprek' : 'Nog leeg';
          return (
            <li key={`leeg-${nr}`}>
              <button
                type="button"
                ref={i === 0 ? volgende : undefined}
                className={`bl-vak leeg${i === 0 ? ' volgende' : ''}${i === 0 && open ? ' open' : ''}`}
                aria-expanded={open}
                aria-controls="bl-vul"
                aria-label={`Vak ${nr}: ${wat}. Zo vul je een vak`}
                onClick={() => setOpen(true)}
              >
                <span className="nr">{nr}</span>
                <span className="plus" aria-hidden="true">
                  +
                </span>
                <span className="wat">{wat}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <ZoVulJeEenVak
        open={open}
        snapshot={snapshot}
        onSluit={sluit}
        onSave={onSave}
        onVervers={onVervers}
        onGezet={(pad) => {
          setOpen(false);
          setFocusOp(pad);
        }}
      />
      <DemoRegel step={step} onDemo={onDemo} />
    </WerkbladKader>
  );
});
