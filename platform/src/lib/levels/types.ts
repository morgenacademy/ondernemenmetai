import type { RepoSnapshot } from '../repo/types';

export type CheckResult = { ok: boolean; reason: string };
export type Check = { id: string; stepId: string; label: string; run: (s: RepoSnapshot) => CheckResult };
export type CheckOutcome = CheckResult & { id: string; stepId: string; label: string };

export type Option = { value: string; label: string };

export type Field =
  | { kind: 'text'; name: string; label: string; placeholder?: string; optional?: boolean }
  | { kind: 'textarea'; name: string; label: string; placeholder?: string; optional?: boolean }
  /** optionsFrom: keuzes uit de repo, zoals de mensen in feedback/. Zonder keuzes kan het formulier niet worden opgeslagen. */
  | { kind: 'select'; name: string; label: string; options: Option[]; optionsFrom?: (s: RepoSnapshot) => Option[]; knoppen?: boolean }
  | { kind: 'number'; name: string; label: string; placeholder?: string; optional?: boolean; max?: number };

export type FormValues = Record<string, string>;
export type FileWrite = { path: string; content: string; message: string };

/**
 * Een knop die extra uitleg in een pop-up opent. De tekst staat in content/levels/level-N/<contentId>.md.
 * plaatje 'twee-plekken' toont je computer en GitHub, met wat er in dit level bij komt.
 */
export type StepPopup = { label: string; title: string; contentId: string; plaatje?: 'twee-plekken' };
/** De vijf plekken waar je een stap doet. Buiten = bij je doelgroep: praten, testen en verkopen doe je zelf. */
export type Plek = 'platform' | 'github' | 'github-desktop' | 'ai-app' | 'buiten';
/** Een overzicht uit de repo onder de stap: je mensen per ronde, of je testrondes op één bord. */
export type Paneel = 'mensen' | 'rondes';

/**
 * optional = een vrije kaart zonder check, zoals "Nog geen idee?". Die krijgt geen nummer.
 * waar = de plekken in volgorde, bijvoorbeeld ['ai-app', 'github-desktop'].
 * hint = een zin uit de repo die boven de stap staat, zoals je How Might We-vraag.
 */
type StepBase = {
  id: string;
  title: string;
  waar: Plek[];
  aiPrompt?: string;
  popup?: StepPopup;
  optional?: boolean;
  hint?: (s: RepoSnapshot) => string | null;
  paneel?: Paneel;
};
export type FormStep = StepBase & {
  kind: 'form';
  fields: Field[];
  toFile: (values: FormValues, s: RepoSnapshot) => FileWrite;
};
export type ActionStep = StepBase & { kind: 'action' };
/** Vakken die afvinken zodra er een bestand in de map staat. Het platform uploadt zelf niets. */
export type VoortgangStep = StepBase & {
  kind: 'voortgang';
  folder: string;
  required: (s: RepoSnapshot) => number;
};
/** Downloadpagina voor de AI-app die bij de gekozen setup hoort. */
export type DownloadStep = StepBase & { kind: 'download' };
export type Step = FormStep | ActionStep | VoortgangStep | DownloadStep;

export type LevelDef = {
  id: number;
  name: string;
  summary: string;
  milestone: string;
  /** Wat de deelnemer ziet als doel van het level, in gewone taal. De checks zien alleen docenten. */
  doel: string;
  vraag?: string;
  /** Het ene nieuwe begrip van het level. */
  begrip?: string;
  /** De bestanden of mappen die de kern van het level laten zien, voor het tussenscherm. */
  kern?: string[];
  /** Dit level gaat open zodra dit klopt, ook als een eerder level nog niet af is. */
  opensEarly?: (s: RepoSnapshot) => boolean;
  /** false = nog niet uitgewerkt; zo'n level is nooit af. */
  ready: boolean;
  steps: Step[];
  checks: Check[];
};

export type LevelEvaluation = { levelId: number; done: boolean; results: CheckOutcome[] };
export type LevelState = 'done' | 'active' | 'locked';
