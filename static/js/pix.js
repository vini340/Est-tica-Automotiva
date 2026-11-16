/* PIX estático (BR Code / "copia e cola"), sem serviço externo.
   Estrutura EMV do Banco Central: campos ID(2) + tamanho(2) + valor, terminando em CRC16-CCITT. */
(function () {
  function crc16(str) {
    let crc = 0xffff;
    for (let i = 0; i < str.length; i++) {
      crc ^= str.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
    return crc.toString(16).toUpperCase().padStart(4, "0");
  }
  const campo = (id, valor) => id + String(valor.length).padStart(2, "0") + valor;
  // Nome (máx. 25) e cidade (máx. 15): ASCII, sem acento
  const ascii = (s, max) =>
    s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9 ]/g, "").trim().toUpperCase().slice(0, max);

  function payload(o) {
    const conta = campo("00", "br.gov.bcb.pix") + campo("01", o.chave);
    let p = campo("00", "01") + campo("01", "11") + campo("26", conta) + campo("52", "0000") + campo("53", "986");
    if (o.valor > 0) p += campo("54", o.valor.toFixed(2));
    p += campo("58", "BR") + campo("59", ascii(o.nome, 25)) + campo("60", ascii(o.cidade, 15));
    p += campo("62", campo("05", "***"));
    p += "6304";
    return p + crc16(p);
  }

  // Confere CRC e tamanhos de todos os campos (usado nos testes)
  function valido(code) {
    if (crc16(code.slice(0, -4)) !== code.slice(-4)) return false;
    let i = 0;
    while (i < code.length) {
      const tam = parseInt(code.slice(i + 2, i + 4), 10);
      if (isNaN(tam) || i + 4 + tam > code.length) return false;
      i += 4 + tam;
    }
    return i === code.length;
  }

  window.EA_PIX = { crc16, payload, valido };
})();
