import { describe, expect, it } from 'vitest';
import { evaluateLevel, levelStatus } from '../lib/levels/evaluate';
import { LEVELS } from '../lib/levels';
import { INTERVIEWS_DIR } from '../lib/levels/level2';
import { FEEDBACK_DIR } from '../lib/levels/level4';
import { AGENTS_PATH } from '../lib/levels/level5';
import { KLANTEN_PATH } from '../lib/levels/level6';
import { mdFilesIn } from '../lib/levels/checks';
import { frontmatterOf } from '../lib/levels/checks';
import { MockRepoAdapter } from '../lib/repo/mockRepo';
import { buildSnapshot } from '../lib/repo/snapshot';
import { starterFiles } from '../lib/repo/starterFiles';
import { gesprekkenVan } from '../beleving/gesprekken';
import { DEMO_FORMS } from './formulieren';
import { SIMULATIONS } from './simulations';
import { demoVoorStap, vulLevel, vulStap } from './vullen';

const level = (id: number) => LEVELS.find((l) => l.id === id)!;
const stap = (levelId: number, stepId: string) => level(levelId).steps.find((s) => s.id === stepId)!;

describe('demo-content', () => {
  it('elke stap met een check heeft demo-content: formulierwaarden of een simulatie', () => {
    for (const l of LEVELS) {
      for (const step of l.steps.filter((s) => l.checks.some((c) => c.stepId === s.id))) {
        const demo = demoVoorStap(step);
        expect(demo, step.id).not.toBeNull();
        if (step.kind === 'form') expect(DEMO_FORMS[step.id], step.id).toBeDefined();
        else expect(SIMULATIONS[step.id], step.id).toBeDefined();
      }
    }
  });

  it('de formulierwaarden vullen elk verplicht veld', async () => {
    const s = await buildSnapshot(new MockRepoAdapter(null, starterFiles));
    for (const l of LEVELS) {
      for (const step of l.steps) {
        if (step.kind !== 'form' || !DEMO_FORMS[step.id]) continue;
        const values = DEMO_FORMS[step.id](s);
        for (const field of step.fields) {
          if ((field.kind === 'text' || field.kind === 'textarea') && !field.optional) expect(values[field.name]?.trim(), `${step.id}.${field.name}`).toBeTruthy();
        }
      }
    }
  });

  it('"Vul het hele level" maakt level 0 tot en met 6 een voor een af', async () => {
    const repo = new MockRepoAdapter(null, starterFiles);
    for (const l of LEVELS) {
      await vulLevel(l, repo);
      const status = levelStatus(LEVELS, await buildSnapshot(repo));
      expect(status[l.id], `level ${l.id}`).toBe('done');
    }
    const s = await buildSnapshot(repo);
    expect(Object.values(levelStatus(LEVELS, s))).toEqual(['done', 'done', 'done', 'done', 'done', 'done', 'done']);
    for (const l of LEVELS) expect(evaluateLevel(l, s).results.filter((r) => !r.ok), `level ${l.id}`).toEqual([]);
  });

  it('per stap: de interviewstap zet er één interview bij, interviewen vult tot het aantal dat nodig is', async () => {
    const repo = new MockRepoAdapter(null, starterFiles);
    await vulStap(stap(2, 'l2-interviews'), repo);
    expect(mdFilesIn(await buildSnapshot(repo), INTERVIEWS_DIR)).toHaveLength(1);
    await vulStap(stap(2, 'l2-interviewen'), repo);
    expect(mdFilesIn(await buildSnapshot(repo), INTERVIEWS_DIR)).toHaveLength(5);
  });

  it('de demo-gesprekken vullen elk vak met een eigen plaats, datum en uitspraak', async () => {
    const repo = new MockRepoAdapter(null, starterFiles);
    await vulStap(stap(2, 'l2-interviewen'), repo);
    const { vol } = gesprekkenVan(await buildSnapshot(repo), '2026-12-31');
    expect(vol).toHaveLength(5);
    expect(new Set(vol.map((v) => v.wie)).size).toBe(5);
    expect(new Set(vol.map((v) => v.uitspraak)).size).toBe(5);
    for (const v of vol) expect(v.wanneer, v.nr).toMatch(/^\d+ \w+ · \d+ min$/);
  });

  it('per stap: het voorstel vult telkens de volgende persoon zonder antwoord', async () => {
    const repo = new MockRepoAdapter(null, starterFiles);
    for (const id of [0, 1, 2, 3]) await vulLevel(level(id), repo);
    await vulStap(stap(4, 'l4-prijs'), repo);
    await vulStap(stap(4, 'l4-testkaart'), repo);
    await vulStap(stap(4, 'l4-terugbellen'), repo);
    await vulStap(stap(4, 'l4-voorstel'), repo);
    await vulStap(stap(4, 'l4-voorstel'), repo);
    const s = await buildSnapshot(repo);
    const antwoorden = mdFilesIn(s, FEEDBACK_DIR).map((p) => frontmatterOf(s, p).antwoord);
    expect(antwoorden.filter((a) => typeof a === 'string' && a.length > 0)).toHaveLength(2);
  });

  it('de demo-sectie in AGENTS.md laat de rest van AGENTS.md staan', async () => {
    const repo = new MockRepoAdapter(null, starterFiles);
    await vulStap(stap(5, 'l5-agents'), repo);
    const agents = (await buildSnapshot(repo)).files[AGENTS_PATH];
    expect(agents).toContain('## Werkwijze');
    expect(agents).toMatch(/## Over mijn onderneming\n\nTrapzorg/);
  });

  it('een klant in de demo opent level 6 terwijl je nog in level 1 zit', async () => {
    const repo = new MockRepoAdapter(null, starterFiles);
    await vulLevel(level(0), repo);
    await vulStap(stap(6, 'l6-klant'), repo);
    const s = await buildSnapshot(repo);
    expect(s.files[KLANTEN_PATH]).toMatch(/^- apotheker/m);
    expect(levelStatus(LEVELS, s)).toMatchObject({ 1: 'active', 2: 'locked', 6: 'active' });
  });
});
