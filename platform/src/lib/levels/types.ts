import type { RepoSnapshot } from '../repo/types';

export type CheckResult = { ok: boolean; reason: string };
export type Check = { id: string; stepId: string; label: string; run: (s: RepoSnapshot) => CheckResult };
export type CheckOutcome = CheckResult & { id: string; stepId: string; label: string };

export type Field =
  | { kind: 'text'; name: string; label: string; placeholder?: string; optional?: boolean }
  | { kind: 'textarea'; name: string; label: string; placeholder?: string; optional?: boolean }
  | { kind: 'select'; name: string; label: string; options: { value: string; label: string }[] }
  | { kind: 'number'; name: string; label: string; placeholder?: string; optional?: boolean; max?: number };

export type FormValues = Record<string, string>;
export type FileWrite = { path: string; content: string; message: string };

/** Een knop die extra uitleg in een pop-up opent. De tekst staat in content/levels/level-N/<contentId>.md. */
export type StepPopup = { label: string; title: string; contentId: string };
type StepBase = { id: string; title: string; aiPrompt?: string; popup?: StepPopup };
export type FormStep = StepBase & {
  kind: 'form';
  fields: Field[];
  toFile: (values: FormValues, s: RepoSnapshot) => FileWrite;
};
export type ActionStep = StepBase & { kind: 'action' };
export type UploadStep = StepBase & {
  kind: 'uploads';
  folder: string;
  required: (s: RepoSnapshot) => number;
};
/** Downloadpagina voor de AI-app die bij de gekozen setup hoort. */
export type DownloadStep = StepBase & { kind: 'download' };
export type Step = FormStep | ActionStep | UploadStep | DownloadStep;

export type LevelDef = {
  id: number;
  name: string;
  summary: string;
  milestone: string;
  /** false = nog niet uitgewerkt; zo'n level is nooit af. */
  ready: boolean;
  steps: Step[];
  checks: Check[];
};

export type LevelEvaluation = { levelId: number; done: boolean; results: CheckOutcome[] };
export type LevelState = 'done' | 'active' | 'locked';
