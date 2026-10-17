import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { evaluateLevel } from '../lib/levels/evaluate';
import { SETUP_PATH, WERKPLEK_PATH, level0 } from '../lib/levels/level0';
import { level1 } from '../lib/levels/level1';
import { toMarkdown } from '../lib/markdown';
import { starterFiles } from '../lib/repo/starterFiles';
import type { RepoSnapshot } from '../lib/repo/types';
import { LevelScherm } from './LevelScherm';
import { StapVenster } from './StapVenster';
import { stapStatussen } from './voortgang';

const snap = (files: Record<string, string> = {}): RepoSnapshot => ({ files: { ...starterFiles, ...files }, mergedPullRequests: 0 });
const KLAAR = {
  [SETUP_PATH]: toMarkdown({ os: 'windows', ai: 'codex' }, '# Mijn setup\n\nWindows'),
  [WERKPLEK_PATH]: '# Mijn werkplek\n\nIngevuld.\n',
};
const noop = async () => true;

const scherm = (files: Record<string, string>, handmatig: string[] = [], levelAf = false) =>
  renderToStaticMarkup(
    <LevelScherm level={level0} snapshot={snap(files)} levelAf={levelAf} handmatig={new Set(handmatig)} onHandmatig={() => {}} onSave={noop} onDemo={() => {}} onFillLevel={() => {}} />,
  );
const kaarten = (html: string) => [...html.matchAll(/<button[^>]*class="bl-stapkaart ([^"]+)"([^>]*)>[\s\S]*?<h3>([^<]+)<\/h3>/g)].map((m) => ({ staat: m[1], attrs: m[2], titel: m[3] }));

describe('LevelScherm, level 0', () => {
  const html = scherm({});

  it('opent met het basiskamp en de drie scènes', () => {
    expect(html).toContain('>Eerst je basiskamp.</h1>');
    for (const kop of ['De patronen ontstonden in je hoofd.', 'Je AI kijkt mee.', 'Die plek heet een repo.']) expect(html).toContain(kop);
    expect(html).toContain('kort voor repository, Engels voor bewaarplaats');
  });

  it('heeft acht stapkaarten in de nieuwe volgorde, in een licht blok', () => {
    expect(html).toMatch(/<section class="bl-stappen licht"/);
    expect(kaarten(html).map((k) => k.titel)).toEqual(level0.steps.map((s) => s.title));
  });

  it('de eerste stap is aan de beurt; latere stappen zijn grijs en nog niet te openen', () => {
    const [eerste, tweede] = kaarten(html);
    expect(eerste.staat).toBe('nu');
    expect(eerste.attrs).not.toContain('disabled');
    expect(tweede.staat).toBe('straks');
    expect(tweede.attrs).toContain('disabled');
    expect(tweede.attrs).toContain('title="Eerst stap 1"');
  });

  it('elke kaart zegt waar je de stap doet', () => {
    expect(html).toContain('<span class="bl-plek">GitHub</span>');
    expect(html).toContain('<span class="bl-plek hier">Hier op het platform</span>');
  });

  it('een stap die je zelf afvinkt is klaar, en dan is de volgende aan de beurt', () => {
    const [eerste, tweede] = kaarten(scherm({}, ['l0-account']));
    expect(eerste.staat).toBe('af');
    expect(tweede.staat).toBe('nu');
  });

  it('het slotscherm laat zien hoe je basiskamp straks staat, met de knop nog uit', () => {
    expect(html).toContain('Zo staat je basiskamp straks.');
    expect(html).toMatch(/<a class="bl-knop" href="#\/route\?van=0" aria-disabled="true"[^>]*>Op naar je idee →<\/a>/);
    expect(html).toContain('Nog 8 stappen; daarna kun je verder.');
  });

  it('is het level afgerond, dan staat je basiskamp en kun je naar je route', () => {
    const af = scherm(KLAAR, [], true);
    expect(af).toContain('Je basiskamp staat.');
    expect(af).toContain('Level 0 · Afgerond');
    expect(af).toMatch(/<a class="bl-knop" href="#\/route\?van=0" aria-disabled="false"/);
    expect(af.match(/<li class="ja">/g)).toHaveLength(5);
  });
});

describe('StapVenster', () => {
  const venster = (stepId: string, files: Record<string, string> = {}, handmatig: string[] = []) => {
    const level = stepId.startsWith('l1') ? level1 : level0;
    const s = snap(files);
    const step = level.steps.find((x) => x.id === stepId)!;
    const evaluation = evaluateLevel(level, s);
    const status = stapStatussen(level, evaluation, new Set(handmatig), false);
    return renderToStaticMarkup(
      <StapVenster level={level} step={step} status={status[step.id]} snapshot={s} evaluation={evaluation} setup={{ os: 'mac', ai: 'claude-code' }} onSave={noop} onKlaar={() => {}} onSluit={() => {}} />,
    );
  };

  it('is een dialoog met de stap, waar je hem doet en welke stap het is', () => {
    const html = venster('l0-account');
    expect(html).toMatch(/<dialog[^>]*class="bl-open licht"[^>]*aria-labelledby="bl-venster-titel"/);
    expect(html).toContain('Stap 1 van 8');
    expect(html).toContain('<span class="bl-plek">GitHub</span>');
    expect(html).toMatch(/<h3 id="bl-venster-titel" tabindex="-1">Maak een GitHub-account<\/h3>/);
  });

  it('een stap buiten het platform toont het scherm en een knop die die plek opent', () => {
    const html = venster('l0-account');
    expect(html).toContain('Sign up for GitHub');
    expect(html).toMatch(/<a[^>]*href="https:\/\/github.com\/signup"[^>]*target="_blank"[^>]*rel="noopener noreferrer"/);
    expect(html).toMatch(/<button[^>]*class="bl-vknop p"[^>]*>Klaar, ik heb een account<\/button>/);
  });

  it('een platformstap heeft links de echte bediening, en gaat pas door als de check klopt', () => {
    const html = venster('l0-setup', {}, ['l0-account', 'l0-repo', 'l0-koppelen']);
    expect(html).toMatch(/<div class="bl-groot">[\s\S]*<select/);
    expect(html).toMatch(/<button[^>]*class="bl-vknop p"[^>]*disabled=""/);
    expect(html).toContain('Dit gaat vanzelf door zodra de check hieronder klopt.');
  });

  it('koppelen laat zien waar je bent: eerst hier op het platform', () => {
    const html = venster('l0-koppelen', {}, ['l0-account', 'l0-repo']);
    expect(html).toContain('1 · Hier op het platform');
    expect(html).toMatch(/<button[^>]*>Verbind met GitHub<\/button>/);
  });

  it('koppelen sla je niet over: verder kan pas als het gelukt is', () => {
    const html = venster('l0-koppelen', {}, ['l0-account', 'l0-repo']);
    expect(html).toMatch(/<button[^>]*class="bl-vknop p"[^>]*disabled=""[^>]*>Volgende stap<\/button>/);
    expect(html).toContain('Rond eerst de stappen links af; daarna gaat dit vanzelf door.');
  });
});
