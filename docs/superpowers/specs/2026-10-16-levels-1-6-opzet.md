# Ondernemen met AI: opzet level 1 tot en met 6

Datum: 16 oktober 2026 · Status: eerste opzet, om op te reageren · Bouwt voort op de spec van 15 oktober (`2026-10-15-klikbare-demo-design.md`)

Level 0 tot en met 2 zijn uitgewerkt in de spec van 15 oktober. Dit document zet level 1 tot en met 6 naast elkaar. Per level staat erin: het doel en de mijlpaal, de stappen en waar je ze doet, de bestanden in de repo, de checks waarmee het level af is, de skills van de AI, het ene nieuwe begrip en waar je heen en weer gaat. Level 1 en 2 blijven zoals ze zijn; daar staat alleen wat er verandert. Platformcode zit er niet bij.

## Herkomst

Bij elke keuze staat waar hij vandaan komt:

- *Bron: …* staat in de bronnen (afkortingen hieronder).
- *Voorstel* is nieuw in dit document en nog niet besproken.

| Afkorting | Waar |
|---|---|
| Spec | `docs/superpowers/specs/2026-10-15-klikbare-demo-design.md` |
| Besluit | de besluiten uit de sessie over de visuele intro en level 0 |
| Stappenplan | `context/Stappenplan naar ondernemerschap/Stappenplan naar Ondernemerschap.png` |
| Levensfasemodel | `context/Stappenplan naar ondernemerschap/Stappenplan naar Ondernemerschap utigebreid op levensfasemodel.png` |
| Launch path | `context/Stappenplan naar ondernemerschap/Startup Launch Path met AI-tools.pdf`: 9 GPT's en de deliverables per fase |
| GPT 01–09 | `context/gpt-instructies/` |
| Workshop … | `context/Inhoudelijke details/`, met de naam van de workshop |
| Reader | `context/Mogelijke stappen : modellen/reader/`: reader ORM jaar 2 van Avans, met de Spark-casus |

`context/` staat niet in git. De paden kloppen in de hoofdcheckout van Harmen.

## Overzicht

| Level | Naam | Mijlpaal (levensfasemodel) | Jij doet buiten | Je AI maakt | Nieuw begrip | Af als |
|---|---|---|---|---|---|---|
| 1 | Idee | Start: jouw idee | — | feedback op je idee en je propositie | Ophalen (pull) | 4 bestanden ingevuld, minstens 3 aannames, 2 feedbackbestanden |
| 2 | Probleem-validatie | 1. Een eerste doelgroep die allemaal hetzelfde probleem ervaart | 5 (B2B) of 15 (B2C) interviews | interviewvragen, transcripts, analyse | Skill | zoals nu, plus `eerste_doelgroep: ja` |
| 3 | Prototype | 2. Product/solution fit | je MVP laten zien aan minstens 3 mensen | waardepropositie, VPC, MVP-keuze, de digitale delen van je MVP | Geschiedenis | propositie, MVP en 3 reacties in de repo |
| 4 | Markt feedback | 3. Commitment: je doelgroep wil kopen, tegen dezelfde prijs | je test uitvoeren en toezeggingen ophalen | testkaart, resultaatkaart, aanpassing van je MVP | Pull request | 3 (B2B) of 10 (B2C) commitments, 1 gemergde pull request |
| 5 | Product-validatie | 4. Product/market fit: eerste klanten zijn fan | leveren en klanten om feedback vragen | productkeuze, Business Model Canvas | AGENTS.md | klantfeedback, minstens de helft fan, BMC, AGENTS.md aangevuld |
| 6 | Lancering | 5. Herhaalbaar verkoopproces · 6. Business/market fit | verkopen | gespreksvoorbereiding, pijplijn, cashflow, impact scan | Eigen skill | 5 (B2B) of 20 (B2C) betalende klanten, eigen skill, cashflow, impact |

- De mijlpalen van level 2 tot en met 4 horen bij levensfase 1 (Customer Discovery), die van level 5 en 6 bij levensfase 2 (Customer Validation). *(Bron: Levensfasemodel)*
- Tussen level 1 en 2, en tussen level 4 en 5, ga je heen en weer. Dat staat in het routebeeld op de welkomstpagina, niet op de levelkaart. *(Bron: Besluit)*
- De aantallen in de laatste kolom zijn een voorstel. Zie open vraag 3.

## Wat voor alle levels geldt

### Vijf plekken op de stapkaart

Elke stapkaart zegt waar je de stap doet *(Bron: Besluit)*. Er zijn vijf plekken. De vijfde, Buiten, is een voorstel.

- **Platform**: een formulier, uploadvak of uitleg hier.
- **GitHub**: github.com in je browser.
- **GitHub Desktop**: commit, push en later branches.
- **AI-app**: Claude Code of Codex.
- **Buiten**: bij je doelgroep. Praten, testen en verkopen doe je zelf.

### Templates en skills komen als het level opengaat

Het platform zet de templates en skills van een level in de repo zodra dat level opengaat. De AI haalt ze op met de pull-regel uit `AGENTS.md`. *(Voorstel)*

Drie redenen:

1. Je repo laat alleen zien waar je nu aan werkt. Op dag 1 staan er geen zes levelmappen.
2. Je AI begint niet aan level 5 terwijl je in level 2 zit.
3. Past Harmen een template of skill aan, dan krijgt een groep die al loopt die nieuwe versie. Nu is de starter-repo een template: na "Use this template" komen wijzigingen niet meer bij de deelnemer aan.

Gevolg: in `AGENTS.md` komt één algemene regel in plaats van de lijst met skills: "Lees in `skills/` de frontmatter van elk `SKILL.md`." Zie open vraag 1.

### Elke AI-stap eindigt in GitHub Desktop

Je AI legt vast met een commit, jij zet het online met Push origin. Pas dan ziet het platform de wijziging en wordt de check groen. Elke kaart met een AI-stap eindigt daarom met die regel. *(Bron: `AGENTS.md`, "de eigenaar pusht via GitHub Desktop" · regel op de kaart: voorstel)*

### Eén begrip per level, in een pop-up

Het begrip van een level staat in een pop-up op de stap waar je het voor het eerst nodig hebt, zoals "Waarom een repo en geen gedeelde map?" in level 0. *(Bron: Besluit, één begrip per level · pop-up: voorstel)*

| Level | Begrip | Pop-up op de stap |
|---|---|---|
| 0 | repo, commit, push | (bestaat) |
| 1 | Ophalen (pull) | Laat je AI je propositie toetsen |
| 2 | Skill | Formuleer je interviewvragen |
| 3 | Geschiedenis | Bouw je MVP |
| 4 | Pull request | Pas je MVP aan met een pull request |
| 5 | AGENTS.md | Vertel je AI wie je onderneming is |
| 6 | Eigen skill | Maak van je verkoopproces een skill |

De lijn: in level 1 tot en met 3 gebruik je wat er is, vanaf level 4 bepaal je zelf hoe je AI werkt.

### Aantallen volgen B2B of B2C

`doelgroep.md` heeft al `type` en `interviews_nodig`. Latere levels lezen dezelfde `type` voor hun aantallen en krijgen een eigen veld om dat aan te passen. *(Bron: Spec, `interviews_nodig` · uitbreiding: voorstel)*

### Teruggaan sluit niets af

De checks kijken naar de inhoud van de repo. Pas je na de interviews je madlib aan, dan blijft level 1 af. Wordt een check later toch rood, bijvoorbeeld omdat een nieuwe analyse `eerste_doelgroep: nee` zegt, dan blijft het level erna open en krijgt het eerdere level een markering op de levelkaart. *(Voorstel)*

### Privacy zoals in level 2

Reacties, commitments, klantfeedback en verkoopgesprekken krijgen een rol en initialen, nooit een volledige naam. Contactgegevens horen niet in de repo. De sales funnel uit de bronnen heeft een kolom "Contactgegevens"; die blijft in je telefoon of je mail. *(Bron: Spec, AVG · uitbreiding naar level 3 tot en met 6: voorstel)*

### Nieuwe checktypes

Naast `fileFilled`, `minListItems`, `minFilledFiles` en `minMergedPullRequests` zijn er vijf nodig *(Voorstel)*:

- `fileExists`: het bestand staat er. Voor feedbackbestanden en je eigen skill.
- `frontmatterFilled`: deze velden hebben een waarde. Voor de testkaart.
- `frontmatterIs`: dit veld heeft deze waarde. Voor `eerste_doelgroep: ja`.
- `anyFileIn`: de map bevat minstens één bestand, van welk type ook. Voor je MVP (html, pdf, foto).
- `sectionFilled`: onder deze kop staat tekst. Voor de nieuwe sectie in `AGENTS.md`.

## Level 1: Idee

**Doel:** idee, visie en een eerste versie van je waardepropositie. *(Bron: Stappenplan)*
**Mijlpaal:** start: jouw idee, jouw passie, "ik wil ondernemen". *(Bron: Levensfasemodel)*

**Blijft:** de stappen idee, visie, madlib, aannames met label en de toets met `propositie-validator`, met de checks uit de spec.

**Aanpassen:**

| # | Stap | Waar | In je repo (`level-1-idee/`) | Herkomst |
|---|---|---|---|---|
| 0 | Nog geen idee? (optioneel, over te slaan) | AI-app | `ideeen.md`: drie richtingen | Bron: GPT 01, Launch path "Start" · optionele kaart: voorstel |
| 1 | Zet je idee uiteen | Platform | `idee.md` | Spec |
| 2 | Laat je AI je idee toetsen | AI-app | `feedback-idee.md` | Bron: Launch path, "Idee Validator" in stap 1; CLAUDE.md, open punt eigen Idee Validator · plek in de route: voorstel |
| 3 | Formuleer je visie | Platform | `visie.md` | Spec |
| 4 | Je waardepropositie in één zin | Platform | `madlib.md` | Spec |
| 5 | Markeer je aannames | Platform | `aannames.md` | Spec |
| 6 | Laat je AI je propositie toetsen | AI-app | `feedback-propositie.md` | Spec; de skill schrijft dit bestand al |

**Checks:** zoals nu, plus `fileExists` voor `feedback-idee.md` en `feedback-propositie.md`. Nu telt de toets niet mee voor het level; zo wel. *(Voorstel)*

**Skills:**

- `propositie-validator`: bestaat, gebaseerd op GPT 03.
- `idee-generator`: nieuw, overgezet uit GPT 01. Twee paden: vanuit iets wat je vaak ziet of ervaart, of vanuit trends. De trendtabel in de GPT heet "macrotrends 2025" en moet bijgewerkt worden. De doorverwijzing naar de Startup Validator van M J HALL vervalt. *(Bron: GPT 01)*
- `idee-validator`: nieuw, eigen versie. Inhoud volgens de stijl van de andere GPT's *(Bron: CLAUDE.md)*: leest `idee.md`, stelt vragen één voor één, toetst of het probleem bestaat (wanneer zag je het voor het laatst?), wie het heeft (wie kun je morgen bellen?) en waarom jij. Sluit af met de checkvraag uit GPT 01: "Stel dat je dit idee morgen zou testen: wat zou je dan willen zien gebeuren bij een echte gebruiker?" Verwijst door naar visie en madlib. *(Inhoud: voorstel)*

**Nieuw begrip: ophalen (pull).** In level 1 schrijft het platform voor het eerst bestanden naar GitHub terwijl je AI op je computer werkt. Bij de toets zegt je AI: "Ik heb idee.md, visie.md, madlib.md en aannames.md opgehaald." De pop-up "Wat haalde mijn AI op?" legt uit: wat je op het platform invult, komt op GitHub; je AI haalt het naar je computer. Na commit en push uit level 0 is dit de derde beweging. *(Bron: pull-regel in `starter-repo/AGENTS.md` op branch `claude/bold-diffie-859712`, nog niet in `feat/klikbare-demo` · pop-up en moment: voorstel)*

**Itereren:** tussen 1 en 2. Na de interviews werk je `madlib.md` en `aannames.md` bij; zie level 2.

## Level 2: Probleem-validatie

**Doel:** je doelgroep en hun klantprobleem ontdekken. *(Bron: Stappenplan)*
**Mijlpaal 1:** een eerste doelgroep die allemaal hetzelfde probleem ervaart. *(Bron: Levensfasemodel)*

**Blijft:** de vijf stappen, het gestructureerde interview van 8 vragen, 5 interviews bij B2B en 15 bij B2C, de uploadvakken en de skills `interviewhulp`, `transcriberen` en `interview-analyse`.

**Waar per stap:** doelgroep op het Platform · interviewvragen in de AI-app · interviewen Buiten · transcripts op het Platform (upload) of in de AI-app (`transcriberen`) · analyse in de AI-app.

**Aanpassen:**

1. **De mijlpaal wordt een keuze in `analyse.md`.** Frontmatter `eerste_doelgroep: ja` of `nee`, met één zin over welke groep. Nu gaat level 3 open zodra `analyse.md` is ingevuld, ook als de conclusie "nee" is. Bij `nee` toont het platform drie routes terug: een andere doelgroep (`doelgroep.md`), meer interviews, of je idee bijstellen in level 1. *(Bron: de mijlpaalvraag staat al in `interview-analyse`, stap 5 · frontmatter en check: voorstel)*
2. **Aannames krijgen een status.** `interview-analyse` vergelijkt al met `aannames.md` (stap 6). Voortaan schrijft hij de uitkomst erbij: `[wens] Apotheken willen bezorging uitbesteden: ontkracht (1 van 5)`. Zo zie je in level 1 wat de interviews veranderden. *(Voorstel)*
3. **Een nieuwe ronde telt opnieuw.** Kies je een andere doelgroep, dan zet je AI de oude interviews in `interviews/ronde-1/`. De check telt alleen bestanden direct in `interviews/`, dus de teller begint weer bij 0. *(Voorstel; werkt met de huidige `mdFilesIn`)*
4. **Het repo-paneel toont geen pull requests meer tot level 4.** Nu staat er "0 gemergde pull requests". *(Bron: overdrachtsnotitie review-minors · oplossing: voorstel)*

De value proposition canvas staat in de launch path bij de deliverables van fase 1 en 2. Hij komt in de eerste stap van level 3, omdat hij leunt op `analyse.md`. *(Bron: Launch path · plek: voorstel)*

**Checks:** zoals nu, plus `frontmatterIs` voor `eerste_doelgroep: ja`.

**Skills:** de drie bestaande. `transcriberen` wordt in level 3 en 5 breder ingezet.

**Nieuw begrip: skill.** In level 2 gebruik je drie skills. De pop-up "Wat is een skill?" bij de interviewvragen: een skill is een bestand in `skills/` met een vaste werkwijze, en je AI leest het als je erom vraagt. Open `skills/interviewhulp/SKILL.md` op GitHub en je leest precies wat je AI gaat doen. *(Voorstel)*

**Itereren:** tussen 1 en 2 *(Bron: Besluit)*. Bij `eerste_doelgroep: nee` of ontkrachte [wens]-aannames ga je terug naar je madlib of je doelgroep en doe je een nieuwe interviewronde.

## Level 3: Prototype

**Doel:** ideeën genereren en een eerste demo of MVP maken, en die naar je eerste doelgroep brengen. *(Bron: Stappenplan, Launch path)*
**Mijlpaal 2:** product/solution fit: de beste oplossing voor het probleem van je eerste doelgroep. *(Bron: Levensfasemodel)*

De vraag die door het level loopt: "Waarom ga je niet morgen de markt op?" *(Bron: Workshop MVP-ontwikkeling, GPT 06)*

| # | Stap | Waar | In je repo (`level-3-prototype/`) | Herkomst |
|---|---|---|---|---|
| 1 | Scherp je waardepropositie aan | AI-app | `waardepropositie.md`, `vpc.md` | Bron: GPT 05 (14 vragen en invultekst), Launch path (VPC als deliverable), Reader H1.7 · VPC in deze stap: voorstel |
| 2 | Waarom ga je niet morgen de markt op? | Platform | `risicos.md`: minstens 3 bezwaren, elk met label [wens], [haalbaar] of [rendabel] | Bron: Workshop MVP-ontwikkeling, opdracht 2 ("minimaal je 3 grootste bezwaren"); Workshop Experiment design · formulier: voorstel |
| 3 | Kies je MVP | AI-app | `mvp.md`: type, welke aanname het test, waarom dit type | Bron: GPT 06 (minstens 3 opties met bron, gedrag boven intentie), `Types MVP Guide.pdf` (15 types), `MVP.pdf` (betrouwbaarheidsladder) |
| 4 | Bouw je MVP | AI-app en zelf | `mvp/`: de MVP zelf, of foto's en een link | Bron: Workshop MVP-ontwikkeling, opdracht "Bouw een MVP en verkoop 'm" · taakverdeling: voorstel |
| 5 | Laat je MVP zien aan je eerste doelgroep | Buiten, daarna Platform (upload) | `reacties/NN-rol.md`, minstens 3 | Bron: Launch path, doel fase 3; Workshop MVP-ontwikkeling, stap 3 · aantal en format: voorstel |

- **Stap 1.** Ongeveer de helft van de 14 vragen staat al in de repo: doelgroep, kernactiviteit, alternatief en klacht (uit `analyse.md`), en de niche (uit `eerste_doelgroep`). De skill vult die in en vraagt alleen de rest, zoals periode, worst-case, voordeel, impact en marktgrootte. Daarna zet hij dezelfde inhoud in een VPC: customer jobs, pains en gains tegenover producten, pain relievers en gain creators.
- **Stap 2.** Jij denkt eerst zelf na, op het platform. Daarna gebruikt je AI deze bezwaren als risico-scan in stap 3.
- **Stap 4.** Je AI bouwt wat digitaal kan: een landingspagina, een klikbaar prototype, een flyer, een pitchtekst of een bestelformulier voor een paper sale. Jij regelt wat fysiek is of mensen vraagt, zoals een concierge-MVP waarin je de dienst met de hand levert.
- **Stap 5.** Per gesprek: wat liet je zien, wat deed iemand (gedrag), herkende diegene het probleem, wat vroeg hij of zij. Upload werkt zoals bij de transcripts, of je AI zet aantekeningen om met `transcriberen`.

**Checks:** `waardepropositie.md`, `vpc.md` en `mvp.md` ingevuld · `risicos.md` minstens 3 bezwaren · `mvp/` minstens één bestand (`anyFileIn`) · `reacties/` minstens 3 ingevuld. *(Voorstel)*

**Skills:**

- `waardepropositie-bouwer`: nieuw, overgezet uit GPT 05. Let op: de GPT heeft niet-gepubliceerde wijzigingen; de tekst in `context/` is het concept. Het knowledge-bestand "Formuleren Waardepropositie.pdf" is vermoedelijk `Formuleren Value Proposition.pdf` in `context/`, met dezelfde 14 vragen.
- `mvp-kiezen`: nieuw, overgezet uit GPT 06, sessie 1 tot en met 3 (obstakelvraag, risico-scan, experimentopties). De Test Card-wizard uit dezelfde GPT gaat naar level 4.
- `transcriberen`: bestaat, krijgt een tweede format voor reacties.

**Nieuw begrip: geschiedenis.** Je MVP verandert na elk gesprek. Elke commit is een versie. In GitHub Desktop zie je onder History wat er per versie veranderde, en je kunt terug naar een eerdere versie. Zo durf je te proberen. *(Bron: reden 2 in de repo-pop-up van level 0, "git bewaart elke versie" · moment: voorstel)*

**Itereren:** binnen het level, tussen stap 3 en 5. Past de oplossing niet bij het probleem, dan kies je een ander MVP. *(Bron: `MVP.pdf`: "If your assumption is sinking, abandon it.")*

## Level 4: Markt feedback

**Doel:** feedback van je doelgroep ophalen en je MVP aanpassen. *(Bron: Stappenplan)*
**Mijlpaal 3:** commitment: je doelgroep wil kopen, en voor dezelfde prijs. *(Bron: Levensfasemodel)*

| # | Stap | Waar | In je repo (`level-4-marktfeedback/`) | Herkomst |
|---|---|---|---|---|
| 1 | Bepaal je prijs | Platform | `prijs.md`: prijs, per wat, geschatte kostprijs | Bron: mijlpaal 3, "tegen dezelfde prijs"; Workshop Financiële haalbaarheid, vraag 1 en 2 · formulier: voorstel |
| 2 | Maak je testkaart | AI-app | `testkaarten/01-naam.md`: hypothese, test-opzet, metriek, succesdrempel, tijd en sample | Bron: GPT 06 (Test Card-wizard), Workshop Experiment design (testbaar, nauwkeurig, discreet), Launch path (testplan) |
| 3 | Ga de markt op | Buiten, daarna Platform | `commitments.md`: per toezegging rol, initialen, wat, bedrag, datum | Bron: GPT 06 (paper sale, pre-order, concierge) · lijst: voorstel |
| 4 | Lees je resultaat | AI-app | `resultaten/01-naam.md`: resultaatkaart met besluit | Bron: GPT 07 (Result Card, persevere/pivot/kill); Workshop Onderzoek, wat heb je geleerd (bewijskracht en vertrouwensmeter) |
| 5 | Pas je MVP aan met een pull request | AI-app, daarna GitHub Desktop en GitHub | een wijziging in `level-3-prototype/`; 1 gemergde pull request | Bron: Besluit, de pull request komt in een later level · level 4: voorstel |

- **Stap 2.** De testkaart toetst je riskantste aanname, met je prijs erin. Normen uit GPT 06: minstens 5 kwalitatieve of 50 kwantitatieve gevallen, hooguit 5 dagen, en een succesdrempel "waarmee je durft door te bouwen". De vijf blokken staan als frontmatter in het bestand, zodat het platform ze kan controleren. De launch path zet het testplan bij fase 3. Het komt hier, omdat je het in dit level uitvoert.
- **Stap 3.** Een commitment is gedrag: een aanbetaling, een pre-order, een getekende intentieverklaring of een ingevuld bestelformulier. "Ik zou het kopen" telt niet. *(Bron: GPT 06 en 07, verkoopgedrag boven gedragsproxy boven intentie)*
- **Stap 4.** De resultaatkaart volgt de vijf blokken van GPT 07: gemeten waarde, vergelijking met de drempel, observaties, verrassingen en conclusie. Frontmatter: `conclusie: succes | faal | onduidelijk`, `besluit: doorgaan | bijsturen | stoppen` en `vertrouwen` van 0 tot 100 uit het bewijskracht-werkblad.
- **Stap 5.** Je AI maakt een branch en legt de aanpassing daarop vast. In GitHub Desktop klik je Publish branch en Create Pull Request. Op GitHub lees je onder Files changed wat er verandert en klik je Merge pull request. In `AGENTS.md` staat vanaf het begin: "Bestaat `level-4-marktfeedback/`, werk dan via een branch en een pull request." Het platform hoeft `AGENTS.md` dan niet aan te passen. *(Voorstel)*

**Checks:** `prijs.md` ingevuld · minstens 1 testkaart met alle vijf velden (`frontmatterFilled`) · minstens 1 resultaatkaart met een besluit · `commitments.md` minstens 3 (B2B) of 10 (B2C) · minstens 1 gemergde pull request (`minMergedPullRequests`, bestaat al). *(Voorstel)*

**Skills:**

- `testkaart`: nieuw, overgezet uit GPT 06, sessie 4 en 5 (Test Card-wizard, actieplan met datum en eigenaar).
- `resultaatkaart`: nieuw, overgezet uit GPT 07. Bij "bijsturen" begint hij een nieuwe testkaart met skill `testkaart`. In de GPT's verwijzen 06 en 07 naar elkaar met een link naar het oude domein `chat.openai.com`; in de repo verwijzen ze naar elkaar met de naam van de skill.

**Nieuw begrip: pull request.** "De AI stelt voor, ik keur goed." Voor het eerst verandert je AI iets wat je al gemaakt hebt: je MVP en je propositie, op basis van wat de markt zei. Een pull request laat regel voor regel zien wat er verandert, en jij beslist. *(Bron: Besluit, de gewoonte · level 4: voorstel)*

**Itereren:** binnen het level loop je testkaart, markt op, resultaatkaart, tot je drempel aan commitments haalt. Bij "bijsturen" komt er een nieuwe testkaart (`02-…`, `03-…`). Daarnaast tussen 4 en 5 *(Bron: Besluit)*; zie level 5.

## Level 5: Product-validatie

**Doel:** een basisproduct ontwikkelen voor je eerste klanten. *(Bron: Stappenplan)*
**Mijlpaal 4:** product/market fit: een basisproduct waar je eerste klanten fan van zijn. *(Bron: Levensfasemodel)*

| # | Stap | Waar | In je repo (`level-5-productvalidatie/`) | Herkomst |
|---|---|---|---|---|
| 1 | Bepaal wat in je basisproduct komt | AI-app | `product.md`: wat erin zit en welk bewijs ervoor pleit, en wat er bewust niet in zit | Bron: Stappenplan · vorm: voorstel |
| 2 | Lever aan je eerste klanten | Buiten | — | Bron: Stappenplan, Launch path |
| 3 | Vraag je klanten wat ze ervan vinden | Buiten, daarna Platform (upload) | `klanten/NN-rol.md`: gebruik, wat werkt, wat mist, `fan: ja` of `nee` | Voorstel; "fan" gemeten aan gedrag volgens GPT 06 en 07 |
| 4 | Breng je businessmodel in kaart | AI-app | `bmc.md`: 9 bouwstenen, elk met het bestand waar het vandaan komt | Bron: GPT 08; `Vragen Business Model Canvas.pdf`; Workshop Businessmodel in kaart (SBMC) · bronbestand per bouwsteen: voorstel |
| 5 | Vertel je AI wie je onderneming is | AI-app, daarna pull request | sectie "Over mijn onderneming" in `AGENTS.md` | Voorstel |

- **Stap 1.** Je eerste klanten zijn de mensen uit `commitments.md`. Wat in het basisproduct komt, volgt uit hun toezeggingen, je resultaatkaarten en de reacties uit level 3.
- **Stap 3.** Iemand is fan als het gedrag dat laat zien: diegene koopt opnieuw, raadt je aan of gebruikt het elke week. "Leuk" telt niet.
- **Stap 4.** GPT 08 vraagt alle 9 bouwstenen één voor één uit. In de repo staat al veel: klantsegmenten in `doelgroep.md` en `analyse.md`, de waardepropositie in level 3, inkomstenstromen in `prijs.md` en `commitments.md`. De skill vult dat in en vraagt alleen naar kanalen, klantrelaties, partners, middelen, activiteiten en kosten. Hij controleert of de blokken op elkaar aansluiten, zoals GPT 08 doet. De twee extra blokken van het Sustainable Business Model Canvas (ecologische en sociale kosten en baten) zijn optioneel.

**Checks:** `product.md` en `bmc.md` ingevuld · `klanten/` minstens 3 (B2B) of 10 (B2C) ingevuld · minstens de helft met `fan: ja` · sectie "Over mijn onderneming" in `AGENTS.md` gevuld (`sectionFilled`). *(Voorstel)*

**Skills:**

- `bmc`: nieuw, overgezet uit GPT 08. Het knowledge-bestand "Hulpvragen Business Model Canvas.pdf" is vermoedelijk `Vragen Business Model Canvas.pdf` in `context/`.
- `transcriberen`: bestaat, krijgt een derde format voor klantfeedback.

**Nieuw begrip: AGENTS.md.** Tot nu toe volgde je AI de instructies van Morgen. Nu je bedrijf staat, schrijf je erbij wie je klanten zijn, wat je verkoopt en voor welke prijs. Elke sessie begint je AI daarmee. Dat gaat via een pull request, zoals je in level 4 leerde. *(Voorstel)*

**Itereren:** tussen 4 en 5 *(Bron: Besluit)*. Is minder dan de helft fan, of mist er iets wezenlijks, dan ga je terug naar level 4: een nieuwe testkaart voor de aanpassing, daarna weer leveren. Level 4 blijft af; nieuwe testkaarten komen erbij.

## Level 6: Lancering

**Doel:** je eerste echte klanten. *(Bron: Stappenplan)* "En voor je het weet heb je betalende klanten." *(Bron: Launch path)*
**Mijlpalen 5 en 6:** een herhaalbaar en schaalbaar verkoopproces, en business/market fit: vooruitzicht op een positieve cashflow. *(Bron: Levensfasemodel)*

| # | Stap | Waar | In je repo (`level-6-lancering/`) | Herkomst |
|---|---|---|---|---|
| 1 | Bereid je verkoopgesprek voor | AI-app | `verkoopgesprek.md`: de beslissers (DMU), je opening, vragen per fase, tegenwerpingen en je afsluitvraag | Bron: Workshop Verkoopgesprekken (VACATIO, SPIN, DMU); `Sales Workshop Intro.pdf` |
| 2 | Verkoop | Buiten, daarna Platform | `pijplijn.md`: per klant de fase en de waarde | Bron: `Heel simple sales funnel (1).xlsx`: vijf fases van contact gelegd (10%) tot opdracht (100%) |
| 3 | Maak van je verkoopproces een skill | AI-app, daarna pull request | `skills/verkoopproces/SKILL.md` | Voorstel; koppelt "herhaalbaar" uit mijlpaal 5 aan een skill |
| 4 | Reken je cashflow door | Platform, daarna AI-app | `financieel.md`: kostprijs, verkoopprijs, verkoop per maand, vaste kosten, en de maand waarin je cashflow positief wordt | Bron: Workshop Financiële haalbaarheid (6 vragen, met TAM SAM SOM); `Basis financieel.pdf`; `Financiering.pdf` (middelen voor 2 jaar vooruit); `Financial model template simplified.xlsx` |
| 5 | Maak je impact zichtbaar | AI-app | `impact.md`: per kapitaal doel, activiteit en resultaat | Bron: GPT 09; Workshop Inzicht in impact |

- **Stap 1.** VACATIO is de volgorde van het gesprek: verkenning, analyse, confrontatie, argumentatie, tegenwerpingen, instemming, order. In de verkenning gebruik je SPIN: situatie-, probleem-, implicatie- en nuttig-effectvragen.
- **Stap 2.** Na elk gesprek zet je de klant een fase verder, op het platform of via je AI. De pijplijn rekent de gewogen waarde uit, zoals de funnel uit de bronnen. Geen contactgegevens in de repo.
- **Stap 3.** Je AI schrijft de skill uit wat in `verkoopgesprek.md` en `pijplijn.md` staat: hoe je leads vindt, hoe je een gesprek voorbereidt, wanneer je een offerte stuurt en hoe je opvolgt.
- **Stap 4.** Je vult de getallen zelf in op het platform. Je AI zet ze in een model voor 12 maanden en laat zien wanneer je cashflow positief wordt en hoeveel geld je nodig hebt om twee jaar vooruit te kunnen.
- **Stap 5.** Zes kapitalen: financieel, geproduceerd, intellectueel, menselijk, sociaal en natuurlijk. Per kapitaal ook de fase in de volwassenheidsmatrix.

Losse kaarten zonder check, over te slaan *(Bron: de workshops · als losse kaarten: voorstel)*:

- Rechtsvorm en inschrijving (Workshop Rechtsvormen).
- Juridische aspecten van online handel (Workshop Week 5, Juridische aspecten van online handel).
- Je pitch (Workshop Pitchen en storytelling).

**Checks:** `verkoopgesprek.md` ingevuld · in `pijplijn.md` minstens 5 (B2B) of 20 (B2C) klanten in de fase "opdracht" · `skills/verkoopproces/SKILL.md` bestaat, met `name` en `description` · `financieel.md` met `positieve_cashflow_vanaf` ingevuld · `impact.md` ingevuld. *(Voorstel)*

**Skills:**

- `verkoopgesprek`: nieuw, uit de workshop Verkoopgesprekken. Er is geen GPT voor.
- `cashflow`: nieuw, uit de workshop Financiële haalbaarheid. Leest `prijs.md`, `commitments.md` en `pijplijn.md`.
- `impact-scan`: nieuw, overgezet uit GPT 09. De GPT-instructies zijn Engels en beloven een PDF-export terwijl Code Interpreter uit staat. In de repo maakt de AI een Markdown-bestand; een PDF kan later. Het knowledge-bestand is Engels ("Impact Scan - EN.xlsx"); in `context/` staat de Nederlandse `Inkijk in Impact Scan.xlsx`.
- `verkoopproces`: je eigen skill, gemaakt in stap 3.

**Nieuw begrip: je eigen skill.** Herhaalbaar betekent: elke keer dezelfde stappen. Een skill legt die stappen vast. Vanaf nu bereidt je AI elk gesprek op dezelfde manier voor en werkt hij de pijplijn bij. In level 2 las je een skill van Morgen; nu schrijf je er zelf een.

**Itereren:** binnen het level. Blijven klanten in dezelfde fase hangen, dan pas je die stap in je skill aan. Na level 6 volgt de vervolgmodule met stap 7 tot en met 12 van het levensfasemodel. *(Bron: Spec)*

## Skills op een rij

| Skill | Level | Herkomst | Status |
|---|---|---|---|
| `idee-generator` | 1 (optioneel) | GPT 01 | nieuw, overgezet |
| `idee-validator` | 1 | eigen versie, open punt in CLAUDE.md | nieuw te schrijven |
| `propositie-validator` | 1 | GPT 03 | bestaat |
| `interviewhulp` | 2 | GPT 04 | bestaat |
| `transcriberen` | 2, 3, 5 | Spec | bestaat; formats voor reacties en klantfeedback erbij |
| `interview-analyse` | 2 | Workshop Interviews | bestaat; schrijft voortaan de status in `aannames.md` |
| `waardepropositie-bouwer` | 3 | GPT 05 | nieuw, overgezet |
| `mvp-kiezen` | 3 | GPT 06, sessie 1–3 | nieuw, overgezet |
| `testkaart` | 4 | GPT 06, sessie 4–5 | nieuw, overgezet |
| `resultaatkaart` | 4 | GPT 07 | nieuw, overgezet |
| `bmc` | 5 | GPT 08 | nieuw, overgezet |
| `verkoopgesprek` | 6 | Workshop Verkoopgesprekken | nieuw |
| `cashflow` | 6 | Workshop Financiële haalbaarheid | nieuw |
| `impact-scan` | 6 | GPT 09 | nieuw, overgezet |
| `verkoopproces` | 6 | de deelnemer | eigen skill van de deelnemer |

- Met deze lijst staan alle acht eigen GPT's als skill in de repo. Ze werken in Claude Code en in Codex. De GPT's zelf, voor wie zonder platform met de launch path-PDF werkt, verdwijnen na 11 december als ze niet gemigreerd zijn. *(Bron: GPT-README · zie open vraag 6)*
- Vijf GPT's gebruiken knowledge-bestanden. Die komen als referentiebestand in de map van de skill; het Agent Skills-formaat ondersteunt dat. `MVP.pdf`, `Types MVP Guide.pdf`, `Formuleren Value Proposition.pdf`, `Vragen Business Model Canvas.pdf` en `Inkijk in Impact Scan.xlsx` staan in `context/`. Uit het boek *Businessideeën testen* nemen we niets over; de skills verwijzen naar de paginanummers. *(Voorstel)*

## Open vragen voor Harmen

1. **Mag het platform bij het openen van een level templates en skills in de repo zetten?** Dan bereiken aanpassingen ook groepen die al bezig zijn, en blijft de repo klein. Het verandert wel de starter-repo en `AGENTS.md`.
2. **Komt de pull request in level 4?** Daar past je AI voor het eerst iets aan wat je al gemaakt hebt. Level 3 kan ook, als je AI daar je MVP bouwt, maar dan gaat het vooral om nieuwe bestanden.
3. **Kloppen de aantallen?** Voorstel: 3 reacties in level 3; commitments 3 (B2B) of 10 (B2C); klantfeedback 3 of 10 waarvan de helft fan; betalende klanten 5 of 20. Zijn die haalbaar in de looptijd van een training?
4. **Mogen de mijlpalen poorten worden?** `eerste_doelgroep: ja` in level 2, de helft fan in level 5, positieve cashflow in zicht in level 6. De deelnemer vult ze zelf in; een trainer kan meekijken.
5. **Krijgt de eigen idee-validator een eigen stap direct na je idee**, zoals in de launch path vóór de propositie-validator? Of komt hij samen met de propositie-validator in één toets aan het eind van level 1?
6. **Blijven de GPT's na 11 december bestaan naast de skills?** Dat raakt iedereen die nu met de launch path-PDF werkt, ook buiten het platform.
7. **Horen pitch, rechtsvorm en juridische check als losse kaarten in level 6**, of in de vervolgmodule?
