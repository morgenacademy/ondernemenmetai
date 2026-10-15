# Ondernemen met AI

AI-first ondernemerschapsplatform van Morgen. Deelnemers richten eerst hun werkplek in (GitHub, repo, Claude Code of Codex, git) en doorlopen daarna levels die pas opengaan als het vorige level af is. De repo van de deelnemer is de bron; het platform is een dunne schil eromheen.

Ontwerp fase 1 (klikbare demo): `docs/superpowers/specs/2026-10-15-klikbare-demo-design.md`.

## Werkwijze

- `context/` is lokale input (staat in `.gitignore`, gaat nooit naar git). Wat we bouwen staat buiten die map.
- Repo is `morgenacademy/ondernemenmetai`: werk via feature-branch + pull request, niet direct op main.

## Bestaande input

- `context/Stappenplan naar ondernemerschap/`: stappenplan (6 stappen), levensfasemodel, launch path-PDF met 9 custom GPT's en werkbladen.
- `context/Inhoudelijke details/`: workshops per thema, o.a. `Projectmanagement stappen/Interviews opzetten, uitvoeren en analyseren (Harmen)/Workshop Interviews.pptx`.
- `context/gpt-instructies/`: letterlijke instructies van de 8 eigen GPT's (Harmen van Heist BV), plus een README met overzicht en bevindingen.

## Open punten

- **Eigen Idee Validator bouwen.** In de launch path is stap "Idee Validator" de Startup Validator van M J HALL (https://chatgpt.com/g/g-9JfbO9jKb-startup-validator), niet van ons. De instructies daarvan zijn privé; niet proberen die eruit te trekken. Schrijf een eigen versie in de stijl van de andere GPT's (vragen één voor één, gedrag boven intentie, doorverwijzing naar de volgende stap). De Idee generator verwijst nu nog naar de Startup Validator.
- **GPT-migratie.** OpenAI meldt in de GPT-editor dat GPT's die niet naar plugins zijn gemigreerd na 11 december niet meer beschikbaar zijn. Dit raakt alle GPT's in de launch path.
