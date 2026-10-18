Van elk interview komt een uitgeschreven versie zonder namen in je repo. Zo kan je AI in de volgende stap alle gesprekken tegelijk analyseren.

Zo komt een gesprek in een vak. Bij elke stap staat wie hem doet.

1. **Jij, buiten:** neem het gesprek op. Vraag eerst of je mag opnemen.
2. **Jij, op je computer:** zet de opname in `level-2-probleemvalidatie/interviews/` in je repomap.
3. **Jij, in je AI-app:** plak de opdracht hieronder.
4. **Je AI:** schrijft het gesprek uit en haalt de namen eruit. Vraagt je AI iets, klik dan op Toestaan. Daarna wacht je: 30 minuten gesprek kost zo'n 5 minuten. De eerste keer haalt je AI ongeveer 900 MB op.
5. **Jij, in je AI-app:** lees het interview en zeg "klopt". Moet er iets anders, zeg dat. Je AI zet het daarna op GitHub. In GitHub Desktop hoef je niets te doen.
6. **Vanzelf, hier:** het vak gaat aan. Je hoeft niets meer te doen.

- **Heb je al tekst?** Teams en Zoom maken zelf een transcript. Dat is de snelste route.
- **Waarom 900 MB?** Je AI schrijft de opname uit met Whisper, op je eigen computer. Dat kost niets en de opname gaat de deur niet uit. Daarna haalt je AI niets meer op.
- **Zei iemand dat iets vertrouwelijk is?** Zeg het je AI. Die markeert dat stuk en gebruikt het nergens, ook niet in de analyse.

Git slaat de opnames en ruwe transcripts in `interviews/` over (dat staat in `.gitignore`), dus ze komen nooit op GitHub. Alleen de `.md`-bestanden gaan mee. Twijfel je of een interview al meetelt? Vraag je AI: "Staat mijn interview al in de repo?"

Je AI gebruikt hier skill `transcriberen`. Je vindt hem in je repo, in `skills/transcriberen/SKILL.md`.
