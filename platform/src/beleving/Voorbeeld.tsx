import type { Setup } from '../lib/content';
import type { Step } from '../lib/levels/types';

// Nagetekende schermen voor op de stapkaarten en in het stapvenster. In het echte platform worden het
// schermafbeeldingen met dezelfde groene markering. Level 0 komt letterlijk uit de schets level0-v7.
const LEVEL0: Record<string, string> = {
  'l0-setup': `<div class="bl-scherm platform"><div class="balk"><i></i><i></i><i></i><span class="url">ondernemenmetai.nl</span></div><div class="inhoud">
    <div class="label">Mijn computer</div><div class="keuze"><span class="on">Mac</span><span>Windows</span></div>
    <div class="label">Waar heb je een abonnement?</div><div class="keuze"><span class="on">Claude (Pro of hoger)</span><span>ChatGPT (Plus of hoger)</span></div>
    <span class="knopje">Zet in je repo</span></div></div>`,
  'l0-download': `<div class="bl-scherm platform"><div class="balk"><i></i><i></i><i></i><span class="url">ondernemenmetai.nl</span></div><div class="inhoud">
    <div style="border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.08);border-radius:14px;padding:1.1em">
    <div style="color:#D8FE56;font-weight:700;font-size:.85em;letter-spacing:.14em">BIJ JE CLAUDE-ABONNEMENT</div>
    <div style="font-weight:900;font-size:2em;color:#fff;margin:.2em 0 .4em">Claude Code</div>
    <span class="knopje">Download Claude Code ↗</span></div></div></div>`,
  'l0-account': `<div class="bl-scherm"><div class="balk"><i></i><i></i><i></i><span class="url">github.com/signup</span></div><div class="inhoud">
    <div style="font-size:1.5em;font-weight:600;margin-bottom:.7em">Sign up for GitHub</div>
    <div>Email</div><div class="gh-veld markeer">jouw@mailadres.nl</div><div>Password</div><div class="gh-veld">••••••••••</div><span class="gh-knop">Continue</span></div></div>`,
  'l0-github-desktop': `<div class="bl-scherm"><div class="balk"><i></i><i></i><i></i><span class="app">GitHub Desktop</span></div><div class="inhoud" style="text-align:center;padding-top:2.2em">
    <div style="font-size:1.6em;font-weight:600">Welcome to GitHub Desktop</div>
    <div style="color:#9198a1;margin:.6em auto 1.4em;max-width:26em">GitHub Desktop is a seamless way to contribute to projects on GitHub.</div>
    <div><span class="gh-knop blauw markeer">Sign in to GitHub.com</span></div><div style="margin-top:.9em;color:#9198a1">Skip this step</div></div></div>`,
  'l0-repo': `<div class="bl-scherm"><div class="balk"><i></i><i></i><i></i><span class="url">github.com/new?template=starter-repo</span></div><div class="inhoud">
    <div style="font-size:1.35em;font-weight:600;margin-bottom:.6em">Create a new repository</div>
    <div>Repository name</div><div class="gh-veld" style="color:#e6edf3">mijn-onderneming</div>
    <div class="gh-radio"><span class="r"></span>Public</div><div class="gh-radio on markeer"><span class="r"></span><b>Private</b>&nbsp;· only you can see this</div>
    <div style="margin-top:1em"><span class="gh-knop">Create repository</span></div></div></div>`,
  'l0-koppelen': `<div class="bl-scherm platform"><div class="balk"><i></i><i></i><i></i><span class="url">ondernemenmetai.nl</span></div><div class="inhoud" style="text-align:center;padding-top:2.4em">
    <div style="font-weight:800;font-size:1.4em;color:#fff;margin-bottom:1em">Koppel je repo</div>
    <span style="display:inline-block;background:#fff;color:#1A1A2E;font-weight:800;border-radius:10px;padding:.7em 1.2em">Verbind met GitHub</span></div></div>`,
  'l0-clonen': `<div class="bl-scherm"><div class="balk"><i></i><i></i><i></i><span class="app">GitHub Desktop · Clone a repository</span></div><div class="inhoud">
    <div style="display:flex;gap:1.4em;border-bottom:1px solid #30363d;padding-bottom:.5em;margin-bottom:.8em"><b style="border-bottom:2px solid #f78166;padding-bottom:.4em">GitHub.com</b><span style="color:#9198a1">URL</span></div>
    <div class="gh-radio on" style="background:#1f2937">📁 jij/mijn-onderneming</div>
    <div style="margin-top:1em">Local path</div><div class="gh-veld" style="color:#e6edf3">~/Documents/mijn-onderneming</div>
    <div style="text-align:right"><span class="gh-knop grijs">Cancel</span> <span class="gh-knop blauw markeer">Clone</span></div></div></div>`,
  'l0-eerste-opdracht': `<div class="bl-scherm"><div class="balk"><i></i><i></i><i></i><span class="app">GitHub Desktop</span><span style="margin-left:auto" class="gh-knop grijs markeer">↑ Push origin</span></div>
    <div class="gd"><div class="links"><div class="tab">Changes 1</div><div class="bestand">☑ level-0-werkplek/werkplek.md</div>
    <div class="onder"><div class="gh-veld" style="color:#e6edf3;margin-top:0">Werkplek ingevuld</div><span class="gh-knop blauw" style="display:block;text-align:center">Commit to main</span></div></div>
    <div class="rechts">- &lt;!-- invullen --&gt;<br>+ - Mijn AI-tool: Claude Code<br>+ - Mijn computer: Mac</div></div></div>`,
};

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function platform(inhoud: string): string {
  return `<div class="bl-scherm platform"><div class="balk"><i></i><i></i><i></i><span class="url">ondernemenmetai.nl</span></div><div class="inhoud">${inhoud}</div></div>`;
}

function aiApp(step: Step, setup: Setup): string {
  const app = setup.ai === 'codex' ? 'Codex' : setup.ai === 'claude-code' ? 'Claude Code' : 'Je AI-app';
  const prompt = step.aiPrompt ?? '';
  const skill = prompt.match(/skill ([a-z-]+)/)?.[1];
  const kort = prompt.length > 150 ? `${prompt.slice(0, 147).trimEnd()}…` : prompt;
  const antwoord = skill
    ? `Ik gebruik skill <b>${esc(skill)}</b>. Ik heb eerst de nieuwste versie opgehaald. Mijn eerste vraag:`
    : 'Ik heb eerst de nieuwste versie opgehaald. Mijn eerste vraag:';
  return `<div class="bl-scherm"><div class="balk"><i></i><i></i><i></i><span class="app">${app} · mijn-onderneming</span></div><div class="inhoud"><div class="chat">
    <div class="jij-zegt">${esc(kort)}</div><div class="ai-zegt">${antwoord}</div></div></div></div>`;
}

/** Per pull request de wijziging die de deelnemer onder Files changed ziet. */
const PR_WIJZIGING: Record<string, { bestand: string; min: string; plus: string }> = {
  'l2-canvas': { bestand: 'level-1-idee/vpc.md', min: 'Medicijnen op tijd bij patiënten krijgen (aanname)', plus: 'Medicijnen op tijd bij patiënten krijgen (bevestigd: 5 van de 5)' },
  'l3-verwoorden': { bestand: 'level-1-idee/madlib.md', min: '… biedt bezorging per bakfiets binnen twee uur …', plus: '… biedt spoedbezorging rond het middaguur …' },
  'l5-doorontwikkelen': { bestand: 'level-3-prototype/mvp/landingspagina.html', min: '€40 per maand, opzegbaar per maand.', plus: 'De eerste maand gratis, daarna €40 per maand.' },
  'l5-agents': { bestand: 'AGENTS.md', min: '<!-- Deze sectie vul je in level 5 met je AI -->', plus: 'Trapzorg bezorgt spoedrecepten per bakfiets, €40 per maand.' },
  'l6-verkoopaanpak': { bestand: 'skills/verkoopaanpak/SKILL.md', min: '', plus: 'name: verkoopaanpak' },
};

function pullRequest(step: Step): string {
  const w = PR_WIJZIGING[step.id] ?? PR_WIJZIGING['l2-canvas'];
  return `<div class="bl-scherm"><div class="balk"><i></i><i></i><i></i><span class="url">github.com/jij/mijn-onderneming/pull/1</span></div><div class="inhoud">
    <div class="pr-titel">${esc(step.title)}</div>
    <div class="pr-tabs"><span>Conversation</span><b>Files changed</b></div>
    <div class="diff"><div class="bestandsnaam">${esc(w.bestand)}</div>${w.min ? `<div class="min">- ${esc(w.min)}</div>` : ''}<div class="plus">+ ${esc(w.plus)}</div></div>
    <span class="gh-knop markeer">Merge pull request</span></div></div>`;
}

/** De MVP zelf: de landingspagina die je AI bouwde. */
function mvp(): string {
  return `<div class="bl-scherm" style="background:#fff;color:#1d1d1f"><div class="balk"><i></i><i></i><i></i><span class="url">trapzorg.nl</span></div><div class="inhoud" style="font-family:'Barlow',sans-serif">
    <div style="font-weight:900;font-size:1.7em;line-height:1.05;margin-bottom:.4em">Trapzorg: spoedbezorging per bakfiets</div>
    <div style="color:#48484a;margin-bottom:.9em">Om 11 uur opgehaald, binnen twee uur bij de patiënt. Uw assistent blijft in de apotheek.</div>
    <div style="font-weight:700;margin-bottom:.9em">€40 per maand, opzegbaar per maand.</div>
    <span class="markeer" style="display:inline-block;background:#5B2D8E;color:#fff;font-weight:800;border-radius:10px;padding:.6em 1.1em">Ik doe mee met de proef</span></div></div>`;
}

function formulier(step: Step): string {
  if (step.kind !== 'form') return '';
  const velden = step.fields
    .slice(0, 2)
    .map((f) => `<div class="label">${esc(f.label)}</div><div class="veldje"></div>`)
    .join('');
  return platform(`${velden}<span class="knopje">Zet in je repo</span>`);
}

/** Het beeld bij een stap die je buiten doet: eerst de markt op, later terug naar je mensen met je MVP. */
const BUITEN_BEELD: Record<string, string> = { 'l5-terug': '/beelden/feedback.jpg' };

function buiten(step: Step): string {
  return `<div class="bl-buiten" style="background-image:url('${BUITEN_BEELD[step.id] ?? '/beelden/markt.jpg'}')"><span>Buiten · bij je doelgroep</span></div>`;
}

/** Het scherm bij een stap: bij level 0 uit de schets, daarna afgeleid van de soort stap en waar je hem doet. */
export function voorbeeldHtml(step: Step, setup: Setup): string {
  if (LEVEL0[step.id]) return LEVEL0[step.id];
  if (step.id === 'l3-bouwen') return mvp();
  if (step.kind === 'form') return formulier(step);
  if (step.kind === 'voortgang') return platform(`<div class="label">Je interviews in je repo</div><div class="vakjes"><span class="vol"></span><span class="vol"></span><span></span><span></span><span></span></div>`);
  if (step.waar.includes('github')) return pullRequest(step);
  if (step.aiPrompt && step.waar[0] === 'ai-app') return aiApp(step, setup);
  if (step.waar[0] === 'buiten') return buiten(step);
  return step.aiPrompt ? aiApp(step, setup) : buiten(step);
}

export function Voorbeeld({ step, setup }: { step: Step; setup: Setup }) {
  // De schermen zijn vaste, eigen opmaak; alleen de stapgegevens worden ge-escaped ingevoegd.
  return <div className="bl-voorbeeld" dangerouslySetInnerHTML={{ __html: voorbeeldHtml(step, setup) }} />;
}
