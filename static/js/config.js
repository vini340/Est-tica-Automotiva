/* ==========================================================================
   CONFIGURAÇÃO DO SITE: tudo que o dono precisa trocar fica neste arquivo.
   O site é estático: nada do que o cliente preenche é guardado ou enviado
   a um servidor. O pedido só segue quando ele toca em "Enviar" no WhatsApp.
   ========================================================================== */
window.EA_CONFIG = {
  nome: "Diamond Style Cars",

  // WhatsApp da estética, com DDI + DDD + número, só dígitos.
  // Vazio = o botão do WhatsApp não abre a conversa e o site mostra um
  // aviso de "configuração pendente".
  whatsapp: "5554999454502",

  // Opcionais: o que ficar vazio simplesmente não aparece no site.
  instagram: "https://www.instagram.com/diamondstylecars/", // link do perfil oficial
  instagramUser: "@diamondstylecars", // como aparece na tela
  endereco: "", // Ex.: "Rua Tal, 123 - Bairro, Cidade/UF"

  // Dias em que o cliente pode pedir horário: 0 = domingo, 1 = segunda ... 6 = sábado.
  diasPermitidos: [6, 0],
  semanasNaAgenda: 6, // quantas semanas à frente o cliente pode escolher

  // Horário de funcionamento (opcional), no formato "HH:MM". Se preencher os dois,
  // ele aparece no site e o campo de horário só aceita horários dentro da faixa.
  // Vazio = o cliente digita o horário que prefere e a estética responde no WhatsApp.
  horario: { abre: "", fecha: "" },

  // Como o cliente pode dizer que prefere pagar. É só um aviso na mensagem:
  // o site não cobra, não gera Pix e não confirma pagamento.
  pagamentos: [
    { id: "pix", nome: "Pix", mensagem: "Pix", descricao: "Fica anotado na mensagem. O Pix é combinado com a estética; este site não cobra nada." },
    { id: "dia", nome: "Pagar no dia", mensagem: "Pagar no dia da lavagem", descricao: "Fica anotado na mensagem. Você paga no dia da lavagem, na entrega do carro." },
  ],

  /* --------------------------------------------------------------------
     CATEGORIAS DO CATÁLOGO — só organizam a apresentação editorial.
     Para reordenar as categorias na página, reordene esta lista.
     -------------------------------------------------------------------- */
  categoriasServicos: [
    { id: "lavagem", nome: "Lavagem", kicker: "ÁGUA & TÉCNICA", desc: "Procedimentos de lavagem externa e interna, do básico ao técnico." },
    { id: "higienizacao", nome: "Higienização", kicker: "INTERIOR & CONFORTO", desc: "Limpeza detalhada do interior: bancos, estofados, couro e painéis." },
    { id: "polimento", nome: "Polimento e Proteção", kicker: "PINTURA & BRILHO", desc: "Correção, descontaminação e proteção da pintura." },
    { id: "especiais", nome: "Cuidados Especiais", kicker: "DETALHES QUE FAZEM A DIFERENÇA", desc: "Plásticos, motor, rodas, pneus e remoção de marcas." },
  ],

  /* --------------------------------------------------------------------
     SERVIÇOS — nome, categoria, preço (número em reais ou null) e descrição.

     IMPORTANTE PARA O PROPRIETÁRIO:
     - Os 2 primeiros serviços (lavagem completa e lavagem detalhada) são os
       que já estavam cadastrados, com os preços originais preservados.
     - Os demais são SUGESTÕES de ampliação do catálogo, ainda não confirmadas.
       Eles aparecem no site com "Consulte disponibilidade e orçamento" no
       lugar do preço, porque nenhum valor foi informado — nenhum preço foi
       inventado.
     - Use "ativo: false" para tirar um serviço do site rapidamente (ele some
       do catálogo e do agendamento) sem precisar apagar o bloco.
     - Quando o proprietário confirmar um preço, preencha "preco" com o
       número (em reais) e marque "confirmado: true"; o texto "Consulte
       disponibilidade e orçamento" é trocado automaticamente pelo valor.
     -------------------------------------------------------------------- */

  /* --------------------------------------------------------------------
     SERVIÇOS E PREÇOS (fonte única — catálogo, agendamento e WhatsApp leem daqui)

     Cada serviço tem um STATUS de preço:
       "preco_atual"                    preço que já estava cadastrado (preservado; vai ao site)
       "aprovado"                       preço aprovado pelo proprietário (vai ao site como oficial)
       "sugerido_aguardando_aprovacao"  estimativa de mercado em "sugerido" — NÃO é oferta oficial
       "sob_avaliacao"                  sem dado suficiente: "Consulte disponibilidade e orçamento"

     Para APROVAR um preço sugerido: copie o valor de "sugerido" para "preco" e troque o
     status para "aprovado" (e confirmado: true). "pesquisa" guarda a faixa de mercado, o
     escopo comparado, a justificativa e as fontes, para o proprietário revisar.
     "ativo: false" tira o serviço do site. Região de referência da pesquisa: Caxias do
     Sul/RS (provisória — o proprietário deve confirmar a cidade e os serviços oferecidos).
     -------------------------------------------------------------------- */
  // true = ambiente de demonstração: estimativas "a partir de" aparecem com aviso discreto.
  // false = site publicado: só preços oficiais (preco_atual/aprovado) aparecem.
  mostrarEstimativas: true,

  servicos: [
      {
          "id": "completa",
          "nome": "Lavagem completa",
          "categoria": "lavagem",
          "preco": 80,
          "sugerido": null,
          "aPartirDe": false,
          "status": "preco_atual",
          "confirmado": true,
          "ativo": true,
          "descricao": "",
          "pesquisa": {
              "mercadoMin": 60,
              "mercadoMax": 100,
              "escopo": "Lavagem completa interna+externa (aspiração, painéis, vidros internos, rodas), 60-90 min. Lava-jato comum (R$30-50, Vectrol) e lavagem simples externa NÃO são comparáveis.",
              "justificativa": "Preço atual R$80 está dentro da faixa 60-100 do Jump Car. Mantido sem alteração. Lavify (referência regional) não pôde ser acessado (robots).",
              "fontes": [
                  "https://www.jumpcar.com.br/blog/tabela-de-precos-de-lavagem-automotiva-quanto-cobrar-pelos-servicos",
                  "https://www.vectrolacademy.com.br/guias/tabela-de-precos-estetica-automotiva/",
                  "https://yiets-smem-kroecs.yolasite.com/"
              ]
          }
      },
      {
          "id": "detalhada",
          "nome": "Lavagem detalhada",
          "categoria": "lavagem",
          "preco": 140,
          "sugerido": null,
          "aPartirDe": false,
          "status": "preco_atual",
          "confirmado": true,
          "ativo": true,
          "descricao": "",
          "pesquisa": {
              "mercadoMin": 120,
              "mercadoMax": 180,
              "escopo": "Lavagem detalhada com cera líquida (Jump Car 120-180); 'a partir de' R$130 na Double Detail (cidade não informada). Lavagem detalhada PREMIUM do 4ucar (R$250-500) tem escopo maior e não é comparável.",
              "justificativa": "Preço atual R$140 está dentro de 120-180. Mantido sem alteração.",
              "fontes": [
                  "https://www.jumpcar.com.br/blog/tabela-de-precos-de-lavagem-automotiva-quanto-cobrar-pelos-servicos",
                  "https://yiets-smem-kroecs.yolasite.com/",
                  "https://www.vectrolacademy.com.br/guias/tabela-de-precos-estetica-automotiva/"
              ]
          }
      },
      {
          "id": "lavagem-tecnica",
          "nome": "Lavagem técnica",
          "categoria": "lavagem",
          "preco": null,
          "sugerido": 150,
          "aPartirDe": true,
          "status": "sugerido_aguardando_aprovacao",
          "confirmado": false,
          "ativo": true,
          "descricao": "Procedimento de lavagem com técnicas e cuidados específicos para preservar a pintura e os acabamentos.",
          "pesquisa": {
              "mercadoMin": 120,
              "mercadoMax": 280,
              "escopo": "Lavagem técnica com método dois baldes, shampoo pH neutro e secagem sem fricção, 60-150 min conforme porte.",
              "justificativa": "Fonte única (Vectrol). 'A partir de 150' fica no topo da faixa de hatch/base de sedan médio e acima da detalhada atual (R$140), mantendo hierarquia. Precisa de confirmação do proprietário (tempo e método reais).",
              "fontes": [
                  "https://www.vectrolacademy.com.br/guias/tabela-de-precos-estetica-automotiva/"
              ]
          }
      },
      {
          "id": "lavagem-cera",
          "nome": "Lavagem com cera",
          "categoria": "lavagem",
          "preco": null,
          "sugerido": null,
          "aPartirDe": false,
          "status": "sob_avaliacao",
          "confirmado": false,
          "ativo": true,
          "descricao": "Lavagem com aplicação de cera para realce do brilho e proteção temporária da pintura.",
          "pesquisa": {
              "mercadoMin": 120,
              "mercadoMax": 180,
              "escopo": "Lavagem detalhada com cera líquida (Jump 120-180). Sobrepõe-se à 'Lavagem detalhada' já cadastrada (R$140).",
              "justificativa": "Provável duplicata da detalhada; manter sob consulta até o proprietário decidir se é item separado.",
              "fontes": [
                  "https://www.jumpcar.com.br/blog/tabela-de-precos-de-lavagem-automotiva-quanto-cobrar-pelos-servicos"
              ]
          }
      },
      {
          "id": "higienizacao-interna",
          "nome": "Higienização interna",
          "categoria": "higienizacao",
          "preco": null,
          "sugerido": 280,
          "aPartirDe": true,
          "status": "sugerido_aguardando_aprovacao",
          "confirmado": false,
          "ativo": true,
          "descricao": "Limpeza detalhada do interior do veículo, removendo sujeiras acumuladas nas superfícies.",
          "pesquisa": {
              "mercadoMin": 250,
              "mercadoMax": 400,
              "escopo": "Higienização interna COMPLETA com extração (2-3 h). Básica (aspiração/limpeza, R$150-200 Vectrol; R$150-250 Jump) e premium com couro/ozônio (R$450-650) não são comparáveis.",
              "justificativa": "4ucar cita 250-700 (nacional, porte médio); Double Detail 'a partir de' 350. 'A partir de 280' = hatch completo (Vectrol 250-300). Dependem de extratora: confirmar equipamento.",
              "fontes": [
                  "https://www.vectrolacademy.com.br/guias/tabela-de-precos-estetica-automotiva/",
                  "https://www.4ucar.app.br/blog/tabela-de-precos-estetica-automotiva",
                  "https://yiets-smem-kroecs.yolasite.com/",
                  "https://www.jumpcar.com.br/blog/tabela-de-precos-de-lavagem-automotiva-quanto-cobrar-pelos-servicos"
              ]
          }
      },
      {
          "id": "higienizacao-bancos",
          "nome": "Higienização de bancos e estofados",
          "categoria": "higienizacao",
          "preco": null,
          "sugerido": null,
          "aPartirDe": false,
          "status": "sob_avaliacao",
          "confirmado": false,
          "ativo": true,
          "descricao": "Limpeza dos bancos e revestimentos internos, utilizando procedimentos adequados ao material.",
          "pesquisa": {
              "mercadoMin": null,
              "mercadoMax": null,
              "escopo": "Não encontrado preço avulso. Extração de bancos/carpetes está embutida na higienização completa; impermeabilização de tecido é adicional (+R$100-200, Vectrol).",
              "justificativa": "Sem dados comparáveis suficientes: Orçamento mediante avaliação.",
              "fontes": [
                  "https://www.vectrolacademy.com.br/guias/tabela-de-precos-estetica-automotiva/"
              ]
          }
      },
      {
          "id": "hidratacao-couro",
          "nome": "Hidratação e limpeza de bancos de couro",
          "categoria": "higienizacao",
          "preco": null,
          "sugerido": 180,
          "aPartirDe": true,
          "status": "sugerido_aguardando_aprovacao",
          "confirmado": false,
          "ativo": true,
          "descricao": "Limpeza e tratamento de superfícies de couro, quando aplicável.",
          "pesquisa": {
              "mercadoMin": 150,
              "mercadoMax": 400,
              "escopo": "Hidratação de couro avulsa (4ucar 150-400). Como adicional à higienização, Vectrol cita +80-150; restauração de couro +200-500 (outro serviço).",
              "justificativa": "A partir de 180 = parte baixa da faixa avulsa para carro pequeno/clássico de poucos bancos. Confirmar se o proprietário realmente oferece o serviço.",
              "fontes": [
                  "https://www.4ucar.app.br/blog/tabela-de-precos-estetica-automotiva",
                  "https://www.vectrolacademy.com.br/guias/tabela-de-precos-estetica-automotiva/"
              ]
          }
      },
      {
          "id": "limpeza-teto-painel",
          "nome": "Limpeza de teto, carpetes e painéis",
          "categoria": "higienizacao",
          "preco": null,
          "sugerido": null,
          "aPartirDe": false,
          "status": "sob_avaliacao",
          "confirmado": false,
          "ativo": true,
          "descricao": "Cuidado com as diferentes superfícies do interior do veículo.",
          "pesquisa": {
              "mercadoMin": 80,
              "mercadoMax": 150,
              "escopo": "Só há valor para limpeza de teto como adicional (+R$80-150). Carpetes e painéis sem preço avulso.",
              "justificativa": "Dado cobre só parte do escopo: Orçamento mediante avaliação.",
              "fontes": [
                  "https://www.vectrolacademy.com.br/guias/tabela-de-precos-estetica-automotiva/"
              ]
          }
      },
      {
          "id": "polimento-comercial",
          "nome": "Polimento comercial",
          "categoria": "polimento",
          "preco": null,
          "sugerido": 500,
          "aPartirDe": true,
          "status": "sugerido_aguardando_aprovacao",
          "confirmado": false,
          "ativo": true,
          "descricao": "Procedimento de melhoria visual da pintura, buscando recuperar brilho e reduzir marcas superficiais compatíveis com a técnica utilizada.",
          "pesquisa": {
              "mercadoMin": 500,
              "mercadoMax": 700,
              "escopo": "Polimento de refino de 1 etapa, 3-4 h (Vectrol 500-700). Jump Car/Double Detail citam 'polimento técnico' a partir de R$400 sem detalhar etapas; não equivalem diretamente.",
              "justificativa": "Escopo mais próximo de 'comercial' é o refino 1 etapa. Há valores menores no mercado (a partir de 400), por isso 500 é 'a partir de'. Confirmar com o proprietário.",
              "fontes": [
                  "https://www.vectrolacademy.com.br/guias/tabela-de-precos-estetica-automotiva/",
                  "https://yiets-smem-kroecs.yolasite.com/",
                  "https://www.jumpcar.com.br/blog/tabela-de-precos-de-lavagem-automotiva-quanto-cobrar-pelos-servicos"
              ]
          }
      },
      {
          "id": "polimento-tecnico",
          "nome": "Polimento técnico",
          "categoria": "polimento",
          "preco": null,
          "sugerido": 450,
          "aPartirDe": true,
          "status": "sugerido_aguardando_aprovacao",
          "confirmado": false,
          "ativo": true,
          "descricao": "Processo mais detalhado de correção da pintura, conforme a avaliação do estado do veículo.",
          "pesquisa": {
              "mercadoMin": 350,
              "mercadoMax": 1300,
              "escopo": "Correção de pintura em várias etapas. 4ucar 350-900; Jump 400-800 (4-8 h); Double Detail a partir de 400; Vectrol 2 etapas 900-1300 (3 etapas 1800-2800 não comparável).",
              "justificativa": "Faixa muito ampla por escopo. 'A partir de 450' é piso; o valor final depende de avaliação da pintura (clássicos com repintura exigem cautela). Confirmar.",
              "fontes": [
                  "https://www.4ucar.app.br/blog/tabela-de-precos-estetica-automotiva",
                  "https://www.jumpcar.com.br/blog/tabela-de-precos-de-lavagem-automotiva-quanto-cobrar-pelos-servicos",
                  "https://www.vectrolacademy.com.br/guias/tabela-de-precos-estetica-automotiva/",
                  "https://yiets-smem-kroecs.yolasite.com/"
              ]
          }
      },
      {
          "id": "descontaminacao-pintura",
          "nome": "Descontaminação da pintura",
          "categoria": "polimento",
          "preco": null,
          "sugerido": null,
          "aPartirDe": false,
          "status": "sob_avaliacao",
          "confirmado": false,
          "ativo": true,
          "descricao": "Procedimento para remoção de contaminantes aderidos à superfície, conforme a necessidade do veículo.",
          "pesquisa": {
              "mercadoMin": null,
              "mercadoMax": null,
              "escopo": "Nenhum preço avulso encontrado nas fontes acessadas (descontaminação costuma vir embutida em polimento/vitrificação).",
              "justificativa": "Orçamento mediante avaliação.",
              "fontes": []
          }
      },
      {
          "id": "enceramento",
          "nome": "Enceramento e proteção de pintura",
          "categoria": "polimento",
          "preco": null,
          "sugerido": 200,
          "aPartirDe": true,
          "status": "sugerido_aguardando_aprovacao",
          "confirmado": false,
          "ativo": true,
          "descricao": "Aplicação de produtos destinados à proteção e ao acabamento da pintura.",
          "pesquisa": {
              "mercadoMin": 200,
              "mercadoMax": 350,
              "escopo": "Lavagem premium com enceramento (2 h+). Cristalização pós-polimento (+R$300-500, Vectrol) é outro serviço.",
              "justificativa": "Fonte única, sem data. Pode ser incluída na lavagem detalhada: confirmar escopo com o proprietário antes de publicar.",
              "fontes": [
                  "https://www.jumpcar.com.br/blog/tabela-de-precos-de-lavagem-automotiva-quanto-cobrar-pelos-servicos"
              ]
          }
      },
      {
          "id": "protecao-pintura",
          "nome": "Proteção de pintura",
          "categoria": "polimento",
          "preco": null,
          "sugerido": null,
          "aPartirDe": false,
          "status": "sob_avaliacao",
          "confirmado": false,
          "ativo": true,
          "descricao": "Aplicação de produtos de proteção da pintura, conforme avaliação do veículo.",
          "pesquisa": {
              "mercadoMin": null,
              "mercadoMax": null,
              "escopo": "Termo genérico: cristalização/selante pós-polimento aparece só como adicional (+R$300-500, dura 4-8 meses, Vectrol); vitrificação é outro serviço.",
              "justificativa": "Escopo indefinido: Orçamento mediante avaliação.",
              "fontes": [
                  "https://www.vectrolacademy.com.br/guias/tabela-de-precos-estetica-automotiva/"
              ]
          }
      },
      {
          "id": "vitrificacao",
          "nome": "Vitrificação ou proteção cerâmica",
          "categoria": "polimento",
          "preco": null,
          "sugerido": null,
          "aPartirDe": false,
          "status": "sob_avaliacao",
          "confirmado": false,
          "ativo": true,
          "descricao": "Tratamento de proteção da pintura com produtos específicos, mediante avaliação e preparação adequadas.",
          "pesquisa": {
              "mercadoMin": 900,
              "mercadoMax": 2500,
              "escopo": "Revestimento cerâmico incluindo polimento preparatório. 4ucar 600-2500; Jump 900-1500; Vectrol entrada 1500-2000 (premium 3500-5000); Double Detail polimento+vitrificação a partir de 900.",
              "justificativa": "Preço depende de produto, durabilidade e preparação; faixa grande. Recomendado 'Sob consulta' até o proprietário definir produto e garantia (não inventar garantia).",
              "fontes": [
                  "https://www.4ucar.app.br/blog/tabela-de-precos-estetica-automotiva",
                  "https://www.jumpcar.com.br/blog/tabela-de-precos-de-lavagem-automotiva-quanto-cobrar-pelos-servicos",
                  "https://www.vectrolacademy.com.br/guias/tabela-de-precos-estetica-automotiva/",
                  "https://yiets-smem-kroecs.yolasite.com/"
              ]
          }
      },
      {
          "id": "revitalizacao-plasticos",
          "nome": "Revitalização de plásticos",
          "categoria": "especiais",
          "preco": null,
          "sugerido": null,
          "aPartirDe": false,
          "status": "sob_avaliacao",
          "confirmado": false,
          "ativo": true,
          "descricao": "Tratamento dos acabamentos plásticos internos ou externos.",
          "pesquisa": {
              "mercadoMin": null,
              "mercadoMax": null,
              "escopo": "Nenhum preço encontrado.",
              "justificativa": "Orçamento mediante avaliação.",
              "fontes": []
          }
      },
      {
          "id": "limpeza-motor",
          "nome": "Limpeza técnica do motor",
          "categoria": "especiais",
          "preco": null,
          "sugerido": 120,
          "aPartirDe": true,
          "status": "sugerido_aguardando_aprovacao",
          "confirmado": false,
          "ativo": true,
          "descricao": "Limpeza cuidadosa do compartimento do motor, utilizando procedimentos adequados para os componentes.",
          "pesquisa": {
              "mercadoMin": 120,
              "mercadoMax": 300,
              "escopo": "Limpeza de motor básica (popular 120-150; médio 150-200; SUV/premium 200-280) e premium (popular 180-220; médio 220-300).",
              "justificativa": "Fonte única. 'A partir de 120' = básica para carro popular. Em clássicos há cautela com elétrica/borrachas: avaliar caso a caso. Confirmar.",
              "fontes": [
                  "https://www.vectrolacademy.com.br/guias/tabela-de-precos-estetica-automotiva/"
              ]
          }
      },
      {
          "id": "rodas-pneus",
          "nome": "Limpeza e proteção de rodas e pneus",
          "categoria": "especiais",
          "preco": null,
          "sugerido": null,
          "aPartirDe": false,
          "status": "sob_avaliacao",
          "confirmado": false,
          "ativo": true,
          "descricao": "Limpeza detalhada e acabamento das rodas e dos pneus.",
          "pesquisa": {
              "mercadoMin": null,
              "mercadoMax": null,
              "escopo": "Nenhum preço avulso encontrado (normalmente já incluso nas lavagens).",
              "justificativa": "Orçamento mediante avaliação.",
              "fontes": []
          }
      },
      {
          "id": "cristalizacao-vidros",
          "nome": "Cristalização de vidros",
          "categoria": "especiais",
          "preco": null,
          "sugerido": 120,
          "aPartirDe": true,
          "status": "sugerido_aguardando_aprovacao",
          "confirmado": false,
          "ativo": true,
          "descricao": "Tratamento dos vidros do veículo, quando aplicável.",
          "pesquisa": {
              "mercadoMin": 100,
              "mercadoMax": 300,
              "escopo": "Cristalização de vidros (4ucar 100-300, carro médio).",
              "justificativa": "Fonte única; 'a partir de 120' = parte baixa para hatch/clássico. Confirmar se é oferecido.",
              "fontes": [
                  "https://www.4ucar.app.br/blog/tabela-de-precos-estetica-automotiva"
              ]
          }
      },
      {
          "id": "marcas-dagua",
          "nome": "Remoção de marcas d'água e chuva ácida",
          "categoria": "especiais",
          "preco": null,
          "sugerido": null,
          "aPartirDe": false,
          "status": "sob_avaliacao",
          "confirmado": false,
          "ativo": true,
          "descricao": "Tratamento de marcas na pintura ou nos vidros, quando tecnicamente possível.",
          "pesquisa": {
              "mercadoMin": null,
              "mercadoMax": null,
              "escopo": "Nenhum preço encontrado; resultado depende da gravidade da marca.",
              "justificativa": "Orçamento mediante avaliação.",
              "fontes": []
          }
      }
  ],
};
