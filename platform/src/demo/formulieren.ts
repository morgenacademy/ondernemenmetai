// Demo-waarden voor de formulieren op het platform (case: Trapzorg, bakfietskoerier voor apotheken).
import { mdFilesIn } from '../lib/levels/checks';
import { FEEDBACK_DIR, huidigeRonde } from '../lib/levels/level4';
import { PIJPLIJN_PATH } from '../lib/levels/level6';
import type { FormValues } from '../lib/levels/types';
import type { RepoSnapshot } from '../lib/repo/types';

/** Per persoon het verloop van de rondes: in ronde 1 twijfelen ze, na het doorontwikkelen zeggen ze ja. */
const ANTWOORDEN_PER_RONDE: Record<number, { antwoord: string; waarom: string }[]> = {
  1: [
    { antwoord: 'ja', waarom: 'Scheelt de assistent een halve dag per week. Betaalde de eerste maand vooruit.' },
    { antwoord: 'nee', waarom: '€40 is te veel voor een proef: "Laat me eerst zien dat het werkt."' },
    { antwoord: 'twijfel', waarom: 'Wil weten of de koerier ook koelproducten meeneemt.' },
    { antwoord: 'nee', waarom: 'Te duur voor een proef, en de bezorging om 12 uur is te laat.' },
    { antwoord: 'twijfel', waarom: '"Ik zou het wel kopen", maar betaalde niets vooruit.' },
  ],
  2: [
    { antwoord: 'ja', waarom: 'Blijft door, nu ook met koelbox.' },
    { antwoord: 'ja', waarom: 'De gratis eerste maand overtuigde: "Nu zie ik dat het werkt."' },
    { antwoord: 'ja', waarom: 'Koelproducten gaan nu mee. Tekende voor een jaar.' },
    { antwoord: 'nee', waarom: 'Ook om 11 uur te laat; regelt het liever zelf.' },
    { antwoord: 'ja', waarom: 'Betaalde de tweede maand vooruit.' },
  ],
};

function heeftRonde(s: RepoSnapshot, path: string, ronde: number): boolean {
  return new RegExp(`^## Ronde ${ronde}\\s*$`, 'm').test(s.files[path] ?? '');
}

/** De volgende persoon zonder antwoord in deze ronde. Heeft iedereen al geantwoord, dan de eerste. */
function voorstelWaarden(s: RepoSnapshot): FormValues {
  const ronde = huidigeRonde(s);
  const paden = mdFilesIn(s, FEEDBACK_DIR);
  const index = Math.max(0, paden.findIndex((p) => !heeftRonde(s, p, ronde)));
  const persoon = paden[index]?.slice(FEEDBACK_DIR.length + 1, -3) ?? '';
  const verloop = ANTWOORDEN_PER_RONDE[ronde] ?? ANTWOORDEN_PER_RONDE[2];
  const { antwoord, waarom } = verloop[index % verloop.length];
  return {
    persoon,
    geprobeerd: ronde === 1 ? 'Twee weken de spoedbezorging per bakfiets, elke werkdag.' : 'Een maand de nieuwe versie: bezorging om 11 uur, met koelbox.',
    voorstel: ronde === 1 ? '€40 per maand, opzegbaar per maand.' : 'Eerste maand gratis, daarna €40 per maand.',
    antwoord,
    waarom,
  };
}

const LEADS: FormValues[] = [
  { klant: 'apotheker Tilburg (R.)', fase: 'voorstel', waarde: '480' },
  { klant: 'apotheker Breda-Noord (S.)', fase: 'gesprek', waarde: '480' },
  { klant: 'huisartsenpost Breda (M.)', fase: 'contact', waarde: '1200' },
];

function pijplijnWaarden(s: RepoSnapshot): FormValues {
  const tekst = s.files[PIJPLIJN_PATH] ?? '';
  return LEADS.find((lead) => !tekst.includes(`| ${lead.klant} |`)) ?? { ...LEADS[0], fase: 'akkoord' };
}

export const DEMO_FORMS: Record<string, (s: RepoSnapshot) => FormValues> = {
  'l0-setup': () => ({ os: 'mac', ai: 'claude-code' }),
  'l1-idee': () => ({ wat: 'Medicijnen bezorgen per bakfiets', voorWie: 'Zelfstandige apotheken in Breda', waaromJij: 'Ik was vijf jaar fietskoerier en ken de binnenstad.' }),
  'l1-visie': () => ({ wereld: 'Een binnenstad zonder bestelbusjes, waar patiënten hun medicijnen op tijd krijgen.', bijdrage: 'Snelle, schone bezorging voor de zorg.' }),
  'l1-madlib': () => ({
    naam: 'Trapzorg',
    aanbod: 'bezorging per bakfiets binnen twee uur',
    doelgroep: 'zelfstandige apotheken in Breda',
    probleem: 'medicijnen niet op tijd bij patiënten krijgen',
    usp: 'vaste koeriers die de patiënten kennen',
  }),
  'l1-aannames': () => ({
    aannames: '[wens] Apotheken willen bezorging uitbesteden\n[haalbaar] Een bakfiets haalt 20 adressen per dag\n[rendabel] Apotheken betalen 6 euro per bezorging',
  }),
  'l2-doelgroep': () => ({ waarde: 'Patiënten die niet zelf naar de apotheek kunnen', gebruiker: 'Apothekersassistenten', betaler: 'De apotheek', beslisser: 'De apotheker-eigenaar', type: 'B2B', aantal: '' }),
  'l3-oplossingen': () => ({
    ideeen: [
      'Spoedbezorging per bakfiets rond het middaguur',
      'Kluisjes bij de apotheek waar patiënten 24 uur per dag ophalen',
      'Een vaste ronde per wijk, twee keer per dag',
      'Samenwerken met de thuiszorg die toch al langsgaat',
      'Een gedeelde koerier voor vier apotheken in de binnenstad',
      'Bezorging door studenten op e-bikes',
      'Een app waarin de patiënt het bezorgmoment kiest',
      'Medicijnen meegeven aan de huisartsenpost',
      'Een abonnement per apotheek met een vast aantal ritten',
      'Bezorging met een koelbox voor insuline en vaccins',
      'Een ophaalpunt bij de supermarkt',
      'Een drone voor spoedmedicatie',
    ].join('\n'),
  }),
  'l4-prijs': () => ({ prijs: '40', per: 'per maand', kostprijs: '22' }),
  'l4-voorstel': voorstelWaarden,
  'l5-besluit': () => ({
    besluit: 'ik ga ervoor',
    volgende_stap: 'echt verkopen',
    onderbouwing: 'In ronde 2 zeiden 3 van de 3 apothekers ja tegen €40 per maand, na een gratis eerste maand. Twee betaalden vooruit. De koelbox en de gratis eerste maand losten de reden van nee en de twijfel uit ronde 1 op.',
  }),
  'l6-klant': () => ({ rol: 'apotheker', initialen: 'K.', wat: 'abonnement spoedbezorging', bedrag: '40', datum: '2026-11-24' }),
  'l6-pijplijn': pijplijnWaarden,
};
