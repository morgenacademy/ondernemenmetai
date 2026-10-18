import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { LEVELS } from '../lib/levels';
import { evaluateLevel } from '../lib/levels/evaluate';
import type { LevelState } from '../lib/levels/types';
import { toMarkdown } from '../lib/markdown';
import { starterFiles } from '../lib/repo/starterFiles';
import { BELEVING } from './beleving';
import { ZoVulJeEenVak } from './GesprekkenWerkblad';
import { LevelScherm } from './LevelScherm';

const level = (id: number) => LEVELS.find((l) => l.id === id)!;
const status = (actief: number): Record<number, LevelState> =>
  Object.fromEntries(LEVELS.map((l) => [l.id, l.id < actief ? 'done' : l.id === actief ? 'active' : 'locked']));
const niets = () => {};

const render = (id: number, files: Record<string, string> = {}, state: LevelState = 'active') => {
  const l = level(id);
  const snapshot = { files: { ...starterFiles, ...files }, mergedPullRequests: 0 };
  const st = { ...status(id), [id]: state };
  return renderToStaticMarkup(
    <LevelScherm
      level={l}
      state={state}
      status={st}
      snapshot={snapshot}
      evaluation={evaluateLevel(l, snapshot)}
      handmatig={new Set()}
      onHandmatig={niets}
      onSave={async () => true}
      onDemoStap={niets}
      onFillLevel={niets}
      onNaarRoute={niets}
      onVervers={niets}
    />,
  );
};

/** De stukken html van elk gesloten werkblad. */
const gesloten = (html: string) => html.split('class="bl-gesloten').slice(1).map((d) => d.slice(0, d.indexOf('</section>')));

const IDEE = { 'level-1-idee/idee.md': '# Idee\n\n## Wat ga ik doen?\n\nMedicijnen bezorgen per bakfiets\n' };
const VISIE = { 'level-1-idee/visie.md': '# Visie\n\nSchone binnenstad.\n' };
const MADLIB = { 'level-1-idee/madlib.md': '# Madlib\n\nMijn bedrijf, Trapzorg, biedt bezorging.\n' };
const AANNAMES = { 'level-1-idee/aannames.md': '# Aannames\n\n- [wens] a\n- [haalbaar] b\n- [rendabel] c\n' };
const DOELGROEP = (type: string) => ({ 'level-2-probleemvalidatie/doelgroep.md': toMarkdown({ type }, '# Doelgroep\n\nApotheken.') });
const VRAGEN = { 'level-2-probleemvalidatie/interviewvragen.md': '# Interviewvragen\n\n5. Hoe gaat het nu?\n' };
const gesprek = (nr: string, plaats: string, uitspraak: string) => ({
  [`level-2-probleemvalidatie/interviews/${nr}-apotheker.md`]: toMarkdown({ rol: 'apotheker', locatie: plaats, datum: '2026-10-12', duur: 24, uitspraak }, '# Interview\n\nTekst.'),
});
const DRIE = { ...gesprek('01', 'Utrecht', 'Om elf uur staat de bezorger er nog niet.'), ...gesprek('02', 'Zeist', 'Ik loop zelf twee keer per dag.'), ...gesprek('03', 'Nieuwegein', 'Spoedrecepten zijn ons grootste gedoe.') };

describe('het speelbord van level 1 tot en met 6', () => {
  it('het level is donker, met het beeld, één vraag en één zin; zonder stapkaarten en zonder venster', () => {
    for (const l of LEVELS.filter((x) => x.id > 0)) {
      const html = render(l.id);
      const b = BELEVING[l.id];
      expect(html, `level ${l.id}`).toContain(b.beeld);
      expect(html, `level ${l.id}`).toMatch(new RegExp(`<h1[^>]*>${b.bord!.vraag.replace('?', '\\?')}</h1>`));
      expect(html, `level ${l.id}`).toContain(b.bord!.zin);
      expect(html, `level ${l.id}`).toContain('class="bl-werkblad');
      expect(html, `level ${l.id}`).not.toContain('bl-stapkaart');
      expect(html, `level ${l.id}`).not.toContain('<dialog class="bl-open');
    }
  });

  it('level 0 houdt zijn stapkaarten', () => {
    expect(render(0)).toContain('bl-stapkaart');
    expect(render(0)).not.toContain('class="bl-werkblad');
  });

  it('wat nog komt ligt op slot: grijs, met een reden en niets om te bedienen', () => {
    const html = render(1);
    const dicht = gesloten(html);
    expect(dicht).toHaveLength(4);
    expect(dicht.map((d) => d.match(/<h3>(.*?)<\/h3>/)?.[1])).toEqual(['Je visie', 'Je idee in één zin', 'Je aannames', 'Je waardepropositie']);
    expect(dicht.map((d) => d.match(/class="bl-slot-reden">(.*?)</)?.[1])).toEqual(['eerst je idee', 'eerst je visie', 'eerst je zin', 'eerst je aannames']);
    for (const d of dicht) expect(d).not.toMatch(/<(button|input|textarea|select|a)\b/);
  });

  it('heeft per werkblad een demoknop, en een knop die het hele level vult', () => {
    const html = render(2);
    expect(html).toContain('Vul met demo content');
    expect(html).toContain('Vul het hele level met demo content');
  });

  it('is het level af, dan staat alles als regel met een vinkje en is er geen werkblad meer', () => {
    const html = render(1, { ...IDEE, ...VISIE, ...MADLIB, ...AANNAMES }, 'done');
    expect(html).not.toContain('class="bl-werkblad');
    expect(html.match(/class="bl-af-regel"/g)).toHaveLength(5);
  });
});

describe('level 1: je idee', () => {
  it('begint bij je idee; "Nog geen idee?" staat als omlijnde regel bovenaan', () => {
    const html = render(1);
    expect(html).toMatch(/<h3[^>]*>Je idee<\/h3>/);
    expect(html).toContain('Wat ga je doen?');
    expect(html).toMatch(/<button[^>]*class="bl-optie"[^>]*aria-expanded="false"[^>]*>[\s\S]*?Nog geen idee\?/);
  });

  it('idee en visie gaan voor; daarna staat de madlib als zin met invulgaten', () => {
    const html = render(1, { ...IDEE, ...VISIE });
    expect(html).toMatch(/class="bl-af-regel"[^>]*>[\s\S]*?Je idee: medicijnen bezorgen per bakfiets/);
    expect(html).toMatch(/class="bl-af-regel"[^>]*>[\s\S]*?Je visie/);
    expect(html).toMatch(/<h3[^>]*>Je idee in één zin<\/h3>/);
    const zin = html.slice(html.indexOf('class="bl-madlib"'));
    for (const stuk of ['Mijn bedrijf,', 'biedt', 'voor', 'die', 'met']) expect(zin).toContain(stuk);
    for (const label of ['Naam van je bedrijf', 'Aanbod: wat bied je aan?', 'Doelgroep: voor wie precies?', 'Probleem of behoefte van die doelgroep', 'USP: wat maakt jou anders?'])
      expect(zin).toContain(`aria-label="${label}"`);
    expect(html).toMatch(/<b>0<\/b> van 5/);
    expect(html).toMatch(/<button[^>]*disabled=""[^>]*>Zet in je repo<\/button>/);
  });

  it('een AI-stap toont het vlak waar het resultaat komt en de opdracht voor je AI; de uitleg is een kleine link', () => {
    const html = render(1, { ...IDEE, ...VISIE, ...MADLIB, ...AANNAMES });
    expect(html).toMatch(/<h3[^>]*>Je waardepropositie<\/h3>/);
    expect(html).toContain('level-1-idee/vpc.md');
    expect(html).toContain('Gebruik skill propositie-validator.');
    expect(html).toMatch(/<button[^>]*class="bl-uitleglink"[^>]*>Wat haalde mijn AI op\?<\/button>/);
  });
});

describe('level 2: je gesprekken', () => {
  it('het formulier van je doelgroep vraagt geen aantal interviews', () => {
    const html = render(2);
    expect(html).toMatch(/<h3[^>]*>Je doelgroep<\/h3>/);
    expect(html).not.toMatch(/aantal interviews/i);
  });

  it('elk gesprek vult een vak; het aantal vakken volgt uit je doelgroep', () => {
    const html = render(2, { ...DOELGROEP('B2B'), ...VRAGEN, ...DRIE });
    expect(html).toMatch(/class="bl-af-regel"[^>]*>[\s\S]*?Je doelgroep · bedrijven, dus 5 gesprekken/);
    expect(html).toMatch(/<h3[^>]*>Je gesprekken<\/h3>/);
    expect(html).toMatch(/<b>3<\/b> van 5/);
    expect(html.match(/class="bl-vak vol/g)).toHaveLength(3);
    expect(html).toContain('Apotheker, Nieuwegein');
    expect(html).toContain('12 okt · 24 min');
    expect(html).toContain('Spoedrecepten zijn ons grootste gedoe.');
    expect(render(2, { ...DOELGROEP('B2C'), ...VRAGEN, ...DRIE }).match(/<button[^>]*class="bl-vak leeg/g)).toHaveLength(12);
  });

  it('lege vakken zijn knoppen die "Zo vul je een vak" openen', () => {
    const html = render(2, { ...DOELGROEP('B2B'), ...VRAGEN, ...DRIE });
    const leeg = html.match(/<button[^>]*class="bl-vak leeg[^"]*"[^>]*>[\s\S]*?<\/button>/g) ?? [];
    expect(leeg).toHaveLength(2);
    expect(leeg[0]).toMatch(/class="bl-vak leeg volgende"/);
    expect(leeg[0]).toContain('Je volgende gesprek');
    expect(leeg[1]).toContain('Nog leeg');
    for (const b of leeg) expect(b).toMatch(/aria-expanded="false"[^>]*aria-controls="bl-vul"|aria-controls="bl-vul"[^>]*aria-expanded="false"/);
  });

  it('analyse en canvas liggen op slot tot je gesprekken binnen zijn', () => {
    const html = render(2, { ...DOELGROEP('B2B'), ...VRAGEN, ...DRIE });
    expect(gesloten(html).map((d) => d.match(/class="bl-slot-reden">(.*?)</)?.[1])).toEqual(['nog 2 gesprekken', 'nog 2 gesprekken']);
  });
});

describe('Zo vul je een vak', () => {
  const html = renderToStaticMarkup(<ZoVulJeEenVak open onSluit={niets} onSave={async () => true} onVervers={niets} snapshot={{ files: starterFiles, mergedPullRequests: 0 }} />);

  it('vier stappen, elk met waar je hem doet', () => {
    expect(html).toContain('Zo vul je een vak');
    for (const waar of ['Buiten', 'Je computer', 'AI-app', 'Hier']) expect(html).toContain(`>${waar}<`);
    expect(html).toContain('Vraag eerst of je mag opnemen.');
    expect(html).toContain('<code>interviews/</code>');
    expect(html).toContain('Schrijf mijn nieuwe interviews uit.');
    expect(html).toMatch(/<button[^>]*>Kopieer<\/button>/);
    expect(html).toMatch(/<button[^>]*>Ververs<\/button>/);
  });

  it('geen opname, wel aantekeningen: het platform zet ze bij je gesprekken', () => {
    expect(html).toMatch(/<summary[^>]*>Geen opname, wel aantekeningen\?<\/summary>/);
    expect(html).toContain('Met wie sprak je?');
    expect(html).toContain('Je aantekeningen');
    expect(html).toMatch(/<button[^>]*disabled=""[^>]*>Zet bij je gesprekken<\/button>/);
  });
});
