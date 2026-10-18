# /// script
# requires-python = ">=3.10"
# dependencies = ["faster-whisper", "av<19"]
# ///
"""Proef: schrijf een opname uit met Whisper op de eigen computer."""
import sys
import time

from faster_whisper import WhisperModel

t = time.time()
model = WhisperModel(sys.argv[2] if len(sys.argv) > 2 else "small", device="cpu", compute_type="int8")
print(f"model geladen in {time.time() - t:.1f} s", file=sys.stderr)
t = time.time()
segments, info = model.transcribe(sys.argv[1], language="nl", vad_filter=True)
tekst = "\n".join(s.text.strip() for s in segments)
print(f"uitgeschreven in {time.time() - t:.1f} s, opname {info.duration:.1f} s", file=sys.stderr)
print(tekst)
