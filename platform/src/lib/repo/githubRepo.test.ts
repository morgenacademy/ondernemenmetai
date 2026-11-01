import { describe, expect, it } from 'vitest';
import type { ApiFetch } from '../api';
import type { RepoAntwoord } from './types';
import { GitHubRepoAdapter } from './githubRepo';
import { LegeRepo } from './legeRepo';
import { NietIngelogd, RepoFout } from './fouten';

const antwoord: RepoAntwoord = {
  info: { name: 'ondernemen', owner: 'ada', isPrivate: true, mergedPullRequests: 2 },
  files: { 'b.md': 'B', 'a.md': 'A' },
  commits: [{ message: 'Eerste', at: '2026-10-01T10:00:00Z' }],
};

function nepApi(status = 200) {
  const aanroepen: { pad: string; init?: RequestInit }[] = [];
  const a: ApiFetch = async (pad, init) => {
    aanroepen.push({ pad, init });
    if (pad === '/api/repo') {
      return new Response(status === 200 ? JSON.stringify(antwoord) : null, { status });
    }
    return new Response(null, { status: 204 });
  };
  return { a, aanroepen };
}

const repoAanroepen = (l: { pad: string }[]) => l.filter((x) => x.pad === '/api/repo').length;

describe('GitHubRepoAdapter', () => {
  it('haalt één keer op voor getInfo, listFiles, readFile en commits', async () => {
    const { a, aanroepen } = nepApi();
    const repo = new GitHubRepoAdapter(a);
    await repo.refresh();
    expect(repoAanroepen(aanroepen)).toBe(1);
    expect(await repo.getInfo()).toEqual(antwoord.info);
    expect(await repo.listFiles()).toEqual(['a.md', 'b.md']);
    expect(await repo.readFile('a.md')).toBe('A');
    expect(await repo.readFile('weg.md')).toBeNull();
    expect(await repo.commits()).toEqual(antwoord.commits);
    expect(repoAanroepen(aanroepen)).toBe(1);
  });

  it('haalt zelf op als er nog niets is, ook bij gelijktijdige reads', async () => {
    const { a, aanroepen } = nepApi();
    const repo = new GitHubRepoAdapter(a);
    const [info, bestanden] = await Promise.all([repo.getInfo(), repo.listFiles(), repo.readFile('a.md'), repo.commits()]);
    expect(info.owner).toBe('ada');
    expect(bestanden).toEqual(['a.md', 'b.md']);
    expect(repoAanroepen(aanroepen)).toBe(1);
  });

  it('writeFile post path, content en message naar /api/bestand en haalt daarna opnieuw op', async () => {
    const { a, aanroepen } = nepApi();
    const repo = new GitHubRepoAdapter(a);
    await repo.listFiles();
    await repo.writeFile('a.md', 'nieuw', 'Update a');
    const post = aanroepen.find((x) => x.pad === '/api/bestand');
    expect(post?.init?.method).toBe('POST');
    expect(new Headers(post?.init?.headers).get('Content-Type')).toBe('application/json');
    expect(JSON.parse(post?.init?.body as string)).toEqual({ path: 'a.md', content: 'nieuw', message: 'Update a' });
    await repo.listFiles();
    expect(repoAanroepen(aanroepen)).toBe(2);
  });

  it('writeFile gooit een RepoFout met de opslaan-zin', async () => {
    const a: ApiFetch = async () => new Response(null, { status: 500 });
    const fout = await new GitHubRepoAdapter(a).writeFile('a.md', 'x', 'm').catch((e) => e);
    expect(fout).toBeInstanceOf(RepoFout);
    expect(fout.message).toBe('Opslaan van a.md is mislukt. Je invoer staat er nog; probeer het opnieuw.');
  });

  it('geeft NietIngelogd bij een 401', async () => {
    const { a } = nepApi(401);
    await expect(new GitHubRepoAdapter(a).refresh()).rejects.toBeInstanceOf(NietIngelogd);
  });

  it('geeft de ophaal-zin bij een serverfout of netwerkfout', async () => {
    const { a } = nepApi(502);
    const fout = await new GitHubRepoAdapter(a).refresh().catch((e) => e);
    expect(fout.message).toBe('Je repo ophalen lukte niet. Probeer het opnieuw.');
    const stuk: ApiFetch = async () => {
      throw new TypeError('Failed to fetch');
    };
    const fout2 = await new GitHubRepoAdapter(stuk).refresh().catch((e) => e);
    expect(fout2).toBeInstanceOf(RepoFout);
    expect(fout2.message).toBe('Je repo ophalen lukte niet. Probeer het opnieuw.');
  });
});

describe('LegeRepo', () => {
  it('heeft geen bestanden en weigert te schrijven', async () => {
    const repo = new LegeRepo();
    expect(await repo.getInfo()).toEqual({ name: '', owner: '', isPrivate: true, mergedPullRequests: 0 });
    expect(await repo.listFiles()).toEqual([]);
    expect(await repo.readFile('a.md')).toBeNull();
    expect(await repo.commits()).toEqual([]);
    await repo.refresh();
    const fout = await repo.writeFile('a.md', 'x', 'm').catch((e) => e);
    expect(fout).toBeInstanceOf(RepoFout);
    expect(fout.message).toBe('Koppel eerst je repo in stap 3 van level 0.');
  });
});
