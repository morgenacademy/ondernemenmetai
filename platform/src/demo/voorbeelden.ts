// Voorbeeldbestanden voor de demo: wat de AI van een deelnemer zou schrijven (case: Trapzorg, bakfietskoerier voor apotheken).

export const VOORBEELD_WERKPLEK = `# Mijn werkplek

- Mijn AI-tool: Claude Code
- Mijn computer: Mac
- Wat ik geleerd heb over branches en pull requests: ik werk op een zijspoor en zet het pas in main als ik het heb nagekeken.
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

export function voorbeeldTranscript(path: string): string {
  const nummer = path.split('/').pop()?.slice(0, 2) ?? '01';
  return `---
rol: apotheker
segment: zelfstandige apotheken
locatie: Breda
dmu: ja
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
