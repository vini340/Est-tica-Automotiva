/* Datas sempre como "AAAA-MM-DD" locais. Nunca use toISOString() aqui: ele converte
   para UTC e pode voltar um dia no horário de Brasília. */
(function () {
  const pad = (n) => String(n).padStart(2, "0");
  // O toLocaleString usa espaço sem quebra depois de "R$"; trocamos por espaço comum (melhor para copiar e para o WhatsApp).
  const brl = (n, centavos) =>
    Number(n)
      .toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: centavos || n % 1 ? 2 : 0,
        maximumFractionDigits: 2,
      })
      .replace(/ /g, " ");
  const iso = (d) => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  const fromISO = (s) => {
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d, 12);
  };
  const fmt = (d, opts) => new Intl.DateTimeFormat("pt-BR", opts).format(d).replace(/\./g, "");
  const longo = (s) => {
    const d = fromISO(s);
    return fmt(d, { weekday: "long" }) + ", " + pad(d.getDate()) + "/" + pad(d.getMonth() + 1) + "/" + d.getFullYear();
  };
  const hoje = () => iso(new Date());
  const agora = () => {
    const d = new Date();
    return pad(d.getHours()) + ":" + pad(d.getMinutes());
  };
  // "08:00" -> "8h", "08:30" -> "8h30"
  const hora = (hhmm) => {
    const [h, m] = hhmm.split(":").map(Number);
    return h + "h" + (m ? pad(m) : "");
  };
  const NOMES = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
  // [6, 0] -> "sábado e domingo"
  const listaDias = (dias) => {
    const n = dias.map((d) => NOMES[d]);
    if (n.length === 7) return "todos os dias";
    if (n.length < 2) return n.join("");
    return n.slice(0, -1).join(", ") + " e " + n[n.length - 1];
  };
  // Datas (a partir de hoje) cujo dia da semana está em "dias", nas próximas "semanas" semanas.
  function diasDeAtendimento(semanas, dias) {
    const base = new Date();
    base.setHours(12, 0, 0, 0);
    const out = [];
    for (let i = 0; i < semanas * 7; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      if (dias.includes(d.getDay())) out.push(iso(d));
    }
    return out;
  }
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Texto de preço: número -> "R$ 80,00"; sem preço confirmado (null/undefined) ->
  // aviso para o cliente consultar, em vez de inventar um valor.
  const SEM_PRECO = "Consulte disponibilidade e orçamento";
  const precoTexto = (preco, centavos) => (preco === null || preco === undefined ? SEM_PRECO : brl(preco, centavos));
  const temPreco = (preco) => preco !== null && preco !== undefined;

  // Preço de um serviço para exibição. Oficial (preco) -> "R$ 80,00". Sem preço oficial:
  // se houver estimativa ("sugerido") e o modo demonstração estiver ligado, mostra
  // "A partir de R$ X" marcada como estimativa; senão, o aviso de consulta.
  const precoServico = (s) => {
    const cfg = window.EA_CONFIG || {};
    if (temPreco(s.preco)) return { texto: brl(s.preco, true), oficial: true, estimativa: false };
    if (cfg.mostrarEstimativas && temPreco(s.sugerido)) {
      return { texto: (s.aPartirDe ? "A partir de " : "") + brl(s.sugerido, true), oficial: false, estimativa: true };
    }
    return { texto: SEM_PRECO, oficial: false, estimativa: false };
  };

  window.EA_UTIL = { precoServico, pad, brl, iso, fromISO, fmt, longo, hoje, agora, hora, listaDias, diasDeAtendimento, esc, precoTexto, temPreco, SEM_PRECO };
})();
