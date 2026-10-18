import { describe, expect, it } from 'vitest';
import { gesprekkenVan } from '../../beleving/gesprekken';
import { INTERVIEWS_DIR } from '../levels/level2';
import { parseMarkdown } from '../markdown';
import script from '../../../../starter-repo/skills/transcriberen/uitschrijven.py?raw';
import { starterFiles } from './starterFiles';

const skill = starterFiles['skills/transcriberen/SKILL.md'];

/** Het blok tussen `# /// script` en `# ///` bovenaan het script: dat leest uv voor Python en de pakketten. */
const metadata = script.match(/^# \/\/\/ script\n([\s\S]*?)^# \/\/\/$/m)?.[1].replace(/^# ?/gm, '') ?? '';
const pakketten = [...(metadata.match(/dependencies = \[([\s\S]*?)\]/)?.[1] ?? '').matchAll(/"([^"]+)"/g)].map((m) => m[1]);

describe('skill transcriberen', () => {
  it('gaat aan op "Schrijf mijn nieuwe interviews uit" en leest uit interviews/', () => {
    const { frontmatter } = parseMarkdown(skill);
    expect(frontmatter.description).toContain('Schrijf mijn nieuwe interviews uit');
    expect(frontmatter.description).toContain('level-2-probleemvalidatie/interviews/');
  });

  it('installeert Whisper niet meer via Homebrew of pip, maar draait het script naast de skill met uv', () => {
    expect(skill).not.toMatch(/brew install|pip install|openai-whisper/);
    expect(skill).toContain('uv run skills/transcriberen/uitschrijven.py level-2-probleemvalidatie/interviews/');
    expect(skill).toContain('--woorden');
  });

  it('je AI installeert uv als het ontbreekt; de eigenaar keurt goed en typt zelf niets in de terminal', () => {
    expect(skill).toContain('uv --version');
    expect(skill).toMatch(/curl -LsSf https:\/\/astral\.sh\/uv\/\d+\.\d+\.\d+\/install\.sh \| sh/);
    expect(skill).toMatch(/irm https:\/\/astral\.sh\/uv\/\d+\.\d+\.\d+\/install\.ps1 \| iex/);
    expect(skill).toMatch(/toestemming/);
    expect(skill).toContain('typt zelf niets in de terminal');
  });

  it('legt uit wat de eerste keer ongeveer 900 MB downloadt: Python, de pakketten en het model', () => {
    const regel = skill.split('\n').find((r) => r.includes('900 MB')) ?? '';
    expect(regel, 'een regel met 900 MB').not.toBe('');
    for (const deel of ['Python', 'pakketten', 'model']) expect(skill, deel).toMatch(new RegExp(`${deel}[^\\n]*\\d+ MB`));
  });

  it('hernoemt opname en .md naar NN-rol-plaats', () => {
    expect(skill).toContain('NN-rol-plaats.md');
    const md = skill.match(/`(\d{2}-[a-z-]+)\.md`/)?.[1];
    expect(md, 'een voorbeeldnaam als 03-apotheker-breda.md').toBeDefined();
    expect(skill).toContain(`\`${md}.m4a\``);
  });

  it('het voorbeeld in de skill vult een vak op het platform: rol, plaats, datum, duur en uitspraak', () => {
    const voorbeeld = skill.match(/```markdown\n(---\n[\s\S]*?)```/)?.[1] ?? '';
    const { frontmatter: fm, error } = parseMarkdown(voorbeeld);
    expect(error).toBeUndefined();
    expect(typeof fm.rol).toBe('string');
    expect(typeof fm.locatie).toBe('string');
    expect(fm.datum).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(typeof fm.duur).toBe('number');
    expect(typeof fm.uitspraak).toBe('string');

    // Je AI vult de secties; met alleen koppen telt een bestand nog niet als gevuld.
    const interview = `${voorbeeld}\nIk zet elke ochtend de spoedrecepten klaar.\n`;
    const pad = `${INTERVIEWS_DIR}/03-apotheker-breda.md`;
    const [vak] = gesprekkenVan({ files: { ...starterFiles, [pad]: interview }, mergedPullRequests: 0 }, '2026-10-18').vol;
    expect(vak.wie).toContain(fm.locatie as string);
    expect(vak.wanneer).toMatch(new RegExp(`· ${fm.duur} min$`));
    expect(vak.uitspraak).toBe(fm.uitspraak);
  });

  it('zegt de eigenaar bij elke stap wat jij doet en wat zij nu moeten doen, tot "Je hoeft niets meer te doen"', () => {
    const zeggen = skill.split('## Zeg steeds wie wat doet')[1]?.split('\n## ')[0] ?? '';
    expect(zeggen, 'een sectie "Zeg steeds wie wat doet"').not.toBe('');
    for (const moment of ['Toestaan', 'Je hoeft nu niets te doen', 'klopt', 'Je hoeft niets meer te doen', 'Push origin']) expect(zeggen, moment).toContain(moment);
  });

  it('legt vast en pusht zelf, zonder pull request', () => {
    const afronden = skill.split('## Afronden')[1] ?? '';
    expect(afronden).toContain('git push');
    expect(afronden).toMatch(/zonder pull request/);
    expect(afronden).not.toMatch(/Vraag de eigenaar te pushen/);
  });
});

describe('uitschrijven.py', () => {
  it('zet alle versies vast: Python 3.12, faster-whisper en PyAV onder 19, en een vaste datum voor de rest', () => {
    expect(metadata).toMatch(/requires-python = "==3\.12\.\*"/);
    expect(pakketten.map((p) => p.split('==')[0]).sort()).toEqual(['av', 'faster-whisper']);
    for (const p of pakketten) expect(p, p).toMatch(/^[a-z-]+==\d+\.\d+\.\d+$/);
    const av = pakketten.find((p) => p.startsWith('av=='));
    expect(Number(av?.split('==')[1].split('.')[0])).toBeLessThan(19);
    expect(metadata).toMatch(/exclude-newer = "\d{4}-\d{2}-\d{2}T00:00:00Z"/);
  });

  it('schrijft uit met het model small op de processor (int8), in het Nederlands, met vakwoorden als initial_prompt', () => {
    expect(script).toMatch(/default="small"/);
    expect(script).toContain('device="cpu"');
    expect(script).toContain('compute_type="int8"');
    expect(script).toContain('language="nl"');
    expect(script).toMatch(/initial_prompt=/);
    expect(script).toContain('--woorden');
  });

  it('zet het transcript naast de opname en meldt de duur in minuten, voor de frontmatter', () => {
    expect(script).toMatch(/with_suffix\("\.txt"\)/);
    expect(script).toMatch(/duur: \{[^}]+\} min/);
  });
});
