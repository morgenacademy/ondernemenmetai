# Ontwerp: een eigen speelbord per level

Datum: 18 oktober 2026 · Status: schetsen goedgekeurd door Harmen ("super dit"). Nog niet gebouwd.

Klikbare schets: `docs/superpowers/schetsen/2026-10-18/speelborden.html`. Daarin staan level 1 tot en met 6 achter elkaar. In level 2 kun je een leeg vak openen en aantekeningen in een vak zetten. Bij twijfel geldt wat de schets laat zien, tenzij dit document het anders zegt.

Bouwt voort op `2026-10-17-intro-routekaart-werkplek-design.md`. Welkomstscherm, routekaart, level 0 en slotscherm blijven zoals daar beschreven.

## Waarom

Na de ombouw zag elk level er hetzelfde uit: een licht blok met stapkaarten, en elke stap in een pop-up. Bij level 0 past dat, want daar richt je stap voor stap je werkplek in. Bij de levels daarna niet. Harmen: "elk level heeft z'n eigen speelbord". Je vult je eerste zin in het platform zelf in, want dat is je werkblad. Je interviews zet je ook in het platform, niet in een pop-up. Elk level laat zien wat je er doet en wanneer je het hebt gehaald.

## Doelen

- Een level voelt alsof je erin zit: beeld, sfeer en één werkblad dat bij dat level hoort.
- Je ziet meteen wat af is, waar je nu bent en wat er nog komt, zonder veel te lezen.
- Wat je invult, vul je in op het werkblad zelf. Voor levels 1 tot en met 6 is er geen pop-up meer per stap.

## Wat het niet mag worden

- Elk level dezelfde kaarten met een venster erachter.
- Een plaatje van iets waar je op wilt klikken, maar dat niets doet. (Harmen klikte in de schets meteen op het plusje van een leeg vak.)
- Zinnen waar een beeld volstaat, zoals "Bij 5 van 5 gaan open: …".

## Wat besloten is (Harmen)

### De regel voor elk level

- **Het level is donker en sfeervol:** het beeld van het level, één vraag en één zin.
- **Het werkblad is licht,** in de vorm die bij het level past. Zo is het verschil groot tussen uitleg (donker) en wat jij doet (licht).
- **Wat af is,** staat bovenaan als een regel met een vinkje.
- **Wat nog komt,** ligt onder het werkblad: even breed, onder elkaar, grijs en op slot. De inhoud schemert door een grijze laag heen. In het midden staat een slotje met een korte reden, bijvoorbeeld "nog 2 gesprekken" of "eerst je zin". Het is geen wit vlak, en er staat geen zin onder.
- **Rustig, zoals een Apple-app:**
  - koppen in 600 tot 700, niet in 900;
  - dunne randen en veel ruimte;
  - een leeg vak ziet er leeg uit: dunne lijn, een kleine "+" en "Nog leeg".
- **Level 0 blijft zoals het is:** lichte stapkaarten met een venster.

### Level 2: je gesprekken

- **Het aantal vakken volgt uit je doelgroep.** Je kiest het niet zelf: verkoop je aan bedrijven, dan zijn het er 5, verkoop je aan consumenten, dan 15. Het veld "Aantal interviews" verdwijnt uit het formulier.
- **"Bepaal je doelgroep" en "Je interviewvragen" doe je één keer vooraf.** Daarna staan ze bovenaan als vinkje. Analyseren en je canvas bijwerken komen na de vakken.
- **Je vult de vakken in de loop van dagen.** Na drie gesprekken vul je er drie. Morgen doe je er één, en dan vul je vak 4.
- **Liefst een opname.** De opname blijft op je computer. Alleen het uitgeschreven `.md`-bestand gaat naar je repo.
- **Je AI schrijft de opname uit,** met een skill. De skill:
  - schrijft het gesprek uit;
  - hernoemt de opname en het bestand, bijvoorbeeld `04-apotheker-utrecht.m4a` en `04-apotheker-utrecht.md`;
  - zet de mooiste uitspraak bovenaan in de `.md`;
  - legt vast en pusht.

  De naam van de skill komt nog. In de schets vraag je "Schrijf mijn nieuwe interviews uit".
- **Een vak telt als gevuld zodra de `.md` in je repo staat.** In een vol vak staan:
  - wie je sprak (rol en plaats, geen naam);
  - wanneer, en hoe lang;
  - één uitspraak.

  Het vak dat net binnenkwam, krijgt "Net binnen".
- **Een leeg vak is een knop.** Klik je erop, dan klapt eronder "Zo vul je een vak" open. Dat geldt voor elk vak, dus er staat geen nummer bij. Het open vak laat zien:
  - vier stappen, elk met waar je hem doet: neem op (buiten), zet de opname in `interviews/` (je computer), laat je AI hem uitschrijven (AI-app, met kopieerblok) en het vak gaat vanzelf aan (hier, met een knop "Ververs");
  - "Geen opname, wel aantekeningen?": een veld voor met wie je sprak, je aantekeningen en de knop "Zet bij je gesprekken". Het platform zet het bestand dan zelf in je repo.
- **Het level is af** als alle vakken vol zijn en je canvas via een pull request is bijgewerkt. Dat staat al zo in de checks.

## Mijn keuzes (te controleren door Harmen)

1. **Het werkblad per level:**

   | Level | Licht werkblad | Daarna, op slot |
   |---|---|---|
   | 1 · Idee | Je idee in één zin: de madlib als zin met invulgaten. Idee en visie gaan voor; "Nog geen idee?" is een omlijnde regel bovenaan. | Je aannames, je waardepropositie |
   | 2 · Probleem-validatie | Je gesprekken (zie hierboven) | Je analyse, je canvas |
   | 3 · Prototype | Je oplossingen als plakbriefjes, bijvoorbeeld 7 van 10, met een leeg briefje "Nog een idee" | Kies je oplossing, je MVP |
   | 4 · Markt feedback | Je voorstellen: je mensen uit level 2 met ja, nee of misschien en hun waarom, tegen je drempel. Prijs, testkaart en terugbelgesprekken gaan voor. | Lees je ronde |
   | 5 · Product-validatie | Je rondes: per ronde wat je aanpaste en hoeveel ja, met "Nieuwe ronde" | Ga je ervoor?, je businessmodel, wie je onderneming is |
   | 6 · Lancering | Je pijplijn: kolommen van contact tot opdracht, met verwachte waarde. Je eerste klant en je verkoopaanpak gaan voor. | Je impact |

2. **Van stap naar werkblad.**
   - Elke stap die niet optioneel is, wordt een werkblad.
   - Wat af is, wordt een regel met een vinkje.
   - De stap waar je bent, is het lichte werkblad.
   - Latere stappen zijn grijs.
   - Twee stappen met dezelfde check worden één werkblad. In level 2 zijn dat "Interview je doelgroep" en "Zet je interviews in je repo": ze tellen allebei de bestanden in `interviews/`.
   - Optionele stappen worden een omlijnde regel bovenaan.
3. **Hoe een werkblad eruitziet, per soort stap:**
   - **Formulier:** de velden staan op het werkblad zelf. Waar het kan staan ze in de vorm van het resultaat, zoals de madlib als zin.
   - **AI-stap:** het werkblad toont het vlak waar het resultaat komt, met het kopieerblok voor je AI. Is de stap af, dan staat het resultaat erin.
   - **Voortgang:** vakken, zoals in level 2.
   - De uitlegknoppen die nu in het venster staan (bijvoorbeeld "Wat is een pull request?") worden kleine links op het werkblad.
4. **Je AI pusht interviews direct, zonder pull request.** Het zijn ruwe gegevens. Pull requests blijven voor wijzigingen aan je eigen werk, zoals je canvas.
5. **Het platform ververst** zodra je terugkomt in het tabblad, en met de knop "Ververs". Het platform kijkt naar GitHub, niet naar je computer. Een vak gaat dus pas aan na de push.
6. **Opnames horen niet in git.** De starter-repo krijgt een `.gitignore` voor `interviews/*.m4a`, `*.mp3`, `*.wav` en `*.mp4`, zodat GitHub Desktop ze niet laat zien.
7. **Klik je op een later leeg vak,** dan opent "Zo vul je een vak" voor het eerstvolgende vak. Je vult de vakken op volgorde.
8. **De demoknop per werkblad blijft,** herkenbaar als demo ("Vul met demo content").

## De skill voor het uitschrijven

Een proef op 18 oktober werkte: zie `docs/superpowers/proeven/2026-10-18-uitschrijven/`. De skill:

- gebruikt `uv` en faster-whisper met vaste versies (`av<19` was nodig);
- downloadt de eerste keer ongeveer 900 MB, daarna niets meer;
- schrijft een gesprek van 30 minuten op een Mac met Apple Silicon in ongeveer 5 minuten uit;
- kan een lijst met vakwoorden meegeven (`initial_prompt`) tegen fouten als "spoedresetten".

Je AI installeert `uv` als dat er nog niet is. De deelnemer keurt alleen goed en typt zelf niets in de terminal.

## Randvoorwaarden

- De repo blijft de bron. Een vak, een vinkje of een werkblad komt uit de repo-snapshot. Alleen de vinkjes van de deelnemer bij stappen zonder check bewaart het platform zelf.
- Privacy:
  - in een interview staat alleen de rol en de plaats, geen naam;
  - het vak zegt: "Vraag eerst of je mag opnemen";
  - opnames blijven op de computer van de deelnemer.
- Toegankelijk:
  - lege vakken zijn echte knoppen;
  - gesloten werkbladen zijn niet te bedienen en zeggen waarom;
  - bij `prefers-reduced-motion` ademt het volgende vak niet en springt "Net binnen" niet.
- Morgen-huisstijl: Barlow, paars `#5B2D8E` en limoen `#D8FE56`. Op licht worden accenten paars.
- Werkwijze: TDD met Vitest, Nederlandse commitberichten, een eigen branch en een PR.

## Aan de bouwer

- De componenten. Een voorstel: één `LevelBord` met per level een eigen werkblad-component, en een gedeeld `GeslotenWerkblad`.
- Hoe het stapvenster van level 0 en de nieuwe werkbladen code delen.
- De precieze CSS, binnen de schets.
- De volgorde van bouwen. Mijn voorstel: eerst de regel met level 1 en 2, dan 3 tot en met 6.

## Nog open

- De skill voor het uitschrijven: de naam, testen op Windows, een echte opname met twee stemmen, en het installeren van `uv`.
- De kleine punten van 17 oktober:
  - de lichtjes op het welkomstscherm bij `prefers-reduced-motion`;
  - templates pas in je repo zetten als een level opengaat;
  - echte schermafbeeldingen;
  - de echte koppeling met GitHub.
- De teksten van level 1 tot en met 6 lezen we bij het doorlopen van de levels.

## Testen

- **Vitest,** met eerst een falende test, voor:
  - van stap naar werkblad: af, nu en op slot;
  - de reden op het slotje;
  - het aantal vakken uit de doelgroep;
  - een vak dat gevuld is zodra de `.md` er staat;
  - een leeg vak als knop;
  - "Zet bij je gesprekken" dat een bestand in de repo zet.
- **In de browser:**
  - level 1 tot en met 6 doorlopen met de demo;
  - in level 2 een vak vullen via de aantekeningen;
  - op 375 px breed;
  - met alleen het toetsenbord.
