/* Camada de dados. Fala com o Spring Boot; com modoDemo ligado e sem backend, usa dados de exemplo.
   Contrato esperado da API:
     GET  /api/servicos                                  -> [{id, nome, descricao, preco, duracaoMinutos}]
     GET  /api/agendamentos/disponibilidade?data=&servicoId=  -> ["08:00","10:00"]  (horários livres)
     POST /api/agendamentos {servicoId,data,horario,nome,telefone,pagamento} -> 201 {id, linkWhatsApp}
          400 = regra de negócio (ex.: dia útil), 409 = horário já reservado */
(function () {
  const C = window.EA_CONFIG;
  const U = window.EA_UTIL;
  let usouDemo = false;

  async function http(caminho, opts) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), C.api.timeoutMs);
    try {
      const res = await fetch(C.api.base + caminho, {
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        signal: ctrl.signal,
        ...opts,
      });
      const texto = await res.text();
      let corpo = null;
      try { corpo = texto ? JSON.parse(texto) : null; } catch (e) { corpo = texto; }
      if (!res.ok) {
        const msg = corpo && (corpo.message || corpo.mensagem || (typeof corpo === "string" && corpo.length < 200 && corpo));
        const err = new Error(msg || "Erro " + res.status);
        err.status = res.status;
        throw err;
      }
      return corpo;
    } finally {
      clearTimeout(timer);
    }
  }

  async function comFallback(real, demo) {
    try {
      return await real();
    } catch (e) {
      const semBackend = !e.status || e.status === 404 || e.status >= 500;
      e.offline = semBackend;
      if (C.modoDemo && semBackend) {
        usouDemo = true;
        await new Promise((r) => setTimeout(r, 280));
        return demo();
      }
      throw e;
    }
  }

  /* ---------- Dados de exemplo (só para demonstração) ---------- */
  const ocupados = {};
  const hash = (s) => {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  };
  function ocupadosDe(dia) {
    if (!ocupados[dia]) {
      const h = hash(dia);
      ocupados[dia] = new Set(C.horarios.filter((_, i) => ((h >> (i * 2)) & 3) === 0));
    }
    return ocupados[dia];
  }
  function jaPassou(dia, hr) {
    if (dia !== U.iso(new Date())) return false;
    const [H, M] = hr.split(":").map(Number);
    const agora = new Date();
    return H * 60 + M < agora.getHours() * 60 + agora.getMinutes() + 60;
  }
  const demoDisponibilidade = (dia) =>
    U.ehFimDeSemana(dia) ? C.horarios.filter((h) => !ocupadosDe(dia).has(h) && !jaPassou(dia, h)) : [];

  function demoCriar(d) {
    const falha = (status, msg) => Object.assign(new Error(msg), { status });
    if (!U.ehFimDeSemana(d.data)) throw falha(400, "Agendamentos somente aos sábados e domingos.");
    if (!demoDisponibilidade(d.data).includes(d.horario)) throw falha(409, "Horário já reservado.");
    ocupadosDe(d.data).add(d.horario);
    return { id: 1000 + Math.floor(Math.random() * 900), linkWhatsApp: null, demo: true };
  }

  window.EA_API = {
    emDemo: () => usouDemo,
    servicos: () => comFallback(() => http("/servicos"), async () => C.servicosDemo),
    disponibilidade: (dia, servicoId) =>
      comFallback(
        () => http("/agendamentos/disponibilidade?data=" + dia + (servicoId ? "&servicoId=" + servicoId : "")),
        async () => demoDisponibilidade(dia)
      ).then((horas) => horas.map((h) => String(h).slice(0, 5))), // Java pode enviar "08:00:00"
    criar: (dados) =>
      comFallback(() => http("/agendamentos", { method: "POST", body: JSON.stringify(dados) }), async () => demoCriar(dados)),
  };
})();
