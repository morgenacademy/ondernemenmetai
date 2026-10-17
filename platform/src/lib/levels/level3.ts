import { toMarkdown } from '../markdown';
import type { RepoSnapshot } from '../repo/types';
import { anyFileIn, fileFilled, frontmatterOf, minListItems } from './checks';
import { EERSTE_DOELGROEP_PATH } from './level2';
import type { LevelDef } from './types';

export const OPLOSSINGEN_PATH = 'level-3-prototype/oplossingen.md';
export const OPLOSSING_PATH = 'level-3-prototype/oplossing.md';
export const WAARDEPROPOSITIE_PATH = 'level-3-prototype/waardepropositie.md';
export const MVP_PATH = 'level-3-prototype/mvp.md';
export const MVP_DIR = 'level-3-prototype/mvp';

/** "Hoe kunnen we [doelgroep] helpen met [probleem]?", uit eerste-doelgroep.md. */
export function howMightWe(s: RepoSnapshot): string | null {
  const fm = frontmatterOf(s, EERSTE_DOELGROEP_PATH);
  const doelgroep = typeof fm.doelgroep === 'string' ? fm.doelgroep.trim() : '';
  const probleem = typeof fm.probleem === 'string' ? fm.probleem.trim() : '';
  return doelgroep && probleem ? `Hoe kunnen we ${doelgroep} helpen met ${probleem}?` : null;
}

export function ideeenToMarkdown(text: string, vraag: string | null): string {
  const lines = text
    .split('\n')
    .map((line) => line.trim().replace(/^[-*]\s*/, ''))
    .filter((line) => line.length > 0);
  return `# Oplossingen\n\n${vraag ? `${vraag}\n\n` : ''}${lines.map((line) => `- ${line}`).join('\n')}`;
}

export const level3: LevelDef = {
  id: 3,
  name: 'Prototype',
  summary: 'Bedenk zoveel mogelijk oplossingen, kies er één en maak er een MVP van die je kunt laten zien.',
  milestone: '2. Product/solution fit: de beste oplossing voor het probleem van je eerste doelgroep.',
  doel: 'Je hebt een MVP die je aan je doelgroep kunt laten zien.',
  vraag: 'Welke oplossing past het best bij dat probleem?',
  begrip: 'Geschiedenis',
  kern: [OPLOSSING_PATH, `${MVP_DIR}/`],
  ready: true,
  steps: [
    {
      id: 'l3-oplossingen',
      title: 'Bedenk oplossingen',
      kind: 'form',
      waar: ['buiten', 'platform'],
      hint: howMightWe,
      fields: [
        {
          kind: 'textarea',
          name: 'ideeen',
          label: 'Eén idee per regel. Minstens 10.',
          rijen: 10,
          placeholder: 'Bezorging per bakfiets\nKluisjes bij de apotheek',
        },
      ],
      toFile: (v, s) => ({ path: OPLOSSINGEN_PATH, message: 'Oplossingen bedacht', content: toMarkdown(null, ideeenToMarkdown(v.ideeen, howMightWe(s))) }),
    },
    {
      id: 'l3-kiezen',
      title: 'Waardeer en kies je oplossing',
      kind: 'action',
      waar: ['ai-app'],
      aiPrompt:
        'Gebruik skill oplossing-kiezen. Vul mijn ideeën in level-3-prototype/oplossingen.md aan, help me ze te waarderen en zet de oplossing die ik kies in oplossing.md.',
    },
    {
      id: 'l3-verwoorden',
      title: 'Verwoord je oplossing',
      kind: 'action',
      waar: ['ai-app', 'github-desktop', 'github'],
      aiPrompt:
        'Gebruik skill waardepropositie-bouwer. Verwoord mijn gekozen oplossing in level-3-prototype/waardepropositie.md, en stel op een nieuwe branch een nieuwe madlib en een nieuwe aanbodkant van vpc.md voor.',
      popup: { label: 'Waar zie ik mijn eerdere versies?', title: 'Je repo onthoudt elke versie', contentId: 'l3-geschiedenis' },
    },
    {
      id: 'l3-mvp-kiezen',
      title: 'Kies je MVP',
      kind: 'action',
      waar: ['ai-app'],
      aiPrompt: 'Gebruik skill mvp-kiezen. Vraag me waarom ik niet morgen de markt op ga, en zet mijn bezwaren, de riskantste aanname en het MVP-type in level-3-prototype/mvp.md.',
    },
    {
      id: 'l3-bouwen',
      title: 'Bouw je MVP',
      kind: 'action',
      waar: ['ai-app', 'buiten'],
      aiPrompt: 'Gebruik skill mvp-kiezen. Bouw de digitale delen van mijn MVP uit level-3-prototype/mvp.md in de map mvp/.',
    },
  ],
  checks: [
    minListItems('oplossingen', 'l3-oplossingen', OPLOSSINGEN_PATH, 10, 'Minstens 10 ideeën'),
    fileFilled('oplossing', 'l3-kiezen', OPLOSSING_PATH, 'Oplossing gekozen'),
    fileFilled('waardepropositie', 'l3-verwoorden', WAARDEPROPOSITIE_PATH, 'Waardepropositie verwoord'),
    fileFilled('mvp-keuze', 'l3-mvp-kiezen', MVP_PATH, 'MVP gekozen'),
    anyFileIn('mvp', 'l3-bouwen', MVP_DIR, 'MVP in je repo'),
  ],
};
