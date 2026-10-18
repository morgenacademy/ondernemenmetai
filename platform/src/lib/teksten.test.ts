import { describe, expect, it } from 'vitest';
import { BELEVING } from '../beleving/beleving';
import { KORT } from '../beleving/kort';
import { PLEK_LABEL } from '../ui/labels';
import { stepContent } from './content';
import { LEVELS } from './levels';
import { starterFiles } from './repo/starterFiles';

// Wat een deelnemer leest, in de tekst van de stap, de korte zin, de beleving en de skills van hun AI.
const stappen = LEVELS.flatMap((l) => l.steps.map((s) => ({ level: l.id, step: s, tekst: stepContent(l.id, s.id) ?? '' })));
const skills = Object.entries(starterFiles).filter(([pad]) => pad.startsWith('skills/'));
const opHetPlatform = [
  ...stappen.map(({ step, tekst }) => [step.id, tekst] as const),
  ...Object.entries(KORT),
  ...Object.entries(BELEVING).map(([id, b]) => [`beleving ${id}`, JSON.stringify(b)] as const),
  ...stappen.map(({ step }) => [`titel ${step.id}`, step.title] as const),
];
const voorJeAi = Object.entries(starterFiles);

// Stappen waar je AI iets direct in je repo zet, dat jij daarna op GitHub zet. Keuzes gaan via een pull request, interviews pusht je AI zelf.
const VIA_PULL_REQUEST = ['l2-canvas', 'l3-verwoorden', 'l5-doorontwikkelen', 'l5-agents', 'l6-verkoopaanpak'];
const ZELF_GEPUSHT = ['l2-interviews'];

describe('concrete teksten', () => {
  it('noemt het nergens "het platform": op de site is het "hier", voor je AI "Ondernemen met AI"', () => {
    for (const [waar, tekst] of [...opHetPlatform, ...voorJeAi]) expect(tekst, waar).not.toMatch(/\bhet platform\b/i);
    expect(PLEK_LABEL.platform).toBe('Hier');
  });

  it('op de site praat de site over zichzelf als "dit platform", niet als "Ondernemen met AI" in de derde persoon', () => {
    for (const [waar, tekst] of opHetPlatform) expect(tekst.replace(/[Dd]it platform<?\/?b?>?, Ondernemen met AI,/g, ''), waar).not.toContain('Ondernemen met AI');
  });

  it('zegt geen "straks": het zegt wanneer', () => {
    for (const [waar, tekst] of [...opHetPlatform, ...skills]) expect(tekst, waar).not.toMatch(/\bstraks\b/i);
  });

  it('een stap gaat niet "af": hij krijgt een vinkje', () => {
    for (const [waar, tekst] of [...opHetPlatform, ...voorJeAi]) expect(tekst, waar).not.toMatch(/\bgaat (vanzelf )?af\b/);
  });

  it('"stap 4" zegt van welk level', () => {
    for (const [waar, tekst] of opHetPlatform) expect(tekst, waar).not.toMatch(/\b[Ii]n stap \d+(?! van (dit level|level \d))/);
  });

  it('na elke AI-stap staat wie het op GitHub zet en wat er dan gebeurt', () => {
    const direct = stappen.filter(({ level, step }) => level > 0 && step.aiPrompt && !step.optional && !VIA_PULL_REQUEST.includes(step.id) && !ZELF_GEPUSHT.includes(step.id));
    expect(direct.length).toBeGreaterThan(8);
    for (const { step, tekst } of direct) {
      expect(tekst, step.id).toContain('**Push origin**');
      expect(tekst, step.id).toContain('vraag je AI om te pushen');
      expect(tekst, step.id).toMatch(/vinkje/);
    }
  });

  it('een skill die de eigenaar laat pushen, zegt dat je AI het ook kan en welke stap dan een vinkje krijgt', () => {
    for (const [pad, tekst] of skills) {
      expect(tekst, pad).not.toMatch(/vraag de eigenaar te pushen/);
      if (!/of vraag mij om te pushen/.test(tekst) || pad.includes('idee-generator')) continue;
      expect(tekst, pad).toMatch(/de stap '[^']+' een vinkje in Ondernemen met AI/);
    }
    const metPush = skills.filter(([, tekst]) => /of vraag mij om te pushen/.test(tekst)).length;
    expect(metPush).toBeGreaterThanOrEqual(10);
  });

  it('AGENTS.md: je AI pusht als de eigenaar erom vraagt', () => {
    expect(starterFiles['AGENTS.md']).toMatch(/Vraagt de eigenaar je om te pushen, doe dat dan met `git push`/);
  });
});
