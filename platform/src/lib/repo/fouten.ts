/** Fouten met een zin die de deelnemer mag zien. */
export class RepoFout extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RepoFout';
  }
}

export class NietIngelogd extends RepoFout {
  constructor() {
    super('Je bent uitgelogd. Log in met GitHub om verder te gaan.');
    this.name = 'NietIngelogd';
  }
}

export class GeenRepo extends RepoFout {
  constructor() {
    super('Koppel je repo opnieuw in stap 3 van level 0.');
    this.name = 'GeenRepo';
  }
}

export class GitHubDruk extends RepoFout {
  constructor() {
    super('GitHub is even druk. Probeer het over een minuut opnieuw.');
    this.name = 'GitHubDruk';
  }
}
