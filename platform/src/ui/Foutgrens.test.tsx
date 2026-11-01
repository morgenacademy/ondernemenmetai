import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Foutgrens } from './Foutgrens';

const noop = () => {};

describe('Foutgrens', () => {
  it('toont de app zolang er niets misgaat', () => {
    const html = renderToStaticMarkup(
      <Foutgrens onClear={noop}>
        <p>De app</p>
      </Foutgrens>,
    );
    expect(html).toBe('<p>De app</p>');
  });

  it('schakelt over op het foutscherm na een fout', () => {
    expect(Foutgrens.getDerivedStateFromError()).toEqual({ failed: true });
  });

  it('het foutscherm biedt een knop die de demo-opslag wist', () => {
    const grens = new Foutgrens({ onClear: noop, children: <p>De app</p> });
    grens.state = { failed: true };
    const html = renderToStaticMarkup(<>{grens.render()}</>);
    expect(html).not.toContain('De app');
    expect(html).toContain('role="alert"');
    expect(html).toMatch(/<button type="button"[^>]*>Wis de demo-opslag en begin opnieuw<\/button>/);
  });
});

describe('Foutgrens in de echte stand', () => {
  it('praat niet over de demo en biedt één knop om de pagina te herladen', () => {
    const grens = new Foutgrens({ onClear: noop, soort: 'echt', children: <p>De app</p> });
    grens.state = { failed: true };
    const html = renderToStaticMarkup(<>{grens.render()}</>);
    expect(html).toContain('role="alert"');
    expect(html).not.toMatch(/demo/i);
    expect(html).toContain('Je repo op GitHub is niet veranderd');
    expect(html.match(/<button/g)).toHaveLength(1);
    expect(html).toMatch(/<button type="button"[^>]*>Herlaad de pagina<\/button>/);
  });
});
