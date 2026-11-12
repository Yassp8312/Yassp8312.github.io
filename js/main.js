(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const touch = matchMedia("(hover: none)").matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} }
  };

  /* ---------- Idioma ---------- */
  let lang = store.get("lang") || ((navigator.language || "es").startsWith("es") ? "es" : "en");
  const t = (k) => (I18N[lang] && I18N[lang][k]) || I18N.es[k] || k;

  function applyLang() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach((el) => { el.innerHTML = t(el.dataset.i18n); });
    $("#hintText").textContent = t(touch ? "hero.hintTouch" : "hero.hint");
    $("#langBtn").textContent = lang === "es" ? "EN" : "ES";
    renderHeroCode();
    renderPhotoCode();
    renderGrid();
    renderAlso();
  }
  $("#langBtn").addEventListener("click", () => { lang = lang === "es" ? "en" : "es"; store.set("lang", lang); applyLang(); });

  /* ---------- Resaltado de sintaxis mínimo ---------- */
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const RE = /(<!--[\s\S]*?-->|\/\*[\s\S]*?\*\/|\/\/[^\n]*)|("[^"\n]*")(?=\s*:)|("[^"\n]*"|'[^'\n]*')|(<\/?[a-zA-Z0-9-]+|\/?>)|([a-zA-Z-]+)(?==)|([a-z-]+)(?=\s*:\s)|([{}()[\];,=]+)/g;
  function highlight(src) {
    let out = "", last = 0, m;
    RE.lastIndex = 0;
    while ((m = RE.exec(src))) {
      out += esc(src.slice(last, m.index));
      const [tok, com, key, str, tag, attr, prop, pun] = m;
      const cls = com ? "com" : key ? "key" : str ? "str" : tag ? "tag" : attr ? "attr" : prop ? "key" : pun ? "pun" : "";
      out += `<span class="tk-${cls}">${esc(tok)}</span>`;
      last = m.index + tok.length;
    }
    return out + esc(src.slice(last));
  }
  const plain = (html) => { const d = document.createElement("div"); d.innerHTML = html; return d.textContent; };

  /* ---------- Código detrás del hero ---------- */
  function renderHeroCode() {
    const [l1, l2] = t("hero.title").split("<br>").map(plain);
    const src = `<!-- index.html · ${lang === "es" ? "lo que hay detrás de lo que ves" : "what's behind what you see"} -->
<section class="hero">
  <p class="kicker">${plain(t("hero.kicker"))}</p>
  <h1 class="hero-title">
    ${l1}
    <span class="accent">${l2}</span>
  </h1>
  <p class="hero-sub">${plain(t("hero.sub"))}</p>
  <a href="#proyectos" class="btn dark">${plain(t("hero.cta1"))}</a>
  <a href="#contacto" class="btn line">${plain(t("hero.cta2"))}</a>
</section>

/* styles.css */
.hero-title {
  font-family: "Instrument Serif", serif;
  font-size: clamp(3rem, 9vw, 7.6rem);
  letter-spacing: -.02em;
}
.accent { color: #ff5b2e; font-style: italic; }

// main.js — ${lang === "es" ? "la lupa que estás usando ahora mismo" : "the lens you're using right now"}
hero.addEventListener("pointermove", (e) => {
  const box = hero.getBoundingClientRect();
  hero.style.setProperty("--x", e.clientX - box.left + "px");
  hero.style.setProperty("--y", e.clientY - box.top + "px");
});`;
    $("#heroCode").innerHTML = highlight(src);
  }

  function renderPhotoCode() {
    const o = {
      name: "Jorge Ricardo Cintra Rad",
      aka: "Yassper",
      role: lang === "es" ? ["Desarrollador full-stack", "Diseñador UX/UI"] : ["Full-stack developer", "UX/UI designer"],
      based: "La Habana, Cuba",
      studies: "UCI · Ingeniería en Ciencias Informáticas",
      background: lang === "es" ? "Escuela Nacional de Circo" : "National Circus School",
      languages: ["es", "pt", "en"],
      available: true
    };
    $("#photoCode").innerHTML = highlight("// jorge.json\n" + JSON.stringify(o, null, 2));
  }

  /* ---------- Proyectos ---------- */
  function projectJSON(p, i) {
    const o = {
      name: p.name,
      stack: p.stack,
      repo: p.repo.replace("https://", ""),
      demo: p.demo ? p.demo.replace("https://", "") : null,
      author: "Jorge Ricardo Cintra Rad"
    };
    return `// projects/${String(i + 1).padStart(2, "0")}-${p.id}.json\n` + JSON.stringify(o, null, 2);
  }
  function renderGrid() {
    $("#grid").innerHTML = PROJECTS.map((p, i) => `
      <article class="card xray reveal">
        <div class="layer design">
          <div class="top"><span class="idx">${String(i + 1).padStart(2, "0")}</span><span class="idx">${p.stack[0]}</span></div>
          <h3>${p.name}</h3>
          <p>${p[lang]}</p>
          <ul class="chips">${p.stack.map((s) => `<li>${s}</li>`).join("")}</ul>
          <div class="links">
            <a href="${p.repo}" target="_blank" rel="noopener">${t("work.code")}</a>
            ${p.demo ? `<a href="${p.demo}" target="_blank" rel="noopener">${t("work.demo")}</a>` : ""}
          </div>
        </div>
        <pre class="layer code" aria-hidden="true"><code>${highlight(projectJSON(p, i))}</code></pre>
      </article>`).join("");
    bindLens($$("#grid .xray"));
    observeReveals();
  }
  function renderAlso() {
    $("#alsoList").innerHTML = ALSO.map((a) => `<li><a href="${a.url}" target="_blank" rel="noopener">${a.name}</a> <span>· ${a[lang]}</span></li>`).join("");
  }

  /* ---------- La lupa ---------- */
  function bindLens(els) {
    els.forEach((el) => {
      if (el.dataset.lens) return;
      el.dataset.lens = "1";
      let hideTimer;
      const move = (e) => {
        const b = el.getBoundingClientRect();
        el.style.setProperty("--x", e.clientX - b.left + "px");
        el.style.setProperty("--y", e.clientY - b.top + "px");
      };
      el.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { move(e); el.classList.add("lens-on"); } });
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") el.classList.remove("lens-on"); });
      el.addEventListener("pointerdown", (e) => {
        if (e.pointerType === "mouse") return;
        move(e); el.classList.add("lens-on");
        clearTimeout(hideTimer);
      });
      el.addEventListener("pointerup", (e) => {
        if (e.pointerType === "mouse") return;
        hideTimer = setTimeout(() => el.classList.remove("lens-on"), 1400);
      });
      el.addEventListener("pointercancel", () => { hideTimer = setTimeout(() => el.classList.remove("lens-on"), 600); });
    });
  }
  bindLens([$("#heroXray"), $("#photoXray")]);

  /* ---------- Modo Diseño / Código ---------- */
  function setMode(mode) {
    document.body.classList.toggle("code-mode", mode === "code");
    $$(".mode-btn").forEach((b) => b.classList.toggle("on", b.dataset.mode === mode));
  }
  $$(".mode-btn").forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));

  /* ---------- Nav ---------- */
  const nav = $(".nav");
  const onScroll = () => nav.classList.toggle("scrolled", scrollY > 30);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  $("#menuBtn").addEventListener("click", () => document.body.classList.toggle("menu-open"));
  $$("#navLinks a").forEach((a) => a.addEventListener("click", () => document.body.classList.remove("menu-open")));

  /* ---------- Aparecer al hacer scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  const observeReveals = () => $$(".reveal:not(.in)").forEach((el) => io.observe(el));

  /* ---------- Terminal secreta ---------- */
  const term = $("#term"), out = $("#termOut"), input = $("#termInput");
  const print = (html) => { out.insertAdjacentHTML("beforeend", html + "\n"); out.scrollTop = out.scrollHeight; };
  const es = () => lang === "es";
  const CMDS = {
    help: () => print((es() ? "comandos: " : "commands: ") + ["whoami", "projects", "security", "stack", "contact", "coffee", "xray", "clear", "exit"].map((c) => `<b>${c}</b>`).join(" · ")),
    whoami: () => print(es()
      ? "Jorge Ricardo Cintra Rad — dev full-stack y diseñador UX/UI. La Habana, Cuba."
      : "Jorge Ricardo Cintra Rad — full-stack dev and UX/UI designer. Havana, Cuba."),
    projects: () => PROJECTS.forEach((p, i) => print(`${String(i + 1).padStart(2, "0")}  <a href="${p.repo}" target="_blank" rel="noopener">${p.name}</a> — ${p.stack.join(", ")}`)),
    security: () => print((es() ? "Lo que no se ve:\n" : "What you don't see:\n") +
      `  ▸ <a href="https://github.com/Yassp8312/Scotoma" target="_blank" rel="noopener">Scotoma</a>  ${es() ? "mensajería E2E efímera en Rust" : "ephemeral E2E messaging in Rust"}\n` +
      `  ▸ <a href="https://github.com/Yassp8312/Lethe" target="_blank" rel="noopener">Lethe</a>    ${es() ? "almacenamiento cifrado con negación plausible" : "encrypted storage with plausible deniability"}\n` +
      `  ▸ <a href="https://github.com/Yassp8312/SEER-Social-Engineering-Exposure-and-Evaluation-Research" target="_blank" rel="noopener">SEER</a>     ${es() ? "investigación educativa de ingeniería social" : "educational social engineering research"}`),
    stack: () => print("TypeScript · React · Next.js · Vue · Node · Python · Django · Flutter · Rust · Supabase · PostgreSQL · Godot · Unreal · Adobe XD · Figma"),
    contact: () => print('<a href="mailto:jorgecintra2@gmail.com">jorgecintra2@gmail.com</a> · <a href="https://github.com/Yassp8312" target="_blank" rel="noopener">github.com/Yassp8312</a>'),
    coffee: () => print('☕ <a href="https://jorge-coffee.onrender.com/" target="_blank" rel="noopener">jorge-coffee.onrender.com</a>'),
    xray: () => { const on = !document.body.classList.contains("code-mode"); setMode(on ? "code" : "design"); print(on ? "xray: on" : "xray: off"); },
    sudo: () => print(es() ? "Buen intento." : "Nice try."),
    abracadabra: () => print(es() ? "Un mago nunca revela sus secretos. Pero esta web sí: prueba <b>xray</b>." : "A magician never reveals his secrets. This site does: try <b>xray</b>."),
    clear: () => { out.innerHTML = ""; },
    exit: () => closeTerm()
  };
  function openTerm() { term.classList.remove("hidden"); if (!out.innerHTML) print(t("term.hello")); setTimeout(() => input.focus(), 30); }
  function closeTerm() { term.classList.add("hidden"); }
  $("#termForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const raw = input.value.trim(); input.value = "";
    if (!raw) return;
    print(`<span class="cmd">❯ ${esc(raw)}</span>`);
    const cmd = raw.toLowerCase().split(/\s+/)[0];
    (CMDS[cmd] || (() => print((es() ? "comando no encontrado: " : "command not found: ") + esc(cmd) + (es() ? ". Prueba <b>help</b>" : ". Try <b>help</b>"))))();
  });
  $("#termClose").addEventListener("click", closeTerm);
  $("#termHint").addEventListener("click", openTerm);
  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !term.classList.contains("hidden")) { closeTerm(); return; }
    if (e.target.matches("input, textarea")) return;
    if (e.key === "~" || e.key === "`" || e.key === "Dead") { e.preventDefault(); openTerm(); }
  });

  /* ---------- Arranque ---------- */
  applyLang();
  observeReveals();
})();
