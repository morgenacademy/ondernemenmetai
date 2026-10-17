import { filledFilesIn } from '../lib/levels/checks';
import type { Plek, Step } from '../lib/levels/types';
import type { RepoSnapshot } from '../lib/repo/types';
import { PLEK_LABEL } from '../ui/labels';

/** Hoe een plek op een kaart heet. Het platform is de plek waar je nu bent. */
export function plekLabel(p: Plek): string {
  return p === 'platform' ? 'Hier op het platform' : PLEK_LABEL[p];
}

/** Knoppen die de plek openen waar je een stap buiten het platform doet. */
export const EXTERN: Record<string, { url: string; tekst: string }> = {
  'l0-account': { url: 'https://github.com/signup', tekst: 'Open GitHub' },
  'l0-github-desktop': { url: 'https://github.com/apps/desktop', tekst: 'Download GitHub Desktop' },
};

// Nagetekende schermen van level 0, uit de schets. In het platform worden het later schermafbeeldingen met dezelfde markering.
const LEVEL0: Record<string, string> = {
  'l0-account': `<div class="bl-scherm"><div class="balk"><i></i><i></i><i></i><span class="url">github.com/signup</span></div><div class="inhoud">
    <div style="font-size:1.5em;font-weight:600;margin-bottom:.7em">Sign up for GitHub</div>
    <div>Email</div><div class="gh-veld markeer">jouw@mailadres.nl</div><div>Password</div><div class="gh-veld">••••••••••</div><span class="gh-knop">Continue</span></div></div>`,
  'l0-repo': `<div class="bl-scherm"><div class="balk"><i></i><i></i><i></i><span class="url">github.com/new?template=starter-repo</span></div><div class="inhoud">
    <div style="font-size:1.35em;font-weight:600;margin-bottom:.6em">Create a new repository</div>
    <div>Repository name</div><div class="gh-veld" style="color:#e6edf3">fietskoerier-apotheken</div>
    <div class="gh-radio"><span class="r"></span>Public</div><div class="gh-radio on markeer"><span class="r"></span><b>Private</b>&nbsp;· only you can see this</div>
    <div style="margin-top:1em"><span class="gh-knop">Create repository</span></div></div></div>`,
  'l0-koppelen': `<div class="bl-scherm platform"><div class="balk"><i></i><i></i><i></i><span class="url">ondernemenmetai.nl</span></div><div class="inhoud" style="text-align:center;padding-top:2.4em">
    <div style="font-weight:800;font-size:1.4em;color:#fff;margin-bottom:1em">Koppel je repo</div>
    <span style="display:inline-block;background:#fff;color:#1A1A2E;font-weight:800;border-radius:10px;padding:.7em 1.2em">Verbind met GitHub</span></div></div>`,
  'l0-setup': `<div class="bl-scherm platform"><div class="balk"><i></i><i></i><i></i><span class="url">ondernemenmetai.nl</span></div><div class="inhoud">
    <div class="label">Mijn computer</div><div class="keuze"><span class="on">Mac</span><span>Windows</span></div>
    <div class="label">Waar heb je een abonnement?</div><div class="keuze"><span class="on">Claude (Pro of hoger)</span><span>ChatGPT (Plus of hoger)</span></div>
    <span class="knopje">Zet in je repo</span></div></div>`,
  'l0-download': `<div class="bl-scherm platform"><div class="balk"><i></i><i></i><i></i><span class="url">ondernemenmetai.nl</span></div><div class="inhoud">
    <div style="border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.08);border-radius:14px;padding:1.1em">
    <div style="color:#D8FE56;font-weight:700;font-size:.85em;letter-spacing:.14em">BIJ JE ABONNEMENT</div>
    <div style="font-weight:900;font-size:2em;color:#fff;margin:.2em 0 .4em">Claude Code</div>
    <span class="knopje">Download Claude Code ↗</span></div></div></div>`,
  'l0-github-desktop': `<div class="bl-scherm"><div class="balk"><i></i><i></i><i></i><span class="app">GitHub Desktop</span></div><div class="inhoud" style="text-align:center;padding-top:2.2em">
    <div style="font-size:1.6em;font-weight:600">Welcome to GitHub Desktop</div>
    <div style="color:#9198a1;margin:.6em auto 1.4em;max-width:26em">GitHub Desktop is a seamless way to contribute to projects on GitHub.</div>
    <div><span class="gh-knop blauw markeer">Sign in to GitHub.com</span></div><div style="margin-top:.9em;color:#9198a1">Skip this step</div></div></div>`,
  'l0-clonen': `<div class="bl-scherm"><div class="balk"><i></i><i></i><i></i><span class="app">GitHub Desktop · Clone a repository</span></div><div class="inhoud">
    <div class="pr-tabs"><b>GitHub.com</b><span>URL</span></div>
    <div class="gh-radio on" style="background:#1f2937">📁 jij/fietskoerier-apotheken</div>
    <div style="margin-top:1em">Local path</div><div class="gh-veld" style="color:#e6edf3">~/Documents/fietskoerier-apotheken</div>
    <div style="text-align:right"><span class="gh-knop grijs">Cancel</span> <span class="gh-knop blauw markeer">Clone</span></div></div></div>`,
  'l0-eerste-opdracht': `<div class="bl-scherm"><div class="balk"><i></i><i></i><i></i><span class="app">GitHub Desktop</span><span style="margin-left:auto" class="gh-knop grijs markeer">↑ Push origin</span></div>
    <div class="gd"><div class="links"><div class="tab">Changes 1</div><div class="bestand">☑ level-0-werkplek/werkplek.md</div>
    <div class="onder"><div class="gh-veld" style="color:#e6edf3;margin-top:0">Werkplek ingevuld</div><span class="gh-knop blauw" style="display:block;text-align:center">Commit to main</span></div></div>
    <div class="rechts">- &lt;!-- invullen --&gt;<br>+ - Mijn AI-tool: Claude Code<br>+ - Mijn computer: Mac</div></div></div>`,
};

const kort = (tekst: string, max: number) => (tekst.length > max ? `${tekst.slice(0, max - 1).trimEnd()}…` : tekst);

/** Een nagetekend scherm bij een stap: voor de kaart en voor stappen die je buiten het platform doet. */
export function Voorbeeld({ step, snapshot, beeld }: { step: Step; snapshot: RepoSnapshot; beeld: string }) {
  const html = LEVEL0[step.id];
  if (html) return <div className="bl-voorbeeld" dangerouslySetInnerHTML={{ __html: html }} />;

  if (step.kind === 'voortgang') {
    const need = step.required(snapshot);
    const vol = filledFilesIn(snapshot, step.folder).length;
    return (
      <div className="bl-scherm platform">
        <div className="balk"><i /><i /><i /><span className="url">ondernemenmetai.nl</span></div>
        <div className="inhoud">
          <div className="label">{Math.min(vol, need)} van de {need} in je repo</div>
          <div className="vakjes">
            {Array.from({ length: Math.min(need, 10) }, (_, i) => <span key={i} className={i < vol ? 'vol' : ''} />)}
          </div>
        </div>
      </div>
    );
  }
  if (step.kind === 'form' || step.kind === 'download') {
    const label = step.kind === 'form' ? step.fields[0]?.label : 'Je AI-app';
    return (
      <div className="bl-scherm platform">
        <div className="balk"><i /><i /><i /><span className="url">ondernemenmetai.nl</span></div>
        <div className="inhoud">
          <div className="label">{label}</div>
          <div className="veldje" />
          <div className="veldje" />
          <span className="knopje">Zet in je repo</span>
        </div>
      </div>
    );
  }
  const plek = step.waar.find((p) => p !== 'platform') ?? step.waar[0];
  if (plek === 'buiten') {
    return (
      <div className="bl-buiten" style={{ backgroundImage: `url('${beeld}')` }}>
        <span>Buiten · bij je doelgroep</span>
      </div>
    );
  }
  if (plek === 'github-desktop') {
    return (
      <div className="bl-scherm">
        <div className="balk"><i /><i /><i /><span className="app">GitHub Desktop</span><span style={{ marginLeft: 'auto' }} className="gh-knop grijs">↑ Push origin</span></div>
        <div className="gd">
          <div className="links">
            <div className="tab">Changes</div>
            <div className="bestand">☑ je wijziging</div>
            <div className="onder"><span className="gh-knop blauw" style={{ display: 'block', textAlign: 'center' }}>Commit to main</span></div>
          </div>
          <div className="rechts">+ wat je AI schreef</div>
        </div>
      </div>
    );
  }
  if (plek === 'github') {
    return (
      <div className="bl-scherm">
        <div className="balk"><i /><i /><i /><span className="url">github.com/jij/jouw-repo</span></div>
        <div className="inhoud">
          <div className="pr-titel">{step.title}</div>
          <div className="diff"><div className="plus">+ je voorstel</div></div>
          <span className="gh-knop">Merge pull request</span>
        </div>
      </div>
    );
  }
  // In je AI-app: een gesprek dat begint met de vraag die je kopieert.
  return (
    <div className="bl-scherm">
      <div className="balk"><i /><i /><i /><span className="app">Je AI-app</span></div>
      <div className="inhoud chat">
        <div className="jij-zegt">{kort(step.aiPrompt ?? step.title, 110)}</div>
        <div className="ai-zegt"><b>Je AI:</b> Ik heb je repo gelezen. Zullen we beginnen?</div>
      </div>
    </div>
  );
}
