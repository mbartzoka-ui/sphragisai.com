#!/usr/bin/env python3
"""Στέλνει τις σελίδες του site στη γνώση του βοηθού AI (sphragisai-bot).

Διαβάζει τα HTML του repo (Blog, AI Security Radar, υπηρεσίες, case studies, εργαλεία,
οδηγοί, ISO 42001, αρχική), εξάγει τον τίτλο και το κείμενο κάθε σελίδας και στέλνει
στον βοηθό μόνο όσες άλλαξαν. Σελίδες που σβήστηκαν αφαιρούνται και από τη γνώση.
Ταυτοποίηση: GitHub Actions OIDC token (audience sphragisai-bot), χωρίς κοινό μυστικό.
Μόνο βιβλιοθήκες της Python. Τρέχει από το .github/workflows/bot-knowledge-sync.yml.
"""
import hashlib, json, os, re, sys, time, urllib.parse, urllib.request
from datetime import date, timedelta
from html.parser import HTMLParser

BOT = "https://sphragisai-bot.m-bartzoka.workers.dev"
SITE = "https://sphragisai.com"
AUDIENCE = "sphragisai-bot"
RADAR_DAYS = 365          # τα άρθρα του Radar μένουν στη γνώση για έναν χρόνο
BATCH = 4

SECTIONS = {               # φάκελος -> ετικέτα
    "blog": "Blog", "radar": "AI Security Radar", "ypiresies": "Υπηρεσίες", "case-studies": "Case studies",
    "ergaleia": "Εργαλεία", "odigos": "Οδηγός", "odigoi": "Οδηγοί", "iso-42001": "ISO/IEC 42001",
}
SKIP_TAGS = {"script", "style", "nav", "header", "footer", "form", "noscript", "svg", "button", "aside", "template", "dialog", "select"}
BLOCK_TAGS = {"p", "div", "section", "article", "li", "ul", "ol", "h1", "h2", "h3", "h4", "h5", "h6", "tr", "table", "br", "blockquote", "pre", "dd", "dt", "figcaption", "details", "summary"}


class Extract(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title = ""; self.h1 = ""; self.desc = ""; self.date = ""
        self.in_title = self.in_h1 = False
        self.skip = 0; self.main_depth = 0; self.seen_main = False
        self.body, self.main = [], []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "title": self.in_title = True
        elif tag == "meta" and a.get("name") == "description": self.desc = a.get("content", "")
        elif tag == "time" and a.get("datetime") and not self.date: self.date = a["datetime"][:10]
        if tag in SKIP_TAGS: self.skip += 1
        if tag == "main": self.main_depth += 1; self.seen_main = True
        if tag == "h1" and not self.h1: self.in_h1 = True
        if tag in BLOCK_TAGS: self._add("\n")

    def handle_endtag(self, tag):
        if tag == "title": self.in_title = False
        if tag in SKIP_TAGS and self.skip: self.skip -= 1
        if tag == "main" and self.main_depth: self.main_depth -= 1
        if tag == "h1": self.in_h1 = False
        if tag in BLOCK_TAGS: self._add("\n")

    def handle_data(self, data):
        if self.in_title: self.title += data
        if self.in_h1: self.h1 += data
        if not self.skip: self._add(data)

    def _add(self, t):
        self.body.append(t)
        if self.main_depth: self.main.append(t)

    def text(self):
        raw = "".join(self.main if self.seen_main else self.body)
        lines = [re.sub(r"[ \t ]+", " ", l).strip() for l in raw.split("\n")]
        out, blank = [], False
        for l in lines:
            if not l:
                if not blank and out: out.append("")
                blank = True
            else:
                out.append(l); blank = False
        return "\n".join(out).strip()


def pages(root):
    cutoff = (date.today() - timedelta(days=RADAR_DAYS)).isoformat()
    found = [("index.html", "home", "Αρχική")]
    for sec, label in SECTIONS.items():
        base = os.path.join(root, sec)
        if not os.path.isdir(base): continue
        for dirpath, _, files in os.walk(base):
            if "index.html" not in files: continue
            rel = os.path.relpath(os.path.join(dirpath, "index.html"), root).replace(os.sep, "/")
            parts = rel.split("/")
            if any(p.startswith("_") for p in parts): continue                        # πρότυπα
            if sec in ("blog", "radar") and len(parts) == 2: continue                    # σελίδες λίστας
            if sec == "radar":
                m = re.match(r"(\d{4}-\d{2}-\d{2})", parts[1])
                if m and m.group(1) < cutoff: continue
            found.append((rel, sec, label))
    return found


def read_page(root, rel, sec, label):
    html = open(os.path.join(root, rel), encoding="utf-8", errors="replace").read()
    if re.search(r'<meta[^>]+name="robots"[^>]+noindex', html, re.I): return None
    ex = Extract(); ex.feed(html)
    title = (ex.h1 or ex.title).strip()
    title = re.sub(r"\s*[·|–-]\s*sphragisAI\s*$", "", re.sub(r"\s+", " ", title))
    text = ex.text()
    if len(text) < 200: return None
    url = SITE + "/" + (rel[: -len("index.html")] if rel.endswith("index.html") else rel)
    if not ex.date:
        m = re.match(r"(?:blog|radar)/(\d{4}-\d{2}-\d{2})", rel)
        if m: ex.date = m.group(1)
    page = {"url": url, "title": title[:200], "section": sec, "section_label": label, "date": ex.date,
            "description": re.sub(r"\s+", " ", ex.desc).strip()[:500], "text": text[:120000]}
    page["hash"] = hashlib.sha256(json.dumps(page, ensure_ascii=False, sort_keys=True).encode()).hexdigest()[:40]
    return page


def oidc_token():
    url = os.environ["ACTIONS_ID_TOKEN_REQUEST_URL"] + "&audience=" + urllib.parse.quote(AUDIENCE)
    req = urllib.request.Request(url, headers={"Authorization": "bearer " + os.environ["ACTIONS_ID_TOKEN_REQUEST_TOKEN"]})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)["value"]


def call(path, body=None, tries=3):
    for i in range(tries):
        try:
            data = json.dumps(body, ensure_ascii=False).encode("utf-8") if body is not None else None
            req = urllib.request.Request(BOT + path, data=data, method="POST" if data else "GET", headers={
                "Authorization": "Bearer " + oidc_token(), "Content-Type": "application/json; charset=utf-8",
                "User-Agent": "sphragisai-knowledge-sync"})
            with urllib.request.urlopen(req, timeout=120) as r:
                return json.load(r)
        except Exception as e:
            print(f"  προσπάθεια {i + 1}: {e}", file=sys.stderr)
            time.sleep(5 * (i + 1))
    raise SystemExit(f"Αποτυχία στο {path}")


def main():
    root = os.environ.get("GITHUB_WORKSPACE", ".")
    local = {}
    for rel, sec, label in pages(root):
        p = read_page(root, rel, sec, label)
        if p: local[p["url"]] = p
    remote = {r["url"]: r["hash"] for r in call("/sync/state")["pages"]}
    changed = [p for u, p in local.items() if remote.get(u) != p["hash"]]
    removed = [u for u in remote if u not in local]
    print(f"Σελίδες στο site: {len(local)} · αλλαγμένες ή νέες: {len(changed)} · για αφαίρεση: {len(removed)}")
    changed.sort(key=lambda p: (p["section"] != "radar", p.get("date") or ""), reverse=True)   # πρώτα οι σελίδες του site, μετά τα νεότερα άρθρα
    for i in range(0, len(changed), BATCH):
        batch = changed[i:i + BATCH]
        res = call("/sync/pages", {"pages": batch})
        print(f"  {i + len(batch)}/{len(changed)} · {len(res.get('done', []))} ενημερώθηκαν")
    for i in range(0, len(removed), 50):
        res = call("/sync/delete", {"urls": removed[i:i + 50]})
        print(f"  αφαιρέθηκαν {res.get('deleted')}")
    print("Ολοκληρώθηκε.")


if __name__ == "__main__":
    main()
