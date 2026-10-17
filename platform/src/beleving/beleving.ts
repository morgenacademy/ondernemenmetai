// De beleving per level, uit de schetsen van 16 oktober (welkom, routekaart en level 0) en doorgetrokken naar level 1 tot en met 6.
// De stappen, checks en teksten van de stappen zelf staan in lib/levels en content/levels; hier staat wat eromheen hoort.

/** Een halte op de routeplaat (start-leeg.jpg), in procenten van de plaat. jx, jy en h: waar de oprichter staat en hoe groot ze is. */
export type Halte = { x: number; y: number; jx: number; jy: number; h: number; kant: 'links' | 'rechts' };

export const HALTES: Record<number, Halte> = {
  0: { x: 49.9, y: 76.7, jx: 45.5, jy: 85, h: 40, kant: 'rechts' },
  1: { x: 73.4, y: 69.4, jx: 72.0, jy: 70.6, h: 9, kant: 'links' },
  2: { x: 83.3, y: 62.0, jx: 82.3, jy: 63.0, h: 6, kant: 'links' },
  3: { x: 73.5, y: 55.4, jx: 72.7, jy: 56.2, h: 4.5, kant: 'links' },
  4: { x: 84.6, y: 49.9, jx: 84.0, jy: 50.5, h: 3.6, kant: 'links' },
  5: { x: 89.0, y: 46.1, jx: 88.5, jy: 46.6, h: 3, kant: 'links' },
  6: { x: 84.6, y: 43.1, jx: 84.1, jy: 43.6, h: 2.6, kant: 'links' },
};

/** Het beeld bij het ene nieuwe begrip van een level. */
export type BegripBeeld = 'repo' | 'twee-plekken' | 'versies' | 'geheugen' | 'agents' | 'skill';

export type Scene =
  | { soort: 'beeld'; beeld: string; label: string; kop: string; zin: string; accent?: string }
  | { soort: 'begrip'; label: string; kop: string; zin: string; woord: string; uitleg: string; beeld: BegripBeeld };

/** Een regel op het slotscherm. Hij krijgt een vinkje zodra deze stap af is. */
export type Heb = { stepId: string; tekst: string };

export type LevelBeleving = {
  beeld: string;
  kop: string;
  zin: string;
  scenes: Scene[];
  stappenKop: string;
  /** Wat de knop op de routekaart zegt, bijvoorbeeld "Begin met je werkplek". */
  knop: string;
  slot: { straks: string; af: string; heb: Heb[] };
  /** Het volgende level, zoals het op het slotscherm van dit level staat. Ontbreekt na level 6. */
  volgende?: { kop: string; zin: string; knop: string };
};

const b = (naam: string) => `/beelden/${naam}`;

export const BELEVING: Record<number, LevelBeleving> = {
  0: {
    beeld: b('werkplek.jpg'),
    kop: 'Eerst je basiskamp.',
    zin: 'Voordat je met je idee begint, richt je de plek in waar al je werk komt te staan.',
    scenes: [
      { soort: 'beeld', beeld: b('vroeger.jpg'), label: 'Zo deed je het altijd', kop: 'De patronen ontstonden in je hoofd.', zin: 'Je verzamelde gesprekken, aantekeningen en ideeën, en zag zelf wat ze verbond. Dat blijft waardevol.' },
      { soort: 'beeld', beeld: b('samen.jpg'), label: 'Nu', kop: 'Je AI kijkt mee.', zin: 'Dan moet alles wat je verzamelt op één plek staan,', accent: 'waar je AI bij kan.' },
      { soort: 'begrip', label: 'Nieuw woord', kop: 'Die plek heet een repo.', zin: 'Eén map voor je onderneming. Online bewaard en alleen voor jou. Je AI leest erin en werkt erin mee, als een assistent die bij je werk kan.', woord: 'repo', uitleg: 'kort voor repository, Engels voor bewaarplaats', beeld: 'repo' },
    ],
    stappenKop: 'Zo richt je je werkplek in.',
    knop: 'Begin met je werkplek',
    slot: {
      straks: 'Zo staat je basiskamp straks.',
      af: 'Je basiskamp staat.',
      heb: [
        { stepId: 'l0-github-desktop', tekst: '<b>GitHub Desktop</b>, waarmee je je werk online zet zonder iets te typen' },
        { stepId: 'l0-repo', tekst: 'Een eigen, privé <b>repo</b> op GitHub' },
        { stepId: 'l0-koppelen', tekst: 'Een <b>platform</b> dat in die ene repo meekijkt' },
        { stepId: 'l0-clonen', tekst: 'Je <b>AI-app</b> op je computer, die in je repo kan lezen en schrijven' },
        { stepId: 'l0-eerste-opdracht', tekst: 'Je <b>eerste wijziging online</b>: werkplek.md' },
      ],
    },
    volgende: { kop: 'Tijd voor je idee.', zin: 'In level 1 zet je samen met je AI je idee, je visie en een eerste waardepropositie op papier. Alles komt meteen in je repo.', knop: 'Op naar je idee' },
  },
  1: {
    beeld: b('idee.jpg'),
    kop: 'Je idee in één zin.',
    zin: 'Je zet je idee, je visie en je aannames neer. Je AI toetst het en maakt er een eerste waardepropositie van.',
    scenes: [
      { soort: 'begrip', label: 'Nieuw woord', kop: 'Je AI haalt het op.', zin: 'Wat je hier op het platform invult, komt op GitHub. Je AI werkt op je computer en haalt het op aan het begin van elke sessie.', woord: 'pull', uitleg: 'ophalen: van GitHub naar je computer', beeld: 'twee-plekken' },
    ],
    stappenKop: 'Zo zet je je idee neer.',
    knop: 'Ga verder met je idee',
    slot: {
      straks: 'Zo staat je idee straks.',
      af: 'Je idee staat.',
      heb: [
        { stepId: 'l1-idee', tekst: 'Je <b>idee</b>: wat je gaat doen, voor wie, en waarom jij' },
        { stepId: 'l1-visie', tekst: 'Je <b>visie</b>: hoe de wereld eruitziet als het lukt' },
        { stepId: 'l1-madlib', tekst: 'Je idee in <b>één zin</b>: je madlib' },
        { stepId: 'l1-aannames', tekst: 'Minstens drie <b>aannames</b>, met een label' },
        { stepId: 'l1-propositie', tekst: 'Een eerste <b>waardepropositie</b> in je canvas, vol aannames' },
      ],
    },
    volgende: { kop: 'Tijd voor de markt.', zin: 'In level 2 interview je je doelgroep. Je ontdekt met je AI wie allemaal hetzelfde probleem hebben.', knop: 'Op naar je interviews' },
  },
  2: {
    beeld: b('markt.jpg'),
    kop: 'Praat met echte mensen.',
    zin: 'Je interviewt je doelgroep over wat ze nu doen. Je AI legt de gesprekken naast elkaar en zoekt het patroon.',
    scenes: [
      { soort: 'begrip', label: 'Nieuw woord', kop: 'Je AI stelt voor, jij beslist.', zin: 'Je interviews en je analyse komen direct in je repo. Je canvas is van jou: daar doet je AI een voorstel, en jij kijkt het na voordat het meetelt.', woord: 'pull request', uitleg: 'een voorstel tot wijziging, dat je eerst nakijkt', beeld: 'twee-plekken' },
    ],
    stappenKop: 'Zo vind je je eerste doelgroep.',
    knop: 'Ga verder met probleem-validatie',
    slot: {
      straks: 'Zo staat je eerste doelgroep straks.',
      af: 'Je eerste doelgroep staat.',
      heb: [
        { stepId: 'l2-doelgroep', tekst: 'Je <b>doelgroep</b>: gebruiker, betaler en beslisser' },
        { stepId: 'l2-interviews', tekst: 'Je <b>interviews</b>, zonder namen, in je repo' },
        { stepId: 'l2-analyse', tekst: 'Een <b>analyse</b> en je <b>eerste doelgroep</b>, met het bewijs erbij' },
        { stepId: 'l2-canvas', tekst: 'Een <b>bijgewerkt canvas</b>, via je eerste pull request' },
      ],
    },
    volgende: { kop: 'Tijd voor je oplossing.', zin: 'In level 3 bedenk je zoveel mogelijk oplossingen, kies je er één en maak je er een eerste versie van.', knop: 'Op naar je prototype' },
  },
  3: {
    beeld: b('prototype.jpg'),
    kop: 'Maak iets wat je kunt laten zien.',
    zin: 'Eerst breed: zoveel mogelijk oplossingen. Dan kies je er één, en bouw je er een MVP van.',
    scenes: [
      { soort: 'begrip', label: 'Nieuw woord', kop: 'Je repo onthoudt elke versie.', zin: 'Je madlib en je canvas hebben nu drie versies: je eerste idee, na je interviews, en voor je oplossing. In GitHub Desktop zie je wat er veranderde, en je kunt terug.', woord: 'geschiedenis', uitleg: 'elke commit is een versie waar je naar terug kunt', beeld: 'versies' },
    ],
    stappenKop: 'Zo maak je je MVP.',
    knop: 'Ga verder met je prototype',
    slot: {
      straks: 'Zo staat je MVP straks.',
      af: 'Je MVP staat.',
      heb: [
        { stepId: 'l3-oplossingen', tekst: 'Minstens <b>tien ideeën</b> voor je oplossing' },
        { stepId: 'l3-kiezen', tekst: 'Een <b>gekozen oplossing</b>, en wat afviel' },
        { stepId: 'l3-verwoorden', tekst: 'Je <b>waardepropositie</b> voor die oplossing' },
        { stepId: 'l3-mvp-kiezen', tekst: 'Je <b>riskantste aanname</b> en het MVP dat hem toetst' },
        { stepId: 'l3-bouwen', tekst: 'Je <b>MVP</b>, in je repo' },
      ],
    },
    volgende: { kop: 'Terug naar je mensen.', zin: 'In level 4 laat je je MVP zien aan de mensen die je interviewde, en doe je je voorstel.', knop: 'Op naar je feedback' },
  },
  4: {
    beeld: b('feedback.jpg'),
    kop: 'Wat vinden ze ervan?',
    zin: 'Je gaat met je MVP terug naar je mensen. Je laat ze proberen, doet je voorstel, en vraagt bij nee waarom.',
    scenes: [
      { soort: 'begrip', label: 'Nieuw woord', kop: 'Je repo is het geheugen van je AI.', zin: 'Je AI weet nog wat 01-apotheker in level 2 vertelde. Dat onthoudt hij niet zelf: het staat in je repo, en hij leest het.', woord: 'geheugen', uitleg: 'alles wat je vastlegt, kan je AI later gebruiken', beeld: 'geheugen' },
    ],
    stappenKop: 'Zo haal je je feedback op.',
    knop: 'Ga verder met je feedback',
    slot: {
      straks: 'Zo staat je eerste ronde straks.',
      af: 'Je eerste ronde staat.',
      heb: [
        { stepId: 'l4-prijs', tekst: 'Een <b>prijs</b>, en een schatting van je kostprijs' },
        { stepId: 'l4-testkaart', tekst: 'Een <b>testkaart</b>: wat je van deze ronde verwacht' },
        { stepId: 'l4-terugbellen', tekst: 'Een <b>spiekbriefje</b> per persoon' },
        { stepId: 'l4-voorstel', tekst: 'Van genoeg mensen een <b>antwoord</b>, en waarom' },
        { stepId: 'l4-resultaat', tekst: 'Een <b>resultaatkaart</b> met je besluit' },
      ],
    },
    volgende: { kop: 'Maak het beter.', zin: 'In level 5 ontwikkel je door op de redenen van nee, en ga je terug, tot je zegt: hier ga ik voor.', knop: 'Op naar je product' },
  },
  5: {
    beeld: b('product.jpg'),
    kop: 'Tot je zegt: hier ga ik voor.',
    zin: 'Je pakt de redenen van nee op, gaat terug naar de markt, en kiest.',
    scenes: [
      { soort: 'begrip', label: 'Nieuw woord', kop: 'Je AI leest eerst AGENTS.md.', zin: 'Elke sessie begint je AI daar. Nu je product staat, schrijf je er zelf bij wie je klanten zijn, wat je verkoopt en voor welke prijs.', woord: 'AGENTS.md', uitleg: 'het bestand waar elke sessie van je AI mee begint', beeld: 'agents' },
    ],
    stappenKop: 'Zo kom je tot je product.',
    knop: 'Ga verder met je product',
    slot: {
      straks: 'Zo staat je product straks.',
      af: 'Je gaat ervoor.',
      heb: [
        { stepId: 'l5-doorontwikkelen', tekst: 'Een <b>betere versie</b>, op de redenen van nee' },
        { stepId: 'l5-terug', tekst: 'Een <b>tweede ronde</b> bij dezelfde mensen' },
        { stepId: 'l5-besluit', tekst: 'Je <b>besluit</b>, met het bewijs uit je rondes' },
        { stepId: 'l5-bmc', tekst: 'Je <b>Business Model Canvas</b>' },
        { stepId: 'l5-agents', tekst: 'Je onderneming in <b>AGENTS.md</b>' },
      ],
    },
    volgende: { kop: 'Op naar je eerste klant.', zin: 'In level 6 leg je vast hoe je verkocht, en houd je je volgende klanten bij.', knop: 'Op naar je lancering' },
  },
  6: {
    beeld: b('klanten.jpg'),
    kop: 'Je eerste klant.',
    zin: 'Iemand betaalt voor wat je maakte. Nu leg je vast hoe dat ging, zodat het nog eens lukt.',
    scenes: [
      { soort: 'begrip', label: 'Nieuw woord', kop: 'Je schrijft je eigen skill.', zin: 'Je AI gebruikte de hele route skills van Morgen. Nu schrijf je er zelf een: de stappen waarmee jij verkoopt, zodat je AI elk volgend gesprek zo voorbereidt.', woord: 'skill', uitleg: 'vaste stappen die je AI elke keer volgt', beeld: 'skill' },
    ],
    stappenKop: 'Zo maak je verkopen herhaalbaar.',
    knop: 'Ga verder met je lancering',
    slot: {
      straks: 'Zo staat je lancering straks.',
      af: 'Proof of Concept.',
      heb: [
        { stepId: 'l6-klant', tekst: 'Je <b>eerste betalende klant</b>' },
        { stepId: 'l6-verkoopaanpak', tekst: 'Je <b>verkoopaanpak</b>, als eigen skill' },
        { stepId: 'l6-pijplijn', tekst: 'Een <b>pijplijn</b> met je volgende klanten' },
        { stepId: 'l6-impact', tekst: 'Je <b>impact</b>, per kapitaal' },
      ],
    },
  },
};
