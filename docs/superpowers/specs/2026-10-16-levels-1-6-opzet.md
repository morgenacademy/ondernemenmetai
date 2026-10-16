# Ondernemen met AI: opzet level 1 tot en met 6

Datum: 16 oktober 2026 · Status: derde versie, na twee reactierondes van Harmen · Bouwt voort op de spec van 15 oktober (`2026-10-15-klikbare-demo-design.md`)

Level 0 tot en met 2 zijn uitgewerkt in de spec van 15 oktober. Dit document zet level 1 tot en met 6 naast elkaar. Per level staat erin: de vraag en het resultaat, de mijlpaal, de stappen en waar je ze doet, de bestanden in de repo, de checks waarmee het level af is, de skills van de AI, het ene nieuwe begrip en waar je heen en weer gaat. Platformcode zit er niet bij.

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

## Besloten op 16 oktober

1. **Het platform zet templates en skills in de repo als een level opengaat.** Hoe we de deelnemer daarin meenemen, staat nog open; zie "Een skill in één zin".
2. **De aantallen zijn het uitgangspunt.** Aanscherpen kan later.
3. **Level 6 is Proof of Concept: je eerste betalende klanten.** Schaalbaar verkopen en positieve cashflow (mijlpaal 6) horen bij module 2.
4. **De eigen idee-validator gaat er voorlopig uit.** Wel een agendapunt.
5. **Binnen dit platform gebruiken we de GPT's niet.** Hun instructies worden skills in de repo. Na 11 december verdwijnen de GPT's, dus we sturen er ook niemand meer heen. Hoe skills buiten het platform worden verspreid, is een ander project.
6. **Pitch, rechtsvorm, juridisch, financieel en team worden losse kaarten.** Voorlopig als placeholder; vorm en beeld volgen.
7. **De opbouw van level 1 tot en met 4:**
   - Level 1: je idee kort in een madlib, daarna een value proposition vol aannames.
   - Level 2: interviews, analyse met hulp van je AI, en als benoemd resultaat je eerste doelgroep die allemaal hetzelfde probleem ervaart.
   - Level 3: oplossingen zoeken door te divergeren en te convergeren, tot je er één kiest.
   - Level 4: bewijzen dat mensen het willen, met testen en marktfeedback (commitment).
8. **De pull request komt in level 2, bij het bijwerken van je canvas na de interviews.**
9. **Interviews komen per stuk in je repo, zonder pull request. Je eigen AI zet ze om, het platform niet.** Een spraakdienst aan het platform hangen kost te veel bij zo'n 100 deelnemers per kwartaal. Het platform toont 5 (B2B) of 15 (B2C) vakken die afvinken zodra een interview in je repo staat. *(Harmen)*
10. **Brainwriting in level 3 doe je in een training met medecursisten.** Wie alleen werkt, bedenkt zelf en laat de AI aanvullen.
11. **Level 4, 5 en 6 volgen het verhaal van Harmen.** Je gaat terug naar dezelfde mensen met je MVP en je voorstel. Bij nee vraag je waarom, je verbetert, en je komt terug, tot iemand zegt "ja, dit zocht ik". Zo krijg je je eerste klanten, en ontdek je onderweg hoe je verkoopt.
12. **De AI in de cloud vervalt.** Voor de route is hij niet nodig.

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
- **Het levensfasemodel zet commitment (3) vóór product/market fit (4).** In de praktijk lopen ze door elkaar: je doet een voorstel, hoort nee en waarom, verbetert en komt terug. Daarom haal je mijlpaal 3 en 4 in de lus tussen level 4 en 5. *(Harmen)*
- **De reader heeft meer instrumenten voor de klant**, zoals de empathy map en de Business Model Environment. Die laten we weg om level 2 kort te houden. `doelgroep.md` dekt de stakeholders al: gebruiker, betaler en beslisser.

## Overzicht

Elk level krijgt een vraag en een resultaat, zoals de stappen in de bijlage. *(Bron: Bijlage · voorstel)*

| Level | Vraag | Resultaat | Mijlpaal |
|---|---|---|---|
| 1 Idee | Wat is mijn idee, en wat neem ik daarbij aan? | Je idee in één zin en een eerste canvas, vol aannames | Start: jouw idee |
| 2 Probleem-validatie | Wie is mijn eerste klant, en welk probleem hebben ze allemaal? | Je eerste doelgroep: wie, welk probleem, en het bewijs uit je interviews | 1. Eerste doelgroep met hetzelfde probleem |
| 3 Prototype | Welke oplossing past het best bij dat probleem? | Eén gekozen oplossing, scherp in je madlib, en een MVP die je kunt laten proberen | 2. Product/solution fit |
| 4 Markt feedback | Willen ze het, tegen jouw prijs? | Het antwoord van je mensen op je voorstel: ja, of nee en waarom | 3. Commitment (je haalt hem in de lus met level 5) |
| 5 Product-validatie | Wat moet er beter, tot ze ja zeggen? | Een product waar je eerste mensen ja op zeggen tegen dezelfde prijs, en je businessmodel op één pagina | 3. Commitment en 4. Product/market fit |
| 6 Lancering | Betalen ze, en hoe verkoop je het aan de volgende? | Je eerste betalende klanten, en je verkoopaanpak vastgelegd als skill | Proof of Concept |

| Level | Jij doet buiten | Je AI maakt | Nieuw begrip | Af als |
|---|---|---|---|---|
| 1 | — | je canvas, feedback op je propositie | Ophalen (pull) | 4 bestanden ingevuld, canvas, minstens 3 aannames, feedback |
| 2 | 5 (B2B) of 15 (B2C) interviews | interviewvragen, analyse, bijgewerkt canvas | Pull request | zoals nu, plus je eerste doelgroep gevonden en 1 gemergde pull request |
| 3 | oplossingen bedenken, met anderen | keuze uit je oplossingen, madlib en canvas voor je oplossing, de digitale delen van je MVP | Geschiedenis | 10 oplossingen, gekozen oplossing, MVP |
| 4 | je mensen terugbellen, laten proberen, je voorstel doen | testkaart, een spiekbriefje per persoon, resultaatkaart | Je repo als geheugen | prijs, testkaart, antwoord van 3 (B2B) of 10 (B2C) mensen, resultaatkaart |
| 5 | terugkomen met een betere versie | verbeteringen uit de redenen van nee, productkeuze, Business Model Canvas | AGENTS.md | 3 (B2B) of 10 (B2C) keer ja tegen dezelfde prijs, product, BMC, AGENTS.md aangevuld |
| 6 | verkopen, ook aan nieuwe mensen | je verkoopaanpak als skill, pijplijn, impact scan | Eigen skill | 5 (B2B) of 20 (B2C) betalende klanten, eigen skill, impact |

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

Op elke kaart met een AI-stap staat welke skill je AI gebruikt en wat die doet, in één zin, met een link naar het `SKILL.md` op GitHub. Bijvoorbeeld: "Je AI gebruikt hier skill `vpc`: hij zet je idee op een canvas en markeert elke regel als aanname." Wie wil, leest de skill; wie niet wil, hoeft niets te weten. Wat een skill precies is, leer je in level 6, als je er zelf een schrijft. *(Voorstel, op de vraag van Harmen hoe we de deelnemer meenemen)*

### Drie manieren waarop iets in je repo komt

1. **Het platform schrijft het direct op GitHub.** Zo komen formulieren erin. Je hoeft niets te doen.
2. **Je AI legt vast, jij pusht in GitHub Desktop.** Zo komt wat je AI op je computer maakt erin, zoals een interview, een analyse of een testkaart. Pas na Push origin ziet het platform het en wordt de check groen.
3. **Een pull request.** Je AI zet een wijziging op een zijspoor (een branch). Jij bekijkt hem op GitHub; pas na Merge pull request telt hij mee.

Een pull request is dus geen manier om iets binnen te krijgen. Het is een controle voordat een wijziging meetelt, en die is alleen nodig als je AI iets aanpast wat jij hebt gekozen. Daarom staat vanaf level 2 in `AGENTS.md` *(Harmen: pull request in level 2 · regel: voorstel)*:

- **Jouw keuzes, via een pull request:** idee, visie, madlib, canvas, aannames, doelgroep, gekozen oplossing, prijs, je MVP en je product, `AGENTS.md`.
- **Materiaal en uitwerkingen, direct:** interviews, feedback, analyses, testkaarten, resultaatkaarten, BMC, pijplijn.

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
| 1 | Ophalen (pull) | Laat je AI je propositie toetsen |
| 2 | Pull request | Werk je canvas bij |
| 3 | Geschiedenis | Verwoord je oplossing |
| 4 | Je repo als geheugen | Bereid je terugbelgesprekken voor |
| 5 | AGENTS.md | Vertel je AI wie je onderneming is |
| 6 | Eigen skill | Leg vast hoe je verkoopt |

Level 1 tot en met 3 maken drie van de vier redenen uit de pop-up van level 0 waar: het platform kan meekijken, je kunt eerst nakijken, je ziet terug wat je AI deed. De vierde, de AI in de cloud, is voor de route niet nodig. Vanaf level 4 bepaal je steeds meer zelf hoe je AI werkt.

### Aantallen volgen B2B of B2C

`doelgroep.md` heeft al `type` en `interviews_nodig`. Latere levels lezen dezelfde `type` voor hun aantallen en krijgen een eigen veld om dat aan te passen. *(Bron: Spec · uitbreiding: voorstel · aantallen: Harmen, uitgangspunt)*

### Teruggaan sluit niets af

De checks kijken naar de inhoud van de repo. Werk je na de interviews je madlib bij, dan blijft level 1 af. Wordt een check later toch rood, dan blijft het level erna open en krijgt het eerdere level een markering op de levelkaart. *(Voorstel)*

### Privacy

- Reacties, feedback en verkoopgesprekken krijgen een rol en initialen, nooit een volledige naam. Contactgegevens horen niet in de repo. *(Bron: Spec, AVG · uitbreiding: voorstel)*
- Opnames en ruwe transcripts blijven op je computer, in de map `opnames/`. Die staat in `.gitignore`, dus git ziet hem niet. Je AI leest daaruit en zet alleen het interview zonder namen in `interviews/`. Zo staat er ook in de git-geschiedenis nooit een naam of een stem. *(Bron: Spec, "audio blijft lokaal" · map `opnames/`: voorstel)*
- Voor het opnemen vraag je toestemming. Die zin staat al in skill `interviewhulp`.

### Nieuwe checktypes

Naast `fileFilled`, `minListItems`, `minFilledFiles` en `minMergedPullRequests` zijn er vijf nodig *(Voorstel)*:

- `fileExists`: het bestand staat er. Voor de feedback op je propositie en je eigen skill.
- `frontmatterFilled`: deze velden hebben een waarde. Voor de testkaart.
- `frontmatterIs`: dit veld heeft deze waarde, eventueel in een minimum aantal bestanden. Voor `gevonden: ja` en voor het aantal keer `antwoord: ja`.
- `anyFileIn`: de map bevat minstens één bestand, van welk type ook. Voor je MVP (html, pdf, foto).
- `sectionFilled`: onder deze kop staat tekst. Voor de nieuwe sectie in `AGENTS.md`.

## Level 1: Idee

**Vraag:** wat is mijn idee, en wat neem ik daarbij aan?
**Resultaat:** je idee in één zin en een eerste canvas, vol aannames.
**Doel:** idee, visie en een eerste versie van je waardepropositie. *(Bron: Stappenplan)*
**Mijlpaal:** start: jouw idee, jouw passie, "ik wil ondernemen". *(Bron: Levensfasemodel)*

Level 1 blijft kort *(Harmen)*. Nieuw is het canvas in stap 4.

| # | Stap | Waar | In je repo (`level-1-idee/`) | Herkomst |
|---|---|---|---|---|
| 0 | Nog geen idee? (optioneel, over te slaan) | AI-app | `ideeen.md`: drie richtingen | Bron: GPT 01, Launch path "Start" · optionele kaart: voorstel |
| 1 | Zet je idee uiteen | Platform | `idee.md` | Spec |
| 2 | Formuleer je visie | Platform | `visie.md` | Spec |
| 3 | Je idee in één zin | Platform | `madlib.md` | Spec |
| 4 | Zet je waardepropositie op een canvas | AI-app | `vpc.md`: klantkant (jobs, pains, gains) en aanbodkant (producten, pain relievers, gain creators), elke regel gemarkeerd als aanname | Harmen; Bron: Reader H1 §7, Launch path (VPC als deliverable) |
| 5 | Markeer je aannames | Platform | `aannames.md` | Spec; de kaart wijst op het canvas: elke pain en gain is een aanname |
| 6 | Laat je AI je propositie toetsen | AI-app | `feedback-propositie.md` | Spec; de skill schrijft dit bestand al |

**Checks:** zoals nu, plus `vpc.md` ingevuld en `fileExists` voor `feedback-propositie.md`. Zo telt de toets mee voor het level. *(Voorstel)*

**Skills:**

- `vpc`: nieuw. Leest `idee.md` en `madlib.md`, vult beide kanten van het canvas en zet bij elke regel "(aanname)". Vraagt één voor één wat ontbreekt. *(Voorstel)*
- `propositie-validator`: bestaat, gebaseerd op GPT 03. De buddy-check uit de reader kan erbij: kort en zonder containerbegrippen, doelgroep afgebakend, probleem relevant, oplossing sluit aan op het probleem. *(Bron: Reader H3 §7 · toevoeging: voorstel)*
- `idee-generator`: nieuw, overgezet uit GPT 01. De trendtabel ("macrotrends 2025") moet bijgewerkt worden, en de doorverwijzing naar de Startup Validator vervalt. *(Bron: GPT 01)*

**Nieuw begrip: ophalen (pull).** In level 1 schrijft het platform voor het eerst bestanden naar GitHub terwijl je AI op je computer werkt. Bij de toets zegt je AI: "Ik heb idee.md, visie.md, madlib.md en aannames.md opgehaald." De pop-up "Wat haalde mijn AI op?" legt uit: wat je op het platform invult, komt op GitHub; je AI haalt het naar je computer. *(Bron: pull-regel in `starter-repo/AGENTS.md` op branch `claude/bold-diffie-859712`, nog niet in `feat/klikbare-demo` · pop-up: voorstel)*

**Itereren:** tussen 1 en 2. In level 2 werkt je AI je canvas en je aannames bij met wat de interviews lieten zien.

## Level 2: Probleem-validatie

**Vraag:** wie is mijn eerste klant, en welk probleem hebben ze allemaal? *(Bron: Bijlage, stap 1)*
**Resultaat:** je eerste doelgroep: wie, welk probleem, en het bewijs uit je interviews. *(Bron: Bijlage, stap 2 "gevalideerde probleemstelling")*
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
  - **Heb je alleen een opname?** Claude Code en Codex kunnen zelf niet naar een audiobestand luisteren. Je AI kan wel een spraakprogramma (Whisper) op je computer installeren en draaien. Dat kost niets en de opname gaat de deur niet uit. Nog testen: hoe lang de installatie en het omzetten duren, vooral op Windows en op oudere laptops.
  - De uploadvakken uit de demo vervallen voor ruwe tekst: wat het platform uploadt, staat direct op GitHub, ook de namen. De vakken blijven als voortgang, met de AI-opdracht als kopieerblok.
- **Stap 5.** Hier is je AI sterk: 5 tot 15 gesprekken naast elkaar leggen, patronen tellen en per patroon de citaten terugvinden *(Harmen)*. Het resultaat krijgt een eigen bestand, zodat het platform het als resultaat van het level kan tonen. `eerste-doelgroep.md` heeft frontmatter `gevonden: ja | nee`, `doelgroep` en `probleem`, en in de tekst het bewijs: hoeveel van de interviews, welke klachten steeds terugkomen, en de citaten. *(Voorstel)*
- **Stap 6.** Je AI zet bij elke regel in je canvas en bij elke aanname wat de interviews zeiden: bevestigd, ontkracht of open. Hij doet dat op een branch. In GitHub Desktop klik je Publish branch en Create Pull Request. Op GitHub zie je onder Files changed in rood wat sneuvelde en in groen wat erbij kwam. Daarna klik je Merge pull request. *(Harmen: besloten · uitwerking: voorstel)*

**Checks:** zoals nu, plus `gevonden: ja` in `eerste-doelgroep.md` (`frontmatterIs`) en minstens 1 gemergde pull request (`minMergedPullRequests`, bestaat al). *(Voorstel)*

**Skills:**

- `interviewhulp`: bestaat; de terugbelvraag komt erbij.
- `transcriberen`: bestaat; leest uit `opnames/`, met het veld `terugbellen`. Vindt hij alleen audio, dan biedt hij aan Whisper lokaal te installeren; de skill zegt nu al dat audio nooit zonder toestemming naar een externe dienst gaat.
- `interview-analyse`: bestaat; schrijft voortaan ook `eerste-doelgroep.md` en werkt het canvas en de aannames bij via een pull request. De mijlpaalvraag staat al in de skill (stap 5), net als de vergelijking met de aannames (stap 6).

**Nieuw begrip: pull request.** "De AI stelt voor, ik keur goed." Je interviews en je analyse zijn nieuw; die komen direct in je repo. Je canvas en je aannames zijn van jou; daar stelt je AI wijzigingen voor, en jij beslist. De pull request laat zien wat de markt je leerde. *(Bron: Besluit, de gewoonte; pop-up level 0, reden 3 · level 2: Harmen)*

**Itereren:** tussen 1 en 2 *(Bron: Besluit)*. Bij `gevonden: nee` toont het platform drie routes terug: een andere doelgroep, meer interviews, of je idee bijstellen in level 1. Kies je een andere doelgroep, dan zet je AI de oude interviews in `interviews/ronde-1/`. De check telt alleen bestanden direct in `interviews/`, dus de teller begint weer bij 0. *(Voorstel; werkt met de huidige `mdFilesIn`)*

Het repo-paneel toont het aantal pull requests pas vanaf level 2. Nu staat er al in level 0 "0 gemergde pull requests". *(Bron: overdrachtsnotitie review-minors · oplossing: voorstel)*

## Level 3: Prototype

**Vraag:** welke oplossing past het best bij dat probleem? *(Bron: Bijlage, stap 3)*
**Resultaat:** één gekozen oplossing, scherp in je madlib, en een MVP die je kunt laten proberen. *(Bron: Bijlage, stap 3 en 4)*
**Doel:** ideeën genereren en een eerste demo of MVP maken. *(Bron: Stappenplan, Launch path)*
**Mijlpaal 2:** product/solution fit: de beste oplossing voor het probleem van je eerste doelgroep. *(Bron: Levensfasemodel)*

Eerst breed, dan kiezen *(Harmen: divergeren en convergeren)*. Daarna de vraag: "Waarom ga je niet morgen de markt op?" *(Bron: Workshop MVP-ontwikkeling, GPT 06)*

| # | Stap | Waar | In je repo (`level-3-prototype/`) | Herkomst |
|---|---|---|---|---|
| 1 | Bedenk oplossingen | Buiten (met medecursisten) of zelf, daarna Platform | `oplossingen.md`: minstens 10 ideeën | Harmen; Bron: Reader H3 §2 en §3 (How Might We, brainwriting 6-3-5, SCAMPER); Workshop Creatieve brainstormtechnieken · aantal: voorstel |
| 2 | Kies je oplossing | AI-app | `oplossing.md`: de gekozen oplossing, waarom, en wat afviel | Bron: Reader H3 §6 en Bijlage stap 3 (wenselijk, haalbaar, levensvatbaar; impact/effort-matrix) |
| 3 | Verwoord je oplossing | AI-app, via een pull request | `madlib.md` en `vpc.md` bijgewerkt, `waardepropositie.md` nieuw | Bron: Bijlage ("Mad Lib als value proposition"), Reader H3 §7 (value proposition fit), GPT 05 |
| 4 | Kies je MVP | AI-app | `mvp.md`: je drie grootste bezwaren, de riskantste aanname, het MVP-type en waarom | Bron: Workshop MVP-ontwikkeling (opdracht 2: "minimaal je 3 grootste bezwaren"), GPT 06, `Types MVP Guide.pdf`, Reader H4 (prototype-ladder) |
| 5 | Bouw je MVP | AI-app en zelf | `mvp/`: de MVP zelf, of foto's en een link | Bron: Workshop MVP-ontwikkeling ("Bouw een MVP en verkoop 'm") · taakverdeling: voorstel |

- **Stap 1.** Het platform zet de How Might We-vraag klaar uit `eerste-doelgroep.md`: "Hoe kunnen we [doelgroep] helpen met [probleem]?" In een training doe je brainwriting 6-3-5 met medecursisten; wie alleen werkt, bedenkt zelf en laat de AI in stap 2 aanvullen *(Harmen)*. Daarna vul je je ideeën in op het platform.
- **Stap 2.** Je AI vult aan met varianten (SCAMPER), groepeert, en zet elk idee langs wenselijk, haalbaar en levensvatbaar en in de impact/effort-matrix. Hij legt elk idee naast de pains en gains die in level 2 bevestigd zijn. Jij kiest.
- **Stap 3.** Je madlib krijgt een nieuwe versie voor je gekozen oplossing, en je canvas een nieuwe aanbodkant. Omdat dit jouw keuzes zijn, gaat het via een pull request. `waardepropositie.md` is de langere tekst uit GPT 05; ongeveer de helft van de 14 vragen staat al in je repo.
- **Stap 4.** Een MVP is klaar zodra hij je kritieke aanname kan toetsen. Begin onderaan de prototype-ladder: een schets gaat voor een app. *(Bron: Reader H4)*
- **Stap 5.** Je AI bouwt wat digitaal kan: een landingspagina, een klikbaar prototype, een flyer of een bestelformulier. Jij regelt wat fysiek is of mensen vraagt, zoals een concierge-MVP waarin je de dienst met de hand levert.

De stap "Laat je MVP zien" uit de vorige versie is weg. Met je MVP terug naar je mensen gaan, is level 4. *(Harmen)*

**Checks:** `oplossingen.md` minstens 10 ideeën · `oplossing.md`, `waardepropositie.md` en `mvp.md` ingevuld · `mvp/` minstens één bestand (`anyFileIn`). *(Voorstel)*

**Skills:**

- `oplossing-kiezen`: nieuw. Gebaseerd op de reader (H3) en de workshop Creatieve brainstormtechnieken. Er is geen GPT voor.
- `waardepropositie-bouwer`: nieuw, overgezet uit GPT 05. De GPT heeft niet-gepubliceerde wijzigingen; de tekst in `context/` is het concept. Het knowledge-bestand is vermoedelijk `Formuleren Value Proposition.pdf` in `context/`, met dezelfde 14 vragen.
- `mvp-kiezen`: nieuw, overgezet uit GPT 06, sessie 1 tot en met 3. De Test Card-wizard uit dezelfde GPT gaat naar level 4.

**Nieuw begrip: geschiedenis.** Je madlib en je canvas hebben nu drie versies: je eerste idee (level 1), na de interviews (level 2) en voor je gekozen oplossing (level 3). In GitHub Desktop zie je onder History per versie wat er veranderde, en je kunt terug naar een eerdere versie. *(Bron: pop-up level 0, reden 2 · moment: voorstel)*

**Itereren:** binnen het level. Blijkt bij het bouwen dat je MVP de kritieke aanname niet kan toetsen, dan ga je terug naar stap 4. *(Bron: `MVP.pdf`: "If your assumption is sinking, abandon it.")*

## Level 4: Markt feedback

**Vraag:** willen ze het, tegen jouw prijs?
**Resultaat:** het antwoord van je mensen op je voorstel: ja, of nee en waarom.
**Doel:** feedback van je doelgroep ophalen. *(Bron: Stappenplan)*
**Mijlpaal 3:** commitment: je doelgroep wil kopen, en voor dezelfde prijs. *(Bron: Levensfasemodel)* Je haalt hem in de lus met level 5. Level 4 is af als je het antwoord hebt, ook als dat nee is. *(Harmen: "vraag waarom niet, en ga verbeteren" · check: voorstel)*

Je gaat terug naar de mensen die je interviewde: "Weet je nog, je zei dat je hier tegenaan loopt. Ik heb misschien iets voor je." *(Harmen)*

| # | Stap | Waar | In je repo (`level-4-marktfeedback/`) | Herkomst |
|---|---|---|---|---|
| 1 | Bepaal je prijs | Platform | `prijs.md`: prijs, per wat, geschatte kostprijs | Bron: mijlpaal 3; Workshop Financiële haalbaarheid, vraag 1 en 2 · formulier: voorstel |
| 2 | Maak je testkaart | AI-app | `testkaarten/ronde-1.md`: wat verwacht je van deze ronde, bijvoorbeeld "3 van de 5 zeggen ja tegen €40 per maand" | Bron: GPT 06 (Test Card-wizard), Workshop Experiment design (testbaar, nauwkeurig, discreet), Reader H5 (actionable metrics) |
| 3 | Bereid je terugbelgesprekken voor | AI-app | per persoon een spiekbriefje bovenaan `feedback/NN-rol.md` | Harmen · voorstel |
| 4 | Laat proberen en doe je voorstel | Buiten, daarna Platform | `feedback/NN-rol.md`: wat iemand probeerde en hoe lang, je voorstel, `antwoord: ja \| nee \| twijfel`, en waarom | Harmen; Bron: GPT 06 (gedrag boven intentie) |
| 5 | Lees je ronde | AI-app | `resultaten/ronde-1.md`: hoeveel ja, de redenen van nee op een rij, en je besluit | Bron: GPT 07 (Result Card, persevere/pivot/kill); Workshop Onderzoek, wat heb je geleerd (bewijskracht); Bijlage (learning card) |

- **Stap 2.** De testkaart legt vooraf vast wat je verwacht, zodat je achteraf niet goedpraat wat er gebeurde. Normen uit GPT 06: minstens 5 kwalitatieve of 50 kwantitatieve gevallen, en een succesdrempel "waarmee je durft door te bouwen". Meet wat mensen doen, zoals bestellingen of langer willen gebruiken; likes en bezoekers tellen niet *(Bron: Reader H5)*. De vijf blokken staan als frontmatter, zodat het platform ze kan controleren.
- **Stap 3.** Je AI zoekt in je interviews wie `terugbellen: ja` zei. Per persoon schrijft hij op wat diegene in level 2 vertelde over het huidige alternatief en de klachten, en welk deel daarvan je MVP oplost. Nieuwe mensen mogen er ook bij.
- **Stap 4.** Afhankelijk van je MVP laat je mensen het een tijd proberen, soms een maand. Een ja kan klinken als "dit wil ik wel", als "kan ik het blijven gebruiken?", of als ja op je vraag "wil je dit hebben, voor deze prijs?". Zeggen ze nee, vraag dan waarom niet. Dat antwoord is het belangrijkste wat je meeneemt. *(Harmen)* Een ja is gedrag: een aanbetaling, een pre-order, of langer willen gebruiken tegen je prijs. "Ik zou het kopen" telt niet. *(Bron: GPT 06 en 07)*
- **Stap 5.** De resultaatkaart volgt de vijf blokken van GPT 07: gemeten waarde, vergelijking met de drempel, observaties, verrassingen en conclusie. Frontmatter: `besluit: doorgaan | verbeteren | stoppen` en `vertrouwen` van 0 tot 100 uit het bewijskracht-werkblad. Bij "verbeteren" ga je naar level 5.
- Op het platform staan al je testkaarten en resultaten op één bord, zoals het experiment board uit de bijlage. *(Bron: Bijlage · voorstel)*

**Checks:** `prijs.md` ingevuld · minstens 1 testkaart met alle vijf velden (`frontmatterFilled`) · `feedback/` minstens 3 (B2B) of 10 (B2C) bestanden met een `antwoord` · minstens 1 resultaatkaart met een besluit. *(Voorstel)*

**Skills:**

- `testkaart`: nieuw, overgezet uit GPT 06, sessie 4 en 5 (Test Card-wizard). Eén testkaart per ronde.
- `terugbellen`: nieuw. Maakt per persoon het spiekbriefje uit diens interview. *(Harmen · voorstel)*
- `resultaatkaart`: nieuw, overgezet uit GPT 07. In de GPT's verwijzen 06 en 07 naar elkaar met een link naar `chat.openai.com`; in de repo verwijzen de skills naar elkaar met hun naam.

**Nieuw begrip: je repo als geheugen.** Je AI weet nog wat 01-apotheker in level 2 zei, omdat het in je repo staat. Alles wat je vastlegt, kan hij later gebruiken: nu voor je terugbelgesprekken, in level 5 voor je verbeteringen, in level 6 voor je verkoopaanpak. *(Bron: Spec, "context verzamelen" als eerste waarde van AI · moment: voorstel)*

**Itereren:** tussen 4 en 5 *(Bron: Besluit; Harmen)*. Na een ronde met nee's verbeter je in level 5 en kom je terug met ronde 2: een nieuwe testkaart (`ronde-2.md`), dezelfde mensen, en een nieuwe sectie "Ronde 2" in hun feedbackbestand.

## Level 5: Product-validatie

**Vraag:** wat moet er beter, tot ze ja zeggen?
**Resultaat:** een product waar je eerste mensen ja op zeggen tegen dezelfde prijs, en je businessmodel op één pagina.
**Doel:** een basisproduct ontwikkelen voor je eerste klanten. *(Bron: Stappenplan)*
**Mijlpalen 3 en 4:** commitment tegen dezelfde prijs, en product/market fit: een basisproduct waar je eerste klanten fan van zijn. *(Bron: Levensfasemodel · beide in dit level: Harmen)*

"Nee, sorry" is het begin. Je vraagt waarom niet, je verbetert, en je gaat terug: "En zo dan, dan wel?" Tot iemand zegt "ja, dit zocht ik" en het van je afneemt. *(Harmen)*

| # | Stap | Waar | In je repo (`level-5-productvalidatie/`) | Herkomst |
|---|---|---|---|---|
| 1 | Verbeter op de redenen van nee | AI-app, via een pull request | `product.md`: wat erin zit en welk bewijs ervoor pleit, en wat er bewust niet in zit; wijzigingen in je MVP | Harmen; Bron: Stappenplan, GPT 07 (minstens drie opties, jij kiest) |
| 2 | Ga terug naar je mensen | Buiten, daarna Platform | een nieuwe ronde in level 4: testkaart, sectie in `feedback/NN-rol.md`, resultaatkaart | Harmen |
| 3 | Breng je businessmodel in kaart | AI-app | `bmc.md`: 9 bouwstenen, elk met het bestand waar het vandaan komt | Bron: GPT 08; `Vragen Business Model Canvas.pdf`; Workshop Businessmodel in kaart (SBMC); Bijlage (stap 6) · bronbestand per bouwsteen: voorstel |
| 4 | Vertel je AI wie je onderneming is | AI-app, via een pull request | sectie "Over mijn onderneming" in `AGENTS.md` | Voorstel |

- **Stap 1.** Je AI zet alle redenen van nee uit je feedbackbestanden op een rij, koppelt ze aan de klachten uit level 2, en stelt per reden minstens drie aanpassingen voor. Jij kiest. Omdat het jouw product is, gaat het via een pull request.
- **Stap 2.** Stap 1 en 2 herhaal je tot je drempel aan ja's haalt. De interviews uit level 2 vertelden wat er vervelend was aan het huidige alternatief; als jouw oplossing dat echt oplost, wil men hem hebben. *(Harmen)*
- **Stap 3.** GPT 08 vraagt alle 9 bouwstenen één voor één uit. In de repo staat al veel: klantsegmenten in `doelgroep.md` en `eerste-doelgroep.md`, de waardepropositie in `vpc.md` en `waardepropositie.md`, inkomstenstromen in `prijs.md` en de feedback. De skill vult dat in en vraagt alleen naar kanalen, klantrelaties, partners, middelen, activiteiten en kosten. Hij controleert of de blokken op elkaar aansluiten, zoals GPT 08 doet. De twee extra blokken van het Sustainable Business Model Canvas (ecologische en sociale kosten en baten) zijn optioneel.

**Checks:** in `level-4-marktfeedback/feedback/` minstens 3 (B2B) of 10 (B2C) bestanden met `antwoord: ja`, tegen de prijs uit `prijs.md` (`frontmatterIs`) · `product.md` en `bmc.md` ingevuld · sectie "Over mijn onderneming" in `AGENTS.md` gevuld (`sectionFilled`). *(Voorstel)*

**Skills:**

- `verbeteren`: nieuw, gebaseerd op het deel "Na de Result Card" van GPT 07.
- `bmc`: nieuw, overgezet uit GPT 08. Het knowledge-bestand "Hulpvragen Business Model Canvas.pdf" is vermoedelijk `Vragen Business Model Canvas.pdf` in `context/`.
- `testkaart` en `resultaatkaart` uit level 4, voor elke nieuwe ronde.

**Nieuw begrip: AGENTS.md.** Tot nu toe volgde je AI de instructies van Morgen. Nu je product staat, schrijf je erbij wie je klanten zijn, wat je verkoopt en voor welke prijs. Elke sessie begint je AI daarmee. *(Voorstel)*

**Itereren:** tussen 4 en 5, tot je drempel aan ja's haalt *(Bron: Besluit; Harmen)*. Level 4 blijft af; nieuwe rondes komen erbij.

## Level 6: Lancering

**Vraag:** betalen ze, en hoe verkoop je het aan de volgende?
**Resultaat:** je eerste betalende klanten, en je verkoopaanpak vastgelegd als skill.
**Doel:** je eerste echte klanten. *(Bron: Stappenplan)* "En voor je het weet heb je betalende klanten." *(Bron: Launch path)*
**Mijlpaal:** Proof of Concept *(Harmen; Bron: Reader H5 §4, "Van n=1 naar Proof-of-Concept")*. Je zet de eerste stap naar mijlpaal 5, een herhaalbaar verkoopproces, door je aanpak vast te leggen. "Schaalbaar" en mijlpaal 6 (positieve cashflow) horen bij module 2. *(Harmen)*

Uit de lus van level 4 en 5 komen je eerste klanten. Hoe je het verkoopt, heb je onderweg al ontdekt; in dit level leg je dat vast en verkoop je ook aan mensen die je nog niet sprak. *(Harmen)*

| # | Stap | Waar | In je repo (`level-6-lancering/`) | Herkomst |
|---|---|---|---|---|
| 1 | Maak van je ja's betalende klanten | Buiten, daarna Platform | `pijplijn.md`: per klant de fase en de waarde | Harmen; Bron: `Heel simple sales funnel (1).xlsx`: vijf fases van contact gelegd (10%) tot opdracht (100%) |
| 2 | Leg vast hoe je verkoopt | AI-app, via een pull request | `skills/verkoopaanpak/SKILL.md` | Harmen ("gaandeweg ontdekt"); Bron: Workshop Verkoopgesprekken (VACATIO, SPIN, DMU) · skill: voorstel |
| 3 | Verkoop aan nieuwe mensen | Buiten, daarna Platform | nieuwe klanten in `pijplijn.md` | Voorstel |
| 4 | Maak je impact zichtbaar | AI-app | `impact.md`: per kapitaal doel, activiteit en resultaat | Bron: GPT 09; Workshop Inzicht in impact; Bijlage stap 6 (meervoudige waarde) |

- **Stap 1.** Na elk gesprek zet je de klant een fase verder, op het platform of via je AI. De pijplijn rekent de gewogen waarde uit, zoals de funnel uit de bronnen.
- **Stap 2.** Je AI haalt uit je feedbackbestanden wat werkte: welke opening, welk voorstel, welke bezwaren en wat je antwoordde. Hij zet dat in de volgorde van VACATIO: verkenning, analyse, confrontatie, argumentatie, tegenwerpingen, instemming, order. In de verkenning gebruik je SPIN-vragen: situatie, probleem, implicatie, nuttig effect.
- **Stap 3.** Je AI bereidt elk gesprek met een nieuw iemand voor met je eigen skill.
- **Stap 4.** Zes kapitalen: financieel, geproduceerd, intellectueel, menselijk, sociaal en natuurlijk. Per kapitaal ook de fase in de volwassenheidsmatrix.

**Checks:** in `pijplijn.md` minstens 5 (B2B) of 20 (B2C) klanten in de fase "opdracht" · `skills/verkoopaanpak/SKILL.md` bestaat, met `name` en `description` · `impact.md` ingevuld. *(Voorstel)*

**Skills:**

- `verkoopgesprek`: nieuw, uit de workshop Verkoopgesprekken. Geeft de structuur waarmee je je eigen skill schrijft. Er is geen GPT voor.
- `impact-scan`: nieuw, overgezet uit GPT 09. De GPT-instructies zijn Engels en beloven een PDF-export terwijl Code Interpreter uit staat. In de repo maakt de AI een Markdown-bestand. Het knowledge-bestand is Engels ("Impact Scan - EN.xlsx"); in `context/` staat de Nederlandse `Inkijk in Impact Scan.xlsx`.
- `verkoopaanpak`: je eigen skill, gemaakt in stap 2.

**Nieuw begrip: je eigen skill.** Je AI gebruikte de hele route skills van Morgen. Nu schrijf je er zelf een. Herhaalbaar betekent: elke keer dezelfde stappen. Je skill legt die stappen vast, zodat je AI elk volgend gesprek op dezelfde manier voorbereidt en de pijplijn bijwerkt. *(Voorstel)*

**Itereren:** binnen het level. Blijven klanten in dezelfde fase hangen, dan pas je die stap in je skill aan. Na level 6 volgt module 2, met schaalbaar verkopen, positieve cashflow en stap 7 tot en met 12 van het levensfasemodel. *(Bron: Spec; Harmen)*

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
| `vpc` | 1 | Reader H1 §7 en H3 §7 | nieuw |
| `propositie-validator` | 1 | GPT 03 | bestaat; buddy-check erbij |
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
- `starter-repo/.gitignore`: de map `opnames/` erbij.
- `starter-repo/`: templates en skills van level 1 en hoger gaan naar het platform; `AGENTS.md` krijgt de algemene skillregel en de regel over keuzes en materiaal vanaf level 2.
- `level1.ts` en `level2.ts`: de stap met het canvas in level 1; in level 2 de uploadvakken als voortgang met kopieerblok, de stap met de pull request en het resultaatbestand.
- `interviewhulp` en `transcriberen`: de terugbelvraag en het veld `terugbellen`.
- Het repo-paneel: het aantal pull requests pas vanaf level 2.

## Later, op de agenda

- De eigen idee-validator. *(Harmen)*
- Hoe skills buiten het platform worden verspreid. Een ander project. *(Harmen)*
- Vorm en beeld van de losse kaarten. *(Harmen)*
- Lokale Whisper testen op Mac en Windows, met Claude Code en met Codex: installatie zonder terminal voor de deelnemer, duur per interview, kwaliteit in het Nederlands. Dit stond al als open punt in de spec.
- Module 2: schaalbaar verkopen, positieve cashflow, stap 7 tot en met 12.

## Open vragen voor Harmen

1. **Klopt de lus met de checks die erbij horen?** Level 4 is af als je mensen op je voorstel hebben geantwoord, ook als dat nee is. Level 5 is af bij 3 (B2B) of 10 (B2C) keer ja tegen dezelfde prijs. Daarmee schuift de check op commitment (mijlpaal 3) van level 4 naar level 5.
2. **Hoe lang mag een proeftijd duren in een training?** Je noemde een maand. In een blok van 7 weken, zoals bij de reader, is dat krap naast level 1 tot en met 3.
