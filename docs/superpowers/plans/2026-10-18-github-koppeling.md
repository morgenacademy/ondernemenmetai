# Echte GitHub-koppeling Ondernemen met AI: implementatieplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Het platform leest en schrijft de echte GitHub-repo van een deelnemer via een GitHub App en Netlify Functions, en de demo blijft op `/demo` werken zoals nu.

**Architecture:** Netlify Functions in `platform/netlify/functions/` doen al het verkeer met GitHub, met de token van de deelnemer in een versleuteld cookie. In de browser praat een `GitHubRepoAdapter` met die functions. Hij voldoet aan dezelfde `RepoAdapter` als de `MockRepoAdapter`, dus checks, levels en schermen blijven ongewijzigd. Een React-context `StandContext` zegt of de demo draait. Demoknoppen tonen zich alleen in de demo.

**Tech Stack:** Vite 8, React 19, TypeScript 5.9, Vitest 5 (omgeving `node`, schermtests met `renderToStaticMarkup`), Netlify Functions (modern formaat: `export default async (req: Request) => Response`, met `export const config = { path }`), Web Crypto (AES-GCM), GitHub REST en GraphQL. Node 22 op Netlify.

**Spec:** `docs/superpowers/specs/2026-10-18-github-koppeling-design.md`

## Global Constraints

- Werk op branch `feat/github-koppeling`, vanaf `main` (daar staan PR #14 en #15 al in). Elke taak eindigt met een commit. Je merget niet, je deployt niet, en je maakt niets aan op GitHub of Netlify. Dat doet Harmen (Task 12).
- Er komen geen nieuwe runtime-dependencies bij. Voor functions en tests is alles uit Node 22 genoeg (`fetch`, `Request`, `Response`, `crypto.subtle`, `Buffer`).
- De token van GitHub staat alleen in het cookie `oma_sessie`, versleuteld. Hij komt nooit in een JSON-antwoord, in `localStorage` of in `console.log`. Ook inhoud uit de repo gaat niet naar de logs.
- Cookies: `oma_sessie` (`Max-Age=15897600`), `oma_state` en `oma_terug` (`Max-Age=600`), alle drie `HttpOnly; SameSite=Lax; Path=/`, plus `Secure` als het verzoek over https binnenkomt.
- Aanroepen naar GitHub: `https://api.github.com`, met de headers `Authorization: Bearer <token>`, `Accept: application/vnd.github+json`, `X-GitHub-Api-Version: 2022-11-28` en `User-Agent: ondernemen-met-ai`. Tokens wissel je bij `https://github.com/login/oauth/access_token` met `Accept: application/json`. Let op: GitHub geeft daar een fout als status 200 met een veld `error`.
- Omgevingsvariabelen: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GITHUB_APP_SLUG`, `SESSIE_SLEUTEL` (32 bytes, base64).
- Schrijven mag alleen naar `.md`-paden die beginnen met `level-0-werkplek/`, `level-1-idee/`, `level-2-probleemvalidatie/`, `level-3-prototype/`, `level-4-marktfeedback/`, `level-5-productvalidatie/`, `level-6-lancering/` of `skills/`. Een pad zonder `..`-segment, zonder `/` vooraan en zonder `.github/`.
- Elke tekst die een deelnemer leest, volgt `docs/schrijfstijl.md`: op de site heet het "dit platform" of "hier", en nooit "het platform". `platform/src/lib/teksten.test.ts` moet groen blijven.
- De demo op `/demo` en in deploy previews gedraagt zich precies als nu. Alle bestaande tests blijven groen.
- Gebruik de bestaande `bl-*`-klassen uit `platform/src/beleving/beleving.css`. Er komen geen nieuwe kleuren of lettertypes bij.

## Review Focus

1. **Twee verzoeken die tegelijk de token vernieuwen.** Een refresh-token van GitHub werkt maar één keer, dus het tweede verzoek zou de deelnemer uitloggen. Dat kan gebeuren bij StrictMode, bij ophalen en schrijven tegelijk, of bij `/api/sessie` en `/api/repo` tegelijk. Verwacht: de browser stuurt de `/api`-aanroepen één voor één, zodat elk verzoek het nieuwste cookie meekrijgt. Getest in Task 7 (`maakApi`).
2. **Een lege repo zonder commits.** Bijvoorbeeld een repo die is aangemaakt zonder template. Verwacht: lege bestanden en geen commits, zonder crash. Level 0 staat dan open, en Koppelen waarschuwt dat de repo niet op de starter-repo lijkt. Getest in Task 5 (`vertaalRepo`) en Task 10 (`lijktStarterRepo`).
3. **Bestandsnamen met spaties, accenten of een apostrof**, zoals `01-apotheker-’s-hertogenbosch.md`. Verwacht: elk segment van het pad wordt apart gecodeerd, en de slashes blijven staan. Getest in Task 6 (`contentsUrl`).
4. **Een standaardbranch die niet `main` heet**, bijvoorbeeld `master` door een instelling van de organisatie. Verwacht: schrijven gaat naar de standaardbranch die GitHub meldt. Getest in Task 6 (`schrijfBestand`).
5. **De repo is hernoemd of uit de installatie gehaald.** Verwacht: `/api/repo` geeft 409 en wist de repo in het cookie. Het platform zegt "Koppel je repo opnieuw in stap 3 van level 0." Getest in Task 5 (function `repo`) en Task 9 (`meldingVoor`).

---

### Task 1: `RepoAdapter` uitbreiden en `useRepo` losmaken van de mock

**Files:**
- Modify: `platform/src/lib/repo/types.ts`, `platform/src/lib/repo/mockRepo.ts`, `platform/src/ui/useRepo.ts`, `platform/src/ui/RepoPaneel.tsx` (import van `Commit`), `platform/src/App.tsx` (import van `Commit`, als die er is)
- Create: `platform/src/lib/repo/fouten.ts`
- Test: `platform/src/ui/useRepo.test.ts`, `platform/src/lib/repo/mockRepo.test.ts`

**Interfaces:**
- Produces:
  ```ts
  // types.ts
  export type RepoInfo = { name: string; owner: string; isPrivate: boolean; mergedPullRequests: number; url?: string };
  export type Commit = { message: string; at: string; path?: string; auteur?: string };
  export type RepoAntwoord = { info: RepoInfo; files: Record<string, string>; commits: Commit[] };
  export interface RepoAdapter {
    getInfo(): Promise<RepoInfo>; listFiles(): Promise<string[]>; readFile(path: string): Promise<string | null>;
    writeFile(path: string, content: string, message: string): Promise<void>;
    commits(): Promise<Commit[]>; refresh(): Promise<void>;
  }
  // fouten.ts: fouten met een zin die de deelnemer mag zien
  export class RepoFout extends Error {}
  export class NietIngelogd extends RepoFout {}   // message: 'Je bent uitgelogd. Log in met GitHub om verder te gaan.'
  export class GeenRepo extends RepoFout {}       // message: 'Koppel je repo opnieuw in stap 3 van level 0.'
  export class GitHubDruk extends RepoFout {}     // message: 'GitHub is even druk. Probeer het over een minuut opnieuw.'
  // useRepo.ts
  export async function haalRepoOp(repo: RepoAdapter): Promise<{ snapshot: RepoSnapshot; info: RepoInfo; commits: Commit[] }>;
  export function opslagMelding(repo: RepoAdapter): string | null;
  export function useRepo(repo: RepoAdapter): { /* zoals nu */ ...; fout: Error | null };
  ```
  `Commit` blijft ook vanuit `mockRepo.ts` te importeren (`export type { Commit } from './types'`), zodat de bestaande imports blijven werken.

- [ ] **Step 1: Schrijf de falende tests**
  - `useRepo.test.ts` › `haalRepoOp roept eerst refresh aan`: een nep-adapter die elke aanroep in een lijst zet. Verwacht `log[0] === 'refresh'` en `snapshot.files` gelijk aan de bestanden van de nep-adapter.
  - `useRepo.test.ts` › `opslagMelding zegt niets bij een adapter zonder isPersisted`: verwacht `null`.
  - `mockRepo.test.ts` › `refresh verandert niets`: na `writeFile` en `refresh()` is `readFile` nog steeds de nieuwe inhoud.
- [ ] **Step 2: Draai de tests en zie ze falen.** `cd platform && npx vitest run src/ui/useRepo.test.ts src/lib/repo/mockRepo.test.ts` geeft FAIL (`haalRepoOp` bestaat niet).
- [ ] **Step 3: Bouw het.** Pas de types aan zoals hierboven. `MockRepoAdapter.refresh()` doet niets. `opslagMelding` kijkt met `'isPersisted' in repo`. `useRepo.refresh` gebruikt `haalRepoOp` in een try/catch en zet `fout`. Bij `write` toont `error` de zin van een `RepoFout`, en anders de huidige zin "Opslaan van … is mislukt. …". `fout` krijgt de fout van het laatste lezen of schrijven, en wordt weer `null` als dat lukt. `run` blijft alleen voor de demo.
- [ ] **Step 4: Draai alle tests.** `cd platform && npm test && npm run typecheck` geeft PASS.
- [ ] **Step 5: Commit.** `git commit -am "RepoAdapter met commits en refresh, useRepo werkt met elke adapter"` (met `fouten.ts` toegevoegd).

### Task 2: Basis voor de functions: sessiecookie en omgeving

**Files:**
- Modify: `platform/tsconfig.json` (`"include": ["src", "netlify"]`), `platform/vite.config.ts` (`test.include` krijgt er `'netlify/**/*.test.ts'` bij), `.gitignore` (voeg `platform/.env` en `.netlify/` toe)
- Create: `platform/netlify/lib/sessie.ts`, `platform/netlify/lib/omgeving.ts`
- Test: `platform/netlify/lib/sessie.test.ts`, `platform/netlify/lib/omgeving.test.ts`

Gedeelde code staat in `platform/netlify/lib/`, buiten de map met functions, zodat Netlify er geen function van maakt.

**Interfaces:**
- Produces:
  ```ts
  // sessie.ts
  export type Sessie = { token: string; refresh: string; verloopt: number; login: string; repo: string | null }; // verloopt: ms sinds epoch
  export const SESSIE_COOKIE = 'oma_sessie', STATE_COOKIE = 'oma_state', TERUG_COOKIE = 'oma_terug';
  export const ZES_MAANDEN = 15_897_600, TIEN_MINUTEN = 600; // seconden
  export async function sluit(s: Sessie, sleutel: string): Promise<string>;          // base64url van iv + ciphertext (AES-GCM, iv 12 bytes)
  export async function open(waarde: string, sleutel: string): Promise<Sessie | null>; // null bij kapot, vervalst of andere sleutel
  export function leesCookie(req: Request, naam: string): string | null;
  export function zetCookie(req: Request, naam: string, waarde: string, maxAge: number): string; // waarde voor Set-Cookie
  export function wisCookie(req: Request, naam: string): string;                      // Max-Age=0
  // omgeving.ts
  export type Omgeving = { clientId: string; clientSecret: string; appSlug: string; sessieSleutel: string };
  export function omgeving(env?: Record<string, string | undefined>): Omgeving;     // standaard process.env
  ```

- [ ] **Step 1: Schrijf de falende tests**
  - `sluit en open geven dezelfde sessie terug`.
  - `open geeft null bij een veranderde letter, een andere sleutel en een lege string`.
  - `zetCookie` voor `https://site/api/x` bevat `oma_sessie=`, `HttpOnly`, `SameSite=Lax`, `Path=/`, `Secure` en `Max-Age=15897600`. Voor `http://localhost:8888/api/x` staat er geen `Secure` in.
  - `leesCookie` haalt `xyz` uit `a=1; oma_sessie=xyz; b=2`, en geeft `null` zonder Cookie-header.
  - `omgeving({})` gooit `Ontbrekende omgevingsvariabele: GITHUB_CLIENT_ID`, en met alle vier ingevuld geeft hij de waarden terug.
- [ ] **Step 2: Draai ze en zie ze falen.** `cd platform && npx vitest run netlify/lib` geeft FAIL.
- [ ] **Step 3: Bouw `sessie.ts` en `omgeving.ts`.** Gebruik `crypto.subtle.importKey('raw', …, 'AES-GCM')` met de base64-sleutel. De sessie gaat als JSON in het cookie.
- [ ] **Step 4: Draai de tests en de typecheck.** `npx vitest run netlify/lib && npm run typecheck` geeft PASS.
- [ ] **Step 5: Commit.** `git commit -m "Versleuteld sessiecookie voor de Netlify Functions"`

### Task 3: Tokens van GitHub en de sessie rond elk verzoek

**Files:**
- Create: `platform/netlify/lib/github.ts`
- Test: `platform/netlify/lib/github.test.ts`

**Interfaces:**
- Consumes: `Sessie`, `sluit`, `open`, `leesCookie`, `zetCookie`, `wisCookie`, `SESSIE_COOKIE`, `ZES_MAANDEN` (Task 2), `Omgeving` (Task 2).
- Produces:
  ```ts
  export type Haal = typeof fetch;
  export type Tokens = { token: string; refresh: string; verloopt: number };
  export type Api = (pad: string, init?: RequestInit) => Promise<Response>; // pad zoals '/user' of volledige URL
  export async function wisselCode(code: string, redirectUri: string, o: Omgeving, haal: Haal, nu?: () => number): Promise<Tokens>;
  export async function vernieuwToken(refresh: string, o: Omgeving, haal: Haal, nu?: () => number): Promise<Tokens>;
  export function ghApi(token: string, haal: Haal): Api;
  export function json(data: unknown, status?: number, headers?: HeadersInit): Response;
  export function origineKlopt(req: Request): boolean; // Origin-header === new URL(req.url).origin
  export function isDruk(res: Response): boolean;      // 429, of 403 met x-ratelimit-remaining: 0
  export async function metSessie(
    req: Request, o: Omgeving, haal: Haal,
    doe: (s: Sessie, api: Api) => Promise<{ antwoord: Response; sessie?: Sessie }>,
    nu?: () => number,
  ): Promise<Response>;
  ```
  `metSessie`: zonder geldig cookie geeft hij `401 {"fout":"uit"}`. Verloopt de token binnen 60 seconden, dan vernieuwt hij hem eerst. Lukt dat niet, dan geeft hij 401 en wist hij het cookie. Daarna roept hij `doe` aan. Is de sessie vernieuwd, of geeft `doe` een nieuwe sessie terug, dan zet hij `Set-Cookie` op het antwoord.

- [ ] **Step 1: Schrijf de falende tests** (met een nep-`fetch` die de aanroepen bewaart, en `nu = () => 1_000_000`)
  - `wisselCode post client_id, client_secret, code en redirect_uri`, en `expires_in: 28800` geeft `verloopt === 1_000_000 + 28_800_000`.
  - `wisselCode gooit bij status 200 met { error: 'bad_verification_code' }`.
  - `metSessie zonder cookie geeft 401 en roept doe niet aan`.
  - `metSessie vernieuwt een token die over 30 seconden verloopt`: precies één POST naar `access_token` met `grant_type=refresh_token`, en het antwoord heeft een `Set-Cookie` met `oma_sessie=`.
  - `metSessie geeft 401 en wist het cookie als vernieuwen mislukt` (`Max-Age=0`).
  - `ghApi zet de vier headers` uit Global Constraints.
  - `origineKlopt`: gelijke Origin geeft true, een andere false, geen Origin ook false.
  - `isDruk`: 429 geeft true, 403 met `x-ratelimit-remaining: 0` true, en een gewone 403 false.
- [ ] **Step 2: Draai ze en zie ze falen.** `npx vitest run netlify/lib/github.test.ts` geeft FAIL.
- [ ] **Step 3: Bouw `github.ts`.** Bij vernieuwen blijft de rest van de sessie (`login`, `repo`) staan.
- [ ] **Step 4: Draai de tests.** PASS.
- [ ] **Step 5: Commit.** `git commit -m "Tokens wisselen en vernieuwen rond elk verzoek naar GitHub"`

### Task 4: Inloggen en koppelen

**Files:**
- Create: `platform/netlify/lib/installaties.ts`, en de functions `platform/netlify/functions/koppel.ts`, `login.ts`, `callback.ts`, `sessie.ts`, `repo-kiezen.ts`, `uitloggen.ts`
- Test: `platform/netlify/functions/inloggen.test.ts`

**Interfaces:**
- Consumes: Task 2 en Task 3.
- Produces:
  - Elke function-file heeft `export async function verwerk(req: Request, deps: Deps): Promise<Response>`, `export default (req: Request) => verwerk(req, standaardDeps())` en `export const config = { path: '/api/<naam>' }`. Daarbij is `Deps = { haal: Haal; env: Record<string, string | undefined>; nu?: () => number; willekeurig?: () => string }`, met `standaardDeps()` in `netlify/lib/deps.ts` (`fetch`, `process.env`, `Date.now`, en `crypto.randomUUID`).
  - `installaties.ts`: `export async function reposVanGebruiker(api: Api): Promise<string[]>`. Die haalt `GET /user/installations?per_page=100` op, en per installatie `GET /user/installations/{id}/repositories?per_page=100`. Hij geeft de `full_name`'s terug, uniek en gesorteerd.
  - `export function geldigTerug(t: string | null): string | null` in `netlify/lib/deps.ts`: alleen een waarde die past op `/^#\/[A-Za-z0-9/?=&-]*$/`.
  - Gedrag per pad: zie de tabel "Functions" in de spec. Afspraken die de spec openlaat:
    - `/api/koppel` en `/api/login` zetten `oma_terug` als `?terug=` geldig is.
    - `/api/callback` zonder `state`, of met een `state` die niet gelijk is aan `oma_state`, geeft `302 /api/login`, en `oma_terug` blijft staan. Mislukt `wisselCode`, dan geeft hij `302 /?fout=inloggen#/route`. Hij stuurt dus nooit in een kring rond.
    - Bij succes haalt hij `GET /user` op voor `login`, kiest hij de repo als er precies één is, zet hij `oma_sessie`, wist hij `oma_state` en `oma_terug`, en geeft hij `302 /<terug>`. Zonder `terug` is dat `302 /#/route`.
    - `/api/sessie` geeft `{stand:'uit'}`, `{stand:'gekoppeld', login, repo}`, of bij `repo: null` `{stand:'kies-repo', login, repos}`.
    - `/api/repo-kiezen` en `/api/uitloggen` zijn POST. Bij een verkeerde Origin geven ze 403. `repo-kiezen` met een repo die niet in `reposVanGebruiker` staat, geeft 400. Bij succes geven beide 204.

- [ ] **Step 1: Schrijf de falende tests** (de nep-`fetch` routeert op URL, en de env heeft `GITHUB_CLIENT_ID=Iv1.test`, `GITHUB_APP_SLUG=ondernemen-met-ai` en een testsleutel)
  - `koppel stuurt door naar https://github.com/apps/ondernemen-met-ai/installations/new en onthoudt #/level/0`.
  - `koppel onthoudt geen terug buiten de site` (bij `terug=https://evil.example` zet hij geen `oma_terug`).
  - `login stuurt door naar authorize met client_id=Iv1.test, state en redirect_uri=http%3A%2F%2Flocalhost%3A8888%2Fapi%2Fcallback`, en zet `oma_state`.
  - `callback zonder state stuurt door naar /api/login`, en `callback met een andere state` ook.
  - `callback met één repo kiest die en stuurt terug naar #/level/0`: `open(cookie).repo === 'harmen/mijn-onderneming'` en `Location === '/#/level/0'`.
  - `callback met twee repo's laat de keuze open` (`repo === null`).
  - `callback die de code niet kan wisselen stuurt naar /?fout=inloggen#/route`.
  - `sessie geeft de drie standen` (zonder cookie, met repo, en zonder repo met de lijst).
  - `repo-kiezen weigert een repo buiten de installatie (400) en een andere Origin (403)`.
  - `uitloggen wist oma_sessie`.
- [ ] **Step 2: Draai ze en zie ze falen.** `npx vitest run netlify/functions/inloggen.test.ts` geeft FAIL.
- [ ] **Step 3: Bouw de zes functions, `installaties.ts` en `deps.ts`.**
- [ ] **Step 4: Draai de tests en de typecheck.** PASS.
- [ ] **Step 5: Commit.** `git commit -m "Inloggen en koppelen via de GitHub App"`

### Task 5: De repo lezen

**Files:**
- Create: `platform/netlify/lib/lezen.ts`, `platform/netlify/functions/repo.ts`
- Test: `platform/netlify/lib/lezen.test.ts`, `platform/netlify/functions/repo.test.ts`

**Interfaces:**
- Consumes: `RepoAntwoord`, `RepoInfo`, `Commit` (Task 1, import uit `../../src/lib/repo/types`), `metSessie`, `isDruk`, `json` (Task 3).
- Produces:
  - `export const REPO_QUERY: string`: één GraphQL-query met de variabelen `$owner` en `$name`. Hij vraagt `name`, `isPrivate`, `url`, `owner { login }`, `pullRequests(states: MERGED) { totalCount }`, en `defaultBranchRef { name target { ... on Commit { history(first: 20) { nodes { messageHeadline committedDate author { name user { login } } } } } } }`. Daarbij `object(expression: "HEAD:")` met `entries { name type object { ... on Blob { text isBinary } ... on Tree { entries … } } }`, zes mappen diep uitgeschreven.
  - `export function vertaalRepo(data: unknown): RepoAntwoord`. Paden bouwt hij als `map/sub/bestand.md`. Een blob met `isBinary` of `text: null` krijgt `''`. Entries van het type `commit` (submodules) vallen weg. Zonder `defaultBranchRef` of `object` geeft hij `files: {}` en `commits: []`. Bij een commit is `auteur` gelijk aan `author.user.login`, en anders aan `author.name`.
  - De function `repo` (`GET /api/repo`) geeft 409 `{fout:'geen-repo'}` als er geen repo in de sessie staat. Antwoordt GitHub met `repository: null`, met een fout van het type `NOT_FOUND`, of met HTTP 404 of 403 (en `isDruk` is false), dan geeft hij ook 409, met een sessie waarin `repo: null` staat. Bij `isDruk` of een GraphQL-fout van het type `RATE_LIMITED` geeft hij 429 `{fout:'druk'}`. Anders geeft hij 200 met `vertaalRepo`.

- [ ] **Step 1: Schrijf de falende tests**
  - `vertaalRepo zet een boom om in paden`: `level-0-werkplek/setup.md` en `level-2-probleemvalidatie/interviews/01-apotheker.md` met hun tekst.
  - `vertaalRepo geeft een binair bestand een lege inhoud`: `level-3-prototype/mvp/logo.png` staat erin, als `''`.
  - `vertaalRepo overleeft een lege repo`: bij `defaultBranchRef: null, object: null` geeft hij `{}` en `[]`.
  - `vertaalRepo neemt de login als auteur, en anders de naam`.
  - `vertaalRepo neemt info over`: `owner`, `name`, `isPrivate`, `url` en `mergedPullRequests` (2 bij `totalCount: 2`).
  - `repo zonder gekozen repo geeft 409`.
  - `repo die GitHub niet meer kent, geeft 409 en wist de repo in het cookie`.
  - `repo bij een rate limit geeft 429`.
- [ ] **Step 2: Draai ze en zie ze falen.** `npx vitest run netlify/lib/lezen.test.ts netlify/functions/repo.test.ts` geeft FAIL.
- [ ] **Step 3: Bouw `lezen.ts` en `repo.ts`.** De function post `{ query: REPO_QUERY, variables }` naar `https://api.github.com/graphql`.
- [ ] **Step 4: Draai de tests.** PASS.
- [ ] **Step 5: Commit.** `git commit -m "De hele repo in één aanroep lezen"`

### Task 6: Schrijven uit een formulier

**Files:**
- Create: `platform/netlify/lib/schrijven.ts`, `platform/netlify/functions/bestand.ts`
- Test: `platform/netlify/lib/schrijven.test.ts`, `platform/netlify/functions/bestand.test.ts`

**Interfaces:**
- Consumes: `metSessie`, `origineKlopt`, `isDruk`, `json`, `Api` (Task 3).
- Produces:
  ```ts
  export function padToegestaan(pad: string): boolean;          // de regel uit Global Constraints
  export function contentsUrl(repo: string, pad: string): string; // `/repos/${repo}/contents/${segmenten.map(encodeURIComponent).join('/')}`
  export async function schrijfBestand(api: Api, repo: string, b: { path: string; content: string; message: string }): Promise<void>;
  export class SchrijfConflict extends Error {}
  ```
  `schrijfBestand` haalt eerst `GET /repos/{repo}` op voor `default_branch`, en daarna `GET contentsUrl?ref=<branch>` voor de `sha` (bij 404 is het een nieuw bestand). Dan doet hij `PUT contentsUrl` met `{ message, content: base64(utf8), branch, sha? }`. Bij een 409 haalt hij de `sha` opnieuw op en probeert hij het één keer opnieuw. Een tweede 409 geeft `SchrijfConflict`.
  De function `bestand` (`POST /api/bestand`) geeft 403 bij een andere Origin. Bij een body die niet uit drie strings bestaat, of bij `!padToegestaan`, geeft hij 400, zonder GitHub aan te roepen. Zonder repo geeft hij 409. Bij `isDruk` 429, bij een 404 of 403 van de repo 409 met `repo: null`, bij `SchrijfConflict` 500 `{fout:'conflict'}`, en anders 204. Een 409 van de function betekent in de browser altijd "geen repo", dus een conflict mag nooit als 409 terugkomen.

- [ ] **Step 1: Schrijf de falende tests**
  - `padToegestaan` is true voor `level-0-werkplek/setup.md`, `level-2-probleemvalidatie/interviews/01-apotheker.md`, `level-6-lancering/klanten.md` en `skills/verkoopaanpak/SKILL.md`. Hij is false voor `AGENTS.md`, `.github/workflows/x.md`, `../x.md`, `/level-1-idee/idee.md`, `level-1-idee/idee.txt`, `level-7-extra/a.md` en `level-1-idee/../../x.md`.
  - `contentsUrl codeert elk segment`: bij `level-2-probleemvalidatie/interviews/01 apotheker ’s-hertogenbosch.md` blijven de slashes staan, en worden spatie en apostrof gecodeerd.
  - `schrijfBestand schrijft een nieuw bestand naar de standaardbranch`: bij `default_branch: 'master'` en een 404 op contents heeft de PUT-body `branch: 'master'` en geen `sha`.
  - `schrijfBestand werkt een bestand bij met zijn sha`, en de inhoud `é` wordt `w6k=`.
  - `schrijfBestand probeert het na een 409 één keer opnieuw`: twee PUTs, en de tweede met de nieuwe sha. Twee keer 409 geeft `SchrijfConflict`.
  - `bestand weigert een andere Origin (403) en een pad buiten de mappen (400), zonder fetch aan te roepen`.
- [ ] **Step 2: Draai ze en zie ze falen.** FAIL.
- [ ] **Step 3: Bouw `schrijven.ts` en `bestand.ts`.**
- [ ] **Step 4: Draai de tests.** PASS.
- [ ] **Step 5: Commit.** `git commit -m "Een formulier wordt één commit op naam van de deelnemer"`

### Task 7: De browserkant: api, sessie en `GitHubRepoAdapter`

**Files:**
- Create: `platform/src/lib/api.ts`, `platform/src/lib/sessie.ts`, `platform/src/lib/repo/githubRepo.ts`, `platform/src/lib/repo/legeRepo.ts`
- Test: `platform/src/lib/api.test.ts`, `platform/src/lib/sessie.test.ts`, `platform/src/lib/repo/githubRepo.test.ts`

**Interfaces:**
- Consumes: `RepoAdapter`, `RepoAntwoord`, `NietIngelogd`, `GeenRepo`, `GitHubDruk`, `RepoFout` (Task 1).
- Produces:
  ```ts
  // api.ts: alle /api-aanroepen één voor één, zie Review Focus 1
  export type ApiFetch = (pad: string, init?: RequestInit) => Promise<Response>;
  export function maakApi(haal?: typeof fetch): ApiFetch;
  export const api: ApiFetch;
  export async function gooiBijFout(res: Response, anders: string): Promise<Response>; // 401→NietIngelogd, 409→GeenRepo, 429→GitHubDruk, !ok→RepoFout(anders)
  // sessie.ts
  export type SessieStand = { stand: 'uit' } | { stand: 'kies-repo'; login: string; repos: string[] } | { stand: 'gekoppeld'; login: string; repo: string };
  export async function haalSessie(a?: ApiFetch): Promise<SessieStand>;
  export async function kiesRepo(repo: string, a?: ApiFetch): Promise<void>;
  export async function uitloggen(a?: ApiFetch): Promise<void>;
  export function inlogUrl(terug: string): string;   // '/api/login?terug=' + encodeURIComponent(terug)
  export function koppelUrl(terug: string): string;  // '/api/koppel?terug=' + encodeURIComponent(terug)
  // githubRepo.ts
  export class GitHubRepoAdapter implements RepoAdapter { constructor(a?: ApiFetch) }
  // legeRepo.ts: de repo vóór het koppelen
  export class LegeRepo implements RepoAdapter {} // geen bestanden, info { name: '', owner: '', isPrivate: true, mergedPullRequests: 0 }; writeFile gooit RepoFout
  ```
  `GitHubRepoAdapter.refresh()` haalt `GET /api/repo` op en bewaart het `RepoAntwoord`. De andere leesmethodes lezen daaruit, en roepen eerst `refresh()` aan als er nog niets is. `writeFile` post JSON naar `/api/bestand` en markeert de bewaarde stand als oud. Bij lezen is de zin van een `RepoFout` "Je repo ophalen lukte niet. Probeer het opnieuw.".

- [ ] **Step 1: Schrijf de falende tests**
  - `maakApi stuurt nooit twee verzoeken tegelijk`: een nep-`fetch` met uitgestelde promises. Start twee aanroepen tegelijk. De tweede `fetch` begint pas als de eerste klaar is, ook als de eerste faalt.
  - `gooiBijFout`: 401 geeft `NietIngelogd`, 409 `GeenRepo`, 429 `GitHubDruk`, 500 een `RepoFout` met de meegegeven zin, en 200 het antwoord zelf.
  - `haalSessie geeft de stand terug`, en `inlogUrl('#/level/0') === '/api/login?terug=%23%2Flevel%2F0'`.
  - `GitHubRepoAdapter haalt één keer op voor getInfo, listFiles, readFile en commits`: precies één aanroep na `refresh()`, en `listFiles` gesorteerd.
  - `GitHubRepoAdapter haalt zelf op als er nog niets is` (`getInfo` zonder `refresh` roept één keer `/api/repo` aan).
  - `GitHubRepoAdapter.writeFile post path, content en message naar /api/bestand`, en de volgende `listFiles` haalt opnieuw op.
  - `GitHubRepoAdapter geeft NietIngelogd bij een 401`.
  - `LegeRepo heeft geen bestanden en weigert te schrijven`.
- [ ] **Step 2: Draai ze en zie ze falen.** `npx vitest run src/lib/api.test.ts src/lib/sessie.test.ts src/lib/repo/githubRepo.test.ts` geeft FAIL.
- [ ] **Step 3: Bouw de vier bestanden.** `maakApi` houdt één promise-keten bij, en een fout breekt die keten niet.
- [ ] **Step 4: Draai de tests.** PASS.
- [ ] **Step 5: Commit.** `git commit -m "GitHubRepoAdapter naast de mock, met één verzoek tegelijk"`

### Task 8: Demoknoppen alleen in de demo

**Files:**
- Create: `platform/src/beleving/stand.tsx`
- Modify: `platform/src/beleving/Routekaart.tsx` (blok `bl-demo`), `WerkplekBord.tsx` en `LevelBord.tsx` (blok `bl-bord-demo`), `WerkbladDelen.tsx` (`DemoRegel`), `MadlibWerkblad.tsx` (de demoknop), `Werkblad.tsx`, `StapBlad.tsx` en `platform/src/ui/KlantKnop.tsx` (`demoWaarden` en `demoVoorStap`)
- Test: `platform/src/beleving/stand.test.tsx`

**Interfaces:**
- Consumes: `SessieStand` (Task 7).
- Produces:
  ```ts
  export type Stand = { demo: true } | { demo: false; sessie: SessieStand; kiesRepo: (repo: string) => Promise<void>; terug: string };
  export const StandContext: React.Context<Stand>; // standaard { demo: true }, zodat bestaande tests en de demo niets merken
  export function useStand(): Stand;
  export function useDemoWaarden(stepId: string, snapshot: RepoSnapshot): FormValues | undefined; // DEMO_FORMS[stepId]?.(snapshot) alleen in de demo
  export const ECHT_VOORBEELD: Stand; // { demo: false, sessie: { stand: 'gekoppeld', login: 'harmen', repo: 'harmen/mijn-onderneming' }, kiesRepo: async () => {}, terug: '#/level/0' }, voor tests
  ```

- [ ] **Step 1: Schrijf de falende tests** (`renderToStaticMarkup` binnen `<StandContext.Provider value={ECHT_VOORBEELD}>`, met de helpers uit `schermen.test.tsx`)
  - `Routekaart in de echte stand heeft geen demoblok, maar wel "Ik heb een klant"`: niet `Demo: zet je voortgang`, wel `Ik heb een klant`.
  - `level 1 in de echte stand heeft geen demoknoppen`: niet `Vul het hele level met demo content`, niet `Vul met demo content`, niet `btn-demo`.
  - `level 0 in de echte stand heeft geen demoknoppen` (dezelfde drie).
  - `zonder provider staan de demoknoppen er wel` (Routekaart bevat `Demo: zet je voortgang`).
- [ ] **Step 2: Draai ze en zie ze falen.** `npx vitest run src/beleving/stand.test.tsx` geeft FAIL.
- [ ] **Step 3: Bouw `stand.tsx`, en verberg elk demo-element met `useStand().demo`.** Formulieren krijgen `useDemoWaarden(...)` in plaats van `DEMO_FORMS[...]`.
- [ ] **Step 4: Draai alle tests.** `npm test` geeft PASS, ook alle bestaande schermtests.
- [ ] **Step 5: Commit.** `git commit -m "Demoknoppen alleen in de demo"`

### Task 9: De echte stand in `App`

**Files:**
- Create: `platform/src/beleving/meldingen.ts`
- Modify: `platform/src/App.tsx`, `platform/src/beleving/voortgang.ts`, `platform/src/beleving/handmatig.ts`
- Test: `platform/src/beleving/meldingen.test.ts`, `platform/src/beleving/logica.test.ts` (aanvullen)

**Interfaces:**
- Consumes: `useRepo` met `fout` (Task 1), `GitHubRepoAdapter`, `LegeRepo`, `haalSessie`, `kiesRepo`, `uitloggen`, `inlogUrl` (Task 7), `StandContext`, `Stand` (Task 8).
- Produces:
  ```ts
  // App.tsx
  export type AppStand = { soort: 'demo'; repo: MockRepoAdapter } | { soort: 'echt'; github: GitHubRepoAdapter };
  type Props = { stand: AppStand; storage?: StorageLike | null };
  // voortgang.ts
  export const VANZELF_BIJ_KOPPELEN = ['l0-account', 'l0-repo', 'l0-koppelen'];
  export function metKoppeling(handmatig: Set<string>, gekoppeld: boolean): Set<string>;
  // handmatig.ts
  export function handmatigSleutel(stand: 'demo' | 'echt', repo: string | null): string;
  // demo → HANDMATIG_KEY; echt met repo → `ondernemen-met-ai.handmatig.${repo}.v1`; echt zonder repo → 'ondernemen-met-ai.handmatig.echt.v1'
  // leesHandmatig en schrijfHandmatig krijgen een optionele parameter sleutel (standaard HANDMATIG_KEY)
  // meldingen.ts
  export type Melding = { tekst: string; actie: 'inloggen' | 'opnieuw' | null };
  export function meldingVoor(fout: Error | null, zoek: string): Melding | null;
  ```
  `meldingVoor`: bij `NietIngelogd` is de actie `inloggen`. Bij `GeenRepo` is er geen actie, en de zin is die van `GeenRepo`. Bij een andere `RepoFout` is de actie `opnieuw`, met de zin van de fout. Zonder fout, maar met `zoek` gelijk aan `?fout=inloggen`, is de zin "Inloggen bij GitHub lukte niet. Probeer het opnieuw." met de actie `inloggen`. Anders geeft hij `null`.
  `App` in de echte stand:
  - haalt de sessie op bij het openen, en opnieuw na een `NietIngelogd` of `GeenRepo`;
  - gebruikt `github` als de sessie `gekoppeld` is, en anders een `LegeRepo`;
  - leest de vinkjes onder `handmatigSleutel('echt', repo)`, en geeft `metKoppeling(handmatig, gekoppeld)` door overal waar nu `handmatig` heen gaat;
  - zet `StandContext` op `{ demo: false, sessie, kiesRepo, terug: routeHash(route) }`, waarbij `kiesRepo` na het kiezen de sessie opnieuw ophaalt;
  - toont in de bovenbalk bij `uit` een link "Log in met GitHub" naar `inlogUrl(routeHash(route))`. Anders toont hij de login en een knop "Uitloggen", die `uitloggen()` aanroept en naar `/` gaat;
  - toont `meldingVoor(r.fout, location.search)` in `bl-melding`, en als die `null` is `r.error ?? r.warning`, zoals nu. Bij `inloggen` staat er een link "Log in met GitHub", en bij `opnieuw` een knop "Opnieuw" (`r.refresh`);
  - geeft de demohandlers (`reset`, `demoVoortgang`, `onDemoStap`, `onFillLevel`) alleen in de demo een werking. In de echte stand doen ze niets.
  In de demo blijft `App` zoals nu, met `stand.repo` waar nu `repo` staat.

- [ ] **Step 1: Schrijf de falende tests**
  - `metKoppeling voegt Account, Repo en Koppelen toe als je gekoppeld bent`, en laat de set ongemoeid als je niet gekoppeld bent.
  - `handmatigSleutel` geeft de drie sleutels hierboven.
  - `meldingVoor` voor de vijf gevallen: `NietIngelogd`, `GeenRepo`, `GitHubDruk` (actie `opnieuw`), `?fout=inloggen` en `null`.
- [ ] **Step 2: Draai ze en zie ze falen.** FAIL.
- [ ] **Step 3: Bouw `meldingen.ts`, de helpers en de echte stand in `App.tsx`.**
- [ ] **Step 4: Draai alle tests en de typecheck.** PASS.
- [ ] **Step 5: Commit.** `git commit -m "De echte stand: sessie, lege repo, vinkjes per repo en meldingen"`

### Task 10: Koppelen in het echt, de starter-check en het repo-paneel

**Files:**
- Create: `platform/src/beleving/KoppelenEcht.tsx`, `platform/src/lib/repo/starter.ts`
- Modify: `platform/src/beleving/StapBlad.tsx` (bij `l0-koppelen`: `useStand().demo ? <Koppelen …/> : <KoppelenEcht af={af} snapshot={snapshot} />`), `platform/src/ui/RepoPaneel.tsx`
- Test: `platform/src/beleving/KoppelenEcht.test.tsx`, `platform/src/ui/RepoPaneel.test.tsx` (aanvullen)

**Interfaces:**
- Consumes: `useStand`, `ECHT_VOORBEELD` (Task 8), `koppelUrl` (Task 7), `RepoInfo.url` en `Commit.auteur` (Task 1).
- Produces:
  ```ts
  export const TEMPLATE_URL = 'https://github.com/new?template_owner=morgenacademy&template_name=ondernemen-met-ai-starter';
  export function lijktStarterRepo(s: RepoSnapshot): boolean; // AGENTS.md staat erin, en er is een pad dat begint met 'level-0-werkplek/'
  export function KoppelenEcht(p: { af: boolean; snapshot: RepoSnapshot }): JSX.Element;
  ```
  Wat `KoppelenEcht` laat zien, met de bestaande klassen `bl-paneel-echt`, `bl-vknop p`, `bl-gelukt` en `bl-hint`:
  - Bij `uit`, of bij `kies-repo` zonder repo's: een link "Koppel met GitHub" naar `koppelUrl(terug)`, met de zin "Op GitHub kies je **Only select repositories** en je repo, en klik je op **Install**. Dan krijgt deze stap vanzelf een vinkje."
  - Bij `kies-repo` met twee of meer repo's: "Welke repo is van je onderneming?" met een knop per repo, die `kiesRepo` aanroept.
  - Bij `gekoppeld`: "✓ Gekoppeld met {repo}". Is `lijktStarterRepo` false, dan staat er "Deze repo lijkt niet gemaakt met de starter-repo." met een link "Maak een repo met de starter-repo" naar `TEMPLATE_URL`.
  `RepoPaneel` toont een link "Bekijk op GitHub" (`target="_blank" rel="noreferrer"`) als `info.url` er is. Bij een commit met `auteur` staat "{message} · {auteur}". De key van een commit wordt `${c.at}-${c.message}`.

- [ ] **Step 1: Schrijf de falende tests**
  - `KoppelenEcht bij uit toont Koppel met GitHub naar /api/koppel?terug=%23%2Flevel%2F0`.
  - `KoppelenEcht bij kies-repo met twee repo's toont een knop per repo`.
  - `KoppelenEcht bij gekoppeld toont de repo`, en de waarschuwing alleen bij een snapshot zonder `AGENTS.md`.
  - `lijktStarterRepo` is true voor `starterFiles`, en false voor `{}` en voor `{ 'README.md': 'x' }`.
  - `RepoPaneel toont Bekijk op GitHub en de auteur` bij `url` en `auteur`, en geen link zonder `url`.
- [ ] **Step 2: Draai ze en zie ze falen.** FAIL.
- [ ] **Step 3: Bouw het.**
- [ ] **Step 4: Draai alle tests.** PASS.
- [ ] **Step 5: Commit.** `git commit -m "Koppelen met de echte GitHub App en de link naar je repo"`

### Task 11: Twee standen op één site

**Files:**
- Create: `platform/src/lib/stand.ts`, `netlify.toml` (in de root van de repo)
- Modify: `platform/src/main.tsx`
- Test: `platform/src/lib/stand.test.ts`

**Interfaces:**
- Consumes: `AppStand` (Task 9), `GitHubRepoAdapter` (Task 7).
- Produces: `export function kiesStand(pad: string, viteStand: string | undefined): 'demo' | 'echt'`. Die geeft `demo` als `viteStand === 'demo'`, of als het pad `/demo` is of met `/demo/` begint. Anders geeft hij `echt`.
  `netlify.toml`:
  ```toml
  [build]
    base = "platform"
    command = "npm run build"
    publish = "dist"
  [build.environment]
    NODE_VERSION = "22"
  [functions]
    directory = "netlify/functions"
  [context.deploy-preview.environment]
    VITE_STAND = "demo"
  [dev]
    command = "npm run dev"
    targetPort = 5173
    port = 8888
  [[redirects]]
    from = "/*"
    to = "/index.html"
    status = 200
  ```

- [ ] **Step 1: Schrijf de falende test.** `kiesStand` geeft `demo` voor `/demo`, `/demo/`, en voor `/` met `VITE_STAND=demo`. Hij geeft `echt` voor `/` zonder variabele en voor `/demonstratie`.
- [ ] **Step 2: Draai hem en zie hem falen.** FAIL.
- [ ] **Step 3: Bouw `stand.ts`, en kies in `main.tsx` de stand met `kiesStand(location.pathname, import.meta.env.VITE_STAND)`.** In de demo maak je de `MockRepoAdapter` zoals nu. In de echte stand maak je `new GitHubRepoAdapter()`. De knop "opnieuw beginnen" van `Foutgrens` wist alleen in de demo de opslag.
- [ ] **Step 4: Controleer de build.** `cd platform && npm test && npm run build` geeft PASS. Vraag Harmen om akkoord voordat je de Netlify CLI ophaalt met `npx netlify dev`. Controleer daarna met een `platform/.env` met testwaarden voor de vier variabelen:
  - `curl -s localhost:8888/api/sessie` geeft `{"stand":"uit"}`. Dat bewijst dat de SPA-redirect `/api/*` niet opvangt.
  - `localhost:8888/demo` toont de demo met de demoknoppen.
  - `localhost:8888/` toont de echte stand, met "Log in met GitHub".
- [ ] **Step 5: Commit.** `git commit -m "Demo op /demo, de echte versie op de rest van de site"`

### Task 12: Teksten van level 0 en de handleiding om de pilot in te richten

**Files:**
- Modify: `content/levels/level-0/l0-repo.md` (stap 1 linkt naar de starter-repo via `TEMPLATE_URL`, en zegt niet meer "die je van je trainer krijgt"), `content/levels/level-0/l0-koppelen.md` (de echte stappen, zonder de zin over de demo)
- Create: `docs/pilot-inrichten.md`

**Interfaces:**
- Consumes: `TEMPLATE_URL` (Task 10), en de instellingen uit de spec.

`docs/pilot-inrichten.md` is voor Harmen. Hij doet elke stap zelf, of geeft per stap akkoord:
1. **Template-repo:** `git subtree split --prefix=starter-repo -b starter-export` en `git push https://github.com/morgenacademy/ondernemen-met-ai-starter.git starter-export:main`. Maak de repo vooraf leeg en openbaar aan, en zet daarna onder Settings het vinkje bij "Template repository".
2. **GitHub App** onder morgenacademy › Settings › Developer settings › GitHub Apps › New GitHub App. De velden: naam "Ondernemen met AI"; homepage `https://<site>.netlify.app`; callback-URL's `https://<site>.netlify.app/api/callback` en `http://localhost:8888/api/callback`; "Expire user authorization tokens" aan; "Request user authorization (OAuth) during installation" aan; Webhook "Active" uit; repository permissions Contents "Read and write", Pull requests "Read-only" en Metadata "Read-only"; "Any account". Daarna "Generate a new client secret". Noteer de client-ID, het secret en de slug uit de URL van de app.
3. **Netlify-site** onder het Morgen-team, gekoppeld aan `morgenacademy/ondernemenmetai`. `netlify.toml` regelt de build. Vul de omgevingsvariabelen in. `SESSIE_SLEUTEL` maak je met `openssl rand -base64 32`.
4. **Lokaal draaien:** `platform/.env` met dezelfde vier variabelen (staat in `.gitignore`), en dan `npx netlify dev`.
5. **Testen als deelnemer:** de checklist hieronder.

Checklist om als deelnemer te testen, op `https://<site>.netlify.app` met een nieuw GitHub-account of een nieuwe repo onder morgenacademy:
- [ ] Stap 2 van level 0 opent GitHub met de starter-repo als template. Je maakt een privé-repo.
- [ ] Stap 3 van level 0: "Koppel met GitHub", één scherm op GitHub, Install, en je komt terug op level 0. Account, Repo en Koppelen hebben een vinkje.
- [ ] Setup opslaan zet `level-0-werkplek/setup.md` op GitHub, met jouw naam bij de commit.
- [ ] Clonen in GitHub Desktop, en je AI haalt eerst op en vult `werkplek.md`. Push origin, terug in het tabblad: level 0 is af.
- [ ] Level 1 met de formulieren: elk opgeslagen formulier is één commit op `main`.
- [ ] Level 2: een pull request van je AI mergen op GitHub, en "1 gemergde pull request" staat in "Jouw repo".
- [ ] Uitloggen en weer inloggen: je staat weer waar je was, zonder iets te kiezen op GitHub.
- [ ] `/demo` werkt zoals voorheen, met alle demoknoppen.

- [ ] **Step 1: Pas de twee teksten aan** volgens `docs/schrijfstijl.md`.
- [ ] **Step 2: Draai de teksttests.** `cd platform && npx vitest run src/lib/teksten.test.ts src/lib/content.test.ts` geeft PASS.
- [ ] **Step 3: Schrijf `docs/pilot-inrichten.md`.**
- [ ] **Step 4: Commit.** `git commit -m "Teksten voor echt koppelen en de handleiding voor de pilot"`

### Task 13: Eindcontrole en pull request

- [ ] **Step 1: Draai alles.** `cd platform && npm test && npm run typecheck && npm run build` geeft PASS, zonder waarschuwingen over `/api`.
- [ ] **Step 2: Doorloop de demo in de browser** op `/demo`: level 0 tot en met 2, reset, en "Ik heb een klant". Alles werkt zoals op `main`.
- [ ] **Step 3: Zoek naar lekken.** `grep -rn "console.log" platform/netlify` geeft niets. `grep -rn "token" platform/src` toont geen token die in `localStorage` of in een JSON-antwoord terechtkomt.
- [ ] **Step 4: Push de branch en open een PR naar `main`.** Noem daarin de stappen van Harmen uit `docs/pilot-inrichten.md`. Niet mergen.
