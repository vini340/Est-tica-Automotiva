/* Assistente do pedido de horário: serviço, data e horário, dados e pagamento.
   Não grava nada e não envia nada: no fim, abre o WhatsApp com a mensagem pronta. */
(function () {
  const C = window.EA_CONFIG;
  const U = window.EA_UTIL;
  const WA = window.EA_WA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ROTULOS = ["Escolher data e horário", "Informar meus dados", "Preferência de atendimento", "Confirmar no WhatsApp"];
  const ICONE_WA = '<svg class="ico"><use href="#i-chat"/></svg>';

  const st = { servicos: [], step: 0, servico: null, data: null, hora: "", nome: "", carro: "", pagamento: null, maisDias: false, ultimo: null };
  const el = {};
  const dados = () => ({ servico: st.servico, data: st.data, horario: st.hora, nome: st.nome, carro: st.carro, pagamento: st.pagamento });
  const faixa = () => (C.horario && C.horario.abre && C.horario.fecha ? C.horario : null);

  /* ---------- Erros e validação (valida ao sair do campo, limpa ao digitar) ---------- */
  function erro(msg) {
    el.erro.textContent = msg;
    el.erro.hidden = false;
    return false;
  }
  const limparErro = () => { el.erro.hidden = true; el.erro.textContent = ""; };
  function marcar(input, err, ok, msg, mostrar) {
    if (ok) { input.removeAttribute("aria-invalid"); err.hidden = true; }
    else if (mostrar) { input.setAttribute("aria-invalid", "true"); err.textContent = msg; err.hidden = false; }
  }
  function validarNome(mostrar) {
    const v = el.nome.value.trim().replace(/\s+/g, " ");
    const ok = v.length >= 2 && /\p{L}/u.test(v);
    marcar(el.nome, $("#err-nome"), ok, "Digite seu nome.", mostrar);
    if (ok) st.nome = v;
    return ok;
  }
  function validarCarro(mostrar) {
    const v = el.carro.value.trim().replace(/\s+/g, " ");
    const ok = v.length >= 2 && /[\p{L}\d]/u.test(v);
    marcar(el.carro, $("#err-carro"), ok, "Digite o modelo do carro. Exemplo: Onix 2020.", mostrar);
    if (ok) st.carro = v;
    return ok;
  }
  function validarHora(mostrar) {
    const m = /^(\d{1,2}):(\d{2})$/.exec(el.hora.value.trim());
    let msg = "Escolha o horário que prefere.";
    let ok = false;
    if (m && +m[1] < 24 && +m[2] < 60) {
      const h = U.pad(+m[1]) + ":" + m[2];
      const f = faixa();
      if (f && (h < f.abre || h > f.fecha)) msg = "Atendemos das " + U.hora(f.abre) + " às " + U.hora(f.fecha) + ". Escolha um horário nessa faixa.";
      else if (st.data === U.hoje() && h <= U.agora()) msg = "Esse horário já passou hoje. Escolha um mais tarde ou outro dia.";
      else { ok = true; st.hora = h; }
    }
    if (!ok) st.hora = "";
    marcar(el.hora, $("#err-hora"), ok, msg, mostrar);
    return ok;
  }
  function validar(n) {
    if (n === 0 && !st.servico) return erro("Escolha um serviço para continuar.");
    if (n === 1) {
      if (!st.data) return erro("Escolha o dia.");
      if (st.data < U.hoje()) return erro("Essa data já passou. Escolha outro dia.");
      if (!validarHora(true)) { el.hora.focus(); return false; }
    }
    if (n === 2) {
      const a = validarNome(true);
      const b = validarCarro(true);
      if (!(a && b)) { (a ? el.carro : el.nome).focus(); return false; }
    }
    if (n === 3 && !st.pagamento) return erro("Escolha como prefere realizar o acerto na entrega.");
    return true;
  }

  /* ---------- Renderização ---------- */
  function renderServicos() {
    $("#opts-servico").innerHTML = st.servicos.map((s) =>
      `<label class="opt"><input type="radio" name="servico" value="${U.esc(s.id)}"${st.servico && st.servico.id === s.id ? " checked" : ""}>` +
      `<span class="opt__box"><span class="opt__n">${U.esc(s.nome)}</span>` +
      (s.descricao ? `<span class="opt__d">${U.esc(s.descricao)}</span>` : "") +
      `<span class="opt__p">${U.esc(U.precoServico(s).texto)}</span></span></label>`
    ).join("");
  }

  function desenharDias() {
    const todos = U.diasDeAtendimento(C.semanasNaAgenda, C.diasPermitidos);
    if (st.data && !todos.includes(st.data)) st.data = null;
    if (st.data && todos.indexOf(st.data) >= 8) st.maisDias = true;
    const limite = st.maisDias ? todos.length : Math.min(8, todos.length);
    $("#dias").innerHTML = todos.slice(0, limite).map((iso) => {
      const d = U.fromISO(iso);
      return `<label class="dchip"><input type="radio" name="dia" value="${iso}"${iso === st.data ? " checked" : ""}>` +
        `<span><b>${U.fmt(d, { weekday: "short" })}</b><strong>${d.getDate()}</strong><em>${U.fmt(d, { month: "short" })}</em></span></label>`;
    }).join("");
    $("#mais-dias").hidden = limite >= todos.length;
  }

  function renderPagamento() {
    $("#opts-pag").innerHTML = C.pagamentos.map((p) =>
      `<label class="opt"><input type="radio" name="pagamento" value="${U.esc(p.id)}"${st.pagamento && st.pagamento.id === p.id ? " checked" : ""}>` +
      `<span class="opt__box"><span class="opt__n">${U.esc(p.nome)}</span><span class="opt__d">${U.esc(p.descricao)}</span></span></label>`
    ).join("");
  }

  function renderResumo() {
    const d = st.data && U.fromISO(st.data);
    $("#r-servico").textContent = st.servico ? st.servico.nome : "";
    $("#r-data").textContent = d ? U.fmt(d, { weekday: "long" }) + ", " + U.pad(d.getDate()) + "/" + U.pad(d.getMonth() + 1) : "";
    $("#r-hora").textContent = st.hora;
    $("#r-carro").textContent = st.carro;
    $("#r-nome").textContent = st.nome;
    $("#r-pag").textContent = st.pagamento ? st.pagamento.nome : "";
    $("#r-total").textContent = st.servico ? U.precoServico(st.servico).texto : "";
  }

  /* ---------- Navegação entre etapas ---------- */
  function rolarAoTopo() {
    const r = el.wiz.getBoundingClientRect();
    if (r.top < 0 || r.top > innerHeight * 0.6) el.wiz.scrollIntoView({ block: "start" });
  }
  function irPara(n, inicial) {
    st.step = n;
    $$(".pane").forEach((p) => {
      const ativo = Number(p.dataset.pane) === n;
      p.hidden = !ativo;
      p.classList.toggle("is-enter", ativo && !inicial);
    });
    $$("#steps li").forEach((li) => {
      const i = Number(li.dataset.s);
      li.classList.toggle("is-current", i === n);
      li.classList.toggle("is-done", i < n);
      if (i === n) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
    });
    el.bar.style.setProperty("--w", (n + 1) / 4);
    el.voltar.hidden = n === 0;
    const ultimo = n === 3;
    el.avancar.innerHTML = (ultimo ? ICONE_WA : "") + ROTULOS[n];
    el.avancar.classList.toggle("btn--wa", ultimo);
    el.avancar.classList.toggle("btn--primary", !ultimo);
    limparErro();
    if (n === 1) desenharDias();
    if (n === 3) renderPagamento();
    renderResumo();
    if (!inicial) {
      const h = $(`.pane[data-pane="${n}"] h3`);
      if (h) h.focus({ preventScroll: true });
      rolarAoTopo();
    }
  }

  /* ---------- Final: abre o WhatsApp. O pedido só segue quando o cliente toca em Enviar. ---------- */
  function enviar() {
    const msg = WA.mensagem(dados());
    st.ultimo = msg;
    if (WA.configurado()) window.open(WA.link(msg), "_blank", "noopener");
    $("#done-msg").textContent = msg;
    const link = $("#done-wa");
    link.hidden = !WA.configurado();
    if (WA.configurado()) link.href = WA.link(msg);
    $("#done-aviso").hidden = WA.configurado();
    el.form.hidden = true;
    $("#steps").hidden = true;
    $(".steps__bar").hidden = true;
    $("#done").hidden = false;
    $("#done-t").focus({ preventScroll: true });
    rolarAoTopo();
  }

  function mostrarFormulario() {
    el.form.hidden = false;
    $("#steps").hidden = false;
    $(".steps__bar").hidden = false;
    $("#done").hidden = true;
  }
  function novo() {
    Object.assign(st, { step: 0, servico: null, data: null, hora: "", nome: "", carro: "", pagamento: null, ultimo: null });
    [el.hora, el.nome, el.carro].forEach((i) => { i.value = ""; i.removeAttribute("aria-invalid"); });
    $$(".field__err").forEach((p) => { p.hidden = true; });
    mostrarFormulario();
    renderServicos();
    irPara(0, true);
    rolarAoTopo();
  }
  function editar() {
    mostrarFormulario();
    renderServicos();
    irPara(0);
  }

  async function copiar(texto, botao) {
    try {
      await navigator.clipboard.writeText(texto);
    } catch (e) {
      const t = document.createElement("textarea");
      t.value = texto;
      t.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(t);
      t.select();
      try { document.execCommand("copy"); } catch (_) { /* sem permissão */ }
      t.remove();
    }
    const original = botao.innerHTML;
    botao.textContent = "Copiado";
    setTimeout(() => { botao.innerHTML = original; }, 2000);
  }

  /* ---------- Inicialização ---------- */
  function init(lista) {
    st.servicos = lista;
    Object.assign(el, { wiz: $("#wiz"), form: $("#form"), bar: $("#steps-bar"), voltar: $("#voltar"), avancar: $("#avancar"), erro: $("#erro-step"), nome: $("#nome"), carro: $("#carro"), hora: $("#hora") });
    const f = faixa();
    if (f) { el.hora.min = f.abre; el.hora.max = f.fecha; }
    $("#hint-hora").textContent = f ? "Atendemos das " + U.hora(f.abre) + " às " + U.hora(f.fecha) + "." : "";
    $("#hint-hora").hidden = !f;

    el.form.addEventListener("change", (e) => {
      const t = e.target;
      if (t.name === "servico") st.servico = st.servicos.find((s) => String(s.id) === t.value);
      if (t.name === "dia") { st.data = t.value; if (el.hora.value) validarHora(el.hora.hasAttribute("aria-invalid")); }
      if (t.name === "pagamento") st.pagamento = C.pagamentos.find((p) => p.id === t.value);
      limparErro();
      renderResumo();
    });
    el.form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validar(st.step)) return;
      if (st.step < 3) irPara(st.step + 1); else enviar();
    });
    el.voltar.addEventListener("click", () => irPara(st.step - 1));
    $("#mais-dias").addEventListener("click", () => { st.maisDias = true; desenharDias(); });

    el.nome.addEventListener("input", () => { st.nome = el.nome.value.trim(); if (el.nome.hasAttribute("aria-invalid")) validarNome(true); renderResumo(); });
    el.nome.addEventListener("blur", () => { if (el.nome.value) validarNome(true); });
    el.carro.addEventListener("input", () => { st.carro = el.carro.value.trim(); if (el.carro.hasAttribute("aria-invalid")) validarCarro(true); renderResumo(); });
    el.carro.addEventListener("blur", () => { if (el.carro.value) validarCarro(true); });
    el.hora.addEventListener("input", () => { validarHora(el.hora.hasAttribute("aria-invalid")); renderResumo(); });
    el.hora.addEventListener("blur", () => { if (el.hora.value) validarHora(true); });

    $("#done-copy").addEventListener("click", (e) => copiar(st.ultimo, e.currentTarget));
    $("#editar").addEventListener("click", editar);
    $("#novo").addEventListener("click", novo);

    renderServicos();
    irPara(0, true);
  }

  window.EA_BOOKING = {
    init,
    escolherServico(id) {
      const s = st.servicos.find((x) => String(x.id) === String(id));
      if (!s) return;
      if (!$("#done").hidden) novo();
      st.servico = s;
      renderServicos();
      irPara(1);
    },
  };
})();
