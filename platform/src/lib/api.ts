import { GeenRepo, GitHubDruk, NietIngelogd, RepoFout } from './repo/fouten';

export type ApiFetch = (pad: string, init?: RequestInit) => Promise<Response>;

/**
 * Alle /api-aanroepen gaan één voor één: een nieuw verzoek begint pas als het vorige
 * antwoord binnen is. Zo krijgt elk verzoek het nieuwste cookie mee (een refresh-token
 * van GitHub werkt maar één keer). Een fout breekt de keten niet.
 */
export function maakApi(haal: typeof fetch = (...a) => fetch(...a)): ApiFetch {
  let keten: Promise<unknown> = Promise.resolve();
  return (pad, init) => {
    const verzoek = keten.then(() => haal(pad, init));
    keten = verzoek.then(
      () => undefined,
      () => undefined,
    );
    return verzoek;
  };
}

/** De gedeelde instantie voor de hele app. */
export const api: ApiFetch = maakApi();

/** Geeft het antwoord terug als het goed is; anders een fout met een zin voor de deelnemer. */
export async function gooiBijFout(res: Response, anders: string): Promise<Response> {
  if (res.status === 401) throw new NietIngelogd();
  if (res.status === 409) throw new GeenRepo();
  if (res.status === 429) throw new GitHubDruk();
  if (!res.ok) throw new RepoFout(anders);
  return res;
}
