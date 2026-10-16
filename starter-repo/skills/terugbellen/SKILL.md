---
name: terugbellen
description: Maakt per persoon die terugbellen ja zei een spiekbriefje uit diens interview, bovenaan level-4-marktfeedback/feedback/NN-rol.md, als voorbereiding op het gesprek met de MVP. Gebruik bij "bereid mijn terugbelgesprekken voor", "wie kan ik terugbellen", voor elke nieuwe ronde in level 4 en 5, of in level 4 stap 3.
---

# Terugbellen

De eigenaar gaat met hun MVP terug naar de mensen die ze in level 2 interviewden: "Weet je nog, je zei dat je hier tegenaan loopt. Ik heb misschien iets voor je." Jij weet nog wat iedereen zei, omdat het in de repo staat. Per persoon maak je een spiekbriefje, zodat de eigenaar het gesprek voert met diens eigen woorden in het achterhoofd.

## Werkwijze

1. Lees alle interviews in `level-2-probleemvalidatie/interviews/`, ook in submappen. Lees `eerste-doelgroep.md`, `level-3-prototype/oplossing.md`, `mvp.md`, `level-4-marktfeedback/prijs.md` en de testkaart van deze ronde in `testkaarten/`.
2. Maak een lijst van iedereen met `terugbellen: ja`. Zet erbij: nummer en rol, datum van het interview, en of die persoon bij de eerste doelgroep hoort. Laat de eigenaar kiezen wie ze bellen. Mensen met `terugbellen: nee` bel je niet.
3. Wil de eigenaar ook nieuwe mensen spreken, geef die dan het volgende vrije nummer, gekeken over `interviews/` en `feedback/` samen, en een rol: `07-apotheker`.
4. Maak per persoon `level-4-marktfeedback/feedback/NN-rol.md` met hetzelfde nummer en dezelfde rol als het interview. Bestaat het bestand al uit een eerdere ronde, zet dan onder de vorige ronde een nieuw spiekbriefje en een nieuwe sectie: "Spiekbriefje ronde 2" en "Ronde 2". Zet `ronde` in de frontmatter op het nieuwe nummer; `antwoord` blijft staan tot er een nieuw antwoord is.
5. Laat de eigenaar de spiekbriefjes lezen. Leg ze vast met een commit en vraag de eigenaar te pushen.

## Het spiekbriefje

Per persoon, kort genoeg om vlak voor het gesprek te lezen:

- **Wanneer gesproken:** datum van het interview.
- **Hun alternatief:** wat diegene nu gebruikt (vraag 6), in hun eigen woorden.
- **Hun klachten:** wat hen dwarszit (vraag 8), met één of twee korte citaten.
- **Wat je MVP daarvan oplost**, en wat nog niet. Wees eerlijk; de eigenaar moet weten waar het gesprek kan vastlopen.
- **Opening:** een eerste zin die verwijst naar wat diegene zei.
- **Je voorstel:** wat ze kunnen proberen, en de vraag met je prijs uit `prijs.md`: "Wil je dit hebben, voor deze prijs?"
- **Bij nee:** vraag waarom niet. Dat antwoord is het belangrijkste wat je meeneemt.
- **Let op:** wat diegene doet, niet alleen wat diegene zegt. Probeert iemand het, vraagt iemand door, wil iemand betalen of het blijven gebruiken?

Vanaf ronde 2: zet erbij waarom diegene in de vorige ronde nee of twijfel zei, en wat er sindsdien aan je MVP veranderde. De vraag wordt: "En zo dan, dan wel?"

## feedback/NN-rol.md

```markdown
---
persoon: 01-apotheker
ronde: 1
antwoord:
---
# 01-apotheker (J.)

## Spiekbriefje ronde 1
- Wanneer gesproken: 20 oktober 2026
- Hun alternatief: ...
- Hun klachten: ... "..."
- Wat mijn MVP oplost: ... Nog niet: ...
- Opening: "Weet je nog, je zei dat ..."
- Voorstel: ... voor €40 per maand. "Wil je dit hebben, voor deze prijs?"
- Bij nee: vraag waarom niet.
- Let op: ...

## Ronde 1
- Wat diegene probeerde, en hoe lang:
- Mijn voorstel:
- Antwoord:
- Waarom:
```

`antwoord` in de frontmatter blijft leeg tot na het eerste gesprek. Daarna staat er `ja`, `nee` of `twijfel`: het antwoord uit de laatste ronde. De eigenaar vult de sectie "Ronde 1" in op het platform, of vertelt jou hoe het ging; dan vul jij hem in. Een ja is gedrag: een aanbetaling, een voorbestelling, of het tegen je prijs willen blijven gebruiken. "Ik zou het kopen" is twijfel.

Koopt iemand echt, wijs dan op de knop "Ik heb een klant" op het platform.

## Regels

- Gebruik een rol en initialen, nooit een volledige naam. Telefoonnummers en e-mailadressen blijven buiten de repo.
- Stukken tussen `VERTROUWELIJK: BEGIN` en `VERTROUWELIJK: EINDE` gebruik je alleen als context. Je citeert ze niet op het spiekbriefje.
- Verzin niets over iemand. Staat het niet in het interview, dan staat het niet op het spiekbriefje.

## Daarna

Na de gesprekken leest skill `resultaatkaart` de ronde: hoeveel ja, de redenen van nee, en het besluit.
