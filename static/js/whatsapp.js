/* Mensagem do pedido + link wa.me. O número vem só de config.js.
   encodeURIComponent usa %20 para espaços, que é o formato documentado pelo WhatsApp. */
(function () {
  const C = window.EA_CONFIG;
  const U = window.EA_UTIL;

  const numero = () => String(C.whatsapp || "").replace(/\D/g, "");
  const configurado = () => numero().length >= 10;

  function mensagem(d) {
    // Preço pode não estar confirmado ainda (serviço novo do catálogo): nesse
    // caso a mensagem pede o orçamento em vez de inventar um valor.
    const precoParte = U.temPreco(d.servico.preco) ? " (" + U.brl(d.servico.preco, true) + ")" : " (valor a combinar — consulte disponibilidade e orçamento)";
    const linhas = [
      "Olá! Gostaria de solicitar um horário para " + d.servico.nome + precoParte + ".",
      d.data ? "Data desejada: " + U.longo(d.data) + "." : "Data desejada: a combinar.",
      d.horario ? "Horário desejado: " + d.horario + "." : "Horário desejado: a combinar.",
      "Carro: " + d.carro + ".",
      "Nome: " + d.nome + ".",
      "Pagamento: " + d.pagamento.mensagem + ".",
      "Esse horário está disponível?",
    ];
    return linhas.join("\n");
  }

  // Função única e reutilizável para gerar o link do WhatsApp (click-to-chat,
  // sem backend): https://wa.me/<numero>?text=<mensagem codificada>.
  const link = (texto) => "https://wa.me/" + numero() + "?text=" + encodeURIComponent(texto);

  window.EA_WA = { configurado, mensagem, link };
})();
