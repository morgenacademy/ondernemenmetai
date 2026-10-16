import { toMarkdown } from '../markdown';
import type { RepoSnapshot } from '../repo/types';
import { fileFilled, frontmatterIs, frontmatterOf, mdFilesIn, minFilledFiles, minMergedPullRequests } from './checks';
import type { LevelDef } from './types';

export const DOELGROEP_PATH = 'level-2-probleemvalidatie/doelgroep.md';
export const VRAGEN_PATH = 'level-2-probleemvalidatie/interviewvragen.md';
export const ANALYSE_PATH = 'level-2-probleemvalidatie/analyse.md';
export const EERSTE_DOELGROEP_PATH = 'level-2-probleemvalidatie/eerste-doelgroep.md';
export const INTERVIEWS_DIR = 'level-2-probleemvalidatie/interviews';

/** Bovengrens: meer vakjes dan dit tekenen heeft geen zin en kan de pagina laten vastlopen. */
export const MAX_INTERVIEWS = 50;

export function defaultInterviews(type: unknown): number {
  return typeof type === 'string' && type.trim().toUpperCase() === 'B2C' ? 15 : 5;
}

export function requiredInterviews(s: RepoSnapshot): number {
  const fm = frontmatterOf(s, DOELGROEP_PATH);
  const n = fm.interviews_nodig;
  if (typeof n === 'number' && Number.isInteger(n) && n > 0) return Math.min(n, MAX_INTERVIEWS);
  return defaultInterviews(fm.type);
}

export function slugify(text: string): string {
  const slug = text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 40)
    .replace(/^-+|-+$/g, '');
  return slug || 'interview';
}

export function nextInterviewPath(s: RepoSnapshot, rol: string): string {
  // Alleen "01-rol.md" telt; een bestand als "2026-notities.md" is geen interviewnummer.
  const numbers = mdFilesIn(s, INTERVIEWS_DIR)
    .map((path) => path.slice(INTERVIEWS_DIR.length + 1).match(/^(\d{1,3})-/)?.[1])
    .filter((n): n is string => n !== undefined)
    .map(Number);
  const next = (numbers.length > 0 ? Math.max(...numbers) : 0) + 1;
  return `${INTERVIEWS_DIR}/${String(next).padStart(2, '0')}-${slugify(rol)}.md`;
}

export const level2: LevelDef = {
  id: 2,
  name: 'Probleem-validatie',
  summary: 'Bepaal je doelgroep, interview ze echt, en ontdek met je AI welke groep allemaal hetzelfde probleem ervaart. Daarna werk je je canvas bij.',
  milestone: '1. Een eerste doelgroep die allemaal hetzelfde probleem ervaart.',
  doel: 'Je weet wie je eerste klanten zijn en welk probleem ze allemaal hebben, en je interviews bewijzen het.',
  vraag: 'Wie is mijn eerste klant, en welk probleem hebben ze allemaal?',
  begrip: 'Pull request',
  kern: [EERSTE_DOELGROEP_PATH, ANALYSE_PATH],
  ready: true,
  steps: [
    {
      id: 'l2-doelgroep',
      title: 'Bepaal je doelgroep',
      kind: 'form',
      waar: ['platform'],
      fields: [
        { kind: 'textarea', name: 'waarde', label: 'Voor wie creëer je waarde?' },
        { kind: 'textarea', name: 'gebruiker', label: 'Wie gebruikt uiteindelijk je oplossing?' },
        { kind: 'textarea', name: 'betaler', label: 'Wie betaalt jou voor je oplossing?' },
        { kind: 'textarea', name: 'beslisser', label: 'Wie beslist welke oplossing gebruikt wordt?' },
        { kind: 'select', name: 'type', label: 'Verkoop je aan bedrijven of consumenten?', options: [{ value: 'B2B', label: 'Bedrijven (B2B)' }, { value: 'B2C', label: 'Consumenten (B2C)' }] },
        { kind: 'number', name: 'aantal', label: 'Aantal interviews (leeg = 5 bij B2B, 15 bij B2C)', optional: true, max: MAX_INTERVIEWS },
      ],
      toFile: (v) => {
        const type = v.type === 'B2C' ? 'B2C' : 'B2B';
        const n = Number.parseInt(v.aantal, 10);
        const nodig = Number.isInteger(n) && n > 0 ? Math.min(n, MAX_INTERVIEWS) : defaultInterviews(type);
        return {
          path: DOELGROEP_PATH,
          message: 'Doelgroep bepaald',
          content: toMarkdown(
            { type, interviews_nodig: nodig },
            `# Doelgroep\n\n## Voor wie creëer je waarde?\n\n${v.waarde.trim()}\n\n## Wie gebruikt uiteindelijk je oplossing?\n\n${v.gebruiker.trim()}\n\n## Wie betaalt jou voor je oplossing?\n\n${v.betaler.trim()}\n\n## Wie beslist welke oplossing gebruikt wordt?\n\n${v.beslisser.trim()}`,
          ),
        };
      },
    },
    {
      id: 'l2-vragen',
      title: 'Formuleer je interviewvragen',
      kind: 'action',
      waar: ['ai-app'],
      aiPrompt: 'Gebruik skill interviewhulp. Lees level-2-probleemvalidatie/doelgroep.md en help me vraag 5 tot en met 8 in interviewvragen.md te formuleren voor mijn doelgroep.',
    },
    { id: 'l2-interviewen', title: 'Interview je doelgroep', kind: 'action', waar: ['buiten'] },
    {
      id: 'l2-interviews',
      title: 'Zet je interviews in je repo',
      kind: 'voortgang',
      waar: ['ai-app', 'github-desktop'],
      folder: INTERVIEWS_DIR,
      required: requiredInterviews,
      aiPrompt: 'Gebruik skill transcriberen. Zet het nieuwe interview in opnames/ om.',
    },
    {
      id: 'l2-analyse',
      title: 'Analyseer je interviews',
      kind: 'action',
      waar: ['ai-app'],
      aiPrompt:
        'Gebruik skill interview-analyse. Lees alle interviews in level-2-probleemvalidatie/interviews/, vul analyse.md met mij in en schrijf onze conclusie in eerste-doelgroep.md.',
    },
    {
      id: 'l2-canvas',
      title: 'Werk je canvas bij',
      kind: 'action',
      waar: ['ai-app', 'github-desktop', 'github'],
      aiPrompt:
        'Gebruik skill interview-analyse. Zet bij elke regel in level-1-idee/vpc.md en bij elke aanname in aannames.md wat de interviews zeiden: bevestigd, ontkracht of open. Doe dat op een nieuwe branch, zodat ik een pull request kan maken.',
      popup: { label: 'Wat is een pull request?', title: 'Je AI stelt voor, jij beslist', contentId: 'l2-pull-request', plaatje: 'twee-plekken' },
    },
  ],
  checks: [
    fileFilled('doelgroep', 'l2-doelgroep', DOELGROEP_PATH, 'Doelgroep bepaald'),
    fileFilled('vragen', 'l2-vragen', VRAGEN_PATH, 'Interviewvragen klaar'),
    minFilledFiles('interviewen', 'l2-interviewen', INTERVIEWS_DIR, requiredInterviews, 'Interviews gehouden'),
    minFilledFiles('interviews', 'l2-interviews', INTERVIEWS_DIR, requiredInterviews, 'Interviews in je repo'),
    fileFilled('analyse', 'l2-analyse', ANALYSE_PATH, 'Analyse geschreven'),
    frontmatterIs('eerste-doelgroep', 'l2-analyse', EERSTE_DOELGROEP_PATH, 'gevonden', 'ja', 'Eerste doelgroep gevonden'),
    minMergedPullRequests('canvas', 'l2-canvas', 1, 'Pull request gemerged'),
  ],
};
