import { describe, expect, it } from 'vitest';
import { GeenRepo, GitHubDruk, NietIngelogd, RepoFout } from '../lib/repo/fouten';
import { alsRepoFout, meldingVoor, toonMelding } from './meldingen';

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

describe('toonMelding', () => {
  const geen = { echt: true, fout: null, error: null, errorBijWissel: null, warning: null, sessieFout: null, zoek: '' };
  const opslaanMislukt = 'Opslaan van level-0-werkplek/setup.md is mislukt. Je invoer staat er nog; probeer het opnieuw.';

  it('in de demo: de schrijffout of de opslagmelding, zonder knop, zoals altijd', () => {
    expect(toonMelding({ ...geen, echt: false, error: 'mislukt', warning: 'vol' })).toEqual({ tekst: 'mislukt', actie: null, bron: 'repo' });
    expect(toonMelding({ ...geen, echt: false, fout: new GitHubDruk(), warning: 'vol' })).toEqual({ tekst: 'vol', actie: null, bron: 'repo' });
    expect(toonMelding({ ...geen, echt: false })).toBeNull();
  });

  it('een schrijffout van vóór het opnieuw koppelen blijft niet staan', () => {
    const oud = new GeenRepo().message;
    expect(toonMelding({ ...geen, error: oud, errorBijWissel: oud })).toBeNull();
  });

  it('een mislukte schrijfactie: de zin van de fout, zonder Opnieuw', () => {
    const druk = new GitHubDruk();
    expect(toonMelding({ ...geen, fout: druk, error: druk.message })).toEqual({ tekst: druk.message, actie: null, bron: 'repo' });
    const fout = new RepoFout(opslaanMislukt);
    expect(toonMelding({ ...geen, fout, error: opslaanMislukt })?.actie).toBeNull();
  });

  it('een eerdere mislukte schrijfactie haalt Opnieuw niet weg bij een mislukte ophaalronde', () => {
    const ophalen = new RepoFout('Je repo ophalen lukte niet. Probeer het opnieuw.');
    expect(toonMelding({ ...geen, fout: ophalen, error: opslaanMislukt })).toEqual({ tekst: ophalen.message, actie: 'opnieuw', bron: 'repo' });
  });

  it('uitgelogd bij het opslaan: Log in met GitHub blijft staan', () => {
    const uit = new NietIngelogd();
    expect(toonMelding({ ...geen, fout: uit, error: uit.message })?.actie).toBe('inloggen');
  });

  it('een fout van de sessie: Opnieuw haalt de sessie op', () => {
    const sessie = new RepoFout('Je inlog ophalen lukte niet. Probeer het opnieuw.');
    expect(toonMelding({ ...geen, sessieFout: sessie })).toEqual({ tekst: sessie.message, actie: 'opnieuw', bron: 'sessie' });
  });

  it('een fout van de repo gaat voor een fout van de sessie', () => {
    expect(toonMelding({ ...geen, fout: new GitHubDruk(), sessieFout: new GeenRepo() })?.tekst).toBe(new GitHubDruk().message);
  });

  it('een gewone Error krijgt de zin van ophalen, met Opnieuw', () => {
    expect(toonMelding({ ...geen, fout: new TypeError('x is undefined') })).toEqual({ tekst: 'Je repo ophalen lukte niet. Probeer het opnieuw.', actie: 'opnieuw', bron: 'repo' });
  });

  it('zonder fout: een verse schrijffout blijft staan, anders de mislukte inlog uit het adres', () => {
    expect(toonMelding({ ...geen, error: opslaanMislukt })).toEqual({ tekst: opslaanMislukt, actie: null, bron: 'repo' });
    expect(toonMelding({ ...geen, zoek: '?fout=inloggen' })?.actie).toBe('inloggen');
    expect(toonMelding(geen)).toBeNull();
  });
});
