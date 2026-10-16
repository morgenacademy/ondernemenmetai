# Ondernemen met AI: opzet level 1 tot en met 6

Datum: 16 oktober 2026 · Status: vijfde versie, na vier reactierondes van Harmen · Bouwt voort op de spec van 15 oktober (`2026-10-15-klikbare-demo-design.md`)

Level 0 tot en met 2 zijn uitgewerkt in de spec van 15 oktober. Dit document zet level 1 tot en met 6 naast elkaar. Per level staat erin: de vraag, wanneer het level klaar is, de mijlpaal, de stappen en waar je ze doet, de bestanden in de repo, de skills van de AI, het ene nieuwe begrip en waar je heen en weer gaat. Platformcode zit er niet bij.

## Herkomst

Bij elke keuze staat waar hij vandaan komt:

- *Bron: …* staat in de bronnen (afkortingen hieronder).
- *Harmen* komt uit de reacties van Harmen op eerdere versies (16 oktober).
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
| Bijlage | het overzicht van de reader in drie fasen en zes stappen, door Harmen meegestuurd op 16 oktober |

`context/` staat niet in git. De paden kloppen in de hoofdcheckout van Harmen.

## Wanneer is een level klaar?

Een level is klaar als alle stappen af zijn; pas dan gaat het volgende open *(Harmen)*. Elk level draait om één kern: het resultaat in de tabel hieronder *(Harmen)*. De checks van alle stappen staan verderop per level. *(Checks: voorstel)*

| Level | Kern | Check op de kern |
|---|---|---|
| 0 Werkplek | je werkplek is ingericht | `setup.md` en `werkplek.md` ingevuld (bestaat al). `werkplek.md` staat pas op GitHub als je hebt gepusht, dus de check laat ook zien dat commit en push werken. |
| 1 Idee | je madlib staat en de eerste versie van je waardepropositie is ingevuld, zoals in GPT 03 | `madlib.md` en `vpc.md` ingevuld |
| 2 Probleem-validatie | je hebt je 'eerste' doelgroep ontdekt die allemaal hetzelfde probleem ervaart. Daarvoor heb je je interviews gedaan, geanalyseerd en er een conclusie uit getrokken. | minstens 5 (B2B) of 15 (B2C) interviews in `interviews/`, `analyse.md` ingevuld, en `gevonden: ja` in `eerste-doelgroep.md` |
| 3 Prototype | je hebt een MVP die je kunt laten zien | `oplossing.md` ingevuld en minstens één bestand in `mvp/` |
| 4 Markt feedback | je hebt van genoeg mensen feedback op je MVP | minstens 3 (B2B) of 10 (B2C) bestanden in `feedback/` met een `antwoord` |
| 5 Product-validatie | je hebt een product waarvan je zegt: hier ga ik voor. Je bestelt meer, laat produceren of gaat nu echt verkopen. | `product.md` met `besluit: ik ga ervoor` en de onderbouwing uit je rondes |
| 6 Lancering | je blijkt een klant te hebben. Dat kan op elk moment. | minstens 1 betalende klant in `klanten.md` |

- **Alle stappen tellen.** Elke stap heeft een eigen check. Een stap die buiten gebeurt, zoals interviewen of de markt op gaan, telt via het bestand dat eruit komt. Alleen de kaart "Nog geen idee?" in level 1 en de losse kaarten zijn vrij. *(Harmen)*
- **Level 6 is de uitzondering.** Op het platform staat vanaf level 1 een knop "Ik heb een klant". Die zet de klant in `klanten.md`, en level 6 gaat open, ook als level 4 of 5 nog niet af is. Je eerste klant kan op elk moment komen. Level 6 zelf is klaar als ook de stappen daarin af zijn. *(Harmen: "elk moment" · knop: voorstel)*
- **Gekocht is de beste feedback**, maar in de eerste ronde van level 4 gebeurt dat zelden. Gebeurt het wel, dan was je misschien te laat met de markt op. *(Harmen)*

## Besloten op 16 oktober

1. **Het platform zet templates en skills in de repo als een level opengaat.** Hoe we de deelnemer daarin meenemen, staat nog open; zie "Een skill in één zin".
2. **De aantallen zijn het uitgangspunt.** Aanscherpen kan later.
3. **Level 6 is Proof of Concept: je eerste betalende klant.** Schaalbaar verkopen en positieve cashflow (mijlpaal 6) horen bij module 2.
4. **De eigen idee-validator gaat er voorlopig uit.** Wel een agendapunt.
5. **Binnen dit platform gebruiken we de GPT's niet.** Hun instructies worden skills in de repo. Na 11 december verdwijnen de GPT's, dus we sturen er ook niemand meer heen. Hoe skills buiten het platform worden verspreid, is een ander project.
6. **Pitch, rechtsvorm, juridisch, financieel en team worden losse kaarten.** Voorlopig als placeholder; vorm en beeld volgen.
7. **De opbouw van level 1 tot en met 4:**
   - Level 1: je idee kort in een madlib, daarna een eerste waardepropositie vol aannames.
   - Level 2: interviews, analyse met hulp van je AI, en als benoemd resultaat je eerste doelgroep die allemaal hetzelfde probleem ervaart.
   - Level 3: oplossingen zoeken door te divergeren en te convergeren, tot je er één kiest, en daar een MVP van maken.
   - Level 4: met je MVP terug naar je mensen voor feedback.
8. **De pull request komt in level 2, bij het bijwerken van je canvas na de interviews.**
9. **Interviews komen per stuk in je repo, zonder pull request. Je eigen AI zet ze om, het platform niet.** Een spraakdienst aan het platform hangen kost te veel bij zo'n 100 deelnemers per kwartaal. Het platform toont 5 (B2B) of 15 (B2C) vakken die afvinken zodra een interview in je repo staat.
10. **Brainwriting in level 3 doe je in een training met medecursisten.** Wie alleen werkt, bedenkt zelf en laat de AI aanvullen.
11. **Level 4 en 5 zijn een lus.** Je gaat terug naar dezelfde mensen met je MVP. Bij nee vraag je waarom, je ontwikkelt door, en je komt terug, tot je een product hebt waar je voor gaat. Onderweg ontdek je hoe je verkoopt.
12. **De AI in de cloud vervalt.** Voor de route is hij niet nodig.
13. **Een level is klaar als alle stappen af zijn.** Elk level heeft een kern, zoals in de tabel "Wanneer is een level klaar?". Level 6 gaat open zodra je een klant hebt.
14. **Level 5 vraagt minstens één ronde na het doorontwikkelen.** De check wil twee resultaatkaarten zien. Akkoord voor nu.
15. **De deelnemer leert dat de repo op twee plekken staat**: op de computer en op GitHub. Het plaatje groeit per level, en "Is alles in sync?" aan je AI vragen is altijd genoeg.

## Hoe de modellen op elkaar passen

De vier modellen volgen dezelfde lijn: eerst het probleem, dan de oplossing, dan bewijs. Ze verschillen vooral in hoe ver ze doorlopen.

| Level | Stappenplan | Levensfasemodel | Bijlage (reader) | Launch path: GPT → skill |
|---|---|---|---|---|
| 1 Idee | Idee, visie, eerste versie waardepropositie | Start: jouw idee | uit stap 1: Mad Lib, Value Proposition Canvas | Idee Generator → `idee-generator`; Proposition Validator → `propositie-validator` |
| 2 Probleem-validatie | Doelgroep en klantprobleem ontdekken | 1. Eerste doelgroep die allemaal hetzelfde probleem ervaart | fase 1: stap 1 Klant en markt leren kennen, stap 2 Probleem in kaart brengen | Interview Assistent → `interviewhulp` |
| 3 Prototype | Idee generatie en MVP | 2. Product/solution fit | fase 2: stap 3 Oplossingen bedenken, stap 4 Prototype en actieonderzoek | Proposition Builder → `waardepropositie-bouwer`; Demo/MVP Ontwerper → `mvp-kiezen` |
| 4 Markt feedback | Feedback van je doelgroep, MVP aanpassen | 3. Commitment tegen dezelfde prijs | fase 3: stap 5 Testen, feedback en uitwerken | Demo/MVP Ontwerper → `testkaart`; Result & Iteratie → `resultaatkaart` |
| 5 Product-validatie | Basisproduct voor eerste klanten | 4. Product/market fit (en 3, in de lus met level 4) | uit stap 6: Business Model Canvas | Result & Iteratie → `verbeteren`; BMC Generator → `bmc` |
| 6 Lancering | Je eerste echte klanten | Proof of Concept; begin van 5. herhaalbaar verkoopproces | uit stap 6: meervoudige waarde, pitch | Impact Scan → `impact-scan` |
| Module 2 | — | 5. schaalbaar · 6. Business/market fit · 7–12 | — | — |

Waar ze verschillen:

- **De reader stopt eerder.** Het is een blok van 7 weken met een opdrachtgever, dat eindigt met een portfolio en een eindpresentatie. Inhoudelijk loopt hij tot ons level 4. De BMC, de impact en de pitch komen daar als opleverdocumenten; wij gebruiken ze in level 5 en 6, waar je echt levert en verkoopt.
- **De VPC groeit in drie levels.** De reader vult in stap 1 de klantkant van de VPC (jobs, pains, gains) en in stap 3 de aanbodkant voor de gekozen oplossing (value proposition fit). Bij ons: een eerste canvas vol aannames in level 1, de klantkant bijgewerkt met de interviews in level 2, de aanbodkant voor je gekozen oplossing in level 3. *(Bron: Reader H1 §7 en H3 §7; Harmen)*
- **De reader test al in stap 4.** Daar staan de test card en "uitgevoerde test en een besluit". Bij ons maak je in level 3 je MVP; in level 4 ga je ermee terug naar je mensen.
- **Het levensfasemodel zet commitment (3) vóór product/market fit (4).** In de praktijk lopen ze door elkaar: je doet een voorstel, hoort nee en waarom, ontwikkelt door en komt terug. Daarom haal je mijlpaal 3 en 4 in de lus tussen level 4 en 5. *(Harmen)*
- **De reader heeft meer instrumenten voor de klant**, zoals de empathy map en de Business Model Environment. Die laten we weg om level 2 kort te houden. `doelgroep.md` dekt de stakeholders al: gebruiker, betaler en beslisser.

## Overzicht

Elk level krijgt een vraag, zoals de stappen in de bijlage. *(Bron: Bijlage · voorstel)*

| Level | Vraag | Mijlpaal | Jij doet buiten | Je AI maakt | Nieuw begrip |
|---|---|---|---|---|---|
| 1 Idee | Wat is mijn idee, en wat neem ik daarbij aan? | Start: jouw idee | — | de toets van je propositie en je canvas | Ophalen (pull) |
| 2 Probleem-validatie | Wie is mijn eerste klant, en welk probleem hebben ze allemaal? | 1. Eerste doelgroep met hetzelfde probleem | 5 (B2B) of 15 (B2C) interviews | interviewbestanden, analyse, bijgewerkt canvas | Pull request |
| 3 Prototype | Welke oplossing past het best bij dat probleem? | 2. Product/solution fit | oplossingen bedenken, met anderen | keuze uit je oplossingen, madlib en canvas voor je oplossing, de digitale delen van je MVP | Geschiedenis |
| 4 Markt feedback | Wat vinden ze van mijn MVP, en willen ze het tegen mijn prijs? | 3. Commitment (je haalt hem in de lus met level 5) | je mensen terugbellen, laten proberen, je voorstel doen | testkaart, een spiekbriefje per persoon, resultaatkaart | Je repo als geheugen |
| 5 Product-validatie | Wat moet er beter, tot ik er echt voor ga? | 3. Commitment en 4. Product/market fit | terugkomen met een betere versie | verbeteringen uit de redenen van nee, productkeuze, Business Model Canvas | AGENTS.md |
| 6 Lancering | Ik heb een klant. Wat nu? | Proof of Concept | verkopen | je verkoopaanpak als skill, pijplijn, impact scan | Eigen skill |

Tussen level 1 en 2, en tussen level 4 en 5, ga je heen en weer. Dat staat in het routebeeld op de welkomstpagina, niet op de levelkaart. *(Bron: Besluit)*

## Wat voor alle levels geldt

### Vijf plekken op de stapkaart

Elke stapkaart zegt waar je de stap doet *(Bron: Besluit)*. Er zijn vijf plekken. De vijfde, Buiten, is een voorstel.

- **Platform**: een formulier, uploadvak of uitleg hier.
- **GitHub**: github.com in je browser.
- **GitHub Desktop**: commit, push en branches.
- **AI-app**: Claude Code of Codex.
- **Buiten**: bij je doelgroep. Praten, testen en verkopen doe je zelf.

### Templates en skills komen als het level opengaat

Het platform zet de templates en skills van een level in de repo zodra dat level opengaat. Je AI haalt ze op met de pull-regel uit `AGENTS.md`. *(Harmen: besloten)*

- Je repo laat alleen zien waar je nu aan werkt.
- Je AI begint niet aan level 5 terwijl je in level 2 zit.
- Past Harmen een template of skill aan, dan krijgt een groep die al loopt die nieuwe versie.

In `AGENTS.md` komt één algemene regel in plaats van de lijst met skills: "Lees in `skills/` de frontmatter van elk `SKILL.md`." *(Voorstel)*

### Een skill in één zin

Op elke kaart met een AI-stap staat welke skill je AI gebruikt en wat die doet, in één zin, met een link naar het `SKILL.md` op GitHub. Bijvoorbeeld: "Je AI gebruikt hier skill `propositie-validator`: hij stelt je vijf vragen, zet je antwoorden in één zin en toetst die met twaalf kritische vragen." Wie wil, leest de skill; wie niet wil, hoeft niets te weten. Wat een skill precies is, leer je in level 6, als je er zelf een schrijft. *(Voorstel, op de vraag van Harmen hoe we de deelnemer meenemen)*

### Twee plekken: je computer en GitHub

Je repo staat op twee plekken. Op GitHub kijkt het platform mee; op je computer werkt je AI. Wie dat niet snapt, snapt ook niet waarom de opname wel op je computer staat en niet op GitHub, of waarom het platform een interview nog niet ziet. *(Harmen)*

Het plaatje groeit per level met één ding *(Voorstel)*:

| Level | Wat erbij komt | Uitleg op de kaart |
|---|---|---|
| 0 | clone, commit, push | Clonen zet een kopie van je repo op je computer. Commit legt een versie vast op je computer, push zet hem op GitHub. *(Bron: staat al in level 0)* |
| 1 | pull | Wat je op het platform invult, komt op GitHub. Pull haalt het naar je computer. Je AI doet dat aan het begin van elke sessie zelf. |
| 2 | een map die alleen op je computer staat, en merge | `opnames/` staat in `.gitignore`: git slaat hem over, dus hij komt nooit op GitHub. Bij de pull request voeg je met Merge het zijspoor samen met je repo. Ook een pull voegt samen; dat doet git meestal zelf, en lukt het niet, dan legt je AI uit wat er speelt. |

Wat staat waar:

| Alleen op je computer | Alleen op GitHub, tot je AI het ophaalt | Op allebei |
|---|---|---|
| `opnames/`, en wat je AI net maakte maar jij nog niet pushte | wat je op het platform invulde | de rest, na push en pull |

Je hoeft dit niet te onthouden. Vraag je AI: "Is alles in sync?" of "Staat mijn interview al in de repo?" Je AI antwoordt in één zin: wat nog alleen op je computer staat, wat nog op GitHub klaarstaat, en wat bewust op je computer blijft. Die regel komt in `AGENTS.md`. *(Harmen · regel: voorstel)*

### Drie manieren waarop iets in je repo komt

1. **Het platform schrijft het direct op GitHub.** Zo komen formulieren erin. Je hoeft niets te doen.
2. **Je AI legt vast, jij pusht in GitHub Desktop.** Zo komt wat je AI op je computer maakt erin, zoals een interview, een analyse of een testkaart. Pas na Push origin ziet het platform het en wordt de check groen.
3. **Een pull request.** Je AI zet een wijziging op een zijspoor (een branch). Jij bekijkt hem op GitHub; pas na Merge pull request telt hij mee.

Een pull request is dus geen manier om iets binnen te krijgen. Het is een controle voordat een wijziging meetelt, en die is alleen nodig als je AI iets aanpast wat jij hebt gekozen. Daarom staat vanaf level 2 in `AGENTS.md` *(Harmen: pull request in level 2 · regel: voorstel)*:

- **Jouw keuzes, via een pull request:** idee, visie, madlib, canvas, aannames, doelgroep, gekozen oplossing, prijs, je MVP en je product, `AGENTS.md`.
- **Materiaal en uitwerkingen, direct:** interviews, feedback, analyses, testkaarten, resultaatkaarten, BMC, klanten, pijplijn.

De regel geldt zodra de map `level-2-probleemvalidatie/` bestaat, dus het platform hoeft `AGENTS.md` niet aan te passen.

### Dezelfde mensen door de route

Vaak bel je in level 4 en 5 dezelfde mensen die je in level 2 interviewde: "Weet je nog, je zei dat je hier tegenaan loopt. Ik heb misschien iets voor je." *(Harmen)* Zo houden we dat bij *(Voorstel)*:

- Elk interview krijgt een nummer en een rol: `01-apotheker`. Dat nummer blijft. Bestanden over dezelfde persoon in latere levels hebben `persoon: 01-apotheker` in de frontmatter. Nieuwe mensen krijgen het volgende vrije nummer.
- Het interview sluit af met: "Mag ik je bellen als ik iets heb wat hierbij helpt?" Het antwoord staat als `terugbellen: ja` of `nee` in het interviewbestand. Telefoonnummers en e-mailadressen blijven buiten de repo.
- Je AI bereidt elk vervolggesprek voor met wat diegene eerder zei.
- Het platform toont per persoon wanneer je diegene sprak en wat het antwoord was.

### Eén begrip per level

Het begrip van een level staat in een pop-up op de stap waar je het voor het eerst nodig hebt, zoals "Waarom een repo en geen gedeelde map?" in level 0. *(Bron: Besluit, één begrip per level · pop-up: voorstel)*

| Level | Begrip | Pop-up op de stap |
|---|---|---|
| 1 | Ophalen (pull) | Maak de eerste versie van je waardepropositie |
| 2 | Pull request | Werk je canvas bij |
| 3 | Geschiedenis | Verwoord je oplossing |
| 4 | Je repo als geheugen | Bereid je terugbelgesprekken voor |
| 5 | AGENTS.md | Vertel je AI wie je onderneming is |
| 6 | Eigen skill | Leg vast hoe je verkocht |

Level 1 tot en met 3 maken drie van de vier redenen uit de pop-up van level 0 waar: het platform kan meekijken, je kunt eerst nakijken, je ziet terug wat je AI deed. De vierde, de AI in de cloud, is voor de route niet nodig. Vanaf level 4 bepaal je steeds meer zelf hoe je AI werkt.

### Aantallen volgen B2B of B2C

`doelgroep.md` heeft al `type` en `interviews_nodig`. Latere levels lezen dezelfde `type` voor hun aantallen en krijgen een eigen veld om dat aan te passen. *(Bron: Spec · uitbreiding: voorstel · aantallen: Harmen, uitgangspunt)*

### Teruggaan sluit niets af

De checks kijken naar de inhoud van de repo. Werk je na de interviews je madlib bij, dan blijft level 1 klaar. Wordt een check later toch rood, dan blijft het level erna open en krijgt het eerdere level een markering op de levelkaart. *(Voorstel)*

### Privacy

- Feedback en klanten krijgen een rol en initialen, nooit een volledige naam. Contactgegevens horen niet in de repo. *(Bron: Spec, AVG · uitbreiding: voorstel)*
- Opnames en ruwe transcripts blijven op je computer, in de map `opnames/`. Die staat in `.gitignore`, dus git ziet hem niet. Je AI leest daaruit en zet alleen het interview zonder namen in `interviews/`. Zo staat er ook in de git-geschiedenis nooit een naam of een stem. *(Bron: Spec, "audio blijft lokaal" · map `opnames/`: voorstel)*
- Voor het opnemen vraag je toestemming. Die zin staat al in skill `interviewhulp`.

### Nieuwe checktypes

Naast `fileFilled`, `minListItems`, `minFilledFiles` en `minMergedPullRequests` zijn er vijf nodig *(Voorstel)*:

- `frontmatterIs`: dit veld heeft deze waarde. Voor `gevonden: ja` en `besluit: ik ga ervoor`.
- `frontmatterFilled`: deze velden hebben een waarde, eventueel in minstens zoveel bestanden in een map. Voor de testkaart, de resultaatkaart en de feedback in level 4.
- `anyFileIn`: de map bevat minstens één bestand, van welk type ook. Voor je MVP (html, pdf, foto).
- `fileExists`: het bestand staat er. Voor `feedback-propositie.md` en je eigen skill.
- `sectionFilled`: onder deze kop staat tekst. Voor de sectie "Over mijn onderneming" in `AGENTS.md`.

## Level 1: Idee

**Vraag:** wat is mijn idee, en wat neem ik daarbij aan?
**Kern:** je madlib staat en de eerste versie van je waardepropositie is ingevuld, zoals in GPT 03. *(Harmen)*
**Doel:** idee, visie en een eerste versie van je waardepropositie. *(Bron: Stappenplan)*
**Mijlpaal:** start: jouw idee, jouw passie, "ik wil ondernemen". *(Bron: Levensfasemodel)*

Level 1 blijft kort. *(Harmen)*

| # | Stap | Waar | In je repo (`level-1-idee/`) | Herkomst |
|---|---|---|---|---|
| 0 | Nog geen idee? (optioneel, over te slaan) | AI-app | `ideeen.md`: drie richtingen | Bron: GPT 01, Launch path "Start" · optionele kaart: voorstel |
| 1 | Zet je idee uiteen | Platform | `idee.md` | Spec |
| 2 | Formuleer je visie | Platform | `visie.md` | Spec |
| 3 | Je idee in één zin | Platform | `madlib.md` | Spec |
| 4 | Markeer je aannames | Platform | `aannames.md` | Spec |
| 5 | Maak de eerste versie van je waardepropositie | AI-app | `madlib.md` aangescherpt, `feedback-propositie.md`, `vpc.md` | Harmen; Bron: GPT 03, Reader H1 §7 (canvas) |

- **Stap 5.** Je AI volgt GPT 03: vijf vragen (naam, aanbod, doelgroep, probleem, USP), je antwoorden in de madlib, daarna twaalf reflectievragen over je oplossing, het probleem en je klant. Jij scherpt aan. De actiepunten komen in `feedback-propositie.md`. Je AI sluit af met je canvas in `vpc.md`: klantkant (jobs, pains, gains) en aanbodkant (producten, pain relievers, gain creators), met bij elke regel "(aanname)". Die aannames toets je in level 2. *(Bron: GPT 03 · canvas aan het eind: voorstel)*

**Checks:** `idee.md`, `visie.md`, `madlib.md` en `vpc.md` ingevuld · `aannames.md` minstens 3 aannames · `feedback-propositie.md` bestaat (`fileExists`). De kern: `madlib.md` en `vpc.md`. *(Voorstel)*

**Skills:**

- `propositie-validator`: bestaat, gebaseerd op GPT 03. Schrijft aan het eind ook `vpc.md`. De buddy-check uit de reader kan erbij: kort en zonder containerbegrippen, doelgroep afgebakend, probleem relevant, oplossing sluit aan op het probleem. *(Bron: Reader H3 §7 · toevoegingen: voorstel)*
- `idee-generator`: nieuw, overgezet uit GPT 01. De trendtabel ("macrotrends 2025") moet bijgewerkt worden, en de doorverwijzing naar de Startup Validator vervalt. *(Bron: GPT 01)*

**Nieuw begrip: ophalen (pull).** In level 1 schrijft het platform voor het eerst bestanden naar GitHub terwijl je AI op je computer werkt. Bij stap 5 zegt je AI: "Ik heb idee.md, visie.md, madlib.md en aannames.md opgehaald." De pop-up "Wat haalde mijn AI op?" legt uit: wat je op het platform invult, komt op GitHub; je AI haalt het naar je computer. De pop-up toont het plaatje met de twee plekken, en de vraag die altijd werkt: "Is alles in sync?" *(Bron: pull-regel in `starter-repo/AGENTS.md` op branch `claude/bold-diffie-859712`, nog niet in `feat/klikbare-demo` · pop-up: voorstel)*

**Itereren:** tussen 1 en 2. In level 2 werkt je AI je canvas en je aannames bij met wat de interviews lieten zien.

## Level 2: Probleem-validatie

**Vraag:** wie is mijn eerste klant, en welk probleem hebben ze allemaal? *(Bron: Bijlage, stap 1)*
**Kern:** je je 'eerste' doelgroep hebt ontdekt die allemaal hetzelfde probleem ervaart. Daarvoor heb je je interviews gedaan, geanalyseerd en er een conclusie uit getrokken. *(Harmen; Bron: Bijlage, stap 2 "gevalideerde probleemstelling")*
**Doel:** je doelgroep en hun klantprobleem ontdekken. *(Bron: Stappenplan)*
**Mijlpaal 1:** een eerste doelgroep die allemaal hetzelfde probleem ervaart. *(Bron: Levensfasemodel)*

**Blijft:** de doelgroep met B2B of B2C, het gestructureerde interview van 8 vragen, 5 interviews bij B2B en 15 bij B2C, en de skills `interviewhulp`, `transcriberen` en `interview-analyse`.

| # | Stap | Waar | In je repo (`level-2-probleemvalidatie/`) | Herkomst |
|---|---|---|---|---|
| 1 | Bepaal je doelgroep | Platform | `doelgroep.md` | Spec |
| 2 | Formuleer je interviewvragen | AI-app | `interviewvragen.md` | Spec |
| 3 | Interview je doelgroep | Buiten | — | Spec |
| 4 | Zet je interviews in je repo | AI-app, daarna GitHub Desktop | `interviews/NN-rol.md` | Spec; per interview, met je eigen AI: Harmen |
| 5 | Analyseer je interviews | AI-app | `analyse.md`, `eerste-doelgroep.md` | Spec; `eerste-doelgroep.md`: Harmen, voorstel |
| 6 | Werk je canvas bij | AI-app, daarna GitHub Desktop en GitHub | wijzigingen in `level-1-idee/vpc.md` en `aannames.md`, via een pull request | Harmen |

- **Stap 3.** Het interview sluit af met de terugbelvraag (zie "Dezelfde mensen door de route").
- **Stap 4.** Na elk interview zet je de opname of het transcript in de map `opnames/` op je computer. Je vraagt je AI: "Gebruik skill transcriberen. Zet het nieuwe interview in opnames/ om." Je AI haalt de namen eruit, deelt het in volgens vraag 5 tot en met 8 en zet het als `interviews/NN-rol.md` in je repo. Jij pusht in GitHub Desktop; daarna krijgt het vak op het platform een vinkje. *(Harmen · uitwerking: voorstel)*
  - **Heb je al tekst?** Teams en Zoom maken zelf een transcript. Dat is de snelste route. Claude Code en Codex kunnen een tekstbestand omzetten naar een interviewbestand.
  - **Heb je alleen een opname?** Je AI installeert een spraakprogramma (zoals Whisper) op je computer en draait het; Claude Code en Codex luisteren zelf niet naar audio. Dat kost niets en de opname gaat de deur niet uit. Harmen laat Claude dit al vaak doen: een opname in een map, de vraag om er een transcript van te maken, en het .md-bestand staat er. *(Harmen)* Nog testen: Codex, Windows en oudere laptops.
  - `opnames/` staat in je repomap op je computer, maar git negeert hem. Je AI vindt de opname daar dus vanzelf, en hij komt nooit op GitHub. Dit is het moment waarop het plaatje van de twee plekken een map krijgt die alleen op je computer staat. Twijfel je of een interview al meetelt, vraag dan je AI: "Staat het in de repo?"
  - **Vertrouwelijk.** Zegt iemand in het gesprek dat iets vertrouwelijk is, dan zet je AI dat stuk tussen `VERTROUWELIJK: BEGIN` en `VERTROUWELIJK: EINDE`, met bovenaan het bestand een waarschuwing. Je AI mag het lezen voor de context, maar citeert of gebruikt het nergens, ook niet in de analyse. *(Harmen, uit eigen praktijk · in de skill: voorstel)*
  - De uploadvakken uit de demo vervallen voor ruwe tekst: wat het platform uploadt, staat direct op GitHub, ook de namen. De vakken blijven als voortgang, met de AI-opdracht als kopieerblok.
- **Stap 5.** Hier is je AI sterk: 5 tot 15 gesprekken naast elkaar leggen, patronen tellen en per patroon de citaten terugvinden *(Harmen)*. Het resultaat krijgt een eigen bestand, zodat het platform het als resultaat van het level kan tonen. `eerste-doelgroep.md` heeft frontmatter `gevonden: ja | nee`, `doelgroep` en `probleem`, en in de tekst het bewijs: hoeveel van de interviews, welke klachten steeds terugkomen, en de citaten. *(Voorstel)*
- **Stap 6.** Je AI zet bij elke regel in je canvas en bij elke aanname wat de interviews zeiden: bevestigd, ontkracht of open. Hij doet dat op een branch. In GitHub Desktop klik je Publish branch en Create Pull Request. Op GitHub zie je onder Files changed in rood wat sneuvelde en in groen wat erbij kwam. Daarna klik je Merge pull request. *(Harmen: besloten · uitwerking: voorstel)*

**Checks:** `doelgroep.md` en `interviewvragen.md` ingevuld · minstens 5 (B2B) of 15 (B2C) interviews in `interviews/` · `analyse.md` ingevuld · `gevonden: ja` in `eerste-doelgroep.md` (`frontmatterIs`) · minstens 1 gemergde pull request (`minMergedPullRequests`, bestaat al). De kern: je eerste doelgroep. *(Voorstel)*

**Skills:**

- `interviewhulp`: bestaat; de terugbelvraag komt erbij.
- `transcriberen`: bestaat; leest uit `opnames/`, met het veld `terugbellen` en de markering voor vertrouwelijke stukken. Vindt hij alleen audio, dan installeert hij een lokaal spraakprogramma; de skill zegt nu al dat audio nooit zonder toestemming naar een externe dienst gaat.
- `interview-analyse`: bestaat; schrijft voortaan ook `eerste-doelgroep.md` en werkt het canvas en de aannames bij via een pull request. De mijlpaalvraag staat al in de skill (stap 5), net als de vergelijking met de aannames (stap 6).

**Nieuw begrip: pull request.** "De AI stelt voor, ik keur goed." Je interviews en je analyse zijn nieuw; die komen direct in je repo. Je canvas en je aannames zijn van jou; daar stelt je AI wijzigingen voor, en jij beslist. De pull request laat zien wat de markt je leerde. *(Bron: Besluit, de gewoonte; pop-up level 0, reden 3 · level 2: Harmen)*

**Itereren:** tussen 1 en 2 *(Bron: Besluit)*. Bij `gevonden: nee` toont het platform drie routes terug: een andere doelgroep, meer interviews, of je idee bijstellen in level 1. Kies je een andere doelgroep, dan zet je AI de oude interviews in `interviews/ronde-1/`. De check telt alleen bestanden direct in `interviews/`, dus de teller begint weer bij 0. *(Voorstel; werkt met de huidige `mdFilesIn`)*

Het repo-paneel toont het aantal pull requests pas vanaf level 2. Nu staat er al in level 0 "0 gemergde pull requests". *(Bron: overdrachtsnotitie review-minors · oplossing: voorstel)*

## Level 3: Prototype

**Vraag:** welke oplossing past het best bij dat probleem? *(Bron: Bijlage, stap 3)*
**Kern:** je een MVP hebt die je kunt laten zien. *(Harmen)*
**Doel:** ideeën genereren en een eerste demo of MVP maken. *(Bron: Stappenplan, Launch path)*
**Mijlpaal 2:** product/solution fit: de beste oplossing voor het probleem van je eerste doelgroep. *(Bron: Levensfasemodel)*

Eerst breed, dan kiezen *(Harmen: divergeren en convergeren)*. Daarna de vraag: "Waarom ga je niet morgen de markt op?" *(Bron: Workshop MVP-ontwikkeling, GPT 06)*

| # | Stap | Waar | In je repo (`level-3-prototype/`) | Herkomst |
|---|---|---|---|---|
| 1 | Bedenk oplossingen | Buiten (met medecursisten) of zelf, daarna Platform | `oplossingen.md`: minstens 10 ideeën | Harmen; Bron: Reader H3 §2 en §3 (How Might We, brainwriting 6-3-5, SCAMPER); Workshop Creatieve brainstormtechnieken · aantal: voorstel |
| 2 | Waardeer en kies je oplossing | AI-app | `oplossing.md`: de gekozen oplossing, waarom, en wat afviel | Harmen; Bron: Reader H3 §6 en Bijlage stap 3 (wenselijk, haalbaar, levensvatbaar; impact/effort-matrix) |
| 3 | Verwoord je oplossing | AI-app, via een pull request | `madlib.md` en `vpc.md` bijgewerkt, `waardepropositie.md` nieuw | Bron: Bijlage ("Mad Lib als value proposition"), Reader H3 §7 (value proposition fit), GPT 05 |
| 4 | Kies je MVP | AI-app | `mvp.md`: je drie grootste bezwaren, de riskantste aanname, het MVP-type en waarom | Bron: Workshop MVP-ontwikkeling (opdracht 2: "minimaal je 3 grootste bezwaren"), GPT 06, `Types MVP Guide.pdf`, Reader H4 (prototype-ladder) |
| 5 | Bouw je MVP | AI-app en zelf | `mvp/`: de MVP zelf, of foto's en een link | Bron: Workshop MVP-ontwikkeling ("Bouw een MVP en verkoop 'm") · taakverdeling: voorstel |

- **Stap 1.** Het platform zet de How Might We-vraag klaar uit `eerste-doelgroep.md`: "Hoe kunnen we [doelgroep] helpen met [probleem]?" In een training doe je brainwriting 6-3-5 met medecursisten; wie alleen werkt, bedenkt zelf en laat de AI in stap 2 aanvullen *(Harmen)*. Daarna vul je je ideeën in op het platform.
- **Stap 2.** Je AI vult aan met varianten (SCAMPER) en groepeert. Daarna waardeer je elk idee, bijvoorbeeld met de impact/effort-matrix of langs wenselijk, haalbaar en levensvatbaar; andere manieren kunnen ook *(Harmen)*. Je AI legt elk idee naast de pains en gains die in level 2 bevestigd zijn. Jij kiest.
- **Stap 3.** Je madlib krijgt een nieuwe versie voor je gekozen oplossing, en je canvas een nieuwe aanbodkant. Omdat dit jouw keuzes zijn, gaat het via een pull request. `waardepropositie.md` is de langere tekst uit GPT 05; ongeveer de helft van de 14 vragen staat al in je repo.
- **Stap 4.** Een MVP is klaar zodra hij je kritieke aanname kan toetsen. Begin onderaan de prototype-ladder: een schets gaat voor een app. *(Bron: Reader H4)*
- **Stap 5.** Je AI bouwt wat digitaal kan: een landingspagina, een klikbaar prototype, een flyer of een bestelformulier. Jij regelt wat fysiek is of mensen vraagt, zoals een concierge-MVP waarin je de dienst met de hand levert.

Een MVP maken is de grootste stap van de route. Hoe we dat ondersteunen, vullen we nog in. Er is al materiaal: de workshop MVP-ontwikkeling, `Types MVP Guide.pdf`, *Businessideeën testen*, en rapid prototyping met AI. *(Harmen)*

**Checks:** `oplossingen.md` minstens 10 ideeën · `oplossing.md`, `waardepropositie.md` en `mvp.md` ingevuld · minstens één bestand in `mvp/` (`anyFileIn`). De kern: je MVP. *(Voorstel)*

**Skills:**

- `oplossing-kiezen`: nieuw. Gebaseerd op de reader (H3) en de workshop Creatieve brainstormtechnieken. Er is geen GPT voor.
- `waardepropositie-bouwer`: nieuw, overgezet uit GPT 05. De GPT heeft niet-gepubliceerde wijzigingen; de tekst in `context/` is het concept. Het knowledge-bestand is vermoedelijk `Formuleren Value Proposition.pdf` in `context/`, met dezelfde 14 vragen.
- `mvp-kiezen`: nieuw, overgezet uit GPT 06, sessie 1 tot en met 3. De Test Card-wizard uit dezelfde GPT gaat naar level 4.

**Nieuw begrip: geschiedenis.** Je madlib en je canvas hebben nu drie versies: je eerste idee (level 1), na de interviews (level 2) en voor je gekozen oplossing (level 3). In GitHub Desktop zie je onder History per versie wat er veranderde, en je kunt terug naar een eerdere versie. *(Bron: pop-up level 0, reden 2 · moment: voorstel)*

**Itereren:** binnen het level. Blijkt bij het bouwen dat je MVP de kritieke aanname niet kan toetsen, dan ga je terug naar stap 4. *(Bron: `MVP.pdf`: "If your assumption is sinking, abandon it.")*

## Level 4: Markt feedback

**Vraag:** wat vinden ze van mijn MVP, en willen ze het tegen mijn prijs?
**Kern:** je van genoeg mensen feedback hebt op je MVP. *(Harmen)*
**Doel:** feedback van je doelgroep ophalen. *(Bron: Stappenplan)*
**Mijlpaal 3:** commitment: je doelgroep wil kopen, en voor dezelfde prijs. *(Bron: Levensfasemodel)* Je haalt hem in de lus met level 5. *(Harmen)*

Je gaat met je MVP terug naar de mensen die je interviewde: "Weet je nog, je zei dat je hier tegenaan loopt. Ik heb misschien iets voor je." *(Harmen)*

| # | Stap | Waar | In je repo (`level-4-marktfeedback/`) | Herkomst |
|---|---|---|---|---|
| 1 | Bepaal je prijs | Platform | `prijs.md`: prijs, per wat, geschatte kostprijs | Bron: mijlpaal 3; Workshop Financiële haalbaarheid, vraag 1 en 2 · formulier: voorstel |
| 2 | Maak je testkaart | AI-app | `testkaarten/ronde-1.md`: wat verwacht je van deze ronde, bijvoorbeeld "3 van de 5 zeggen ja tegen €40 per maand" | Bron: GPT 06 (Test Card-wizard), Workshop Experiment design (testbaar, nauwkeurig, discreet), Reader H5 (actionable metrics) |
| 3 | Bereid je terugbelgesprekken voor | AI-app | per persoon een spiekbriefje bovenaan `feedback/NN-rol.md` | Harmen · voorstel |
| 4 | Laat proberen en doe je voorstel | Buiten, daarna Platform | `feedback/NN-rol.md`: wat iemand probeerde en hoe lang, je voorstel, `antwoord: ja \| nee \| twijfel`, en waarom | Harmen; Bron: GPT 06 (gedrag boven intentie) |
| 5 | Lees je ronde | AI-app | `resultaten/ronde-1.md`: hoeveel ja, de redenen van nee op een rij, en je besluit | Bron: GPT 07 (Result Card, persevere/pivot/kill); Workshop Onderzoek, wat heb je geleerd (bewijskracht); Bijlage (learning card) |

- **Stap 2.** De testkaart legt vooraf vast wat je verwacht, zodat je achteraf niet goedpraat wat er gebeurde. Normen uit GPT 06: minstens 5 kwalitatieve of 50 kwantitatieve gevallen, en een succesdrempel "waarmee je durft door te bouwen". Meet wat mensen doen, zoals bestellingen of langer willen gebruiken; likes en bezoekers tellen niet. *(Bron: Reader H5)*
- **Stap 3.** Je AI zoekt in je interviews wie `terugbellen: ja` zei. Per persoon schrijft hij op wat diegene in level 2 vertelde over het huidige alternatief en de klachten, en welk deel daarvan je MVP oplost. Nieuwe mensen mogen er ook bij.
- **Stap 4.** Afhankelijk van je MVP laat je mensen het een tijd proberen, soms een maand. Een ja kan klinken als "dit wil ik wel", als "kan ik het blijven gebruiken?", of als ja op je vraag "wil je dit hebben, voor deze prijs?". Zeggen ze nee, vraag dan waarom niet. Dat antwoord is het belangrijkste wat je meeneemt. *(Harmen)* Een ja is gedrag: een aanbetaling, een pre-order, of langer willen gebruiken tegen je prijs. "Ik zou het kopen" telt niet. *(Bron: GPT 06 en 07)* Koopt iemand echt, dan zet je die klant met de knop "Ik heb een klant" in `klanten.md`.
- **Stap 5.** De resultaatkaart volgt de vijf blokken van GPT 07: gemeten waarde, vergelijking met de drempel, observaties, verrassingen en conclusie. Frontmatter: `besluit: doorgaan | doorontwikkelen | stoppen` en `vertrouwen` van 0 tot 100 uit het bewijskracht-werkblad.
- Op het platform staan al je testkaarten en resultaten op één bord, zoals het experiment board uit de bijlage. *(Bron: Bijlage · voorstel)*

**Checks:** `prijs.md` ingevuld · `testkaarten/ronde-1.md` met alle vijf blokken (`frontmatterFilled`) · minstens 3 (B2B) of 10 (B2C) bestanden in `feedback/` met een `antwoord` · `resultaten/ronde-1.md` met een besluit. De kern: feedback van genoeg mensen. *(Voorstel; aantal: uitgangspunt)*

**Skills:**

- `testkaart`: nieuw, overgezet uit GPT 06, sessie 4 en 5 (Test Card-wizard). Eén testkaart per ronde.
- `terugbellen`: nieuw. Maakt per persoon het spiekbriefje uit diens interview. *(Harmen · voorstel)*
- `resultaatkaart`: nieuw, overgezet uit GPT 07. In de GPT's verwijzen 06 en 07 naar elkaar met een link naar `chat.openai.com`; in de repo verwijzen de skills naar elkaar met hun naam.

**Nieuw begrip: je repo als geheugen.** Je AI weet nog wat 01-apotheker in level 2 zei, omdat het in je repo staat. Alles wat je vastlegt, kan hij later gebruiken: nu voor je terugbelgesprekken, in level 5 voor je verbeteringen, in level 6 voor je verkoopaanpak. *(Bron: Spec, "context verzamelen" als eerste waarde van AI · moment: voorstel)*

**Itereren:** tussen 4 en 5 *(Bron: Besluit; Harmen)*. Na een ronde ontwikkel je door in level 5 en kom je terug met ronde 2: een nieuwe testkaart (`ronde-2.md`), dezelfde mensen, en een nieuwe sectie "Ronde 2" in hun feedbackbestand.

## Level 5: Product-validatie

**Vraag:** wat moet er beter, tot ik er echt voor ga?
**Kern:** je een product hebt waarvan je zegt: hier ga ik voor. Je bestelt meer, laat produceren of gaat nu echt verkopen. *(Harmen)*
**Doel:** een basisproduct ontwikkelen voor je eerste klanten. *(Bron: Stappenplan)*
**Mijlpalen 3 en 4:** commitment tegen dezelfde prijs, en product/market fit: een basisproduct waar je eerste klanten fan van zijn. *(Bron: Levensfasemodel · beide in de lus met level 4: Harmen)*

Je pakt de feedback van je mensen op, ontwikkelt je MVP door, en gaat weer naar de markt: "En zo dan, dan wel?" *(Harmen)*

| # | Stap | Waar | In je repo (`level-5-productvalidatie/`) | Herkomst |
|---|---|---|---|---|
| 1 | Ontwikkel door op de feedback | AI-app, via een pull request | wijzigingen in je MVP; `product.md`: wat erin zit en welk bewijs ervoor pleit, en wat er bewust niet in zit | Harmen; Bron: Stappenplan, GPT 07 (minstens drie opties, jij kiest) |
| 2 | Ga terug naar de markt | Buiten, daarna Platform | een nieuwe ronde in level 4: testkaart, sectie in `feedback/NN-rol.md`, resultaatkaart | Harmen |
| 3 | Kies: ga je ervoor? | Platform | `besluit`, `volgende_stap` en onderbouwing in `product.md` | Harmen · formulier: voorstel |
| 4 | Breng je businessmodel in kaart | AI-app | `bmc.md`: 9 bouwstenen, elk met het bestand waar het vandaan komt | Bron: GPT 08; `Vragen Business Model Canvas.pdf`; Workshop Businessmodel in kaart (SBMC); Bijlage (stap 6) · bronbestand per bouwsteen: voorstel |
| 5 | Vertel je AI wie je onderneming is | AI-app, via een pull request | sectie "Over mijn onderneming" in `AGENTS.md` | Voorstel |

- **Stap 1.** Je AI zet alle redenen van nee uit je feedbackbestanden op een rij, koppelt ze aan de klachten uit level 2, en stelt per reden minstens drie aanpassingen voor. Jij kiest. Omdat het jouw product is, gaat het via een pull request.
- **Stap 2.** Stap 1 en 2 herhaal je zo vaak als nodig. De interviews uit level 2 vertelden wat er vervelend was aan het huidige alternatief; als jouw oplossing dat echt oplost, willen mensen hem hebben. *(Harmen)*
- **Stap 3.** `besluit: ik ga ervoor` of `nog niet`. Bij `ik ga ervoor` vul je in wat je nu doet: meer bestellen, laten produceren of echt verkopen. In de onderbouwing staat welk bewijs uit je rondes je over de streep trok; je AI vat het samen uit `feedback/` en `resultaten/`.
- **Stap 4.** GPT 08 vraagt alle 9 bouwstenen één voor één uit. In de repo staat al veel: klantsegmenten in `doelgroep.md` en `eerste-doelgroep.md`, de waardepropositie in `vpc.md` en `waardepropositie.md`, inkomstenstromen in `prijs.md` en de feedback. De skill vult dat in en vraagt alleen naar kanalen, klantrelaties, partners, middelen, activiteiten en kosten. Hij controleert of de blokken op elkaar aansluiten, zoals GPT 08 doet. De twee extra blokken van het Sustainable Business Model Canvas (ecologische en sociale kosten en baten) zijn optioneel.

**Checks:** `product.md` ingevuld, met `besluit: ik ga ervoor` (`frontmatterIs`) · minstens 2 resultaatkaarten in `level-4-marktfeedback/resultaten/`, dus minstens één ronde na het doorontwikkelen *(Harmen: akkoord voor nu)* · `bmc.md` ingevuld · sectie "Over mijn onderneming" in `AGENTS.md` gevuld (`sectionFilled`). De kern: je besluit. *(Voorstel)*

**Skills:**

- `verbeteren`: nieuw, gebaseerd op het deel "Na de Result Card" van GPT 07.
- `bmc`: nieuw, overgezet uit GPT 08. Het knowledge-bestand "Hulpvragen Business Model Canvas.pdf" is vermoedelijk `Vragen Business Model Canvas.pdf` in `context/`.
- `testkaart` en `resultaatkaart` uit level 4, voor elke nieuwe ronde.

**Nieuw begrip: AGENTS.md.** Tot nu toe volgde je AI de instructies van Morgen. Nu je product staat, schrijf je erbij wie je klanten zijn, wat je verkoopt en voor welke prijs. Elke sessie begint je AI daarmee. *(Voorstel)*

**Itereren:** tussen 4 en 5, tot je zegt: hier ga ik voor. *(Bron: Besluit; Harmen)* Level 4 blijft klaar; nieuwe rondes komen erbij.

## Level 6: Lancering

**Vraag:** ik heb een klant. Wat nu?
**Kern:** je een klant blijkt te hebben. Dat kan op elk moment. *(Harmen)*
**Doel:** je eerste echte klanten. *(Bron: Stappenplan)* "En voor je het weet heb je betalende klanten." *(Bron: Launch path)*
**Mijlpaal:** Proof of Concept *(Harmen; Bron: Reader H5 §4, "Van n=1 naar Proof-of-Concept")*. Je zet de eerste stap naar mijlpaal 5, een herhaalbaar verkoopproces, door vast te leggen hoe je verkocht. "Schaalbaar" en mijlpaal 6 (positieve cashflow) horen bij module 2. *(Harmen)*

Vaak heb je ineens per ongeluk een klant: iemand uit je interviews zag dat jouw oplossing beter is dan wat ze nu gebruiken, en nam het van je af. Hoe je het echt verkoopt, heb je onderweg al ontdekt. *(Harmen)*

| # | Stap | Waar | In je repo (`level-6-lancering/`) | Herkomst |
|---|---|---|---|---|
| 1 | Ik heb een klant | Platform, op elk moment | `klanten.md`: rol, initialen, wat, bedrag, datum | Harmen · knop: voorstel |
| 2 | Leg vast hoe je verkocht | AI-app, via een pull request | `skills/verkoopaanpak/SKILL.md` | Harmen ("gaandeweg ontdekt"); Bron: Workshop Verkoopgesprekken (VACATIO, SPIN, DMU) · skill: voorstel |
| 3 | Zet je volgende klanten in een pijplijn | Buiten, daarna Platform | `pijplijn.md`: per klant de fase en de waarde | Bron: `Heel simple sales funnel (1).xlsx`: vijf fases van contact gelegd (10%) tot opdracht (100%) |
| 4 | Maak je impact zichtbaar | AI-app | `impact.md`: per kapitaal doel, activiteit en resultaat | Bron: GPT 09; Workshop Inzicht in impact; Bijlage stap 6 (meervoudige waarde) |

- **Stap 1.** De knop "Ik heb een klant" staat vanaf level 1 op het platform. Gebruik je hem, dan licht level 6 op, ook als je nog in level 4 of 5 zit.
- **Stap 2.** Je AI haalt uit je feedbackbestanden wat werkte: welke opening, welk voorstel, welke bezwaren en wat je antwoordde. Hij zet dat in de volgorde van VACATIO: verkenning, analyse, confrontatie, argumentatie, tegenwerpingen, instemming, order. In de verkenning gebruik je SPIN-vragen: situatie, probleem, implicatie, nuttig effect. Daarna bereidt je AI elk gesprek met een nieuw iemand voor met je eigen skill.
- **Stap 3.** Na elk gesprek zet je de klant een fase verder. De pijplijn rekent de gewogen waarde uit, zoals de funnel uit de bronnen.
- **Stap 4.** Zes kapitalen: financieel, geproduceerd, intellectueel, menselijk, sociaal en natuurlijk. Per kapitaal ook de fase in de volwassenheidsmatrix.

**Checks:** minstens 1 betalende klant in `klanten.md` (`minListItems`, bestaat al) · `skills/verkoopaanpak/SKILL.md` bestaat, met `name` en `description` (`fileExists`) · `pijplijn.md` en `impact.md` ingevuld. De kern: je eerste klant. *(Voorstel)*

**Skills:**

- `verkoopgesprek`: nieuw, uit de workshop Verkoopgesprekken. Geeft de structuur waarmee je je eigen skill schrijft. Er is geen GPT voor.
- `impact-scan`: nieuw, overgezet uit GPT 09. De GPT-instructies zijn Engels en beloven een PDF-export terwijl Code Interpreter uit staat. In de repo maakt de AI een Markdown-bestand. Het knowledge-bestand is Engels ("Impact Scan - EN.xlsx"); in `context/` staat de Nederlandse `Inkijk in Impact Scan.xlsx`.
- `verkoopaanpak`: je eigen skill, gemaakt in stap 2.

**Nieuw begrip: je eigen skill.** Je AI gebruikte de hele route skills van Morgen. Nu schrijf je er zelf een. Herhaalbaar betekent: elke keer dezelfde stappen. Je skill legt die stappen vast, zodat je AI elk volgend gesprek op dezelfde manier voorbereidt. *(Voorstel)*

**Daarna:** module 2, met schaalbaar verkopen, positieve cashflow en stap 7 tot en met 12 van het levensfasemodel. *(Bron: Spec; Harmen)*

## Losse kaarten

Kaarten zonder check, die je kunt pakken als je eraan toe bent. Voorlopig als placeholder; vorm, beeld en plek volgen. *(Harmen)*

| Kaart | Bron |
|---|---|
| Financieel: kostprijs, verkoopprijs, vaste kosten, marktgrootte (TAM SAM SOM) | Workshop Financiële haalbaarheid; `Basis financieel.pdf`; `Financiering.pdf`; `Financial model template simplified.xlsx` |
| Team: rollen en afspraken | Workshop Samenwerken: teamrollen en afspraken |
| Pitch | Workshop Pitchen en storytelling; Reader H6 (Golden Circle) |
| Rechtsvorm en inschrijving | Workshop Rechtsvormen |
| Juridisch: online handel | Workshop Week 5, Juridische aspecten van online handel |

## Skills op een rij

| Skill | Level | Herkomst | Status |
|---|---|---|---|
| `idee-generator` | 1 (optioneel) | GPT 01 | nieuw, overgezet |
| `propositie-validator` | 1 | GPT 03 | bestaat; schrijft ook `vpc.md`; buddy-check erbij |
| `interviewhulp` | 2 | GPT 04 | bestaat; terugbelvraag erbij |
| `transcriberen` | 2 | Spec | bestaat; leest uit `opnames/`, met `terugbellen` en lokale Whisper |
| `interview-analyse` | 2 | Workshop Interviews | bestaat; schrijft `eerste-doelgroep.md` en werkt canvas en aannames bij via een pull request |
| `oplossing-kiezen` | 3 | Reader H3, Workshop Creatieve brainstormtechnieken | nieuw |
| `waardepropositie-bouwer` | 3 | GPT 05 | nieuw, overgezet |
| `mvp-kiezen` | 3 | GPT 06, sessie 1–3 | nieuw, overgezet |
| `testkaart` | 4, 5 | GPT 06, sessie 4–5 | nieuw, overgezet |
| `terugbellen` | 4 | Harmen | nieuw |
| `resultaatkaart` | 4, 5 | GPT 07 | nieuw, overgezet |
| `verbeteren` | 5 | GPT 07, "Na de Result Card" | nieuw, overgezet |
| `bmc` | 5 | GPT 08 | nieuw, overgezet |
| `verkoopgesprek` | 6 | Workshop Verkoopgesprekken | nieuw |
| `impact-scan` | 6 | GPT 09 | nieuw, overgezet |
| `verkoopaanpak` | 6 | de deelnemer | eigen skill van de deelnemer |

- De instructies van alle acht eigen GPT's worden skills in de repo. Ze werken in Claude Code en in Codex. Het platform gebruikt de GPT's zelf niet en verwijst er nergens naar. *(Harmen)*
- Vijf GPT's gebruiken knowledge-bestanden. Die komen als referentiebestand in de map van de skill; het Agent Skills-formaat ondersteunt dat. `MVP.pdf`, `Types MVP Guide.pdf`, `Formuleren Value Proposition.pdf`, `Vragen Business Model Canvas.pdf` en `Inkijk in Impact Scan.xlsx` staan in `context/`. Uit het boek *Businessideeën testen* nemen we niets over; de skills verwijzen naar de paginanummers. *(Voorstel)*

## Wat dit verandert aan wat er al is

Geen code in dit document, wel deze gevolgen voor later:

- `platform/src/lib/levels/lockedLevels.ts`: de mijlpaal van level 6 noemt nog "zicht op een positieve cashflow".
- De levelstabel in de spec van 15 oktober: level 6 staat daar met mijlpaal 5 en 6.
- `levelStatus`: level 6 kan klaar zijn terwijl level 4 of 5 nog open staan. Nu gaan levels strikt op volgorde open.
- `level1.ts`: de toets wordt stap 5 en levert ook `vpc.md`; de check wordt `madlib.md` en `vpc.md`.
- `level2.ts`: de uploadvakken als voortgang met kopieerblok, de stap met de pull request, het resultaatbestand en de nieuwe check.
- `starter-repo/`: templates en skills van level 1 en hoger gaan naar het platform; `AGENTS.md` krijgt de algemene skillregel, de regel over keuzes en materiaal vanaf level 2, en het antwoord op "Is alles in sync?"; `.gitignore` krijgt de map `opnames/`.
- `interviewhulp` en `transcriberen`: de terugbelvraag en het veld `terugbellen`.
- Het repo-paneel: het aantal pull requests pas vanaf level 2.

## Later, op de agenda

- De eigen idee-validator. *(Harmen)*
- Hoe skills buiten het platform worden verspreid. Een ander project. *(Harmen)*
- Vorm en beeld van de losse kaarten. *(Harmen)*
- Hoe we het maken van een MVP ondersteunen: rapid prototyping met AI, *Businessideeën testen*, de workshop MVP-ontwikkeling. *(Harmen)*
- Lokale spraakherkenning testen met Codex en op Windows: installatie zonder terminal voor de deelnemer, duur per interview, kwaliteit in het Nederlands. Met Claude op de Mac werkt het al. *(Harmen)*
- Module 2: schaalbaar verkopen, positieve cashflow, stap 7 tot en met 12.

## Open vragen voor Harmen

1. **Hoe lang mag een proeftijd duren in een training?** Je noemde een maand. In een blok van 7 weken, zoals bij de reader, is dat krap naast level 1 tot en met 3.
