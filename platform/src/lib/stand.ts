/** Welke versie draait: de demo (mock-repo, demoknoppen) of de echte met GitHub. */
export type Standsoort = 'demo' | 'echt';

/** De demo draait op /demo en in deploy previews (VITE_STAND=demo); de rest van de site is echt. */
export function kiesStand(pad: string, viteStand: string | undefined): Standsoort {
  if (viteStand === 'demo') return 'demo';
  if (pad === '/demo' || pad.startsWith('/demo/')) return 'demo';
  return 'echt';
}
