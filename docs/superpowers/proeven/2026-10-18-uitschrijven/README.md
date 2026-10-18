# Proef: een opname uitschrijven op je eigen computer

18 oktober 2026. Vraag: kan de AI van een deelnemer een interviewopname uitschrijven, zonder Homebrew, zonder eigen Python en zonder dat de opname de computer verlaat?

## Opzet

- Mac (Apple Silicon, macOS 27), gedraaid alsof het een schone laptop is: alleen `/usr/bin` en `/bin` op het pad, dus geen Homebrew, geen ffmpeg en geen eigen Python.
- `uv` haalt zelf Python 3.12 en de pakketten op. Er zijn geen beheerdersrechten nodig.
- `uitschrijven.py` gebruikt faster-whisper met het model `small`, op de processor (`int8`), en de taal staat op Nederlands.
- De opname is een nep-interview van 29 seconden, ingesproken door de Mac-stem Xander (`say -v Xander`), als m4a.

```bash
uv run --no-project --python 3.12 uitschrijven.py interview.m4a small
```

## Uitkomst

| | |
|---|---|
| Eerste keer ophalen | ongeveer 900 MB: Python 54 MB, pakketten 367 MB, model 464 MB |
| Tijd eerste keer | 30 seconden hier; op een gewone thuisverbinding een paar minuten |
| Uitschrijven | 29 seconden opname in 4,5 seconden (ongeveer 6 keer zo snel als de opname) |
| Een gesprek van 30 minuten | ongeveer 5 minuten op deze Mac |

Twee fouten in de tekst:
- "spoedresetten" voor "spoedrecepten";
- "medicijnen voor de middag" voor "medicijn er voor de middag".

Verder stonden alle woorden goed. Op twee plekken stond een vraagteken anders dan in de ingesproken tekst, maar de zinnen bleven goed te lezen.

## Wat we leerden

- **Zet de versies vast.** Met de nieuwste PyAV (19) brak het uitschrijven: `TypeError: open() got an unexpected keyword argument 'metadata_errors'`. Met `av<19` werkte het meteen. De skill moet dus vaste versies gebruiken.
- **Ffmpeg is niet nodig.** PyAV heeft het al aan boord.
- **Een lijst met vakwoorden** (de doelgroep, het product) kan de fouten bij vakwoorden verkleinen. Whisper neemt zo'n lijst mee als `initial_prompt`.

## Nog niet getest

- Windows.
- Een echte opname met twee stemmen en achtergrondgeluid.
- Het installeren van `uv` zelf: dat stond al op deze Mac.
- Hoe lang het uitschrijven duurt op een oudere laptop.
