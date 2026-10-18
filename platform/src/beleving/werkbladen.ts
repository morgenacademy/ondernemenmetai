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

/** naam: de kop van het werkblad. doe: wat je erop doet, zoals het op een slotje staat: "Eerst stap 3 van dit level: vat je idee samen in één zin." */
const WERKBLAD: Record<string, { naam: string; doe: string; vorm?: Vorm }> = {
  'l1-idee': { naam: 'Je idee', doe: 'zet je idee uiteen' },
  'l1-visie': { naam: 'Je visie', doe: 'formuleer je visie' },
  'l1-madlib': { naam: 'Je idee in één zin', doe: 'vat je idee samen in één zin' },
  'l1-aannames': { naam: 'Je aannames', doe: 'markeer je aannames' },
  'l1-propositie': { naam: 'Je waardepropositie', doe: 'maak je waardepropositie', vorm: 'canvas' },

  'l2-doelgroep': { naam: 'Je doelgroep', doe: 'kies je doelgroep' },
  'l2-vragen': { naam: 'Je interviewvragen', doe: 'maak je interviewvragen' },
  'l2-interviews': { naam: 'Je gesprekken', doe: 'voer je gesprekken', vorm: 'vakken' },
  'l2-analyse': { naam: 'Je analyse', doe: 'analyseer je gesprekken' },
  'l2-canvas': { naam: 'Je canvas', doe: 'werk je canvas bij', vorm: 'canvas' },

  'l3-oplossingen': { naam: 'Je oplossingen', doe: 'bedenk je oplossingen', vorm: 'vakken' },
  'l3-kiezen': { naam: 'Kies je oplossing', doe: 'kies je oplossing' },
  'l3-verwoorden': { naam: 'Je oplossing in woorden', doe: 'zet je oplossing in woorden' },
  'l3-mvp-kiezen': { naam: 'Kies je MVP', doe: 'kies je MVP' },
  'l3-bouwen': { naam: 'Je MVP', doe: 'bouw je MVP', vorm: 'blok' },

  'l4-prijs': { naam: 'Je prijs', doe: 'bepaal je prijs' },
  'l4-testkaart': { naam: 'Je testkaart', doe: 'maak je testkaart' },
  'l4-terugbellen': { naam: 'Je terugbelgesprekken', doe: 'bel je mensen terug' },
  'l4-voorstel': { naam: 'Je voorstellen', doe: 'doe je voorstellen', vorm: 'vakken' },
  'l4-resultaat': { naam: 'Lees je ronde', doe: 'lees je ronde', vorm: 'ronde' },

  'l5-doorontwikkelen': { naam: 'Je betere versie', doe: 'maak je betere versie' },
  'l5-terug': { naam: 'Je tweede ronde', doe: 'doe je tweede ronde' },
  'l5-besluit': { naam: 'Ga je ervoor?', doe: 'besluit of je ervoor gaat', vorm: 'keuze' },
  'l5-bmc': { naam: 'Je businessmodel', doe: 'vul je businessmodel', vorm: 'bmc' },
  'l5-agents': { naam: 'Wie je onderneming is', doe: 'schrijf je AGENTS.md bij' },

  'l6-klant': { naam: 'Je eerste klant', doe: 'zet je eerste klant in je repo' },
  'l6-verkoopaanpak': { naam: 'Je verkoopaanpak', doe: 'leg je verkoopaanpak vast' },
  'l6-pijplijn': { naam: 'Je pijplijn', doe: 'vul je pijplijn', vorm: 'vakken' },
  'l6-impact': { naam: 'Je impact', doe: 'beschrijf je impact', vorm: 'drie' },
};

export function werkbladNaam(id: string, fallback = id): string {
  return WERKBLAD[id]?.naam ?? fallback;
}

export function werkbladVorm(id: string): Vorm {
  return WERKBLAD[id]?.vorm ?? 'lijnen';
}

function doe(w: Werkblad): string {
  return WERKBLAD[w.id]?.doe ?? w.stappen[0].title.toLowerCase();
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

/** Het slot van een werkblad dat nog komt: de stap die eerst moet, en wat je daar doet. */
export type Slot = { nummer: number; reden: string };

/**
 * Alles wat op slot ligt, wacht op het werkblad waar je nu bent. Het slotje noemt die stap met nummer en wat je er doet:
 * "Eerst stap 3 van dit level: vat je idee samen in één zin." Telt dat werkblad af, zoals je gesprekken: "…: nog 2 gesprekken."
 * Zo schrijft docs/schrijfstijl.md het voor.
 */
export function slotRedenen(level: LevelDef, bord: Bord, s: RepoSnapshot): Record<string, Slot> {
  const slots: Record<string, Slot> = {};
  if (!bord.nu) return slots;
  const nummer = level.steps.filter((x) => !x.optional).indexOf(bord.nu.stappen[0]) + 1;
  const reden = `Eerst stap ${nummer} van dit level: ${aftellen(bord.nu, s) ?? doe(bord.nu)}.`;
  for (const w of bord.straks) slots[w.id] = { nummer, reden };
  return slots;
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
