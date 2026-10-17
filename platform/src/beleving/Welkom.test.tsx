import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Welkom } from './Welkom';

const html = renderToStaticMarkup(<Welkom />);

describe('Welkom', () => {
  it('vertelt in vijf schermen wat je gaat doen, met één zin per scherm', () => {
    for (const kop of ['Je start je eigen bedrijf.', 'Zes stappen naar de markt', 'Eerst je basiskamp.', 'Dan de markt op.', 'Tot je eerste klant.']) {
      expect(html).toContain(kop);
    }
    expect(html.match(/<section/g)).toHaveLength(5);
  });

  it('de route toont zeven haltes en de lussen tussen 1 en 2 en tussen 4 en 5', () => {
    expect(html).toMatch(/<svg class="bl-zigzag"[^>]*role="img"/);
    for (const naam of ['Werkplek', 'Idee', 'Probleem-validatie', 'Prototype', 'Markt feedback', 'Product-validatie', 'Lancering']) expect(html).toContain(`>${naam}</text>`);
    expect(html.match(/↻ heen en weer/g)).toHaveLength(2);
  });

  it('eindigt met een knop naar je route', () => {
    expect(html).toMatch(/<a class="bl-knop[^"]*" href="#\/route">Bekijk je route →<\/a>/);
  });
});
