/* =========================================================
   AATAN Sorocaba · página de apoio
   Desenvolvido por thalyssxn
   ========================================================= */
(() => {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------- armazenamento seguro ---------- */
  const store = {
    get(k, fallback = null) {
      try { const v = localStorage.getItem(k); return v === null ? fallback : JSON.parse(v); }
      catch { return fallback; }
    },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } },
  };

  /* =========================================================
     Animais (para adicionar mais, é só incluir aqui e colocar
     a foto em /assets/img/animais/)
     ========================================================= */
  const pets = [
    { id: "scott",    nome: "Scott",    tipo: "cao" },
    { id: "sofia",    nome: "Sofia",    tipo: "cao" },
    { id: "chokito",  nome: "Chokito",  tipo: "cao" },
    { id: "cora",     nome: "Cora",     tipo: "cao" },
    { id: "ramon",    nome: "Ramon",    tipo: "cao" },
    { id: "scar",     nome: "Scar",     tipo: "cao" },
    { id: "lucca",    nome: "Lucca",    tipo: "cao" },
    { id: "clifford", nome: "Clifford", tipo: "cao" },
    { id: "paris",    nome: "Paris",    tipo: "cao" },
    { id: "zafir",    nome: "Zafir",    tipo: "cao" },
    { id: "bisteca",  nome: "Bisteca",  tipo: "cao" },
    { id: "fabricia", nome: "Fabrícia", tipo: "gato" },
  ];

  const petText = (p) =>
    `${p.nome} está no abrigo da AATAN esperando por uma família cheia de amor. ` +
    `Para saber idade, porte, temperamento e como funciona a adoção, fale com a equipe do abrigo ` +
    `pelo formulário ou pelo Instagram. Se não puder adotar, compartilhar já ajuda muito! 🐾`;

  /* ---------- curtidas ---------- */
  let likes = store.get("aatan_likes", {}) || {};
  const canPersist = () => store.get("aatan_cookie") !== "declined";
  const saveLikes = () => { if (canPersist()) store.set("aatan_likes", likes); };

  /* ---------- render dos cards ---------- */
  const grid = $("#pets");
  grid.innerHTML = pets.map((p) => `
    <article class="pet reveal" data-tipo="${p.tipo}" data-id="${p.id}" tabindex="0" role="button" aria-label="Conhecer ${p.nome}">
      <div class="pet__img">
        <img src="/assets/img/animais/${p.id}.jpg" alt="${p.tipo === "gato" ? "Gata" : "Cão"} ${p.nome}, disponível para adoção" loading="lazy" width="790" height="620" />
        <span class="pet__name">${p.nome}</span>
      </div>
      <div class="pet__body">
        <div>
          <span class="pet__tag">Disponível para adoção</span>
          <p class="pet__traits">${p.tipo === "gato" ? "🐱 Gata" : "🐶 Cão"} · ver mais</p>
        </div>
        <button class="like ${likes[p.id] ? "is-liked" : ""}" data-like="${p.id}" aria-label="Curtir ${p.nome}" aria-pressed="${!!likes[p.id]}">
          ${likes[p.id] ? "🧡" : "🤍"}
        </button>
      </div>
    </article>`).join("");

  /* ---------- filtros ---------- */
  $$(".chip").forEach((chip) => chip.addEventListener("click", () => {
    $$(".chip").forEach((c) => { c.classList.remove("is-active"); c.setAttribute("aria-selected", "false"); });
    chip.classList.add("is-active"); chip.setAttribute("aria-selected", "true");
    const f = chip.dataset.filter;
    $$(".pet").forEach((card) => {
      const show = f === "todos" || card.dataset.tipo === f;
      card.classList.toggle("is-hidden", !show);
      if (show) { card.classList.remove("is-in"); requestAnimationFrame(() => card.classList.add("is-in")); }
    });
  }));

  /* ---------- clique nos cards (curtir / abrir modal) ---------- */
  grid.addEventListener("click", (e) => {
    const likeBtn = e.target.closest("[data-like]");
    if (likeBtn) {
      e.stopPropagation();
      const id = likeBtn.dataset.like;
      likes[id] = !likes[id];
      likeBtn.classList.toggle("is-liked", likes[id]);
      likeBtn.setAttribute("aria-pressed", likes[id]);
      likeBtn.textContent = likes[id] ? "🧡" : "🤍";
      saveLikes();
      if (likes[id]) {
        const r = likeBtn.getBoundingClientRect();
        pawBurst(r.left + r.width / 2, r.top + r.height / 2, 7, "#f07b1e");
        toast(`Você curtiu ${pets.find((p) => p.id === id).nome}! 🧡`);
      }
      return;
    }
    const card = e.target.closest(".pet");
    if (card) openPet(card.dataset.id);
  });
  grid.addEventListener("keydown", (e) => {
    const card = e.target.closest(".pet");
    if (card && e.target === card && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openPet(card.dataset.id); }
  });

  /* ---------- efeito 3D nos cards (só mouse) ---------- */
  if (finePointer && !reduceMotion) {
    grid.addEventListener("pointermove", (e) => {
      const card = e.target.closest(".pet"); if (!card) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
    });
    grid.addEventListener("pointerout", (e) => {
      const card = e.target.closest(".pet");
      if (card && !card.contains(e.relatedTarget)) card.style.transform = "";
    });
  }

  /* =========================================================
     Modais
     ========================================================= */
  let lastFocus = null;
  function openModal(modal) {
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    $(".modal__close", modal).focus();
  }
  function closeModal(modal) {
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  $$(".modal").forEach((m) => m.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeModal(m); }));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") $$(".modal").forEach((m) => { if (!m.hidden) closeModal(m); });
  });

  const petModal = $("#petModal");
  function openPet(id) {
    const p = pets.find((x) => x.id === id); if (!p) return;
    $("#petModalImg").src = `/assets/img/animais/${p.id}.jpg`;
    $("#petModalImg").alt = `${p.nome}, disponível para adoção`;
    $("#petModalName").textContent = p.nome;
    $("#petModalText").textContent = petText(p);
    openModal(petModal);
  }

  const privacyModal = $("#privacyModal");
  $("#openPrivacy").addEventListener("click", () => openModal(privacyModal));
  $$("[data-open-privacy]").forEach((b) => b.addEventListener("click", () => openModal(privacyModal)));

  /* =========================================================
     Copiar PIX
     ========================================================= */
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch {
      const ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      let ok = false; try { ok = document.execCommand("copy"); } catch { ok = false; }
      ta.remove(); return ok;
    }
  }
  $$("[data-copy]").forEach((btn) => btn.addEventListener("click", async (e) => {
    const ok = await copyText(btn.dataset.copy);
    toast(ok ? "Chave PIX copiada! Obrigado por ajudar 🧡" : `PIX: ${btn.dataset.copy}`);
    pawBurst(e.clientX || innerWidth / 2, e.clientY || innerHeight / 2, 8, "#6a3fb5");
  }));

  /* ---------- toast ---------- */
  const toastEl = $("#toast"); let toastT;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("is-visible");
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove("is-visible"), 2600);
  }

  /* =========================================================
     Efeito de patinhas
     ========================================================= */
  const pawLayer = $(".paw-layer");
  const pawColors = ["#6a3fb5", "#f07b1e", "#f2a51c", "#3b1f78"];

  function spawnPaw(x, y, { rot = 0, size = 22, color, cls = "", dx = 0, dy = 0 } = {}) {
    const el = document.createElement("i");
    el.className = `paw ${cls}`;
    el.style.left = `${x}px`; el.style.top = `${y}px`;
    el.style.setProperty("--r", `${rot}deg`);
    el.style.setProperty("--s", `${size}px`);
    el.style.setProperty("--c", color || pawColors[Math.floor(Math.random() * pawColors.length)]);
    el.style.setProperty("--dx", `${dx}px`); el.style.setProperty("--dy", `${dy}px`);
    pawLayer.appendChild(el);
    el.addEventListener("animationend", () => el.remove(), { once: true });
  }

  function pawBurst(x, y, n = 7, color) {
    if (reduceMotion) return;
    for (let i = 0; i < n; i++) {
      const a = (Math.PI * 2 * i) / n + Math.random() * .4;
      const d = 50 + Math.random() * 40;
      spawnPaw(x, y, {
        cls: "paw--burst", size: 16 + Math.random() * 10, color,
        rot: (a * 180) / Math.PI + 90, dx: Math.cos(a) * d, dy: Math.sin(a) * d,
      });
    }
  }

  if (!reduceMotion) {
    // rastro de pegadas acompanhando o mouse / dedo
    let last = null, side = 1;
    const STEP = finePointer ? 46 : 56;
    window.addEventListener("pointermove", (e) => {
      if (last === null) { last = { x: e.clientX, y: e.clientY }; return; }
      const dx = e.clientX - last.x, dy = e.clientY - last.y;
      const dist = Math.hypot(dx, dy);
      if (dist < STEP) return;
      const ang = Math.atan2(dy, dx);
      side *= -1;
      const off = 9 * side; // alterna pata esquerda/direita
      const px = e.clientX + Math.cos(ang + Math.PI / 2) * off;
      const py = e.clientY + Math.sin(ang + Math.PI / 2) * off;
      spawnPaw(px, py, { rot: (ang * 180) / Math.PI + 90, size: 18 });
      last = { x: e.clientX, y: e.clientY };
    }, { passive: true });

    // explosão de patinhas ao clicar/tocar
    window.addEventListener("pointerdown", (e) => {
      if (e.target.closest("input, textarea, .modal__box")) return;
      pawBurst(e.clientX, e.clientY, 6);
    }, { passive: true });

    // patinhas flutuando no fundo
    const bg = $(".bg-paws");
    const total = innerWidth < 600 ? 10 : 18;
    for (let i = 0; i < total; i++) {
      const p = document.createElement("i");
      p.style.left = `${Math.random() * 100}%`;
      p.style.setProperty("--s", `${18 + Math.random() * 34}px`);
      p.style.setProperty("--d", `${18 + Math.random() * 22}s`);
      p.style.setProperty("--delay", `${-Math.random() * 30}s`);
      p.style.setProperty("--r", `${Math.random() * 360}deg`);
      p.style.setProperty("--c", pawColors[i % pawColors.length]);
      bg.appendChild(p);
    }
  }

  /* =========================================================
     Header, menu, navegação
     ========================================================= */
  const header = $(".header");
  const toTop = $("#toTop");
  const onScroll = () => {
    const y = scrollY;
    header.classList.toggle("is-scrolled", y > 10);
    toTop.classList.toggle("is-visible", y > 700);
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

  const menuBtn = $("#menuBtn"), nav = $("#nav");
  const setMenu = (open) => {
    nav.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  };
  menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  $$("a", nav).forEach((a) => a.addEventListener("click", () => setMenu(false)));

  // link ativo conforme a seção
  const sections = $$("main section[id]");
  const navLinks = $$(".nav a");
  const secObs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${en.target.id}`));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => secObs.observe(s));

  /* ---------- animação de entrada ---------- */
  const revObs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-in"); revObs.unobserve(en.target); }
    });
  }, { threshold: .12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach((el, i) => {
    if (el.classList.contains("pet")) el.style.transitionDelay = `${(i % 4) * 70}ms`;
    revObs.observe(el);
  });

  /* ---------- contador dos números ---------- */
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target; countObs.unobserve(el);
      const end = parseFloat(el.dataset.count), dec = +(el.dataset.decimals || 0);
      const pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
      const fmt = (v) => pre + v.toFixed(dec).replace(".", ",") + suf;
      if (reduceMotion) { el.textContent = fmt(end); return; }
      const t0 = performance.now(), dur = 1600;
      const tick = (t) => {
        const k = Math.min(1, (t - t0) / dur), eased = 1 - Math.pow(1 - k, 3);
        el.textContent = fmt(end * eased);
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: .6 });
  $$("[data-count]").forEach((el) => countObs.observe(el));

  /* =========================================================
     Cookies
     ========================================================= */
  const cookie = $("#cookie");
  if (!store.get("aatan_cookie")) setTimeout(() => { cookie.hidden = false; }, 1200);
  $("#cookieAccept").addEventListener("click", (e) => {
    store.set("aatan_cookie", "accepted"); saveLikes();
    cookie.hidden = true; toast("Obrigado! 🐾");
    pawBurst(e.clientX, e.clientY, 8);
  });
  $("#cookieDecline").addEventListener("click", () => {
    store.set("aatan_cookie", "declined");
    try { localStorage.removeItem("aatan_likes"); } catch { /* ignore */ }
    cookie.hidden = true;
  });

  /* ---------- ano no rodapé ---------- */
  $("#year").textContent = new Date().getFullYear();
})();
