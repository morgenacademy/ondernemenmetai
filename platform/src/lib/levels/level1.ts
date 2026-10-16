import { toMarkdown } from '../markdown';
import { fileFilled, minListItems } from './checks';
import type { FormValues, LevelDef } from './types';

export const IDEE_PATH = 'level-1-idee/idee.md';
export const VISIE_PATH = 'level-1-idee/visie.md';
export const MADLIB_PATH = 'level-1-idee/madlib.md';
export const AANNAMES_PATH = 'level-1-idee/aannames.md';

export function madlibSentence(v: FormValues): string {
  return `Mijn bedrijf, ${v.naam.trim()}, biedt ${v.aanbod.trim()} voor ${v.doelgroep.trim()} die ${v.probleem.trim()} met ${v.usp.trim()}.`;
}

export function aannamesToMarkdown(text: string): string {
  const lines = text
    .split('\n')
    .map((line) => line.trim().replace(/^[-*]\s*/, ''))
    .filter((line) => line.length > 0)
    .map((line) => (/^\[(wens|haalbaar|rendabel)\]/i.test(line) ? line : `[ongelabeld] ${line}`));
  return `# Aannames\n\n${lines.map((line) => `- ${line}`).join('\n')}`;
}

export const level1: LevelDef = {
  id: 1,
  name: 'Idee',
  summary: 'Zet je idee, je visie en een eerste waardepropositie neer, en markeer wat nog aanname is.',
  milestone: 'Start: jouw idee in één zin, met je aannames op een rij.',
  ready: true,
  steps: [
    {
      id: 'l1-idee',
      title: 'Zet je idee uiteen',
      kind: 'form',
      fields: [
        { kind: 'textarea', name: 'wat', label: 'Wat ga je doen?' },
        { kind: 'textarea', name: 'voorWie', label: 'Voor wie?' },
        { kind: 'textarea', name: 'waaromJij', label: 'Waarom ben jij degene die dit gaat doen?' },
      ],
      toFile: (v) => ({
        path: IDEE_PATH,
        message: 'Idee uiteengezet',
        content: toMarkdown(null, `# Idee\n\n## Wat ga ik doen?\n\n${v.wat.trim()}\n\n## Voor wie?\n\n${v.voorWie.trim()}\n\n## Waarom ik?\n\n${v.waaromJij.trim()}`),
      }),
    },
    {
      id: 'l1-visie',
      title: 'Formuleer je visie',
      kind: 'form',
      fields: [
        { kind: 'textarea', name: 'wereld', label: 'Hoe ziet de wereld eruit als jouw onderneming slaagt?' },
        { kind: 'textarea', name: 'bijdrage', label: 'Wat is jouw bijdrage daaraan?' },
      ],
      toFile: (v) => ({
        path: VISIE_PATH,
        message: 'Visie geformuleerd',
        content: toMarkdown(null, `# Visie\n\n## Hoe ziet de wereld eruit als mijn onderneming slaagt?\n\n${v.wereld.trim()}\n\n## Wat is mijn bijdrage daaraan?\n\n${v.bijdrage.trim()}`),
      }),
    },
    {
      id: 'l1-madlib',
      title: 'Je waardepropositie in één zin',
      kind: 'form',
      fields: [
        { kind: 'text', name: 'naam', label: 'Naam van je bedrijf' },
        { kind: 'text', name: 'aanbod', label: 'Aanbod: wat bied je aan?' },
        { kind: 'text', name: 'doelgroep', label: 'Doelgroep: voor wie precies?' },
        { kind: 'text', name: 'probleem', label: 'Probleem of behoefte van die doelgroep' },
        { kind: 'text', name: 'usp', label: 'USP: wat maakt jou anders?' },
      ],
      toFile: (v) => ({
        path: MADLIB_PATH,
        message: 'Waardepropositie als madlib',
        content: toMarkdown(null, `# Waardepropositie (madlib)\n\n${madlibSentence(v)}`),
      }),
    },
    {
      id: 'l1-aannames',
      title: 'Markeer je aannames',
      kind: 'form',
      fields: [
        {
          kind: 'textarea',
          name: 'aannames',
          label: 'Eén aanname per regel. Begin met [wens], [haalbaar] of [rendabel].',
          placeholder: '[wens] Apotheken willen bezorging uitbesteden',
        },
      ],
      toFile: (v) => ({ path: AANNAMES_PATH, message: 'Aannames gemarkeerd', content: toMarkdown(null, aannamesToMarkdown(v.aannames)) }),
    },
    {
      id: 'l1-toets',
      title: 'Laat je AI je propositie toetsen',
      kind: 'action',
      aiPrompt: 'Gebruik skill propositie-validator. Lees de bestanden in level-1-idee/ en toets mijn waardepropositie kritisch. Stel je vragen één voor één.',
    },
  ],
  checks: [
    fileFilled('idee', 'l1-idee', IDEE_PATH, 'Idee uiteengezet'),
    fileFilled('visie', 'l1-visie', VISIE_PATH, 'Visie geformuleerd'),
    fileFilled('madlib', 'l1-madlib', MADLIB_PATH, 'Waardepropositie in één zin'),
    minListItems('aannames', 'l1-aannames', AANNAMES_PATH, 3, 'Minstens 3 aannames'),
  ],
};
