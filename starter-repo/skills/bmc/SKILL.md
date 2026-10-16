---
name: bmc
description: Vult met de eigenaar de negen bouwstenen van het Business Model Canvas in level-5-productvalidatie/bmc.md, haalt wat al in de repo staat zelf op en controleert of de blokken op elkaar aansluiten. Gebruik bij "maak mijn business model canvas", "breng mijn businessmodel in kaart", "BMC" of in level 5 stap 4.
---

# Business Model Canvas

Je helpt de eigenaar hun businessmodel op één pagina te zetten. Een groot deel staat al in de repo, uit level 2 tot en met 5. Dat haal je zelf op. Je vraagt alleen naar wat ontbreekt, en je bent licht kritisch: sluiten de blokken op elkaar aan?

## Werkwijze

1. Lees `level-2-probleemvalidatie/doelgroep.md`, `eerste-doelgroep.md`, de interviews, `level-1-idee/vpc.md`, `level-3-prototype/waardepropositie.md`, `level-4-marktfeedback/prijs.md`, `feedback/`, `level-5-productvalidatie/product.md` en, als die er is, `level-6-lancering/klanten.md`.
2. Loop de negen bouwstenen langs in deze volgorde. Staat het antwoord in de repo, vat het samen met de bron en vraag: "Klopt dit?" Staat het er niet, stel de hulpvragen één voor één.
3. Sluit elk blok af met een samenvatting die op een post-it past.
4. Check na elk blok of het aansluit op de vorige blokken (zie "Samenhang"). Sluit iets niet aan, stel dan een verduidelijkende vraag.
5. Vraag aan het eind of de eigenaar de twee extra blokken van het Sustainable Business Model Canvas wil invullen: ecologische kosten en baten, en sociale kosten en baten. Dat is optioneel.
6. Schrijf `level-5-productvalidatie/bmc.md` (format hieronder). Laat de eigenaar lezen, leg het vast met een commit en vraag de eigenaar te pushen.

## De bouwstenen

**1. Klantsegmenten.** Uit `doelgroep.md` en `eerste-doelgroep.md`. Voor wie creëer je waarde? Wie zijn je belangrijkste klanten of gebruikers? Gaat het om een niche, een massa, of een paar segmenten?

**2. Waardepropositie.** Uit `vpc.md` en `waardepropositie.md`. Welke waarde bied je de klant? Welk probleem los je op? Welke producten en diensten lever je aan elk segment?

**3. Kanalen.** Hoe bereik je je klanten nu, en hoe willen ze bereikt worden? Loop de vijf fases langs: hoe worden ze zich bewust van je aanbod, hoe beoordelen ze het, hoe kopen ze, hoe krijgen ze het, en hoe help je na de aankoop? Kijk in de interviews waar mensen hun huidige alternatief kopen of vinden.

**4. Klantrelaties.** Welke relatie verwacht elk segment: persoonlijk, zelfservice, geautomatiseerd, een community? Welke relaties heb je al opgebouwd, bijvoorbeeld met de mensen die je terugbelde? Wat kost die relatie?

**5. Inkomstenstromen.** Uit `prijs.md` en de feedback. Voor welke waarde zijn klanten echt bereid te betalen? Hoe betalen ze nu, en hoe het liefst? Verkoop, abonnement, betalen per gebruik, huur, licentie? Hoeveel draagt elke stroom bij?

**6. Kernmiddelen.** Welke middelen heb je nodig om je waardepropositie te leveren: fysiek (materiaal, ruimte), intellectueel (kennis, data, merk), menselijk of financieel?

**7. Kernactiviteiten.** Wat moet je doen om je waardepropositie te leveren: produceren, problemen oplossen, een platform of netwerk onderhouden?

**8. Partners.** Wie zijn je belangrijkste partners en leveranciers? Welke middelen krijg je van hen, welke activiteiten doen zij? Waarom samenwerken: efficiëntie, minder risico, toegang tot iets wat je zelf niet hebt?

**9. Kostenstructuur.** Wat zijn de belangrijkste kosten? Welke middelen (6) en activiteiten (7) zijn het duurst? Wat is vast, zoals huur en salarissen, en wat variabel, zoals de kosten per levering?

## Samenhang

- Past de waardepropositie bij elk klantsegment dat je noemt?
- Passen de kanalen bij hoe je klanten nu kopen en zoeken?
- Betalen klanten voor de waarde die je in blok 2 noemt, volgens de feedback?
- Komen alle middelen, activiteiten en partners terug in de kosten?
- De linkerkant (middelen, activiteiten, partners) kost geld; de rechterkant (segmenten, relaties, kanalen) levert het op. Klopt die rekensom op hoofdlijnen?

## bmc.md

```markdown
# Business Model Canvas

| Partners | Kernactiviteiten | Waardepropositie | Klantrelaties | Klantsegmenten |
|---|---|---|---|---|
| ... | ... | ... | ... | ... |

| Kernmiddelen | Kanalen |
|---|---|
| ... | ... |

| Kostenstructuur | Inkomstenstromen |
|---|---|
| ... | ... |

## Per bouwsteen

### 1. Klantsegmenten
[post-it-tekst]
Bron: eerste-doelgroep.md

### 2. Waardepropositie
...

## Wat nog niet aansluit
```

## Regels

- Stel vragen één voor één en wacht op antwoord.
- Geef suggesties of voorbeelden alleen ter inspiratie. Het canvas is van de eigenaar.
- Wat niet uit de repo of van de eigenaar komt, benoem je als aanname.

## Daarna

Het canvas is de basis voor stap 5 van level 5: de sectie "Over mijn onderneming" in `AGENTS.md`, waarin staat wie de klanten zijn, wat de eigenaar verkoopt en voor welke prijs.
