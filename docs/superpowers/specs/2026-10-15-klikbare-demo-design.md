# Ondernemen met AI: ontwerp klikbare demo (fase 1)

Datum: 15 oktober 2026 · Status: goedgekeurd ontwerp, basis voor het implementatieplan

## Waarom

Morgen geeft ondernemerschapstrainingen. Deelnemers gebruiken steeds vaker AI, maar weten niet hoe ze die goed inrichten. De waarde van AI zit in drie dingen: context verzamelen, de AI in een repo laten werken met overzicht, en de AI de uitvoer laten doen (BMC, VPC). Zelf blijf je doen wat AI niet kan: echt de markt op, met interviews, tests en verkoop.

Dit platform leidt deelnemers door levels. Level 0 is de werkplek inrichten: een AI-app, GitHub, een repo en GitHub Desktop. Daarna volgen de ondernemerschapslevels. Een level gaat pas open als het vorige af is. Het platform werkt samen met de repo en de AI van de deelnemer.

## Besluiten

| Onderwerp | Besluit |
|---|---|
| Doel | Eerst een klikbare demo, daarna op dezelfde basis een pilot |
| Merk | Morgen, breed inzetbaar (de eerste pilot mag bij Avans) |
| AI-tools | Claude Code en Codex. Copilot valt buiten scope |
| Architectuur | De repo van de deelnemer is de bron. Het platform is een dunne schil eromheen |
| Unlock | Automatische checks op de repo. Een trainer kan meekijken, maar hoeft niet goed te keuren |
| Levels | Het 6-stappenplan zijn de levels. Stap 1–6 van het levensfasemodel zijn de mijlpalen. Stap 7–12 komen in een vervolgmodule |

## Levels

| Level | Naam | Mijlpaal (levensfasemodel) | In de demo |
|---|---|---|---|
| 0 | Werkplek | — | volledig |
| 1 | Idee | start: jouw idee | volledig |
| 2 | Probleem-validatie | 1. eerste doelgroep die hetzelfde probleem ervaart | volledig |
| 3 | Prototype | 2. product/solution fit | op slot, met beschrijving |
| 4 | Markt feedback | 3. commitment om te kopen tegen een prijs | op slot, met beschrijving |
| 5 | Product-validatie | 4. product/market fit | op slot, met beschrijving |
| 6 | Lancering | 5. herhaalbaar verkoopproces · 6. business/market fit | op slot, met beschrijving |

### Level 0: Werkplek

De route past zich aan op de gekozen setup: Mac of Windows, en Claude Code of Codex. Er komt geen terminal aan te pas: geen Homebrew, winget of `gh`.

1. **Kies je setup.** Je kiest je computer en waar je een abonnement hebt: "Claude (Pro of hoger)" geeft `ai: claude-code`, "ChatGPT (Plus of hoger)" geeft `ai: codex`. Het platform schrijft `level-0-werkplek/setup.md` met frontmatter `os` en `ai`. Heb je nog geen abonnement, dan sluit je er eerst een af.
2. **Download je AI-app.** Een downloadpagina met één grote kaart voor de gekozen tool (zonder geldige keuze allebei): Claude Code via claude.com/product/claude-code, Codex via openai.com/codex. Downloaden, installeren, inloggen met je Claude- of ChatGPT-account; bij Claude daarna het tabblad Code.
3. **Maak een GitHub-account.**
4. **Installeer GitHub Desktop** via github.com/apps/desktop en log in met GitHub. Alleen bij Windows met Claude Code staat er een regel bij: vraagt de Claude-app om Git, installeer dan Git for Windows.
5. **Maak je repo** via "Use this template" op de starter-repo. Geef hem de naam van je onderneming en zet hem op Private. Een knop "Waarom een repo en geen gedeelde map?" opent een pop-up met vier redenen: het platform kan meekijken, git bewaart elke versie, je went aan nakijken voor je iets overneemt, en je AI kan in de cloud op de repo werken.
6. **Koppel het platform aan je repo.** In de pilot log je in met GitHub en kies je de repo. In de demo is dit nagebootst.
7. **Zet je repo op je computer en open hem in je AI.** In GitHub Desktop: File › Clone repository, je repo, een map in Documenten. Daarna open je die map in je AI-app (bij Claude het tabblad Code). De AI leest `AGENTS.md` en stelt zich voor.
8. **Je eerste opdracht.** Je AI vult `werkplek.md` met je in en haalt de markering weg. Jij legt het vast in GitHub Desktop met Commit to main en zet het online met Push origin.

Branches en pull requests komen in een later level terug; de gewoonte "de AI stelt voor, ik keur goed" hoort daar.

**Check:** `setup.md` bestaat en `werkplek.md` is ingevuld. **Mijlpaal:** je AI werkt in je eigen repo en je eerste wijziging staat online.

### Level 1: Idee

1. **Idee uiteenzetten.** Wat ga je doen, voor wie, en waarom jij? → `idee.md`
2. **Visie.** → `visie.md`
3. **Eerste waardepropositie als madlib:** "Mijn bedrijf, [naam] biedt [aanbod] voor [doelgroep] die [probleem/behoefte] met [USP]." → `madlib.md`
4. **Aannames markeren.** Elke aanname krijgt een label: wens, haalbaar of rendabel. → `aannames.md`
5. **AI-stap:** laat de propositie kritisch toetsen met skill `propositie-validator`.

**Check:** alle vier de bestanden zijn ingevuld, en `aannames.md` bevat minstens 3 aannames.

### Level 2: Probleem-validatie

1. **Doelgroep.** Voor wie creëer je waarde? Wie gebruikt je oplossing? Wie betaalt? Wie beslist? Daarnaast kies je B2B of B2C. → `doelgroep.md`, met frontmatter `type` en `interviews_nodig` (standaard 5 voor B2B en 15 voor B2C, aan te passen).
2. **Interviewvragen.** Het gestructureerde interview heeft 8 vragen. Vraag 1–4 vult het platform vooraf in: segment, locatie, rol en beslisser (DMU). Vraag 5–8 (kernactiviteit, alternatief, overwegingen, meest genoemde klacht) maak je samen met de AI via skill `interviewhulp`. → `interviewvragen.md`
3. **Interviewen.** Dit doe je echt. Regels: niet over je idee praten, en alleen vragen naar wat mensen nu doen, niet naar de toekomst.
4. **Transcripts.** Op het platform staan uploadvakken met een vinkje. Een vinkje betekent dat het bestand in de repo staat. Een transcript komt erin via upload of via skill `transcriberen`. → `interviews/NN-<rol>.md`
5. **Analyse.** Volgens het format van de workshop: een tabel met kernactiviteit, alternatief, overwegingen en klachten, plus een inzichtzin. Dit gaat via skill `interview-analyse`. → `analyse.md`

**Check:** `doelgroep.md` en `interviewvragen.md` zijn ingevuld, er staan minstens `interviews_nodig` ingevulde transcripts, en `analyse.md` is ingevuld.

## Starter-repo (template voor deelnemers)

```
README.md
AGENTS.md          ← de enige bron van AI-instructies (Codex leest dit)
CLAUDE.md          ← bevat alleen "@AGENTS.md" (import voor Claude Code)
.gitignore         ← audio (*.m4a, *.mp3, *.wav) komt nooit in de repo
skills/<naam>/SKILL.md   ← propositie-validator, interviewhulp, transcriberen, interview-analyse
level-0-werkplek/werkplek.md
level-1-idee/{idee,visie,madlib,aannames}.md
level-2-probleemvalidatie/{doelgroep,interviewvragen,analyse}.md
level-2-probleemvalidatie/interviews/
```

- **"Ingevuld"** betekent: het bestand bestaat en bevat de marker `<!-- invullen -->` niet meer. Elk templatebestand begint met die marker.
- **Structuurvelden** staan als YAML-frontmatter.
- **Skills** volgen het Agent Skills-formaat: frontmatter met `name` en `description`, gevolgd door instructies. `AGENTS.md` noemt elke skill en zegt wanneer de AI hem leest. Daarmee werken ze in beide tools, ook als een tool `skills/` niet zelf ontdekt. De eerste versies van `propositie-validator` en `interviewhulp` zijn gebaseerd op de bestaande GPT-instructies van Morgen.
- **AVG:** de repo is privé, transcripts worden gepseudonimiseerd (de skill vervangt namen door rol en initialen), audio blijft lokaal, en het interviewscript begint met een toestemmingszin.

## Platform

### Schermen

- **Levelkaart.** Genummerde bollen op een stippellijn, zoals het stappenplan-beeld. Elk level heeft een status: af, actief of op slot. Bij een level op slot zie je de beschrijving en de mijlpaal.
- **Levelpagina.** Een lijst met stappen. Elke stap heeft korte uitleg, een actie (formulier, checklist of uploadvakken), een kopieerblok "Vraag je AI" met een kant-en-klare prompt, en een live check.
- **Paneel "Jouw repo".** Een bestandsboom van de repo. Een nieuw bestand licht kort op en is aan te klikken om te lezen.
- **Demobalk.** Alleen in demomodus. Bevat een resetknop en per stap een knop "Doe alsof je AI dit deed" voor wat normaal buiten het platform gebeurt: je eerste wijziging pushen, een transcript maken of een analyse schrijven. Die knoppen schrijven voorbeeldbestanden in de nep-repo.

### Onderdelen

| Onderdeel | Taak | Hangt af van |
|---|---|---|
| `RepoAdapter` (interface) | `getInfo()`, `listFiles()`, `readFile(path)`, `writeFile(path, content, message)` | — |
| `MockRepoAdapter` | nep-repo in localStorage; valt terug op geheugen als localStorage niet werkt | `RepoAdapter` |
| `levels/` | per level de stappen, velden, outputbestanden en checks (TypeScript-config) | — |
| `evaluateLevel(level, snapshot)` | pure functie die per check `ok` en een reden geeft, plus `af` | `levels/` |
| `levelStatus(levels, snapshot)` | af / actief / op slot voor alle levels | `evaluateLevel` |
| `toMarkdown(frontmatter, body)` en `parseMarkdown(text)` | Markdown met frontmatter maken en lezen | — |
| `content/levels/level-N/*.md` | uitlegteksten die Harmen zonder code kan aanpassen | — |
| UI (React) | schermen hierboven, in Morgen-huisstijl | alles hierboven |

`RepoSnapshot` bevat `{ files: Record<path, content>, mergedPullRequests: number }`. De checks werken alleen op een snapshot, zodat dezelfde logica straks ook met een echte GitHub-repo werkt.

### Datastroom

Een formulier gaat via `toMarkdown` naar `adapter.writeFile`. Daarna maakt het platform een nieuwe snapshot, en `levelStatus` levert de nieuwe status op. Daarop worden de levelkaart, de checks en het repo-paneel opnieuw getekend.

### Foutafhandeling

- Als het schrijven mislukt, krijg je een melding en een knop om het opnieuw te proberen. Formulierinvoer blijft staan.
- Elke lees- en schrijfactie op localStorage zit in een try/catch, met terugval op geheugen.
- Onbekende of kapotte frontmatter laat de check falen met een leesbare reden, niet met een crash.

### Stack

Vite, React, TypeScript, Tailwind en Vitest, in Morgen-huisstijl (Barlow, paars, geel-groen accent). Hosting komt later op Netlify, maar alleen na akkoord. In de pilot komen er Netlify Functions en een GitHub App bij voor inloggen en commits.

## Repo-indeling (`morgenacademy/ondernemenmetai`)

```
platform/        Vite-app
starter-repo/    inhoud van de template (later een eigen repo)
content/levels/  uitleg per level
docs/            specs en plannen
context/         lokaal bij Harmen, niet in git
```

## Buiten scope in fase 1

Echte GitHub-koppeling, inloggen, trainersoverzicht, de inhoud van level 3–6, het testen van installatieroutes op echte machines, en echte transcriptie met Whisper. Dat zit allemaal in fase 2 en 3.

## Nog uitzoeken

- Waar Codex skills uit de repo leest. Als dat niet lukt, gebruiken we de verwijzing in `AGENTS.md` als fallback.
- Lokale Whisper op Windows (fase 2).
- GitHub App tegenover OAuth-scopes (fase 2).

## Testen

- **Vitest:** `evaluateLevel` voor elk level. Bijvoorbeeld: met 4 van de 5 transcripts blijft het level op slot, met 5 gaat het open, en bestanden met de marker tellen niet mee. Verder `levelStatus` (op volgorde unlocken), `toMarkdown`/`parseMarkdown` (round-trip, kapotte frontmatter) en `MockRepoAdapter` (schrijven, lezen, reset, terugval).
- **Handmatig in de browser:** level 0 tot en met 2 doorlopen in demomodus, controleren dat bestanden in het repo-paneel verschijnen, dat level 3 op slot blijft, dat reset werkt, en dat het op mobiele breedte goed staat.
- **Starter-repo:** openen in Claude Code en in Codex, en controleren dat `AGENTS.md` wordt opgepakt en dat `propositie-validator` werkt op voorbeeldinput.
