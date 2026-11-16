/* ==========================================================================
   DIAMOND STYLE CAR — INTERFACE UI (Direção de Arte: Referência MARÉ)
   Cabeçalho Transparente, Galeria Editorial, Renderização e Agendamento
   ========================================================================== */
(function () {
  const C = window.EA_CONFIG;
  const U = window.EA_UTIL;
  const WA = window.EA_WA;
  const IMG = window.DS_IMAGES || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const temWA = WA.configurado();
  const faixa = C.horario && C.horario.abre && C.horario.fecha ? "das " + U.hora(C.horario.abre) + " às " + U.hora(C.horario.fecha) : "";
  const dias = U.listaDias(C.diasPermitidos);

  /* ---------- 0. Controle Fluido de Tema (Dark / Light Mode) ---------- */
  const STORAGE_THEME = "diamond_theme";
  const rootEl = document.documentElement;

  function aplicarTema(tema) {
    rootEl.setAttribute("data-theme", tema);
    const toggles = $$(".theme-toggle");
    toggles.forEach((btn) => {
      const proximo = tema === "dark" ? "modo claro" : "modo escuro";
      btn.setAttribute("aria-label", `Mudar para ${proximo}`);
      btn.setAttribute("title", `Ativar ${proximo}`);
    });
  }

  function alternarTema() {
    const atual = rootEl.getAttribute("data-theme") || "dark";
    const novo = atual === "dark" ? "light" : "dark";
    // Classe temporária: suaviza a troca de cores (não afeta fotografias).
    rootEl.classList.add("theme-anim");
    clearTimeout(alternarTema._t);
    alternarTema._t = setTimeout(() => rootEl.classList.remove("theme-anim"), 500);
    aplicarTema(novo);
    try {
      localStorage.setItem(STORAGE_THEME, novo);
    } catch (e) {}
  }

  $$(".theme-toggle").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      alternarTema();
    });
  });

  try {
    const salvo = localStorage.getItem(STORAGE_THEME);
    if (salvo === "light" || salvo === "dark") {
      aplicarTema(salvo);
    } else {
      aplicarTema("dark");
    }
  } catch (e) {
    aplicarTema("dark");
  }

  /* ---------- 1. Carregamento de Imagens Full-Bleed ---------- */
  if (IMG.hero && $("#hero-img")) {
    $("#hero-img").src = IMG.hero;
    $("#hero-img").alt = "Carro coberto de espuma durante a lavagem — Diamond Style Car";
  }
  if (IMG.diferenciais && $("#dif-bg")) {
    $("#dif-bg").src = IMG.diferenciais;
    $("#dif-bg").alt = "";
  }
  if (IMG.ctaFinal && $("#cta-bg")) {
    $("#cta-bg").src = IMG.ctaFinal;
    $("#cta-bg").alt = "";
  }

  /* ---------- 2. Galeria Editorial com Proporções Ricas ---------- */
  const galeriaGrid = $("#galeria-grid");
  if (galeriaGrid && IMG.galeria && IMG.galeria.length) {
    const itens = IMG.galeria.map((item) => ({
      src: typeof item === "string" ? item : item.url,
      title: (item && item.titulo) || "Carro clássico",
      sub: (item && item.sub) || "",
    }));

    galeriaGrid.innerHTML = itens.map((it, i) => `<div class="galeria-item" role="button" tabindex="0" data-i="${i}" aria-label="Ampliar foto: ${U.esc(it.title)}">
        <img src="${it.src}" alt="${U.esc(it.title)}" loading="lazy">
        <div class="galeria-item__overlay">
          <span class="galeria-item__title">${U.esc(it.title)}</span>
          ${it.sub ? `<span class="galeria-item__sub">${U.esc(it.sub)}</span>` : ""}
        </div>
      </div>`).join("");

    /* Visualização ampliada: setas, teclado, indicadores. Sem biblioteca. */
    const lb = document.createElement("div");
    lb.className = "lightbox";
    lb.hidden = true;
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Galeria ampliada");
    lb.innerHTML = `<button type="button" class="lightbox__close" aria-label="Fechar">×</button>
      <button type="button" class="lightbox__nav lightbox__nav--prev" aria-label="Foto anterior">‹</button>
      <figure class="lightbox__fig"><img class="lightbox__img" alt=""><figcaption class="lightbox__cap"></figcaption></figure>
      <button type="button" class="lightbox__nav lightbox__nav--next" aria-label="Próxima foto">›</button>
      <div class="lightbox__dots"></div>`;
    document.body.appendChild(lb);
    const lbImg = lb.querySelector(".lightbox__img");
    const lbCap = lb.querySelector(".lightbox__cap");
    const lbDots = lb.querySelector(".lightbox__dots");
    lbDots.innerHTML = itens.map((_, i) => `<button type="button" data-d="${i}" aria-label="Foto ${i + 1}"></button>`).join("");
    let atual = 0;
    let ultimoFoco = null;

    function mostrar(i) {
      atual = (i + itens.length) % itens.length;
      lbImg.classList.remove("is-in");
      lbImg.src = itens[atual].src;
      lbImg.alt = itens[atual].title;
      lbCap.textContent = itens[atual].title + (itens[atual].sub ? " — " + itens[atual].sub : "");
      lbDots.querySelectorAll("button").forEach((d, k) => d.classList.toggle("is-on", k === atual));
      requestAnimationFrame(() => lbImg.classList.add("is-in"));
    }
    function abrir(i) {
      ultimoFoco = document.activeElement;
      lb.hidden = false;
      document.body.classList.add("lb-open");
      mostrar(i);
      lb.querySelector(".lightbox__close").focus();
    }
    function fechar() {
      lb.hidden = true;
      document.body.classList.remove("lb-open");
      if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
    }
    galeriaGrid.addEventListener("click", (e) => {
      const el = e.target.closest(".galeria-item");
      if (el) abrir(Number(el.dataset.i));
    });
    galeriaGrid.addEventListener("keydown", (e) => {
      const el = e.target.closest(".galeria-item");
      if (el && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); abrir(Number(el.dataset.i)); }
    });
    lb.addEventListener("click", (e) => {
      if (e.target.closest(".lightbox__close") || e.target === lb) return fechar();
      if (e.target.closest(".lightbox__nav--prev")) return mostrar(atual - 1);
      if (e.target.closest(".lightbox__nav--next")) return mostrar(atual + 1);
      const d = e.target.closest("[data-d]");
      if (d) mostrar(Number(d.dataset.d));
    });
    document.addEventListener("keydown", (e) => {
      if (lb.hidden) return;
      if (e.key === "Escape") fechar();
      else if (e.key === "ArrowLeft") mostrar(atual - 1);
      else if (e.key === "ArrowRight") mostrar(atual + 1);
      else if (e.key === "Tab") {
        const foc = Array.from(lb.querySelectorAll("button"));
        const i = foc.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); foc[foc.length - 1].focus(); }
        else if (!e.shiftKey && i === foc.length - 1) { e.preventDefault(); foc[0].focus(); }
      }
    });
  }

  /* ---------- 3. Renderização dos Serviços (Catálogo Editorial Automotivo — Zero Cartões) ----------
     Os serviços são organizados por categoria (Lavagem, Higienização, Polimento e
     Proteção, Cuidados Especiais), como texto e fotografias grandes, não em
     grade de cartões. Serviços com "ativo: false" em config.js não aparecem. ---------- */
  const servicosAtivos = (C.servicos || []).filter((s) => s.ativo !== false);

  function getServiceImage(s) {
    if (IMG.servicos && IMG.servicos[s.id]) return IMG.servicos[s.id];
    if (IMG.categoriaFallback && IMG.categoriaFallback[s.categoria]) return IMG.categoriaFallback[s.categoria];
    if (IMG.servicos && IMG.servicos.fallback) return IMG.servicos.fallback;
    return "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=1200&q=85&auto=format";
  }

  const BADGES_CATEGORIA = {
    lavagem: "LAVAGEM",
    higienizacao: "HIGIENIZAÇÃO",
    polimento: "POLIMENTO & PROTEÇÃO",
    especiais: "CUIDADOS ESPECIAIS",
  };

  function renderServicos() {
    const container = $("#lista-servicos");
    if (!container) return;

    const categorias = (C.categoriasServicos || []).map((cat) => ({
      ...cat,
      servicos: servicosAtivos.filter((s) => s.categoria === cat.id),
    })).filter((cat) => cat.servicos.length);

    let numero = 0;
    container.innerHTML = categorias.map((cat) => {
      const linhas = cat.servicos.map((s) => {
        numero += 1;
        const imgSrc = getServiceImage(s);
        const badge = BADGES_CATEGORIA[s.categoria] || "SERVIÇO";
        const desc = s.descricao || "Descrição a confirmar com a equipe pelo WhatsApp.";
        const pv = U.precoServico(s);
        const temPreco = pv.oficial || pv.estimativa;
        const aConfirmar = !s.confirmado;
        const aviso = pv.estimativa ? "Estimativa de mercado — sujeita à confirmação do proprietário." : "A confirmar pelo proprietário antes da publicação definitiva.";

        return `
          <article class="service-entry ${numero % 2 === 0 ? 'service-entry--alt' : ''}" data-service-id="${U.esc(s.id)}">
            <div class="service-entry__visual">
              <div class="service-entry__media">
                <img src="${imgSrc}" alt="${U.esc(s.nome)}" loading="lazy">
                <span class="service-entry__badge">${badge}</span>
              </div>
            </div>

            <div class="service-entry__body">
              <div class="service-entry__header">
                <span class="service-entry__num">${U.pad(numero)}</span>
                <h3 class="service-entry__title">${U.esc(s.nome)}</h3>
              </div>

              <p class="service-entry__desc">${U.esc(desc)}</p>
              ${aConfirmar ? `<p class="service-entry__tbd">${U.esc(aviso)}</p>` : ""}

              <div class="service-entry__footer">
                <div class="service-entry__pricing">
                  <span class="service-entry__price-label">${pv.oficial ? "Investimento" : (pv.estimativa ? "Estimativa" : "Valor")}</span>
                  <span class="service-entry__price-val${pv.oficial ? "" : " service-entry__price-val--tbd"}">${U.esc(pv.texto)}</span>
                </div>

                <button type="button" class="service-select-btn" data-pick="${U.esc(s.id)}" aria-label="Selecionar ${U.esc(s.nome)}">
                  <span class="service-select-indicator" aria-hidden="true">
                    <span class="service-select-dot"></span>
                  </span>
                  <span class="service-select-text">Selecionar serviço</span>
                </button>
              </div>
            </div>
          </article>
        `;
      }).join("");

      return `
        <div class="service-category" id="cat-${U.esc(cat.id)}">
          <div class="service-category__head">
            <p class="service-category__kicker">${U.esc(cat.kicker || "")}</p>
            <h3 class="service-category__title">${U.esc(cat.nome)}</h3>
            ${cat.desc ? `<p class="service-category__desc">${U.esc(cat.desc)}</p>` : ""}
          </div>
          <div class="service-category__list">${linhas}</div>
        </div>
      `;
    }).join("");
  }

  function updateSelectedServiceUI(selectedId) {
    let nomeSelecionado = null;
    $$(".service-entry").forEach((entry) => {
      const isSel = entry.dataset.serviceId === selectedId;
      entry.classList.toggle("is-selected", isSel);
      const btn = entry.querySelector(".service-select-btn");
      if (btn) {
        btn.classList.toggle("is-selected", isSel);
        const text = btn.querySelector(".service-select-text");
        if (text) text.textContent = isSel ? "Serviço Selecionado" : "Selecionar serviço";
      }
      if (isSel) {
        const h = entry.querySelector(".service-entry__title");
        if (h) nomeSelecionado = h.textContent;
      }
    });
    atualizarWaServicos(nomeSelecionado);
  }

  const containerServicos = $("#lista-servicos");
  if (containerServicos) {
    containerServicos.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-pick]");
      if (!btn) return;
      const sId = btn.dataset.pick;
      updateSelectedServiceUI(sId);
      if (window.EA_BOOKING) {
        window.EA_BOOKING.escolherServico(sId);
      }
      const wiz = $("#agendar");
      if (wiz) wiz.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Sincronizar quando o usuário trocar o serviço dentro do wizard
  document.addEventListener("change", (e) => {
    if (e.target && e.target.name === "servico") {
      updateSelectedServiceUI(e.target.value);
    }
  });

  renderServicos();

  /* ---------- 4. Contatos & Dados de Configuração ----------
     Mensagens diferentes por contexto (data-wa="hero|servicos|atendimento|contato"),
     para que cada botão não envie sempre o mesmo texto genérico. Sem valor
     (data-wa vazio, ex. no FAB) usa a mensagem padrão. ---------- */
  const WA_MENSAGENS = {
    hero: "Olá! Conheci a Diamond Style Car pelo site e gostaria de saber mais sobre os serviços de estética automotiva.",
    servicos: "Olá! Gostaria de receber informações sobre os serviços da Diamond Style Car.",
    atendimento: "Olá! Gostaria de agendar um atendimento na Diamond Style Car e saber os horários disponíveis.",
    contato: "Olá! Encontrei a Diamond Style Car e gostaria de falar sobre um atendimento.",
  };
  const WA_MENSAGEM_PADRAO = "Olá! Vim pelo site da Diamond Style Car e gostaria de agendar um atendimento.";

  $$("[data-wa]").forEach((a) => {
    a.hidden = !temWA;
    if (!temWA) return;
    const ctx = a.dataset.wa;
    const msg = (ctx && WA_MENSAGENS[ctx]) || WA_MENSAGEM_PADRAO;
    a.href = WA.link(msg);
    a.target = "_blank";
    a.rel = "noopener";
  });

  // Botão de serviços: se o visitante já selecionou um serviço no catálogo,
  // o nome dele entra na mensagem.
  function atualizarWaServicos(nomeServico) {
    if (!temWA) return;
    const el = $('[data-wa="servicos"]');
    if (!el) return;
    const base = WA_MENSAGENS.servicos;
    const msg = nomeServico ? base + " Tenho interesse no serviço de " + nomeServico + "." : base;
    el.href = WA.link(msg);
  }

  $$("[data-ig]").forEach((a) => {
    a.hidden = !C.instagram;
    if (C.instagram) {
      a.href = C.instagram;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.setAttribute("aria-label", "Instagram oficial da Diamond Style Car");
    }
  });

  $$("[data-ig-user]").forEach((s) => { s.textContent = C.instagramUser || "Instagram"; });
  $$("[data-dias]").forEach((s) => { s.textContent = dias; });

  const anoEl = $("#ano");
  if (anoEl) anoEl.textContent = new Date().getFullYear();

  // Horários de Funcionamento
  const horasEl = $("#horas");
  if (horasEl) {
    horasEl.innerHTML = `
      <div><dt>Dias de Atendimento</dt><dd>${U.esc(dias)}</dd></div>
      ${faixa ? `<div><dt>Horário</dt><dd>${U.esc(faixa)}</dd></div>` : `<div><dt>Horário</dt><dd>Agendamento sob consulta</dd></div>`}
    `;
  }

  // Endereço e Localização
  const endEl = $("#endereco");
  if (endEl) {
    endEl.textContent = C.endereco || "";
    endEl.hidden = !C.endereco;
  }
  const mapsEl = $("#maps");
  if (mapsEl) {
    mapsEl.hidden = !C.endereco;
    if (C.endereco) mapsEl.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(C.endereco);
  }
  const localEnd = $(".local__end");
  if (localEnd) localEnd.hidden = !(C.endereco || temWA);

  // Footer Contatos
  const footWA = $("#foot-whatsapp");
  if (footWA && temWA) {
    footWA.hidden = false;
    footWA.innerHTML = `<a href="${WA.link(WA_MENSAGENS.contato)}" target="_blank" rel="noopener">WhatsApp Oficial</a>`;
  }
  const footIG = $("#foot-instagram");
  if (footIG && C.instagram) {
    footIG.hidden = false;
    footIG.innerHTML = `<p class="footer-col-title">Conecte-se conosco</p>
    <a class="social-ig" href="${U.esc(C.instagram)}" target="_blank" rel="noopener noreferrer" aria-label="Instagram oficial da Diamond Style Car" title="Instagram oficial da Diamond Style Car">
      <svg class="ico" aria-hidden="true"><use href="#i-ig"/></svg>
      <span>${U.esc(C.instagramUser || "Instagram")}</span>
    </a>`;
  }
  const footEnd = $("#foot-endereco");
  if (footEnd && C.endereco) {
    footEnd.hidden = false;
    footEnd.textContent = C.endereco;
  }

  /* ---------- 5. Cabeçalho Transparente & Menu Mobile ---------- */
  const siteHeader = $(".site-header");
  const headerToggle = $(".header-toggle");
  let agendarVisivel = false;
  let tick = false;

  function aoRolar() {
    document.body.classList.toggle("show-float", scrollY > 600 && !agendarVisivel);
  }

  addEventListener("scroll", () => {
    if (tick) return;
    tick = true;
    requestAnimationFrame(() => {
      aoRolar();
      tick = false;
    });
  }, { passive: true });

  const agendarSection = $("#agendar");
  if (agendarSection && "IntersectionObserver" in window) {
    new IntersectionObserver(([en]) => {
      agendarVisivel = en.isIntersecting;
      aoRolar();
    }).observe(agendarSection);
  }
  aoRolar();

  // Menu Mobile
  if (headerToggle && siteHeader) {
    function toggleMenu(abrir) {
      const estado = typeof abrir === "boolean" ? abrir : !siteHeader.classList.contains("is-open");
      siteHeader.classList.toggle("is-open", estado);
      headerToggle.setAttribute("aria-expanded", String(estado));
      headerToggle.setAttribute("aria-label", estado ? "Fechar menu" : "Abrir menu");
      const iconUse = headerToggle.querySelector("use");
      if (iconUse) {
        iconUse.setAttribute("href", estado ? "#i-close" : "#i-menu");
      }
    }

    headerToggle.addEventListener("click", () => toggleMenu());
    $$(".header-nav a").forEach((a) => a.addEventListener("click", () => toggleMenu(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") toggleMenu(false);
    });
  }

  /* ---------- 6. Animações de Scroll Suaves ---------- */
  if (!reduz && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

    const revealSelectors = [
      ".sec-title",
      ".sec-desc",
      ".service-entry",
      ".dif-item",
      ".galeria-item",
      ".wiz",
      ".os",
      ".atend-left",
      ".faq-list details",
      ".cta-final__content"
    ].join(", ");

    $$(revealSelectors).forEach((el, index) => {
      el.style.setProperty("--reveal-delay", `${(index % 4) * 60}ms`);
      el.classList.add("reveal");
      observer.observe(el);
    });
  }

  /* ---------- 7. Inicialização do Booking ---------- */
  if (window.EA_BOOKING && servicosAtivos.length) {
    window.EA_BOOKING.init(servicosAtivos);
  }
})();
