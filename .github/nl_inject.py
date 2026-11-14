"""Βάζει το <script src="/nl.js"> μέσα στο footer κάθε ελληνικής σελίδας.

Μπαίνει μέσα στο <footer>, ώστε το radar_build.py να το αντιγράφει
αυτόματα και στις νέες σελίδες radar. Τρέχει όσες φορές θέλουμε:
όπου υπάρχει ήδη, δεν ξαναμπαίνει.
"""
from pathlib import Path

TAG = '<script src="/nl.js" defer></script>'
SKIP = ("en/", ".github/", "p/", "card/", "ig/", "odigos/efxaristo/")

changed = 0
for f in sorted(Path(".").rglob("*.html")):
    rel = f.as_posix()
    if rel.startswith(SKIP) or rel.endswith("-source.html") or rel.startswith("google"):
        continue
    text = f.read_text(encoding="utf-8")
    i = text.find('<footer')
    if "/nl.js" in text or i < 0:
        continue
    j = text.find("</footer>", i)
    if j < 0:
        continue
    f.write_text(text[:j] + TAG + text[j:], encoding="utf-8")
    changed += 1
    print("+", rel)
print(f"nl_inject: {changed} σελίδες")
