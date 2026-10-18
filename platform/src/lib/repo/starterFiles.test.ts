import { describe, expect, it } from 'vitest';
import { MARKER, parseMarkdown } from '../markdown';
import gitignore from '../../../../starter-repo/.gitignore?raw';
import { starterFiles } from './starterFiles';

const sectie = (kop: string) => starterFiles['AGENTS.md'].split(`## ${kop}`)[1]?.split('\n## ')[0] ?? '';

const TEMPLATES = [
  'level-0-werkplek/werkplek.md',
  'level-1-idee/idee.md',
  'level-1-idee/visie.md',
  'level-1-idee/madlib.md',
  'level-1-idee/aannames.md',
  'level-1-idee/vpc.md',
  'level-2-probleemvalidatie/doelgroep.md',
  'level-2-probleemvalidatie/interviewvragen.md',
  'level-2-probleemvalidatie/analyse.md',
  'level-2-probleemvalidatie/eerste-doelgroep.md',
  'level-3-prototype/oplossingen.md',
  'level-3-prototype/oplossing.md',
  'level-3-prototype/waardepropositie.md',
  'level-3-prototype/mvp.md',
  'level-4-marktfeedback/prijs.md',
  'level-5-productvalidatie/product.md',
  'level-5-productvalidatie/bmc.md',
  'level-6-lancering/klanten.md',
  'level-6-lancering/pijplijn.md',
  'level-6-lancering/impact.md',
];

const MAPPEN = [
  'level-3-prototype/mvp/README.md',
  'level-4-marktfeedback/testkaarten/README.md',
  'level-4-marktfeedback/feedback/README.md',
  'level-4-marktfeedback/resultaten/README.md',
];

describe('starter-repo', () => {
  it('bevat README, AGENTS.md, CLAUDE.md en alle templates', () => {
    for (const path of ['README.md', 'AGENTS.md', 'CLAUDE.md', 'level-2-probleemvalidatie/interviews/README.md', ...MAPPEN, ...TEMPLATES]) {
      expect(starterFiles[path], path).toBeDefined();
    }
  });

  it('elk template bevat de marker precies één keer', () => {
    for (const path of TEMPLATES) {
      expect(starterFiles[path].split(MARKER).length - 1, path).toBe(1);
    }
  });

  it('geen ander bestand bevat de marker', () => {
    for (const [path, text] of Object.entries(starterFiles)) {
      if (!TEMPLATES.includes(path)) expect(text.includes(MARKER), path).toBe(false);
    }
  });

  it('AGENTS.md laat de eigenaar via GitHub Desktop pushen', () => {
    expect(sectie('Werkwijze')).toContain('Leg wijzigingen vast met een duidelijke commit; de eigenaar pusht via GitHub Desktop.');
    expect(starterFiles['AGENTS.md']).not.toContain('Branches en pull requests komen in een later level.');
  });

  it('AGENTS.md: vanaf level 2 gaan keuzes via een pull request en komt materiaal direct in de repo', () => {
    const regel = sectie('Keuzes en materiaal');
    expect(regel).toContain('level-2-probleemvalidatie/doelgroep.md');
    expect(regel).toMatch(/Keuzes van de eigenaar, via een pull request:[^\n]*madlib[^\n]*canvas[^\n]*aannames[^\n]*doelgroep/);
    expect(regel).toMatch(/Materiaal en uitwerkingen, direct:[^\n]*interviews[^\n]*analyses/);
    expect(regel).toMatch(/branch/);
    expect(regel).toMatch(/Tot die tijd[^\n]*direct/);
  });

  it('AGENTS.md beantwoordt "Is alles in sync?" in één zin, met opnames/ als map die bewust lokaal blijft', () => {
    const regel = sectie('Werkwijze').split('\n').find((r) => r.includes('Is alles in sync?')) ?? '';
    expect(regel).toMatch(/in één zin/);
    expect(regel).toMatch(/alleen op (de|je) computer/);
    expect(regel).toMatch(/GitHub/);
    expect(regel).toContain('`opnames/`');
  });

  it('AGENTS.md laat de AI de frontmatter van elk SKILL.md lezen, zonder lijst met losse skills', () => {
    const skills = sectie('Skills');
    expect(skills).toMatch(/frontmatter van elk `SKILL\.md`/);
    expect(skills).not.toMatch(/skills\/[a-z-]+\/SKILL\.md/);
  });

  it('AGENTS.md beschrijft vpc.md, eerste-doelgroep.md en de lokale map opnames/', () => {
    const opbouw = sectie('Hoe deze repo in elkaar zit');
    for (const deel of ['vpc.md', 'eerste-doelgroep.md', '`opnames/`']) expect(opbouw, deel).toContain(deel);
  });

  it('AGENTS.md heeft een lege sectie "Over mijn onderneming" voor level 5', () => {
    const over = sectie('Over mijn onderneming');
    expect(over).toMatch(/<!--[^>]*level 5[^>]*-->/);
    expect(over.replace(/<!--[\s\S]*?-->/g, '').trim()).toBe('');
  });

  it('AGENTS.md beschrijft de mappen van level 3 tot en met 6', () => {
    const opbouw = sectie('Hoe deze repo in elkaar zit');
    for (const map of ['level-3-prototype/', 'level-4-marktfeedback/', 'level-5-productvalidatie/', 'level-6-lancering/']) expect(opbouw, map).toContain(map);
  });

  it('product.md heeft lege velden besluit en volgende_stap', () => {
    expect(parseMarkdown(starterFiles['level-5-productvalidatie/product.md']).frontmatter).toEqual({ besluit: null, volgende_stap: null });
  });

  it('.gitignore houdt opnames in interviews/ buiten git; alleen het uitgeschreven .md-bestand gaat naar GitHub', () => {
    const regels = gitignore.split('\n').map((r) => r.trim());
    for (const soort of ['m4a', 'mp3', 'wav', 'mp4']) expect(regels, soort).toContain(`level-2-probleemvalidatie/interviews/*.${soort}`);
    expect(regels.filter((r) => r.includes('interviews/') && r.endsWith('.md'))).toEqual([]);
  });

  it('.gitignore houdt de map opnames/ buiten git', () => {
    expect(gitignore.split('\n').map((r) => r.trim())).toContain('opnames/');
  });

  it('vpc.md heeft een klantkant en een aanbodkant, met aannames', () => {
    const vpc = starterFiles['level-1-idee/vpc.md'];
    for (const kop of ['Klantkant', 'Jobs', 'Pains', 'Gains', 'Aanbodkant', 'Producten en diensten', 'Pain relievers', 'Gain creators']) {
      expect(vpc, kop).toMatch(new RegExp(`^#+ ${kop}$`, 'm'));
    }
    expect(vpc).toContain('(aanname)');
  });

  it('eerste-doelgroep.md heeft lege velden gevonden, doelgroep en probleem', () => {
    const parsed = parseMarkdown(starterFiles['level-2-probleemvalidatie/eerste-doelgroep.md']);
    expect(parsed.error).toBeUndefined();
    expect(parsed.frontmatter).toEqual({ gevonden: null, doelgroep: null, probleem: null });
  });

  it('AGENTS.md laat de AI elke sessie eerst de nieuwste versie ophalen', () => {
    const werkwijze = starterFiles['AGENTS.md'].split('## Werkwijze')[1]?.split('\n## ')[0] ?? '';
    expect(werkwijze).toContain('`git pull`');
    expect(werkwijze).toMatch(/conflict/i);
    expect(werkwijze).toMatch(/in één zin/);
  });

  it('het werkplek-template gaat niet meer over branches en pull requests', () => {
    expect(starterFiles['level-0-werkplek/werkplek.md']).not.toMatch(/pull request|branch/i);
  });

  it('CLAUDE.md importeert AGENTS.md', () => {
    expect(starterFiles['CLAUDE.md'].trim()).toBe('@AGENTS.md');
  });

  it('doelgroep.md heeft geldige frontmatter met alleen het type, zodat het aantal interviews meegaat met B2B of B2C', () => {
    const parsed = parseMarkdown(starterFiles['level-2-probleemvalidatie/doelgroep.md']);
    expect(parsed.error).toBeUndefined();
    expect(parsed.frontmatter).toEqual({ type: 'B2B' });
  });
});
