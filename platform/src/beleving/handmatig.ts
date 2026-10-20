import type { StorageLike } from '../lib/repo/mockRepo';

/**
 * Stappen zonder check (zoals "Maak een GitHub-account") vink je zelf af. Dat is platformstand,
 * geen repo-inhoud; de browser bewaart hem.
 */
export const HANDMATIG_KEY = 'ondernemen-met-ai.handmatig.v1';
export const INTRO_KEY = 'ondernemen-met-ai.intro-gezien.v1';

/**
 * De demo houdt zijn sleutel. De echte stand bewaart de vinkjes per repo, zodat ze niet door elkaar lopen
 * met de demo op dezelfde site, en een nieuwe repo leeg begint. Zonder repo is er één sleutel voor de echte stand.
 */
export function handmatigSleutel(stand: 'demo' | 'echt', repo: string | null): string {
  if (stand === 'demo') return HANDMATIG_KEY;
  return repo ? `ondernemen-met-ai.handmatig.${repo}.v1` : 'ondernemen-met-ai.handmatig.echt.v1';
}

export function leesHandmatig(storage: StorageLike | null, sleutel: string = HANDMATIG_KEY): Set<string> {
  try {
    const raw = storage?.getItem(sleutel);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []);
  } catch {
    return new Set();
  }
}

export function schrijfHandmatig(storage: StorageLike | null, ids: Set<string>, sleutel: string = HANDMATIG_KEY): void {
  try {
    storage?.setItem(sleutel, JSON.stringify([...ids]));
  } catch {
    // Geblokkeerde opslag: de stand geldt dan alleen in dit tabblad.
  }
}

export function leesVlag(storage: StorageLike | null, key: string): boolean {
  try {
    return storage?.getItem(key) === 'ja';
  } catch {
    return false;
  }
}

export function zetVlag(storage: StorageLike | null, key: string, aan: boolean): void {
  try {
    if (aan) storage?.setItem(key, 'ja');
    else storage?.removeItem(key);
  } catch {
    // Zie schrijfHandmatig.
  }
}
