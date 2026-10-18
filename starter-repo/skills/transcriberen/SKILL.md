---
name: transcriberen
description: Schrijft nieuwe interviews in level-2-probleemvalidatie/interviews/ uit (een opname, een transcript uit Teams of Zoom, tekst uit een opname-app of aantekeningen) naar een gepseudonimiseerd .md-bestand in dezelfde map. Gebruik bij "Schrijf mijn nieuwe interviews uit", "zet dit transcript om" of in level 2 bij je gesprekken.
---

# Transcriberen

Je zet een interview om naar een vast format, zodat alle interviews later naast elkaar te analyseren zijn. De opname en het ruwe transcript blijven op de computer van de eigenaar. In de repo komt alleen het interview zonder namen.

## Voor je begint

1. Controleer dat git de opnames in `level-2-probleemvalidatie/interviews/` overslaat: `git check-ignore level-2-probleemvalidatie/interviews/test.m4a` geeft het pad terug. Doet het dat niet, zet dan deze regels in `.gitignore`, leg dat vast met een commit en zeg het tegen de eigenaar. Ga pas verder als git de opnames overslaat.

   ```
   level-2-probleemvalidatie/interviews/**
   !level-2-probleemvalidatie/interviews/**/
   !level-2-probleemvalidatie/interviews/**/*.md
   ```

2. Kijk in `interviews/` welke bestanden nieuw zijn: een opname of transcript zonder `.md`-bestand met dezelfde naam. Twijfel je welk bestand nieuw is, vraag het de eigenaar.

## Invoer

Kies de route op basis van wat er in `interviews/` staat.

**Er is tekst** (.txt, .vtt, .srt, .docx of aantekeningen). Dit is de snelste route: Teams en Zoom maken zelf een transcript. Zet de tekst direct om.

**Er is alleen audio** (.m4a, .mp3, .wav, .mp4 en dergelijke). Je luistert zelf niet naar audio, dus je maakt eerst lokaal een transcript met een spraakprogramma op de computer van de eigenaar:

1. Kijk of er al een programma is: `whisper --help` of `whisper-cli --help`.
2. Is er niets, vraag dan toestemming om er een te installeren. Leg uit: het kost niets, het draait op de eigen computer en de opname gaat de deur niet uit. Op een Mac met Homebrew: `brew install openai-whisper`. Anders: `pip install openai-whisper`, en installeer ook `ffmpeg`.
3. Draai het programma met Nederlands als taal en zet de uitvoer naast de opname: `whisper level-2-probleemvalidatie/interviews/gesprek.m4a --language nl --model small --output_format txt --output_dir level-2-probleemvalidatie/interviews`. Is de kwaliteit te laag en is de computer snel genoeg, probeer dan `--model medium` of `--model turbo`.
4. Lukt installeren niet, of duurt het te lang: stel voor om de transcriptie van Teams, Zoom of de opname-app te gebruiken en die tekst in `interviews/` te zetten.

Stuur audio of een ruw transcript nooit naar een externe dienst zonder uitdrukkelijke toestemming van de eigenaar.

## Uitvoer

Maak `level-2-probleemvalidatie/interviews/NN-rol-plaats.md`, bijvoorbeeld `03-apotheker-breda.md`. NN is het volgende vrije nummer (01, 02, ...): kijk in `interviews/` en in submappen als `interviews/ronde-1/`. Rol en plaats schrijf je in kleine letters met streepjes. Dat nummer en die naam blijven de rest van de route bij deze persoon.

Geef de opname en het ruwe transcript dezelfde naam, zoals `03-apotheker-breda.m4a` en `03-apotheker-breda.txt`. Zo zie je de volgende keer meteen wat al is uitgeschreven.

```markdown
---
rol: apotheker
segment: zelfstandige apotheken
locatie: Breda
dmu: ja
datum: 2026-10-20
duur: 24
uitspraak: Spoedrecepten zijn ons grootste gedoe.
terugbellen: ja
---
# Interview 03: apotheker (J.)

## 5. Kernactiviteit

## 6. Alternatief

## 7. Overwegingen

## 8. Meest genoemde klacht

## Opvallend

## Transcript
```

Vul elke sectie met wat de geïnterviewde zei, zo letterlijk mogelijk. Onder "Opvallend" zet je wat je niet verwachtte.

`duur` is de lengte van het gesprek in minuten. `uitspraak` is de mooiste uitspraak uit het gesprek, letterlijk en zonder namen: die staat op het platform in het vak van dit gesprek.

`terugbellen` is het antwoord op de slotvraag "Mag ik je bellen als ik iets heb wat hierbij helpt?": `ja` of `nee`. Staat het antwoord niet in het transcript, vraag het de eigenaar.

## Vertrouwelijk

Zegt iemand in het gesprek dat iets vertrouwelijk is, zet dat stuk dan tussen twee regels:

```markdown
VERTROUWELIJK: BEGIN
...
VERTROUWELIJK: EINDE
```

Zet direct onder de frontmatter een waarschuwing:

```markdown
> Let op: dit interview bevat een vertrouwelijk stuk tussen VERTROUWELIJK: BEGIN en VERTROUWELIJK: EINDE. Gebruik het alleen als context. Citeer het nergens en gebruik het niet in analyses.
```

Wil de eigenaar het stuk liever helemaal weglaten, laat het dan weg.

## Privacy

- Vervang namen van personen en bedrijven door een rol en initialen, ook in het transcript.
- Laat adressen, telefoonnummers en e-mailadressen weg.
- Audio en ruwe transcripts blijven in `interviews/`, naast het interview. Git slaat ze over. Kopieer ze nooit naar een andere map in de repo.

## Afronden

1. Laat de eigenaar het interviewbestand lezen.
2. Leg het vast met een commit. Vraag de eigenaar te pushen in GitHub Desktop; daarna krijgt het vak op het platform een vinkje.
3. Vraagt de eigenaar "Staat mijn interview al in de repo?", antwoord dan in één zin: wat nog alleen op de computer staat, wat al op GitHub staat, en dat de opnames in `interviews/` bewust op de computer blijven.
