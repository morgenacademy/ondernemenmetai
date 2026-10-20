import { describe, expect, it } from 'vitest';
import type { ApiFetch } from './api';
import { haalSessie, inlogUrl, koppelUrl, kiesRepo, uitloggen } from './sessie';
import { GitHubDruk, RepoFout } from './repo/fouten';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

describe('sessie', () => {
  it('haalSessie geeft de stand terug', async () => {
    const a: ApiFetch = async (pad) => {
      expect(pad).toBe('/api/sessie');
      return json({ stand: 'gekoppeld', login: 'ada', repo: 'ada/ondernemen' });
    };
    expect(await haalSessie(a)).toEqual({ stand: 'gekoppeld', login: 'ada', repo: 'ada/ondernemen' });
  });

  it('haalSessie gooit GitHubDruk bij 429 en RepoFout bij 502', async () => {
    await expect(haalSessie(async () => json({ fout: 'druk' }, 429))).rejects.toBeInstanceOf(GitHubDruk);
    await expect(haalSessie(async () => json({ fout: 'github' }, 502))).rejects.toBeInstanceOf(RepoFout);
  });

  it('kiesRepo post de repo als JSON', async () => {
    let gezien: { pad: string; init?: RequestInit } | undefined;
    await kiesRepo('ada/ondernemen', async (pad, init) => {
      gezien = { pad, init };
      return new Response(null, { status: 204 });
    });
    expect(gezien?.pad).toBe('/api/repo-kiezen');
    expect(gezien?.init?.method).toBe('POST');
    expect(new Headers(gezien?.init?.headers).get('Content-Type')).toBe('application/json');
    expect(JSON.parse(gezien?.init?.body as string)).toEqual({ repo: 'ada/ondernemen' });
  });

  it('kiesRepo en uitloggen gooien een RepoFout als het misgaat', async () => {
    await expect(kiesRepo('x/y', async () => new Response(null, { status: 403 }))).rejects.toBeInstanceOf(RepoFout);
    await expect(uitloggen(async () => new Response(null, { status: 500 }))).rejects.toBeInstanceOf(RepoFout);
  });

  it('uitloggen post naar /api/uitloggen', async () => {
    let gezien: { pad: string; init?: RequestInit } | undefined;
    await uitloggen(async (pad, init) => {
      gezien = { pad, init };
      return new Response(null, { status: 204 });
    });
    expect(gezien?.pad).toBe('/api/uitloggen');
    expect(gezien?.init?.method).toBe('POST');
  });

  it('bouwt de inlog- en koppel-url', () => {
    expect(inlogUrl('#/level/0')).toBe('/api/login?terug=%23%2Flevel%2F0');
    expect(koppelUrl('#/level/0')).toBe('/api/koppel?terug=%23%2Flevel%2F0');
  });
});
