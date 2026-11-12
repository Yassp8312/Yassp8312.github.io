(() => {
  const B = window.BARBERIA;
  const $ = (s) => document.querySelector(s);

  const UI = {
    es: {
      navServicios: "Servicios", navResenas: "Reseñas", navVisitanos: "Visítanos",
      ctaReservar: B.canalReserva === "instagram" ? "Reservar por Instagram" : "Reservar por WhatsApp", llamar: "Llamar",
      abierto: "Abierto ahora · cierra a las", cerrado: "Cerrado ahora", abreHoy: "Abre hoy a las", abreManana: "Abre",
      tServicios: "Servicios y precios", tGaleria: "Nuestros cortes", tReservar: "Reserva tu turno",
      subReservar: B.canalReserva === "instagram" ? "Elige, copiamos tu mensaje y se abre nuestro chat de Instagram: solo pégalo y envía. Te confirmamos por ahí." : "Elige y te abrimos WhatsApp con el mensaje listo. Te confirmamos por ahí.",
      fServicio: "Servicio", fBarbero: "Barbero", fDia: "Día", fHora: "Hora", fNombre: "Tu nombre",
      cualquiera: "El que esté libre", btnEnviar: B.canalReserva === "instagram" ? "Copiar mensaje y abrir Instagram" : "Enviar por WhatsApp",
      tResenas: "Lo que dicen en Google", verResenas: "Ver las {n} reseñas en Google →",
      tVisitanos: "Visítanos", btnComoLlegar: "Cómo llegar", hechoPor: "Web por",
      resenasG: "reseñas en Google", preciosEj: "* Precios de ejemplo para esta vista previa.",
      demo: "Vista previa creada por Yassper Design — todo se puede ajustar a tu gusto.",
      fotoPh: "Aquí van tus fotos de Instagram",
      errNombre: "Pon tu nombre para la reserva.", errDia: "Elige un día.", errCerrado: "Ese día está cerrado, elige otro.",
      errHora: "No quedan horas ese día, elige otro.", copiado: "✓ Mensaje copiado. Pégalo en el chat de Instagram que se abrió.",
      dias: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
      cerradoDia: "Cerrado", min: "min",
      msg: (d) => `Hola ${B.nombre}, quiero reservar:\n• Servicio: ${d.servicio}\n• Barbero: ${d.barbero}\n• Día: ${d.dia}\n• Hora: ${d.hora}\nNombre: ${d.nombre}`,
      msgGen: `Hola ${B.nombre}, quiero reservar un turno.`,
    },
    en: {
      navServicios: "Services", navResenas: "Reviews", navVisitanos: "Visit us",
      ctaReservar: B.canalReserva === "instagram" ? "Book on Instagram" : "Book on WhatsApp", llamar: "Call",
      abierto: "Open now · closes at", cerrado: "Closed now", abreHoy: "Opens today at", abreManana: "Opens",
      tServicios: "Services & prices", tGaleria: "Our cuts", tReservar: "Book your spot",
      subReservar: B.canalReserva === "instagram" ? "Pick your options, we copy your message and open our Instagram chat: just paste and send. We confirm there." : "Pick your options and WhatsApp opens with the message ready. We confirm there.",
      fServicio: "Service", fBarbero: "Barber", fDia: "Day", fHora: "Time", fNombre: "Your name",
      cualquiera: "Whoever is free", btnEnviar: B.canalReserva === "instagram" ? "Copy message & open Instagram" : "Send on WhatsApp",
      tResenas: "What Google says", verResenas: "See all {n} Google reviews →",
      tVisitanos: "Visit us", btnComoLlegar: "Get directions", hechoPor: "Website by",
      resenasG: "Google reviews", preciosEj: "* Sample prices for this preview.",
      demo: "Preview built by Yassper Design — everything can be adjusted to your taste.",
      fotoPh: "Your Instagram photos go here",
      errNombre: "Add your name for the booking.", errDia: "Pick a day.", errCerrado: "We're closed that day, pick another.",
      errHora: "No times left that day, pick another.", copiado: "✓ Message copied. Paste it in the Instagram chat that opened.",
      dias: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      cerradoDia: "Closed", min: "min",
      msg: (d) => `Hi ${B.nombre}, I'd like to book:\n• Service: ${d.servicio}\n• Barber: ${d.barbero}\n• Day: ${d.dia}\n• Time: ${d.hora}\nName: ${d.nombre}`,
      msgGen: `Hi ${B.nombre}, I'd like to book an appointment.`,
    },
  };

  let lang = "es";
  // Español por defecto (Hialeah); se recuerda si el visitante cambia a inglés
  try { lang = localStorage.getItem("barberia-lang") || "es"; } catch (e) {}
  if (!UI[lang]) lang = "es";

  const tx = (v) => (v && typeof v === "object" ? v[lang] ?? v.es : v);
  const t = (k) => UI[lang][k];
  const wa = (text) => `https://wa.me/${B.whatsapp}?text=${encodeURIComponent(text)}`;
  const ig = () => `https://ig.me/m/${B.instagram}`;
  const esIG = B.canalReserva === "instagram" && B.instagram;
  const fmtHour = (h) => {
    const hh = Math.floor(h), mm = Math.round((h - hh) * 60);
    if (lang === "en") {
      const ap = hh >= 12 ? "PM" : "AM";
      return `${((hh + 11) % 12) + 1}${mm ? ":" + String(mm).padStart(2, "0") : ""} ${ap}`;
    }
    const ap = hh >= 12 ? "p. m." : "a. m.";
    return `${((hh + 11) % 12) + 1}${mm ? ":" + String(mm).padStart(2, "0") : ""} ${ap}`;
  };

  // Hora actual en la zona de la barbería
  function nowThere() {
    const p = new Intl.DateTimeFormat("en-US", {
      timeZone: B.zonaHoraria, year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hour12: false, weekday: "short",
    }).formatToParts(new Date());
    const g = (k) => p.find((x) => x.type === k).value;
    const wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(g("weekday"));
    const hour = (+g("hour") % 24) + (+g("minute")) / 60;
    return { wd, hour, iso: `${g("year")}-${g("month")}-${g("day")}` };
  }

  function renderStatus() {
    const el = $("#status"), n = nowThere(), h = B.horario[n.wd];
    el.className = "status";
    if (h && n.hour >= h[0] && n.hour < h[1]) {
      el.classList.add("open"); el.textContent = `${t("abierto")} ${fmtHour(h[1])}`;
    } else if (h && n.hour < h[0]) {
      el.classList.add("closed"); el.textContent = `${t("abreHoy")} ${fmtHour(h[0])}`;
    } else {
      el.classList.add("closed");
      for (let i = 1; i <= 7; i++) {
        const d = (n.wd + i) % 7, hh = B.horario[d];
        if (hh) { el.textContent = `${t("cerrado")} · ${t("abreManana")} ${t("dias")[d].toLowerCase()} ${fmtHour(hh[0])}`; break; }
      }
    }
  }

  function slotsFor(dateStr) {
    if (!dateStr) return [];
    const [y, m, d] = dateStr.split("-").map(Number);
    const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
    const h = B.horario[wd];
    if (!h) return null;
    const n = nowThere();
    const out = [];
    const last = h[1] - 0.5; // último turno 30 min antes de cerrar
    for (let x = h[0]; x <= last; x += 0.5) {
      if (dateStr === n.iso && x <= n.hour + 0.25) continue;
      out.push(x);
    }
    return out;
  }

  function fillHours() {
    const sel = $("#fHora"), s = slotsFor($("#fDia").value);
    sel.innerHTML = "";
    if (!s || !s.length) { sel.disabled = true; return; }
    sel.disabled = false;
    s.forEach((x) => sel.add(new Option(fmtHour(x), fmtHour(x))));
  }

  function render() {
    document.documentElement.lang = lang;
    document.title = `${B.nombre} · ${tx(B.eslogan)}`;
    document.querySelector('meta[name="description"]').content = `${B.nombre} — ${tx(B.intro)}`;
    const root = document.documentElement.style;
    if (B.colores) { root.setProperty("--acento", B.colores.acento); root.setProperty("--acento2", B.colores.acento2); }

    document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
    $("#langBtn").textContent = lang === "es" ? "EN" : "ES";
    $("#demoBar").textContent = B.preciosDeEjemplo ? t("demo") : "";

    if (B.portada) $(".hero").style.setProperty("--hero-img", `url("${B.portada}")`);
    $("#navBrand").textContent = B.nombre;
    $("#heroTitle").textContent = B.nombre;
    $("#heroTag").textContent = tx(B.eslogan);
    $("#introText").textContent = tx(B.intro);
    const stars = $("#heroStars");
    stars.href = B.googleMapsUrl;
    stars.innerHTML = `<b>★★★★★</b> ${B.rating.toLocaleString(lang)} <small>${B.resenasTotal.toLocaleString(lang)} ${t("resenasG")}</small>`;
    const call = $("#heroCall");
    call.href = `tel:${B.telefonoLink}`; call.textContent = `${t("llamar")} ${B.telefono}`;
    $("#sellos").innerHTML = B.sellos.map((s) => `<li>${tx(s)}</li>`).join("");

    renderStatus();

    // Servicios
    $("#priceNote").textContent = B.preciosDeEjemplo ? t("preciosEj") : "";
    $("#servicesList").innerHTML = B.servicios.map((s) => `
      <li><h3>${tx(s.nombre)}<span class="dur">${s.min} ${t("min")}</span></h3>
      <span class="price">$${s.precio}</span><p>${tx(s.desc)}</p></li>`).join("");

    // Galería
    $("#gallery").innerHTML = B.galeria.length
      ? B.galeria.map((src) => `<img src="${src}" alt="${B.nombre}" loading="lazy" />`).join("")
      : Array.from({ length: 6 }, () => `<div class="ph">${t("fotoPh")}</div>`).join("");

    // Form
    const fs = $("#fServicio"), prevS = fs.value;
    fs.innerHTML = "";
    B.servicios.forEach((s) => fs.add(new Option(`${tx(s.nombre)} — $${s.precio}`, s.id)));
    if (prevS) fs.value = prevS;
    const fb = $("#fBarbero"), prevB = fb.value;
    fb.innerHTML = "";
    fb.add(new Option(t("cualquiera"), ""));
    B.barberos.forEach((b) => fb.add(new Option(`${b.nombre} · ${tx(b.rol)}`, b.nombre)));
    fb.value = prevB;
    const n = nowThere();
    $("#fDia").min = n.iso;
    if (!$("#fDia").value) {
      // Primer día con turnos disponibles (hoy si aún quedan)
      const [y, m, d] = n.iso.split("-").map(Number);
      for (let i = 0; i < 8; i++) {
        const iso = new Date(Date.UTC(y, m - 1, d + i)).toISOString().slice(0, 10);
        const s = slotsFor(iso);
        if (s && s.length) { $("#fDia").value = iso; break; }
      }
    }
    fillHours();

    // Reseñas
    $("#reviews").innerHTML = B.resenas.map((r) => `
      <figure class="review"><div class="q">★★★★★</div><p>“${r.texto}”</p><cite>— ${r.autor}, Google</cite></figure>`).join("");
    const more = $("#moreReviews");
    more.href = B.googleMapsUrl; more.textContent = t("verResenas").replace("{n}", B.resenasTotal.toLocaleString(lang));

    // Visítanos
    $("#addr").textContent = B.direccion;
    const ph = $("#phone"); ph.href = `tel:${B.telefonoLink}`; ph.textContent = B.telefono;
    $("#igLine").innerHTML = B.instagram
      ? `<a href="https://instagram.com/${B.instagram}" target="_blank" rel="noopener">@${B.instagram}</a>` : "";
    $("#hours").innerHTML = [1, 2, 3, 4, 5, 6, 0].map((d) => {
      const h = B.horario[d];
      return `<tr class="${d === n.wd ? "today" : ""}"><td>${t("dias")[d]}</td><td>${h ? `${fmtHour(h[0])} – ${fmtHour(h[1])}` : t("cerradoDia")}</td></tr>`;
    }).join("");
    $("#directions").href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(B.direccion)}`;
    const map = $("#map");
    const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(B.nombre + ", " + B.direccion)}&output=embed`;
    if (map.src !== mapSrc) map.src = mapSrc;

    $("#footName").textContent = `${B.nombre} · ${B.direccion}`;
    $("#waFloat").href = esIG ? ig() : wa(t("msgGen"));
    document.body.classList.toggle("canal-ig", !!esIG);
  }

  // Eventos
  $("#langBtn").addEventListener("click", () => {
    lang = lang === "es" ? "en" : "es";
    try { localStorage.setItem("barberia-lang", lang); } catch (e) {}
    render();
  });
  $("#fDia").addEventListener("change", fillHours);

  $("#bookForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const err = $("#formError");
    const nombre = $("#fNombre").value.trim();
    const dia = $("#fDia").value;
    const slots = slotsFor(dia);
    if (!dia) return (err.textContent = t("errDia"));
    if (slots === null) return (err.textContent = t("errCerrado"));
    if (!slots.length) return (err.textContent = t("errHora"));
    if (!nombre) { err.textContent = t("errNombre"); $("#fNombre").focus(); return; }
    err.textContent = ""; err.classList.remove("ok");

    const s = B.servicios.find((x) => x.id === $("#fServicio").value);
    const [y, m, d] = dia.split("-").map(Number);
    const fecha = new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(lang === "es" ? "es-US" : "en-US",
      { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
    const text = UI[lang].msg({
      servicio: `${tx(s.nombre)} ($${s.precio})`,
      barbero: $("#fBarbero").value || t("cualquiera"),
      dia: fecha, hora: $("#fHora").value, nombre,
    });
    if (esIG) {
      const go = () => { err.textContent = t("copiado"); err.classList.add("ok"); window.open(ig(), "_blank", "noopener"); };
      (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(go, () => {
        const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); } catch (e) {} ta.remove(); go();
      });
      return;
    }
    window.open(wa(text), "_blank", "noopener");
  });

  render();
  setInterval(renderStatus, 60000);
})();
