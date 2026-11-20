/* sphragisAI · βοηθός AI κάτω δεξιά.
   Δηλώνει ότι είναι AI (Άρθρο 50 AI Act). Η συζήτηση μένει μόνο στον browser
   του επισκέπτη (sessionStorage) και στέλνεται στο endpoint για κάθε απάντηση. */
(function () {
  "use strict";
  if (window.__sxChat) return; window.__sxChat = 1;
  var ENDPOINT = "https://sphragisai-bot.m-bartzoka.workers.dev/chat";
  var BOOK = "https://calendar.app.google/6C5eXMiNmEHWMqxN9";
  var path = location.pathname, EN = path.indexOf("/en/") === 0;
  var rest = EN ? path.slice(3) : path;
  if (/^\/(p|card|ig|parousiasi|parousiasi-asfaleias)\//.test(rest)) return;

  var T = EN ? {
    open: "Ask the AI assistant", title: "AI assistant", sub: "Automated AI answers · don't share personal data",
    hi: "Hello. I'm the sphragisAI AI assistant. I can explain our services, the EU AI Act and ISO/IEC 42001. What would you like to know?",
    chips: ["Does the EU AI Act apply to my chatbot?", "What is ISO/IEC 42001?", "How do we start?"],
    ph: "Write your question…", send: "Send", close: "Close", book: "Book a free 20′ session", privacy: "Privacy",
    privacyHref: "/en/privacy/", wait: "Thinking…", err: "Something went wrong. Please try again, or email info@sphragisai.com.",
    clear: "New chat"
  } : {
    open: "Ρωτήστε τον βοηθό AI", title: "Βοηθός AI", sub: "Αυτόματες απαντήσεις από AI · μη γράφετε προσωπικά δεδομένα",
    hi: "Γεια σας. Είμαι ο βοηθός AI της sphragisAI. Μπορώ να σας εξηγήσω τις υπηρεσίες μας, τον EU AI Act και το ISO/IEC 42001. Τι θέλετε να μάθετε;",
    chips: ["Με αφορά ο AI Act αν έχω chatbot;", "Τι είναι το ISO/IEC 42001;", "Πώς ξεκινάμε;"],
    ph: "Γράψτε την ερώτησή σας…", send: "Αποστολή", close: "Κλείσιμο", book: "Δωρεάν συνεδρία 20′", privacy: "Απόρρητο",
    privacyHref: "/privacy/", wait: "Σκέφτεται…", err: "Κάτι πήγε στραβά. Δοκιμάστε ξανά ή γράψτε στο info@sphragisai.com.",
    clear: "Νέα συζήτηση"
  };

  var KEY = "sx-chat-" + (EN ? "en" : "el"), hist = [];
  try { hist = JSON.parse(sessionStorage.getItem(KEY) || "[]") || []; } catch (e) { hist = []; }
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(hist.slice(-20))); } catch (e) {} }

  var css = ""
  + ".sxc-btn{position:fixed;right:calc(20px + env(safe-area-inset-right,0px));bottom:calc(20px + env(safe-area-inset-bottom,0px));z-index:9998;display:flex;align-items:center;gap:10px;border:0;cursor:pointer;background:#0B1020;color:#EEF0F5;font:600 14.5px/1 Inter,system-ui,sans-serif;padding:10px 18px 10px 10px;border-radius:999px;box-shadow:0 0 0 1px rgba(238,240,245,.14),0 14px 40px -10px rgba(11,16,32,.55);transition:transform .2s}"
  + ".sxc-btn:hover{transform:translateY(-2px)}"
  + ".sxc-btn .d{width:36px;height:36px;border-radius:50%;background:#C8323A;display:grid;place-items:center}"
  + ".sxc-btn[hidden],.sxc-panel[hidden]{display:none!important}"
  + "@media (max-width:520px){.sxc-btn .l{display:none}.sxc-btn{padding:10px}}"
  + ".sxc-panel{position:fixed;right:calc(20px + env(safe-area-inset-right,0px));bottom:calc(20px + env(safe-area-inset-bottom,0px));z-index:9999;width:min(380px,calc(100vw - 32px));height:min(580px,calc(100vh - 40px));display:flex;flex-direction:column;background:#F4F6FA;color:#0B1020;border-radius:18px;overflow:hidden;box-shadow:0 0 0 1px rgba(11,16,32,.08),0 30px 80px -20px rgba(11,16,32,.5);font:15px/1.5 Inter,system-ui,sans-serif}"
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
  + ".sxc-chips{display:flex;flex-wrap:wrap;gap:6px}"
  + ".sxc-chips button{border:0;cursor:pointer;background:#fff;color:#0B1020;box-shadow:inset 0 0 0 1px #C9D0DD;border-radius:999px;padding:7px 12px;font:500 13px Inter,sans-serif;text-align:left}"
  + ".sxc-chips button:hover{box-shadow:inset 0 0 0 1px #0B1020}"
  + ".sxc-f{border-top:1px solid #D5DAE5;background:#fff;padding:10px}"
  + ".sxc-in{display:flex;gap:8px;align-items:flex-end}"
  + ".sxc-in textarea{flex:1;min-width:0;resize:none;border:0;outline:0;box-shadow:inset 0 0 0 1px #C9D0DD;border-radius:12px;padding:10px 12px;font:15px/1.4 Inter,sans-serif;color:#0B1020;background:#F4F6FA;max-height:120px}"
  + ".sxc-in textarea:focus{box-shadow:inset 0 0 0 1.5px #0B1020}"
  + ".sxc-in button{border:0;cursor:pointer;width:42px;height:42px;flex:none;border-radius:12px;background:#C8323A;color:#fff;display:grid;place-items:center}"
  + ".sxc-in button:disabled{opacity:.5;cursor:default}"
  + ".sxc-meta{display:flex;justify-content:space-between;gap:8px;margin-top:8px;font:500 11.5px Inter,sans-serif;color:#475069}"
  + ".sxc-meta a{color:#0B1020;font-weight:600}"
  + ".sxc-panel :focus-visible,.sxc-btn:focus-visible{outline:2px solid #C8323A;outline-offset:2px}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

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
  var meta = el("div", "sxc-meta"), bk = el("a", null, T.book), pv = el("a", null, T.privacy);
  bk.href = BOOK; bk.target = "_blank"; bk.rel = "noopener"; pv.href = T.privacyHref;
  meta.appendChild(bk); meta.appendChild(pv);
  foot.appendChild(form); foot.appendChild(meta);
  panel.appendChild(head); panel.appendChild(log); panel.appendChild(foot);
  document.body.appendChild(btn); document.body.appendChild(panel);

  // Render text safely: only booking, sphragisai.com links and emails become links.
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
      var c = el("div", "sxc-chips");
      T.chips.forEach(function (q) { var b = el("button", null, q); b.type = "button"; b.onclick = function () { ask(q); }; c.appendChild(b); });
      log.appendChild(c);
    }
    hist.forEach(function (m) { bubble(m.role, m.content); });
  }

  var busy = false;
  function ask(q) {
    q = String(q || "").trim().slice(0, 600);
    if (!q || busy) return;
    busy = true; sb.disabled = true;
    var chips = log.querySelector(".sxc-chips"); if (chips) chips.remove();
    hist.push({ role: "user", content: q }); save(); bubble("user", q);
    ta.value = ""; grow();
    var w = bubble("assistant", T.wait, "w");
    fetch(ENDPOINT, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang: EN ? "en" : "el", messages: hist.slice(-10) })
    }).then(function (r) { return r.json().catch(function () { return {}; }); })
      .then(function (d) {
        w.remove();
        var a = (d && d.reply) || T.err;
        if (d && d.reply && !d.limited) { hist.push({ role: "assistant", content: a }); save(); }
        bubble("assistant", a);
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
  clr.addEventListener("click", function () { hist = []; save(); drawAll(); ta.focus(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) closeP(); });
})();
