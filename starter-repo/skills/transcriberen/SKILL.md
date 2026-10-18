---
name: transcriberen
description: Schrijft nieuwe interviews in level-2-probleemvalidatie/interviews/ uit (een opname, een transcript uit Teams of Zoom, tekst uit een opname-app of aantekeningen) naar een gepseudonimiseerd .md-bestand in dezelfde map. Gebruik bij "Schrijf mijn nieuwe interviews uit", "zet dit transcript om" of in level 2 bij je gesprekken.
---

# Transcriberen

Je zet een interview om naar een vast format, zodat alle interviews later naast elkaar te analyseren zijn. De opname en het ruwe transcript blijven op de computer van de eigenaar. In de repo komt alleen het interview zonder namen.

## Zeg steeds wie wat doet

De eigenaar moet op elk moment weten of er iets te doen is. Zeg dat bij elke stap in één of twee zinnen, voordat je begint. Gebruik deze zinnen, of zinnen die er dicht bij blijven:

1. **Je begint.** "Ik zie 1 nieuwe opname: `gesprek.m4a`. Ik schrijf hem uit. Je hoeft nu niets te doen."
2. **De eerste keer, voor je `uv` installeert of de 900 MB ophaalt.** "Om je opname op je eigen computer uit te schrijven, haal ik één keer ongeveer 900 MB op. Het kost niets en je opname gaat de deur niet uit. Vraagt je AI-app om toestemming, klik dan op Toestaan."
3. **Je schrijft uit.** "Dit duurt ongeveer 5 minuten. Je hoeft nu niets te doen."
4. **Het interview staat klaar.** "Je interview staat klaar: `03-apotheker-breda.md`. Lees het. Klopt het, zeg dan 'klopt'. Moet er iets anders, zeg het me."
5. **Na de push.** "Klaar. Je interview staat op GitHub en vak 3 in Ondernemen met AI is vol. Je hoeft niets meer te doen."
6. **Pushen lukt niet.** "Het lukt me niet om je interview op GitHub te zetten. Open GitHub Desktop en klik op Push origin. Daarna is vak 3 vol."

Wacht na zin 2 en zin 4 op antwoord. Na de andere zinnen ga je meteen door.

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

**Er is alleen audio** (.m4a, .mp3, .wav, .mp4 en dergelijke). Je luistert zelf niet naar audio. Je schrijft de opname uit met `uitschrijven.py`, het script naast deze skill. Het draait Whisper op de computer van de eigenaar: het model `small`, op de processor, in het Nederlands. De opname gaat de deur niet uit.

Jij draait elke opdracht. De eigenaar keurt alleen goed en typt zelf niets in de terminal.

1. **Kijk of `uv` er is:** `uv --version`. Werkt dat niet, probeer dan `~/.local/bin/uv --version` (Windows: `%USERPROFILE%\.local\bin\uv.exe --version`). `uv` haalt Python en de pakketten op die het script nodig heeft.
2. **Is er geen `uv`, vraag dan toestemming om het te installeren.** Leg in twee zinnen uit: het kost niets, er zijn geen beheerdersrechten voor nodig en de opname blijft op de computer. Installeer na de toestemming:
   - Mac en Linux: `curl -LsSf https://astral.sh/uv/0.11.1/install.sh | sh`
   - Windows: `powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/0.11.1/install.ps1 | iex"`

   `uv` komt in `~/.local/bin`. Gebruik dat volledige pad tot er een nieuwe terminal open is.
3. **Vertel vóór de eerste keer dat er ongeveer 900 MB binnenkomt,** en vraag toestemming. Daarna downloadt het niets meer.
   - Python 3.12: 54 MB. `uv` zet het in een eigen map, los van andere Python op de computer.
   - De pakketten: 367 MB. Faster-whisper en wat het nodig heeft, met vaste versies.
   - Het model `small`: 464 MB. Dat deel herkent de spraak.

   Op een gewone thuisverbinding duurt dat een paar minuten. Homebrew en ffmpeg zijn niet nodig.
4. **Maak een lijst met vakwoorden,** 5 tot 15 woorden uit `doelgroep.md`, `interviewvragen.md` en `level-1-idee/`: de doelgroep, het product en woorden uit de branche. Geen namen van personen. Whisper schrijft vakwoorden met die lijst vaker goed, zoals "spoedrecepten" in plaats van "spoedresetten".
5. **Schrijf de opname uit:**

   ```
   uv run skills/transcriberen/uitschrijven.py level-2-probleemvalidatie/interviews/gesprek.m4a --woorden "apotheker, spoedrecepten, baxterrol"
   ```

   Het script zet het transcript naast de opname (`gesprek.txt`) en meldt de duur, zoals `duur: 24 min`. Op een Mac met Apple Silicon duurt een gesprek van 30 minuten ongeveer 5 minuten; op een oudere laptop langer. Zeg vooraf hoe lang het ongeveer duurt. Draai het op de achtergrond of met een lange time-out, zodat het niet halverwege stopt. Verander de versies in het script niet: met nieuwere versies brak het uitschrijven.
6. **Lees het transcript na.** Whisper weet niet wie er praat. De vragen uit `interviewvragen.md` zijn van de eigenaar, de rest is van de geïnterviewde. Verbeter alleen duidelijk verkeerd gehoorde vakwoorden.
7. **Lukt installeren of uitschrijven niet,** stel dan voor om de transcriptie van Teams, Zoom of de opname-app te gebruiken en die tekst in `interviews/` te zetten.

Stuur audio of een ruw transcript nooit naar een externe dienst zonder uitdrukkelijke toestemming van de eigenaar.

## Uitvoer

Maak `level-2-probleemvalidatie/interviews/NN-rol-plaats.md`, bijvoorbeeld `03-apotheker-breda.md`. NN is het volgende vrije nummer (01, 02, ...): kijk in `interviews/` en in submappen als `interviews/ronde-1/`. Rol en plaats schrijf je in kleine letters met streepjes. Dat nummer en die naam blijven de rest van de route bij deze persoon.

Hernoem de opname en het ruwe transcript naar dezelfde naam, zoals `03-apotheker-breda.m4a` en `03-apotheker-breda.txt`. Git slaat ze over, dus een gewone `mv` is genoeg. Zo zie je de volgende keer meteen wat al is uitgeschreven.

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

`duur` is de lengte van het gesprek in minuten: neem die over uit wat het script meldt. Bij een transcript uit Teams of Zoom staat de duur in de tijden; staat hij er niet, vraag het de eigenaar. `uitspraak` is de mooiste uitspraak uit het gesprek, letterlijk en zonder namen: die staat in Ondernemen met AI in het vak van dit gesprek.

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

1. Laat de eigenaar het interviewbestand lezen (zin 4). Wacht tot de eigenaar "klopt" zegt.
2. Leg het vast met een commit op `main` en push zelf met `git push`, zonder pull request: een interview is materiaal. Zeg daarna zin 5. Lukt pushen niet, zeg dan zin 6.
3. Vraagt de eigenaar "Staat mijn interview al in de repo?", antwoord dan in één zin: wat nog alleen op de computer staat, wat al op GitHub staat, en dat de opnames in `interviews/` bewust op de computer blijven.
