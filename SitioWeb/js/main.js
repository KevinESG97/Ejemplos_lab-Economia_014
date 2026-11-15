/* Sitio de la investigación – Economía 014 (USAC)
   Navegación por pestañas, animaciones de entrada, contadores, barras, filtros y brillo de vidrio. */
(function () {
  "use strict";

  const vistas = document.querySelectorAll(".vista");
  const enlaces = document.querySelectorAll(".pestanas a");
  const indicador = document.querySelector(".indicador");
  const nav = document.querySelector(".pestanas");
  const nombres = Array.from(vistas).map((v) => v.dataset.vista);

  /* ---------------------------------------------- Pestañas */
  function moverIndicador(enlace) {
    if (!enlace || !indicador) return;
    indicador.style.width = enlace.offsetWidth + "px";
    indicador.style.transform = "translateX(" + enlace.offsetLeft + "px)";
  }

  function mostrar(nombre, desplazar) {
    if (!nombres.includes(nombre)) nombre = "inicio";
    vistas.forEach((v) => v.classList.toggle("activa", v.dataset.vista === nombre));
    let activo = null;
    enlaces.forEach((a) => {
      const es = a.dataset.tab === nombre;
      a.classList.toggle("activa", es);
      if (es) activo = a;
    });
    moverIndicador(activo);
    if (activo && nav) {
      nav.scrollTo({ left: activo.offsetLeft - nav.clientWidth / 2 + activo.offsetWidth / 2, behavior: "smooth" });
    }
    if (desplazar) window.scrollTo({ top: 0, behavior: "smooth" });
    observarRevelar(document.querySelector('[data-vista="' + nombre + '"]'));
  }

  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-tab]");
    if (!a) return;
    e.preventDefault();
    const nombre = a.dataset.tab;
    if (location.hash !== "#" + nombre) history.pushState(null, "", "#" + nombre);
    mostrar(nombre, true);
  });
  window.addEventListener("popstate", () => mostrar(location.hash.slice(1), true));
  window.addEventListener("resize", () => moverIndicador(document.querySelector(".pestanas a.activa")));

  /* ---------------------------------------------- Aparición al hacer scroll */
  const observador = "IntersectionObserver" in window
    ? new IntersectionObserver((entradas) => {
        entradas.forEach((en) => {
          if (!en.isIntersecting) return;
          en.target.classList.add("visible");
          animarContenido(en.target);
          observador.unobserve(en.target);
        });
      }, { threshold: 0.12 })
    : null;

  function observarRevelar(vista) {
    if (!vista) return;
    vista.querySelectorAll(".revelar:not(.visible)").forEach((el, i) => {
      el.style.transitionDelay = Math.min(i * 60, 420) + "ms";
      if (observador) observador.observe(el);
      else { el.classList.add("visible"); animarContenido(el); }
    });
  }

  /* Contadores y barras se animan cuando aparecen */
  function animarContenido(el) {
    el.querySelectorAll("[data-contar]").forEach(contar);
    el.querySelectorAll(".pista i[data-valor]").forEach((b) => {
      requestAnimationFrame(() => { b.style.width = b.dataset.valor + "%"; });
    });
  }

  function contar(el) {
    const fin = parseInt(el.dataset.contar, 10);
    const inicio = performance.now();
    const dur = 1200;
    (function paso(t) {
      const p = Math.min((t - inicio) / dur, 1);
      el.textContent = Math.round(fin * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(paso);
    })(inicio);
  }

  /* ---------------------------------------------- Filtro de universidades */
  document.querySelectorAll("[data-filtro]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-filtro]").forEach((b) => b.classList.toggle("activo", b === btn));
      const f = btn.dataset.filtro;
      document.querySelectorAll("#lista-universidades .uni").forEach((u) => {
        const ver = f === "todas" || u.dataset.lab === f;
        if (ver) {
          u.classList.remove("oculto");
          requestAnimationFrame(() => u.classList.remove("filtrada"));
        } else {
          u.classList.add("filtrada");
          setTimeout(() => u.classList.contains("filtrada") && u.classList.add("oculto"), 300);
        }
      });
    });
  });

  /* ---------------------------------------------- Grupos de herramientas */
  document.querySelectorAll("[data-grupo]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-grupo]").forEach((b) => b.classList.toggle("activo", b === btn));
      document.querySelectorAll("[data-grupo-panel]").forEach((p) => {
        p.classList.toggle("oculto", p.dataset.grupoPanel !== btn.dataset.grupo);
      });
    });
  });

  /* ---------------------------------------------- Filtro de ejemplos por unidad */
  document.querySelectorAll("[data-unidad]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-unidad]").forEach((b) => b.classList.toggle("activo", b === btn));
      const u = btn.dataset.unidad;
      document.querySelectorAll('[data-vista="ejemplos"] [data-u]').forEach((el) => {
        el.classList.toggle("oculto", u !== "todas" && el.dataset.u !== u);
      });
    });
  });

  /* ---------------------------------------------- Brillo del vidrio que sigue al cursor */
  document.addEventListener("pointermove", (e) => {
    const g = e.target.closest && e.target.closest(".glass");
    if (!g) return;
    const r = g.getBoundingClientRect();
    g.style.setProperty("--mx", e.clientX - r.left + "px");
    g.style.setProperty("--my", e.clientY - r.top + "px");
  });

  /* ---------------------------------------------- Barra de progreso de lectura */
  const barra = document.getElementById("barra-progreso");
  window.addEventListener("scroll", () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (barra) barra.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
  }, { passive: true });

  /* ---------------------------------------------- Inicio */
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  mostrar(location.hash.slice(1) || "inicio", false);
  window.scrollTo(0, 0);
  window.addEventListener("load", () => window.scrollTo(0, 0));
  // Recalcular el indicador cuando cargan las fuentes
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => moverIndicador(document.querySelector(".pestanas a.activa")));
  }
})();
