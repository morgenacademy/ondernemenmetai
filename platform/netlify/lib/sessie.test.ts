import { describe, expect, it } from 'vitest';
import { leesCookie, open, sluit, wisCookie, zetCookie, type Sessie } from './sessie';

const sleutel = Buffer.alloc(32, 7).toString('base64');
const andereSleutel = Buffer.alloc(32, 9).toString('base64');
const sessie: Sessie = { token: 'ghu_geheim', refresh: 'ghr_geheim', verloopt: 1_900_000_000_000, login: 'deelnemer', repo: 'deelnemer/mijn-repo' };

describe('sluit en open', () => {
  it('geven dezelfde sessie terug', async () => {
    expect(await open(await sluit(sessie, sleutel), sleutel)).toEqual(sessie);
  });

  it('geeft elke keer een andere waarde (verse iv) en lekt de token niet', async () => {
    const a = await sluit(sessie, sleutel);
    const b = await sluit(sessie, sleutel);
    expect(a).not.toBe(b);
    expect(a).not.toContain('ghu_geheim');
    expect(a).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it('geeft null bij een veranderde letter', async () => {
    const w = await sluit(sessie, sleutel);
    const i = Math.floor(w.length / 2);
    const kapot = w.slice(0, i) + (w[i] === 'A' ? 'B' : 'A') + w.slice(i + 1);
    expect(await open(kapot, sleutel)).toBeNull();
  });

  it('geeft null bij een andere sleutel, lege string, rommel en te korte invoer', async () => {
    const w = await sluit(sessie, sleutel);
    expect(await open(w, andereSleutel)).toBeNull();
    expect(await open('', sleutel)).toBeNull();
    expect(await open('dit is geen base64url!!', sleutel)).toBeNull();
    expect(await open('abcd', sleutel)).toBeNull();
  });

  it('geeft null als de ontsleutelde JSON geen Sessie is', async () => {
    const sleutelBytes = Buffer.from(sleutel, 'base64');
    const key = await crypto.subtle.importKey('raw', sleutelBytes, 'AES-GCM', false, ['encrypt']);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode('{"token":1}')));
    const w = Buffer.concat([iv, ct]).toString('base64url');
    expect(await open(w, sleutel)).toBeNull();
  });

  it('geeft null bij een sleutel van de verkeerde lengte', async () => {
    const w = await sluit(sessie, sleutel);
    expect(await open(w, Buffer.alloc(16).toString('base64'))).toBeNull();
  });

  it('gooit bij sluiten met een sleutel van de verkeerde lengte', async () => {
    await expect(sluit(sessie, Buffer.alloc(16).toString('base64'))).rejects.toThrow('SESSIE_SLEUTEL');
  });
});

describe('cookies', () => {
  it('zetCookie zet over https alle attributen inclusief Secure', () => {
    const c = zetCookie(new Request('https://site/api/x'), 'oma_sessie', 'abc', 15_897_600);
    for (const deel of ['oma_sessie=abc', 'HttpOnly', 'SameSite=Lax', 'Path=/', 'Secure', 'Max-Age=15897600']) {
      expect(c).toContain(deel);
    }
  });

  it('zetCookie laat Secure weg op http://localhost', () => {
    const c = zetCookie(new Request('http://localhost:8888/api/x'), 'oma_sessie', 'abc', 600);
    expect(c).not.toContain('Secure');
    expect(c).toContain('Max-Age=600');
  });

  it('wisCookie leegt de waarde met Max-Age=0', () => {
    const c = wisCookie(new Request('https://site/api/x'), 'oma_sessie');
    expect(c).toContain('oma_sessie=;');
    expect(c).toContain('Max-Age=0');
    expect(c).toContain('Secure');
  });

  it('leesCookie haalt de waarde uit een header met andere cookies en spaties', () => {
    const req = new Request('https://site/', { headers: { cookie: 'a=1; oma_sessie=xyz; b=2' } });
    expect(leesCookie(req, 'oma_sessie')).toBe('xyz');
  });

  it('leesCookie geeft null zonder header of zonder dat cookie', () => {
    expect(leesCookie(new Request('https://site/'), 'oma_sessie')).toBeNull();
    expect(leesCookie(new Request('https://site/', { headers: { cookie: 'a=1' } }), 'oma_sessie')).toBeNull();
  });
});
