/* sphragisAI · βοηθός AI κάτω δεξιά.
   Δηλώνει ότι είναι AI (Άρθρο 50 AI Act). Οι συζητήσεις κρατιούνται 90 ημέρες χωρίς IP
   για τη βελτίωση των απαντήσεων. Φόρμα επικοινωνίας μόνο με ρητή συγκατάθεση. */
(function () {
  "use strict";
  if (window.__sxChat) return; window.__sxChat = 1;
  var API = "https://sphragisai-bot.m-bartzoka.workers.dev";
  var BOOK = "https://calendar.app.google/6C5eXMiNmEHWMqxN9";
  var path = location.pathname, EN = path.indexOf("/en/") === 0;
  var rest = EN ? path.slice(3) : path;
  if (/^\/(p|card|ig|parousiasi|parousiasi-asfaleias|admin)\//.test(rest)) return;

  var T = EN ? {
    open: "Ask the AI assistant", title: "AI assistant", sub: "Automated AI answers · don't share personal data",
    hi: "Hello. I'm the sphragisAI AI assistant. I can explain our services, the EU AI Act and ISO/IEC 42001. What would you like to know?",
    chips: ["Does the EU AI Act apply to my chatbot?", "What is ISO/IEC 42001?", "How do we start?"],
    ph: "Write your question…", send: "Send", close: "Close", book: "Free 20′ session", privacy: "Privacy",
    privacyHref: "/en/privacy/", wait: "Thinking…", err: "Something went wrong. Please try again, or email info@sphragisai.com.",
    clear: "New chat", contact: "Contact me",
    note: "Chats are kept for 90 days without your IP address, to improve the answers.",
    fTitle: "Leave your details and Maria will contact you.", fName: "Name", fEmail: "Email", fCompany: "Company (optional)",
    fMsg: "What would you like to discuss?", fSend: "Send", fCancel: "Cancel",
    fConsent: "I agree that sphragisAI may use these details to contact me about my request.",
    fOk: "Thank you. Your message was sent and Maria will contact you by email.", fErr: "Please fill in name, a valid email and the consent box.",
    fFail: "It could not be sent. Please email info@sphragisai.com."
  } : {
    open: "Ρωτήστε τον βοηθό AI", title: "Βοηθός AI", sub: "Αυτόματες απαντήσεις από AI · μη γράφετε προσωπικά δεδομένα",
    hi: "Γεια σας. Είμαι ο βοηθός AI της sphragisAI. Μπορώ να σας εξηγήσω τις υπηρεσίες μας, τον EU AI Act και το ISO/IEC 42001. Τι θέλετε να μάθετε;",
    chips: ["Με αφορά ο AI Act αν έχω chatbot;", "Τι είναι το ISO/IEC 42001;", "Πώς ξεκινάμε;"],
    ph: "Γράψτε την ερώτησή σας…", send: "Αποστολή", close: "Κλείσιμο", book: "Δωρεάν συνεδρία 20′", privacy: "Απόρρητο",
    privacyHref: "/privacy/", wait: "Σκέφτεται…", err: "Κάτι πήγε στραβά. Δοκιμάστε ξανά ή γράψτε στο info@sphragisai.com.",
    clear: "Νέα συζήτηση", contact: "Επικοινωνήστε μαζί μου",
    note: "Οι συζητήσεις κρατιούνται 90 ημέρες χωρίς τη διεύθυνση IP σας, για τη βελτίωση των απαντήσεων.",
    fTitle: "Αφήστε τα στοιχεία σας και η Μαρία θα επικοινωνήσει μαζί σας.", fName: "Όνομα", fEmail: "Email", fCompany: "Εταιρεία (προαιρετικό)",
    fMsg: "Τι θα θέλατε να συζητήσουμε;", fSend: "Αποστολή", fCancel: "Άκυρο",
    fConsent: "Συμφωνώ η sphragisAI να χρησιμοποιήσει αυτά τα στοιχεία για να επικοινωνήσει μαζί μου για το αίτημά μου.",
    fOk: "Ευχαριστούμε. Το μήνυμά σας στάλθηκε και η Μαρία θα επικοινωνήσει μαζί σας με email.", fErr: "Συμπληρώστε όνομα, σωστό email και τη συγκατάθεση.",
    fFail: "Δεν στάλθηκε. Γράψτε μας στο info@sphragisai.com."
  };

  var KEY = "sx-chat-" + (EN ? "en" : "el"), hist = [], sid = null;
  try { hist = JSON.parse(sessionStorage.getItem(KEY) || "[]") || []; } catch (e) { hist = []; }
  function newSid() { return (crypto.randomUUID ? crypto.randomUUID() : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, function (c) { return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16); })); }
  try { sid = sessionStorage.getItem(KEY + "-sid"); } catch (e) {}
  if (!sid) { sid = newSid(); try { sessionStorage.setItem(KEY + "-sid", sid); } catch (e) {} }
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(hist.slice(-20))); } catch (e) {} }

  var css = ""
  + ".sxc-btn{position:fixed;right:calc(20px + env(safe-area-inset-right,0px));bottom:calc(20px + env(safe-area-inset-bottom,0px));z-index:9998;display:flex;align-items:center;gap:10px;border:0;cursor:pointer;background:#0B1020;color:#EEF0F5;font:600 14.5px/1 Inter,system-ui,sans-serif;padding:10px 18px 10px 10px;border-radius:999px;box-shadow:0 0 0 1px rgba(238,240,245,.14),0 14px 40px -10px rgba(11,16,32,.55);transition:transform .2s}"
  + ".sxc-btn:hover{transform:translateY(-2px)}"
  + ".sxc-btn .d{width:36px;height:36px;border-radius:50%;background:#C8323A;display:grid;place-items:center}"
  + ".sxc-btn[hidden],.sxc-panel[hidden],.sxc-lf[hidden]{display:none!important}"
  + "@media (max-width:520px){.sxc-btn .l{display:none}.sxc-btn{padding:10px}}"
  + ".sxc-panel{position:fixed;right:calc(20px + env(safe-area-inset-right,0px));bottom:calc(20px + env(safe-area-inset-bottom,0px));z-index:9999;width:min(380px,calc(100vw - 32px));height:min(600px,calc(100vh - 40px));display:flex;flex-direction:column;background:#F4F6FA;color:#0B1020;border-radius:18px;overflow:hidden;box-shadow:0 0 0 1px rgba(11,16,32,.08),0 30px 80px -20px rgba(11,16,32,.5);font:15px/1.5 Inter,system-ui,sans-serif}"
  + "@media (max-width:520px){.sxc-panel{right:0;bottom:0;width:100vw;height:100%;border-radius:0;padding-bottom:env(safe-area-inset-bottom,0px)}}"
  + ".sxc-h{background:#0B1020;color:#EEF0F5;padding:14px 14px 12px 16px;display:flex;align-items:flex-start;gap:10px;padding-top:calc(14px + env(safe-area-inset-top,0px))}"
  + ".sxc-h b{display:block;font:700 16px/1.2 'Space Grotesk',Inter,sans-serif}"
  + ".sxc-h small{display:block;margin-top:3px;font:500 11.5px/1.35 'JetBrains Mono',ui-monospace,monospace;color:#A9B1C7}"
  + ".sxc-h .ai{display:inline-block;font:600 10px/1 'JetBrains Mono',monospace;letter-spacing:.1em;background:#C8323A;color:#fff;padding:3px 6px;border-radius:5px;margin-left:6px;vertical-align:2px}"
  + ".sxc-h .sp{flex:1;min-width:0}"
  + ".sxc-h button{border:0;background:rgba(238,240,245,.1);color:#EEF0F5;border-radius:8px;cursor:pointer;font:500 12px Inter,sans-serif;padding:6px 9px}"
  + ".sxc-h button:hover{background:rgba(238,240,245,.2)}"
  + ".sxc-log{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px}"
  + ".sxc-m{max-width:86%;padding:10px 13px;border-radius:14px;white-space:pre-wrap;word-wrap:break-word;overflow-wrap:anywhere}"
  + ".sxc-m.a{background:#fff;box-shadow:0 0 0 1px #D5DAE5;border-bottom-left-radius:4px;color:#2A3149}"
  + ".sxc-m.u{background:#0B1020;color:#EEF0F5;align-self:flex-end;border-bottom-right-radius:4px}"
  + ".sxc-m a{color:#C8323A;font-weight:600}"
  + ".sxc-m.w{color:#475069;font-style:italic}"
  + ".sxc-note{font:500 11px/1.4 Inter,sans-serif;color:#475069;text-align:center;padding:0 8px}"
  + ".sxc-chips{display:flex;flex-wrap:wrap;gap:6px}"
  + ".sxc-chips button,.sxc-cta{border:0;cursor:pointer;background:#fff;color:#0B1020;box-shadow:inset 0 0 0 1px #C9D0DD;border-radius:999px;padding:7px 12px;font:500 13px Inter,sans-serif;text-align:left}"
  + ".sxc-chips button:hover,.sxc-cta:hover{box-shadow:inset 0 0 0 1px #0B1020}"
  + ".sxc-cta{align-self:flex-start;background:#C8323A;color:#fff;box-shadow:none;font-weight:600}.sxc-cta:hover{background:#D9434B;box-shadow:none}"
  + ".sxc-lf{background:#fff;border-radius:14px;box-shadow:0 0 0 1px #D5DAE5;padding:14px;display:grid;gap:9px}"
  + ".sxc-lf p{margin:0;font-weight:600;font-size:14px}"
  + ".sxc-lf input,.sxc-lf textarea{width:100%;box-sizing:border-box;border:0;box-shadow:inset 0 0 0 1px #C9D0DD;border-radius:9px;padding:9px 11px;font:14px Inter,sans-serif;background:#F4F6FA;color:#0B1020}"
  + ".sxc-lf input:focus,.sxc-lf textarea:focus{outline:0;box-shadow:inset 0 0 0 1.5px #0B1020}"
  + ".sxc-lf label.c{display:flex;gap:8px;align-items:flex-start;font-size:12px;line-height:1.4;color:#2A3149}"
  + ".sxc-lf label.c input{width:16px;height:16px;flex:none;margin-top:1px;accent-color:#C8323A;box-shadow:none}"
  + ".sxc-lf .r{display:flex;gap:8px}.sxc-lf .r button{border:0;cursor:pointer;border-radius:9px;padding:9px 14px;font:600 13.5px Inter,sans-serif}"
  + ".sxc-lf .s{background:#C8323A;color:#fff}.sxc-lf .x{background:#EEF1F6;color:#0B1020}"
  + ".sxc-lf .e{font-size:12.5px;color:#C8323A;min-height:0}.sxc-hp{position:absolute;left:-9999px}"
  + ".sxc-f{border-top:1px solid #D5DAE5;background:#fff;padding:10px}"
  + ".sxc-in{display:flex;gap:8px;align-items:flex-end}"
  + ".sxc-in textarea{flex:1;min-width:0;resize:none;border:0;outline:0;box-shadow:inset 0 0 0 1px #C9D0DD;border-radius:12px;padding:10px 12px;font:15px/1.4 Inter,sans-serif;color:#0B1020;background:#F4F6FA;max-height:120px}"
  + ".sxc-in textarea:focus{box-shadow:inset 0 0 0 1.5px #0B1020}"
  + ".sxc-in button{border:0;cursor:pointer;width:42px;height:42px;flex:none;border-radius:12px;background:#C8323A;color:#fff;display:grid;place-items:center}"
  + ".sxc-in button:disabled{opacity:.5;cursor:default}"
  + ".sxc-meta{display:flex;justify-content:space-between;gap:8px;margin-top:8px;font:500 11.5px Inter,sans-serif;color:#475069;flex-wrap:wrap}"
  + ".sxc-meta a,.sxc-meta button{color:#0B1020;font-weight:600;background:none;border:0;padding:0;cursor:pointer;font:600 11.5px Inter,sans-serif;text-decoration:underline}"
  + ".sxc-panel :focus-visible,.sxc-btn:focus-visible{outline:2px solid #C8323A;outline-offset:2px}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  // Remote config (welcome text, suggested questions, on/off), editable in the admin
  fetch(API + "/config").then(function (r) { return r.json(); }).then(function (c) {
    if (c && c.on === false) { btn.hidden = true; panel.hidden = true; return; }
    var L = EN ? "en" : "el";
    if (c && c.welcome && c.welcome[L]) T.hi = c.welcome[L];
    if (c && c.chips && c.chips[L] && c.chips[L].length) T.chips = c.chips[L];
  }).catch(function () {});

  var btn = el("button", "sxc-btn"); btn.type = "button"; btn.setAttribute("aria-label", T.open);
  var dot = el("span", "d"); dot.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v10H9l-5 4z" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>';
  btn.appendChild(dot); btn.appendChild(el("span", "l", T.open));

  var panel = el("div", "sxc-panel"); panel.hidden = true; panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", T.title);
  var head = el("div", "sxc-h"), sp = el("div", "sp"), tb = el("b", null, T.title), tag = el("span", "ai", "AI");
  tb.appendChild(tag); sp.appendChild(tb); sp.appendChild(el("small", null, T.sub));
  var clr = el("button", null, T.clear); clr.type = "button";
  var x = el("button", null, "✕"); x.type = "button"; x.setAttribute("aria-label", T.close);
  head.appendChild(sp); head.appendChild(clr); head.appendChild(x);
  var log = el("div", "sxc-log"); log.setAttribute("aria-live", "polite");
  var foot = el("div", "sxc-f"), form = el("form", "sxc-in"), ta = el("textarea");
  ta.id = "sxc-input"; ta.rows = 1; ta.maxLength = 600; ta.placeholder = T.ph; ta.setAttribute("aria-label", T.ph);
  var sb = el("button"); sb.type = "submit"; sb.setAttribute("aria-label", T.send);
  sb.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  form.appendChild(ta); form.appendChild(sb);
  var meta = el("div", "sxc-meta"), bk = el("a", null, T.book), ct = el("button", null, T.contact), pv = el("a", null, T.privacy);
  ct.type = "button"; bk.href = BOOK; bk.target = "_blank"; bk.rel = "noopener"; pv.href = T.privacyHref;
  meta.appendChild(bk); meta.appendChild(ct); meta.appendChild(pv);
  foot.appendChild(form); foot.appendChild(meta);
  panel.appendChild(head); panel.appendChild(log); panel.appendChild(foot);
  document.body.appendChild(btn); document.body.appendChild(panel);

  function render(node, text) {
    var re = /(https:\/\/calendar\.app\.google\/[A-Za-z0-9]+|https:\/\/(?:www\.)?sphragisai\.com\/[^\s<>"')]*|[A-Za-z0-9._%+-]+@sphragisai\.com)/g, last = 0, m;
    while ((m = re.exec(text))) {
      var u = m[0].replace(/[.,;:!?»]+$/, "");
      node.appendChild(document.createTextNode(text.slice(last, m.index)));
      var a = document.createElement("a");
      a.textContent = u; a.href = u.indexOf("@") > 0 && u.indexOf("http") !== 0 ? "mailto:" + u : u;
      if (u.indexOf("calendar") > 0) { a.target = "_blank"; a.rel = "noopener"; }
      node.appendChild(a); last = m.index + u.length; re.lastIndex = last;
    }
    node.appendChild(document.createTextNode(text.slice(last)));
  }
  function bubble(role, text, cls) {
    var b = el("div", "sxc-m " + (role === "user" ? "u" : "a") + (cls ? " " + cls : ""));
    render(b, text); log.appendChild(b); log.scrollTop = log.scrollHeight; return b;
  }
  function drawAll() {
    log.textContent = "";
    bubble("assistant", T.hi);
    if (!hist.length) {
      log.appendChild(el("div", "sxc-note", T.note));
      var c = el("div", "sxc-chips");
      T.chips.forEach(function (q) { var b = el("button", null, q); b.type = "button"; b.onclick = function () { ask(q); }; c.appendChild(b); });
      log.appendChild(c);
    }
    hist.forEach(function (m) { bubble(m.role, m.content); });
  }

  // Lead form, shown when the assistant suggests it or the visitor asks
  function leadForm() {
    var old = log.querySelector(".sxc-lf"); if (old) { old.querySelector("input").focus(); return; }
    var f = el("form", "sxc-lf"); f.noValidate = true;
    f.appendChild(el("p", null, T.fTitle));
    var n = el("input"); n.placeholder = T.fName; n.autocomplete = "name"; n.maxLength = 120; n.setAttribute("aria-label", T.fName);
    var em = el("input"); em.type = "email"; em.placeholder = T.fEmail; em.autocomplete = "email"; em.maxLength = 200; em.setAttribute("aria-label", T.fEmail);
    var co = el("input"); co.placeholder = T.fCompany; co.autocomplete = "organization"; co.maxLength = 160; co.setAttribute("aria-label", T.fCompany);
    var ms = el("textarea"); ms.rows = 3; ms.placeholder = T.fMsg; ms.maxLength = 1500; ms.setAttribute("aria-label", T.fMsg);
    var lastQ = hist.filter(function (m) { return m.role === "user"; }).slice(-1)[0]; if (lastQ) ms.value = lastQ.content;
    var hp = el("input", "sxc-hp"); hp.tabIndex = -1; hp.autocomplete = "off"; hp.setAttribute("aria-hidden", "true");
    var cl = el("label", "c"), cb = el("input"); cb.type = "checkbox"; cl.appendChild(cb);
    var ctext = el("span", null, T.fConsent + " "); var pl = el("a", null, T.privacy); pl.href = T.privacyHref; pl.target = "_blank"; ctext.appendChild(pl); cl.appendChild(ctext);
    var er = el("div", "e"), r = el("div", "r"), s = el("button", "s", T.fSend), xb = el("button", "x", T.fCancel);
    s.type = "submit"; xb.type = "button"; r.appendChild(s); r.appendChild(xb);
    [n, em, co, ms, hp, cl, er, r].forEach(function (c) { f.appendChild(c); });
    xb.onclick = function () { f.remove(); ta.focus(); };
    f.onsubmit = function (e) {
      e.preventDefault(); er.textContent = "";
      if (!n.value.trim() || !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(em.value.trim()) || !cb.checked) { er.textContent = T.fErr; return; }
      s.disabled = true;
      fetch(API + "/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        name: n.value, email: em.value, company: co.value, message: ms.value, website: hp.value, consent: true,
        consent_text: T.fConsent, lang: EN ? "en" : "el", page: path, sid: sid
      }) }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function () { f.remove(); bubble("assistant", T.fOk); hist.push({ role: "assistant", content: T.fOk }); save(); })
        .catch(function () { er.textContent = T.fFail; s.disabled = false; });
    };
    log.appendChild(f); log.scrollTop = log.scrollHeight; n.focus();
  }

  var busy = false;
  function ask(q) {
    q = String(q || "").trim().slice(0, 600);
    if (!q || busy) return;
    busy = true; sb.disabled = true;
    var chips = log.querySelector(".sxc-chips"); if (chips) chips.remove();
    var note = log.querySelector(".sxc-note"); if (note) note.remove();
    hist.push({ role: "user", content: q }); save(); bubble("user", q);
    ta.value = ""; grow();
    var w = bubble("assistant", T.wait, "w");
    fetch(API + "/chat", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang: EN ? "en" : "el", sid: sid, page: path, messages: hist.slice(-10) })
    }).then(function (r) { return r.json().catch(function () { return {}; }); })
      .then(function (d) {
        w.remove();
        var a = (d && d.reply) || T.err;
        if (d && d.reply && !d.limited) { hist.push({ role: "assistant", content: a }); save(); }
        bubble("assistant", a);
        if (d && d.lead) { var b = el("button", "sxc-cta", T.contact); b.type = "button"; b.onclick = function () { b.remove(); leadForm(); }; log.appendChild(b); log.scrollTop = log.scrollHeight; }
      })
      .catch(function () { w.remove(); bubble("assistant", T.err); })
      .then(function () { busy = false; sb.disabled = false; ta.focus(); });
  }
  function grow() { ta.style.height = "auto"; ta.style.height = Math.min(120, ta.scrollHeight) + "px"; }

  form.addEventListener("submit", function (e) { e.preventDefault(); ask(ta.value); });
  ta.addEventListener("input", grow);
  ta.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(ta.value); } });
  function openP() { panel.hidden = false; btn.hidden = true; drawAll(); setTimeout(function () { ta.focus(); }, 30); }
  function closeP() { panel.hidden = true; btn.hidden = false; btn.focus(); }
  btn.addEventListener("click", openP);
  x.addEventListener("click", closeP);
  ct.addEventListener("click", leadForm);
  clr.addEventListener("click", function () {
    hist = []; save(); sid = newSid(); try { sessionStorage.setItem(KEY + "-sid", sid); } catch (e) {}
    drawAll(); ta.focus();
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) closeP(); });
})();
