import { expect, it } from 'vitest';
import { levelStatus } from '../lib/levels/evaluate';
import { LEVELS } from '../lib/levels';
import { level0 } from '../lib/levels/level0';
import { level1 } from '../lib/levels/level1';
import { level2 } from '../lib/levels/level2';
import type { FormStep, FormValues, LevelDef } from '../lib/levels/types';
import { parseMarkdown } from '../lib/markdown';
import { MockRepoAdapter } from '../lib/repo/mockRepo';
import { buildSnapshot } from '../lib/repo/snapshot';
import { starterFiles } from '../lib/repo/starterFiles';
import { SIMULATIONS } from './simulations';

const formStep = (level: LevelDef, id: string): FormStep => {
  const step = level.steps.find((s) => s.id === id);
  if (!step || step.kind !== 'form') throw new Error(`geen formulierstap ${id}`);
  return step;
};

async function saveForm(repo: MockRepoAdapter, level: LevelDef, id: string, values: FormValues) {
  const write = formStep(level, id).toFile(values, await buildSnapshot(repo));
  await repo.writeFile(write.path, write.content, write.message);
}

async function simulate(repo: MockRepoAdapter, id: string) {
  await SIMULATIONS[id].run(repo, await buildSnapshot(repo));
}

it('de demo doorloopt level 0 tot en met 2 en opent level 3', async () => {
  const repo = new MockRepoAdapter(null, starterFiles);
  await saveForm(repo, level0, 'l0-setup', { os: 'mac', ai: 'claude-code' });
  await simulate(repo, 'l0-eerste-opdracht');
  await saveForm(repo, level1, 'l1-idee', { wat: 'Medicijnen bezorgen per bakfiets', voorWie: 'Zelfstandige apotheken in Breda', waaromJij: 'Ik was vijf jaar koerier.' });
  await saveForm(repo, level1, 'l1-visie', { wereld: 'Een binnenstad zonder bestelbusjes.', bijdrage: 'Snelle, schone bezorging voor de zorg.' });
  await saveForm(repo, level1, 'l1-madlib', { naam: 'Trapzorg', aanbod: 'bezorging per bakfiets binnen twee uur', doelgroep: 'zelfstandige apotheken in Breda', probleem: 'medicijnen niet op tijd bij patiënten krijgen', usp: 'vaste koeriers die de patiënten kennen' });
  await saveForm(repo, level1, 'l1-aannames', { aannames: '[wens] Apotheken willen bezorging uitbesteden\n[haalbaar] Een bakfiets haalt 20 adressen per dag\n[rendabel] Apotheken betalen 6 euro per bezorging' });
  expect(levelStatus(LEVELS, await buildSnapshot(repo))[1]).toBe('active');
  await simulate(repo, 'l1-propositie');
  expect(levelStatus(LEVELS, await buildSnapshot(repo))[1]).toBe('done');
  await saveForm(repo, level2, 'l2-doelgroep', { waarde: 'Patiënten', gebruiker: 'Apothekersassistenten', betaler: 'De apotheek', beslisser: 'De apotheker-eigenaar', type: 'B2B' });
  await simulate(repo, 'l2-vragen');
  for (let i = 0; i < 4; i++) await simulate(repo, 'l2-interviews');
  expect(levelStatus(LEVELS, await buildSnapshot(repo))[2]).toBe('active');
  await simulate(repo, 'l2-interviews');
  await simulate(repo, 'l2-analyse');
  expect(levelStatus(LEVELS, await buildSnapshot(repo))[2]).toBe('active');
  await simulate(repo, 'l2-canvas');
  expect(levelStatus(LEVELS, await buildSnapshot(repo))).toEqual({ 0: 'done', 1: 'done', 2: 'done', 3: 'active', 4: 'locked', 5: 'locked', 6: 'locked' });
});

it('de demo-interviews hebben een nummer, een rol en het antwoord op de terugbelvraag', async () => {
  const repo = new MockRepoAdapter(null, starterFiles);
  await simulate(repo, 'l2-interviews');
  const snapshot = await buildSnapshot(repo);
  const interview = snapshot.files['level-2-probleemvalidatie/interviews/01-apotheker.md'];
  expect(parseMarkdown(interview).frontmatter).toMatchObject({ rol: 'apotheker', terugbellen: 'ja' });
});

it('de canvasstap in de demo werkt canvas en aannames bij via een gemergde pull request', async () => {
  const repo = new MockRepoAdapter(null, starterFiles);
  expect(SIMULATIONS['l2-canvas'].label).toBe('doet alsof je AI je canvas bijwerkte en jij de pull request mergde');
  await simulate(repo, 'l2-canvas');
  const snapshot = await buildSnapshot(repo);
  expect(snapshot.mergedPullRequests).toBe(1);
  expect(snapshot.files['level-1-idee/vpc.md']).toMatch(/\(bevestigd/);
  expect(snapshot.files['level-1-idee/aannames.md']).toMatch(/\(ontkracht/);
});

it('je eerste opdracht in de demo zet werkplek.md online zonder pull request', async () => {
  const repo = new MockRepoAdapter(null, starterFiles);
  await saveForm(repo, level0, 'l0-setup', { os: 'windows', ai: 'codex' });
  expect(SIMULATIONS['l0-git']).toBeUndefined();
  expect(SIMULATIONS['l0-eerste-opdracht'].label).toBe('doet alsof je AI werkplek.md invulde en jij hem pushte');
  await simulate(repo, 'l0-eerste-opdracht');
  const snapshot = await buildSnapshot(repo);
  expect(snapshot.mergedPullRequests).toBe(0);
  expect(levelStatus(LEVELS, snapshot)[0]).toBe('done');
  expect(snapshot.files['level-0-werkplek/werkplek.md']).not.toMatch(/pull request|branch/i);
});
