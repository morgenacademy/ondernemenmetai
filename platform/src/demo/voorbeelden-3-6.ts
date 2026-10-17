// Voorbeeldbestanden voor level 3 tot en met 6: wat de AI van een deelnemer zou schrijven (case: Trapzorg).
import { toMarkdown } from '../lib/markdown';

export const VOORBEELD_OPLOSSING = `# Gekozen oplossing

## Mijn oplossing

Spoedbezorging per bakfiets rond het middaguur, als abonnement per apotheek. Een vaste koerier haalt om 11 uur de spoedrecepten op en bezorgt ze binnen twee uur in de binnenstad.

## Waarom deze

- Wenselijk: lost de klacht op die 5 van de 5 apothekers noemden (parkeren kost tijd, de assistent mist in de apotheek).
- Haalbaar: ik kan morgen beginnen met één bakfiets en mezelf als koerier.
- Levensvatbaar: een vast bedrag per maand past bij hoe apotheken nu betalen voor hun eigen auto.

## Wat afviel, en waarom

- Kluisjes bij de apotheek: patiënten die niet zelf kunnen komen, hebben er niets aan.
- Een drone: niet toegestaan in de binnenstad, en te duur voor een eerste versie.
- Een app voor de patiënt: niemand noemde het bezorgmoment als probleem.
`;

export const VOORBEELD_WAARDEPROPOSITIE = `# Waardepropositie

Zelfstandige apotheken in de binnenstad van Breda verliezen elke dag een assistent aan de spoedbezorging: rondrijden, parkeren, wachten. Trapzorg haalt om 11 uur de spoedrecepten op en bezorgt ze per bakfiets binnen twee uur, met een vaste koerier die de patiënten kent. De assistent blijft in de apotheek, de patiënt krijgt zijn medicijnen op tijd.

Voor €40 per maand, opzegbaar per maand. Geen parkeerkosten, geen eigen auto meer nodig voor korte ritten.
`;

export const VOORBEELD_MADLIB_OPLOSSING = `# Waardepropositie (madlib)

Mijn bedrijf, Trapzorg, biedt spoedbezorging per bakfiets rond het middaguur voor zelfstandige apotheken in de binnenstad van Breda die hun assistent kwijt zijn aan rondrijden en parkeren, met een vaste koerier die de patiënten kent.
`;

export const VOORBEELD_VPC_OPLOSSING = `# Value Proposition Canvas

## Klantkant

### Jobs

- Medicijnen op tijd bij patiënten krijgen die niet zelf kunnen komen (bevestigd: 5 van de 5)
- Spoedrecepten dezelfde dag leveren (bevestigd: 4 van de 5)

### Pains

- De bezorger staat lang stil door parkeren in de binnenstad (bevestigd: 5 van de 5)
- De assistent mist in de apotheek tijdens de bezorgronde (bevestigd: 4 van de 5)

### Gains

- Een assistent die in de apotheek blijft (bevestigd)

## Aanbodkant (voor de gekozen oplossing)

### Producten en diensten

- Spoedbezorging per bakfiets rond het middaguur, als abonnement (aanname)

### Pain relievers

- De koerier haalt op om 11 uur, de assistent rijdt niet meer (aanname)
- Geen parkeertijd: een bakfiets stopt voor de deur (aanname)

### Gain creators

- Vaste koerier die de patiënten kent (aanname)
`;

export const VOORBEELD_MVP = `# Mijn MVP

## Mijn drie grootste bezwaren

1. Ik weet niet of apotheken €40 per maand willen betalen.
2. Ik weet niet of één koerier alle spoedrecepten op tijd haalt.
3. Ik weet niet of apothekers een vreemde met hun medicijnen laten fietsen.

## De riskantste aanname

Apotheken willen €40 per maand betalen voor spoedbezorging per bakfiets. Klopt die niet, dan valt alles om.

## Het MVP-type, en waarom

Een concierge-MVP: twee weken bezorg ik zelf, met een gehuurde bakfiets, voor vijf apotheken uit mijn interviews. Een landingspagina met een aanmeldformulier legt het aanbod uit. Zo toets ik de prijs zonder iets te bouwen wat ik nog niet nodig heb.
`;

export const VOORBEELD_LANDINGSPAGINA = `<!doctype html>
<html lang="nl">
<head><meta charset="utf-8"><title>Trapzorg</title></head>
<body>
  <h1>Trapzorg: spoedbezorging per bakfiets</h1>
  <p>Om 11 uur opgehaald, binnen twee uur bij de patiënt. Uw assistent blijft in de apotheek.</p>
  <p>€40 per maand, opzegbaar per maand.</p>
  <form><label>Apotheek <input name="apotheek"></label> <button>Ik doe mee met de proef</button></form>
</body>
</html>
`;

export const VOORBEELD_LANDINGSPAGINA_V2 = VOORBEELD_LANDINGSPAGINA.replace('€40 per maand, opzegbaar per maand.', 'De eerste maand gratis, daarna €40 per maand. Nu ook met koelbox voor insuline en vaccins.');

export function voorbeeldTestkaart(ronde: number): string {
  return toMarkdown(
    {
      ronde,
      hypothese:
        ronde === 1
          ? 'Zelfstandige apothekers die de bezorging twee weken gebruikten, willen doorgaan voor €40 per maand.'
          : 'Met een gratis eerste maand en een koelbox willen apothekers doorgaan voor €40 per maand.',
      test_opzet: ronde === 1 ? 'Twee weken spoedbezorging voor de apothekers uit mijn interviews, daarna mijn voorstel doen.' : 'Een maand de nieuwe versie, daarna hetzelfde voorstel.',
      metriek: 'Aantal dat ja zegt tegen €40 per maand of vooruitbetaalt.',
      succesdrempel: '2 van de 3',
      tijd_en_sample: ronde === 1 ? '3 apothekers uit mijn interviews, van 2 tot en met 13 november' : 'dezelfde 3 apothekers, van 1 tot en met 31 december',
    },
    `# Testkaart ronde ${ronde}\n\nWe geloven dat ${ronde === 1 ? 'apothekers na twee weken' : 'apothekers met een gratis eerste maand'} willen doorgaan voor €40 per maand. We weten het als 2 van de 3 ja zeggen of vooruitbetalen.`,
  );
}

export function voorbeeldSpiekbriefje(persoon: string): string {
  return toMarkdown(
    { persoon, ronde: 1, antwoord: null },
    `# ${persoon}

## Spiekbriefje ronde 1

- Wanneer gesproken: oktober 2026, in level 2
- Hun alternatief: een assistent rijdt in de middag zelf rond met de auto.
- Hun klachten: "Parkeren in de binnenstad kost veel tijd, en de assistent is dan niet in de apotheek."
- Wat mijn MVP oplost: de koerier haalt om 11 uur op; de assistent blijft binnen. Nog niet: koelproducten.
- Opening: "Weet je nog, je zei dat parkeren je assistent een halve dag kost? Ik heb misschien iets voor je."
- Voorstel: twee weken proberen, daarna €40 per maand. "Wil je dit hebben, voor deze prijs?"
- Bij nee: vraag waarom niet.`,
  );
}

export function voorbeeldResultaat(ronde: number, ja: number, totaal: number): string {
  const boven = ja >= 2;
  return toMarkdown(
    { ronde, besluit: boven ? 'doorgaan' : 'doorontwikkelen', vertrouwen: boven ? 75 : 40 },
    `# Resultaatkaart ronde ${ronde}

Succesdrempel: 2 van de 3

## 1. Gemeten waarde

${ja} van de ${totaal} zeiden ja tegen €40 per maand.

## 2. Vergelijking met de drempel

${boven ? 'Boven de drempel.' : `Onder de drempel: ${ja} van de ${totaal}, gehoopt was 2.`}

## 3. Observaties

${ronde === 1 ? 'De reden van nee: te duur voor een proef. De reden van twijfel: geen koelproducten.' : 'De gratis eerste maand en de koelbox namen de twijfel weg.'}

## 4. Verrassingen en open vragen

${ronde === 1 ? 'Koelproducten (insuline, vaccins) bleken belangrijker dan snelheid.' : 'Twee apothekers vroegen of de koerier ook retouren kan meenemen.'}

## 5. Conclusie

${boven ? 'Succes: we gaan door met €40 per maand en een gratis eerste maand.' : 'Onbeslist: de prijs is niet het probleem, de proef wel. Doorontwikkelen met een gratis eerste maand en een koelbox.'}`,
  );
}

export const VOORBEELD_PRODUCT = toMarkdown(
  { besluit: null, volgende_stap: null },
  `# Mijn product

## Wat erin zit

- Spoedbezorging per bakfiets, opgehaald om 11 uur. Bewijs: interviews, 4 van de 5 willen spoedrecepten voor de middag weg.
- Een koelbox voor insuline en vaccins. Bewijs: ronde 1, 04-apotheker twijfelde om die reden.
- De eerste maand gratis, daarna €40 per maand. Bewijs: ronde 1, 02-apotheker vond €40 "te duur voor een proef".

## Wat er bewust niet in zit

- Een app voor de patiënt. Waarom: niemand noemde het bezorgmoment als probleem.

## Wat veranderde per ronde

### Na ronde 1

- Reden van nee: "te duur voor een proef" → eerste maand gratis, daarna €40.
- Reden van twijfel: geen koelproducten → koelbox.

## Onderbouwing`,
);

export const VOORBEELD_BMC = `# Business Model Canvas

| Partners | Kernactiviteiten | Waardepropositie | Klantrelaties | Klantsegmenten |
|---|---|---|---|---|
| Fietsenmaker voor onderhoud, verhuur van een tweede bakfiets | Spoedrecepten ophalen en bezorgen, planning per dag | De assistent blijft in de apotheek; medicijnen binnen twee uur bij de patiënt (\`waardepropositie.md\`) | Vaste koerier per apotheek, persoonlijk contact | Zelfstandige apotheken in de binnenstad van Breda (\`eerste-doelgroep.md\`) |

| Kernmiddelen | Kanalen |
|---|---|
| Twee bakfietsen met koelbox, koeriers die de binnenstad kennen | Persoonlijk langsgaan bij apotheken, aanbeveling door apothekers onderling |

| Kostenstructuur | Inkomstenstromen |
|---|---|
| Koerier (variabel per rit), bakfiets en onderhoud (vast), verzekering (vast) | Abonnement van €40 per maand per apotheek (\`prijs.md\`), eerste maand gratis |

## Samenhang

De rechterkant levert bij 10 apotheken €400 per maand op. De kosten per apotheek liggen rond €22. Bij 10 apotheken is de onderneming winstgevend; met één bakfiets kan ik er 15 aan.
`;

export const VOORBEELD_OVER_MIJN_ONDERNEMING = `Trapzorg bezorgt spoedrecepten per bakfiets voor zelfstandige apotheken in de binnenstad van Breda. De koerier haalt om 11 uur op en bezorgt binnen twee uur, ook met koelbox.

- Klanten: zelfstandige apotheken, de apotheker-eigenaar beslist.
- Prijs: €40 per maand, de eerste maand gratis.
- Toon: kort en concreet, zoals een apotheker praat. Geen marketingtaal.`;

export const VOORBEELD_VERKOOPAANPAK = toMarkdown(
  { name: 'verkoopaanpak', description: 'Bereidt een verkoopgesprek met een zelfstandige apotheker voor, op de manier waarop Trapzorg de eerste klanten won. Gebruik bij "bereid mijn gesprek voor" of voor elk nieuw gesprek met een apotheek.' },
  `# Verkoopaanpak Trapzorg

## Verkenning

- Ga langs rond 10 uur, voor de drukte. Vraag naar de spoedrecepten van gisteren.
- SPIN: hoe regelen jullie spoedbezorging nu (situatie)? Wat gaat er mis (probleem)? Wat kost dat de assistent per week (implicatie)? Wat zou het opleveren als de assistent binnen blijft (nuttig effect)?

## Voorstel

- Eerste maand gratis, daarna €40 per maand. Opzegbaar per maand.
- Laat de koelbox zien als ze insuline of vaccins bezorgen.

## Tegenwerpingen

- "Te duur": reken samen uit wat een halve dag assistent per week kost.
- "Ik ken je niet": noem de apotheken die al klant zijn.

## Afsluiten

- Vraag: "Zullen we maandag beginnen?"

## Na het gesprek

- Zet de klant een fase verder in level-6-lancering/pijplijn.md.`,
);

export const VOORBEELD_IMPACT = `# Impact

## De matrix

D = doel, A = activiteit, R = resultaat

| Kapitaal | Inactief | Reactief | Actief | Proactief |
|---|---|---|---|---|
| Financieel | | R | D, A | |
| Geproduceerd | | D, A | | |
| Intellectueel | | | D, A | |
| Menselijk | | A | D | |
| Sociaal | | | A, R | D |
| Natuurlijk | | | A | D |

## Per kapitaal

### Financieel

- Doel: 10 betalende apotheken binnen 12 maanden.
- Activiteit: elke week twee apotheken bezoeken.
- Resultaat: 1 betalende klant, 3 in de pijplijn.

### Natuurlijk

- Doel: elke bezorgrit in de binnenstad zonder auto.
- Activiteit: alle ritten per bakfiets.
- Resultaat: later.

## Wat valt op

Het natuurlijk kapitaal krijgt veel aandacht in mijn verhaal, maar ik meet het nog niet. Volgende stap: kilometers per bakfiets bijhouden.
`;
