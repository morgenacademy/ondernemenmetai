import { describe, expect, it } from 'vitest';
import { nieuwTabblad } from './Markdown';

describe('nieuwTabblad', () => {
  it('laat links naar buiten openen in een nieuw tabblad', () => {
    expect(nieuwTabblad('<a href="https://github.com/new">x</a>')).toBe(
      '<a href="https://github.com/new" target="_blank" rel="noreferrer">x</a>',
    );
  });
  it('laat interne links en links met een eigen target staan', () => {
    expect(nieuwTabblad('<a href="#/level/1">x</a>')).toBe('<a href="#/level/1">x</a>');
    const eigen = '<a href="https://x.nl" target="_self">x</a>';
    expect(nieuwTabblad(eigen)).toBe(eigen);
  });
});
