import { describe, expect, it } from 'vitest';
import { GeenRepo, GitHubDruk, NietIngelogd, RepoFout } from '../lib/repo/fouten';
import { alsRepoFout, meldingVoor } from './meldingen';

describe('meldingVoor', () => {
  it('uitgelogd: de zin van NietIngelogd, met Log in met GitHub', () => {
    expect(meldingVoor(new NietIngelogd(), '')).toEqual({ tekst: 'Je bent uitgelogd. Log in met GitHub om verder te gaan.', actie: 'inloggen' });
  });

  it('repo kwijt: koppel opnieuw in stap 3 van level 0, zonder knop', () => {
    expect(meldingVoor(new GeenRepo(), '')).toEqual({ tekst: 'Koppel je repo opnieuw in stap 3 van level 0.', actie: null });
  });

  it('GitHub is druk: de zin van de fout, met Opnieuw', () => {
    expect(meldingVoor(new GitHubDruk(), '')).toEqual({ tekst: 'GitHub is even druk. Probeer het over een minuut opnieuw.', actie: 'opnieuw' });
  });

  it('een mislukte inlog in het adres: inloggen lukte niet, met Log in met GitHub', () => {
    expect(meldingVoor(null, '?fout=inloggen')).toEqual({ tekst: 'Inloggen bij GitHub lukte niet. Probeer het opnieuw.', actie: 'inloggen' });
  });

  it('zonder fout en zonder ?fout=inloggen: geen melding', () => {
    expect(meldingVoor(null, '')).toBeNull();
    expect(meldingVoor(null, '?iets=anders')).toBeNull();
  });

  it('een fout gaat voor de mislukte inlog in het adres', () => {
    expect(meldingVoor(new GitHubDruk(), '?fout=inloggen')?.actie).toBe('opnieuw');
  });
});

describe('alsRepoFout', () => {
  it('een RepoFout blijft zichzelf, een netwerkfout krijgt de zin die je meegeeft', () => {
    const druk = new GitHubDruk();
    expect(alsRepoFout(druk, 'Je inlog ophalen lukte niet. Probeer het opnieuw.')).toBe(druk);
    const netwerk = alsRepoFout(new TypeError('Failed to fetch'), 'Je inlog ophalen lukte niet. Probeer het opnieuw.');
    expect(netwerk).toBeInstanceOf(RepoFout);
    expect(netwerk.message).toBe('Je inlog ophalen lukte niet. Probeer het opnieuw.');
  });
});
