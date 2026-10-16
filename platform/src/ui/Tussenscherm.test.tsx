import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { level1 } from '../lib/levels/level1';
import { level2 } from '../lib/levels/level2';
import { level6 } from '../lib/levels/level6';
import { Tussenscherm, afgerondLevel } from './Tussenscherm';

describe('Tussenscherm', () => {
  const html = renderToStaticMarkup(<Tussenscherm level={level1} volgende={level2} onVolgende={() => {}} onTerug={() => {}} />);

  it('viert het level met wat je gehaald hebt, je mijlpaal en wat je leerde', () => {
    expect(html).toContain('Level 1 af');
    expect(html).toContain(level1.doel);
    expect(html).toContain(level1.milestone);
    expect(html).toContain('Ophalen (pull)');
    expect(html).toContain('level-1-idee/vpc.md');
  });

  it('laat het volgende level zien, met zijn vraag en doel, en een knop erheen', () => {
    expect(html).toContain('Level 2 · Probleem-validatie');
    expect(html).toContain(level2.vraag);
    expect(html).toContain(level2.doel);
    expect(html).toMatch(/<button[^>]*class="btn-p"[^>]*>Naar level 2<\/button>/);
    expect(html).toContain('Terug naar level 1');
  });

  it('na level 6 wijst het naar module 2', () => {
    const laatste = renderToStaticMarkup(<Tussenscherm level={level6} onTerug={() => {}} />);
    expect(laatste).toContain('Proof of Concept');
    expect(laatste).toContain('module 2');
    expect(laatste).not.toContain('Naar level');
  });

  it('afgerondLevel ziet alleen een level dat net af werd', () => {
    expect(afgerondLevel({ 1: 'active' }, { 1: 'done' }, 1)).toBe(1);
    expect(afgerondLevel({ 1: 'done' }, { 1: 'done' }, 1)).toBeNull();
    expect(afgerondLevel(null, { 1: 'done' }, 1)).toBeNull();
    expect(afgerondLevel({ 1: 'active', 2: 'locked' }, { 1: 'active', 2: 'locked' }, 1)).toBeNull();
  });
});
