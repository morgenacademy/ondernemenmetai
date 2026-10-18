// Van stap naar werkblad, uit het ontwerp "een eigen speelbord per level" (18 oktober).
// Wat af is, staat bovenaan als regel met een vinkje. De stap waar je bent, is het lichte werkblad. Wat nog komt, ligt eronder op slot.
import { filledFilesIn, frontmatterOf } from '../lib/levels/checks';
import { DOELGROEP_PATH, INTERVIEWS_DIR, defaultInterviews, requiredInterviews } from '../lib/levels/level2';
import type { LevelDef, Step } from '../lib/levels/types';
import { parseMarkdown } from '../lib/markdown';
import type { RepoSnapshot } from '../lib/repo/types';
import type { StapStatus } from './voortgang';

export type WerkbladStand = 'af' | 'nu' | 'straks';
/** id = de stap die het werkblad zijn naam en vorm geeft. */
export type Werkblad = { id: string; stappen: Step[]; stand: WerkbladStand };
export type Bord = { af: Werkblad[]; nu: Werkblad | null; straks: Werkblad[]; opties: Step[] };

/**
 * Stappen met dezelfde check worden één werkblad. "Interview je doelgroep" en "Zet je interviews in je repo"
 * tellen allebei de bestanden in interviews/; samen zijn ze je gesprekken.
 */
const ZELFDE_CHECK: Record<string, string> = { 'l2-interviewen': 'l2-interviews' };

/** Het vlak dat door de grijze laag van een gesloten werkblad schemert. */
export type Vorm = 'lijnen' | 'canvas' | 'blok' | 'ronde' | 'keuze' | 'bmc' | 'drie' | 'vakken';

/** naam: de kop van het werkblad. kort: zoals het op een slotje staat, na "eerst". */
const WERKBLAD: Record<string, { naam: string; kort: string; vorm?: Vorm }> = {
  'l1-idee': { naam: 'Je idee', kort: 'je idee' },
  'l1-visie': { naam: 'Je visie', kort: 'je visie' },
  'l1-madlib': { naam: 'Je idee in één zin', kort: 'je zin' },
  'l1-aannames': { naam: 'Je aannames', kort: 'je aannames' },
  'l1-propositie': { naam: 'Je waardepropositie', kort: 'je waardepropositie', vorm: 'canvas' },

  'l2-doelgroep': { naam: 'Je doelgroep', kort: 'je doelgroep' },
  'l2-vragen': { naam: 'Je interviewvragen', kort: 'je vragen' },
  'l2-interviews': { naam: 'Je gesprekken', kort: 'je gesprekken', vorm: 'vakken' },
  'l2-analyse': { naam: 'Je analyse', kort: 'je analyse' },
  'l2-canvas': { naam: 'Je canvas', kort: 'je canvas', vorm: 'canvas' },

  'l3-oplossingen': { naam: 'Je oplossingen', kort: 'je oplossingen', vorm: 'vakken' },
  'l3-kiezen': { naam: 'Kies je oplossing', kort: 'je keuze' },
  'l3-verwoorden': { naam: 'Je oplossing in woorden', kort: 'je woorden' },
  'l3-mvp-kiezen': { naam: 'Kies je MVP', kort: 'je MVP-keuze' },
  'l3-bouwen': { naam: 'Je MVP', kort: 'je MVP', vorm: 'blok' },

  'l4-prijs': { naam: 'Je prijs', kort: 'je prijs' },
  'l4-testkaart': { naam: 'Je testkaart', kort: 'je testkaart' },
  'l4-terugbellen': { naam: 'Je terugbelgesprekken', kort: 'je spiekbriefjes' },
  'l4-voorstel': { naam: 'Je voorstellen', kort: 'je voorstellen', vorm: 'vakken' },
  'l4-resultaat': { naam: 'Lees je ronde', kort: 'je ronde', vorm: 'ronde' },

  'l5-doorontwikkelen': { naam: 'Je betere versie', kort: 'je betere versie' },
  'l5-terug': { naam: 'Je tweede ronde', kort: 'je tweede ronde' },
  'l5-besluit': { naam: 'Ga je ervoor?', kort: 'je besluit', vorm: 'keuze' },
  'l5-bmc': { naam: 'Je businessmodel', kort: 'je businessmodel', vorm: 'bmc' },
  'l5-agents': { naam: 'Wie je onderneming is', kort: 'je AGENTS.md' },

  'l6-klant': { naam: 'Je eerste klant', kort: 'je eerste klant' },
  'l6-verkoopaanpak': { naam: 'Je verkoopaanpak', kort: 'je verkoopaanpak' },
  'l6-pijplijn': { naam: 'Je pijplijn', kort: 'je pijplijn', vorm: 'vakken' },
  'l6-impact': { naam: 'Je impact', kort: 'je impact', vorm: 'drie' },
};

export function werkbladNaam(id: string, fallback = id): string {
  return WERKBLAD[id]?.naam ?? fallback;
}

export function werkbladVorm(id: string): Vorm {
  return WERKBLAD[id]?.vorm ?? 'lijnen';
}

function kort(w: Werkblad): string {
  return WERKBLAD[w.id]?.kort ?? w.stappen[0].title.toLowerCase();
}

/** Deelt de stappen van een level in: wat af is, het ene werkblad waar je nu bent, wat op slot ligt, en de optionele regels. */
export function bordVan(level: LevelDef, statussen: Record<string, StapStatus>): Bord {
  const werkbladen: Werkblad[] = [];
  const opties: Step[] = [];
  for (const step of level.steps) {
    if (step.optional) {
      opties.push(step);
      continue;
    }
    const id = ZELFDE_CHECK[step.id] ?? step.id;
    const bestaand = werkbladen.find((w) => w.id === id);
    if (bestaand) bestaand.stappen.push(step);
    else werkbladen.push({ id, stappen: [step], stand: 'straks' });
  }
  for (const w of werkbladen) {
    const standen = w.stappen.map((s) => statussen[s.id]);
    w.stand = standen.every((s) => s === 'af') ? 'af' : standen.includes('nu') ? 'nu' : 'straks';
  }
  return {
    af: werkbladen.filter((w) => w.stand === 'af'),
    nu: werkbladen.find((w) => w.stand === 'nu') ?? null,
    straks: werkbladen.filter((w) => w.stand === 'straks'),
    opties,
  };
}

/** Hoeveel gesprekken er nog moeten komen. */
export function nogGesprekken(s: RepoSnapshot): number {
  return Math.max(0, requiredInterviews(s) - filledFilesIn(s, INTERVIEWS_DIR).length);
}

/** "nog 2 gesprekken" zolang je gesprekken het werkblad zijn; anders null. */
function aftellen(w: Werkblad, s: RepoSnapshot): string | null {
  if (w.id !== 'l2-interviews') return null;
  const nog = nogGesprekken(s);
  return nog === 1 ? 'nog 1 gesprek' : `nog ${nog} gesprekken`;
}

/**
 * De korte reden op het slotje van elk gesloten werkblad: "eerst" en het werkblad ervoor.
 * Telt het werkblad waar je nu bent af, zoals je gesprekken, dan wacht alles daarop: "nog 2 gesprekken".
 */
export function slotRedenen(bord: Bord, s: RepoSnapshot): Record<string, string> {
  const telling = bord.nu ? aftellen(bord.nu, s) : null;
  const redenen: Record<string, string> = {};
  let vorige = bord.nu;
  for (const w of bord.straks) {
    redenen[w.id] = telling ?? (vorige ? `eerst ${kort(vorige)}` : 'eerst de stap hiervoor');
    vorige = w;
  }
  return redenen;
}

/** De eerste regel tekst onder een kop, zonder punt aan het eind. */
function onderKop(tekst: string, kop: string): string | null {
  const regels = parseMarkdown(tekst).body.split('\n');
  const start = regels.findIndex((r) => r.replace(/^#+\s*/, '').trim().toLowerCase() === kop.toLowerCase() && r.startsWith('#'));
  if (start === -1) return null;
  const regel = regels.slice(start + 1).find((r) => r.trim() !== '' && !r.startsWith('#'));
  return regel?.trim().replace(/[.!]+$/, '') || null;
}

/** Een gewoon woord begint klein midden in een zin; een naam of afkorting niet. */
function klein(tekst: string): string {
  return /^[A-Z][a-zà-ÿ]/.test(tekst) ? tekst[0].toLowerCase() + tekst.slice(1) : tekst;
}

/** De regel met het vinkje bovenaan: de naam van het werkblad, en waar het kan wat erin staat. */
export function afRegel(id: string, s: RepoSnapshot): string {
  if (id === 'l1-idee') {
    const wat = onderKop(s.files['level-1-idee/idee.md'] ?? '', 'Wat ga ik doen?');
    if (wat) return `Je idee: ${klein(wat.length > 60 ? `${wat.slice(0, 59)}…` : wat)}`;
  }
  if (id === 'l2-doelgroep') {
    const type = frontmatterOf(s, DOELGROEP_PATH).type;
    const wie = defaultInterviews(type) === 15 ? 'consumenten' : 'bedrijven';
    return `Je doelgroep · ${wie}, dus ${defaultInterviews(type)} gesprekken`;
  }
  return werkbladNaam(id);
}
