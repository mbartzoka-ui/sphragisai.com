/* Newsletter «Σφραγίδα» (MailerLite). Φόρμα στο τέλος των άρθρων radar/blog
   και παράθυρο μία φορά ανά επισκέπτη. Μόνο στις ελληνικές σελίδες. */
(function () {
  "use strict";
  var ACTION = "https://assets.mailerlite.com/jsonp/2795445/forms/204122248105166682/subscribe";
  var KEY = "sx-nl";            // "closed" | "sub"
  var path = location.pathname;
  var lang = (document.documentElement.lang || "").toLowerCase();
  if (path.indexOf("/en/") === 0 || (lang && lang.indexOf("el") !== 0)) return;
  if (/^\/(privacy|p|card|ig|odigos\/efxaristo)\//.test(path)) return;

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var css =
    ".sx-nl{background:var(--ink,#0B1020);color:#EEF0F5;border-radius:14px;padding:32px 34px;position:relative;overflow:hidden;font-family:var(--f-body,Inter,sans-serif)}" +
    ".sx-nl:before{content:'';position:absolute;right:-70px;top:-70px;width:220px;height:220px;border-radius:50%;border:1px solid var(--graphite,#1C2440);box-shadow:0 0 0 30px rgba(28,36,64,.35),0 0 0 60px rgba(28,36,64,.2);pointer-events:none}" +
    ".sx-nl>*{position:relative}" +
    ".sx-nl .l{font-family:var(--f-mono,monospace);font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--slate,#8892AB);display:flex;align-items:center;gap:8px}" +
    ".sx-nl .l b{width:7px;height:7px;border-radius:50%;background:var(--seal,#C8323A)}" +
    ".sx-nl .s{font-family:var(--f-mono,monospace);color:var(--slate,#8892AB);margin-top:20px;font-size:15px}.sx-nl .s span{font-family:var(--f-body,Inter);font-weight:700;color:#EEF0F5}" +
    ".sx-nl h3{font-family:var(--f-disp,'Space Grotesk',sans-serif);font-weight:700;font-size:32px;line-height:1.1;margin:6px 0 10px;color:#EEF0F5;letter-spacing:-.01em}" +
    ".sx-nl h3 i{display:inline-block;width:11px;height:28px;background:var(--seal,#C8323A);margin-left:6px;vertical-align:-3px}" +
    ".sx-nl p{color:#C9D0DD;line-height:1.55;font-size:15px;margin:0 0 20px;max-width:560px}" +
    ".sx-nl form{display:flex;gap:10px;flex-wrap:wrap}" +
    ".sx-nl input[type=email]{flex:1 1 220px;min-width:0;background:var(--graphite,#1C2440);border:1px solid #2A3458;border-radius:8px;padding:13px 14px;color:#fff;font:15px var(--f-body,Inter,sans-serif)}" +
    ".sx-nl input[type=email]::placeholder{color:var(--slate,#8892AB)}" +
    ".sx-nl button[type=submit]{background:var(--seal,#C8323A);color:#fff;border:0;border-radius:8px;padding:13px 22px;font:700 15px var(--f-body,Inter,sans-serif);cursor:pointer}" +
    ".sx-nl button[type=submit]:disabled{opacity:.6;cursor:default}" +
    ".sx-nl .hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}" +
    ".sx-nl .n{font-size:12.5px;color:var(--slate,#8892AB);margin:14px 0 0;line-height:1.5}.sx-nl .n a{color:#C9D0DD}" +
    ".sx-nl .ok{color:#EEF0F5;font-size:15px;line-height:1.55;margin:0}.sx-nl .err{color:#F5A524;font-size:13px;margin:10px 0 0}" +
    ".sx-nl-in{max-width:760px;margin:56px auto;padding:0 var(--gut,24px)}" +
    ".sx-nl-pop{position:fixed;inset:0;z-index:100;background:rgba(11,16,32,.55);display:flex;align-items:center;justify-content:center;padding:20px}" +
    ".sx-nl-pop .sx-nl{max-width:520px;width:100%;box-shadow:0 24px 60px rgba(11,16,32,.35)}" +
    ".sx-nl .x{position:absolute;right:12px;top:10px;background:none;border:0;color:var(--slate,#8892AB);font-size:26px;line-height:1;cursor:pointer;padding:6px}.sx-nl .x:hover{color:#fff}";

  function card(withClose) {
    var d = document.createElement("div");
    d.className = "sx-nl";
    d.innerHTML =
      (withClose ? '<button class="x" type="button" aria-label="Κλείσιμο">×</button>' : "") +
      '<div class="l"><b></b>Newsletter · μία φορά τον μήνα</div>' +
      '<div class="s">{<span>Σ</span>}</div>' +
      "<h3>Σφραγίδα<i aria-hidden=\"true\"></i></h3>" +
      "<p>Ασφάλεια και κανόνες για το AI, μία φορά τον μήνα, από τη SphragisAI. Τι άλλαξε στον AI Act, τι σημαίνει για μια ελληνική επιχείρηση και ένα πρακτικό βήμα για τον μήνα.</p>" +
      '<form novalidate><label class="hp">Μην συμπληρώνεις<input name="website" tabindex="-1" autocomplete="off"></label>' +
      '<input type="email" name="email" required placeholder="Το email σου" aria-label="Email" autocomplete="email">' +
      '<button type="submit">Εγγραφή</button></form>' +
      '<div class="n">Θα σου στείλουμε email επιβεβαίωσης. Μπορείς να διαγραφείς όποτε θέλεις με ένα κλικ. <a href="/privacy/">Πολιτική απορρήτου</a></div>';
    var f = d.querySelector("form");
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var em = f.email.value.trim(), old = d.querySelector(".err");
      if (old) old.remove();
      if (f.website.value) return;                       // bot
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return fail("Γράψε ένα σωστό email.");
      var b = f.querySelector("button"); b.disabled = true; b.textContent = "…";
      var fd = new FormData();
      fd.append("fields[email]", em); fd.append("ml-submit", "1"); fd.append("anticsrf", "true");
      fetch(ACTION, { method: "POST", body: fd })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (!j || !j.success) throw 0;
          set("sub");
          f.parentNode.querySelector(".n").remove();
          f.outerHTML = '<p class="ok"><b>Σχεδόν έτοιμο.</b> Κοίτα το email σου και πάτα το κουμπί επιβεβαίωσης. Αν δεν το βρίσκεις, δες και στα Promotions ή στα Spam.</p>';
          if (window.gtag) window.gtag("event", "newsletter_signup", { form: withClose ? "popup" : "inline" });
        })
        .catch(function () { b.disabled = false; b.textContent = "Εγγραφή"; fail("Κάτι δεν πήγε καλά. Δοκίμασε ξανά ή γράψε στο info@sphragisai.com."); });
      function fail(msg) { var p = document.createElement("p"); p.className = "err"; p.textContent = msg; d.appendChild(p); }
    });
    return d;
  }

  function init() {
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    var foot = document.querySelector("footer.sx-foot");
    var isArticle = /^\/(radar|blog)\/[^\/]+\/$/.test(path) && !/^\/radar\/archive\//.test(path);
    if (isArticle && foot) {
      var w = document.createElement("section"); w.className = "sx-nl-in"; w.id = "newsletter";
      w.appendChild(card(false));
      foot.parentNode.insertBefore(w, foot);
    }
    if (isArticle || get()) return;                       // στα άρθρα μόνο η φόρμα στο τέλος· κλεισμένο ή εγγεγραμμένος
    var shown = false, timer;
    function show() {
      if (shown || get()) return;
      shown = true; clearTimeout(timer); window.removeEventListener("scroll", onScroll);
      var o = document.createElement("div"); o.className = "sx-nl-pop"; o.setAttribute("role", "dialog"); o.setAttribute("aria-label", "Newsletter Σφραγίδα");
      var c = card(true); o.appendChild(c); document.body.appendChild(o);
      function close() { set(get() || "closed"); o.remove(); document.removeEventListener("keydown", esc); }
      function esc(e) { if (e.key === "Escape") close(); }
      c.querySelector(".x").addEventListener("click", close);
      o.addEventListener("click", function (e) { if (e.target === o) close(); });
      document.addEventListener("keydown", esc);
      set("closed");                                      // μία φορά ανά επισκέπτη
    }
    function onScroll() {
      var h = document.documentElement, max = h.scrollHeight - h.clientHeight;
      if (max > 0 && h.scrollTop / max >= 0.5) show();
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    timer = setTimeout(show, 30000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
