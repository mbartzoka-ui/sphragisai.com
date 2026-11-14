"""Εφάπαξ αλλαγές για το newsletter «Σφραγίδα» (14/11/2026).

1. Βάζει το <script src="/nl.js"> μέσα στο footer των ελληνικών σελίδων
   (το radar_build.py το αντιγράφει στις νέες σελίδες radar).
2. Βγάζει το Google Analytics (μένει το Cloudflare Web Analytics, χωρίς cookies).
3. Ενημερώνει την πολιτική απορρήτου (EL/EN) για το newsletter και το MailerLite.

Τρέχει όσες φορές θέλουμε: ό,τι έχει ήδη γίνει, δεν ξαναγίνεται.
"""
import re
from pathlib import Path

TAG = '<script src="/nl.js" defer></script>'
SKIP = ("en/", ".github/", "p/", "card/", "ig/", "odigos/efxaristo/")
GA = re.compile(r'<!-- Google tag \(gtag\.js\) -->\s*<script async src="https://www\.googletagmanager\.com/gtag/js\?id=G-T8L6NJR1LC"></script>\s*<script>.*?</script>\s*', re.S)
GA_BARE = re.compile(r'<script async src="https://www\.googletagmanager\.com/gtag/js\?id=G-T8L6NJR1LC"></script>\s*<script>\s*window\.dataLayer.*?</script>\s*', re.S)

n_tag = n_ga = 0
for f in sorted(Path(".").rglob("*.html")):
    rel = f.as_posix()
    if rel.startswith(".git/"):
        continue
    text = orig = f.read_text(encoding="utf-8")
    text = GA.sub("", text)
    text = GA_BARE.sub("", text)
    if text != orig:
        n_ga += 1
    if not (rel.startswith(SKIP) or rel.endswith("-source.html") or rel.startswith("google")):
        i = text.find("<footer")
        if "/nl.js" not in text and i >= 0:
            j = text.find("</footer>", i)
            if j >= 0:
                text = text[:j] + TAG + text[j:]
                n_tag += 1
    if text != orig:
        f.write_text(text, encoding="utf-8")
print(f"nl.js σε {n_tag} σελίδες · Google Analytics βγήκε από {n_ga} σελίδες")

PRIV = {
    "privacy/index.html": [
        ("Τελευταία ενημέρωση: 31 Οκτωβρίου 2026", "Τελευταία ενημέρωση: 14 Νοεμβρίου 2026"),
        ("<li><strong>Διεύθυνση email</strong> — όταν συμπληρώνετε τη φόρμα για να λάβετε τον δωρεάν οδηγό ή την ενημέρωσή μας.</li>",
         "<li><strong>Διεύθυνση email</strong> — όταν συμπληρώνετε τη φόρμα για να λάβετε τον δωρεάν οδηγό ή όταν εγγράφεστε στο μηνιαίο newsletter «Σφραγίδα». Η εγγραφή στο newsletter ολοκληρώνεται μόνο αφού πατήσετε το κουμπί στο email επιβεβαίωσης.</li>"),
        ("<li>Για να σας στείλουμε τον οδηγό που ζητήσατε και περιστασιακή ενημέρωση — βάσει",
         "<li>Για να σας στείλουμε τον οδηγό που ζητήσατε και το newsletter «Σφραγίδα» (ένα τεύχος τον μήνα και, σπάνια, ένα email όταν βγαίνει νέα υπηρεσία) — βάσει"),
        ("<li><strong>Zoho Mail</strong> — διαχείριση της εταιρικής αλληλογραφίας (info@sphragisai.com, maria@sphragisai.com).</li>",
         "<li><strong>MailerLite</strong> (MailerLite Limited, Ιρλανδία) — λίστα και αποστολή του newsletter: διεύθυνση email, ημερομηνία εγγραφής και επιβεβαίωσης, ανοίγματα και κλικ στα τεύχη (αποθήκευση στην ΕΕ· ο όμιλος συμμετέχει στο EU-U.S. Data Privacy Framework για τυχόν διαβίβαση στις ΗΠΑ).</li>\n"
         "      <li><strong>Zoho Mail</strong> — διαχείριση της εταιρικής αλληλογραφίας (info@sphragisai.com, maria@sphragisai.com).</li>"),
        ("Δεν απαιτείται banner συγκατάθεσης cookies.",
         "Δεν απαιτείται banner συγκατάθεσης cookies. Ο browser σας κρατά μόνο μία τοπική ένδειξη (localStorage) ότι κλείσατε ή συμπληρώσατε τη φόρμα του newsletter, ώστε να μην την ξαναδείτε· δεν στέλνεται πουθενά."),
        ("<p>Διατηρούμε τη διεύθυνση email σας όσο παραμένετε εγγεγραμμένοι ή έως ότου ζητήσετε διαγραφή.",
         "<p>Διατηρούμε τη διεύθυνση email σας όσο παραμένετε εγγεγραμμένοι ή έως ότου ζητήσετε διαγραφή. Κάθε τεύχος του newsletter έχει link διαγραφής με ένα κλικ."),
    ],
    "en/privacy/index.html": [
        ("Last updated: 31 October 2026", "Last updated: 14 November 2026"),
        ("<li><strong>Email address</strong> — when you fill in the form to receive the free guide or our updates.</li>",
         "<li><strong>Email address</strong> — when you fill in the form to receive the free guide or subscribe to our monthly newsletter «Σφραγίδα» (in Greek). Your subscription is complete only after you click the button in the confirmation email.</li>"),
        ("<li>To send you the guide you requested and occasional updates — based",
         "<li>To send you the guide you requested and the «Σφραγίδα» newsletter (one issue a month and, rarely, an email when a new service launches) — based"),
        ("<li><strong>Zoho Mail</strong> — managing company correspondence (info@sphragisai.com, maria@sphragisai.com).</li>",
         "<li><strong>MailerLite</strong> (MailerLite Limited, Ireland) — newsletter list and sending: email address, subscription and confirmation date, opens and clicks (stored in the EU; the group participates in the EU-U.S. Data Privacy Framework for any transfer to the US).</li>\n"
         "      <li><strong>Zoho Mail</strong> — managing company correspondence (info@sphragisai.com, maria@sphragisai.com).</li>"),
        ("No cookie consent banner is required.",
         "No cookie consent banner is required. Your browser only keeps one local flag (localStorage) that you closed or completed the newsletter form, so you don't see it again; it is not sent anywhere."),
        ("<p>We keep your email address for as long as you remain subscribed or until you ask us to delete it.",
         "<p>We keep your email address for as long as you remain subscribed or until you ask us to delete it. Every newsletter issue has a one-click unsubscribe link."),
    ],
}
for path, reps in PRIV.items():
    p = Path(path)
    t = p.read_text(encoding="utf-8")
    if "MailerLite" in t:
        continue
    for old, new in reps:
        if old not in t:
            raise SystemExit(f"{path}: δεν βρέθηκε: {old[:60]}")
        t = t.replace(old, new, 1)
    p.write_text(t, encoding="utf-8")
    print("ενημερώθηκε", path)
