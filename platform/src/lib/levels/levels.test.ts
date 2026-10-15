import { describe, expect, it } from 'vitest';
import { MARKER, parseMarkdown, toMarkdown } from '../markdown';
import { starterFiles } from '../repo/starterFiles';
import type { RepoSnapshot } from '../repo/types';
import { evaluateLevel, levelStatus } from './evaluate';
import { LEVELS } from './index';
import { SETUP_PATH, WERKPLEK_PATH, level0 } from './level0';
import { AANNAMES_PATH, IDEE_PATH, MADLIB_PATH, VISIE_PATH, aannamesToMarkdown, level1, madlibSentence } from './level1';
import {
  ANALYSE_PATH,
  DOELGROEP_PATH,
  INTERVIEWS_DIR,
  VRAGEN_PATH,
  level2,
  nextTranscriptPath,
  requiredInterviews,
  slugify,
  transcriptFromUpload,
} from './level2';
import type { FormStep, LevelDef } from './types';

const snap = (files: Record<string, string>, mergedPullRequests = 0): RepoSnapshot => ({
  files: { ...starterFiles, ...files },
  mergedPullRequests,
});

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
const level2Done = (n: number, type = 'B2B') => ({
  [DOELGROEP_PATH]: doelgroep(type),
  [VRAGEN_PATH]: '# Vragen\n\n5. Wat doet u op een gewone dag?\n',
  ...interviews(n),
  [ANALYSE_PATH]: '# Analyse\n\nInzicht.\n',
});

describe('levelStatus', () => {
  it('bij de start is alleen level 0 actief', () => {
    expect(levelStatus(LEVELS, snap({}))).toEqual({ 0: 'active', 1: 'locked', 2: 'locked', 3: 'locked', 4: 'locked', 5: 'locked', 6: 'locked' });
  });

  it('levels gaan op volgorde open', () => {
    expect(levelStatus(LEVELS, snap(LEVEL1_DONE))[1]).toBe('locked');
  });

  it('na level 0 t/m 2 is level 3 actief maar nooit af', () => {
    expect(levelStatus(LEVELS, snap({ ...LEVEL0_DONE, ...LEVEL1_DONE, ...level2Done(5) }, 1))).toEqual({
      0: 'done', 1: 'done', 2: 'done', 3: 'active', 4: 'locked', 5: 'locked', 6: 'locked',
    });
  });
});

describe('level 0', () => {
  it('is pas af met een gemergde pull request', () => {
    expect(evaluateLevel(level0, snap(LEVEL0_DONE, 0)).done).toBe(false);
    expect(evaluateLevel(level0, snap(LEVEL0_DONE, 1)).done).toBe(true);
  });

  it('setup-formulier schrijft frontmatter', () => {
    const write = formStep(level0, 'l0-setup').toFile({ os: 'windows', ai: 'codex' }, snap({}));
    expect(write.path).toBe(SETUP_PATH);
    expect(parseMarkdown(write.content).frontmatter).toEqual({ os: 'windows', ai: 'codex' });
  });
});

describe('level 1', () => {
  it('templates met de markering tellen niet', () => {
    const evaluation = evaluateLevel(level1, snap({}));
    expect(evaluation.done).toBe(false);
    expect(evaluation.results.find((r) => r.id === 'idee')?.reason).toBe('level-1-idee/idee.md is nog niet ingevuld');
  });

  it('is af met alle bestanden en drie aannames', () => {
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
  it('4 van de 5 transcripts is niet genoeg, 5 wel', () => {
    expect(evaluateLevel(level2, snap(level2Done(4))).done).toBe(false);
    expect(evaluateLevel(level2, snap(level2Done(5))).done).toBe(true);
  });

  it('een transcript met de markering telt niet', () => {
    const files = { ...level2Done(4), [`${INTERVIEWS_DIR}/05-apotheker.md`]: `${MARKER}\n# Interview 5\n\nInhoud` };
    expect(evaluateLevel(level2, snap(files)).done).toBe(false);
  });

  it('B2C vraagt 15 interviews', () => {
    expect(evaluateLevel(level2, snap(level2Done(5, 'B2C'))).done).toBe(false);
    expect(evaluateLevel(level2, snap(level2Done(15, 'B2C'))).done).toBe(true);
  });

  it('interviews_nodig overschrijft de standaard', () => {
    expect(evaluateLevel(level2, snap({ ...level2Done(3), [DOELGROEP_PATH]: doelgroep('B2B', 3) })).done).toBe(true);
  });

  it('requiredInterviews valt terug bij ongeldige waarden', () => {
    for (const value of [0, -2, 'vijf', 2.5]) {
      expect(requiredInterviews(snap({ [DOELGROEP_PATH]: doelgroep('B2B', value) })), String(value)).toBe(5);
    }
    expect(requiredInterviews(snap({ [DOELGROEP_PATH]: doelgroep('B2C') }))).toBe(15);
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

  it('nextTranscriptPath neemt het hoogste nummer plus één', () => {
    expect(nextTranscriptPath(snap({}), 'Apotheker')).toBe(`${INTERVIEWS_DIR}/01-apotheker.md`);
    const files = { [`${INTERVIEWS_DIR}/01-a.md`]: '# 1\n\nx', [`${INTERVIEWS_DIR}/03-b.md`]: '# 3\n\nx' };
    expect(nextTranscriptPath(snap(files), 'assistent')).toBe(`${INTERVIEWS_DIR}/04-assistent.md`);
  });

  it('transcriptFromUpload weigert audio, Word en lege bestanden', () => {
    expect(transcriptFromUpload('gesprek.m4a', 'x', 'apotheker', snap({}))).toEqual({
      error: 'Alleen .md- of .txt-bestanden. Audio of Word? Zet het eerst om met skill transcriberen.',
    });
    expect('error' in transcriptFromUpload('gesprek.docx', 'x', 'apotheker', snap({}))).toBe(true);
    expect(transcriptFromUpload('leeg.txt', '  \n', 'apotheker', snap({}))).toEqual({ error: 'Dit bestand is leeg.' });
  });

  it('transcriptFromUpload pakt .txt in en laat .md zoals het is', () => {
    const txt = transcriptFromUpload('gesprek.TXT', 'Hallo, ik ben J.', 'Apotheker', snap({}));
    if ('error' in txt) throw new Error(txt.error);
    expect(txt.path).toBe(`${INTERVIEWS_DIR}/01-apotheker.md`);
    expect(parseMarkdown(txt.content).frontmatter).toEqual({ rol: 'Apotheker' });
    expect(txt.content).toContain('# Interview: Apotheker');
    const md = transcriptFromUpload('gesprek.md', '# Interview\n\nTekst', 'apotheker', snap({}));
    if ('error' in md) throw new Error(md.error);
    expect(md.content).toBe('# Interview\n\nTekst');
  });
});
