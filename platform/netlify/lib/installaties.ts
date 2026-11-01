// De repo's die de deelnemer aan de app heeft gegeven.
import type { Api } from './github';

async function lees(res: Response): Promise<Record<string, unknown>> {
  if (!res.ok) throw new Error(`GitHub gaf status ${res.status} bij het ophalen van de repo's`);
  return (await res.json()) as Record<string, unknown>;
}

// Unieke full_name's, gesorteerd. Gooit bij elke fout van GitHub, zodat er geen halve lijst terugkomt.
export async function reposVanGebruiker(api: Api): Promise<string[]> {
  const installaties = await lees(await api('/user/installations?per_page=100'));
  const lijst = Array.isArray(installaties.installations) ? (installaties.installations as Array<{ id: number }>) : [];
  const namen = new Set<string>();
  for (const { id } of lijst) {
    const data = await lees(await api(`/user/installations/${id}/repositories?per_page=100`));
    const repos = Array.isArray(data.repositories) ? (data.repositories as Array<{ full_name: string }>) : [];
    for (const r of repos) if (typeof r.full_name === 'string') namen.add(r.full_name);
  }
  return [...namen].sort();
}

// Een 403 kan ook een tijdelijke weigering zijn. Alleen als de repo uit de installatie is, is hij echt weg.
export async function heeftRepo(api: Api, repo: string): Promise<boolean> {
  return (await reposVanGebruiker(api)).includes(repo);
}
