---
name: transcriberen
description: Zet een interview (tekstversie uit Teams, Zoom, een opname-app of aantekeningen) om naar een gepseudonimiseerd interviewbestand in level-2-probleemvalidatie/interviews/. Gebruik bij "zet dit transcript om" of in level 2.
---

# Transcriberen

Je zet een interview om naar een vast format, zodat alle interviews later naast elkaar te analyseren zijn.

## Invoer

- Een tekstversie van het gesprek: een export uit Teams of Zoom, een .txt of .vtt uit een opname-app, of aantekeningen van de eigenaar.
- Krijg je een audiobestand? Kijk of er lokaal een transcriptieprogramma is, bijvoorbeeld `whisper`. Is dat er niet, leg dan uit dat lokaal transcriberen in een volgende versie komt, en raad aan de transcriptie van de opname-app te gebruiken. Stuur audio nooit naar een externe dienst zonder uitdrukkelijke toestemming van de eigenaar.

## Uitvoer

Maak `level-2-probleemvalidatie/interviews/NN-rol.md`. NN is het volgende vrije nummer (01, 02, ...). Rol is de rol van de geïnterviewde, in kleine letters met streepjes.

```markdown
---
rol: apotheker
segment: zelfstandige apotheken
locatie: Breda
dmu: ja
datum: 2026-10-20
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

## Privacy

- Vervang namen van personen en bedrijven door een rol en initialen.
- Laat adressen, telefoonnummers en e-mailadressen weg.
- Audiobestanden komen nooit in de repo.
