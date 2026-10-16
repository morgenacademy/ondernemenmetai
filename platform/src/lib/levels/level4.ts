import { parseMarkdown, toMarkdown, upsertSection } from '../markdown';
import type { RepoSnapshot } from '../repo/types';
import { fileFilled, frontmatterFilled, frontmatterOf, mdFilesIn, minFilledFiles } from './checks';
import { DOELGROEP_PATH } from './level2';
import type { LevelDef, Option } from './types';

export const PRIJS_PATH = 'level-4-marktfeedback/prijs.md';
export const TESTKAARTEN_DIR = 'level-4-marktfeedback/testkaarten';
export const FEEDBACK_DIR = 'level-4-marktfeedback/feedback';
export const RESULTATEN_DIR = 'level-4-marktfeedback/resultaten';

export const testkaartPath = (ronde: number) => `${TESTKAARTEN_DIR}/ronde-${ronde}.md`;
export const resultaatPath = (ronde: number) => `${RESULTATEN_DIR}/ronde-${ronde}.md`;

/** De vijf blokken van een testkaart, zoals skill testkaart ze in de frontmatter zet. */
export const TESTKAART_VELDEN = ['hypothese', 'test_opzet', 'metriek', 'succesdrempel', 'tijd_en_sample'];

/** 3 bij B2B, 10 bij B2C, tenzij doelgroep.md een eigen feedback_nodig heeft. */
export function requiredFeedback(s: RepoSnapshot): number {
  const fm = frontmatterOf(s, DOELGROEP_PATH);
  const n = fm.feedback_nodig;
  if (typeof n === 'number' && Number.isInteger(n) && n > 0) return Math.min(n, 50);
  return typeof fm.type === 'string' && fm.type.trim().toUpperCase() === 'B2C' ? 10 : 3;
}

/** De ronde waar je nu in zit: de hoogste testkaart, of 1. */
export function huidigeRonde(s: RepoSnapshot): number {
  const rondes = mdFilesIn(s, TESTKAARTEN_DIR)
    .map((path) => Number(path.match(/ronde-(\d+)\.md$/)?.[1]))
    .filter((n) => Number.isInteger(n) && n > 0);
  return rondes.length > 0 ? Math.max(...rondes) : 1;
}

export function mensen(s: RepoSnapshot): Option[] {
  return mdFilesIn(s, FEEDBACK_DIR).map((path) => {
    const name = path.slice(FEEDBACK_DIR.length + 1, -3);
    return { value: name, label: name };
  });
}

export const ANTWOORDEN: Option[] = [
  { value: 'ja', label: 'Ja' },
  { value: 'nee', label: 'Nee' },
  { value: 'twijfel', label: 'Twijfel' },
];

export const level4: LevelDef = {
  id: 4,
  name: 'Markt feedback',
  summary: 'Ga met je MVP terug naar je mensen, doe je voorstel en lees wat de ronde je leerde.',
  milestone: '3. Commitment: je doelgroep wil kopen, en voor dezelfde prijs. Je haalt hem in de lus met level 5.',
  doel: 'Je hebt van genoeg mensen gehoord wat ze van je MVP vinden.',
  vraag: 'Wat vinden ze van mijn MVP, en willen ze het tegen mijn prijs?',
  begrip: 'Je repo als geheugen',
  kern: [`${FEEDBACK_DIR}/`, resultaatPath(1)],
  ready: true,
  steps: [
    {
      id: 'l4-prijs',
      title: 'Bepaal je prijs',
      kind: 'form',
      waar: ['platform'],
      fields: [
        { kind: 'text', name: 'prijs', label: 'Je prijs in euro', placeholder: '40' },
        {
          kind: 'select',
          name: 'per',
          label: 'Per wat?',
          options: [
            { value: 'per maand', label: 'Per maand' },
            { value: 'per stuk', label: 'Per stuk' },
            { value: 'per keer', label: 'Per keer' },
            { value: 'per jaar', label: 'Per jaar' },
          ],
        },
        { kind: 'text', name: 'kostprijs', label: 'Geschatte kostprijs in euro, voor dezelfde eenheid', placeholder: '22' },
      ],
      toFile: (v) => ({
        path: PRIJS_PATH,
        message: 'Prijs bepaald',
        content: toMarkdown(
          { prijs: v.prijs.trim(), per: v.per, kostprijs: v.kostprijs.trim() },
          `# Prijs\n\n€${v.prijs.trim()} ${v.per}.\n\nGeschatte kostprijs: €${v.kostprijs.trim()} ${v.per}. Dit is een schatting; je toetst hem in je rondes.`,
        ),
      }),
    },
    {
      id: 'l4-testkaart',
      title: 'Maak je testkaart',
      kind: 'action',
      waar: ['ai-app'],
      aiPrompt: 'Gebruik skill testkaart. Leg met mij vast wat ronde 1 met mijn MVP moet opleveren, in level-4-marktfeedback/testkaarten/ronde-1.md.',
    },
    {
      id: 'l4-terugbellen',
      title: 'Bereid je terugbelgesprekken voor',
      kind: 'action',
      waar: ['ai-app'],
      aiPrompt:
        'Gebruik skill terugbellen. Zoek in mijn interviews wie terugbellen: ja zei, en maak per persoon een spiekbriefje bovenaan level-4-marktfeedback/feedback/NN-rol.md.',
      popup: { label: 'Hoe weet mijn AI nog wat ze zeiden?', title: 'Je repo is het geheugen van je AI', contentId: 'l4-geheugen' },
    },
    {
      id: 'l4-voorstel',
      title: 'Laat proberen en doe je voorstel',
      kind: 'form',
      waar: ['buiten', 'platform'],
      paneel: 'mensen',
      fields: [
        { kind: 'select', name: 'persoon', label: 'Met wie sprak je?', options: [], optionsFrom: mensen },
        { kind: 'textarea', name: 'geprobeerd', label: 'Wat probeerde diegene, en hoe lang?' },
        { kind: 'textarea', name: 'voorstel', label: 'Wat was je voorstel?' },
        { kind: 'select', name: 'antwoord', label: 'Het antwoord', options: ANTWOORDEN },
        { kind: 'textarea', name: 'waarom', label: 'Waarom? Bij nee is dit het belangrijkste wat je meeneemt.' },
      ],
      toFile: (v, s) => {
        const path = `${FEEDBACK_DIR}/${v.persoon}.md`;
        const ronde = huidigeRonde(s);
        const { frontmatter, body } = parseMarkdown(s.files[path] ?? `# ${v.persoon}\n`);
        const sectie = [
          `- Wat diegene probeerde, en hoe lang: ${v.geprobeerd.trim()}`,
          `- Mijn voorstel: ${v.voorstel.trim()}`,
          `- Antwoord: ${v.antwoord}`,
          `- Waarom: ${v.waarom.trim()}`,
        ].join('\n');
        return {
          path,
          message: `Ronde ${ronde}: antwoord van ${v.persoon}`,
          content: toMarkdown({ ...frontmatter, persoon: v.persoon, ronde, antwoord: v.antwoord }, upsertSection(body, `Ronde ${ronde}`, sectie)),
        };
      },
    },
    {
      id: 'l4-resultaat',
      title: 'Lees je ronde',
      kind: 'action',
      waar: ['ai-app'],
      paneel: 'rondes',
      aiPrompt: 'Gebruik skill resultaatkaart. Lees ronde 1 met mij en zet de resultaatkaart met mijn besluit in level-4-marktfeedback/resultaten/ronde-1.md.',
    },
  ],
  checks: [
    fileFilled('prijs', 'l4-prijs', PRIJS_PATH, 'Prijs bepaald'),
    frontmatterFilled('testkaart', 'l4-testkaart', { path: testkaartPath(1) }, TESTKAART_VELDEN, 'Testkaart ronde 1 met alle vijf blokken'),
    minFilledFiles('spiekbriefjes', 'l4-terugbellen', FEEDBACK_DIR, requiredFeedback, 'Spiekbriefjes klaar'),
    frontmatterFilled('antwoorden', 'l4-voorstel', { folder: FEEDBACK_DIR, min: requiredFeedback }, ['antwoord'], 'Mensen met een antwoord'),
    frontmatterFilled('resultaat', 'l4-resultaat', { path: resultaatPath(1) }, ['besluit'], 'Resultaatkaart ronde 1 met besluit'),
  ],
};
