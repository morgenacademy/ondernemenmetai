import { mdFilesIn } from '../lib/levels/checks';
import { isFilled } from '../lib/markdown';
import type { RepoSnapshot } from '../lib/repo/types';

/** Het bestand dat je AI bij een stap maakt; bij feedback het eerste spiekbriefje. kop: begin bij deze kop. */
const BESTAND: Record<string, { pad: string | ((s: RepoSnapshot) => string | undefined); kop?: string }> = {
  'l0-eerste-opdracht': { pad: 'level-0-werkplek/werkplek.md' },
  'l1-propositie': { pad: 'level-1-idee/vpc.md' },
  'l2-vragen': { pad: 'level-2-probleemvalidatie/interviewvragen.md', kop: '## In het gesprek' },
  'l2-analyse': { pad: 'level-2-probleemvalidatie/eerste-doelgroep.md' },
  'l2-canvas': { pad: 'level-1-idee/vpc.md' },
  'l3-kiezen': { pad: 'level-3-prototype/oplossing.md' },
  'l3-verwoorden': { pad: 'level-3-prototype/waardepropositie.md' },
  'l3-mvp-kiezen': { pad: 'level-3-prototype/mvp.md' },
  'l4-testkaart': { pad: 'level-4-marktfeedback/testkaarten/ronde-1.md' },
  'l4-terugbellen': { pad: (s) => mdFilesIn(s, 'level-4-marktfeedback/feedback')[0] },
  'l4-resultaat': { pad: 'level-4-marktfeedback/resultaten/ronde-1.md' },
  'l5-doorontwikkelen': { pad: 'level-5-productvalidatie/product.md' },
  'l5-terug': { pad: 'level-4-marktfeedback/resultaten/ronde-2.md' },
  'l5-bmc': { pad: 'level-5-productvalidatie/bmc.md' },
  'l5-agents': { pad: 'AGENTS.md', kop: '## Over mijn onderneming' },
  'l6-verkoopaanpak': { pad: 'skills/verkoopaanpak/SKILL.md' },
  'l6-impact': { pad: 'level-6-lancering/impact.md' },
};

/** Het bestand waar je AI bij deze stap het resultaat in zet, als dat vastligt. */
export function aiBestand(stepId: string, s: RepoSnapshot): string | undefined {
  const b = BESTAND[stepId];
  return typeof b?.pad === 'function' ? b.pad(s) : b?.pad;
}

/** De eerste regels van wat je AI bij deze stap in je repo zette, of null zolang het er niet (ingevuld) staat. */
export function aiResultaat(stepId: string, s: RepoSnapshot, regels = 14): { pad: string; regels: string[] } | null {
  const b = BESTAND[stepId];
  if (!b) return null;
  const pad = typeof b.pad === 'function' ? b.pad(s) : b.pad;
  const tekst = pad ? s.files[pad] : undefined;
  if (!pad || !tekst || !isFilled(tekst)) return null;
  let lijnen = tekst.replace(/\r\n/g, '\n').split('\n');
  if (b.kop) {
    const i = lijnen.findIndex((l) => l.trim() === b.kop);
    if (i >= 0) lijnen = lijnen.slice(i);
  }
  return { pad, regels: lijnen.filter((l, i, a) => !(l === '' && a[i - 1] === '')).slice(0, regels).map((l) => (l.length > 90 ? `${l.slice(0, 89)}…` : l)) };
}
