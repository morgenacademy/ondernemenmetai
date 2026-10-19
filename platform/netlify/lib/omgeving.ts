// Leest de omgevingsvariabelen die de functions nodig hebben.
export type Omgeving = { clientId: string; clientSecret: string; appSlug: string; sessieSleutel: string };

export function omgeving(env: Record<string, string | undefined> = process.env): Omgeving {
  const lees = (naam: string): string => {
    const waarde = env[naam];
    if (!waarde) throw new Error(`Ontbrekende omgevingsvariabele: ${naam}`);
    return waarde;
  };
  return {
    clientId: lees('GITHUB_CLIENT_ID'),
    clientSecret: lees('GITHUB_CLIENT_SECRET'),
    appSlug: lees('GITHUB_APP_SLUG'),
    sessieSleutel: lees('SESSIE_SLEUTEL'),
  };
}
