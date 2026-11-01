import { api, gooiBijFout, type ApiFetch } from '../api';
import { RepoFout } from './fouten';
import type { Commit, RepoAdapter, RepoAntwoord, RepoInfo } from './types';

export const OPHALEN_MISLUKT = 'Je repo ophalen lukte niet. Probeer het opnieuw.';

/** Leest en schrijft de echte repo via de Netlify Functions. */
export class GitHubRepoAdapter implements RepoAdapter {
  private bewaard: RepoAntwoord | null = null;
  private onderweg: Promise<void> | null = null;
  // Telt schrijfacties: een ophaalronde van vóór een schrijfactie mag de bewaarde stand niet vullen.
  private versie = 0;

  constructor(private readonly a: ApiFetch = api) {}

  refresh(): Promise<void> {
    if (this.onderweg) return this.onderweg;
    const versie = this.versie;
    const ronde = (async () => {
      let res: Response;
      try {
        res = await this.a('/api/repo');
      } catch {
        throw new RepoFout(OPHALEN_MISLUKT);
      }
      await gooiBijFout(res, OPHALEN_MISLUKT);
      let antwoord: RepoAntwoord;
      try {
        antwoord = (await res.json()) as RepoAntwoord;
      } catch {
        throw new RepoFout(OPHALEN_MISLUKT);
      }
      if (versie === this.versie) this.bewaard = antwoord;
    })().finally(() => {
      this.onderweg = null;
    });
    this.onderweg = ronde;
    return ronde;
  }

  private async antwoord(): Promise<RepoAntwoord> {
    if (!this.bewaard) await this.refresh();
    if (!this.bewaard) {
      // Er is intussen geschreven: haal nog eens op.
      await this.refresh();
    }
    if (!this.bewaard) throw new RepoFout(OPHALEN_MISLUKT);
    return this.bewaard;
  }

  async getInfo(): Promise<RepoInfo> {
    return (await this.antwoord()).info;
  }

  async listFiles(): Promise<string[]> {
    return Object.keys((await this.antwoord()).files).sort();
  }

  async readFile(path: string): Promise<string | null> {
    const files = (await this.antwoord()).files;
    return Object.prototype.hasOwnProperty.call(files, path) ? files[path] : null;
  }

  async commits(): Promise<Commit[]> {
    return (await this.antwoord()).commits;
  }

  async writeFile(path: string, content: string, message: string): Promise<void> {
    const mislukt = `Opslaan van ${path} is mislukt. Je invoer staat er nog; probeer het opnieuw.`;
    let res: Response;
    try {
      res = await this.a('/api/bestand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, content, message }),
      });
    } catch {
      throw new RepoFout(mislukt);
    }
    await gooiBijFout(res, mislukt);
    this.versie += 1;
    this.bewaard = null;
  }
}
