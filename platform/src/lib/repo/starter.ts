import type { RepoSnapshot } from './types';

/** Maakt een nieuwe repo van de starter-repo; de deelnemer kiest op GitHub zelf naam en zichtbaarheid. */
export const TEMPLATE_URL = 'https://github.com/new?template_owner=morgenacademy&template_name=ondernemen-met-ai-starter';

/** Een repo lijkt op de starter-repo als AGENTS.md erin staat en er een map van level 0 is. */
export function lijktStarterRepo(s: RepoSnapshot): boolean {
  const paden = Object.keys(s.files);
  return paden.includes('AGENTS.md') && paden.some((p) => p.startsWith('level-0-werkplek/'));
}
