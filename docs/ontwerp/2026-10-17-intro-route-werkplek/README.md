# Schetsen: welkomst, routekaart en Level 0

Klikbare schetsen van de eerste minuten op het platform. Harmen keurde ze goed op 16 en 17 oktober 2026. Ze zijn de basis voor de bouw in `platform/`; het uitgeschreven ontwerp staat in `docs/superpowers/specs/2026-10-17-intro-routekaart-werkplek-design.md`.

Open `welkom.html` in een browser en klik door. Je hebt geen server nodig.

## De flow

1. **`welkom.html`**: vijf schermen om doorheen te scrollen. Je start je eigen bedrijf, de route met zes stappen (met een lus tussen 1 en 2 en tussen 4 en 5), eerst je basiskamp, dan de markt op, tot je eerste klant. Met de knop "Bekijk je route" ga je naar de kaart.
2. **`routekaart.html`**: het padbeeld als levelkaart. De zeven lichtjes op het pad zijn level 0 tot en met 6. Jij staat bij je huidige level. Alleen je huidige en je gekozen level hebben een label; de andere labels zie je als je eroverheen gaat. Kom je van een afgerond level (`?voortgang=1&van=0`), dan loop je naar het volgende lichtje. Daarna wijst een wijzer met een hupje dat lichtje aan, en klik je het zelf aan.
3. **`level0-werkplek.html`**: Level 0 bestaat uit vier scènes (basiskamp, vroeger, nu, repo), acht stappen als kaarten in een licht blok, en een slotscherm "Je basiskamp staat" met de knop "Op naar je idee". Na de laatste stap scrolt de pagina daar vanzelf heen.

## Wat in de schetsen nagebootst is

- **De schermen van GitHub, GitHub Desktop en de terminal zijn nagetekend.** In het platform worden het schermafbeeldingen met dezelfde markering.
- **Koppelen met GitHub is nagebootst** binnen het venster. In het echt opent GitHub in een nieuw tabblad.
- **De voortgang staat alleen in de pagina.** Herlaad je de pagina, dan begin je opnieuw. Tussen de pagina's gaat de voortgang via de URL (`?voortgang=…&van=…`).
- **De demoknop bij stap 8** doet alsof de AI `werkplek.md` invulde en jij hem pushte.

## Beelden

`beelden/` bevat sfeerbeelden die gemaakt zijn met de beeldgenerator van Codex (gpt-image, ingebouwde modus) en verkleind tot WebP. Ze zijn één serie in Morgen-kleuren:

- `start.webp`: de hoofdpersoon aan het begin van het pad.
- `start-leeg.webp`: hetzelfde beeld zonder persoon, als ondergrond van de routekaart.
- `jij-uitgesneden.webp`: de hoofdpersoon los, met een transparante achtergrond, om over de kaart te laten lopen.
- `werkplek.webp`, `vroeger.webp`, `samen.webp`, `markt.webp` en `klanten.webp`: de scènes.

In `werkplek.webp` heeft de AI een lichtbol met gezichtje, in `samen.webp` niet. Daar moet nog één versie van gekozen worden.
