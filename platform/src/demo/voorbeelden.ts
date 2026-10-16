// Voorbeeldbestanden voor de demo: wat de AI van een deelnemer zou schrijven (case: Trapzorg, bakfietskoerier voor apotheken).

export const VOORBEELD_WERKPLEK = `# Mijn werkplek

- Mijn AI-tool: Claude Code
- Mijn computer: Mac
- Wat ik geleerd heb over commit en push: een commit is een opgeslagen versie van mijn werk, en met push zet ik die online in mijn repo.
`;

export const VOORBEELD_VRAGEN = `# Interviewvragen

## Over de geïnterviewde (vul je zelf in)

1. **Segment:** tot welke van onze doelgroepen behoort de geïnterviewde?
2. **Locatie:** waar (land, plaats) werkt de geïnterviewde?
3. **Rol:** wat is de rol van de geïnterviewde?
4. **DMU:** spreek je de beslisser? Ja of nee.

## In het gesprek

5. **Kernactiviteit:** hoe ziet een gewone dag eruit als het gaat om medicijnen bij patiënten krijgen?
6. **Alternatief:** hoe regelen jullie bezorging nu? Eigen bezorger, een koeriersdienst, of halen patiënten zelf?
7. **Overwegingen:** waarom is het zo geregeld?
8. **Meest genoemde klacht:** wat gaat er het vaakst mis bij de huidige manier?

## Regels

- Praat niet over je idee of oplossing.
- Vraag niet naar de toekomst, alleen naar wat iemand nu doet.
`;

export const VOORBEELD_FEEDBACK_PROPOSITIE = `# Feedback op je propositie

## Je propositie in één zin

Mijn bedrijf, Trapzorg, biedt bezorging per bakfiets binnen twee uur voor zelfstandige apotheken in Breda die medicijnen niet op tijd bij patiënten krijgen, met vaste koeriers die de patiënten kennen.

## Actiepunten

- Maak je doelgroep kleiner: alleen apotheken in de binnenstad, waar parkeren het lastigst is.
- Zoek uit hoe apotheken spoedbezorging nu regelen, voordat je over je bakfiets begint.
- "Binnen twee uur" is een belofte: weet je of apotheken die snelheid nodig hebben?
`;

export const VOORBEELD_VPC = `# Value Proposition Canvas

## Klantkant

### Jobs

- Medicijnen op tijd bij patiënten krijgen die niet zelf kunnen komen (aanname)
- Spoedrecepten dezelfde dag leveren (aanname)

### Pains

- De bezorger staat lang stil door parkeren in de binnenstad (aanname)
- Een koeriersdienst is te duur voor korte ritten (aanname)

### Gains

- Een assistent die in de apotheek blijft (aanname)
- Patiënten die hun medicijnen van een bekend gezicht krijgen (aanname)

## Aanbodkant

### Producten en diensten

- Bezorging per bakfiets binnen twee uur (aanname)

### Pain relievers

- Geen parkeertijd: een bakfiets stopt voor de deur (aanname)
- Een vaste prijs per rit, ook voor korte afstanden (aanname)

### Gain creators

- Vaste koeriers die de patiënten kennen (aanname)
`;

export const VOORBEELD_VPC_NA_INTERVIEWS = `# Value Proposition Canvas

## Klantkant

### Jobs

- Medicijnen op tijd bij patiënten krijgen die niet zelf kunnen komen (bevestigd: 5 van de 5)
- Spoedrecepten dezelfde dag leveren (bevestigd: 4 van de 5)

### Pains

- De bezorger staat lang stil door parkeren in de binnenstad (bevestigd: 5 van de 5)
- Een koeriersdienst is te duur voor korte ritten (bevestigd: 3 van de 5)
- De assistent mist in de apotheek tijdens de bezorgronde (nieuw uit de interviews)

### Gains

- Een assistent die in de apotheek blijft (bevestigd)
- Patiënten die hun medicijnen van een bekend gezicht krijgen (open: niemand noemde het)

## Aanbodkant

### Producten en diensten

- Bezorging per bakfiets binnen twee uur (open: toetsen in level 3 en 4)

### Pain relievers

- Geen parkeertijd: een bakfiets stopt voor de deur (open)
- Een vaste prijs per rit, ook voor korte afstanden (open)

### Gain creators

- Vaste koeriers die de patiënten kennen (open)
`;

export const VOORBEELD_AANNAMES_NA_INTERVIEWS = `# Aannames

- [wens] Apotheken willen bezorging uitbesteden (bevestigd: 4 van de 5 zoeken een oplossing)
- [haalbaar] Een bakfiets haalt 20 adressen per dag (open)
- [rendabel] Apotheken betalen 6 euro per bezorging (ontkracht: ze vinden 4 euro het maximum)
`;

export function voorbeeldInterview(path: string): string {
  const nummer = path.split('/').pop()?.slice(0, 2) ?? '01';
  return `---
rol: apotheker
segment: zelfstandige apotheken
locatie: Breda
dmu: ja
terugbellen: ja
---
# Interview ${nummer}: apotheker

## 5. Kernactiviteit

Ochtenden gaan op aan recepten klaarzetten. Rond twaalf uur moeten de spoedbezorgingen weg.

## 6. Alternatief

Een assistent rijdt in de middag zelf rond met de auto.

## 7. Overwegingen

Een koeriersdienst was te duur voor korte ritten en niet flexibel genoeg.

## 8. Meest genoemde klacht

Parkeren in de binnenstad kost veel tijd, en de assistent is dan niet in de apotheek.

## Terugbellen

Mag ik je bellen als ik iets heb wat hierbij helpt? Ja.
`;
}

export const VOORBEELD_ANALYSE = `# Analyse van de interviews

| Doelgroep | Geïnterviewde | Kernactiviteit (5) | Alternatief (6) | Overwegingen (7) | Meest genoemde klachten (8) |
|---|---|---|---|---|---|
| Zelfstandige apotheken | apotheker (5×) | spoedbezorging rond het middaguur | assistent bezorgt met de auto | koerier te duur en te star | parkeren kost tijd, assistent mist in de apotheek |

## Inzicht

Onze target customer ervaart problemen met spoedbezorging rond het middaguur. Als we hun belangrijkste overwegingen bekijken (kosten en flexibiliteit), lossen ze dat op dit moment op met een eigen assistent in de auto. De nadelen hiervan zijn de tijd die parkeren kost en een assistent die dan niet in de apotheek is.

## Eerste doelgroep

Zelfstandige apotheken in de binnenstad van Breda ervaren allemaal hetzelfde probleem.
`;

export const VOORBEELD_EERSTE_DOELGROEP = `---
gevonden: ja
doelgroep: zelfstandige apotheken in de binnenstad van Breda
probleem: spoedbezorging rond het middaguur kost een assistent een halve dag
---
# Eerste doelgroep

## Hoeveel van de interviews

5 van de 5 apothekers regelen spoedbezorging rond het middaguur met een eigen assistent in de auto.

## Welke klachten steeds terugkomen

- Parkeren in de binnenstad kost veel tijd (5 van de 5).
- De assistent is dan niet in de apotheek (4 van de 5).
- Een koeriersdienst is te duur voor korte ritten (3 van de 5).

## Citaten

- "Parkeren in de binnenstad kost veel tijd, en de assistent is dan niet in de apotheek." (01-apotheker)
- "Een koeriersdienst was te duur voor korte ritten en niet flexibel genoeg." (02-apotheker)
`;
