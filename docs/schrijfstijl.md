# Schrijfstijl voor deelnemers

Dit geldt voor alles wat een deelnemer leest: schermen, stapteksten, werkbladen, knoppen, de starter-repo, skills en wat hun AI zegt. Deelnemers zijn ondernemers, geen developers.

## De kern: wat moet ik nu doen?

Na het lezen weet een deelnemer drie dingen:

1. **Wat heb ik al?**
2. **Wat moet ik nu doen?** Eén ding, met wie het doet en waar.
3. **Wat gebeurt er daarna?**

Al het andere is bijzaak. Wil een tekst ook nog uitleggen waarom, wat er later komt en wat er nog meer kan, dan hoort hij dat niet hier te doen. Laat het weg, zet het achter een knop ("Waarom een repo?") of verplaats het naar de plek waar het nodig is.

## Zo schrijf je het

- **Eén zin per stap.** Is er meer nodig, maak er dan stappen van.
- **Elke stap zegt wie.** Jij, je AI, of vanzelf. En waar: hier, buiten, op je computer, in je AI-app, in GitHub Desktop, op GitHub.
- **Elke stap zegt wat er daarna gebeurt.** "Dan krijgt deze stap vanzelf een vinkje." Sluit af als er niets meer te doen is: "Je hoeft niets meer te doen."
- **Elk woord wijst ergens naar.** "Dit", "het", "zo", "verder" en "daar" alleen als in dezelfde zin staat waar het naar verwijst.
- **Zeg wanneer.** Schrijf niet "straks" of "later", maar het level of de stap: "In level 2 zet je hier de interviews in die je met je doelgroep houdt."
- **Een stapnummer hoort bij een level.** "Stap 4 van dit level", "stap 2 van level 3". Level en stap lopen anders door elkaar.
- **Noem knoppen zoals ze heten, en zeg wat ze doen.** "Klik in GitHub Desktop op **Push origin**, of vraag je AI om te pushen. Zo zet je je werk op GitHub."
- **Laat het je AI doen als dat kan.** Waarom iemand op een knop laten drukken als hun AI het ook kan? Zolang het bewust gebeurt: de deelnemer vraagt erom of keurt het goed.

## Woorden

| Schrijf | Niet |
|---|---|
| hier (op de site), Ondernemen met AI (vanuit de repo of je AI) | het platform |
| krijgt een vinkje | gaat af, vinkt af |
| in level 2, in stap 3 van dit level | straks, later, verderop |
| je AI | de AI, Claude, het model |
| je repo | de repository, de map (behalve bij de uitleg van het woord) |
| jij, je | de deelnemer, de gebruiker |

Vakwoorden (repo, pull, push, branch, pull request) leg je één keer uit, op de plek waar ze nieuw zijn. Daarna gebruik je ze gewoon.

## Voorbeelden

| Vaag | Concreet |
|---|---|
| Zo staat je eerste doelgroep straks. | Dit heb je na level 2. 1 van 4 af: |
| Dit gaat vanzelf door zodra je repo het laat zien. | Staat je wijziging op GitHub, dan krijgt deze stap vanzelf een vinkje. |
| Waardeer je ideeën en kies er één. Je AI vult aan. | Je AI vult je ideeën aan met varianten. Jij geeft ze een score en kiest er één, met waarom. |
| Je AI bouwt wat digitaal kan. Jij regelt de rest. | Je AI bouwt wat digitaal kan. Jij regelt wat fysiek is, zoals een proefrit. |
| Straks komen er interviews met echte mensen in. | In level 2 zet je hier de interviews in die je met je doelgroep houdt. |

Het goede patroon staat in "Zo vul je een vak" (`platform/src/beleving/GesprekkenWerkblad.tsx`): zes stappen, elk met wie · waar, wat je doet en wat er dan gebeurt, tot "Je hoeft niets meer te doen."

## Bewaakt door

`platform/src/lib/teksten.test.ts` controleert een deel van deze regels: geen "het platform", geen "straks", nergens "gaat af", een stapnummer met het level erbij, en bij elke AI-stap wie het werk op GitHub zet.
