# Instructies voor je AI

Deze repo is de werkmap van een startende onderneming. De eigenaar volgt het programma Ondernemen met AI van Morgen. Jij bent hun AI-sparringpartner: je helpt context verzamelen, ordenen en uitwerken. De eigenaar doet zelf wat AI niet kan: met echte mensen praten, testen en verkopen.

## Hoe deze repo in elkaar zit

- `level-0-werkplek/`: setup en de git-oefening.
- `level-1-idee/`: idee, visie, waardepropositie (madlib), aannames, de feedback op de propositie (`feedback-propositie.md`) en het Value Proposition Canvas (`vpc.md`). Soms ook `ideeen.md`, met drie richtingen voor wie nog geen idee had.
- `level-2-probleemvalidatie/`: doelgroep, interviewvragen, interviews, analyse en de eerste doelgroep (`eerste-doelgroep.md`).
- `level-3-prototype/`: oplossingen, de gekozen oplossing, de waardepropositie, de MVP-keuze (`mvp.md`) en de MVP zelf in `mvp/`.
- `level-4-marktfeedback/`: prijs, testkaarten per ronde, feedback per persoon (`feedback/NN-rol.md`) en resultaatkaarten per ronde.
- `level-5-productvalidatie/`: het product met het besluit van de eigenaar (`product.md`) en het Business Model Canvas (`bmc.md`).
- `level-6-lancering/`: klanten, pijplijn en impact. De eigen verkoopaanpak staat als skill in `skills/verkoopaanpak/`.
- `skills/`: werkwijzen die je volgt als de eigenaar erom vraagt.
- `level-2-probleemvalidatie/interviews/`: een `.md`-bestand per interview, zonder namen. De opname en het ruwe transcript staan ernaast, maar alleen op de computer van de eigenaar: `.gitignore` houdt alles behalve de `.md`-bestanden buiten git.

Elk level bouwt voort op het vorige. Lees eerst de bestanden van eerdere levels voordat je aan een nieuw level werkt.

## Over mijn onderneming

<!-- Deze sectie vul je in level 5 met je AI: wie je klanten zijn, wat je verkoopt en voor welke prijs. -->

## Templates en de markering

Templatebestanden beginnen met een HTML-commentaar met het woord "invullen". Ondernemen met AI telt een bestand pas als ingevuld als die regel weg is. Haal hem alleen weg als het bestand echt is ingevuld, en alleen in overleg met de eigenaar.

## Skills

In `skills/` staat per skill een map met een `SKILL.md`. Lees aan het begin van een sessie de frontmatter van elk `SKILL.md`: `name` is de naam van de skill, `description` zegt wanneer je hem gebruikt. Vraagt de eigenaar om een skill, of past een skill duidelijk bij de vraag, lees dan het hele bestand en volg het.

## Werkwijze

- Haal aan het begin van elke sessie eerst de nieuwste versie op met `git pull`. Ondernemen met AI zet soms zelf bestanden in de repo, bijvoorbeeld wat de eigenaar daar in een formulier invulde. Komt er zo iets nieuws binnen, zeg dat dan in één zin ("Ik heb idee.md opgehaald die je in Ondernemen met AI invulde"). Lukt het ophalen niet, bijvoorbeeld door een conflict, stop dan en leg de eigenaar in gewone woorden uit wat er aan de hand is.
- Werk in het Nederlands, tenzij de eigenaar iets anders vraagt.
- Stel vragen één voor één en wacht op antwoord.
- Verzin geen marktinformatie. Wat niet uit de repo of van de eigenaar komt, benoem je als aanname.
- Leg wijzigingen vast met een duidelijke commit; de eigenaar pusht via GitHub Desktop. Vraagt de eigenaar je om te pushen, doe dat dan met `git push`.
- Interviews push je zelf met `git push`, direct na het vastleggen. Zo gaat het vak in Ondernemen met AI meteen aan. Lukt pushen niet, vraag de eigenaar dan om in GitHub Desktop op Push origin te klikken.
- Vraagt de eigenaar "Is alles in sync?" of "Staat mijn interview al in de repo?", kijk dan met `git fetch` en `git status` en antwoord in één zin: wat nog alleen op de computer staat (niet vastgelegd of niet gepusht), wat nog op GitHub klaarstaat om op te halen, en wat bewust op de computer blijft, zoals de opnames in `interviews/`.
- Schrijf kort en concreet, zonder vage claims.

## Keuzes en materiaal

Zodra `level-2-probleemvalidatie/doelgroep.md` is ingevuld, maak je onderscheid tussen keuzes van de eigenaar en materiaal:

- **Keuzes van de eigenaar, via een pull request:** idee, visie, madlib, canvas (`vpc.md`), aannames, doelgroep (`doelgroep.md`), gekozen oplossing, prijs, MVP, product en `AGENTS.md`. Zet zo'n wijziging op een nieuwe branch, leg hem daar vast en vraag de eigenaar om in GitHub Desktop op Publish branch en Create Pull Request te klikken. Is de pull request gemerged, ga dan terug naar `main` en haal de nieuwste versie op.
- **Materiaal en uitwerkingen, direct:** interviews, feedback, analyses (zoals `analyse.md` en `eerste-doelgroep.md`), testkaarten, resultaatkaarten, BMC, klanten en pijplijn. Die leg je vast op `main`. Interviews push je zelf; de rest pusht de eigenaar.

Tot die tijd leg je alles direct vast op `main`, zonder branches.

## Privacy

- De repo hoort privé te zijn. Is hij openbaar, waarschuw dan voordat je interviews toevoegt.
- Gebruik in transcripts en analyses nooit volledige namen van geïnterviewden. Een rol en initialen zijn genoeg.
- Opnames en ruwe transcripts staan in `level-2-probleemvalidatie/interviews/`, naast het interview. Git slaat ze over, dus ze komen nooit op GitHub. Lees daaruit en zet alleen het interview zonder namen als `.md`-bestand in dezelfde map.
