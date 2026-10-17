# Ontwerp: welkomst, routekaart en Level 0 (werkplek)

Datum: 17 oktober 2026, bijgewerkt 18 oktober · Status: schetsen goedgekeurd door Harmen (16 en 17 oktober), gebouwd in PR #5. Dit document beschrijft wat er gebouwd is en waarom.

Klikbare schetsen: `docs/superpowers/schetsen/2026-10-16/` (begin bij `welkom-v4.html`). Bij twijfel geldt wat de schetsen laten zien, tenzij dit document het anders zegt.

## Waarom

Een deelnemer (student of iemand in een training van Morgen) komt binnen en moet binnen een paar minuten drie dingen snappen en voelen:

1. **We gaan echt een onderneming opzetten.** Je toetst of mensen je idee willen, maakt een eerste versie en brengt die naar de markt. Met een beetje geluk heb je onderweg je eerste klant. Dat moet energie geven, want daarvoor komen mensen.
2. **Eerst maken we pas op de plaats.** Normaal begin je meteen met ideeën. Hier richt je eerst je werkplek in, zodat alles wat je later ophaalt op één plek komt, waar je AI bij kan. Dat is nieuw, ook voor docenten.
3. **Je leert onderweg hoe je AI slim inzet,** en op die manier van werken bouw je nog jaren voort.

Wat Harmen in de eerste versie stoorde: te veel tekst en vakjes ("ik kijk en ik haak af"), en stappen waarbij je niet weet waar je moet klikken ("waar doe ik dit?"). De schetsen lossen dat op met beeld, één zin per scherm, en stappen die je één voor één doet.

## Doelen

- Een **welkomstscherm** dat je meeneemt: beeld en één zin per scherm, met de route als kaart.
- Een **routekaart** als startpunt van het platform. Je ziet waar je staat, je loopt zichtbaar verder, en je kiest het volgende level zelf.
- **Level 0** zonder terminal, stap voor stap, met focus op de stap waar je bent. Bij elke stap zie je waar je hem doet.
- Een **slotscherm** per afgerond level: wat je nu hebt, waar je staat, en wat er komt.

## Niet in dit ontwerp

- Echte schermafbeeldingen van GitHub en GitHub Desktop. Tot die er zijn, blijven de schermen nagetekend, zoals in de schetsen. Echte schermafbeeldingen vragen een testaccount en een gepubliceerde starter-repo.
- Een echte koppeling met GitHub (fase 2). In de demo blijft koppelen nagebootst.

## Wat het niet mag worden

- Een pagina vol tekst en vakjes.
- Een stap waarbij de deelnemer niet weet waar hij moet klikken, of een plaatje van een knop die hij niet kan aanklikken.
- Een melding die iets beweert dat nog niet waar is. Een voorbeeld uit een eerdere schets: "Staat in je repo" terwijl je nog geen repo had.

## Wat besloten is (Harmen)

### Welkomstscherm

- **Een los welkomstscherm, visueel.** Vijf schermen om doorheen te scrollen, elk met één beeld en één zin:
  1. "Je start je eigen bedrijf." — `start.webp`
  2. "Zes stappen naar de markt" — de route
  3. "Eerst je basiskamp." — `werkplek.webp`
  4. "Dan de markt op." — `markt.webp`
  5. "Tot je eerste klant." — `klanten.webp`, met de knop "Bekijk je route"
- **De route loopt zigzag, zoals in de launch path.** Tussen 1 en 2 en tussen 4 en 5 draait een lichtje rond met "↻ heen en weer". Harmen vroeg om de lus tussen 4 en 5; die tussen 1 en 2 komt uit de launch path-PDF.
- **Eén beeldserie in Morgen-kleuren** voor alles: dezelfde hoofdpersoon, nachtpaars met spaarzaam limoen.

### Routekaart

- **Het startbeeld is de levelkaart.** Het pad heeft precies zeven lichtjes; dat zijn level 0 tot en met 6. De stad met de raket is het einddoel.
- **Op de kaart staan geen lussen;** dat houdt het beeld eenvoudig.
- **Jij staat steeds verder op het pad,** bij je huidige level. Verder weg ben je kleiner.
- **Na een afgerond level ga je terug naar de routekaart.** Daar loop je zichtbaar naar het volgende lichtje. Een wijzer met een hupje wijst het aan, en je klikt het zelf aan. Het platform kiest het volgende level niet voor je.
- **Overal staat "Afgerond", niet "Af".**

### Level 0

- **Vier scènes:** "Eerst je basiskamp", "De patronen ontstonden in je hoofd" (vroeger deed je alles zelf, en dat blijft waardevol), "Je AI kijkt mee", en "Die plek heet een repo". Bij die laatste staat een uitleg van het woord repo: kort voor repository, Engels voor bewaarplaats.
- **De stappen staan als kaarten, in de opzet van het overzicht:** groot voorbeeldscherm boven, rustige tekst eronder.
- **Het stappenblok is licht.** Accenten zijn paars, omdat limoen op wit slecht leesbaar is.
- **Focus:** je huidige stap heeft een rand en ligt iets hoger. Een afgeronde stap krijgt een vinkje. Latere stappen zijn grijs, krijgen een slotje en zijn nog niet te openen.
- **Een kaart openen geeft een venster:** het scherm links, de handelingen rechts.
- **Wat je op het platform doet, doe je in dat venster echt.** Bij setup, download en koppelen staat links het echte formulier of de echte knop, geen plaatje.
- **Wat buiten het platform gebeurt, blijft een schermafbeelding,** met een knop die die plek opent, of een kopieerblok voor je AI.
- **Bij elke stap staat waar je hem doet.**
- **De uitleg rechts loopt mee:** gedaan krijgt een vinkje, de huidige handeling is vet, de rest is grijs. Links staat in stappen die je op twee plekken doet steeds waar je bent, bijvoorbeeld "1 · Hier op het platform", dan "2 · Nu ben je op GitHub", dan "3 · Terug op het platform".
- **Kan "Volgende stap" nog niet, dan staat eronder waarom.**
- **Na de stappen komt een slotscherm.** "Je basiskamp staat." met wat je nu hebt, een strook van de routekaart met jou bij het basiskamp en het lichtje van Idee, en "Tijd voor je idee." Na de laatste stap scrolt de pagina daar vanzelf heen.
- **De volgorde van de stappen** liet Harmen aan mij ("jij kunt best beoordelen wat technisch makkelijkst werkt"). Het werd: eerst GitHub, dan de setup. Zie hieronder.

### Al gebouwd

- **AGENTS.md** laat de AI elke sessie eerst `git pull` doen, in één zin melden wat er binnenkwam, en bij een conflict stoppen met uitleg. Dit staat op `main`.

## Mijn keuzes (te controleren door Harmen)

1. **Volgorde van Level 0:** GitHub-account → repo maken (template, Private, met de pop-up "Waarom een repo en geen gedeelde map?") → koppelen → setup → AI-app downloaden → GitHub Desktop → clonen → eerste opdracht.
   - Bij de setup bestaat je repo al, dus het platform kan `setup.md` meteen in je repo zetten.
   - `setup.md` staat in je repo vóór je cloont, dus in Level 0 hoef je nooit te pullen.
   - Koppelen geldt meteen als inloggen bij het platform.
   - Mac of Windows doet er pas toe vanaf het downloaden.
2. **Het welkomstscherm verschijnt bij het eerste bezoek.** Dat het al gezien is, onthoudt de browser. Op de routekaart staat "Bekijk de intro opnieuw". Dit is een gemak per bezoeker, en hoort dus niet in de repo.
3. **De routekaart is de startpagina.** Klik je een lichtje aan, dan zie je onder de kaart het level met een knop "Begin met…" of "Ga verder met…". Die knop opent de levelpagina. Op elke levelpagina staat bovenaan "← Jouw route".
4. **Het slotscherm is het tussenscherm van elk level.** De branch `claude/determined-noether-3a2004` heeft een tussenscherm met wat je haalde, wat je leerde en wat in je repo staat (`doel`, `begrip`, `kern`). Dat wordt het slotscherm in deze vormgeving, met per level de lijst "Dit heb je nu".
5. **Stappen die je zelf afrondt** (account, repo, GitHub Desktop, clonen) vink je af met een knop als "Klaar, ik heb een account". Het platform kan die stappen niet in de repo zien. Dat vinkje bewaart het platform zelf, in de demo in de browser, en nooit in de repo. Stappen die het platform wel kan zien (setup, koppelen, eerste opdracht) gaan vanzelf op Klaar.
6. **Plekken per stap.** De term "Hier op het platform" wordt de plek `platform` uit die branch. GitHub Desktop installeren en clonen worden `github-desktop`, de eerste opdracht `ai-app` en daarna `github-desktop`.
7. **De beelden staan in het platform als WebP** (samen 1,3 MB; eerst 3,6 MB als JPG en PNG).
8. **Beweging:** bij `prefers-reduced-motion` lopen er geen lichtjes rond, maakt de wijzer geen hupje en loopt de hoofdpersoon niet. Ze staat dan meteen op haar plek. Nog open: op het welkomstscherm draaien de twee lichtjes van de lussen dan nog wel rond.
9. **Mobiel:** de routekaart zoomt in op het stuk van het pad, van ongeveer 39% tot 94% van de breedte. Zo passen alle zeven lichtjes op 375 px. De labels staan dan alleen bij je huidige en je gekozen level.

## Na de bouwer-check (17 oktober)

Een reviewer las dit ontwerp als bouwer en stelde drie vragen. Ik heb ze zelf beantwoord, omdat geen van de antwoorden verandert wat er gebouwd wordt:

1. **De schil.**
   - "Jouw repo" is een lade, met een knop in de bovenbalk die pas verschijnt na het koppelen (of als level 0 af is). Daarvoor zou het paneel een repo laten zien die er voor het platform nog niet is.
   - De knop "Ik heb een klant" staat vanaf level 1 onder de routekaart.
   - Onder de kaart staat ook "Demo: zet je voortgang": daarmee spring je naar een level, en de levels ervoor vult de demo met demo-content. Daar staat ook "Opnieuw beginnen".
2. **Level 1 tot en met 6** krijgen dezelfde opbouw als level 0:
   - het beeld van het level en de scène met het nieuwe begrip;
   - de stappen als kaarten met een venster;
   - het slotscherm, altijd onderaan de pagina.

   De teksten daarvoor staan in `platform/src/beleving/beleving.ts`. Ze komen uit de levels-opzet van 16 oktober en moeten nog door Harmen gelezen worden. Codex maakte voor level 1, 3, 4 en 5 beelden in dezelfde serie.
3. **Level 6 en het einde van de route.**
   - Gaat level 6 eerder open (je hebt een klant), dan krijgt dat lichtje ook een pulserende ring.
   - Jij blijft bij je eerste level dat nog bezig is. Is alles af, dan sta je bij het zesde lichtje.

## Hoe het werkt

### Waar je bent en wat je ziet

| Situatie | Wat je ziet |
|---|---|
| Eerste bezoek | Welkomstscherm, en daarna de routekaart |
| Daarna | De routekaart met jou bij je huidige level |
| Lichtje aangeklikt | Onder de kaart: naam, doel, mijlpaal en de knop naar het level. Bij een level op slot: "Gaat open zodra je level N hebt afgerond." |
| Op een levelpagina | Bovenaan "← Jouw route" |
| Level net afgerond | Slotscherm op de levelpagina, dan de knop naar je route. Daar loop je naar het volgende lichtje, verschijnt de melding "Level N afgerond. Op naar …!", en wijst de wijzer het lichtje aan. Onder de kaart staat "✓ Afgerond. Klik op de kaart op het lichtje van level N+1 om verder te gaan." |

### De routekaart

- Ondergrond: `start-leeg.webp`. Daaroverheen de hoofdpersoon `jij.webp`. De maten staan als `HALTES` in `platform/src/beleving/beleving.ts`.
- De plek van elk lichtje in procenten van het beeld (gemeten op de lichtpunten), en waar de hoofdpersoon dan staat:

| Level | Lichtje (x, y) | Voeten (x, y) | Hoogte (% van beeldhoogte) |
|---|---|---|---|
| 0 | 49,9 · 76,7 | 45,5 · 85 | 40 |
| 1 | 73,4 · 69,4 | 72,0 · 70,6 | 9 |
| 2 | 83,3 · 62,0 | 82,3 · 63,0 | 6 |
| 3 | 73,5 · 55,4 | 72,7 · 56,2 | 4,5 |
| 4 | 84,6 · 49,9 | 84,0 · 50,5 | 3,6 |
| 5 | 89,0 · 46,1 | 88,5 · 46,6 | 3 |
| 6 | 84,6 · 43,1 | 84,1 · 43,6 | 2,6 |

- Het venster toont de band van y 32% tot 94% van het beeld.
- Een lichtje is een knop met een `aria-label` als "Level 2: Probleem-validatie, op slot".
- **Afgerond:** een ring in limoen. **Nu bezig:** een pulserende ring. **Op slot:** gedimd, met een slotje in het label.
- Level 6 gaat open zodra je een klant hebt, ook als eerdere levels nog niet af zijn (zie `opensEarly` in de levels-opzet). De kaart laat dat lichtje dan als open zien.

### Level 0: stappen, plekken en klaar

| # | Stap | Plek | Klaar als | In het venster |
|---|---|---|---|---|
| 1 | Maak een GitHub-account | GitHub | de deelnemer vinkt af | nagetekend scherm, knop "Open GitHub ↗" |
| 2 | Maak je repo | GitHub | de deelnemer vinkt af | nagetekend scherm, knop "Waarom een repo en geen gedeelde map?" (bestaande pop-up) |
| 3 | Koppel het platform | Platform → GitHub → Platform | koppeling gelukt (in de demo: nagebootst) | echte knop "Verbind met GitHub", dan het GitHub-scherm met "2 · Nu ben je op GitHub", dan "✓ Gekoppeld" |
| 4 | Kies je setup | Platform | `setup.md` staat in de repo (check) | echt formulier: Mac/Windows, Claude (Pro of hoger) of ChatGPT (Plus of hoger), knop "Zet in je repo" |
| 5 | Download je AI-app | Platform → AI-app | de deelnemer vinkt af | echte downloadkaart voor alleen jouw app (bestaand `DownloadStap`) |
| 6 | Installeer GitHub Desktop | GitHub Desktop | de deelnemer vinkt af | nagetekend scherm, knop "Download GitHub Desktop ↗", uitleg per Mac/Windows, en bij Windows met Claude Code de regel over Git for Windows |
| 7 | Zet je repo op je computer | GitHub Desktop → AI-app | de deelnemer vinkt af | nagetekend scherm, kopieerblok "Lees AGENTS.md en vertel me in drie zinnen…" |
| 8 | Je eerste opdracht | AI-app → GitHub Desktop | `werkplek.md` is ingevuld (check) | nagetekend scherm, kopieerblok met de opdracht, de check, en in de demo de knop "Demo: doe alsof je AI werkplek.md invulde en jij hem pushte" |

- Level 0 is afgerond als `setup.md` en `werkplek.md` zijn ingevuld. Dat staat al zo in de code.
- De vinkjes die de deelnemer zelf zet, bepalen alleen welke kaart "Nu" is. Of het level af is, bepalen ze niet.

### Teksten

- De teksten uit de schetsen zijn de basis.
- Ze volgen de Morgen-schrijfstijl: concreet, kort, je/jij, geen "niet X maar Y". Waar de schets en `content/levels/level-0/` verschillen, krijgt de uitleg de toon van de schets en de inhoud van `content/`.
- De pop-up "Waarom een repo en geen gedeelde map?" blijft zoals hij is.

## Randvoorwaarden

- **Gebouwd op `claude/determined-noether-3a2004` (PR #5).** Die branch heeft plekken per stap, `doel`, `begrip` en `kern` per level, levels 3 tot en met 6 en demo-inhoud voor elke stap. Twee sessies bouwden deze ombouw tegelijk (PR #5 en PR #6). Harmen koos op 18 oktober #5 als basis. Uit #6 kwamen er vier verbeteringen bij:
  - koppelen vink je niet zelf af;
  - "Jouw repo" verschijnt pas na het koppelen;
  - het stapvenster is een echte `<dialog>`;
  - de beelden zijn WebP.
- De repo blijft de bron: levelstatus en checks komen uit de repo-snapshot. Alleen de vinkjes van de deelnemer en "intro gezien" bewaart het platform zelf.
- Toegankelijk:
  - het venster is een echte dialoog: Esc sluit hem, en de focus gaat terug naar de kaart;
  - gedimde kaarten zijn uitgeschakeld en zeggen waarom;
  - lichtjes en wijzer zijn met het toetsenbord te bedienen;
  - kleine tekst haalt AA-contrast, ook in het lichte blok.
- Morgen-huisstijl: Barlow, paars `#5B2D8E`, limoen `#D8FE56` spaarzaam. Op het lichte blok worden accenten paars.
- Werkwijze: TDD met Vitest, Nederlandse commitberichten, een eigen branch en een PR. Harmen merget.

## Aan de bouwer

- De opbouw in componenten. Een mogelijke indeling: `Welkom`, `Routekaart`, `LevelZeroPagina` (scènes, stappenblok, venster, slotscherm) en een algemeen `Slotscherm`.
- De precieze CSS, binnen de huisstijl en de schetsen.
- Hoe het venster zijn inhoud per stap krijgt.
- De demoknoppen: houd ze herkenbaar als demo, zoals nu.

## Testen

- **Vitest**, met eerst een falende test, voor:
  - de nieuwe volgorde van Level 0;
  - de plek per stap;
  - welke kaart "Nu" is;
  - gedimde kaarten zijn uitgeschakeld;
  - de uitleg die meeloopt;
  - "Volgende stap" met de reden waarom hij uit staat;
  - het slotscherm, ook vóór alles klaar is;
  - "Afgerond" in de labels;
  - de routekaart: de juiste staat per lichtje, de wijzer na een afgerond level, en dat het volgende level pas opent als je het aanklikt.
- **In de browser:**
  - welkomst → route → Level 0 → slotscherm → route → wijzer → Level 1;
  - op 375 px breed;
  - met `prefers-reduced-motion`;
  - met alleen het toetsenbord.
