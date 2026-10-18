---
name: verbeteren
description: Zet de redenen van nee uit de feedback van level 4 op een rij, koppelt ze aan de klachten uit de interviews, stelt per reden minstens drie aanpassingen voor en legt de gekozen aanpassingen en product.md vast via een pull request. Gebruik bij "wat moet er beter", "ontwikkel mijn MVP door", na een resultaatkaart met besluit doorontwikkelen, of in level 5 stap 1.
---

# Verbeteren

De eigenaar pakt de feedback van hun mensen op, ontwikkelt de MVP door en gaat weer naar de markt: "En zo dan, dan wel?" Jij zorgt dat elke aanpassing terug te voeren is op een reden die iemand gaf. De interviews uit level 2 vertelden wat er vervelend was aan het huidige alternatief. Lost de oplossing dat echt op, dan willen mensen hem hebben.

## Werkwijze

1. Lees alle bestanden in `level-4-marktfeedback/feedback/` en `resultaten/`, de interviews in `level-2-probleemvalidatie/interviews/`, `level-3-prototype/oplossing.md`, `mvp.md`, de bestanden in `mvp/`, en `level-5-productvalidatie/product.md` als die er al is.
2. Zet alle redenen van nee en twijfel op een rij, per persoon en per ronde. Groepeer redenen die op hetzelfde neerkomen en tel ze. Koppel elke groep aan de klachten (vraag 8) en het alternatief (vraag 6) uit de interviews. Laat de eigenaar de tabel zien.
3. Check bij elke groep: ligt het aan het product, aan de prijs, aan het voorstel, aan het kanaal, of aan de persoon (hoort diegene wel bij de eerste doelgroep)?
4. Begin bij de reden die het vaakst terugkomt. Stel per reden minstens drie concrete aanpassingen voor, uit verschillende hoeken: het product, de prijs of de manier van betalen, het voorstel, de doelgroep, of wat er naast het product nodig is (service, training, financiering).
5. Laat de eigenaar per reden kiezen, één reden tegelijk, en vraag waarom. Een reden bewust laten liggen mag ook; dan komt hij onder "Wat er bewust niet in zit".
6. Veranderen klantsegment of waardepropositie wezenlijk, zeg dan dat het een pivot is. Bespreek of de eigenaar terug wil naar level 3.
7. Vraag welke aanpassingen jij kunt doen (de digitale delen in `level-3-prototype/mvp/`) en welke de eigenaar zelf doet (fysiek, met mensen).

## Vastleggen, via een pull request

De MVP en het product zijn keuzes van de eigenaar. Daarom gaat dit via een pull request.

1. Maak een branch: `git switch -c doorontwikkelen-na-ronde-N`.
2. Pas de digitale delen van de MVP aan in `level-3-prototype/mvp/`.
3. Schrijf of werk `level-5-productvalidatie/product.md` bij (format hieronder). Laat `besluit` en `volgende_stap` leeg; die kiest de eigenaar in Ondernemen met AI, in stap 3 van level 5.
4. Leg alles vast in één commit. Leg de eigenaar uit: in GitHub Desktop **Publish branch** en **Create Pull Request**, op GitHub onder **Files changed** nakijken, dan **Merge pull request**.
5. Na de merge: `git switch main` en `git pull`.

## product.md

```markdown
---
besluit:
volgende_stap:
---
# Mijn product

## Wat erin zit
- [onderdeel]. Bewijs: ronde 1, 3 van 5 ja; 02-apotheker en 04-apotheker vroegen erom.

## Wat er bewust niet in zit
- [onderdeel]. Waarom: ...

## Wat veranderde per ronde
### Na ronde 1
- Reden van nee: "te duur voor een proef" (3 van 5) → eerste maand gratis, daarna €40.

## Onderbouwing
```

## De onderbouwing voor je besluit

Kiest de eigenaar in stap 3 van level 5 of ze ervoor gaan, vat dan het bewijs samen uit `feedback/` en `resultaten/`: hoeveel ja per ronde, wie betaalde of bleef gebruiken, en welke redenen van nee er nog liggen. Geef de samenvatting in het gesprek; de eigenaar neemt hem over in Ondernemen met AI, samen met het besluit. Wil de eigenaar dat jij hem in `product.md` zet, doe dat dan via een pull request.

## Regels

- Stel vragen één voor één en wacht op antwoord.
- Geef altijd minstens drie opties per reden. De eigenaar kiest.
- Elke aanpassing heeft een reden uit de feedback. Een idee zonder reden schrijf je op als idee, niet als aanpassing.
- Verlaag nooit alleen de prijs. Een lagere prijs hoort bij een kleiner of ander aanbod: voor wat hoort wat.
- Stukken tussen `VERTROUWELIJK: BEGIN` en `VERTROUWELIJK: EINDE` gebruik je alleen als context.

## Daarna

De eigenaar gaat terug naar de markt met een nieuwe ronde: een nieuwe testkaart (skill `testkaart`), dezelfde mensen en nieuwe spiekbriefjes (skill `terugbellen`), en na de gesprekken een nieuwe resultaatkaart (skill `resultaatkaart`). Dit herhaalt zich tot de eigenaar zegt: hier ga ik voor.
