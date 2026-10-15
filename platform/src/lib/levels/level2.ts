import { toMarkdown } from '../markdown';
import type { RepoSnapshot } from '../repo/types';
import { fileFilled, frontmatterOf, mdFilesIn, minFilledFiles } from './checks';
import type { FileWrite, LevelDef } from './types';

export const DOELGROEP_PATH = 'level-2-probleemvalidatie/doelgroep.md';
export const VRAGEN_PATH = 'level-2-probleemvalidatie/interviewvragen.md';
export const ANALYSE_PATH = 'level-2-probleemvalidatie/analyse.md';
export const INTERVIEWS_DIR = 'level-2-probleemvalidatie/interviews';

export function defaultInterviews(type: unknown): number {
  return type === 'B2C' ? 15 : 5;
}

export function requiredInterviews(s: RepoSnapshot): number {
  const fm = frontmatterOf(s, DOELGROEP_PATH);
  const n = fm.interviews_nodig;
  if (typeof n === 'number' && Number.isInteger(n) && n > 0) return n;
  return defaultInterviews(fm.type);
}

export function slugify(text: string): string {
  const slug = text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  return slug || 'interview';
}

export function nextTranscriptPath(s: RepoSnapshot, rol: string): string {
  const numbers = mdFilesIn(s, INTERVIEWS_DIR)
    .map((path) => Number.parseInt(path.slice(INTERVIEWS_DIR.length + 1), 10))
    .filter((n) => !Number.isNaN(n));
  const next = (numbers.length > 0 ? Math.max(...numbers) : 0) + 1;
  return `${INTERVIEWS_DIR}/${String(next).padStart(2, '0')}-${slugify(rol)}.md`;
}

export function isTranscriptFileName(name: string): boolean {
  const lower = name.toLowerCase();
  return lower.endsWith('.md') || lower.endsWith('.txt');
}

export function transcriptFromUpload(fileName: string, text: string, rol: string, s: RepoSnapshot): FileWrite | { error: string } {
  if (!isTranscriptFileName(fileName)) {
    return { error: 'Alleen .md- of .txt-bestanden. Audio of Word? Zet het eerst om met skill transcriberen.' };
  }
  if (text.trim().length === 0) return { error: 'Dit bestand is leeg.' };
  const path = nextTranscriptPath(s, rol);
  const label = rol.trim() || 'onbekend';
  const content = fileName.toLowerCase().endsWith('.md') ? text : toMarkdown({ rol: label }, `# Interview: ${label}\n\n${text.trim()}`);
  return { path, content, message: `Transcript toegevoegd: ${path.split('/').pop()}` };
}

export const level2: LevelDef = {
  id: 2,
  name: 'Probleem-validatie',
  summary: 'Bepaal je doelgroep, interview ze echt, en ontdek of ze hetzelfde probleem ervaren.',
  milestone: '1. Een eerste doelgroep die allemaal hetzelfde probleem ervaart.',
  ready: true,
  steps: [
    {
      id: 'l2-doelgroep',
      title: 'Bepaal je doelgroep',
      kind: 'form',
      fields: [
        { kind: 'textarea', name: 'waarde', label: 'Voor wie creëer je waarde?' },
        { kind: 'textarea', name: 'gebruiker', label: 'Wie gebruikt uiteindelijk je oplossing?' },
        { kind: 'textarea', name: 'betaler', label: 'Wie betaalt jou voor je oplossing?' },
        { kind: 'textarea', name: 'beslisser', label: 'Wie beslist welke oplossing gebruikt wordt?' },
        { kind: 'select', name: 'type', label: 'Verkoop je aan bedrijven of consumenten?', options: [{ value: 'B2B', label: 'Bedrijven (B2B)' }, { value: 'B2C', label: 'Consumenten (B2C)' }] },
        { kind: 'number', name: 'aantal', label: 'Aantal interviews (leeg = 5 bij B2B, 15 bij B2C)', optional: true },
      ],
      toFile: (v) => {
        const type = v.type === 'B2C' ? 'B2C' : 'B2B';
        const n = Number.parseInt(v.aantal, 10);
        const nodig = Number.isInteger(n) && n > 0 ? n : defaultInterviews(type);
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
      aiPrompt: 'Gebruik skill interviewhulp. Lees level-2-probleemvalidatie/doelgroep.md en help me vraag 5 tot en met 8 in interviewvragen.md te formuleren voor mijn doelgroep.',
    },
    { id: 'l2-interviewen', title: 'Interview je doelgroep', kind: 'action' },
    {
      id: 'l2-transcripts',
      title: 'Zet je transcripts in je repo',
      kind: 'uploads',
      folder: INTERVIEWS_DIR,
      required: requiredInterviews,
      aiPrompt: 'Gebruik skill transcriberen. Zet het transcript dat ik je geef om naar een interviewbestand in level-2-probleemvalidatie/interviews/.',
    },
    {
      id: 'l2-analyse',
      title: 'Analyseer je interviews',
      kind: 'action',
      aiPrompt: 'Gebruik skill interview-analyse. Lees alle interviews in level-2-probleemvalidatie/interviews/ en vul analyse.md met mij in.',
    },
  ],
  checks: [
    fileFilled('doelgroep', 'l2-doelgroep', DOELGROEP_PATH, 'Doelgroep bepaald'),
    fileFilled('vragen', 'l2-vragen', VRAGEN_PATH, 'Interviewvragen klaar'),
    minFilledFiles('transcripts', 'l2-transcripts', INTERVIEWS_DIR, requiredInterviews, 'Transcripts in je repo'),
    fileFilled('analyse', 'l2-analyse', ANALYSE_PATH, 'Analyse geschreven'),
  ],
};
