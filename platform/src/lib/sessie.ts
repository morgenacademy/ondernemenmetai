import { api, gooiBijFout, type ApiFetch } from './api';

export type SessieStand =
  | { stand: 'uit' }
  | { stand: 'kies-repo'; login: string; repos: string[] }
  | { stand: 'gekoppeld'; login: string; repo: string };

export const SESSIE_MISLUKT = 'Je inlog ophalen lukte niet. Probeer het opnieuw.';
export const KIEZEN_MISLUKT = 'Je repo koppelen lukte niet. Kies de repo opnieuw.';
export const UITLOGGEN_MISLUKT = 'Uitloggen lukte niet. Probeer het opnieuw.';

export async function haalSessie(a: ApiFetch = api): Promise<SessieStand> {
  const res = await gooiBijFout(await a('/api/sessie'), SESSIE_MISLUKT);
  return (await res.json()) as SessieStand;
}

export async function kiesRepo(repo: string, a: ApiFetch = api): Promise<void> {
  await gooiBijFout(
    await a('/api/repo-kiezen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repo }),
    }),
    KIEZEN_MISLUKT,
  );
}

export async function uitloggen(a: ApiFetch = api): Promise<void> {
  await gooiBijFout(await a('/api/uitloggen', { method: 'POST' }), UITLOGGEN_MISLUKT);
}

export function inlogUrl(terug: string): string {
  return '/api/login?terug=' + encodeURIComponent(terug);
}

export function koppelUrl(terug: string): string {
  return '/api/koppel?terug=' + encodeURIComponent(terug);
}
