import { toMarkdown } from '../markdown';
import { fileFilled } from './checks';
import type { LevelDef } from './types';

export const SETUP_PATH = 'level-0-werkplek/setup.md';
export const WERKPLEK_PATH = 'level-0-werkplek/werkplek.md';

export const OS_OPTIONS = [{ value: 'mac', label: 'Mac' }, { value: 'windows', label: 'Windows' }];
/** De waarde is de AI-tool (voor de varianten in de uitleg); het label is het abonnement waar die bij hoort. */
export const AI_OPTIONS = [{ value: 'claude-code', label: 'Claude (Pro of hoger)' }, { value: 'codex', label: 'ChatGPT (Plus of hoger)' }];

export type Download = { ai: string; name: string; url: string; account: string; steps: string[] };
export const DOWNLOADS: Download[] = [
  {
    ai: 'claude-code',
    name: 'Claude Code',
    url: 'https://claude.com/product/claude-code',
    account: 'Claude',
    steps: ['Download de app en installeer hem.', 'Log in met je Claude-account.', 'Open het tabblad Code.'],
  },
  {
    ai: 'codex',
    name: 'Codex',
    url: 'https://openai.com/codex',
    account: 'ChatGPT',
    steps: ['Download de app en installeer hem.', 'Log in met je ChatGPT-account.'],
  },
];

export const level0: LevelDef = {
  id: 0,
  name: 'Werkplek',
  summary: 'Richt je werkplek in: je AI-app, GitHub, je eigen repo en GitHub Desktop.',
  milestone: 'Je AI werkt in je eigen repo en je eerste wijziging staat online.',
  doel: 'Je AI werkt in je eigen repo en je eerste wijziging staat online.',
  begrip: 'Commit en push',
  kern: [SETUP_PATH, WERKPLEK_PATH],
  ready: true,
  steps: [
    { id: 'l0-account', title: 'Maak een GitHub-account', kind: 'action', waar: ['github'] },
    {
      id: 'l0-repo',
      title: 'Maak je repo',
      kind: 'action',
      waar: ['github'],
      popup: { label: 'Waarom een repo en geen gedeelde map?', title: 'Wat een gedeelde map niet kan', contentId: 'l0-repo-waarom' },
    },
    { id: 'l0-koppelen', title: 'Koppel Ondernemen met AI aan je repo', kind: 'action', waar: ['platform', 'github'] },
    {
      id: 'l0-setup',
      title: 'Kies je setup',
      kind: 'form',
      waar: ['platform'],
      fields: [
        { kind: 'select', name: 'os', label: 'Mijn computer', options: OS_OPTIONS, knoppen: true },
        { kind: 'select', name: 'ai', label: 'Waar heb je een abonnement?', options: AI_OPTIONS, knoppen: true },
      ],
      toFile: (v) => ({
        path: SETUP_PATH,
        message: 'Setup gekozen',
        content: toMarkdown(
          { os: v.os, ai: v.ai },
          `# Mijn setup\n\nComputer: ${v.os === 'windows' ? 'Windows' : 'Mac'}\nAI-tool: ${v.ai === 'codex' ? 'Codex (bij ChatGPT)' : 'Claude Code (bij Claude)'}`,
        ),
      }),
    },
    { id: 'l0-download', title: 'Download je AI-app', kind: 'download', waar: ['platform', 'ai-app'] },
    { id: 'l0-github-desktop', title: 'Installeer GitHub Desktop', kind: 'action', waar: ['github-desktop'] },
    {
      id: 'l0-clonen',
      title: 'Zet je repo op je computer en open hem in je AI',
      kind: 'action',
      waar: ['github-desktop', 'ai-app'],
      aiPrompt: 'Lees AGENTS.md en vertel me in drie zinnen wat je in deze repo voor me gaat doen.',
    },
    {
      id: 'l0-eerste-opdracht',
      title: 'Je eerste opdracht',
      kind: 'action',
      waar: ['ai-app', 'github-desktop'],
      aiPrompt:
        'Vul level-0-werkplek/werkplek.md samen met mij in: vraag me per regel wat ik wil invullen, en haal daarna de markering bovenaan weg. Leg de wijziging niet zelf vast; dat doe ik in GitHub Desktop.',
    },
  ],
  checks: [
    fileFilled('setup', 'l0-setup', SETUP_PATH, 'Setup gekozen'),
    fileFilled('werkplek', 'l0-eerste-opdracht', WERKPLEK_PATH, 'werkplek.md ingevuld'),
  ],
};
