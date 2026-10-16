import { describe, expect, it } from 'vitest';
import { MARKER } from '../markdown';
import type { RepoSnapshot } from '../repo/types';
import {
  anyFileIn,
  fileExists,
  fileFilled,
  filledFilesIn,
  frontmatterFilled,
  frontmatterIs,
  frontmatterOf,
  mdFilesIn,
  minFilledFiles,
  minListItems,
  minMergedPullRequests,
  sectionFilled,
} from './checks';

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

describe('frontmatterIs', () => {
  const check = frontmatterIs('gevonden', 'l2-analyse', 'e.md', 'gevonden', 'ja', 'Eerste doelgroep gevonden');
  it('meldt een ontbrekend bestand', () => {
    expect(check.run(snap({}))).toEqual({ ok: false, reason: 'e.md staat nog niet in je repo' });
  });
  it('telt niet zolang de markering erin staat', () => {
    expect(check.run(snap({ 'e.md': `---\ngevonden: ja\n---\n${MARKER}\n# Eerste doelgroep\n\nApothekers.` }))).toEqual({
      ok: false,
      reason: 'e.md is nog niet ingevuld',
    });
  });
  it('slaagt als het veld de gevraagde waarde heeft, ook met hoofdletters of spaties', () => {
    expect(check.run(snap({ 'e.md': '---\ngevonden: ja\n---\n# Eerste doelgroep\n\nApothekers.' }))).toEqual({ ok: true, reason: 'gevonden: ja' });
    expect(check.run(snap({ 'e.md': '---\ngevonden: " Ja "\n---\n# Eerste doelgroep\n\nApothekers.' })).ok).toBe(true);
  });
  it('noemt de waarde die er wel staat', () => {
    expect(check.run(snap({ 'e.md': '---\ngevonden: nee\n---\n# Eerste doelgroep\n\nNog niet.' }))).toEqual({ ok: false, reason: 'gevonden: nee' });
  });
  it('meldt een leeg veld', () => {
    expect(check.run(snap({ 'e.md': '---\ngevonden:\n---\n# Eerste doelgroep\n\nTekst.' }))).toEqual({ ok: false, reason: 'gevonden is nog leeg' });
  });
  it('faalt met een leesbare reden bij kapotte frontmatter', () => {
    expect(check.run(snap({ 'e.md': '---\ngevonden: [ja\n---\n# E\n\nTekst.' }))).toEqual({ ok: false, reason: 'e.md: Frontmatter is geen geldige YAML' });
  });
});

describe('frontmatterFilled', () => {
  const kaart = (fm: string) => `---\n${fm}\n---\n# Testkaart\n\nTekst.`;
  describe('in één bestand', () => {
    const check = frontmatterFilled('kaart', 'l4-testkaart', { path: 'k.md' }, ['hypothese', 'drempel'], 'Testkaart compleet');
    it('slaagt als alle velden een waarde hebben', () => {
      expect(check.run(snap({ 'k.md': kaart('hypothese: ze kopen\ndrempel: 3') }))).toEqual({ ok: true, reason: 'alle velden ingevuld' });
    });
    it('noemt de velden die nog leeg zijn', () => {
      expect(check.run(snap({ 'k.md': kaart('hypothese: "  "\ndrempel:') }))).toEqual({ ok: false, reason: 'nog leeg: hypothese, drempel' });
    });
    it('meldt een ontbrekend bestand', () => {
      expect(check.run(snap({})).reason).toBe('k.md staat nog niet in je repo');
    });
  });
  describe('in minstens zoveel bestanden in een map', () => {
    const check = frontmatterFilled('fb', 'l4-voorstel', { folder: 'fb', min: () => 2 }, ['antwoord'], 'Feedback met antwoord');
    it('telt alleen bestanden waarin de velden zijn ingevuld', () => {
      const files = { 'fb/01-a.md': kaart('antwoord: ja'), 'fb/02-b.md': kaart('antwoord:'), 'fb/README.md': kaart('antwoord: ja') };
      expect(check.run(snap(files))).toEqual({ ok: false, reason: '1 van de 2' });
      expect(check.run(snap({ ...files, 'fb/03-c.md': kaart('antwoord: nee') }))).toEqual({ ok: true, reason: '2 van de 2' });
    });
  });
});

describe('anyFileIn', () => {
  const check = anyFileIn('mvp', 'l3-bouwen', 'mvp', 'MVP in je repo');
  it('faalt met alleen een README', () => {
    expect(check.run(snap({ 'mvp/README.md': '# MVP' }))).toEqual({ ok: false, reason: 'mvp/ is nog leeg' });
  });
  it('slaagt met een bestand van welk type ook, ook in een submap', () => {
    expect(check.run(snap({ 'mvp/flyer.pdf': '%PDF' }))).toEqual({ ok: true, reason: '1 bestand in mvp/' });
    expect(check.run(snap({ 'mvp/site/index.html': '<h1>', 'mvp/foto.jpg': 'x' })).reason).toBe('2 bestanden in mvp/');
  });
  it('kijkt niet naar een map met een naam die er alleen op lijkt', () => {
    expect(check.run(snap({ 'mvp-oud/foto.jpg': 'x', 'mvp/.gitkeep': '' })).ok).toBe(false);
  });
});

describe('fileExists', () => {
  const check = fileExists('fb', 'l1-propositie', 'f.md', 'Feedback op je propositie');
  it('slaagt zodra het bestand er staat', () => {
    expect(check.run(snap({ 'f.md': '# Feedback' }))).toEqual({ ok: true, reason: 'f.md staat in je repo' });
  });
  it('meldt een ontbrekend bestand', () => {
    expect(check.run(snap({}))).toEqual({ ok: false, reason: 'f.md staat nog niet in je repo' });
  });
});

describe('sectionFilled', () => {
  const check = sectionFilled('over', 'l5-agents', 'AGENTS.md', 'Over mijn onderneming', 'Over mijn onderneming ingevuld');
  const agents = (sectie: string) => `# Instructies\n\nAlgemeen.\n\n## Over mijn onderneming\n${sectie}\n## Werkwijze\n\n- Werk in het Nederlands.\n`;
  it('slaagt met tekst onder de kop', () => {
    expect(check.run(snap({ 'AGENTS.md': agents('\nWe bezorgen medicijnen per bakfiets.\n') }))).toEqual({ ok: true, reason: 'Over mijn onderneming is ingevuld' });
  });
  it('telt een HTML-commentaar, een lege regel of een subkop niet als tekst', () => {
    expect(check.run(snap({ 'AGENTS.md': agents('\n<!-- vul dit in level 5 in -->\n\n### Klanten\n') }))).toEqual({
      ok: false,
      reason: 'Onder "Over mijn onderneming" staat nog niets',
    });
  });
  it('telt tekst onder een subkop wel mee', () => {
    expect(check.run(snap({ 'AGENTS.md': agents('\n### Klanten\n\nApotheken in Breda.\n') })).ok).toBe(true);
  });
  it('meldt een ontbrekende kop', () => {
    expect(check.run(snap({ 'AGENTS.md': '# Instructies\n\nTekst.' }))).toEqual({ ok: false, reason: 'AGENTS.md heeft nog geen kop "Over mijn onderneming"' });
  });
  it('meldt een ontbrekend bestand', () => {
    expect(check.run(snap({})).reason).toBe('AGENTS.md staat nog niet in je repo');
  });
});
