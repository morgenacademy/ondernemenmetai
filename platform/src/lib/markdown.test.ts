import { describe, expect, it } from 'vitest';
import { MARKER, countListItems, isFilled, parseMarkdown, toMarkdown } from './markdown';

describe('toMarkdown en parseMarkdown', () => {
  it('maakt frontmatter en leest hem terug', () => {
    const md = toMarkdown({ type: 'B2B', interviews_nodig: 5 }, '# Doelgroep\n\nZzp-fysiotherapeuten');
    expect(md.startsWith('---\n')).toBe(true);
    const parsed = parseMarkdown(md);
    expect(parsed.frontmatter).toEqual({ type: 'B2B', interviews_nodig: 5 });
    expect(parsed.body).toBe('# Doelgroep\n\nZzp-fysiotherapeuten\n');
    expect(parsed.error).toBeUndefined();
  });

  it('laat lege frontmatter weg', () => {
    expect(toMarkdown(null, 'Tekst')).toBe('Tekst\n');
    expect(toMarkdown({}, 'Tekst')).toBe('Tekst\n');
  });

  it('geeft een leesbare fout bij kapotte YAML', () => {
    const parsed = parseMarkdown('---\ntype: [B2B\n---\nTekst');
    expect(parsed.error).toBe('Frontmatter is geen geldige YAML');
    expect(parsed.frontmatter).toEqual({});
  });

  it('geeft een fout als de frontmatter niet wordt afgesloten', () => {
    expect(parseMarkdown('---\ntype: B2B\nTekst').error).toBe('Frontmatter wordt niet afgesloten met ---');
  });

  it('accepteert Windows-regeleindes', () => {
    expect(parseMarkdown('---\r\ntype: B2C\r\n---\r\nTekst').frontmatter).toEqual({ type: 'B2C' });
  });
});

describe('isFilled', () => {
  it('is false zonder bestand', () => {
    expect(isFilled(undefined)).toBe(false);
  });
  it('is false zolang de marker erin staat', () => {
    expect(isFilled(`# Idee\n\n${MARKER}\nMijn idee`)).toBe(false);
  });
  it('is false met alleen koppen', () => {
    expect(isFilled('# Idee\n\n## Wat\n')).toBe(false);
  });
  it('is true met echte inhoud', () => {
    expect(isFilled('# Idee\n\nEen fietskoerier voor apotheken.')).toBe(true);
  });
});

describe('countListItems', () => {
  it('telt alleen lijstregels met inhoud', () => {
    expect(countListItems('# Aannames\n\n- [wens] een\n- [haalbaar] twee\n-\n* drie\ntekst')).toBe(3);
  });
});
