# Ondernemen met AI: ontwerp echte GitHub-koppeling (pilot)

Datum: 18 oktober 2026 · Status: goedgekeurd door Harmen van Heist ("Klopt, schrijf het implementatieplan"), basis voor `docs/superpowers/plans/2026-10-18-github-koppeling.md`

Bouwt voort op `2026-10-15-klikbare-demo-design.md` (de demo, de `RepoAdapter` en de checks) en `2026-10-18-speelbord-level-0-design.md` (het pad van level 0, PR #14). PR #14 staat in `main`. De stap Koppelen en de vinkjes van level 0 zitten in `StapBlad` en `WerkplekBord`.

## Waarom

De klikbare demo werkt met een nep-repo in de browser. Voor een pilot met echte deelnemers moet het platform de echte GitHub-repo van de deelnemer lezen en er formulieren in schrijven. De checks, de levels en de schermen blijven hetzelfde. Er verandert alleen waar de bestanden vandaan komen.

De eerste test: Harmen speelt de enige deelnemer, met een nieuw GitHub-account of met een nieuwe repo onder `morgenacademy`. Daarna moet hetzelfde werken voor een groep deelnemers, ieder met een eigen repo.

## Uitgangspunt: jij zegt "dit is het"

Deelnemers leren dat zij verantwoordelijk zijn voor wat er in hun repo staat. De AI helpt, maar de deelnemer beslist. Daarom staat elke wijziging die het platform maakt op naam van de deelnemer, en ziet het platform alleen de repo die de deelnemer zelf aanwijst.

## Besluiten

| Onderwerp | Besluit | Door |
|---|---|---|
| Toegang | Een GitHub App, die alleen de repo ziet die de deelnemer bij het installeren kiest. Rechten: Contents lezen en schrijven, Pull requests lezen, Metadata lezen. | Harmen |
| Inloggen | Je GitHub-account is je login. Ondernemen met AI heeft geen eigen wachtwoord of account. | Harmen |
| Wiens naam bij een commit | De deelnemer, dus het GitHub-account waarmee hij is ingelogd: zijn profielfoto en naam staan bij de commit, net als bij een commit uit GitHub Desktop. Het platform schrijft met de token van de deelnemer, en niet als bot. | Harmen |
| Formulier of pull request | Wat je zelf invult en opslaat, gaat direct naar `main`. Klikken op Opslaan is jouw "ja". Stelt je AI vanaf level 2 een wijziging aan een keuze voor, zoals je idee of je doelgroep, dan komt die in een pull request, en die merg je zelf op GitHub. Dat zegt `AGENTS.md` nu al. | Harmen |
| Vinkjes zonder check | AI-app, Desktop en Clonen vink je zelf af, en de browser onthoudt dat. Na je eerste push is level 0 af en hebben ze vanzelf een vinkje. Account, Repo en Koppelen krijgen een vinkje zodra je gekoppeld bent. | Harmen |
| Starter-repo | Een openbare template-repo: `morgenacademy/ondernemen-met-ai-starter`. De skills zijn daarmee openbaar. Dat zijn ze nu ook al, via de code van het platform. | Harmen (de naam is een voorstel) |
| Demo | De demo blijft online op `/demo`, met de nep-repo en alle demoknoppen. Op de rest van de site draait de echte versie, zonder demoknoppen. | Harmen |
| Grens van de pilot | Zie "Buiten de pilot". | Harmen |
| Netlify | Alleen Morgen heeft een Netlify-account. Deelnemers hebben alleen GitHub en hun AI-app nodig. | Harmen |
| Waar de sleutel staat | De browser krijgt alleen een versleuteld cookie. Al het verkeer met GitHub loopt via Netlify Functions, zodat de token van GitHub nooit in de browser staat. | bouwer |
| Ingelogd blijven | Maanden: de functions vernieuwen de token van GitHub vanzelf. Uitloggen kan altijd. | bouwer |
| Lezen | Bij openen en bij terugkomen in het tabblad haalt één aanroep de hele repo op, met de gemergde pull requests en de laatste commits erbij. Dat gaat zoals in de demo. | bouwer |
| Schrijven | Een formulier wordt één commit op de standaardbranch (`main`), op naam van de deelnemer. | bouwer |
| Gelijk houden | Na een commit vanuit het platform loopt de computer achter. `AGENTS.md` in de starter-repo laat de AI daarom elke sessie beginnen met `git pull`. Dat staat er al in. | bouwer |
| Opslag op de server | Geen database. Wat er over de deelnemer bewaard wordt, staat in het cookie. | bouwer |

## Doelen

- Harmen doorloopt als deelnemer level 0 tot en met 2 op een echte repo: inloggen, koppelen, formulieren invullen, pushen vanuit GitHub Desktop en een pull request mergen. Na elke stap kloppen de checks.
- In level 0 ziet een deelnemer GitHub alleen bij het maken van de repo en bij één scherm tijdens het koppelen. Pull requests mergt hij vanaf level 2 zelf op GitHub, zoals `AGENTS.md` en stap `l2-canvas` nu al zeggen. Het platform mergt niets en heeft daarom alleen leesrecht op pull requests.
- Het werkt voor meerdere deelnemers tegelijk, ieder met een eigen account en een eigen repo, zonder extra werk per deelnemer.
- De demo blijft werken zoals nu.

## Wat het niet mag worden

- Iets waarbij een deelnemer de app moet leren kennen. Op GitHub kiest hij één keer zijn repo, en daar blijft het bij.
- Een platform dat meer ziet dan de repo die de deelnemer aanwees.
- Een platform dat ongevraagd iets in de repo schrijft. Alleen een formulier dat de deelnemer opslaat, levert een commit op.
- Een token van GitHub in de browser, in localStorage of in de logs van Netlify.

## Zo gaat het voor de deelnemer

1. **Account.** Je maakt een GitHub-account. In de echte versie krijgt deze stap een vinkje zodra je gekoppeld bent. Tot die tijd vink je hem zelf af.
2. **Repo.** De knop opent GitHub op "Use this template" bij de starter-repo (`https://github.com/new?template_owner=morgenacademy&template_name=ondernemen-met-ai-starter`; controleer bij de bouw dat deze link werkt). Je geeft de repo de naam van je onderneming en zet hem op Private.
3. **Koppelen.** Je klikt op "Koppel met GitHub". Op GitHub zie je één scherm: "Ondernemen met AI installeren". Je kiest daar "Only select repositories" en je repo, en klikt op Install. GitHub stuurt je terug naar level 0, waar Account, Repo en Koppelen een vinkje krijgen.
   - Koos je meer dan één repo, dan vraagt het platform welke van Ondernemen met AI is.
   - Mist de repo `AGENTS.md` of `level-0-werkplek/`, dan zegt het platform dat de repo niet met de starter-repo lijkt gemaakt, met de link uit stap 2. Je kunt daarna wel doorgaan.
4. **Setup.** Het formulier zet `level-0-werkplek/setup.md` in je repo. De commit staat op jouw naam.
5. **AI-app, Desktop, Clonen.** Je vinkt ze zelf af, en de browser onthoudt het.
6. **1e push.** Je AI vult `werkplek.md` en jij pusht vanuit GitHub Desktop. Kom je terug in het tabblad, dan haalt het platform je repo opnieuw op, en is level 0 af.

Kom je later terug, dan klik je bovenaan op "Log in met GitHub". Je ziet GitHub dan even, zonder iets te hoeven kiezen, en staat weer op je route.

## Onderdelen

### GitHub App "Ondernemen met AI"

Harmen maakt de app aan onder `morgenacademy` (zie "Wat Harmen zelf doet").

- **Waar te installeren:** elk account. Zo werkt hij voor een persoonlijk account én voor een repo onder `morgenacademy`.
- **Rechten op de repo:** Contents lezen en schrijven, Pull requests lezen, Metadata lezen. Rechten op het account zijn niet nodig.
- **Request user authorization (OAuth) during installation:** aan. Installeren en inloggen gebeuren dan in één keer, en GitHub stuurt je na het installeren naar de callback-URL.
- **Expire user authorization tokens:** aan (de standaard). Een token is dan 8 uur geldig, en met de refresh-token van 6 maanden halen de functions een nieuwe.
- **Callback-URL's:** `https://<site>/api/callback` en `http://localhost:8888/api/callback`.
- **Webhook:** uit. Het platform haalt de repo op als je terugkomt in het tabblad.
- **Geheimen:** Netlify krijgt alleen de client-ID en de client secret. Een private key is niet nodig, omdat alles met de token van de deelnemer gebeurt.

### Netlify

- Eén site onder het Morgen-team, gekoppeld aan `morgenacademy/ondernemenmetai`, met `platform/` als basismap. Een merge naar `main` zet de nieuwe versie live.
- `platform/netlify.toml`: build `npm run build`, publiceren `dist`, functions in `platform/netlify/functions/`, en een SPA-redirect voor `/demo/*` en `/*` naar `index.html`. De functions staan op `/api/...` via `config.path`. Controleer bij de bouw dat de SPA-redirect `/api/*` niet opvangt.
- Omgevingsvariabelen: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GITHUB_APP_SLUG`, en `SESSIE_SLEUTEL` (32 willekeurige bytes, base64).
- Deploy previews van pull requests draaien helemaal in de demostand, ook op `/`. Inloggen kan daar niet, omdat hun adres geen callback-URL is. `netlify.toml` zet daarvoor `VITE_STAND=demo` in de context `deploy-preview`, en `main.tsx` leest die variabele naast het pad.
- Begin op het adres `<naam>.netlify.app`. Een eigen domein komt later.

### Functions

Ze zijn geschreven in TypeScript, in het moderne formaat (`export default async (req: Request) => Response`) en zonder framework. Elke function die GitHub aanroept, leest eerst het cookie, vernieuwt de token als die binnen een minuut verloopt, en schrijft dan het vernieuwde cookie terug.

| Pad | Wat het doet |
|---|---|
| `GET /api/koppel` | Stuurt je door naar `https://github.com/apps/<slug>/installations/new`. |
| `GET /api/login` | Zet een `state`-cookie en stuurt je door naar `https://github.com/login/oauth/authorize?client_id=…&state=…&redirect_uri=…`. |
| `GET /api/callback` | Controleert `state`, wisselt `code` om voor een token en zoekt via `GET /user/installations` en `GET /user/installations/{id}/repositories` je repo's op. Bij precies één repo kiest hij die. Daarna zet hij het sessiecookie en stuurt hij je terug naar het scherm waar je op "Koppel met GitHub" of "Log in met GitHub" klikte. `/api/koppel` en `/api/login` onthouden dat scherm 10 minuten in het cookie `oma_terug`. Zonder dat cookie kom je op de route. Na het installeren geeft GitHub `state` niet terug. Ontbreekt `state` of klopt hij niet, dan negeert de callback `code` en stuurt hij je door naar `/api/login`. Je hebt de app dan al toegestaan, dus GitHub stuurt je meteen terug, nu met een `state` die klopt. |
| `GET /api/sessie` | Geeft `{ stand: 'uit' }`, `{ stand: 'kies-repo', login, repos }` of `{ stand: 'gekoppeld', login, repo }`. Geeft nooit een token terug. |
| `POST /api/repo-kiezen` | Neemt `{ repo: 'eigenaar/naam' }` aan, alleen als die repo in een installatie van de deelnemer staat. |
| `GET /api/repo` | Geeft de hele repo terug: `{ info, files, commits }` (zie "Lezen"). |
| `POST /api/bestand` | Neemt `{ path, content, message }` aan en maakt één commit (zie "Schrijven"). |
| `POST /api/uitloggen` | Wist het cookie. |

### Sessie

- Het cookie `oma_sessie` bevat de toegangstoken, de refresh-token, de verlooptijd, je login en de gekozen repo. Het is versleuteld met AES-GCM, met `SESSIE_SLEUTEL` via Web Crypto.
- Instellingen: `HttpOnly; Secure; SameSite=Lax; Path=/`, en `Max-Age` gelijk aan de levensduur van de refresh-token (6 maanden). Een kapot of vervalst cookie geldt als uitgelogd.
- Het cookie `oma_state` bevat een willekeurige waarde voor het inloggen. Het verloopt na 10 minuten.
- POST-verzoeken worden alleen aangenomen als de `Origin`-header gelijk is aan het adres van de site.

### Lezen

`GET /api/repo` doet één GraphQL-aanroep naar GitHub voor de standaardbranch:

- `repository { name, isPrivate, url, owner { login } }`
- `pullRequests(states: MERGED) { totalCount }` → `mergedPullRequests`
- de laatste 20 commits uit `defaultBranchRef.target.history`: kop, datum en de naam of login van de auteur
- de bestandsboom via `object(expression: "HEAD:")`, met daarin per blob `text` en `isBinary`, tot zes mappen diep

Bestanden dieper dan zes mappen vallen weg. Geen enkele check kijkt zo diep. Binaire bestanden, zoals een plaatje in `mvp/`, komen mee met een lege inhoud, zodat `anyFileIn` ze telt. De function geeft geen inhoud van GitHub door aan de logs.

### Schrijven

`POST /api/bestand`:

- Neemt alleen een `.md`-pad aan onder `level-0-werkplek/` tot en met `level-6-lancering/`, of onder `skills/`. Een pad met `..`, met een `/` vooraan of onder `.github/` wordt geweigerd. Dat zijn alle paden die de formulieren nu schrijven, zoals `level-6-lancering/klanten.md`, `skills/verkoopaanpak/SKILL.md` en de aantekeningen in `interviews/`.
- Haalt de huidige `sha` van het bestand op en schrijft het met `PUT /repos/{eigenaar}/{repo}/contents/{pad}` naar de standaardbranch, met de commitboodschap uit het formulier. Omdat de token van de deelnemer is, staat de commit op diens naam.
- Geeft GitHub een conflict (409), omdat het bestand net is gewijzigd, dan haalt de function de `sha` opnieuw op en probeert hij het één keer opnieuw. Het formulier overschrijft het hele bestand, net als nu.

### Platform

- **`RepoAdapter`** (`lib/repo/types.ts`) krijgt er twee methodes bij: `commits(): Promise<Commit[]>` en `refresh(): Promise<void>`. Het aantal gemergde pull requests blijft in `getInfo()` staan. `Commit` verhuist naar `types.ts` en wordt `{ message: string; at: string; path?: string; auteur?: string }`. Een commit van GitHub heeft geen pad.
- **`MockRepoAdapter`** houdt `mergePullRequest()`, `reset()` en `isPersisted()` voor de demo. `refresh()` doet daar niets.
- **`GitHubRepoAdapter`** (`lib/repo/githubRepo.ts`), naast de mock. `refresh()` haalt `GET /api/repo` op en bewaart het antwoord. `getInfo`, `listFiles`, `readFile` en `commits` lezen uit dat antwoord, en roepen eerst `refresh()` aan als er nog niets is. `writeFile` post naar `/api/bestand`. Bij een 401 gooit hij `NietIngelogd`, bij andere fouten een fout met een leesbare zin. `fetch` geef je mee, zodat tests een nep-`fetch` kunnen gebruiken.
- **`useRepo`** neemt een `RepoAdapter` in plaats van een `MockRepoAdapter`. `refresh` roept eerst `adapter.refresh()` aan en bouwt daarna de snapshot zoals nu. De opslagmelding van de demo komt alleen als de adapter `isPersisted` heeft.
- **Twee standen** in `main.tsx`: begint het pad met `/demo`, dan draait de `MockRepoAdapter` met de demoknoppen, zoals nu. Anders draait de `GitHubRepoAdapter`, en zijn er geen demoknoppen: geen "Doe alsof je AI dit deed", geen "Spring naar level", geen reset en geen invulknop met demo-inhoud. De knop "Ik heb een klant" (`KlantKnop`) blijft in de echte versie. Hij schrijft `level-6-lancering/klanten.md` en opent level 6 eerder, zoals in de demo. `App` krijgt de stand mee als prop.
- **Zonder koppeling** rekent het platform met een lege repo: level 0 staat open, de rest op slot, en het repo-paneel is verborgen.
- **Vinkjes** in de echte stand bewaart de browser onder een eigen sleutel per repo (`ondernemen-met-ai.handmatig.<eigenaar>/<repo>.v1`). De demo en de echte versie draaien op dezelfde site, en zo lopen hun vinkjes niet door elkaar. Een nieuwe testrepo begint ook leeg.
- **Account, Repo en Koppelen** krijgen in de echte stand een vinkje zodra `/api/sessie` `gekoppeld` zegt. In de demo blijft het zoals in PR #14.
- **Koppelen** toont in de echte stand de knop "Koppel met GitHub" (naar `/api/koppel`), of de repokeuze bij `kies-repo`. Is de koppeling gelukt, dan staat er "Gekoppeld met eigenaar/repo".
- **Bovenbalk** in de echte stand: "Log in met GitHub" als je uitgelogd bent. Ben je ingelogd, dan staan er je login en "Uitloggen".
- **Repo-paneel**: de echte naam, privé of openbaar, het aantal gemergde pull requests, de bestandsboom, de laatste commits met de auteur, en een link "Bekijk op GitHub". Na een commit vanuit een formulier licht het bestand op, net als nu.

### Starter-repo

- `starter-repo/` in deze repo blijft de bron. De template-repo `morgenacademy/ondernemen-met-ai-starter` is openbaar, met het vinkje "Template repository".
- Bijwerken gaat met `git subtree split --prefix=starter-repo` en een push naar de template-repo. Dat doet Harmen, of de AI met zijn akkoord. Bestaande repo's van deelnemers krijgen de update niet. Dat hoort zo, want het is hun repo.
- `starterFiles.ts` blijft de demo voeden uit dezelfde map.

## Foutafhandeling

| Wat er gebeurt | Wat de deelnemer ziet |
|---|---|
| Het cookie is verlopen of de refresh-token is ongeldig (401) | "Je bent uitgelogd. Log in met GitHub om verder te gaan." met de knop. Ingevulde formulieren blijven staan. |
| De repo staat niet meer in de installatie | Level 0, stap 3 van dit level: "Koppel je repo opnieuw." |
| Opslaan mislukt (netwerk, 5xx) | De melding die er nu al is: "Opslaan van … is mislukt. Je invoer staat er nog; probeer het opnieuw." |
| GitHub is te druk (403 of 429 met een rate limit) | "GitHub is even druk. Probeer het over een minuut opnieuw." |
| Ophalen bij terugkomen mislukt | De laatste stand blijft staan, met de melding "Je repo ophalen lukte niet. Probeer het opnieuw." en een knop. |
| Er komt een pad buiten de toegestane mappen binnen | 400. Gebeurt dit, dan zit de fout in het platform. Het verzoek komt niet bij GitHub. |

## Veiligheid en privacy

- Het platform ziet alleen de repo's die de deelnemer bij het installeren koos, en gebruikt er één van.
- De token van GitHub staat alleen in het versleutelde cookie, en verder nergens: niet in de browser, niet in een database en niet in de logs.
- De repo blijft privé. Opnames blijven op de computer van de deelnemer, want `.gitignore` houdt alles behalve `.md` in `interviews/` buiten git.
- De inhoud van de repo, met de interviews zonder namen, gaat bij elke keer ophalen door een Netlify Function. Die draait standaard in de VS (zie "Nog uitzoeken").

## Testen

- **Vitest, functions:** het cookie heen en terug versleutelen, en een vervalst cookie weigeren; `callback` zonder of met een foute `state` (doorsturen naar `/api/login`), met één repo en met meer repo's; vernieuwen van een verlopen token; `/api/repo` vertaalt een GraphQL-antwoord naar `{ info, files, commits }`, met een binair bestand en een te diepe map; `/api/bestand` weigert paden buiten de toegestane mappen, schrijft met `sha` en probeert het na een 409 één keer opnieuw; een POST zonder geldige `Origin` wordt geweigerd. Alles met een nep-`fetch`.
- **Vitest, platform:** `GitHubRepoAdapter` met een nep-`fetch` (één aanroep na `refresh`, lezen uit het geheugen, `NietIngelogd` bij een 401); `useRepo` met een andere adapter dan de mock; `App` in de echte stand toont geen demoknoppen; Account, Repo en Koppelen krijgen een vinkje bij `gekoppeld`; de vinkjes van de demo en van de echte versie lopen niet door elkaar.
- **Met de hand, door Harmen als deelnemer:** de checklist in het implementatieplan, van een nieuw account tot een gemergde pull request in level 2.

## Wat Harmen zelf doet

Alles wat iets aanmaakt op GitHub of Netlify, gebeurt alleen door Harmen of met zijn akkoord. Het implementatieplan geeft per stap de exacte instellingen.

1. De template-repo `morgenacademy/ondernemen-met-ai-starter` aanmaken, openbaar, en vullen uit `starter-repo/`.
2. De GitHub App "Ondernemen met AI" aanmaken onder `morgenacademy`, met de instellingen hierboven, en een client secret maken.
3. De Netlify-site aanmaken en de vier omgevingsvariabelen invullen.
4. Als deelnemer testen, met een nieuw GitHub-account of een nieuwe repo onder `morgenacademy`.

## Buiten de pilot

- Een trainersoverzicht.
- Eigen werkbladen voor level 3 tot en met 6. Het algemene werkblad blijft.
- Live bijwerken met webhooks. Het platform haalt de repo op als je terugkomt in het tabblad.
- Teams op één repo. Mogelijk werkt dat al als iedereen in het team toegang heeft tot de repo, maar het wordt in de pilot niet getest.
- Een eigen domein.
- Een eigen account bij Morgen naast GitHub, bijvoorbeeld voor groepen en trainers. Dat komt pas samen met het trainersoverzicht.

## Nog uitzoeken

- **Regio van de functions.** Netlify Functions draaien standaard in Ohio, in de VS. Een andere regio, zoals Frankfurt, kan alleen op een Pro- of Enterprise-plan. Voor een pilot met echte deelnemers, bijvoorbeeld bij Avans, moet uitgezocht worden of dat nodig is. De repo zelf staat al bij GitHub, ook in de VS.
- **Kosten bij Netlify.** Voor één deelnemer zijn ze verwaarloosbaar. Uitzoeken is nodig voor een groep: elke keer ophalen is één aanroep van een function.
- **De naam van de template en van de app** (voorstel: `ondernemen-met-ai-starter` en "Ondernemen met AI").

## Keuzes van de bouwer

- De precieze GraphQL-query, en of `PUT contents` of `createCommitOnBranch` het schrijven doet, zolang de commit op naam van de deelnemer staat en er één commit per formulier komt.
- Hoe de functions gedeelde code delen (bijvoorbeeld `netlify/functions/_lib/`).
- Lokaal ontwikkelen met `netlify dev` (poort 8888) voor de echte stand. `npm run dev` en `/demo` blijven werken voor de demo.
- Hoe de lege repo zonder koppeling in code zit.
- Teksten in de echte stand volgen `docs/schrijfstijl.md`.
