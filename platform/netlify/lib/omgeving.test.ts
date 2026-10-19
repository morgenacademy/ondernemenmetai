import { describe, expect, it } from 'vitest';
import { omgeving } from './omgeving';

describe('omgeving', () => {
  it('gooit bij de eerste ontbrekende variabele', () => {
    expect(() => omgeving({})).toThrow('Ontbrekende omgevingsvariabele: GITHUB_CLIENT_ID');
  });

  it('behandelt een lege waarde als ontbrekend', () => {
    const env = { GITHUB_CLIENT_ID: 'a', GITHUB_CLIENT_SECRET: '', GITHUB_APP_SLUG: 'c', SESSIE_SLEUTEL: 'd' };
    expect(() => omgeving(env)).toThrow('Ontbrekende omgevingsvariabele: GITHUB_CLIENT_SECRET');
  });

  it('geeft de waarden terug als alles ingevuld is', () => {
    const env = { GITHUB_CLIENT_ID: 'a', GITHUB_CLIENT_SECRET: 'b', GITHUB_APP_SLUG: 'c', SESSIE_SLEUTEL: 'd' };
    expect(omgeving(env)).toEqual({ clientId: 'a', clientSecret: 'b', appSlug: 'c', sessieSleutel: 'd' });
  });
});
