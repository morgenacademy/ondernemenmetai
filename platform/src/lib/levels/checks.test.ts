import { describe, expect, it } from 'vitest';
import { MARKER } from '../markdown';
import type { RepoSnapshot } from '../repo/types';
import { fileFilled, filledFilesIn, frontmatterOf, mdFilesIn, minFilledFiles, minListItems, minMergedPullRequests } from './checks';

const snap = (files: Record<string, string>, mergedPullRequests = 0): RepoSnapshot => ({ files, mergedPullRequests });

describe('fileFilled', () => {
  const check = fileFilled('idee', 'l1-idee', 'level-1-idee/idee.md', 'Idee ingevuld');
  it('meldt een ontbrekend bestand', () => {
    expect(check.run(snap({}))).toEqual({ ok: false, reason: 'level-1-idee/idee.md staat nog niet in je repo' });
  });
  it('meldt een bestand met marker', () => {
    expect(check.run(snap({ 'level-1-idee/idee.md': `${MARKER}\n# Idee` })).ok).toBe(false);
  });
  it('slaagt met inhoud', () => {
    expect(check.run(snap({ 'level-1-idee/idee.md': '# Idee\n\nBakfiets.' })).ok).toBe(true);
  });
  it('faalt met een leesbare reden bij kapotte frontmatter', () => {
    expect(check.run(snap({ 'level-1-idee/idee.md': '---\ntype: [B2B\n---\n# Idee\n\nBakfiets.' }))).toEqual({
      ok: false,
      reason: 'level-1-idee/idee.md: Frontmatter is geen geldige YAML',
    });
  });
});

describe('minListItems', () => {
  it('telt lijstregels', () => {
    const check = minListItems('a', 'l1-aannames', 'a.md', 3, 'Drie aannames');
    expect(check.run(snap({ 'a.md': '- een\n- twee' }))).toEqual({ ok: false, reason: '2 van de 3' });
    expect(check.run(snap({ 'a.md': '- een\n- twee\n- drie' })).ok).toBe(true);
  });
});

describe('bestanden in een map', () => {
  const files = {
    'int/README.md': '# Uitleg\n\nTekst',
    'int/01-a.md': '# 1\n\nInhoud',
    'int/02-b.md': `${MARKER}\n# 2`,
    'int/sub/03-c.md': '# 3\n\nInhoud',
    'int/notities.txt': 'tekst',
  };
  it('mdFilesIn negeert README, submappen en niet-md', () => {
    expect(mdFilesIn(snap(files), 'int')).toEqual(['int/01-a.md', 'int/02-b.md']);
  });
  it('filledFilesIn telt alleen ingevulde bestanden', () => {
    expect(filledFilesIn(snap(files), 'int/')).toEqual(['int/01-a.md']);
  });
  it('minFilledFiles gebruikt het gevraagde aantal', () => {
    const check = minFilledFiles('t', 'l2-transcripts', 'int', () => 2, 'Twee interviews');
    expect(check.run(snap(files))).toEqual({ ok: false, reason: '1 van de 2' });
  });
});

describe('minMergedPullRequests', () => {
  it('kijkt naar de PR-teller', () => {
    const check = minMergedPullRequests('pr', 'l0-git', 1, 'PR gemerged');
    expect(check.run(snap({}, 0)).ok).toBe(false);
    expect(check.run(snap({}, 1)).ok).toBe(true);
  });
});

describe('frontmatterOf', () => {
  it('geeft een leeg object bij een ontbrekend bestand', () => {
    expect(frontmatterOf(snap({}), 'x.md')).toEqual({});
  });
  it('leest de velden', () => {
    expect(frontmatterOf(snap({ 'x.md': '---\ntype: B2C\n---\nTekst' }), 'x.md')).toEqual({ type: 'B2C' });
  });
});
