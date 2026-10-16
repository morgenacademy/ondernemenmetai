import { describe, expect, it } from 'vitest';
import { MARKER, parseMarkdown, toMarkdown } from '../markdown';
import { starterFiles } from '../repo/starterFiles';
import type { RepoSnapshot } from '../repo/types';
import { evaluateLevel, levelStatus } from './evaluate';
import { LEVELS } from './index';
import { EERSTE_DOELGROEP_PATH } from './level2';
import { MVP_DIR, MVP_PATH, OPLOSSING_PATH, OPLOSSINGEN_PATH, WAARDEPROPOSITIE_PATH, level3 } from './level3';
import { FEEDBACK_DIR, PRIJS_PATH, level4, requiredFeedback, resultaatPath, testkaartPath } from './level4';
import { AGENTS_PATH, BMC_PATH, PRODUCT_PATH, level5 } from './level5';
import { IMPACT_PATH, KLANTEN_PATH, PIJPLIJN_PATH, VERKOOPAANPAK_PATH, level6 } from './level6';
import type { FormStep, LevelDef } from './types';

const snap = (files: Record<string, string>, mergedPullRequests = 0): RepoSnapshot => ({ files: { ...starterFiles, ...files }, mergedPullRequests });
const formStep = (level: LevelDef, id: string): FormStep => {
  const step = level.steps.find((s) => s.id === id);
  if (!step || step.kind !== 'form') throw new Error(`geen formulierstap ${id}`);
  return step;
};
const ids = (level: LevelDef) => level.steps.map((s) => s.id);
const without = (files: Record<string, string>, path: string) => Object.fromEntries(Object.entries(files).filter(([p]) => p !== path));
const reason = (level: LevelDef, s: RepoSnapshot, id: string) => evaluateLevel(level, s).results.find((r) => r.id === id);

const testkaart = (ronde: number) =>
  toMarkdown(
    { ronde, hypothese: 'Ze willen door voor €40', test_opzet: 'Twee weken proef', metriek: 'Aantal ja', succesdrempel: '3 van de 5', tijd_en_sample: '5 apothekers, november' },
    `# Testkaart ronde ${ronde}\n\nTekst.`,
  );
const resultaat = (ronde: number, besluit: string) => toMarkdown({ ronde, besluit, vertrouwen: 60 }, `# Resultaatkaart ronde ${ronde}\n\nTekst.`);
const feedback = (n: number, antwoord: string | null) => toMarkdown({ persoon: `0${n}-apotheker`, ronde: 1, antwoord }, `# 0${n}-apotheker\n\n## Spiekbriefje ronde 1\n\n- Opening.`);

const LEVEL3_DONE = {
  [OPLOSSINGEN_PATH]: `# Oplossingen\n\n${Array.from({ length: 10 }, (_, i) => `- Idee ${i + 1}`).join('\n')}\n`,
  [OPLOSSING_PATH]: '# Gekozen oplossing\n\nBakfiets.\n',
  [WAARDEPROPOSITIE_PATH]: '# Waardepropositie\n\nTekst.\n',
  [MVP_PATH]: '# MVP\n\nLandingspagina.\n',
  [`${MVP_DIR}/landingspagina.html`]: '<h1>Trapzorg</h1>',
};
const LEVEL4_DONE = {
  [PRIJS_PATH]: toMarkdown({ prijs: '40', per: 'per maand', kostprijs: '22' }, '# Prijs\n\n€40 per maand.'),
  [testkaartPath(1)]: testkaart(1),
  [`${FEEDBACK_DIR}/01-apotheker.md`]: feedback(1, 'ja'),
  [`${FEEDBACK_DIR}/02-apotheker.md`]: feedback(2, 'nee'),
  [`${FEEDBACK_DIR}/03-apotheker.md`]: feedback(3, 'twijfel'),
  [resultaatPath(1)]: resultaat(1, 'doorontwikkelen'),
};
const agentsMet = (sectie: string) =>
  starterFiles[AGENTS_PATH].replace(/## Over mijn onderneming\n[\s\S]*?(?=\n## )/, `## Over mijn onderneming\n\n${sectie}\n`);
const LEVEL5_DONE = {
  [PRODUCT_PATH]: toMarkdown({ besluit: 'ik ga ervoor', volgende_stap: 'echt verkopen' }, '# Mijn product\n\n## Wat erin zit\n\n- Bezorging.\n\n## Onderbouwing\n\n3 van de 5 zeiden ja.'),
  [resultaatPath(2)]: resultaat(2, 'doorgaan'),
  [BMC_PATH]: '# Business Model Canvas\n\nTekst.\n',
  [AGENTS_PATH]: agentsMet('Trapzorg bezorgt medicijnen per bakfiets voor zelfstandige apotheken in Breda, voor €40 per maand.'),
};
const LEVEL6_DONE = {
  [KLANTEN_PATH]: '# Klanten\n\n- apotheker (K.): proefabonnement, €40, 2026-11-24\n',
  [VERKOOPAANPAK_PATH]: toMarkdown({ name: 'verkoopaanpak', description: 'Bereidt een verkoopgesprek met een apotheker voor.' }, '# Verkoopaanpak\n\nStappen.'),
  [PIJPLIJN_PATH]: '# Pijplijn\n\n| Klant | Fase |\n|---|---|\n| apotheker Tilburg | Voorstel gedaan |\n',
  [IMPACT_PATH]: '# Impact\n\nTekst.\n',
};

describe('alle levels', () => {
  it('zijn uitgewerkt, met een doel voor de deelnemer', () => {
    for (const level of LEVELS) {
      expect(level.ready, `level ${level.id}`).toBe(true);
      expect(level.doel.length, `level ${level.id}`).toBeGreaterThan(20);
    }
  });

  it('level 1 tot en met 6 hebben een vraag, een begrip en de bestanden van de kern', () => {
    for (const level of LEVELS.filter((l) => l.id > 0)) {
      expect(level.vraag, `level ${level.id}`).toMatch(/\?$/);
      expect(level.begrip, `level ${level.id}`).toBeTruthy();
      expect(level.kern?.length, `level ${level.id}`).toBeGreaterThan(0);
    }
  });

  it('elke stap zegt waar je hem doet', () => {
    for (const level of LEVELS) {
      for (const step of level.steps) expect(step.waar.length, step.id).toBeGreaterThan(0);
    }
  });

  for (const level of LEVELS.filter((l) => l.id > 0)) {
    it(`level ${level.id}: elke stap heeft een check, behalve een optionele kaart`, () => {
      for (const step of level.steps) {
        const checks = level.checks.filter((c) => c.stepId === step.id);
        if (step.optional) expect(checks, step.id).toHaveLength(0);
        else expect(checks.length, step.id).toBeGreaterThan(0);
      }
    });
  }

  it('het begrip staat in een pop-up op een stap van het level', () => {
    for (const level of LEVELS.filter((l) => l.id > 0)) {
      expect(level.steps.some((s) => s.popup), `level ${level.id}`).toBe(true);
    }
  });
});

describe('level 3', () => {
  it('gaat van oplossingen bedenken via kiezen en verwoorden naar je MVP', () => {
    expect(ids(level3)).toEqual(['l3-oplossingen', 'l3-kiezen', 'l3-verwoorden', 'l3-mvp-kiezen', 'l3-bouwen']);
    expect(level3.steps.find((s) => s.id === 'l3-verwoorden')?.popup?.contentId).toBe('l3-geschiedenis');
  });

  it('is af met tien ideeën, een gekozen oplossing, je waardepropositie, je MVP-keuze en een bestand in mvp/', () => {
    expect(evaluateLevel(level3, snap(LEVEL3_DONE)).done).toBe(true);
    expect(evaluateLevel(level3, snap(without(LEVEL3_DONE, `${MVP_DIR}/landingspagina.html`))).done).toBe(false);
    expect(reason(level3, snap({ ...LEVEL3_DONE, [OPLOSSINGEN_PATH]: '# Oplossingen\n\n- a\n- b' }), 'oplossingen')?.reason).toBe('2 van de 10');
  });

  it('de templates tellen niet', () => {
    const s = snap({});
    expect(evaluateLevel(level3, s).results.filter((r) => r.ok).map((r) => r.id)).toEqual([]);
  });

  it('het oplossingenformulier zet je How Might We-vraag erboven en elk idee op een regel', () => {
    const s = snap({ [EERSTE_DOELGROEP_PATH]: toMarkdown({ gevonden: 'ja', doelgroep: 'zelfstandige apotheken', probleem: 'spoedbezorging' }, '# E\n\nTekst.') });
    const step = formStep(level3, 'l3-oplossingen');
    expect(step.hint?.(s)).toBe('Hoe kunnen we zelfstandige apotheken helpen met spoedbezorging?');
    const write = step.toFile({ ideeen: 'Bakfiets\n\n- Kluisjes bij de apotheek\n' }, s);
    expect(write.path).toBe(OPLOSSINGEN_PATH);
    expect(write.content).toContain('Hoe kunnen we zelfstandige apotheken helpen met spoedbezorging?');
    expect(write.content).toContain('- Bakfiets\n- Kluisjes bij de apotheek');
  });
});

describe('level 4', () => {
  it('gaat van prijs via testkaart en terugbellen naar je ronde', () => {
    expect(ids(level4)).toEqual(['l4-prijs', 'l4-testkaart', 'l4-terugbellen', 'l4-voorstel', 'l4-resultaat']);
    expect(level4.steps.find((s) => s.id === 'l4-terugbellen')?.popup?.contentId).toBe('l4-geheugen');
  });

  it('vraagt 3 feedbackbestanden met een antwoord bij B2B en 10 bij B2C', () => {
    expect(requiredFeedback(snap({}))).toBe(3);
    const b2c = starterFiles['level-2-probleemvalidatie/doelgroep.md'].replace('type: B2B', 'type: B2C');
    expect(requiredFeedback(snap({ 'level-2-probleemvalidatie/doelgroep.md': b2c }))).toBe(10);
  });

  it('is af met prijs, een volledige testkaart, genoeg antwoorden en een resultaatkaart met besluit', () => {
    expect(evaluateLevel(level4, snap(LEVEL4_DONE)).done).toBe(true);
    const zonderAntwoord = snap({ ...LEVEL4_DONE, [`${FEEDBACK_DIR}/03-apotheker.md`]: feedback(3, null) });
    expect(reason(level4, zonderAntwoord, 'antwoorden')?.reason).toBe('2 van de 3');
    expect(reason(level4, zonderAntwoord, 'spiekbriefjes')?.ok).toBe(true);
    const halveKaart = snap({ ...LEVEL4_DONE, [testkaartPath(1)]: toMarkdown({ ronde: 1, hypothese: 'x' }, '# T\n\nx') });
    expect(reason(level4, halveKaart, 'testkaart')?.reason).toBe('nog leeg: test_opzet, metriek, succesdrempel, tijd_en_sample');
  });

  it('het voorstelformulier kiest uit je mensen en zet hun antwoord in hun feedbackbestand', () => {
    const s = snap({ [`${FEEDBACK_DIR}/01-apotheker.md`]: feedback(1, null), [testkaartPath(1)]: testkaart(1) });
    const step = formStep(level4, 'l4-voorstel');
    const persoon = step.fields.find((f) => f.name === 'persoon');
    expect(persoon?.kind === 'select' && persoon.optionsFrom?.(s)).toEqual([{ value: '01-apotheker', label: '01-apotheker' }]);
    const write = step.toFile({ persoon: '01-apotheker', geprobeerd: 'Twee weken', voorstel: '€40 per maand', antwoord: 'ja', waarom: 'Scheelt een halve dag' }, s);
    expect(write.path).toBe(`${FEEDBACK_DIR}/01-apotheker.md`);
    const parsed = parseMarkdown(write.content);
    expect(parsed.frontmatter).toMatchObject({ persoon: '01-apotheker', antwoord: 'ja' });
    expect(parsed.body).toContain('## Spiekbriefje ronde 1');
    expect(parsed.body).toMatch(/## Ronde 1\n\n- Wat diegene probeerde, en hoe lang: Twee weken/);
  });

  it('in ronde 2 komt er een sectie Ronde 2 bij en blijft ronde 1 staan', () => {
    const eerst = feedback(1, 'nee').replace('- Opening.', '- Opening.\n\n## Ronde 1\n\n- Antwoord: nee');
    const s = snap({ [`${FEEDBACK_DIR}/01-apotheker.md`]: eerst, [testkaartPath(1)]: testkaart(1), [testkaartPath(2)]: testkaart(2) });
    const write = formStep(level4, 'l4-voorstel').toFile({ persoon: '01-apotheker', geprobeerd: 'Een maand', voorstel: 'Eerste maand gratis', antwoord: 'ja', waarom: 'Nu wel' }, s);
    const parsed = parseMarkdown(write.content);
    expect(parsed.frontmatter).toMatchObject({ antwoord: 'ja', ronde: 2 });
    expect(parsed.body).toContain('## Ronde 1\n\n- Antwoord: nee');
    expect(parsed.body).toContain('## Ronde 2');
  });
});

describe('level 5', () => {
  it('gaat van doorontwikkelen via een nieuwe ronde naar je besluit, je BMC en AGENTS.md', () => {
    expect(ids(level5)).toEqual(['l5-doorontwikkelen', 'l5-terug', 'l5-besluit', 'l5-bmc', 'l5-agents']);
    expect(level5.steps.find((s) => s.id === 'l5-agents')?.popup?.contentId).toBe('l5-waarom-agents');
  });

  it('is af met "ik ga ervoor", twee resultaatkaarten, je BMC en de sectie over je onderneming', () => {
    const files = { ...LEVEL4_DONE, ...LEVEL5_DONE };
    expect(evaluateLevel(level5, snap(files)).done).toBe(true);
    expect(reason(level5, snap(without(files, resultaatPath(2))), 'rondes')?.reason).toBe('1 van de 2');
    const nogNiet = snap({ ...files, [PRODUCT_PATH]: LEVEL5_DONE[PRODUCT_PATH].replace('ik ga ervoor', 'nog niet') });
    expect(reason(level5, nogNiet, 'besluit')?.ok).toBe(false);
    expect(reason(level5, snap({ ...files, [AGENTS_PATH]: starterFiles[AGENTS_PATH] }), 'agents')?.ok).toBe(false);
  });

  it('het besluitformulier zet besluit en volgende stap in product.md en laat de rest staan', () => {
    const product = toMarkdown({ besluit: null, volgende_stap: null }, '# Mijn product\n\n## Wat erin zit\n\n- Bezorging.\n\n## Onderbouwing\n');
    const write = formStep(level5, 'l5-besluit').toFile({ besluit: 'ik ga ervoor', volgende_stap: 'echt verkopen', onderbouwing: '3 van de 5 zeiden ja.' }, snap({ [PRODUCT_PATH]: product }));
    const parsed = parseMarkdown(write.content);
    expect(parsed.frontmatter).toEqual({ besluit: 'ik ga ervoor', volgende_stap: 'echt verkopen' });
    expect(parsed.body).toContain('## Wat erin zit\n\n- Bezorging.');
    expect(parsed.body).toContain('## Onderbouwing\n\n3 van de 5 zeiden ja.');
  });
});

describe('level 6', () => {
  it('gaat van je klant via je eigen skill en je pijplijn naar je impact', () => {
    expect(ids(level6)).toEqual(['l6-klant', 'l6-verkoopaanpak', 'l6-pijplijn', 'l6-impact']);
    expect(level6.steps.find((s) => s.id === 'l6-verkoopaanpak')?.popup?.contentId).toBe('l6-eigen-skill');
  });

  it('is af met een klant, je verkoopaanpak als skill, je pijplijn en je impact', () => {
    expect(evaluateLevel(level6, snap(LEVEL6_DONE)).done).toBe(true);
    const zonderBeschrijving = snap({ ...LEVEL6_DONE, [VERKOOPAANPAK_PATH]: toMarkdown({ name: 'verkoopaanpak' }, '# V\n\nx') });
    expect(evaluateLevel(level6, zonderBeschrijving).done).toBe(false);
  });

  it('het klantformulier zet de klant op een regel in klanten.md, ook bovenop het template', () => {
    const step = formStep(level6, 'l6-klant');
    const values = { rol: 'apotheker', initialen: 'K.', wat: 'proefabonnement', bedrag: '40', datum: '2026-11-24' };
    const eerste = step.toFile(values, snap({}));
    expect(eerste.path).toBe(KLANTEN_PATH);
    expect(eerste.content).not.toContain(MARKER);
    expect(eerste.content).toContain('- apotheker (K.): proefabonnement, €40, 2026-11-24');
    const tweede = step.toFile({ ...values, rol: 'huisartsenpost', initialen: 'M.' }, snap({ [KLANTEN_PATH]: eerste.content }));
    expect(tweede.content.match(/^- /gm)).toHaveLength(2);
  });

  it('het pijplijnformulier zet een klant in de tabel met fase, kans en gewogen waarde', () => {
    const step = formStep(level6, 'l6-pijplijn');
    const eerste = step.toFile({ klant: 'apotheker Tilburg (R.)', fase: 'voorstel', waarde: '480' }, snap({}));
    expect(eerste.path).toBe(PIJPLIJN_PATH);
    expect(eerste.content).not.toContain(MARKER);
    expect(eerste.content).toContain('| apotheker Tilburg (R.) | Voorstel gedaan | 50% | €480 | €240 |');
    expect(eerste.content).toContain('Totaal gewogen: €240');
    const verder = step.toFile({ klant: 'apotheker Tilburg (R.)', fase: 'opdracht', waarde: '480' }, snap({ [PIJPLIJN_PATH]: eerste.content }));
    expect(verder.content.match(/apotheker Tilburg/g)).toHaveLength(1);
    expect(verder.content).toContain('Totaal gewogen: €480');
  });

  it('gaat open zodra je een klant hebt, ook als level 4 of 5 nog niet af is', () => {
    expect(levelStatus(LEVELS, snap({}))[6]).toBe('locked');
    const status = levelStatus(LEVELS, snap({ [KLANTEN_PATH]: LEVEL6_DONE[KLANTEN_PATH] }));
    expect(status[0]).toBe('active');
    expect(status[6]).toBe('active');
  });
});
