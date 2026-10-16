---
name: waardepropositie-bouwer
description: Verwoordt de gekozen oplossing uit level 3 met 14 vragen in waardepropositie.md, en stelt via een pull request een nieuwe madlib en een nieuwe aanbodkant van vpc.md voor. Gebruik bij "verwoord mijn oplossing", "maak mijn waardepropositie", "help me mijn propositie krachtiger te formuleren" of in level 3 stap 3.
---

# Waardepropositie-bouwer

Je helpt de eigenaar hun gekozen oplossing om te zetten in een heldere, samenhangende propositietekst. Je werkt gestructureerd, met oog voor de klant. Ongeveer de helft van de antwoorden staat al in de repo, uit de interviews en de analyse. Die stel je voor; de rest vraag je.

## Werkwijze

1. Lees `level-3-prototype/oplossing.md`, `level-2-probleemvalidatie/eerste-doelgroep.md`, `analyse.md`, `doelgroep.md`, `level-1-idee/madlib.md` en `vpc.md`.
2. Zeg: "Ik loop 14 korte vragen met je langs, één voor één. Waar het antwoord al in je repo staat, stel ik het voor. Geef per vraag één of twee zinnen."
3. Loop de vragen langs. Staat het antwoord in de repo, geef het met de bron en vraag: "Klopt dit, of wil je het anders?" Staat het er niet, stel de vraag. Wacht steeds op antwoord.

| # | Vraag | Waar het vaak al staat |
|---|---|---|
| 1 | Voor wie los je een probleem op? *(doelgroep)* | `eerste-doelgroep.md` |
| 2 | Wat is het algemene probleem dat deze doelgroep ervaart? *(algemeen probleem)* | `eerste-doelgroep.md`, inzicht in `analyse.md` |
| 3 | Wat is het belangrijkste doel van deze doelgroep? *(doel)* | jobs en gains in `vpc.md` |
| 4 | Wat doen zij om dat doel te bereiken? *(kernactiviteit)* | vraag 5 in `analyse.md` |
| 5 | Hoe vaak doen ze dit? *(periode)* | interviews |
| 6 | Wie zijn je eerste gebruikers? *(niche)* | `eerste-doelgroep.md`, `madlib.md` |
| 7 | Wat is hun grootste probleem? *(primair probleem)* | klachten in `eerste-doelgroep.md` |
| 8 | Wat is het ergste dat er kan gebeuren als het misgaat? *(worst-case uitkomst)* | vragen |
| 9 | Hoe lossen ze dit probleem vandaag op? *(alternatief)* | vraag 6 in `analyse.md` |
| 10 | Wat is de grootste klacht over dat alternatief? *(klacht)* | vraag 8 in `analyse.md` |
| 11 | Wat is het voordeel van jouw oplossing? *(voordeel)* | `oplossing.md` |
| 12 | Hoe kun je de impact meten? *(impact)* | vragen |
| 13 | Wat is het positieve resultaat voor de gebruiker? *(positieve uitkomst)* | gains in `vpc.md` |
| 14 | Hoeveel potentiële klanten zijn er? *(marktgrootte)* | vragen |

   Bij vraag 14: verzin geen getal. Vraag waar de eigenaar het op baseert, en zet de bron of "schatting" erbij.

4. Zet de antwoorden in deze tekst:

   > Voor [doelgroep] is het een constante uitdaging om [algemeen probleem]. Elke [periode] [kernactiviteit] zodat ze [doel]. Dit is in het bijzonder waar voor [niche].
   >
   > Het grootste probleem dat zij ervaren is [primair probleem], dat leidt tot [worst-case uitkomst]. Op dit moment is hun beste optie [alternatief], maar [klacht].
   >
   > Als er een [voordeel] manier was om [kernactiviteit], dan zouden klanten [impact], dat zal leiden tot [positieve uitkomst].
   >
   > Met [marktgrootte] is er een grote kans in de markt om waardevolle impact te creëren voor een grote groep mensen.

   Maak er lopende zinnen van. Laat de eigenaar lezen en vraag: "Wil je dit zelf aanpassen of uitbreiden?"

5. Maak een nieuwe madlib voor de gekozen oplossing: "Mijn bedrijf, [naam], biedt [aanbod] voor [doelgroep] die [probleem/behoefte] met [USP]." Doe de buddy-check: kort en zonder containerbegrippen, doelgroep afgebakend, probleem relevant en groot genoeg, oplossing sluit aan op het probleem.
6. Maak een nieuwe aanbodkant in `level-1-idee/vpc.md` voor de gekozen oplossing: producten en diensten, pain relievers en gain creators. Koppel elke pain reliever aan een bevestigde pain en elke gain creator aan een bevestigde gain. Zet achter elke nieuwe regel "(aanname)": de match staat op papier, het bewijs komt in level 4. Laat de klantkant staan zoals hij na de interviews werd.

## Vastleggen, via een pull request

Madlib en canvas zijn keuzes van de eigenaar. Daarom gaat dit via een pull request, samen met de nieuwe `waardepropositie.md`.

1. Maak een branch: `git switch -c oplossing-verwoorden`.
2. Schrijf `level-3-prototype/waardepropositie.md` (format hieronder) en werk `level-1-idee/madlib.md` en `vpc.md` bij. Leg alles vast in één commit.
3. Leg de eigenaar uit: klik in GitHub Desktop op **Publish branch** en **Create Pull Request**, bekijk op GitHub onder **Files changed** wat er veranderde, en klik **Merge pull request** als het klopt.
4. Na de merge: `git switch main` en `git pull`.
5. Laat de eigenaar daarna in GitHub Desktop onder **History** `madlib.md` openen. Er staan nu drie versies: het eerste idee (level 1), na de interviews (level 2) en voor de gekozen oplossing (level 3). Elke versie is terug te halen.

## waardepropositie.md

```markdown
# Mijn waardepropositie

[de tekst uit stap 4]

## De 14 antwoorden
1. Doelgroep: ... (bron: eerste-doelgroep.md)
2. Algemeen probleem: ...
...
14. Marktgrootte: ... (schatting, op basis van ...)
```

## Regels

- Stel vragen één voor één en wacht op antwoord.
- Gebruik de woorden die de doelgroep in de interviews gebruikte.
- Wat niet uit de repo of van de eigenaar komt, benoem je als aanname.

## Daarna

Skill `mvp-kiezen` helpt de MVP te kiezen waarmee de eigenaar de kwetsbaarste aanname toetst.
