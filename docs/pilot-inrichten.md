# Pilot inrichten

Voor Harmen. Vier dingen om te regelen, daarna testen. `<site>` is de naam van de Netlify-site.

## 1. Template-repo

1. Maak `morgenacademy/ondernemen-met-ai-starter` aan op GitHub: openbaar en leeg.
2. Draai in de repo-root: `git subtree split --prefix=starter-repo -b starter-export`
3. Draai: `git push https://github.com/morgenacademy/ondernemen-met-ai-starter.git starter-export:main`
4. Zet onder Settings het vinkje bij **Template repository**.

## 2. GitHub App

Ga naar morgenacademy › Settings › Developer settings › GitHub Apps › **New GitHub App**.

1. GitHub App name: `Ondernemen met AI`
2. Homepage URL: `https://<site>.netlify.app`
3. Callback URL: `https://<site>.netlify.app/api/callback`
4. Callback URL (tweede): `http://localhost:8888/api/callback`
5. Expire user authorization tokens: **aan**. Zonder dit geeft GitHub geen refresh token en lukt inloggen niet.
6. Request user authorization (OAuth) during installation: **aan**
7. Webhook, Active: **uit**
8. Repository permissions › Contents: **Read and write**
9. Repository permissions › Pull requests: **Read-only**
10. Repository permissions › Metadata: **Read-only**
11. Where can this GitHub App be installed: **Any account**
12. Klik **Create GitHub App**, daarna **Generate a new client secret**.
13. Noteer de client-ID, het client secret en de slug (het laatste stuk van de URL van de app).

## 3. Netlify-site

1. Maak een site onder het Morgen-team, gekoppeld aan `morgenacademy/ondernemenmetai`. `netlify.toml` in de repo-root regelt de build.
2. Zet precies deze vier omgevingsvariabelen:
   - `GITHUB_CLIENT_ID`: de client-ID
   - `GITHUB_CLIENT_SECRET`: het client secret
   - `GITHUB_APP_SLUG`: de slug
   - `SESSIE_SLEUTEL`: de uitkomst van `openssl rand -base64 32`
3. Deploy previews draaien helemaal in demo (`VITE_STAND=demo` staat al in `netlify.toml`). Inloggen kan daar niet; test de echte versie op de hoofdsite.

## 4. Lokaal draaien

1. Maak `platform/.env` met dezelfde vier variabelen. Het bestand staat in `.gitignore`.
2. Draai in de repo-root `netlify dev` (of `npx netlify dev`). Het `[dev]`-commando is `npm --prefix platform run dev`.
3. Open `http://localhost:8888`.

## 5. Testen als deelnemer

Doe dit op `https://<site>.netlify.app`, met een nieuw GitHub-account of een nieuwe repo onder morgenacademy.

- [ ] Stap 2 van level 0 opent GitHub met de starter-repo als template. Je maakt een privé-repo.
- [ ] Stap 3 van level 0: **Koppel met GitHub**, één scherm op GitHub, Install, en je komt terug op level 0. Account, Repo en Koppelen hebben een vinkje.
- [ ] Setup opslaan zet `level-0-werkplek/setup.md` op GitHub, met jouw naam bij de commit.
- [ ] Clonen in GitHub Desktop, en je AI haalt eerst op en vult `werkplek.md`. Push origin, terug in het tabblad: level 0 is af.
- [ ] Level 1 met de formulieren: elk opgeslagen formulier is één commit op `main`.
- [ ] Level 2: een pull request van je AI mergen op GitHub, en "1 gemergde pull request" staat in "Jouw repo".
- [ ] Uitloggen en weer inloggen: je staat weer waar je was, zonder iets te kiezen op GitHub.
- [ ] Na inloggen staat de cookie `oma_sessie` van de site op `Secure` en `HttpOnly` (DevTools › Application › Cookies).
- [ ] Een formulier opslaan werkt op de echte site. Dit bewijst ook dat de Origin-check het eigen adres van de site toelaat.
- [ ] Optioneel: een repo zonder template (leeg, geen commits). Koppelen waarschuwt dat het niet op de starter-repo lijkt. Noteer of Setup opslaan daar werkt.
- [ ] `/demo` werkt zoals voorheen, met alle demoknoppen.
