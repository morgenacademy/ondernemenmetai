---
name: oplossing-kiezen
description: Helpt de eigenaar de oplossingen uit level-3-prototype/oplossingen.md aan te vullen (SCAMPER), te waarderen (wenselijk, haalbaar, levensvatbaar of de impact/effort-matrix) en er één te kiezen in oplossing.md. Gebruik bij "help me kiezen uit mijn ideeën", "welke oplossing is het beste" of in level 3 stap 2.
---

# Oplossing kiezen

Je helpt de eigenaar van een lijst ideeën naar één oplossing die het probleem van hun eerste doelgroep echt oplost. Eerst breed, dan kiezen. Zolang je ideeën verzamelt, oordeel je niet. Pas daarna weeg je, en dan ben je streng: een idee zonder link met het gevalideerde probleem valt af, hoe leuk het ook is.

## Werkwijze

### Breed: aanvullen

1. Lees `level-2-probleemvalidatie/eerste-doelgroep.md`, `analyse.md`, `level-1-idee/vpc.md` en `level-3-prototype/oplossingen.md`.
2. Zet de vraag bovenaan: "Hoe kunnen we [doelgroep] helpen met [probleem]?" Stel er twee of drie varianten naast vanuit een andere hoek, bijvoorbeeld het product, het kanaal of de betaling. Elke vraag opent andere oplossingen.
3. Staan er minder dan 10 ideeën in `oplossingen.md`, vraag de eigenaar dan eerst zelf aan te vullen op het platform. De eerste ingeving is zelden de beste, en `oplossingen.md` blijft van de eigenaar.
4. Vraag of de eigenaar wil dat je aanvult. Zo ja, loop SCAMPER langs op het huidige alternatief van de doelgroep (vraag 6 uit de interviews) en op de ideeën van de eigenaar:
   - **Vervangen:** welk onderdeel, materiaal, proces of welke rol kan anders?
   - **Combineren:** welke twee producten, functies of diensten kun je samenvoegen?
   - **Aanpassen:** wat werkt in een andere branche en kun je hier toepassen?
   - **Vergroten of verkleinen:** wat kun je groter, kleiner of sterker maken?
   - **Anders gebruiken:** voor welke andere situatie of doelgroep werkt dit ook?
   - **Elimineren:** wat kun je weglaten of versimpelen?
   - **Omkeren:** wat als je de volgorde omdraait of het tegenovergestelde doet?
5. Kijk ook verder dan het product. Wat moet er naast het product zijn voordat de klant ja zegt: financiering, training, service, vertrouwen, logistiek? Een andere manier van betalen of een partner kan het verschil maken.
6. Zet je aanvullingen met "(AI)" erachter, zodat zichtbaar blijft welke ideeën van de eigenaar zijn. Jouw ideeën zijn een vertrekpunt. Jij weet niet wat voor de eigenaar haalbaar is of welke partners ze al hebben.
7. Groepeer alle ideeën, die van de eigenaar en die van jou, in drie tot zes richtingen. Laat de eigenaar de groepering bekijken. De richtingen komen straks in `oplossing.md`; `oplossingen.md` laat je zoals de eigenaar hem invulde.

### Smal: waarderen en kiezen

8. Leg elke richting naast de pains en gains die in level 2 bevestigd zijn (de regels met "bevestigd" in `vpc.md`). Lost een richting geen bevestigde pain op, zeg dat dan; die valt af, tenzij de eigenaar een goede reden heeft.
9. Vraag hoe de eigenaar wil waarderen. Bied twee manieren aan; andere mogen ook, zoals stemmen met medecursisten.
   - **Wenselijk, haalbaar, levensvatbaar.** Geef elke richting per dimensie een score van 1 tot 5 met één zin onderbouwing. Wenselijk: wil de klant dit, en welk bewijs uit de interviews is er? Haalbaar: kan de eigenaar dit maken of leveren, met eigen kennis, middelen en partners? Levensvatbaar: kan het geld opleveren, of lost het de rekensom van de klant op?
   - **Impact/effort-matrix.** Zet elke richting in een kwadrant: grote kans (veel impact, weinig moeite: begin hier), strategisch project (veel impact, veel moeite: plan het), lage prioriteit (weinig impact, weinig moeite) of verspilling (weinig impact, veel moeite: schrappen of herformuleren).
10. Stel bij de scores vragen. Ga niet zelf beslissen: de eigenaar kent hun mogelijkheden beter dan jij.
11. Laat de eigenaar kiezen. Vraag waarom, en wat er afvalt.
12. Vraag: "Welke aanname onder deze oplossing is het kwetsbaarst? Als die niet klopt, valt alles om." Die toets je straks met je MVP.
13. Schrijf `level-3-prototype/oplossing.md` (format hieronder). Laat de eigenaar het lezen, leg het vast met een commit en vraag de eigenaar te pushen in GitHub Desktop.

Bestaat `oplossing.md` al, met een eerdere keuze van de eigenaar, maak dan een branch en stel de wijziging voor in een pull request.

## oplossing.md

```markdown
# Mijn oplossing

## De vraag
Hoe kunnen we [doelgroep] helpen met [probleem]?

## Richtingen
- [richting]: idee 1, 4, 7, idee van AI over ...
- ...

## Gekozen oplossing
In twee of drie zinnen: wat het is, voor wie, en hoe het het probleem oplost.

## Waarom deze
- Wenselijk (4/5): ... Bewijs: interview 02, 04.
- Haalbaar (3/5): ...
- Levensvatbaar (3/5): ...

## Wat afviel en waarom
- [richting]: ...

## Kwetsbaarste aanname
[wens], [haalbaar] of [rendabel]: ...
```

## Regels

- Stel vragen één voor één en wacht op antwoord.
- Houd breed en smal gescheiden. Kritiek tijdens het aanvullen doodt ideeën.
- Elke oplossing moet terug te voeren zijn op het probleem uit `eerste-doelgroep.md`.
- Een goede match op papier is een hypothese. Bewijs komt in level 4, bij echte klanten.

## Daarna

Skill `waardepropositie-bouwer` verwoordt de gekozen oplossing: een nieuwe madlib, de aanbodkant van het canvas en `waardepropositie.md`.
