# Ontwerp: speelbord voor level 0 (Werkplek)

Datum: 18 oktober 2026 · Status: schets goedgekeurd door Harmen ("Ja, dit is het").

Klikbare schets: `docs/superpowers/schetsen/2026-10-18/level0-bord.html`. Bij twijfel geldt wat de schets laat zien, tenzij dit document het anders zegt.

Bouwt voort op `2026-10-18-speelbord-per-level-design.md` (level 1 tot en met 6) en `2026-10-17-intro-routekaart-werkplek-design.md` (level 0).

## Waarom

Level 1 tot en met 6 hebben een eigen speelbord. Level 0 had nog de oude stappenkaarten met een venster per stap: veel tekst, weinig spel. Harmen wil voor level 0 een rij ronde stappen met een icoon en een kort label, waarvan de kleur laat zien hoe ver je bent. Klik je op een stap, dan zie je wat je moet doen.

## Doelen

- Je ziet in één oogopslag waar je bent: wat klaar is, welke stap nu aan de beurt is en wat nog komt.
- Het voelt als een spel: een pad, een "Jij"-label dat meebeweegt, een lijn die oplicht tot waar je bent.
- Klik je op een stap, dan opent het werkblad van die stap onder het pad. Er is geen pop-up meer.

## Wat het niet mag worden

- Een legenda of uitleg over kleuren. De kleur spreekt voor zich.
- Iets dat klikbaar lijkt maar niets doet. Elk rondje opent zijn werkblad, ook een rondje dat nog niet aan de beurt is.

## Wat besloten is

- **Introscènes blijven** (Harmen): het beeld, de drie scènes en "Die plek heet een repo" staan boven het bord, zoals nu.
- **Het bord** heeft dezelfde donkere doek en hetzelfde beeld als het speelbord van level 1 tot en met 6, met:
  - het label "Level 0 · Werkplek", de kop "Richt je werkplek in." en één zin: "Acht stappen. Na je eerste push is level 0 af.";
  - rechts een teller: "3 / 8 klaar".
- **Het pad**: acht rondjes aan een lijn, elk met een icoon en een kort label: Account, Repo, Koppelen, Setup, AI-app, Desktop, Clonen, 1e push.
- **Kleur = stand**:
  - klaar: groengeel (het accent) met een vinkje in plaats van het icoon;
  - nu aan de beurt: paars met een pulserende ring en een zwevend "Jij"-label erboven;
  - nog niet aan de beurt: donker en gedempt.
  - De lijn licht groengeel op tot het rondje dat nu aan de beurt is.
- **Het gekozen rondje** is iets groter, met een pijltje naar het werkblad eronder. Bij het openen is dat de stap die nu aan de beurt is. Krijgt die stap een vinkje, dan schuift de keuze vanzelf door naar de volgende stap.
- **Het werkblad** (licht) heeft links de tekst en rechts wat je doet:
  - links: "Stap 3 van 8" met waar je het doet, de titel, de korte zin uit `kort.ts`, en bij een stap die vanzelf een vinkje krijgt één regel met een paars bolletje: "… dan krijgt deze stap vanzelf een vinkje." Een stap die je zelf afvinkt, heeft die regel niet: de knop "Klaar, …" zegt het al (Harmen: "Dit vink je zelf af" voegt niets toe en leidt af);
  - rechts: wat er nu bij de stap hoort, net als in het oude venster (Koppelen nagebootst, het setupformulier, de downloadkaart, of het nagetekende scherm met de knop "Klaar, …");
  - een stap die nog niet aan de beurt is, toont rechts een slotje, de stap die eerst moet ("Eerst stap 2 van dit level: maak je repo.") en de knop "Naar stap 2" (Harmen: "Eerst Repo" is te kaal; zie de slotregel in `docs/schrijfstijl.md`);
  - een stap die klaar is, toont rechts een vinkje en "Klaar".
- **Wie afvinkt** blijft zoals in de code: Account, Repo, AI-app, Desktop en Clonen vink je zelf af (de browser onthoudt het, `handmatig.ts`). Koppelen krijgt een vinkje als het koppelen lukt. Setup en 1e push hebben een check op je repo. Is level 0 af, dan heeft elke stap een vinkje.
- **Slotscherm**: na de laatste stap scrolt de pagina naar het slotscherm (`Afronding`) met de melding, zoals nu. De confetti uit de schets valt weg; het slotscherm is het feest.

- **Dezelfde slotregel voor de rest** (Harmen: "kun je dat nog doen"). Een level op slot zegt "Maak eerst level 1 af: je idee." De gesloten werkbladen van level 1 tot en met 6 zeggen "Eerst stap 3 van dit level: vat je idee samen in één zin." (of "…: nog 2 gesprekken."), met een knop **Naar stap 3** die je naar het werkblad brengt waar je nu bent.

## Keuzes van de bouwer

- De uitgebreide uitleg per stap (`content/levels/level-0/*.md`) staat achter "Zo doe je het", dicht. Zo blijft het werkblad één zin, en wie meer nodig heeft, klapt het open. De opdracht voor je AI (Clonen, 1e push) staat wel altijd open.
- `StapVenster` wordt `StapBlad`: dezelfde inhoud, maar als werkblad op de pagina in plaats van een dialog. De knoppen Vorige, Volgende en Sluiten vallen weg; dat doet het pad.
- Het licht/donker-knopje van de oude stappenlijst valt weg. Het werkblad is licht, zoals bij level 1 tot en met 6.
- Het rondje is een knop met `aria-pressed` en een label als "Repo, nu aan de beurt". Het pad is een lijst.
- Op een telefoon staan de rondjes in twee rijen van vier, zonder lijn, en staat het werkblad onder elkaar.

## Buiten dit ontwerp

- De echte GitHub-koppeling (`lib/repo/`). In de echte versie krijgen Account en Repo een vinkje zodra je gekoppeld bent; in de demo vink je ze zelf af.
