import { WERKPLEK_PATH } from '../lib/levels/level0';
import { AANNAMES_PATH, FEEDBACK_PROPOSITIE_PATH, VPC_PATH } from '../lib/levels/level1';
import { ANALYSE_PATH, EERSTE_DOELGROEP_PATH, VRAGEN_PATH, nextInterviewPath } from '../lib/levels/level2';
import type { MockRepoAdapter } from '../lib/repo/mockRepo';
import type { RepoSnapshot } from '../lib/repo/types';
import {
  VOORBEELD_AANNAMES_NA_INTERVIEWS,
  VOORBEELD_ANALYSE,
  VOORBEELD_EERSTE_DOELGROEP,
  VOORBEELD_FEEDBACK_PROPOSITIE,
  VOORBEELD_VPC,
  VOORBEELD_VPC_NA_INTERVIEWS,
  VOORBEELD_VRAGEN,
  VOORBEELD_WERKPLEK,
  voorbeeldInterview,
} from './voorbeelden';

export type Simulation = { label: string; run: (repo: MockRepoAdapter, s: RepoSnapshot) => Promise<void> };

/** Demo-knoppen voor wat normaal buiten het platform gebeurt (door de AI of op GitHub). */
export const SIMULATIONS: Record<string, Simulation> = {
  'l0-eerste-opdracht': {
    label: 'doe alsof je AI werkplek.md invulde en jij hem pushte',
    run: (repo) => repo.writeFile(WERKPLEK_PATH, VOORBEELD_WERKPLEK, 'Werkplek ingevuld'),
  },
  'l1-propositie': {
    label: 'doe alsof je AI je propositie toetste en je canvas schreef',
    run: async (repo) => {
      await repo.writeFile(FEEDBACK_PROPOSITIE_PATH, VOORBEELD_FEEDBACK_PROPOSITIE, 'Feedback op de waardepropositie');
      await repo.writeFile(VPC_PATH, VOORBEELD_VPC, 'Eerste versie van het canvas');
    },
  },
  'l2-vragen': {
    label: 'doe alsof je AI vraag 5 tot en met 8 invulde',
    run: (repo) => repo.writeFile(VRAGEN_PATH, VOORBEELD_VRAGEN, 'Interviewvragen 5-8 geformuleerd'),
  },
  'l2-interviews': {
    label: 'doe alsof je AI een interview omzette en jij het pushte',
    run: async (repo, s) => {
      const path = nextInterviewPath(s, 'apotheker');
      await repo.writeFile(path, voorbeeldInterview(path), `Interview toegevoegd: ${path.split('/').pop()}`);
    },
  },
  'l2-analyse': {
    label: 'doe alsof je AI de analyse en je eerste doelgroep schreef',
    run: async (repo) => {
      await repo.writeFile(ANALYSE_PATH, VOORBEELD_ANALYSE, 'Analyse van de interviews');
      await repo.writeFile(EERSTE_DOELGROEP_PATH, VOORBEELD_EERSTE_DOELGROEP, 'Eerste doelgroep gevonden');
    },
  },
  'l2-canvas': {
    label: 'doe alsof je AI je canvas bijwerkte en jij de pull request mergde',
    run: async (repo) => {
      await repo.writeFile(VPC_PATH, VOORBEELD_VPC_NA_INTERVIEWS, 'Canvas bijgewerkt met de interviews');
      await repo.writeFile(AANNAMES_PATH, VOORBEELD_AANNAMES_NA_INTERVIEWS, 'Aannames getoetst aan de interviews');
      await repo.mergePullRequest();
    },
  },
};
