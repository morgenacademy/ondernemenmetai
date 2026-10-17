import type { StorageLike } from '../lib/repo/mockRepo';

/**
 * Stappen zonder check (zoals "Maak een GitHub-account") vink je zelf af. Dat is platformstand,
 * geen repo-inhoud; in de demo bewaart de browser hem.
 */
export const HANDMATIG_KEY = 'ondernemen-met-ai.handmatig.v1';
export const INTRO_KEY = 'ondernemen-met-ai.intro-gezien.v1';

export function leesHandmatig(storage: StorageLike | null): Set<string> {
  try {
    const raw = storage?.getItem(HANDMATIG_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []);
  } catch {
    return new Set();
  }
}

export function schrijfHandmatig(storage: StorageLike | null, ids: Set<string>): void {
  try {
    storage?.setItem(HANDMATIG_KEY, JSON.stringify([...ids]));
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
