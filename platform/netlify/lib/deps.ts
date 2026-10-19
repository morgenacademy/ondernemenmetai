// Wat elke function van buiten nodig heeft, zodat tests het kunnen vervangen.
import type { Haal } from './github';

export type Deps = {
  haal: Haal;
  env: Record<string, string | undefined>;
  nu?: () => number;
  willekeurig?: () => string;
};

export function standaardDeps(): Deps {
  return { haal: fetch, env: process.env, nu: Date.now, willekeurig: () => crypto.randomUUID() };
}

// Een scherm in de app waar we naar terug mogen sturen, nooit een adres buiten de site.
export function geldigTerug(t: string | null): string | null {
  return t !== null && /^#\/[A-Za-z0-9/?=&-]*$/.test(t) ? t : null;
}

// 302 met losse Set-Cookie-headers.
export function omleiding(locatie: string, cookies: string[] = []): Response {
  const headers = new Headers({ Location: locatie });
  for (const c of cookies) headers.append('Set-Cookie', c);
  return new Response(null, { status: 302, headers });
}
