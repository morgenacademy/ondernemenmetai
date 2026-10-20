import { api, gooiBijFout, type ApiFetch } from './api';

export type SessieStand =
  | { stand: 'uit' }
  | { stand: 'kies-repo'; login: string; repos: string[] }
  | { stand: 'gekoppeld'; login: string; repo: string };

export async function haalSessie(a: ApiFetch = api): Promise<SessieStand> {
  const res = await gooiBijFout(await a('/api/sessie'), 'Je inlog ophalen lukte niet. Probeer het opnieuw.');
  return (await res.json()) as SessieStand;
}

export async function kiesRepo(repo: string, a: ApiFetch = api): Promise<void> {
  await gooiBijFout(
    await a('/api/repo-kiezen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repo }),
    }),
    'Je repo koppelen lukte niet. Kies de repo opnieuw.',
  );
}

export async function uitloggen(a: ApiFetch = api): Promise<void> {
  await gooiBijFout(await a('/api/uitloggen', { method: 'POST' }), 'Uitloggen lukte niet. Probeer het opnieuw.');
}

export function inlogUrl(terug: string): string {
  return '/api/login?terug=' + encodeURIComponent(terug);
}

export function koppelUrl(terug: string): string {
  return '/api/koppel?terug=' + encodeURIComponent(terug);
}
