import { describe, expect, it } from 'vitest';
import { gooiBijFout, maakApi } from './api';
import { GeenRepo, GitHubDruk, NietIngelogd, RepoFout } from './repo/fouten';

function uitgesteld() {
  let los!: (r: Response) => void;
  let faal!: (e: unknown) => void;
  const belofte = new Promise<Response>((a, b) => {
    los = a;
    faal = b;
  });
  return { belofte, los, faal };
}

describe('maakApi', () => {
  it('stuurt nooit twee verzoeken tegelijk', async () => {
    const wachtend = [uitgesteld(), uitgesteld()];
    const gestart: string[] = [];
    const api = maakApi(((pad: string) => {
      gestart.push(pad);
      return wachtend[gestart.length - 1].belofte;
    }) as unknown as typeof fetch);

    const een = api('/api/een');
    const twee = api('/api/twee');
    await Promise.resolve();
    await new Promise((r) => setTimeout(r, 0));
    expect(gestart).toEqual(['/api/een']);

    wachtend[0].faal(new Error('netwerk'));
    await expect(een).rejects.toThrow('netwerk');
    await new Promise((r) => setTimeout(r, 0));
    expect(gestart).toEqual(['/api/een', '/api/twee']);

    wachtend[1].los(new Response(null, { status: 204 }));
    expect((await twee).status).toBe(204);
  });

  it('geeft init door aan fetch', async () => {
    let gezien: RequestInit | undefined;
    const api = maakApi((async (_pad: string, init?: RequestInit) => {
      gezien = init;
      return new Response(null, { status: 204 });
    }) as unknown as typeof fetch);
    await api('/api/x', { method: 'POST' });
    expect(gezien).toEqual({ method: 'POST' });
  });
});

describe('gooiBijFout', () => {
  const anders = 'Dat lukte niet.';
  it('vertaalt statussen naar fouten met een zin', async () => {
    await expect(gooiBijFout(new Response(null, { status: 401 }), anders)).rejects.toBeInstanceOf(NietIngelogd);
    await expect(gooiBijFout(new Response(null, { status: 409 }), anders)).rejects.toBeInstanceOf(GeenRepo);
    await expect(gooiBijFout(new Response(null, { status: 429 }), anders)).rejects.toBeInstanceOf(GitHubDruk);
    const fout = await gooiBijFout(new Response(null, { status: 500 }), anders).catch((e) => e);
    expect(fout).toBeInstanceOf(RepoFout);
    expect(fout.message).toBe(anders);
  });

  it('geeft een goed antwoord zelf terug', async () => {
    const res = new Response('{}', { status: 200 });
    expect(await gooiBijFout(res, anders)).toBe(res);
  });
});
