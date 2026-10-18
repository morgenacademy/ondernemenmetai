import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { LEVELS } from '../lib/levels';
import { evaluateLevel } from '../lib/levels/evaluate';
import type { LevelState } from '../lib/levels/types';
import { starterFiles } from '../lib/repo/starterFiles';
import { Afronding } from './Afronding';
import { BELEVING } from './beleving';
import { LevelScherm } from './LevelScherm';
import { Routekaart } from './Routekaart';
import { StapBlad } from './StapBlad';
import { Voorbeeld } from './Voorbeeld';
import { Welkom } from './Welkom';

const snapshot = { files: starterFiles, mergedPullRequests: 0 };
const level = (id: number) => LEVELS.find((l) => l.id === id)!;
const stap = (levelId: number, stepId: string) => level(levelId).steps.find((s) => s.id === stepId)!;
const status = (actief: number): Record<number, LevelState> =>
  Object.fromEntries(LEVELS.map((l) => [l.id, l.id < actief ? 'done' : l.id === actief ? 'active' : 'locked']));
const niets = () => {};

describe('Welkom', () => {
  const html = renderToStaticMarkup(<Welkom onNaarRoute={niets} />);
  it('neemt je mee: je start je eigen bedrijf, de route en de drie scènes', () => {
    expect(html).toContain('Je start je eigen bedrijf.');
    expect(html).toContain('Zes stappen naar de markt');
    for (const kop of ['Eerst je basiskamp.', 'Dan de markt op.', 'Tot je eerste klant.']) expect(html).toContain(kop);
    for (const l of LEVELS) expect(html, l.name).toContain(l.name);
  });
  it('op een telefoon staat de route als lijst, met de twee lussen erbij', () => {
    const lijst = html.match(/<ol class="bl-route-lijst[^"]*"[\s\S]*?<\/ol>/)?.[0] ?? '';
    for (const l of LEVELS) expect(lijst, l.name).toContain(l.name);
    expect(lijst.match(/heen en weer/g)).toHaveLength(2);
  });

  it('eindigt met een knop naar je route', () => {
    expect(html).toMatch(/<button[^>]*class="bl-knop[^"]*"[^>]*>Bekijk je route →<\/button>/);
  });
});

describe('Routekaart', () => {
  const html = renderToStaticMarkup(
    <Routekaart status={status(1)} van={null} snapshot={snapshot} onOpen={niets} onDemoVoortgang={niets} onReset={niets} onKlant={async () => true} bezig={false} />,
  );
  it('zet de levels als lichtjes op het pad, met hun stand', () => {
    expect(html).toContain('src="/beelden/start-leeg.webp"');
    expect(html).toContain('src="/beelden/jij.webp"');
    expect(html).toContain('aria-label="Level 0: Werkplek, afgerond"');
    expect(html).toContain('aria-label="Level 1: Idee, nu bezig"');
    expect(html).toContain('aria-label="Level 2: Probleem-validatie, op slot"');
  });
  it('laat het level zien waar je nu bent, met de knop om te beginnen', () => {
    expect(html).toContain('Level 1 · Nu bezig');
    expect(html).toMatch(/<h1[^>]*>Idee<\/h1>/);
    expect(html).toMatch(/<button[^>]*class="bl-knop"[^>]*>Begin met je idee →<\/button>/);
  });
  it('staat er al iets van het level in je repo, dan ga je verder', () => {
    const begonnen = { files: { ...starterFiles, 'level-1-idee/idee.md': '# Mijn idee\n\nSpoedbezorging per bakfiets voor apotheken.\n' }, mergedPullRequests: 0 };
    const html = renderToStaticMarkup(
      <Routekaart status={status(1)} van={null} snapshot={begonnen} onOpen={niets} onDemoVoortgang={niets} onReset={niets} onKlant={async () => true} bezig={false} />,
    );
    expect(html).toMatch(/<button[^>]*class="bl-knop"[^>]*>Ga verder met je idee →<\/button>/);
  });
  it('kom je van een afgerond level, dan staat het volgende level meteen klaar onder de kaart', () => {
    const html = renderToStaticMarkup(
      <Routekaart status={status(1)} van={0} snapshot={snapshot} onOpen={niets} onDemoVoortgang={niets} onReset={niets} onKlant={async () => true} bezig={false} />,
    );
    expect(html).toContain('Level 1 · Nu bezig');
    expect(html).toMatch(/<h1[^>]*>Idee<\/h1>/);
    expect(html).toMatch(/<button[^>]*class="bl-knop"[^>]*>Begin met je idee →<\/button>/);
    expect(html).toContain('aria-label="Level 1: Idee, nu bezig" aria-pressed="true"');
    expect(html).not.toContain('Klik op de kaart op het lichtje');
  });
  it('heeft de demo om je voortgang te zetten, en de knop voor je eerste klant', () => {
    expect(html).toContain('Demo: zet je voortgang');
    expect(html).toContain('Ik heb een klant');
  });
});

describe('Routekaart als alles af is', () => {
  it('zegt dat je Proof of Concept hebt, en wijst naar module 2', () => {
    const alles = Object.fromEntries(LEVELS.map((l) => [l.id, 'done' as const]));
    const html = renderToStaticMarkup(
      <Routekaart status={alles} van={null} snapshot={snapshot} onOpen={niets} onDemoVoortgang={niets} onReset={niets} onKlant={async () => true} bezig={false} />,
    );
    expect(html).toContain('Je hebt alle levels afgerond');
    expect(html).toContain('module 2');
  });
});

describe('LevelScherm', () => {
  const render = (id: number, actief = id) => {
    const l = level(id);
    return renderToStaticMarkup(
      <LevelScherm
        level={l}
        state={status(actief)[id]}
        status={status(actief)}
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

  it('een level op slot zegt welk level je eerst afmaakt, niet dat het ooit opengaat', () => {
    const html = render(2, 1);
    expect(html).toContain('Maak eerst level 1 af: je idee.');
    expect(html).not.toContain('gaat open');
  });

  it('level 0 opent met het basiskamp, de scènes en het nieuwe woord', () => {
    const html = render(0);
    expect(html).toContain('Eerst je basiskamp.');
    expect(html).toContain('De patronen ontstonden in je hoofd.');
    expect(html).toContain('Die plek heet een repo.');
  });

  it('de stappen staan als rondjes op een pad: de eerste is aan de beurt en staat open', () => {
    const html = render(0);
    expect(html).toContain('Richt je werkplek in.');
    expect(html).toMatch(/<b>0<small> \/ 8<\/small><\/b>klaar/);
    expect(html).toContain('aria-label="Account, nu aan de beurt"');
    expect(html).toContain('aria-label="Repo, nog niet aan de beurt"');
    expect(html).toMatch(/<h3[^>]*>Maak een GitHub-account<\/h3>/);
    expect(html).not.toContain('bl-stapkaart');
    expect(html).not.toContain('<dialog');
  });

  it('eindigt met het slotscherm, met de knop naar het volgende level nog dicht', () => {
    const html = render(0);
    expect(html).toContain('Dit heb je na level 0.');
    expect(html).not.toContain('Zo staat je');
    expect(html).toMatch(/0 van \d+ af:/);
    expect(html).toContain('Tijd voor je idee.');
    expect(html).toMatch(/aria-disabled="true"[^>]*>Op naar je idee →/);
    expect(html).toContain('Nog 8 stappen, dan gaat level 1 open.');
  });

  it('level 0 heeft zijn beeld, kop en stappen', () => {
    const html = render(0);
    const b = BELEVING[0];
    expect(html).toContain(b.beeld);
    expect(html).toContain(b.kop);
    expect(html).toContain(b.bord!.zin);
  });

  it('heeft een knop die het hele level met demo content vult', () => {
    expect(render(0)).toContain('Vul het hele level met demo content');
  });
});

describe('Afronding', () => {
  it('na het level: afgerond, alles afgevinkt en de knop open', () => {
    const l = level(0);
    const statussen = Object.fromEntries(l.steps.map((s) => [s.id, 'af' as const]));
    const html = renderToStaticMarkup(<Afronding level={l} status={status(1)} statussen={statussen} levelAf onNaarRoute={niets} gevierd={false} />);
    expect(html).toContain('Level 0 · Afgerond');
    expect(html).toContain('Je basiskamp staat.');
    expect(html.match(/<li class="ja">/g)).toHaveLength(5);
    expect(html).toMatch(/<button[^>]*aria-disabled="false"[^>]*>Op naar je idee →/);
  });

  it('na level 6 wijst hij naar module 2', () => {
    const l = level(6);
    const statussen = Object.fromEntries(l.steps.map((s) => [s.id, 'af' as const]));
    const html = renderToStaticMarkup(<Afronding level={l} status={status(7)} statussen={statussen} levelAf onNaarRoute={niets} gevierd={false} />);
    expect(html).toContain('Proof of Concept.');
    expect(html).toContain('module 2');
  });
});

describe('StapBlad', () => {
  const venster = (levelId: number, stepId: string, st: 'nu' | 'af' | 'straks' = 'nu') => {
    const l = level(levelId);
    const s = stap(levelId, stepId);
    const index = l.steps.filter((x) => !x.optional).indexOf(s);
    return renderToStaticMarkup(
      <StapBlad
        level={l}
        step={s}
        nummer={index + 1}
        totaal={l.steps.filter((x) => !x.optional).length}
        status={st}
        snapshot={snapshot}
        evaluation={evaluateLevel(l, snapshot)}
        onSave={async () => true}
        onDemo={niets}
        onKlaar={niets}
      />,
    );
  };

  it('zegt welke stap het is en waar je hem doet', () => {
    const html = venster(2, 'l2-canvas');
    expect(html).toContain('Stap 6 van 6');
    expect(html).toMatch(/AI-app[\s\S]*GitHub Desktop[\s\S]*GitHub/);
    expect(html).toMatch(/<h3[^>]*>Werk je canvas bij<\/h3>/);
  });

  it('het werkblad staat op de pagina, zonder venster eromheen', () => {
    const html = venster(0, 'l0-account');
    expect(html).toMatch(/^<div class="bl-licht bl-stapblad" id="bl-stapblad">/);
    expect(html).not.toContain('<dialog');
    expect(html).not.toContain('Volgende stap');
  });

  it('een stap zonder check vink je zelf af, met een knop die zegt wat klaar is en zonder extra regel', () => {
    const html = venster(0, 'l0-account');
    expect(html).toMatch(/<button[^>]*class="bl-vknop p"[^>]*>Klaar, ik heb een account<\/button>/);
    expect(html).not.toContain('bl-hoe');
    expect(html).not.toContain('zelf af');
  });

  it('ook de downloadstap heeft zijn knop om af te vinken', () => {
    expect(venster(0, 'l0-download')).toMatch(/<button[^>]*class="bl-vknop p"[^>]*>Klaar, de app werkt<\/button>/);
  });

  it('één zin per stap; de uitleg staat dicht achter Zo doe je het', () => {
    const html = venster(0, 'l0-account');
    expect(html).toContain('Op GitHub komt je repo te staan. Een gratis account is genoeg.');
    expect(html).toMatch(/<details class="bl-zo"><summary>Zo doe je het<\/summary>/);
  });

  it('een stap die nog niet aan de beurt is, zegt welke stap eerst moet en brengt je erheen', () => {
    const l = level(0);
    const html = renderToStaticMarkup(
      <StapBlad level={l} step={stap(0, 'l0-setup')} nummer={4} totaal={8} status="straks" snapshot={snapshot} evaluation={evaluateLevel(l, snapshot)} onSave={async () => true} onDemo={niets} onKlaar={niets} eerst={{ nummer: 2, step: stap(0, 'l0-repo') }} onNaarEerst={niets} />,
    );
    expect(html).toContain('Eerst stap 2 van dit level: maak je repo.');
    expect(html).toMatch(/<button[^>]*>Naar stap 2<\/button>/);
    expect(html).not.toContain('Mijn computer');
    expect(html).not.toContain('Vul met demo content');
  });

  it('een stap die klaar is, zegt dat', () => {
    expect(venster(0, 'l0-account', 'af')).toContain('Klaar</p>');
    expect(venster(0, 'l0-account', 'af')).not.toContain('Klaar, ik heb een account');
  });

  it('koppelen sla je niet over: verder kan pas als het koppelen gelukt is', () => {
    const html = venster(0, 'l0-koppelen');
    expect(html).not.toContain('Klaar, volgende stap');
    expect(html).not.toContain('class="bl-vknop p"');
    expect(html).toContain('Kies je repo op GitHub en klik op Install. Dan krijgt deze stap vanzelf een vinkje.');
  });

  it('een stap met een check krijgt vanzelf een vinkje zodra de repo het laat zien', () => {
    const html = venster(2, 'l2-analyse');
    expect(html).not.toContain('Klaar, volgende stap');
    expect(html).toContain('Staat je wijziging op GitHub, dan krijgt deze stap vanzelf een vinkje.');
    expect(html).toContain('Vul met demo content');
  });

  it('de interviewstap toont de vakken en de opdracht voor je AI, zonder upload', () => {
    const html = venster(2, 'l2-interviews');
    expect(html).toContain('0 van de 5 interviews in je repo');
    expect(html).toContain('Schrijf mijn nieuwe interviews uit.');
    expect(html).not.toContain('type="file"');
  });

  it('een formulier staat links, met de knop voor demo content', () => {
    const html = venster(1, 'l1-idee');
    expect(html).toContain('Wat ga je doen?');
    expect(html).toContain('Zet in je repo');
    expect(html).toContain('Vul met demo content');
  });

  it('zet je How Might We-vraag boven de oplossingenstap', () => {
    const l = level(3);
    const files = { ...starterFiles, 'level-2-probleemvalidatie/eerste-doelgroep.md': '---\ngevonden: ja\ndoelgroep: apothekers\nprobleem: spoedbezorging\n---\n# E\n\nx' };
    const s = { files, mergedPullRequests: 0 };
    const html = renderToStaticMarkup(
      <StapBlad level={l} step={stap(3, 'l3-oplossingen')} nummer={1} totaal={5} status="nu" snapshot={s} evaluation={evaluateLevel(l, s)} onSave={async () => true} onDemo={niets} onKlaar={niets} />,
    );
    expect(html).toMatch(/<blockquote class="stap-hint">Hoe kunnen we apothekers helpen met spoedbezorging\?<\/blockquote>/);
  });

  it('bij een AI-stap die af is, staat links het bestand dat je AI maakte', () => {
    const l = level(4);
    const kaart = '---\nronde: 1\nhypothese: Ze willen door voor €40\ntest_opzet: proef\nmetriek: ja\nsuccesdrempel: 2 van de 3\ntijd_en_sample: 3 apothekers\n---\n# Testkaart ronde 1\n\nTekst.';
    const s = { files: { ...starterFiles, 'level-4-marktfeedback/testkaarten/ronde-1.md': kaart }, mergedPullRequests: 0 };
    const html = renderToStaticMarkup(
      <StapBlad level={l} step={stap(4, 'l4-testkaart')} nummer={2} totaal={5} status="af" snapshot={s} evaluation={evaluateLevel(l, s)} onSave={async () => true} onDemo={niets} onKlaar={niets} />,
    );
    expect(html).toContain('Je AI maakte');
    expect(html).toContain('testkaarten/ronde-1.md');
    expect(html).toContain('hypothese: Ze willen door voor €40');
    expect(html).not.toContain('Vul met demo content');
  });

  it('zolang het bestand er niet is, staat er alleen het gesprek', () => {
    expect(venster(4, 'l4-testkaart')).not.toContain('Je AI maakte');
  });

  it('de stap met het begrip heeft zijn pop-up', () => {
    expect(venster(1, 'l1-propositie')).toContain('Wat haalde mijn AI op?');
  });
});

describe('Voorbeeld', () => {
  it('een formulier toont het platform met het eerste veld', () => {
    expect(renderToStaticMarkup(<Voorbeeld step={stap(1, 'l1-idee')} setup={{}} />)).toContain('Wat ga je doen?');
  });
  it('een stap via een pull request toont GitHub met Merge pull request', () => {
    expect(renderToStaticMarkup(<Voorbeeld step={stap(2, 'l2-canvas')} setup={{}} />)).toContain('Merge pull request');
  });
  it('een AI-stap toont je AI-app met de skill', () => {
    const html = renderToStaticMarkup(<Voorbeeld step={stap(1, 'l1-propositie')} setup={{ ai: 'codex' }} />);
    expect(html).toContain('Codex');
    expect(html).toContain('propositie-validator');
  });
  it('elke pull request toont zijn eigen wijziging', () => {
    expect(renderToStaticMarkup(<Voorbeeld step={stap(3, 'l3-verwoorden')} setup={{}} />)).toContain('madlib.md');
    expect(renderToStaticMarkup(<Voorbeeld step={stap(5, 'l5-agents')} setup={{}} />)).toContain('AGENTS.md');
    expect(renderToStaticMarkup(<Voorbeeld step={stap(6, 'l6-verkoopaanpak')} setup={{}} />)).toContain('name: verkoopaanpak');
  });
  it('bij Bouw je MVP zie je de MVP zelf: een landingspagina', () => {
    const html = renderToStaticMarkup(<Voorbeeld step={stap(3, 'l3-bouwen')} setup={{}} />);
    expect(html).toContain('Ik doe mee met de proef');
  });
  it('level 0 houdt de nagetekende schermen uit de schets', () => {
    expect(renderToStaticMarkup(<Voorbeeld step={stap(0, 'l0-account')} setup={{}} />)).toContain('Sign up for GitHub');
  });
});
