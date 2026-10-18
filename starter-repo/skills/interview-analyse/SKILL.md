---
name: interview-analyse
description: Analyseert alle interviews in level-2-probleemvalidatie/interviews/, vult analyse.md, legt de eerste doelgroep vast in eerste-doelgroep.md en stelt via een pull request voor hoe canvas en aannames veranderen. Gebruik bij "analyseer mijn interviews", "werk mijn canvas bij" of als level 2 bijna af is.
---

# Interview-analyse

Je legt alle interviews naast elkaar en helpt de eigenaar zien wat de markt zegt. Hier ben je sterk: 5 tot 15 gesprekken vergelijken, patronen tellen en per patroon de citaten terugvinden.

Je werkt in twee delen. De analyse en de eerste doelgroep zijn nieuw materiaal: die leg je direct vast. Het canvas en de aannames zijn keuzes van de eigenaar: daar stel je wijzigingen voor in een pull request, en de eigenaar beslist.

## Deel 1: analyse en eerste doelgroep

1. Lees `level-2-probleemvalidatie/doelgroep.md`, `interviewvragen.md` en alle interviews direct in `interviews/`. Submappen als `interviews/ronde-1/` horen bij een eerdere doelgroep; lees ze alleen als de eigenaar daarom vraagt.
2. Tel de interviews. Ondernemen met AI vraagt er 5 bij B2B en 15 bij B2C (`type` in `doelgroep.md`). Zijn het er minder, zeg dat dan, en noem je conclusie voorlopig.
3. Vul de tabel in `analyse.md`: één regel per interview, met doelgroep, geïnterviewde (nummer, rol en initialen), kernactiviteit (5), alternatief (6), overwegingen (7) en meest genoemde klachten (8).
4. Zoek patronen per doelgroep. Welke klachten komen steeds terug, en in hoeveel interviews? Welke alternatieven? Zoek per patroon de citaten. Benoem ook wat je niet verwachtte.
5. Schrijf het inzicht in deze vorm:

   > Onze target customer ervaart problemen met [kernactiviteit, vraag 5]. Als we hun belangrijkste overwegingen bekijken [overwegingen, vraag 7], lossen ze dat op dit moment op met [alternatieven, vraag 6]. De nadelen hiervan zijn [meest genoemde klachten, vraag 8].

6. Beantwoord de vraag van de mijlpaal: is er een eerste doelgroep die allemaal hetzelfde probleem ervaart? Zet het antwoord onder "Eerste doelgroep" in `analyse.md`.
7. Schrijf `eerste-doelgroep.md` (format hieronder). `gevonden: ja` alleen als de interviews het laten zien; de eigenaar beslist.
8. Laat de eigenaar `analyse.md` en `eerste-doelgroep.md` lezen. Haal pas daarna de markering bovenaan weg, leg beide vast met een commit en zeg: "Klik in GitHub Desktop op Push origin, of vraag mij om te pushen. Dan krijgt de stap 'Analyseer je interviews' een vinkje in Ondernemen met AI."

### eerste-doelgroep.md

```markdown
---
gevonden: ja
doelgroep: zelfstandige apotheken met 2 tot 5 medewerkers
probleem: bestellingen bij groothandels kosten elke dag een uur handwerk
---
# Mijn eerste doelgroep

## Bewijs
4 van de 5 interviews (01, 02, 04, 05) noemen dit probleem zelf, zonder dat ik ernaar vroeg.

## Klachten die steeds terugkomen
- ... (4 van 5)
- ... (3 van 5)

## Citaten
- "..." (02-apotheker)
```

### Bij gevonden: nee

Leg de eigenaar drie routes voor en laat ze kiezen:

- **Een andere doelgroep.** Verplaats dan de interviews naar `interviews/ronde-1/`. Ondernemen met AI telt alleen bestanden direct in `interviews/`, dus de teller begint weer bij 0. De nummers lopen door.
- **Meer interviews** bij dezelfde doelgroep, eventueel met scherpere vragen (skill `interviewhulp`).
- **Het idee bijstellen** in level 1.

## Deel 2: canvas en aannames bijwerken, via een pull request

1. Zorg dat deel 1 vastgelegd en gepusht is. Maak dan een branch: `git switch -c canvas-na-interviews`.
2. Zet bij elke regel in `level-1-idee/vpc.md` wat de interviews zeiden, met de nummers erbij:
   - `(bevestigd: 4 van 5)` als het in de interviews terugkomt;
   - `(ontkracht: 0 van 5)` als de interviews het tegenspreken of niemand het noemt;
   - `(open)` als de interviews er niets over zeggen.
   Komt er uit de interviews een job, pain of gain die er nog niet stond, voeg die toe met `(nieuw: 3 van 5)`.
3. Doe hetzelfde in `level-1-idee/aannames.md`. Laat het label ([wens], [haalbaar] of [rendabel]) staan.
4. Leg de wijzigingen vast met een commit op de branch. Leg de eigenaar daarna uit, stap voor stap:
   1. Klik in GitHub Desktop op **Publish branch** en daarna op **Create Pull Request**.
   2. Kijk op GitHub onder **Files changed**: in rood wat sneuvelde, in groen wat erbij kwam.
   3. Klopt het, klik dan **Merge pull request**. Klopt iets niet, zeg het; dan pas je het aan op de branch.
5. Is de pull request gemerged, ga dan terug naar main en haal de nieuwste versie op: `git switch main` en `git pull`.

Leg in één zin uit waarom dit via een pull request gaat: "Ik stel voor, jij keurt goed. Zo zie je precies wat de markt aan je canvas veranderde."

## Regels

- Baseer je alleen op de interviews. Wat je niet kunt onderbouwen, benoem je als vermoeden.
- Tel mee wat mensen deden en nu gebruiken. Wat ze zeggen te willen in de toekomst, weegt licht.
- Stukken tussen `VERTROUWELIJK: BEGIN` en `VERTROUWELIJK: EINDE` gebruik je alleen als context. Je citeert ze niet en ze tellen niet mee in de analyse.
- Gebruik geen volledige namen.
