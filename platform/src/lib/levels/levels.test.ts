import { describe, expect, it } from 'vitest';
import { MARKER, parseMarkdown, toMarkdown } from '../markdown';
import { starterFiles } from '../repo/starterFiles';
import type { RepoSnapshot } from '../repo/types';
import { evaluateLevel, levelStatus } from './evaluate';
import { LEVELS } from './index';
import { SETUP_PATH, WERKPLEK_PATH, level0 } from './level0';
import {
  AANNAMES_PATH,
  FEEDBACK_PROPOSITIE_PATH,
  IDEE_PATH,
  MADLIB_PATH,
  VISIE_PATH,
  VPC_PATH,
  aannamesToMarkdown,
  level1,
  madlibSentence,
} from './level1';
import { ANALYSE_PATH, DOELGROEP_PATH, EERSTE_DOELGROEP_PATH, INTERVIEWS_DIR, VRAGEN_PATH, level2, nextInterviewPath, requiredInterviews, slugify } from './level2';
import { level6 } from './level6';
import type { FormStep, LevelDef, Step } from './types';

const snap = (files: Record<string, string>, mergedPullRequests = 0): RepoSnapshot => ({
  files: { ...starterFiles, ...files },
  mergedPullRequests,
});

const stepOf = (level: LevelDef, id: string): Step => {
  const step = level.steps.find((s) => s.id === id);
  if (!step) throw new Error(`geen stap ${id}`);
  return step;
};

const formStep = (level: LevelDef, id: string): FormStep => {
  const step = level.steps.find((s) => s.id === id);
  if (!step || step.kind !== 'form') throw new Error(`geen formulierstap ${id}`);
  return step;
};

const LEVEL0_DONE = {
  [SETUP_PATH]: toMarkdown({ os: 'mac', ai: 'codex' }, '# Mijn setup\n\nMac, Codex'),
  [WERKPLEK_PATH]: '# Mijn werkplek\n\nIngevuld.\n',
};
const LEVEL1_DONE = {
  [IDEE_PATH]: '# Idee\n\nBakfietskoerier.\n',
  [VISIE_PATH]: '# Visie\n\nSchone binnenstad.\n',
  [MADLIB_PATH]: '# Madlib\n\nMijn bedrijf, Trapzorg, biedt ...\n',
  [AANNAMES_PATH]: '# Aannames\n\n- [wens] a\n- [haalbaar] b\n- [rendabel] c\n',
  [FEEDBACK_PROPOSITIE_PATH]: '# Feedback op je propositie\n\n- Maak je doelgroep kleiner.\n',
  [VPC_PATH]: '# Value Proposition Canvas\n\n## Jobs\n\n- Medicijnen op tijd bij patiënten krijgen (aanname)\n',
};
const doelgroep = (type: string, nodig?: unknown) =>
  toMarkdown({ type, ...(nodig === undefined ? {} : { interviews_nodig: nodig }) }, '# Doelgroep\n\nApothekers.');
const interviews = (n: number) =>
  Object.fromEntries(
    Array.from({ length: n }, (_, i) => [
      `${INTERVIEWS_DIR}/${String(i + 1).padStart(2, '0')}-apotheker.md`,
      `# Interview ${i + 1}\n\nInhoud.\n`,
    ]),
  );
const eersteDoelgroep = (gevonden: string) =>
  toMarkdown({ gevonden, doelgroep: 'zelfstandige apotheken', probleem: 'spoedbezorging rond het middaguur' }, '# Eerste doelgroep\n\n5 van de 5 noemen het.');
const level2Done = (n: number, type = 'B2B') => ({
  [DOELGROEP_PATH]: doelgroep(type),
  [VRAGEN_PATH]: '# Vragen\n\n5. Wat doet u op een gewone dag?\n',
  ...interviews(n),
  [ANALYSE_PATH]: '# Analyse\n\nInzicht.\n',
  [EERSTE_DOELGROEP_PATH]: eersteDoelgroep('ja'),
});
/** Level 2 telt pas na een gemergde pull request (stap "Werk je canvas bij"). */
const PR = 1;

describe('levelStatus', () => {
  it('bij de start is alleen level 0 actief', () => {
    expect(levelStatus(LEVELS, snap({}))).toEqual({ 0: 'active', 1: 'locked', 2: 'locked', 3: 'locked', 4: 'locked', 5: 'locked', 6: 'locked' });
  });

  it('levels gaan op volgorde open', () => {
    expect(levelStatus(LEVELS, snap(LEVEL1_DONE))[1]).toBe('locked');
  });

  it('na level 0 t/m 2 is level 3 actief', () => {
    expect(levelStatus(LEVELS, snap({ ...LEVEL0_DONE, ...LEVEL1_DONE, ...level2Done(5) }, 1))).toEqual({
      0: 'done', 1: 'done', 2: 'done', 3: 'active', 4: 'locked', 5: 'locked', 6: 'locked',
    });
  });
});

describe('level 0', () => {
  it('loopt van setup via de AI-app en GitHub Desktop naar je eerste opdracht', () => {
    expect(level0.steps.map((s) => s.id)).toEqual([
      'l0-setup',
      'l0-download',
      'l0-account',
      'l0-github-desktop',
      'l0-repo',
      'l0-koppelen',
      'l0-clonen',
      'l0-eerste-opdracht',
    ]);
  });

  it('is af zodra setup en werkplek.md zijn ingevuld, zonder pull request', () => {
    expect(evaluateLevel(level0, snap(LEVEL0_DONE, 0)).done).toBe(true);
    expect(evaluateLevel(level0, snap({ [SETUP_PATH]: LEVEL0_DONE[SETUP_PATH] }, 0)).done).toBe(false);
    expect(level0.checks.map((c) => c.stepId)).toEqual(['l0-setup', 'l0-eerste-opdracht']);
  });

  it('heeft als mijlpaal dat je eerste wijziging online staat', () => {
    expect(level0.milestone).toBe('Je AI werkt in je eigen repo en je eerste wijziging staat online.');
  });

  it('setup vraagt waar je een abonnement hebt en bewaart de AI-tool', () => {
    const ai = formStep(level0, 'l0-setup').fields.find((f) => f.name === 'ai');
    expect(ai?.label).toBe('Waar heb je een abonnement?');
    expect(ai?.kind === 'select' && ai.options).toEqual([
      { value: 'claude-code', label: 'Claude (Pro of hoger)' },
      { value: 'codex', label: 'ChatGPT (Plus of hoger)' },
    ]);
  });

  it('de downloadstap en de repo-uitleg hebben hun eigen onderdelen', () => {
    expect(level0.steps.find((s) => s.id === 'l0-download')?.kind).toBe('download');
    expect(level0.steps.find((s) => s.id === 'l0-repo')?.popup?.label).toBe('Waarom een repo en geen gedeelde map?');
  });

  it('de AI-opdrachten gaan niet meer over branches of pull requests', () => {
    expect(level0.steps.find((s) => s.id === 'l0-clonen')?.aiPrompt).toMatch(/^Lees AGENTS\.md/);
    const opdracht = level0.steps.find((s) => s.id === 'l0-eerste-opdracht')?.aiPrompt ?? '';
    expect(opdracht).toContain('level-0-werkplek/werkplek.md');
    expect(opdracht).not.toMatch(/branch|pull request/i);
  });

  it('setup-formulier schrijft frontmatter', () => {
    const write = formStep(level0, 'l0-setup').toFile({ os: 'windows', ai: 'codex' }, snap({}));
    expect(write.path).toBe(SETUP_PATH);
    expect(parseMarkdown(write.content).frontmatter).toEqual({ os: 'windows', ai: 'codex' });
  });
});

describe('level 1', () => {
  it('begint met een vrije kaart "Nog geen idee?" en eindigt met je eerste waardepropositie als stap 5', () => {
    expect(level1.steps.map((s) => s.id)).toEqual(['l1-ideeen', 'l1-idee', 'l1-visie', 'l1-madlib', 'l1-aannames', 'l1-propositie']);
    const ideeen = stepOf(level1, 'l1-ideeen');
    expect(ideeen.optional).toBe(true);
    expect(ideeen.title).toBe('Nog geen idee?');
    expect(ideeen.aiPrompt).toContain('idee-generator');
    expect(level1.steps.filter((s) => !s.optional).at(-1)?.title).toBe('Maak de eerste versie van je waardepropositie');
    expect(stepOf(level1, 'l1-madlib').title).toBe('Je idee in één zin');
  });

  it('stap 5 laat je AI de propositie toetsen en het canvas schrijven', () => {
    const prompt = stepOf(level1, 'l1-propositie').aiPrompt ?? '';
    expect(prompt).toContain('propositie-validator');
    expect(prompt).toContain('feedback-propositie.md');
    expect(prompt).toContain('vpc.md');
  });

  it('stap 5 legt in een pop-up uit wat je AI ophaalde, met het plaatje van de twee plekken', () => {
    expect(stepOf(level1, 'l1-propositie').popup).toEqual({
      label: 'Wat haalde mijn AI op?',
      title: 'Je repo staat op twee plekken',
      contentId: 'l1-ophalen',
      plaatje: 'twee-plekken',
    });
  });

  it('stap 5 is pas af met een ingevuld canvas en de feedback op je propositie', () => {
    const checks = level1.checks.filter((c) => c.stepId === 'l1-propositie').map((c) => c.id);
    expect(checks).toEqual(['vpc', 'feedback-propositie']);
    expect(evaluateLevel(level1, snap({ ...LEVEL1_DONE, [VPC_PATH]: starterFiles[VPC_PATH] })).done).toBe(false);
    const { [FEEDBACK_PROPOSITIE_PATH]: _weg, ...zonderFeedback } = LEVEL1_DONE;
    expect(evaluateLevel(level1, { files: { ...starterFiles, ...zonderFeedback }, mergedPullRequests: 0 }).done).toBe(false);
  });

  it('templates met de markering tellen niet', () => {
    const evaluation = evaluateLevel(level1, snap({}));
    expect(evaluation.done).toBe(false);
    expect(evaluation.results.find((r) => r.id === 'idee')?.reason).toBe('level-1-idee/idee.md is nog niet ingevuld');
  });

  it('het aannames-template telt als nul aannames', () => {
    expect(evaluateLevel(level1, snap({})).results.find((r) => r.id === 'aannames')?.reason).toBe('level-1-idee/aannames.md is nog niet ingevuld');
  });

  it('aannames tellen niet zolang de markering erin staat', () => {
    const files = { ...LEVEL1_DONE, [AANNAMES_PATH]: `${MARKER}\n# Aannames\n\n- [wens] a\n- [haalbaar] b\n- [rendabel] c\n` };
    expect(evaluateLevel(level1, snap(files)).done).toBe(false);
  });

  it('een label zonder tekst is geen aanname', () => {
    const files = { ...LEVEL1_DONE, [AANNAMES_PATH]: '# Aannames\n\n- [wens]\n- [haalbaar] b\n- [rendabel] c\n' };
    expect(evaluateLevel(level1, snap(files)).results.find((r) => r.id === 'aannames')?.reason).toBe('2 van de 3');
  });

  it('is af met alle bestanden, drie aannames, je canvas en de feedback op je propositie', () => {
    expect(evaluateLevel(level1, snap(LEVEL1_DONE)).done).toBe(true);
  });

  it('madlibSentence maakt één zin', () => {
    expect(madlibSentence({ naam: 'Trapzorg', aanbod: 'bezorging per bakfiets', doelgroep: 'apotheken in Breda', probleem: 'medicijnen niet op tijd bezorgd krijgen', usp: 'vaste koeriers ' })).toBe(
      'Mijn bedrijf, Trapzorg, biedt bezorging per bakfiets voor apotheken in Breda die medicijnen niet op tijd bezorgd krijgen met vaste koeriers.',
    );
  });

  it('aannamesToMarkdown maakt een lijst en labelt ongelabelde regels', () => {
    expect(aannamesToMarkdown('[wens] Apotheken willen dit\n\n- Een bakfiets haalt 20 adressen\n')).toBe(
      '# Aannames\n\n- [wens] Apotheken willen dit\n- [ongelabeld] Een bakfiets haalt 20 adressen',
    );
  });
});

describe('level 2', () => {
  it('loopt van doelgroep via interviews en analyse naar het bijwerken van je canvas', () => {
    expect(level2.steps.map((s) => s.id)).toEqual(['l2-doelgroep', 'l2-vragen', 'l2-interviewen', 'l2-interviews', 'l2-analyse', 'l2-canvas']);
    expect(stepOf(level2, 'l2-interviews').title).toBe('Zet je interviews in je repo');
    expect(stepOf(level2, 'l2-canvas').title).toBe('Werk je canvas bij');
  });

  it('de interviewvakken zijn voortgang zonder upload, met een opdracht voor skill transcriberen', () => {
    const step = stepOf(level2, 'l2-interviews');
    expect(step.kind).toBe('voortgang');
    expect(step.aiPrompt).toMatch(/^Gebruik skill transcriberen\./);
    expect(step.aiPrompt).toContain('opnames/');
  });

  it('interviewen telt via de interviews die in je repo staan', () => {
    const interviewen = evaluateLevel(level2, snap(level2Done(3), PR)).results.filter((r) => r.stepId === 'l2-interviewen');
    expect(interviewen.map((r) => [r.ok, r.reason])).toEqual([[false, '3 van de 5']]);
  });

  it('4 van de 5 interviews is niet genoeg, 5 wel', () => {
    expect(evaluateLevel(level2, snap(level2Done(4), PR)).done).toBe(false);
    expect(evaluateLevel(level2, snap(level2Done(5), PR)).done).toBe(true);
  });

  it('een interview met de markering telt niet', () => {
    const files = { ...level2Done(4), [`${INTERVIEWS_DIR}/05-apotheker.md`]: `${MARKER}\n# Interview 5\n\nInhoud` };
    expect(evaluateLevel(level2, snap(files, PR)).done).toBe(false);
  });

  it('B2C vraagt 15 interviews', () => {
    expect(evaluateLevel(level2, snap(level2Done(5, 'B2C'), PR)).done).toBe(false);
    expect(evaluateLevel(level2, snap(level2Done(15, 'B2C'), PR)).done).toBe(true);
  });

  it('interviews_nodig overschrijft de standaard', () => {
    expect(evaluateLevel(level2, snap({ ...level2Done(3), [DOELGROEP_PATH]: doelgroep('B2B', 3) }, PR)).done).toBe(true);
  });

  it('is pas af als je eerste doelgroep gevonden is', () => {
    const nee = evaluateLevel(level2, snap({ ...level2Done(5), [EERSTE_DOELGROEP_PATH]: eersteDoelgroep('nee') }, PR));
    expect(nee.done).toBe(false);
    expect(nee.results.find((r) => r.id === 'eerste-doelgroep')).toMatchObject({ stepId: 'l2-analyse', ok: false, reason: `in ${EERSTE_DOELGROEP_PATH} staat gevonden: nee` });
    expect(evaluateLevel(level2, snap({ ...level2Done(5), [EERSTE_DOELGROEP_PATH]: starterFiles[EERSTE_DOELGROEP_PATH] }, PR)).done).toBe(false);
  });

  it('is pas af na een gemergde pull request bij "Werk je canvas bij"', () => {
    expect(evaluateLevel(level2, snap(level2Done(5), 0)).done).toBe(false);
    expect(evaluateLevel(level2, snap(level2Done(5), 0)).results.find((r) => r.stepId === 'l2-canvas')).toMatchObject({ ok: false, reason: '0 van de 1' });
  });

  it('de canvasstap werkt via een pull request en legt dat uit in een pop-up met de twee plekken', () => {
    const step = stepOf(level2, 'l2-canvas');
    expect(step.aiPrompt).toContain('vpc.md');
    expect(step.aiPrompt).toContain('aannames.md');
    expect(step.aiPrompt).toMatch(/branch/);
    expect(step.popup).toEqual({ label: 'Wat is een pull request?', title: 'Je AI stelt voor, jij beslist', contentId: 'l2-pull-request', plaatje: 'twee-plekken' });
  });

  it('requiredInterviews valt terug bij ongeldige waarden', () => {
    for (const value of [0, -2, 'vijf', 2.5]) {
      expect(requiredInterviews(snap({ [DOELGROEP_PATH]: doelgroep('B2B', value) })), String(value)).toBe(5);
    }
    expect(requiredInterviews(snap({ [DOELGROEP_PATH]: doelgroep('B2C') }))).toBe(15);
  });

  it('requiredInterviews leest het type hoofdletterongevoelig', () => {
    for (const type of ['b2c', 'B2c', ' B2C ']) {
      expect(requiredInterviews(snap({ [DOELGROEP_PATH]: doelgroep(type) })), type).toBe(15);
    }
    expect(requiredInterviews(snap({ [DOELGROEP_PATH]: doelgroep('b2b') }))).toBe(5);
  });

  it('de starter-doelgroep vraagt 15 interviews zodra de AI het type op B2C zet', () => {
    expect(requiredInterviews(snap({}))).toBe(5);
    const b2c = starterFiles[DOELGROEP_PATH].replace('type: B2B', 'type: b2c');
    expect(requiredInterviews(snap({ [DOELGROEP_PATH]: b2c }))).toBe(15);
  });

  it('requiredInterviews begrenst absurd grote aantallen op 50', () => {
    expect(requiredInterviews(snap({ [DOELGROEP_PATH]: doelgroep('B2B', 10_000_000_000) }))).toBe(50);
  });

  it('doelgroep-formulier begrenst het aantal op 50', () => {
    const step = formStep(level2, 'l2-doelgroep');
    const values = { waarde: 'a', gebruiker: 'b', betaler: 'c', beslisser: 'd', type: 'B2B', aantal: '10000000000' };
    expect(parseMarkdown(step.toFile(values, snap({})).content).frontmatter).toEqual({ type: 'B2B', interviews_nodig: 50 });
  });

  it('doelgroep-formulier gebruikt de standaard als het aantal leeg is', () => {
    const step = formStep(level2, 'l2-doelgroep');
    const values = { waarde: 'Patiënten', gebruiker: 'Assistenten', betaler: 'Apotheek', beslisser: 'Eigenaar', type: 'B2C', aantal: '' };
    expect(parseMarkdown(step.toFile(values, snap({})).content).frontmatter).toEqual({ type: 'B2C', interviews_nodig: 15 });
    expect(parseMarkdown(step.toFile({ ...values, aantal: '8' }, snap({})).content).frontmatter).toEqual({ type: 'B2C', interviews_nodig: 8 });
  });

  it('slugify maakt veilige namen', () => {
    expect(slugify('Apotheker (eigenaar)')).toBe('apotheker-eigenaar');
    expect(slugify('Café-eigenaar')).toBe('cafe-eigenaar');
    expect(slugify('')).toBe('interview');
    expect(slugify('!!!')).toBe('interview');
  });

  it('slugify laat geen streepje achter na het afkappen', () => {
    const slug = slugify(`${'a'.repeat(39)} eigenaar`);
    expect(slug).toBe('a'.repeat(39));
    expect(slugify('apotheker in een middelgrote stad (eigenaar)').endsWith('-')).toBe(false);
  });

  it('nextInterviewPath telt alleen een nummer van hooguit drie cijfers met een streepje', () => {
    const files = {
      [`${INTERVIEWS_DIR}/02-a.md`]: '# 2\n\nx',
      [`${INTERVIEWS_DIR}/2026-notities.md`]: '# notities\n\nx',
      [`${INTERVIEWS_DIR}/7apotheker.md`]: '# x\n\nx',
    };
    expect(nextInterviewPath(snap(files), 'assistent')).toBe(`${INTERVIEWS_DIR}/03-assistent.md`);
    expect(nextInterviewPath(snap({ [`${INTERVIEWS_DIR}/123-a.md`]: '# x\n\nx' }), 'b')).toBe(`${INTERVIEWS_DIR}/124-b.md`);
  });

  it('nextInterviewPath neemt het hoogste nummer plus één', () => {
    expect(nextInterviewPath(snap({}), 'Apotheker')).toBe(`${INTERVIEWS_DIR}/01-apotheker.md`);
    const files = { [`${INTERVIEWS_DIR}/01-a.md`]: '# 1\n\nx', [`${INTERVIEWS_DIR}/03-b.md`]: '# 3\n\nx' };
    expect(nextInterviewPath(snap(files), 'assistent')).toBe(`${INTERVIEWS_DIR}/04-assistent.md`);
  });
});

describe('level 6', () => {
  it('heeft Proof of Concept als mijlpaal, zonder positieve cashflow', () => {
    expect(level6.milestone).toMatch(/^Proof of Concept/);
    expect(level6.milestone).not.toMatch(/cashflow/i);
  });
});
