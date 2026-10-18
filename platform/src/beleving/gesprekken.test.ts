import { describe, expect, it } from 'vitest';
import { evaluateLevel } from '../lib/levels/evaluate';
import { INTERVIEWS_DIR, level2 } from '../lib/levels/level2';
import { MARKER, parseMarkdown, toMarkdown } from '../lib/markdown';
import { MockRepoAdapter } from '../lib/repo/mockRepo';
import { buildSnapshot } from '../lib/repo/snapshot';
import { starterFiles } from '../lib/repo/starterFiles';
import { aantekeningenBestand, gesprekkenVan, netBinnen, wanneerTekst } from './gesprekken';

const snap = (files: Record<string, string> = {}) => ({ files: { ...starterFiles, ...files }, mergedPullRequests: 0 });
const DOELGROEP = (type: string) => ({ 'level-2-probleemvalidatie/doelgroep.md': toMarkdown({ type }, '# Doelgroep\n\nApotheken.') });
const interview = (fm: Record<string, unknown>, body = '# Interview\n\n## 5. Kernactiviteit\n\nRecepten klaarzetten.') => toMarkdown(fm, body);
const VANDAAG = '2026-10-18';

describe('je gesprekken', () => {
  it('verkoop je aan bedrijven, dan zijn er 5 vakken; aan consumenten 15', () => {
    expect(gesprekkenVan(snap(DOELGROEP('B2B')), VANDAAG).nodig).toBe(5);
    expect(gesprekkenVan(snap(DOELGROEP('B2C')), VANDAAG).nodig).toBe(15);
  });

  it('een vak is vol zodra de .md er staat, met rol en plaats, datum en één uitspraak', () => {
    const files = {
      [`${INTERVIEWS_DIR}/01-apotheker-utrecht.md`]: interview({ rol: 'apotheker', locatie: 'Utrecht', datum: '2026-10-12', duur: 24, uitspraak: 'Om elf uur staat de bezorger er nog niet.' }),
    };
    const { vol, nodig } = gesprekkenVan(snap({ ...DOELGROEP('B2B'), ...files }), VANDAAG);
    expect(nodig).toBe(5);
    expect(vol).toEqual([
      { pad: `${INTERVIEWS_DIR}/01-apotheker-utrecht.md`, nr: '01', wie: 'Apotheker, Utrecht', wanneer: '12 okt · 24 min', uitspraak: 'Om elf uur staat de bezorger er nog niet.' },
    ]);
  });

  it('zonder uitspraak in de frontmatter neemt het vak de eerste uitspraak bovenaan, of de eerste zin', () => {
    const files = {
      [`${INTERVIEWS_DIR}/01-apotheker.md`]: interview({ rol: 'apotheker' }, '# Interview 01\n\n> “Spoedrecepten zijn ons grootste gedoe.”\n\n## 5. Kernactiviteit\n\nRecepten.'),
      [`${INTERVIEWS_DIR}/02-assistent.md`]: interview({ rol: 'assistent' }, '# Interview 02\n\n## 5. Kernactiviteit\n\nIk loop zelf twee keer per dag naar buiten. Daarna bel ik.'),
      [`${INTERVIEWS_DIR}/03-apotheker.md`]: interview({ rol: 'apotheker' }, '# Interview 03\n\n> Let op: dit interview bevat een vertrouwelijk stuk.\n\n## 5\n\nWe bezorgen zelf.'),
    };
    const uitspraken = gesprekkenVan(snap(files), VANDAAG).vol.map((v) => v.uitspraak);
    expect(uitspraken).toEqual(['Spoedrecepten zijn ons grootste gedoe.', 'Ik loop zelf twee keer per dag naar buiten.', 'We bezorgen zelf.']);
  });

  it('een bestand met de markering is nog geen vol vak', () => {
    const files = { [`${INTERVIEWS_DIR}/01-apotheker.md`]: `${MARKER}\n# Interview\n` };
    expect(gesprekkenVan(snap(files), VANDAAG).vol).toEqual([]);
  });

  it('zonder rol in de frontmatter komt de rol uit de bestandsnaam', () => {
    const files = { [`${INTERVIEWS_DIR}/04-apotheker-houten.md`]: '# Interview\n\nTekst.' };
    expect(gesprekkenVan(snap(files), VANDAAG).vol[0]).toMatchObject({ nr: '04', wie: 'Apotheker houten', wanneer: '' });
  });

  it('wanneer: de datum kort, vandaag als vandaag, en hoe lang', () => {
    expect(wanneerTekst({ datum: '2026-10-12', duur: 24 }, VANDAAG)).toBe('12 okt · 24 min');
    expect(wanneerTekst({ datum: VANDAAG, bron: 'aantekeningen' }, VANDAAG)).toBe('vandaag · aantekeningen');
    expect(wanneerTekst({ datum: '2026-03-01' }, VANDAAG)).toBe('1 mrt');
    expect(wanneerTekst({}, VANDAAG)).toBe('');
  });
});

describe('Net binnen', () => {
  const vol = (...nrs: string[]) => nrs.map((nr) => ({ pad: `${INTERVIEWS_DIR}/${nr}-a.md`, nr, wie: 'A', wanneer: '', uitspraak: null }));

  it('het nieuwste vak krijgt "Net binnen" als het binnenkwam terwijl je keek', () => {
    const bijOpenen = new Set([`${INTERVIEWS_DIR}/01-a.md`, `${INTERVIEWS_DIR}/02-a.md`]);
    expect(netBinnen(vol('01', '02', '03'), bijOpenen, [])).toBe(`${INTERVIEWS_DIR}/03-a.md`);
    expect(netBinnen(vol('01', '02'), bijOpenen, [])).toBeNull();
  });

  it('of als het gesprek van vandaag is', () => {
    const bijOpenen = new Set([`${INTERVIEWS_DIR}/01-a.md`, `${INTERVIEWS_DIR}/02-a.md`]);
    expect(netBinnen(vol('01', '02'), bijOpenen, [`${INTERVIEWS_DIR}/02-a.md`])).toBe(`${INTERVIEWS_DIR}/02-a.md`);
  });
});

describe('Geen opname, wel aantekeningen', () => {
  it('maakt een .md in interviews/ met rol, plaats, datum en de eerste zin als uitspraak', () => {
    const w = aantekeningenBestand(snap(), 'apotheker, Houten', 'Bezorgen na vier uur is te laat voor spoed. Verder gaat het goed.', VANDAAG);
    expect(w.path).toBe(`${INTERVIEWS_DIR}/01-apotheker-houten.md`);
    expect(w.message).toBe('Gesprek toegevoegd: 01-apotheker-houten.md');
    const { frontmatter, body } = parseMarkdown(w.content);
    expect(frontmatter).toEqual({ rol: 'apotheker', locatie: 'Houten', datum: VANDAAG, bron: 'aantekeningen', uitspraak: 'Bezorgen na vier uur is te laat voor spoed.' });
    expect(body).toContain('Verder gaat het goed.');
  });

  it('krijgt het volgende nummer', () => {
    const files = { [`${INTERVIEWS_DIR}/01-a.md`]: '# 1\n\nx', [`${INTERVIEWS_DIR}/02-b.md`]: '# 2\n\nx' };
    expect(aantekeningenBestand(snap(files), 'assistent', 'Kort.', VANDAAG).path).toBe(`${INTERVIEWS_DIR}/03-assistent.md`);
  });

  it('"Zet bij je gesprekken" zet het bestand in de repo, en het vak telt mee', async () => {
    const repo = new MockRepoAdapter(null, starterFiles);
    const w = aantekeningenBestand(await buildSnapshot(repo), 'apotheker, Houten', 'Bezorgen na vier uur is te laat.', VANDAAG);
    await repo.writeFile(w.path, w.content, w.message);
    const s = await buildSnapshot(repo);
    expect(gesprekkenVan(s, VANDAAG).vol).toHaveLength(1);
    expect(gesprekkenVan(s, VANDAAG).vol[0]).toMatchObject({ wie: 'Apotheker, Houten', wanneer: 'vandaag · aantekeningen', uitspraak: 'Bezorgen na vier uur is te laat.' });
    expect(evaluateLevel(level2, s).results.find((r) => r.id === 'interviews')?.reason).toBe('1 van de 5');
  });
});
