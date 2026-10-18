// Je gesprekken in level 2: een vak per gesprek. Een vak is vol zodra het interview als .md in je repo staat.
import { filledFilesIn, frontmatterOf } from '../lib/levels/checks';
import { INTERVIEWS_DIR, nextInterviewPath, requiredInterviews } from '../lib/levels/level2';
import type { FileWrite } from '../lib/levels/types';
import { parseMarkdown, toMarkdown } from '../lib/markdown';
import type { RepoSnapshot } from '../lib/repo/types';

/** Een vol vak: wie je sprak (rol en plaats, geen naam), wanneer, en één uitspraak. */
export type Gesprek = { pad: string; nr: string; wie: string; wanneer: string; uitspraak: string | null };

const MAANDEN = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];

/** De datum van vandaag als 2026-10-18, in de tijdzone van de deelnemer. */
export function vandaagIso(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** "12 okt · 24 min", "vandaag · aantekeningen", of leeg als er niets over bekend is. */
export function wanneerTekst(fm: { datum?: unknown; duur?: unknown; bron?: unknown }, vandaag: string): string {
  const delen: string[] = [];
  const datum = typeof fm.datum === 'string' ? fm.datum.match(/^(\d{4})-(\d{2})-(\d{2})$/) : null;
  if (datum) delen.push(fm.datum === vandaag ? 'vandaag' : `${Number(datum[3])} ${MAANDEN[Number(datum[2]) - 1] ?? ''}`.trim());
  if (typeof fm.duur === 'number' && fm.duur > 0) delen.push(`${fm.duur} min`);
  else if (fm.bron === 'aantekeningen') delen.push('aantekeningen');
  return delen.join(' · ');
}

/** De eerste zin, hooguit 120 tekens. */
export function eersteZin(tekst: string): string {
  const zin = tekst.trim().split(/(?<=[.!?])\s+/)[0] ?? '';
  return zin.length > 120 ? `${zin.slice(0, 119)}…` : zin;
}

const zonderAanhalingstekens = (t: string) => t.trim().replace(/^["“'‘]+|["”'’]+$/g, '').trim();

/** De uitspraak voor in het vak: uit de frontmatter, anders de uitspraak bovenaan, anders de eerste zin. */
function uitspraakVan(tekst: string, fm: Record<string, unknown>): string | null {
  if (typeof fm.uitspraak === 'string' && fm.uitspraak.trim()) return zonderAanhalingstekens(fm.uitspraak);
  const regels = parseMarkdown(tekst).body.split('\n').map((r) => r.trim());
  const citaat = regels.find((r) => r.startsWith('>') && !/^>\s*let op/i.test(r));
  if (citaat) return eersteZin(zonderAanhalingstekens(citaat.replace(/^>\s*/, '')));
  const eerste = regels.find((r) => r !== '' && !r.startsWith('#') && !r.startsWith('>') && !r.startsWith('<!--'));
  return eerste ? eersteZin(eerste.replace(/^[-*]\s+/, '')) : null;
}

const hoofdletter = (t: string) => (t ? t[0].toUpperCase() + t.slice(1) : t);

function gesprekVan(s: RepoSnapshot, pad: string, i: number, vandaag: string): Gesprek {
  const naam = pad.slice(INTERVIEWS_DIR.length + 1, -3);
  const nummer = naam.match(/^(\d{1,3})-(.*)$/);
  const fm = frontmatterOf(s, pad);
  const rol = typeof fm.rol === 'string' && fm.rol.trim() ? fm.rol.trim() : (nummer?.[2] ?? naam).replace(/-/g, ' ');
  const plaats = typeof fm.locatie === 'string' ? fm.locatie.trim() : '';
  return {
    pad,
    nr: nummer?.[1] ?? String(i + 1).padStart(2, '0'),
    wie: hoofdletter(plaats ? `${rol}, ${plaats}` : rol),
    wanneer: wanneerTekst(fm, vandaag),
    uitspraak: uitspraakVan(s.files[pad], fm),
  };
}

/** nodig: hoeveel vakken er zijn. vol: de gesprekken die al in je repo staan. vanVandaag: de paden van de gesprekken van vandaag. */
export function gesprekkenVan(s: RepoSnapshot, vandaag: string): { nodig: number; vol: Gesprek[]; vanVandaag: string[] } {
  const paden = filledFilesIn(s, INTERVIEWS_DIR);
  return {
    nodig: requiredInterviews(s),
    vol: paden.map((pad, i) => gesprekVan(s, pad, i, vandaag)),
    vanVandaag: paden.filter((pad) => frontmatterOf(s, pad).datum === vandaag),
  };
}

/**
 * Het vak dat "Net binnen" krijgt: het nieuwste, als het binnenkwam terwijl je keek of als het gesprek van vandaag is.
 * bijOpenen: de vakken die al vol waren toen je het werkblad opende.
 */
export function netBinnen(vol: Gesprek[], bijOpenen: Set<string> | null, vanVandaag: string[]): string | null {
  const nieuwste = vol[vol.length - 1];
  if (!nieuwste) return null;
  const tijdensKijken = bijOpenen !== null && !bijOpenen.has(nieuwste.pad);
  return tijdensKijken || vanVandaag.includes(nieuwste.pad) ? nieuwste.pad : null;
}

/** "Geen opname, wel aantekeningen?": het platform zet je aantekeningen als interview in je repo. wie = rol en plaats, zoals "apotheker, Houten". */
export function aantekeningenBestand(s: RepoSnapshot, wie: string, notities: string, vandaag: string): FileWrite {
  const [rol, ...rest] = wie.split(',');
  const locatie = rest.join(',').trim();
  const path = nextInterviewPath(s, wie);
  const naam = path.split('/').pop() ?? path;
  const nr = naam.slice(0, naam.indexOf('-'));
  const fm: Record<string, unknown> = { rol: rol.trim(), ...(locatie ? { locatie } : {}), datum: vandaag, bron: 'aantekeningen', uitspraak: eersteZin(notities) };
  return {
    path,
    message: `Gesprek toegevoegd: ${naam}`,
    content: toMarkdown(fm, `# Interview ${nr}: ${wie.trim()}\n\n## Aantekeningen\n\n${notities.trim()}`),
  };
}
