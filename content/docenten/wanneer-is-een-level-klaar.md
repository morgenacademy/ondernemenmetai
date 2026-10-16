# Wanneer is een level klaar?

Voor docenten en trainers. Hier staat waar het platform op checkt, en wanneer een level voldaan is. De deelnemer ziet deze checks niet. Die ziet per level alleen het doel in de eerste kolom.

Bron: `docs/superpowers/specs/2026-10-16-levels-1-6-opzet.md`, besloten met Harmen van Heist op 16 oktober 2026. Alle levels checken in de klikbare demo zoals hieronder, ook de knop "Ik heb een klant". Alleen de markering bij teruggaan is nog opzet.

## Per level

| Level | Doel voor de deelnemer | Voldaan als | Check op de kern | Alle checks |
|---|---|---|---|---|
| 0 Werkplek | Je AI werkt in je eigen repo en je eerste wijziging staat online. | de werkplek is ingericht | `setup.md` en `werkplek.md` ingevuld. `werkplek.md` staat pas op GitHub na een push, dus de check laat ook zien dat commit en push werken. | gelijk aan de kern |
| 1 Idee | Je idee staat in één zin, en je hebt een eerste waardepropositie vol aannames. | de madlib staat en de eerste versie van de waardepropositie is ingevuld | `madlib.md` en `vpc.md` ingevuld | ook `idee.md` en `visie.md` ingevuld, minstens 3 aannames in `aannames.md`, en `feedback-propositie.md` bestaat |
| 2 Probleem-validatie | Je weet wie je eerste klanten zijn en welk probleem ze allemaal hebben, en je interviews bewijzen het. | de 'eerste' doelgroep is ontdekt die allemaal hetzelfde probleem ervaart: interviews gedaan, geanalyseerd en een conclusie getrokken | minstens 5 (B2B) of 15 (B2C) interviews in `interviews/`, `analyse.md` ingevuld, en `gevonden: ja` in `eerste-doelgroep.md` | ook `doelgroep.md` en `interviewvragen.md` ingevuld, en minstens 1 gemergde pull request |
| 3 Prototype | Je hebt een MVP die je aan je doelgroep kunt laten zien. | er is een MVP die je kunt laten zien | `oplossing.md` ingevuld en minstens één bestand in `mvp/` | ook minstens 10 ideeën in `oplossingen.md`, en `waardepropositie.md` en `mvp.md` ingevuld |
| 4 Markt feedback | Je hebt van genoeg mensen gehoord wat ze van je MVP vinden. | er is van genoeg mensen feedback op de MVP | minstens 3 (B2B) of 10 (B2C) bestanden in `feedback/` met een `antwoord` | ook `prijs.md` ingevuld, een spiekbriefje per persoon, een testkaart (`testkaarten/ronde-1.md`) met alle vijf blokken, en een resultaatkaart (`resultaten/ronde-1.md`) met een besluit |
| 5 Product-validatie | Je hebt een product waar je voor gaat. | er is een product waarvan de deelnemer zegt: hier ga ik voor. Meer bestellen, laten produceren of nu echt verkopen. | `product.md` met `besluit: ik ga ervoor` en de onderbouwing uit de rondes | ook `product.md` ingevuld met een onderbouwing, minstens 2 resultaatkaarten (één ronde na het doorontwikkelen), `bmc.md` ingevuld, en de sectie "Over mijn onderneming" in `AGENTS.md` gevuld |
| 6 Lancering | Je hebt je eerste klant. | er blijkt een klant te zijn. Dat kan op elk moment. | minstens 1 betalende klant in `klanten.md` | ook `skills/verkoopaanpak/SKILL.md` bestaat met een `name` en een `description`, en `pijplijn.md` en `impact.md` zijn ingevuld |

## Zo werken de checks

- **Een level is voldaan als alle checks groen zijn.** Pas dan gaat het volgende level open.
- **Level 6 is de uitzondering.** De knop "Ik heb een klant" staat er vanaf level 1. Gebruikt de deelnemer hem, dan gaat level 6 open, ook als level 4 of 5 nog niet af is.
- **"Ingevuld" betekent:** het bestand staat in de repo, de markering `<!-- invullen -->` bovenaan is weg, en onder de koppen staat tekst.
- **Het platform leest de repo op GitHub.** Wat de deelnemer of de AI op de eigen computer maakt, telt pas na een push.
- **De aantallen volgen B2B of B2C** uit `doelgroep.md`: 5 of 15 interviews, 3 of 10 mensen met een antwoord. De deelnemer kan ze aanpassen met `interviews_nodig` en `feedback_nodig` in de frontmatter van `doelgroep.md`.
- **Teruggaan sluit niets af.** Wordt een check later weer rood, dan blijft het volgende level open en krijgt het eerdere level een markering.

## Wat de checks niet meten

De checks zien of iets er staat, niet of het goed is. Een ingevulde analyse kan een zwakke analyse zijn, en `gevonden: ja` vult de deelnemer zelf in. Daarvoor kijkt de trainer mee. De trainer hoeft niets goed te keuren om een level te openen, maar kan elk bestand in de repo lezen en erop reageren.
