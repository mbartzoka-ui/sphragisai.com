# Adds the "Case studies" section to sphragisai.com. Idempotent: safe to run many times.
# 1) menu + footer link on every page, 2) /case-studies/ listing pages (EL/EN) built from the blog shell,
# 3) case study pages get the site header/footer, sx.css and analytics, 4) card on the blog, 5) sitemap.
import os, re, io

ROOT = '.'
def R(p): return io.open(os.path.join(ROOT, p), encoding='utf8').read()
def W(p, s):
    p = os.path.join(ROOT, p); os.makedirs(os.path.dirname(p), exist_ok=True)
    io.open(p, 'w', encoding='utf8').write(s)

LINKS = [('<a href="/ypiresies/">Υπηρεσίες</a>', '<a href="/case-studies/">Case studies</a>'),
         ('<a href="/en/ypiresies/">Services</a>', '<a href="/en/case-studies/">Case studies</a>')]
CASES = [dict(slug='eternaai', date={'el': 'Νοέμβριος 2026', 'en': 'November 2026'},
              title={'el': 'Το προϊόν που δεν βγήκε στην αγορά: πώς αξιολογείται ένα σύστημα AI υψηλού ρίσκου πριν από την κυκλοφορία του',
                     'en': 'The product that never launched: assessing a high-stakes AI system before it reaches the market'},
              ex={'el': 'Πώς αξιολογήθηκε ένα σύστημα «ψηφιακής μεταθανάτιας ζωής» πριν από την αγορά: κατάταξη κατά τον AI Act, εκτίμηση αντικτύπου (DPIA), χάρτης κινδύνων και μέτρα κατά ISO/IEC 42001.',
                  'en': 'How a "digital afterlife" system was assessed before release: AI Act classification, data protection impact assessment, risk map and safeguards under ISO/IEC 42001.'})]
PRE = {'el': '', 'en': '/en'}
READ = {'el': 'Διάβασε →', 'en': 'Read →'}
MINS = {'el': '15′ ανάγνωση', 'en': '15 min read'}

# 1) menu + footer link everywhere
SKIP = ('.git', '.github', 'p', 'knowledge')
n = 0
for dp, dns, fns in os.walk(ROOT):
    rel = os.path.relpath(dp, ROOT)
    if rel != '.' and rel.split(os.sep)[0] in SKIP:
        dns[:] = []; continue
    for fn in fns:
        if not fn.endswith('.html') or fn.startswith('google'): continue
        p = os.path.join(rel, fn); s = R(p); t = s
        for a, b in LINKS:
            if a in t and a + b not in t: t = t.replace(a, a + b)
        if t != s: W(p, t); n += 1
print('menu link added in', n, 'files')

def card(lang, c):
    return (f'<a class="post-card" href="{PRE[lang]}/case-studies/{c["slug"]}/">'
            f'<div class="post-meta">{c["date"][lang]} · {MINS[lang]}</div>'
            f'<div class="post-title">{c["title"][lang]}</div>'
            f'<div class="post-excerpt">{c["ex"][lang]}</div>'
            f'<span class="read">{READ[lang]}</span></a>')

def chrome(lang):
    b = R(('en/' if lang == 'en' else '') + 'blog/index.html')
    hdr = re.search(r'<header class="sx-top">.*?</header>', b, re.S)[0]
    ftr = re.search(r'<footer class="sx-foot">.*?</footer>\s*<script>document\.addEventListener\("click".*?</script>', b, re.S)[0]
    ga = re.search(r'<!-- Google tag \(gtag\.js\) -->.*?<!-- sphragisAI key events -->\s*<script>.*?</script>', b, re.S)[0]
    cf = re.search(r'<!-- Cloudflare Web Analytics -->.*?<!-- End Cloudflare Web Analytics -->', b, re.S)[0]
    return b, hdr, ftr, ga, cf

def set_lang(hdr, el_path, en_path):
    return re.sub(r'(<span class="sx-lang">)(.*?)(</span></span>|</span>(?=<a class="sx-cta"))',
                  lambda m: m[1] + re.sub(r'href="[^"]*" hreflang="(el|en)"',
                                          lambda k: f'href="{el_path if k[1] == "el" else en_path}" hreflang="{k[1]}"', m[2]) + m[3],
                  hdr, count=1, flags=re.S)

for lang in ('el', 'en'):
    b, hdr, ftr, ga, cf = chrome(lang)
    pre = PRE[lang]
    # 2) listing page
    lp = f'{pre.strip("/") + "/" if pre else ""}case-studies/index.html'
    head = b[:b.find('</head>')]
    head = head.replace('/blog/', '/case-studies/')
    if lang == 'el':
        head = re.sub(r'<title>.*?</title>', '<title>Case studies — Αξιολόγηση συστημάτων AI | sphragisAI</title>', head)
        desc = 'Πραγματικές αξιολογήσεις συστημάτων AI: κατάταξη κατά τον AI Act, εκτίμηση αντικτύπου, χάρτης κινδύνων και μέτρα κατά ISO/IEC 42001.'
        main = ('<main>\n  <div class="wrap">\n    <div class="eyebrow">CASE STUDIES</div>\n    <h1>Case studies.</h1>\n'
                '    <p class="sub">Πραγματικές αξιολογήσεις συστημάτων AI, από την κατάταξη κατά τον AI Act μέχρι τα μέτρα προστασίας, με τη μέθοδο που μεταφέρεται σε κάθε εταιρεία.</p>\n')
    else:
        head = re.sub(r'<title>.*?</title>', '<title>Case studies — AI system assessments | sphragisAI</title>', head)
        desc = 'Real assessments of AI systems: AI Act classification, impact assessment, risk map and safeguards under ISO/IEC 42001.'
        main = ('<main>\n  <div class="wrap">\n    <div class="eyebrow">CASE STUDIES</div>\n    <h1>Case studies.</h1>\n'
                '    <p class="sub">Real assessments of AI systems, from AI Act classification to safeguards, using a method that transfers to any company.</p>\n')
    head = re.sub(r'(<meta name="description" content=")[^"]*', lambda m: m[1] + desc, head)
    head = re.sub(r'(<meta property="og:description" content=")[^"]*', lambda m: m[1] + desc, head)
    head = re.sub(r'(<meta property="og:title" content=")[^"]*', lambda m: m[1] + 'sphragisAI — Case studies', head)
    main += '    <section class="topic">\n      <div class="posts">\n        ' + '\n        '.join(card(lang, c) for c in CASES) + '\n      </div>\n    </section>\n  </div>\n</main>'
    page = head + '</head>' + b[b.find('</head>') + 7:]
    page = re.sub(r'<main>.*?</main>', lambda m: main, page, count=1, flags=re.S)
    page = page.replace(hdr, set_lang(hdr, '/case-studies/', '/en/case-studies/'), 1)
    W(lp, page)
    # 4) card on the blog
    bp = ('en/' if lang == 'en' else '') + 'blog/index.html'
    s = R(bp)
    for c in CASES:
        href = f'{pre}/case-studies/{c["slug"]}/'
        if f'href="{href}"' not in s:
            s = s.replace('<div class="posts">', '<div class="posts">\n        ' + card(lang, c), 1)
    W(bp, s)
    # 3) case study pages into the site shell
    for c in CASES:
        cp = f'{pre.strip("/") + "/" if pre else ""}case-studies/{c["slug"]}/index.html'
        if not os.path.exists(os.path.join(ROOT, cp)): continue
        s = R(cp)
        if '<header class="sx-top">' in s: continue
        css_drop = (r'\.top[ {].*', r'\.sx-logo.*', r'@keyframes blink.*', r'@media \(prefers-reduced-motion:reduce\)\{\.sx-logo.*',
                    r'\.lang[ :{].*', r'footer[ {].*')
        for pat in css_drop: s = re.sub(r'(?m)^' + pat + r'\n', '', s)
        s = s.replace('.top,footer,.cta{display:none}', '.sx-top,.sx-foot,.cta{display:none}')
        s = s.replace('<style>', '<link rel="stylesheet" href="/sx.css">\n<style>', 1)
        s = s.replace('</style>', '</style>\n' + ga, 1)
        s = re.sub(r'<header class="top">.*?</header>', lambda m: set_lang(hdr, f'/case-studies/{c["slug"]}/', f'/en/case-studies/{c["slug"]}/'), s, count=1, flags=re.S)
        s = re.sub(r'<footer>.*?</footer>', lambda m: ftr + '\n' + cf, s, count=1, flags=re.S)
        W(cp, s)

# 5) sitemap
sm = R('sitemap.xml')
if '/case-studies/' not in sm:
    S = 'https://sphragisai.com'
    def blk(el, en, pr):
        alts = f'<xhtml:link rel="alternate" hreflang="el" href="{S}{el}"/><xhtml:link rel="alternate" hreflang="en" href="{S}{en}"/><xhtml:link rel="alternate" hreflang="x-default" href="{S}{el}"/>'
        return ''.join(f'<url><loc>{S}{u}</loc>{alts}<lastmod>2026-11-13</lastmod><changefreq>monthly</changefreq><priority>{pr}</priority></url>\n' for u in (el, en))
    add = blk('/case-studies/', '/en/case-studies/', '0.8')
    for c in CASES: add += blk(f'/case-studies/{c["slug"]}/', f'/en/case-studies/{c["slug"]}/', '0.7')
    W('sitemap.xml', sm.replace('</urlset>', add + '</urlset>', 1))
print('done')
