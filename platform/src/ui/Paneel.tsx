import { frontmatterOf, mdFilesIn } from '../lib/levels/checks';
import { FEEDBACK_DIR, RESULTATEN_DIR, TESTKAARTEN_DIR, huidigeRonde } from '../lib/levels/level4';
import type { Paneel as PaneelSoort } from '../lib/levels/types';
import { parseMarkdown } from '../lib/markdown';
import type { RepoSnapshot } from '../lib/repo/types';

const tekst = (value: unknown) => (typeof value === 'string' && value.trim() ? value.trim() : typeof value === 'number' ? String(value) : '–');

/** Het antwoord onder "## Ronde N", uit de regel "- Antwoord: ...". */
function antwoordIn(text: string, ronde: number): string {
  const sectie = text.split(new RegExp(`^## Ronde ${ronde}\\s*$`, 'm'))[1]?.split(/^## /m)[0] ?? '';
  return sectie.match(/^- Antwoord:\s*(.+)$/m)?.[1].trim() ?? '–';
}

/** De eerste regel tekst onder "## 1. Gemeten waarde" in een resultaatkaart. */
function gemeten(text: string | undefined): string {
  if (!text) return '–';
  const sectie = parseMarkdown(text).body.split(/^## 1\. Gemeten waarde\s*$/m)[1]?.split(/^## /m)[0] ?? '';
  return sectie.split('\n').map((r) => r.trim()).find((r) => r.length > 0) ?? '–';
}

function Mensen({ snapshot }: { snapshot: RepoSnapshot }) {
  const paden = mdFilesIn(snapshot, FEEDBACK_DIR);
  if (paden.length === 0) return <p className="paneel-leeg">Nog niemand in feedback/. Je AI zet je mensen erin bij "Bereid je terugbelgesprekken voor".</p>;
  const inFeedback = paden.flatMap((pad) => [...snapshot.files[pad].matchAll(/^## Ronde (\d+)\s*$/gm)].map((m) => Number(m[1])));
  const rondes = Array.from({ length: Math.max(huidigeRonde(snapshot), ...inFeedback) }, (_, i) => i + 1);
  return (
    <table className="paneel-tabel">
      <caption>Je mensen per ronde</caption>
      <thead>
        <tr>
          <th scope="col">Persoon</th>
          {rondes.map((r) => (
            <th key={r} scope="col">Ronde {r}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {paden.map((pad) => (
          <tr key={pad}>
            <th scope="row">{pad.slice(FEEDBACK_DIR.length + 1, -3)}</th>
            {rondes.map((r) => (
              <td key={r}>{antwoordIn(snapshot.files[pad], r)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Rondes({ snapshot }: { snapshot: RepoSnapshot }) {
  const kaarten = mdFilesIn(snapshot, TESTKAARTEN_DIR);
  if (kaarten.length === 0) return <p className="paneel-leeg">Nog geen ronde. Je eerste testkaart maak je in level 4.</p>;
  return (
    <table className="paneel-tabel">
      <caption>Je testrondes op één bord</caption>
      <thead>
        <tr>
          <th scope="col">Ronde</th>
          <th scope="col">Hypothese</th>
          <th scope="col">Drempel</th>
          <th scope="col">Gemeten</th>
          <th scope="col">Besluit</th>
        </tr>
      </thead>
      <tbody>
        {kaarten.map((pad) => {
          const ronde = pad.match(/ronde-(\d+)\.md$/)?.[1] ?? '?';
          const kaart = frontmatterOf(snapshot, pad);
          const resultaatPad = `${RESULTATEN_DIR}/ronde-${ronde}.md`;
          return (
            <tr key={pad}>
              <th scope="row">Ronde {ronde}</th>
              <td>{tekst(kaart.hypothese)}</td>
              <td>{tekst(kaart.succesdrempel)}</td>
              <td>{gemeten(snapshot.files[resultaatPad])}</td>
              <td>{tekst(frontmatterOf(snapshot, resultaatPad).besluit)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/** Overzichten uit de repo onder een stap. Het platform rekent niets uit wat niet in de bestanden staat. */
export function Paneel({ soort, snapshot }: { soort: PaneelSoort; snapshot: RepoSnapshot }) {
  return <div className="paneel">{soort === 'mensen' ? <Mensen snapshot={snapshot} /> : <Rondes snapshot={snapshot} />}</div>;
}
