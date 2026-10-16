import { describe, expect, it } from 'vitest';
import css from './styles.css?raw';

type Rgba = [number, number, number, number];

function token(name: string): string {
  const value = css.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1];
  if (!value) throw new Error(`token --${name} ontbreekt`);
  return value.trim();
}

function parseColor(value: string): Rgba {
  const hex = value.match(/^#([0-9a-f]{6})$/i)?.[1];
  if (hex) return [0, 2, 4].map((i) => Number.parseInt(hex.slice(i, i + 2), 16)).concat(1) as Rgba;
  const rgba = value.match(/^rgba\(([^)]+)\)$/)?.[1];
  if (rgba) return rgba.split(',').map(Number) as Rgba;
  throw new Error(`onbekende kleur ${value}`);
}

/** Legt een (half)doorzichtige kleur over een dichte achtergrond. */
function over(top: Rgba, bottom: Rgba): Rgba {
  const a = top[3];
  return [0, 1, 2].map((i) => top[i] * a + bottom[i] * (1 - a)).concat(1) as Rgba;
}

function luminance([r, g, b]: Rgba): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrast(a: Rgba, b: Rgba): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// Lichtste plek van de pagina: bovenaan, waar de paarse gloed uit body::before op zijn sterkst is.
const pagina = over([91, 45, 142, 0.55], parseColor(token('bg-dark')));
const ACHTERGRONDEN: Record<string, Rgba> = {
  pagina,
  kaart: over(parseColor(token('card-bg-strong')), pagina),
  'gekozen level': over(parseColor(token('glass-bg-strong')), pagina),
};

describe('huisstijl-tokens', () => {
  it('--text-muted haalt AA-contrast (4,5:1) voor kleine tekst', () => {
    const muted = parseColor(token('text-muted'));
    for (const [naam, achtergrond] of Object.entries(ACHTERGRONDEN)) {
      expect(contrast(muted, achtergrond), naam).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('de pop-up staat in het midden, ook al zet de reset van Tailwind margin op 0', () => {
    expect(css).toMatch(/\.popup\s*\{[^}]*margin:\s*auto/);
  });

  it('de hoofdknop krijgt zichtbare focus', () => {
    expect(css).toMatch(/\.btn-p:focus-visible\s*\{[^}]*outline:/);
  });

  it('het uploadlabel krijgt zichtbare focus als de verborgen bestandskiezer focus heeft', () => {
    expect(css).toMatch(/\.btn-o:focus-within\s*\{[^}]*outline:\s*2px solid var\(--accent\)/);
  });
});

describe('smalle schermen', () => {
  it('een brede tabel duwt de kolommen niet breder dan het scherm', () => {
    expect(css).toMatch(/\.hoofd-grid > \*\s*\{[^}]*min-width:\s*0/);
    expect(css).toMatch(/\.paneel\s*\{[^}]*overflow-x:\s*auto/);
  });
});
