import type { LevelState, Plek } from '../lib/levels/types';

export const STATE_LABEL: Record<LevelState, string> = { done: 'Af', active: 'Nu bezig', locked: 'Op slot' };

export const PLEK_LABEL: Record<Plek, string> = {
  platform: 'Platform',
  github: 'GitHub',
  'github-desktop': 'GitHub Desktop',
  'ai-app': 'AI-app',
  buiten: 'Buiten',
};
