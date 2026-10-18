import { forwardRef, useEffect, useLayoutEffect, useRef, useState, type FormEvent } from 'react';
import { DEMO_FORMS } from '../demo/formulieren';
import type { FileWrite, FormStep, FormValues, LevelDef } from '../lib/levels/types';
import type { RepoSnapshot } from '../lib/repo/types';
import { Uitleg, WerkbladKader } from './WerkbladDelen';

/** De madlib als zin: de vaste woorden, en per gat het veld uit level1.ts met wat erin hoort. */
const ZIN: { voor: string; veld: string; leeg: string }[] = [
  { voor: 'Mijn bedrijf, ', veld: 'naam', leeg: 'naam van je bedrijf' },
  { voor: ', biedt ', veld: 'aanbod', leeg: 'wat je aanbiedt' },
  { voor: ' voor ', veld: 'doelgroep', leeg: 'voor wie precies' },
  { voor: ' die ', veld: 'probleem', leeg: 'welk probleem ze hebben' },
  { voor: ' met ', veld: 'usp', leeg: 'wat maakt jou anders?' },
];

type Props = { level: LevelDef; step: FormStep; naam: string; snapshot: RepoSnapshot; onSave: (w: FileWrite) => Promise<boolean> };

/**
 * Een gat in de zin. Het groeit mee met wat je typt en breekt af als het niet past, zodat je op een telefoon alles blijft zien.
 * Enter zet de zin in je repo, net als in een gewoon invulveld.
 */
function Gat({ waarde, leeg, label, klasse, onChange }: { waarde: string; leeg: string; label: string; klasse: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const pas = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };
  useLayoutEffect(pas, [waarde]);
  // Wordt het venster smaller of breder, dan past de zin anders.
  useEffect(() => {
    window.addEventListener('resize', pas);
    return () => window.removeEventListener('resize', pas);
  }, []);
  return (
    <textarea
      ref={ref}
      rows={1}
      className={klasse}
      aria-label={label}
      placeholder={leeg}
      value={waarde}
      style={{ width: `${Math.max(waarde.length, leeg.length) + 2}ch` }}
      onChange={(e) => onChange(e.target.value.replace(/\n/g, ' '))}
      onKeyDown={(e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        e.currentTarget.form?.requestSubmit();
      }}
    />
  );
}

/** Level 1: je idee in één zin. Je vult de gaten in de zin zelf in. */
export const MadlibWerkblad = forwardRef<HTMLHeadingElement, Props>(function MadlibWerkblad({ level, step, naam, snapshot, onSave }, kop) {
  const [waarden, setWaarden] = useState<FormValues>(() => Object.fromEntries(ZIN.map((g) => [g.veld, ''])));
  const [bezig, setBezig] = useState(false);
  const gevuld = ZIN.filter((g) => waarden[g.veld].trim() !== '').length;
  const eersteLeeg = ZIN.find((g) => waarden[g.veld].trim() === '')?.veld;
  const label = (veld: string) => step.fields.find((f) => f.name === veld)?.label ?? veld;
  const demo = DEMO_FORMS[step.id]?.(snapshot);

  const zet = async (e: FormEvent) => {
    e.preventDefault();
    if (gevuld < ZIN.length) return;
    setBezig(true);
    await onSave(step.toFile(waarden, snapshot));
    setBezig(false);
  };

  return (
    <WerkbladKader ref={kop} id={step.id} naam={naam} teller={<><b>{gevuld}</b> van {ZIN.length}</>} deel={gevuld / ZIN.length}>
      <form onSubmit={zet}>
        <p className="bl-madlib">
          {ZIN.map((g) => {
            const waarde = waarden[g.veld];
            const klasse = waarde.trim() ? 'bl-gat' : g.veld === eersteLeeg ? 'bl-gat nu' : 'bl-gat leeg';
            return (
              <span key={g.veld}>
                {g.voor}
                <Gat waarde={waarde} leeg={g.leeg} label={label(g.veld)} klasse={klasse} onChange={(w) => setWaarden((v) => ({ ...v, [g.veld]: w }))} />
              </span>
            );
          })}
          .
        </p>
        <div className="bl-wb-voet">
          <button type="submit" className="bl-wb-knop" disabled={bezig || gevuld < ZIN.length}>
            {bezig ? 'Bezig…' : 'Zet in je repo'}
          </button>
          <span className="bl-wb-hint">Je kunt hem later nog aanpassen; je repo onthoudt elke versie.</span>
        </div>
      </form>
      <Uitleg levelId={level.id} step={step} snapshot={snapshot} />
      {demo && (
        <div className="bl-wb-demo">
          <button type="button" className="bl-knop-demo" onClick={() => setWaarden((v) => ({ ...v, ...demo }))}>
            Vul met demo content
          </button>
          <span>Demo: vult de zin, zodat je zelf op Zet in je repo klikt.</span>
        </div>
      )}
    </WerkbladKader>
  );
});
