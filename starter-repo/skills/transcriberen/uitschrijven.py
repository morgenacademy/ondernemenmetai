# /// script
# requires-python = "==3.12.*"
# dependencies = [
#     "faster-whisper==1.2.1",
#     "av==18.1.0",
# ]
# [tool.uv]
# exclude-newer = "2026-10-18T00:00:00Z"
# ///
"""Schrijf een interviewopname uit op je eigen computer. De opname gaat de deur niet uit.

Je AI draait dit voor je:

    uv run skills/transcriberen/uitschrijven.py level-2-probleemvalidatie/interviews/gesprek.m4a --woorden "apotheker, spoedrecepten"

Het transcript komt naast de opname, met dezelfde naam en .txt erachter.

Verander de versies hierboven niet. Met PyAV 19 brak het uitschrijven; met deze versies werkte het
in de proef van 18 oktober 2026. exclude-newer zet ook de pakketten vast waar deze twee op leunen.
"""
import argparse
import sys
import time
from pathlib import Path

from faster_whisper import WhisperModel


def main() -> None:
    for stroom in (sys.stdout, sys.stderr):
        stroom.reconfigure(encoding="utf-8")

    parser = argparse.ArgumentParser(description="Schrijf een interviewopname uit met Whisper, op je eigen computer.")
    parser.add_argument("opname", type=Path, help="de opname, bijvoorbeeld level-2-probleemvalidatie/interviews/gesprek.m4a")
    parser.add_argument("--woorden", default="", help="vakwoorden met komma's ertussen, zoals de doelgroep en het product")
    parser.add_argument("--model", default="small", help="het Whisper-model (standaard small)")
    args = parser.parse_args()

    opname = args.opname
    transcript = opname.with_suffix(".txt")
    if not opname.is_file():
        sys.exit(f"Opname niet gevonden: {opname}")
    if transcript.exists():
        sys.exit(f"{transcript} bestaat al. Ik schrijf er niet overheen.")

    begin = time.time()
    model = WhisperModel(args.model, device="cpu", compute_type="int8")
    woorden = args.woorden.strip()
    stukken, info = model.transcribe(
        str(opname),
        language="nl",
        vad_filter=True,
        initial_prompt=f"Woorden in dit gesprek: {woorden}." if woorden else None,
    )

    minuten = max(1, round(info.duration / 60))
    print(f"opname van {minuten} min, bezig met uitschrijven", file=sys.stderr, flush=True)
    regels, gemeld = [], 0
    for stuk in stukken:
        regels.append(stuk.text.strip())
        if int(stuk.end // 60) > gemeld:
            gemeld = int(stuk.end // 60)
            print(f"{gemeld} van {minuten} min", file=sys.stderr, flush=True)

    transcript.write_text("\n".join(regels) + "\n", encoding="utf-8")
    print(f"transcript: {transcript}")
    print(f"duur: {minuten} min")
    print(f"klaar in {round(time.time() - begin)} s", file=sys.stderr)


if __name__ == "__main__":
    main()
