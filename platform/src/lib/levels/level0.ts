import { toMarkdown } from '../markdown';
import { fileFilled, minMergedPullRequests } from './checks';
import type { LevelDef } from './types';

export const SETUP_PATH = 'level-0-werkplek/setup.md';
export const WERKPLEK_PATH = 'level-0-werkplek/werkplek.md';

export const level0: LevelDef = {
  id: 0,
  name: 'Werkplek',
  summary: 'Richt je werkplek in: GitHub, je eigen repo, je AI-tool en git.',
  milestone: 'Je AI werkt in je eigen repo en je hebt je eerste pull request gemerged.',
  ready: true,
  steps: [
    {
      id: 'l0-setup',
      title: 'Kies je setup',
      kind: 'form',
      fields: [
        { kind: 'select', name: 'os', label: 'Mijn computer', options: [{ value: 'mac', label: 'Mac' }, { value: 'windows', label: 'Windows' }] },
        { kind: 'select', name: 'ai', label: 'Mijn AI-tool', options: [{ value: 'claude-code', label: 'Claude Code' }, { value: 'codex', label: 'Codex' }] },
      ],
      toFile: (v) => ({
        path: SETUP_PATH,
        message: 'Setup gekozen',
        content: toMarkdown(
          { os: v.os, ai: v.ai },
          `# Mijn setup\n\nComputer: ${v.os === 'windows' ? 'Windows' : 'Mac'}\nAI-tool: ${v.ai === 'codex' ? 'Codex' : 'Claude Code'}`,
        ),
      }),
    },
    { id: 'l0-account', title: 'Maak een GitHub-account', kind: 'action' },
    { id: 'l0-repo', title: 'Maak je repo', kind: 'action' },
    { id: 'l0-koppelen', title: 'Koppel het platform aan je repo', kind: 'action' },
    { id: 'l0-installeren', title: 'Installeer git en je AI-tool', kind: 'action' },
    {
      id: 'l0-clonen',
      title: 'Clone je repo en open hem in je AI',
      kind: 'action',
      aiPrompt: 'Lees AGENTS.md en vertel me in drie zinnen wat je in deze repo voor me gaat doen.',
    },
    {
      id: 'l0-git',
      title: 'Git-basics: je eerste pull request',
      kind: 'action',
      aiPrompt:
        'Maak een branch "werkplek". Vul level-0-werkplek/werkplek.md samen met mij in: vraag me per regel wat ik wil invullen, en haal daarna de markering bovenaan weg. Commit, push en open een pull request. Leg me daarna uit hoe ik hem op GitHub merge.',
    },
  ],
  checks: [
    fileFilled('setup', 'l0-setup', SETUP_PATH, 'Setup gekozen'),
    fileFilled('werkplek', 'l0-git', WERKPLEK_PATH, 'werkplek.md ingevuld'),
    minMergedPullRequests('pr', 'l0-git', 1, 'Eerste pull request gemerged'),
  ],
};
