Van elk interview komt een uitgeschreven versie zonder namen in je repo. Zo kan je AI straks alle gesprekken tegelijk analyseren.

1. Zet na elk interview de opname of het transcript in `level-2-probleemvalidatie/interviews/` in je repomap op je computer.
2. Geef je AI de opdracht hieronder. Je AI haalt de namen eruit, deelt het gesprek in volgens vraag 5 tot en met 8 en zet het ernaast als `.md`-bestand, zoals `04-apotheker-utrecht.md`.
3. Push het in GitHub Desktop met **Push origin**. Daarna wordt een vak op het platform vol.

- **Heb je al tekst?** Teams en Zoom maken zelf een transcript. Dat is de snelste route.
- **Heb je alleen een opname?** Je AI installeert een spraakprogramma op je computer, zoals Whisper, en schrijft de opname daarmee uit. Dat kost niets en de opname gaat de deur niet uit.
- **Zei iemand dat iets vertrouwelijk is?** Zeg het je AI. Die markeert dat stuk en gebruikt het nergens, ook niet in de analyse.

Git slaat de opnames en ruwe transcripts in `interviews/` over (dat staat in `.gitignore`), dus ze komen nooit op GitHub. Alleen de `.md`-bestanden gaan mee. Twijfel je of een interview al meetelt? Vraag je AI: "Staat mijn interview al in de repo?"

Je AI gebruikt hier skill `transcriberen`. Je vindt hem in je repo, in `skills/transcriberen/SKILL.md`.
