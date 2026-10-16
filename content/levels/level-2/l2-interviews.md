Van elk interview komt een uitgeschreven versie zonder namen in je repo. Zo kan je AI straks alle gesprekken tegelijk analyseren.

1. Zet na elk interview de opname of het transcript in de map `opnames/` in je repomap op je computer.
2. Geef je AI de opdracht hieronder. Je AI haalt de namen eruit, deelt het gesprek in volgens vraag 5 tot en met 8 en zet het als `interviews/01-rol.md` in je repo.
3. Push het in GitHub Desktop met **Push origin**. Daarna krijgt een vak hieronder een vinkje.

- **Heb je al tekst?** Teams en Zoom maken zelf een transcript. Dat is de snelste route.
- **Heb je alleen een opname?** Je AI installeert een spraakprogramma op je computer, zoals Whisper, en zet de opname daarmee om. Dat kost niets en de opname gaat de deur niet uit.
- **Zei iemand dat iets vertrouwelijk is?** Zeg het je AI. Die markeert dat stuk en gebruikt het nergens, ook niet in de analyse.

De map `opnames/` staat in `.gitignore`: git slaat hem over, dus je opnames komen nooit op GitHub. Twijfel je of een interview al meetelt? Vraag je AI: "Staat mijn interview al in de repo?"

Je AI gebruikt hier skill `transcriberen`: hij leest uit `opnames/`, haalt namen eruit en zet elk gesprek in hetzelfde format. Je vindt de skill in je repo, in `skills/transcriberen/SKILL.md`.
