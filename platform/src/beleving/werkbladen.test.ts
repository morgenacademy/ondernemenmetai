import { describe, expect, it } from 'vitest';
import { evaluateLevel } from '../lib/levels/evaluate';
import { level1 } from '../lib/levels/level1';
import { level2 } from '../lib/levels/level2';
import type { LevelDef } from '../lib/levels/types';
import { toMarkdown } from '../lib/markdown';
import { starterFiles } from '../lib/repo/starterFiles';
import { stapStatussen } from './voortgang';
import { afRegel, bordVan, slotRedenen, werkbladNaam } from './werkbladen';

const snap = (files: Record<string, string> = {}, mergedPullRequests = 0) => ({ files: { ...starterFiles, ...files }, mergedPullRequests });
const bord = (level: LevelDef, files: Record<string, string> = {}) => {
  const s = snap(files);
  return bordVan(level, stapStatussen(level, evaluateLevel(level, s), new Set(), false));
};
const ids = (werkbladen: { id: string }[]) => werkbladen.map((w) => w.id);

const IDEE = { 'level-1-idee/idee.md': '# Idee\n\n## Wat ga ik doen?\n\nSpoedbezorging per bakfiets\n\n## Voor wie?\n\nApotheken\n' };
const VISIE = { 'level-1-idee/visie.md': '# Visie\n\nSchone binnenstad.\n' };
const DOELGROEP = (type: string) => ({ 'level-2-probleemvalidatie/doelgroep.md': toMarkdown({ type }, '# Doelgroep\n\nApotheken.') });
const VRAGEN = { 'level-2-probleemvalidatie/interviewvragen.md': '# Interviewvragen\n\n5. Hoe gaat het nu?\n' };
const gesprekken = (n: number) =>
  Object.fromEntries(Array.from({ length: n }, (_, i) => [`level-2-probleemvalidatie/interviews/0${i + 1}-apotheker.md`, '# Interview\n\nInhoud.\n']));

describe('van stap naar werkblad', () => {
  it('aan het begin is de eerste stap het werkblad, en ligt de rest op slot', () => {
    const b = bord(level1);
    expect(b.af).toEqual([]);
    expect(b.nu?.id).toBe('l1-idee');
    expect(ids(b.straks)).toEqual(['l1-visie', 'l1-madlib', 'l1-aannames', 'l1-propositie']);
  });

  it('wat af is, komt bovenaan; de stap waar je bent is het werkblad', () => {
    const b = bord(level1, { ...IDEE, ...VISIE });
    expect(ids(b.af)).toEqual(['l1-idee', 'l1-visie']);
    expect(b.nu?.id).toBe('l1-madlib');
    expect(ids(b.straks)).toEqual(['l1-aannames', 'l1-propositie']);
  });

  it('een optionele stap is geen werkblad: die staat als omlijnde regel bovenaan', () => {
    const b = bord(level1);
    expect(b.opties.map((s) => s.id)).toEqual(['l1-ideeen']);
    expect([...b.af, b.nu, ...b.straks].map((w) => w?.id)).not.toContain('l1-ideeen');
  });

  it('twee stappen met dezelfde check worden één werkblad: je gesprekken', () => {
    const b = bord(level2, { ...DOELGROEP('B2B'), ...VRAGEN });
    expect(b.nu?.id).toBe('l2-interviews');
    expect(b.nu?.stappen.map((s) => s.id)).toEqual(['l2-interviewen', 'l2-interviews']);
    expect(ids(b.straks)).toEqual(['l2-analyse', 'l2-canvas']);
  });

  it('zijn de gesprekken binnen, dan staan ze als één regel bovenaan', () => {
    const b = bord(level2, { ...DOELGROEP('B2B'), ...VRAGEN, ...gesprekken(5) });
    expect(ids(b.af)).toEqual(['l2-doelgroep', 'l2-vragen', 'l2-interviews']);
    expect(b.nu?.id).toBe('l2-analyse');
  });

  it('is het level af, dan is er geen werkblad meer en ligt er niets op slot', () => {
    const s = snap();
    const b = bordVan(level1, stapStatussen(level1, evaluateLevel(level1, s), new Set(), true));
    expect(b.nu).toBeNull();
    expect(b.straks).toEqual([]);
    expect(b.af).toHaveLength(5);
  });
});

describe('de reden op het slotje', () => {
  it('alles op slot wacht op de stap van nu: met nummer en wat je daar doet', () => {
    const s = snap({ ...IDEE, ...VISIE });
    const b = bordVan(level1, stapStatussen(level1, evaluateLevel(level1, s), new Set(), false));
    const slot = { nummer: 3, reden: 'Eerst stap 3 van dit level: vat je idee samen in één zin.' };
    expect(slotRedenen(level1, b, s)).toEqual({ 'l1-aannames': slot, 'l1-propositie': slot });
  });

  it('is het level af, dan is er niets op slot', () => {
    const s = snap();
    const b = bordVan(level1, stapStatussen(level1, evaluateLevel(level1, s), new Set(), true));
    expect(slotRedenen(level1, b, s)).toEqual({});
  });

  it('bij je gesprekken telt het slotje af: nog 2 gesprekken, nog 1 gesprek', () => {
    const files = { ...DOELGROEP('B2B'), ...VRAGEN, ...gesprekken(3) };
    const s = snap(files);
    const b = bordVan(level2, stapStatussen(level2, evaluateLevel(level2, s), new Set(), false));
    const slot = { nummer: 3, reden: 'Eerst stap 3 van dit level: nog 2 gesprekken.' };
    expect(slotRedenen(level2, b, s)).toEqual({ 'l2-analyse': slot, 'l2-canvas': slot });

    const s4 = snap({ ...files, ...gesprekken(4) });
    const b4 = bordVan(level2, stapStatussen(level2, evaluateLevel(level2, s4), new Set(), false));
    expect(slotRedenen(level2, b4, s4)['l2-analyse'].reden).toBe('Eerst stap 3 van dit level: nog 1 gesprek.');
  });

  it('verkoop je aan consumenten, dan telt het af vanaf 15', () => {
    const s = snap({ ...DOELGROEP('B2C'), ...VRAGEN, ...gesprekken(3) });
    const b = bordVan(level2, stapStatussen(level2, evaluateLevel(level2, s), new Set(), false));
    expect(slotRedenen(level2, b, s)['l2-canvas'].reden).toBe('Eerst stap 3 van dit level: nog 12 gesprekken.');
  });
});

describe('namen en regels', () => {
  it('een werkblad heet naar wat erop staat', () => {
    expect(werkbladNaam('l1-madlib')).toBe('Je idee in één zin');
    expect(werkbladNaam('l2-interviews')).toBe('Je gesprekken');
    expect(werkbladNaam('l2-canvas')).toBe('Je canvas');
  });

  it('de regel van je idee laat zien wat je gaat doen', () => {
    expect(afRegel('l1-idee', snap(IDEE))).toBe('Je idee: spoedbezorging per bakfiets');
    expect(afRegel('l1-visie', snap(VISIE))).toBe('Je visie');
  });

  it('de regel van je doelgroep laat zien hoeveel gesprekken dat betekent', () => {
    expect(afRegel('l2-doelgroep', snap(DOELGROEP('B2B')))).toBe('Je doelgroep · bedrijven, dus 5 gesprekken');
    expect(afRegel('l2-doelgroep', snap(DOELGROEP('B2C')))).toBe('Je doelgroep · consumenten, dus 15 gesprekken');
  });
});
