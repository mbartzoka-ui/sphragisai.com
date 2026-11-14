"""Αγγλικό newsletter «Sealed» (14/11/2026).

1. Βάζει το <script src="/nl.js"> μέσα στο footer των αγγλικών σελίδων
   (το radar_build.py το αντιγράφει στις νέες αγγλικές σελίδες radar).
2. Προσθέτει το «Sealed» στην πολιτική απορρήτου (EL/EN).

Τρέχει όσες φορές θέλουμε: ό,τι έχει ήδη γίνει, δεν ξαναγίνεται.
"""
from pathlib import Path

TAG = '<script src="/nl.js" defer></script>'
SKIP = ("en/p/", "en/card/", "en/ig/", "en/odigos/efxaristo/")

n = 0
for f in sorted(Path("en").rglob("*.html")):
    rel = f.as_posix()
    if rel.startswith(SKIP) or rel.endswith("-source.html"):
        continue
    text = f.read_text(encoding="utf-8")
    i = text.find("<footer")
    if "/nl.js" in text or i < 0:
        continue
    j = text.find("</footer>", i)
    if j < 0:
        continue
    f.write_text(text[:j] + TAG + text[j:], encoding="utf-8")
    n += 1
print(f"nl.js σε {n} αγγλικές σελίδες")

PRIV = {
    "privacy/index.html": [
        ("ή όταν εγγράφεστε στο μηνιαίο newsletter «Σφραγίδα».",
         "ή όταν εγγράφεστε στο μηνιαίο newsletter «Σφραγίδα» (ελληνικά) ή «Sealed» (αγγλικά)."),
        ("και το newsletter «Σφραγίδα» (ένα τεύχος",
         "και το newsletter «Σφραγίδα» ή «Sealed» (ένα τεύχος"),
    ],
    "en/privacy/index.html": [
        ("or subscribe to our monthly newsletter «Σφραγίδα» (in Greek).",
         "or subscribe to our monthly newsletter «Sealed» (in English) or «Σφραγίδα» (in Greek)."),
        ("and the «Σφραγίδα» newsletter (one issue",
         "and the «Sealed» or «Σφραγίδα» newsletter (one issue"),
    ],
}
for path, reps in PRIV.items():
    p = Path(path)
    t = p.read_text(encoding="utf-8")
    if "Sealed" in t:
        continue
    for old, new in reps:
        if old not in t:
            raise SystemExit(f"{path}: δεν βρέθηκε: {old[:60]}")
        t = t.replace(old, new, 1)
    p.write_text(t, encoding="utf-8")
    print("ενημερώθηκε", path)
