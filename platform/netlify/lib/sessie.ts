// Versleutelde sessie in een cookie. De token van GitHub staat nergens anders.
export type Sessie = { token: string; refresh: string; verloopt: number; login: string; repo: string | null }; // verloopt: ms sinds epoch

export const SESSIE_COOKIE = 'oma_sessie';
export const STATE_COOKIE = 'oma_state';
export const TERUG_COOKIE = 'oma_terug';
export const ZES_MAANDEN = 15_897_600; // seconden
export const TIEN_MINUTEN = 600; // seconden

const IV_LENGTE = 12;

async function maakSleutel(sleutel: string, gebruik: 'encrypt' | 'decrypt'): Promise<CryptoKey> {
  const bytes = Buffer.from(sleutel, 'base64');
  if (bytes.length !== 32) throw new Error('SESSIE_SLEUTEL moet 32 bytes in base64 zijn');
  return crypto.subtle.importKey('raw', bytes, 'AES-GCM', false, [gebruik]);
}

function isSessie(x: unknown): x is Sessie {
  if (typeof x !== 'object' || x === null) return false;
  const s = x as Record<string, unknown>;
  return (
    typeof s.token === 'string' &&
    typeof s.refresh === 'string' &&
    typeof s.verloopt === 'number' &&
    typeof s.login === 'string' &&
    (s.repo === null || typeof s.repo === 'string')
  );
}

// base64url van iv + ciphertext (AES-GCM, iv van 12 bytes, elke keer vers).
export async function sluit(s: Sessie, sleutel: string): Promise<string> {
  const key = await maakSleutel(sleutel, 'encrypt');
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTE));
  const tekst = new TextEncoder().encode(JSON.stringify(s));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, tekst));
  return Buffer.concat([iv, ct]).toString('base64url');
}

// Geeft null bij kapotte, vervalste of met een andere sleutel gesloten waarde.
export async function open(waarde: string, sleutel: string): Promise<Sessie | null> {
  try {
    if (!/^[A-Za-z0-9_-]+$/.test(waarde)) return null;
    const bytes = Buffer.from(waarde, 'base64url');
    if (bytes.length <= IV_LENGTE) return null;
    const key = await maakSleutel(sleutel, 'decrypt');
    const iv = bytes.subarray(0, IV_LENGTE);
    const ct = bytes.subarray(IV_LENGTE);
    const tekst = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
    const data: unknown = JSON.parse(new TextDecoder().decode(tekst));
    return isSessie(data) ? data : null;
  } catch {
    return null;
  }
}

export function leesCookie(req: Request, naam: string): string | null {
  const header = req.headers.get('cookie');
  if (!header) return null;
  for (const deel of header.split(';')) {
    const i = deel.indexOf('=');
    if (i === -1) continue;
    if (deel.slice(0, i).trim() === naam) return deel.slice(i + 1).trim();
  }
  return null;
}

// Waarde voor een Set-Cookie-header. Secure alleen over https, zodat localhost werkt.
export function zetCookie(req: Request, naam: string, waarde: string, maxAge: number): string {
  const secure = new URL(req.url).protocol === 'https:' ? '; Secure' : '';
  return `${naam}=${waarde}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${secure}`;
}

export function wisCookie(req: Request, naam: string): string {
  return zetCookie(req, naam, '', 0);
}
