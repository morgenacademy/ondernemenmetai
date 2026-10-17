import { WERKPLEK_PATH } from '../lib/levels/level0';
import { AANNAMES_PATH, FEEDBACK_PROPOSITIE_PATH, VPC_PATH } from '../lib/levels/level1';
import { filledFilesIn, frontmatterOf, mdFilesIn } from '../lib/levels/checks';
import { level4 } from '../lib/levels/level4';
import { MADLIB_PATH } from '../lib/levels/level1';
import { ANALYSE_PATH, EERSTE_DOELGROEP_PATH, INTERVIEWS_DIR, VRAGEN_PATH, nextInterviewPath, requiredInterviews } from '../lib/levels/level2';
import { MVP_DIR, MVP_PATH, OPLOSSING_PATH, WAARDEPROPOSITIE_PATH } from '../lib/levels/level3';
import { FEEDBACK_DIR, resultaatPath, testkaartPath } from '../lib/levels/level4';
import { AGENTS_PATH, BMC_PATH, OVER_MIJN_ONDERNEMING, PRODUCT_PATH } from '../lib/levels/level5';
import { IMPACT_PATH, VERKOOPAANPAK_PATH } from '../lib/levels/level6';
import { upsertSection } from '../lib/markdown';
import type { MockRepoAdapter } from '../lib/repo/mockRepo';
import { buildSnapshot } from '../lib/repo/snapshot';
import type { RepoSnapshot } from '../lib/repo/types';
import { DEMO_FORMS } from './formulieren';
import {
  VOORBEELD_BMC,
  VOORBEELD_IMPACT,
  VOORBEELD_LANDINGSPAGINA,
  VOORBEELD_LANDINGSPAGINA_V2,
  VOORBEELD_MADLIB_OPLOSSING,
  VOORBEELD_MVP,
  VOORBEELD_OPLOSSING,
  VOORBEELD_OVER_MIJN_ONDERNEMING,
  VOORBEELD_PRODUCT,
  VOORBEELD_VERKOOPAANPAK,
  VOORBEELD_VPC_OPLOSSING,
  VOORBEELD_WAARDEPROPOSITIE,
  voorbeeldResultaat,
  voorbeeldSpiekbriefje,
  voorbeeldTestkaart,
} from './voorbeelden-3-6';
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

async function interviewToevoegen(repo: MockRepoAdapter, s: RepoSnapshot): Promise<void> {
  const path = nextInterviewPath(s, 'apotheker');
  await repo.writeFile(path, voorbeeldInterview(path), `Interview toegevoegd: ${path.split('/').pop()}`);
}

/** Hoeveel mensen in deze ronde ja zeiden, van iedereen met een sectie voor die ronde. */
function telRonde(s: RepoSnapshot, ronde: number): { ja: number; totaal: number } {
  const metRonde = mdFilesIn(s, FEEDBACK_DIR).filter((p) => new RegExp(`^## Ronde ${ronde}\\s*$`, 'm').test(s.files[p]));
  return { ja: metRonde.filter((p) => frontmatterOf(s, p).antwoord === 'ja').length, totaal: metRonde.length };
}

/** Vult voor iedereen in feedback/ het antwoord van de huidige ronde in, zoals het formulier van level 4 dat doet. */
async function rondeInvullen(repo: MockRepoAdapter): Promise<void> {
  const voorstel = level4.steps.find((step) => step.id === 'l4-voorstel');
  if (!voorstel || voorstel.kind !== 'form') return;
  const aantal = mdFilesIn(await buildSnapshot(repo), FEEDBACK_DIR).length;
  for (let i = 0; i < aantal; i++) {
    const s = await buildSnapshot(repo);
    const w = voorstel.toFile(DEMO_FORMS['l4-voorstel'](s), s);
    await repo.writeFile(w.path, w.content, w.message);
  }
}

/** Demo-knoppen voor wat normaal buiten het platform gebeurt (door de AI of op GitHub). */
export const SIMULATIONS: Record<string, Simulation> = {
  'l0-eerste-opdracht': {
    label: 'doet alsof je AI werkplek.md invulde en jij hem pushte',
    run: (repo) => repo.writeFile(WERKPLEK_PATH, VOORBEELD_WERKPLEK, 'Werkplek ingevuld'),
  },
  'l1-propositie': {
    label: 'doet alsof je AI je propositie toetste en je canvas schreef',
    run: async (repo) => {
      await repo.writeFile(FEEDBACK_PROPOSITIE_PATH, VOORBEELD_FEEDBACK_PROPOSITIE, 'Feedback op de waardepropositie');
      await repo.writeFile(VPC_PATH, VOORBEELD_VPC, 'Eerste versie van het canvas');
    },
  },
  'l2-vragen': {
    label: 'doet alsof je AI vraag 5 tot en met 8 invulde',
    run: (repo) => repo.writeFile(VRAGEN_PATH, VOORBEELD_VRAGEN, 'Interviewvragen 5-8 geformuleerd'),
  },
  'l2-interviewen': {
    label: 'doet alsof je al je interviews hield en je AI ze omzette',
    run: async (repo, s) => {
      const tekort = requiredInterviews(s) - filledFilesIn(s, INTERVIEWS_DIR).length;
      for (let i = 0; i < tekort; i++) await interviewToevoegen(repo, await buildSnapshot(repo));
    },
  },
  'l2-interviews': {
    label: 'doet alsof je AI een interview omzette en jij het pushte',
    run: interviewToevoegen,
  },
  'l2-analyse': {
    label: 'doet alsof je AI de analyse en je eerste doelgroep schreef',
    run: async (repo) => {
      await repo.writeFile(ANALYSE_PATH, VOORBEELD_ANALYSE, 'Analyse van de interviews');
      await repo.writeFile(EERSTE_DOELGROEP_PATH, VOORBEELD_EERSTE_DOELGROEP, 'Eerste doelgroep gevonden');
    },
  },
  'l2-canvas': {
    label: 'doet alsof je AI je canvas bijwerkte en jij de pull request mergde',
    run: async (repo) => {
      await repo.writeFile(VPC_PATH, VOORBEELD_VPC_NA_INTERVIEWS, 'Canvas bijgewerkt met de interviews');
      await repo.writeFile(AANNAMES_PATH, VOORBEELD_AANNAMES_NA_INTERVIEWS, 'Aannames getoetst aan de interviews');
      await repo.mergePullRequest();
    },
  },
  'l3-kiezen': {
    label: 'doet alsof je AI je ideeën aanvulde en jij er één koos',
    run: (repo) => repo.writeFile(OPLOSSING_PATH, VOORBEELD_OPLOSSING, 'Oplossing gekozen: spoedbezorging per bakfiets'),
  },
  'l3-verwoorden': {
    label: 'doet alsof je AI je oplossing verwoordde en jij de pull request mergde',
    run: async (repo) => {
      await repo.writeFile(WAARDEPROPOSITIE_PATH, VOORBEELD_WAARDEPROPOSITIE, 'Waardepropositie voor de gekozen oplossing');
      await repo.writeFile(MADLIB_PATH, VOORBEELD_MADLIB_OPLOSSING, 'Madlib voor de gekozen oplossing');
      await repo.writeFile(VPC_PATH, VOORBEELD_VPC_OPLOSSING, 'Aanbodkant van het canvas voor de gekozen oplossing');
      await repo.mergePullRequest();
    },
  },
  'l3-mvp-kiezen': {
    label: 'doet alsof je AI met je je MVP koos',
    run: (repo) => repo.writeFile(MVP_PATH, VOORBEELD_MVP, 'MVP gekozen: concierge-MVP met landingspagina'),
  },
  'l3-bouwen': {
    label: 'doet alsof je AI je landingspagina bouwde en jij hem pushte',
    run: (repo) => repo.writeFile(`${MVP_DIR}/landingspagina.html`, VOORBEELD_LANDINGSPAGINA, 'MVP: landingspagina'),
  },
  'l4-testkaart': {
    label: 'doet alsof je AI met je de testkaart van ronde 1 maakte',
    run: (repo) => repo.writeFile(testkaartPath(1), voorbeeldTestkaart(1), 'Testkaart ronde 1'),
  },
  'l4-terugbellen': {
    label: 'doet alsof je AI per persoon een spiekbriefje schreef',
    run: async (repo, s) => {
      const terugbellen = mdFilesIn(s, INTERVIEWS_DIR)
        .filter((p) => frontmatterOf(s, p).terugbellen !== 'nee')
        .map((p) => p.slice(INTERVIEWS_DIR.length + 1, -3));
      const mensen = terugbellen.length > 0 ? terugbellen : ['01-apotheker', '02-apotheker', '03-apotheker'];
      for (const persoon of mensen) {
        const path = `${FEEDBACK_DIR}/${persoon}.md`;
        if (s.files[path] === undefined) await repo.writeFile(path, voorbeeldSpiekbriefje(persoon), `Spiekbriefje ${persoon}`);
      }
    },
  },
  'l4-resultaat': {
    label: 'doet alsof je AI met je ronde 1 las',
    run: async (repo, s) => {
      const { ja, totaal } = telRonde(s, 1);
      await repo.writeFile(resultaatPath(1), voorbeeldResultaat(1, ja, totaal), 'Resultaatkaart ronde 1');
    },
  },
  'l5-doorontwikkelen': {
    label: 'doet alsof je AI je MVP verbeterde en jij de pull request mergde',
    run: async (repo) => {
      await repo.writeFile(`${MVP_DIR}/landingspagina.html`, VOORBEELD_LANDINGSPAGINA_V2, 'MVP: eerste maand gratis en koelbox');
      await repo.writeFile(PRODUCT_PATH, VOORBEELD_PRODUCT, 'Product na ronde 1');
      await repo.mergePullRequest();
    },
  },
  'l5-terug': {
    label: 'doet alsof je ronde 2 deed: testkaart, gesprekken en resultaatkaart',
    run: async (repo) => {
      await repo.writeFile(testkaartPath(2), voorbeeldTestkaart(2), 'Testkaart ronde 2');
      await rondeInvullen(repo);
      const { ja, totaal } = telRonde(await buildSnapshot(repo), 2);
      await repo.writeFile(resultaatPath(2), voorbeeldResultaat(2, ja, totaal), 'Resultaatkaart ronde 2');
    },
  },
  'l5-bmc': {
    label: 'doet alsof je AI met je je Business Model Canvas invulde',
    run: (repo) => repo.writeFile(BMC_PATH, VOORBEELD_BMC, 'Business Model Canvas'),
  },
  'l5-agents': {
    label: 'doet alsof je AI je onderneming in AGENTS.md beschreef en jij de pull request mergde',
    run: async (repo, s) => {
      await repo.writeFile(AGENTS_PATH, upsertSection(s.files[AGENTS_PATH] ?? '# Instructies voor je AI\n', OVER_MIJN_ONDERNEMING, VOORBEELD_OVER_MIJN_ONDERNEMING), 'AGENTS.md: over mijn onderneming');
      await repo.mergePullRequest();
    },
  },
  'l6-verkoopaanpak': {
    label: 'doet alsof je AI je verkoopaanpak als skill schreef en jij de pull request mergde',
    run: async (repo) => {
      await repo.writeFile(VERKOOPAANPAK_PATH, VOORBEELD_VERKOOPAANPAK, 'Eigen skill: verkoopaanpak');
      await repo.mergePullRequest();
    },
  },
  'l6-impact': {
    label: 'doet alsof je AI met je de impact scan deed',
    run: (repo) => repo.writeFile(IMPACT_PATH, VOORBEELD_IMPACT, 'Impact zichtbaar'),
  },
};
