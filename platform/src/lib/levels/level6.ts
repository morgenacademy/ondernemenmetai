import { isFilled, toMarkdown } from '../markdown';
import type { RepoSnapshot } from '../repo/types';
import { fileExists, fileFilled, frontmatterFilled, minListItems } from './checks';
import type { FormValues, LevelDef } from './types';

export const KLANTEN_PATH = 'level-6-lancering/klanten.md';
export const PIJPLIJN_PATH = 'level-6-lancering/pijplijn.md';
export const IMPACT_PATH = 'level-6-lancering/impact.md';
export const VERKOOPAANPAK_PATH = 'skills/verkoopaanpak/SKILL.md';

/** Vijf fases, van contact gelegd (10%) tot opdracht (100%), zoals de simpele sales funnel uit de bronnen. */
export const PIJPLIJN_FASES = [
  { value: 'contact', label: 'Contact gelegd', kans: 10 },
  { value: 'gesprek', label: 'Gesprek gehad', kans: 25 },
  { value: 'voorstel', label: 'Voorstel gedaan', kans: 50 },
  { value: 'akkoord', label: 'Mondeling akkoord', kans: 75 },
  { value: 'opdracht', label: 'Opdracht', kans: 100 },
];

export function klantRegel(v: FormValues): string {
  return `- ${v.rol.trim()} (${v.initialen.trim()}): ${v.wat.trim()}, €${v.bedrag.trim()}, ${v.datum.trim()}`;
}

/** Zet een klant onderaan klanten.md. Staat er nog een template, dan begint het bestand opnieuw. */
export function klantToevoegen(s: RepoSnapshot, v: FormValues): string {
  const huidig = s.files[KLANTEN_PATH];
  const basis = huidig && isFilled(huidig) ? huidig.trimEnd() : '# Klanten\n\nBetalende klanten, met een rol en initialen. Contactgegevens horen niet in de repo.\n';
  const laatste = basis.trimEnd().split('\n').pop() ?? '';
  return `${basis.trimEnd()}\n${laatste.startsWith('- ') ? '' : '\n'}${klantRegel(v)}\n`;
}

const euro = (n: number) => `€${Math.round(n)}`;

type Rij = { klant: string; fase: string; waarde: number };

function rijenUit(text: string | undefined): Rij[] {
  if (!text || !isFilled(text)) return [];
  return text
    .split('\n')
    .filter((line) => line.startsWith('| ') && !line.startsWith('| Klant') && !line.startsWith('|---'))
    .map((line) => line.split('|').map((cell) => cell.trim()))
    .map((cells) => ({ klant: cells[1], fase: PIJPLIJN_FASES.find((f) => f.label === cells[2])?.value ?? 'contact', waarde: Number(cells[4].replace(/[^\d]/g, '')) }));
}

export function pijplijnMarkdown(rijen: Rij[]): string {
  const regels = rijen.map((r) => {
    const fase = PIJPLIJN_FASES.find((f) => f.value === r.fase) ?? PIJPLIJN_FASES[0];
    return `| ${r.klant} | ${fase.label} | ${fase.kans}% | ${euro(r.waarde)} | ${euro((r.waarde * fase.kans) / 100)} |`;
  });
  const totaal = rijen.reduce((som, r) => som + (r.waarde * (PIJPLIJN_FASES.find((f) => f.value === r.fase)?.kans ?? 0)) / 100, 0);
  return `# Pijplijn\n\n| Klant | Fase | Kans | Waarde | Gewogen |\n|---|---|---|---|---|\n${regels.join('\n')}\n\nTotaal gewogen: ${euro(totaal)}`;
}

export const level6: LevelDef = {
  id: 6,
  name: 'Lancering',
  summary: 'Je eerste klant is er. Leg vast hoe je verkocht, houd je volgende klanten bij en maak je impact zichtbaar.',
  milestone: 'Proof of Concept: je eerste betalende klant.',
  doel: 'Je hebt je eerste klant.',
  vraag: 'Ik heb een klant. Wat nu?',
  begrip: 'Je eigen skill',
  kern: [KLANTEN_PATH, VERKOOPAANPAK_PATH],
  ready: true,
  opensEarly: (s) => minListItems('klant', 'l6-klant', KLANTEN_PATH, 1, '').run(s).ok,
  steps: [
    {
      id: 'l6-klant',
      title: 'Ik heb een klant',
      kind: 'form',
      waar: ['platform'],
      fields: [
        { kind: 'text', name: 'rol', label: 'Rol van je klant', placeholder: 'apotheker' },
        { kind: 'text', name: 'initialen', label: 'Initialen', placeholder: 'K.' },
        { kind: 'text', name: 'wat', label: 'Wat kocht je klant?', placeholder: 'proefabonnement' },
        { kind: 'text', name: 'bedrag', label: 'Bedrag in euro', placeholder: '40' },
        { kind: 'text', name: 'datum', label: 'Datum', placeholder: '2026-11-24' },
      ],
      toFile: (v, s) => ({ path: KLANTEN_PATH, message: `Klant: ${v.rol.trim()} (${v.initialen.trim()})`, content: klantToevoegen(s, v) }),
    },
    {
      id: 'l6-verkoopaanpak',
      title: 'Leg vast hoe je verkocht',
      kind: 'action',
      waar: ['ai-app', 'github-desktop', 'github'],
      aiPrompt:
        'Gebruik skill verkoopgesprek. Haal uit mijn feedback en mijn eerste verkoop wat werkte, en leg mijn verkoopaanpak vast als eigen skill in skills/verkoopaanpak/SKILL.md, op een nieuwe branch.',
      popup: { label: 'Wat is een eigen skill?', title: 'Je schrijft je eerste eigen skill', contentId: 'l6-eigen-skill' },
    },
    {
      id: 'l6-pijplijn',
      title: 'Zet je volgende klanten in een pijplijn',
      kind: 'form',
      waar: ['buiten', 'platform'],
      fields: [
        { kind: 'text', name: 'klant', label: 'Klant (rol en initialen)', placeholder: 'apotheker Tilburg (R.)' },
        { kind: 'select', name: 'fase', label: 'Fase', options: PIJPLIJN_FASES.map((f) => ({ value: f.value, label: `${f.label} (${f.kans}%)` })) },
        { kind: 'text', name: 'waarde', label: 'Waarde in euro per jaar', placeholder: '480' },
      ],
      toFile: (v, s) => {
        const nieuw: Rij = { klant: v.klant.trim(), fase: v.fase, waarde: Number(v.waarde.replace(/[^\d]/g, '')) || 0 };
        const rijen = rijenUit(s.files[PIJPLIJN_PATH]).filter((r) => r.klant !== nieuw.klant);
        return { path: PIJPLIJN_PATH, message: `Pijplijn: ${nieuw.klant}`, content: toMarkdown(null, pijplijnMarkdown([...rijen, nieuw])) };
      },
    },
    {
      id: 'l6-impact',
      title: 'Maak je impact zichtbaar',
      kind: 'action',
      waar: ['ai-app'],
      aiPrompt: 'Gebruik skill impact-scan. Loop met mij de zes kapitalen langs en zet de uitkomst in level-6-lancering/impact.md.',
    },
  ],
  checks: [
    minListItems('klant', 'l6-klant', KLANTEN_PATH, 1, 'Minstens 1 betalende klant'),
    fileExists('verkoopaanpak', 'l6-verkoopaanpak', VERKOOPAANPAK_PATH, 'Eigen skill in je repo'),
    frontmatterFilled('verkoopaanpak-velden', 'l6-verkoopaanpak', { path: VERKOOPAANPAK_PATH }, ['name', 'description'], 'Je skill heeft een naam en beschrijving'),
    fileFilled('pijplijn', 'l6-pijplijn', PIJPLIJN_PATH, 'Pijplijn bijgehouden'),
    fileFilled('impact', 'l6-impact', IMPACT_PATH, 'Impact zichtbaar'),
  ],
};
