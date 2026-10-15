import { WERKPLEK_PATH } from '../lib/levels/level0';
import { ANALYSE_PATH, VRAGEN_PATH, nextTranscriptPath } from '../lib/levels/level2';
import type { MockRepoAdapter } from '../lib/repo/mockRepo';
import type { RepoSnapshot } from '../lib/repo/types';
import { VOORBEELD_ANALYSE, VOORBEELD_VRAGEN, VOORBEELD_WERKPLEK, voorbeeldTranscript } from './voorbeelden';

export type Simulation = { label: string; run: (repo: MockRepoAdapter, s: RepoSnapshot) => Promise<void> };

/** Demo-knoppen voor wat normaal buiten het platform gebeurt (door de AI of op GitHub). */
export const SIMULATIONS: Record<string, Simulation> = {
  'l0-git': {
    label: 'doe alsof je AI de pull request maakte en jij hem mergde',
    run: async (repo) => {
      await repo.writeFile(WERKPLEK_PATH, VOORBEELD_WERKPLEK, 'werkplek.md ingevuld (branch werkplek)');
      await repo.mergePullRequest();
    },
  },
  'l2-vragen': {
    label: 'doe alsof je AI vraag 5 tot en met 8 invulde',
    run: (repo) => repo.writeFile(VRAGEN_PATH, VOORBEELD_VRAGEN, 'Interviewvragen 5-8 geformuleerd'),
  },
  'l2-transcripts': {
    label: 'doe alsof je AI een transcript toevoegde',
    run: async (repo, s) => {
      const path = nextTranscriptPath(s, 'apotheker');
      await repo.writeFile(path, voorbeeldTranscript(path), `Transcript toegevoegd: ${path.split('/').pop()}`);
    },
  },
  'l2-analyse': {
    label: 'doe alsof je AI de analyse schreef',
    run: (repo) => repo.writeFile(ANALYSE_PATH, VOORBEELD_ANALYSE, 'Analyse van de interviews'),
  },
};
