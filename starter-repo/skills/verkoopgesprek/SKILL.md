---
name: verkoopgesprek
description: Helpt de eigenaar uit de feedback en de eerste verkoop hun eigen verkoopaanpak af te leiden, in de structuur van het gestructureerde verkoopgesprek (VACATIO, SPIN, DMU), en die vast te leggen als eigen skill in skills/verkoopaanpak/SKILL.md. Gebruik bij "leg vast hoe ik verkocht", "maak mijn verkoopaanpak", "hoe verkoop ik dit vaker" of in level 6 stap 2.
---

# Verkoopgesprek

De eigenaar heeft een klant. Hoe ze verkochten, ontdekten ze onderweg: in de terugbelgesprekken, de voorstellen en de redenen van nee. Jij haalt dat uit de repo en zet het in de structuur van een gestructureerd verkoopgesprek. Het resultaat is een skill van de eigenaar zelf, waarmee hun AI elk volgend gesprek op dezelfde manier voorbereidt. Herhaalbaar betekent: elke keer dezelfde stappen.

## Werkwijze

1. Lees `level-6-lancering/klanten.md`, alle bestanden in `level-4-marktfeedback/feedback/` en `resultaten/`, `prijs.md`, `level-5-productvalidatie/product.md`, `bmc.md` en de interviews in `level-2-probleemvalidatie/interviews/`.
2. Vraag de eigenaar naar het gesprek met hun eerste klant, van eerste contact tot ja. Eén vraag tegelijk: hoe kwam het contact, wat zei je als eerste, wanneer sloeg het om, wat twijfelde diegene, wie besliste?
3. Haal per fase hieronder uit de feedback en het gesprek wat werkte: welke opening, welke vragen, welk voorstel, welke bezwaren en wat de eigenaar antwoordde. Zet bij elke regel waar het vandaan komt (`feedback/02-apotheker.md, ronde 2`). Wat de eigenaar nog niet heeft geprobeerd, noem je een aanname.
4. Laat de eigenaar per fase lezen en aanvullen. Gebruik hun woorden.
5. Schrijf `skills/verkoopaanpak/SKILL.md` (format hieronder) en leg het vast via een pull request.

## De structuur: VACATIO

| Fase | Wat je doet |
|---|---|
| **V**erkenning | contact maken, de situatie van de klant leren kennen |
| **O**mschrijven klantprobleem | het probleem en de koopmotieven bij de klant toetsen |
| **C**onfrontatie | een aanbod doen dat past bij wat je hoorde |
| **A**rgumentatie | de voordelen helder maken, afgestemd op hoe de klant denkt |
| **T**egenwerpingen opvangen | luisteren, wegen, informatie geven, onderhandelen |
| **I**nstemming verkrijgen | een offerte, een contract of een nieuwe afspraak |
| **O**rder verwerven | tekenen, leveren, en zorgen dat het waargemaakt wordt |

**Voorbereiding.** Wie is de DMU (Decision Making Unit)? Met wie zit je aan tafel en waarom, wie is verder betrokken, welke informatie is voor welke rol belangrijk, en wie beslist? Waarom wil je deze klant spreken, en waar kun je diegene blij mee maken? Bevestig de afspraak en noem aan het begin de agenda en de eindtijd.

**Verkenning met SPIN.** Vier soorten vragen, in deze volgorde:
- **Situatie:** feiten over hoe het nu gaat. "Hoe is dit bij jullie geregeld?"
- **Probleem:** waar het knelt. "Waar ben je veel tijd mee kwijt?"
- **Implicatie:** wat het probleem kost. "Wat betekent dat voor je omzet of je week?"
- **Nuttig effect:** wat een oplossing oplevert. "Als dat opgelost is, wat levert het je op?"
Bij situatie- en probleemvragen onthult de klant behoeften die nog vaag zijn. Implicatievragen maken het probleem scherper, en bij nuttig-effectvragen spreekt de klant zelf uit wat diegene nodig heeft. Pas dan kom je met je aanbod. Luister, vat samen en vraag door.

**Confrontatie en argumentatie.** Speel in op het belangrijkste pijnpunt uit de verkenning. Houd de pitch kort, vertaal je oplossing naar wat de klant zei, en eindig met een vervolgvraag. Gebruik een sellogram: van product via eigenschap en voordeel naar de waarde voor de klant.

| Product | Eigenschap | Voordeel | Waarde voor de klant |
|---|---|---|---|
| ... | ... | ... | ... |

**Tegenwerpingen.** Neem de echte bezwaren uit de feedback, met het antwoord dat werkte. Blijf rustig, toon begrip en weeg het bezwaar. Bij een bezwaar over de prijs:
- Verklein: reken het om per maand of per gebruik.
- Vergelijk met het alternatief dat de klant nu gebruikt.
- Praat bij bedrijven over een investering.
- Isoleer: "Als de prijs geen bezwaar was, zouden we dan rond zijn?"
- Spreid de betaling in termijnen.
- Parkeer het bezwaar en kom erop terug als de klant probleem en oplossing kan afwegen.
- Verlaag de prijs alleen als het aanbod ook kleiner wordt. Korting is een ruil: wat doet de klant voor jou, bijvoorbeeld een referentie?

**Afsluiten.** Vat de afspraak samen, spreek de volgende stap af, en vraag direct naar de order. Geef een keuze tussen twee ja's: "Starten we deze maand of volgende maand?"

## skills/verkoopaanpak/SKILL.md

~~~markdown
---
name: verkoopaanpak
description: Bereidt een verkoopgesprek van [naam onderneming] voor met [doelgroep], volgens de aanpak waarmee de eerste klanten ja zeiden. Gebruik bij "bereid mijn gesprek met ... voor" of voor elk nieuw verkoopgesprek.
---

# Mijn verkoopaanpak

## Voor het gesprek
- Lees wat er over deze persoon of dit bedrijf in de repo staat: interview, feedback, pijplijn.
- DMU: ...
- Waarom ik deze klant wil spreken: ...

## Verkenning
- Opening die werkte: "..." (bron)
- Situatievragen: ...
- Probleemvragen: ...
- Implicatievragen: ...
- Nuttig-effectvragen: ...

## Mijn aanbod
- Pitch in drie zinnen: ...
- Sellogram: ...
- Prijs: ...

## Bezwaren en wat werkte
- "Te duur." → ... (bron)
- ...

## Afsluiten
- ...

## Na het gesprek
- Zet de klant een fase verder in level-6-lancering/pijplijn.md.
- Werkte iets niet, of juist beter? Stel een aanpassing van deze skill voor.
~~~

## Vastleggen, via een pull request

De verkoopaanpak is een keuze van de eigenaar. Daarom gaat hij via een pull request.

1. Maak een branch: `git switch -c verkoopaanpak`.
2. Schrijf `skills/verkoopaanpak/SKILL.md`. Controleer dat de frontmatter `name: verkoopaanpak` en een `description` heeft; zonder die twee vindt een AI de skill niet.
3. Leg het vast met een commit. Leg de eigenaar uit: in GitHub Desktop **Publish branch** en **Create Pull Request**, op GitHub onder **Files changed** nakijken, dan **Merge pull request**.
4. Na de merge: `git switch main` en `git pull`.
5. Laat zien hoe de eigenaar de skill gebruikt: "Gebruik skill verkoopaanpak en bereid mijn gesprek met de apotheker in Tilburg voor."

## Regels

- Stel vragen één voor één en wacht op antwoord.
- De aanpak komt uit wat de eigenaar echt deed. Wat nog niet geprobeerd is, staat er als aanname.
- Gebruik een rol en initialen, nooit een volledige naam.
- Stukken tussen `VERTROUWELIJK: BEGIN` en `VERTROUWELIJK: EINDE` komen niet in de skill.
