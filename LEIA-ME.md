# Diamond Style Cars: site da estética automotiva

Site estático em HTML, CSS e JavaScript puros. Não tem backend, banco de dados, build nem serviço pago. Para ver, abra `static/index.html` no navegador.

## Como o pedido funciona

1. O cliente escolhe o serviço (ou toca em **Agendar** no cartão do serviço), o dia e o horário que prefere, informa o modelo do carro, o nome e como pretende pagar (Pix ou no dia).
2. Ao tocar em **Abrir WhatsApp**, abre a conversa com a estética, com a mensagem pronta:

```
Olá! Gostaria de solicitar um horário para Lavagem completa (R$ 80,00).
Data desejada: sábado, 14/11/2026.
Horário desejado: 10:00.
Carro: Onix 2020.
Nome: Maria.
Pagamento: Pix.
Esse horário está disponível?
```

Os demais botões de WhatsApp do site (Hero, seção de Serviços, seção de Atendimento, rodapé e atalho flutuante) abrem a conversa com uma mensagem própria para o contexto — não a mesma mensagem genérica em todos. Isso está centralizado em `static/js/ui.js`, no objeto `WA_MENSAGENS`.

3. O pedido só chega à estética quando o cliente toca em **Enviar** no WhatsApp. O horário só fica confirmado quando a estética responder. A página diz isso em vários pontos e nunca afirma que algo foi enviado, confirmado ou pago.

O que o site **não** faz, de propósito: não guarda nada do que o cliente digita, não bloqueia nem reserva horários, não cobra, não gera Pix e não confirma pagamento. Sem backend não existe agenda compartilhada, então o WhatsApp é o canal de envio e de confirmação.

## O que preencher (tudo em `static/js/config.js`)

| Campo | O que é |
|---|---|
| `whatsapp` | **Obrigatório.** DDI + DDD + número, só dígitos. Já preenchido com `"5554999454502"` ((54) 99945-4502). Enquanto estiver vazio, o botão não abre a conversa e a página mostra o aviso "Configuração pendente". |
| `instagram`, `instagramUser` | Opcionais. Já preenchidos com o perfil oficial `@diamondstylecars`. Vazio = o ícone do Instagram some do rodapé. |
| `endereco` | Opcional. Vazio = o endereço e o botão do Maps somem. |
| `horario` | Opcional: `{ abre: "08:00", fecha: "17:00" }`. Se preencher, o horário aparece no site e o campo só aceita horários nessa faixa. Vazio = o cliente digita o horário que prefere. |
| `diasPermitidos` | Dias em que o cliente pode pedir horário. `[6, 0]` = sábado e domingo (0 = domingo ... 6 = sábado). Os textos do site acompanham. |
| `categoriasServicos` | As 4 categorias do catálogo (Lavagem, Higienização, Polimento e Proteção, Cuidados Especiais) e a ordem em que aparecem. |
| `servicos` | Nome, categoria, preço (ou `null`), descrição e as chaves `ativo`/`confirmado` de cada serviço. Para acrescentar um, copie um bloco. |
| `pagamentos` | As duas opções de pagamento e o texto que vai na mensagem. |

### Preços "a confirmar"

O catálogo foi ampliado de 2 para 16 serviços. Os 2 originais (Lavagem completa e Lavagem detalhada) mantiveram os preços e descrições de sempre. Os outros 14 são **sugestões de ampliação ainda não confirmadas** — nenhum preço foi inventado para eles. No site, aparecem com "Consulte disponibilidade e orçamento" no lugar do preço, e uma etiqueta avisando que ainda precisam de confirmação.

Para cada serviço em `static/js/config.js`:

- `ativo: false` tira o serviço do site (catálogo e agendamento) sem apagar o bloco.
- Depois de confirmar o preço com o proprietário, preencha `preco` com o número (em reais) e mude `confirmado` para `true`. O aviso de preço some sozinho.

## Imagens: troque as ilustrações por fotos reais

As fotos do site ficam centralizadas em `static/js/images.js`, como links para fotografias reais e de uso comercial livre (licença Unsplash) — identidade automotiva brasileira: carros clássicos e cenas reais de lavagem/detalhamento, em vez de supercarros modernos.

**Importante:** não existe, em bancos de imagens gratuitos, uma fotografia real de um Chevrolet Opala coberto de espuma de lavagem — é um carro de nicho, e fotos assim praticamente só existem como trabalho autoral das próprias estéticas. A Hero usa a fotografia real mais próxima disso que encontramos (um carro sendo lavado, completamente coberto de espuma, em cena noturna azulada), e as demais seções usam carros clássicos e cenas de detalhamento condizentes com a identidade pedida. Nenhuma dessas fotos é apresentada como trabalho da Diamond Style Car.

Para usar fotos reais do seu próprio Opala (ou de outro carro atendido):

1. Coloque a foto em `static/img/` (JPG ou WebP, de preferência com menos de 300 KB).
2. Em `static/js/images.js`, troque o link correspondente (`hero`, `ctaFinal`, `galeria`, `servicos` ou `categoriaFallback`) pelo caminho da sua foto, por exemplo `"img/hero-opala-espuma.jpg"`.

Não apresente fotos ilustrativas como se fossem trabalhos realmente feitos pela empresa.

## Publicar de graça

Suba a pasta `static/` em GitHub Pages, Netlify ou Cloudflare Pages. Elas dão um endereço gratuito (`...github.io`, `...netlify.app`, `...pages.dev`), sem domínio próprio. Os caminhos são relativos, então funciona em subpasta. As fontes vêm do Google Fonts (gratuito); sem internet o site usa as fontes do aparelho.

## Estrutura

```
static/
  index.html
  css/  base.css (cores, botões)  site.css (páginas)  booking.css (formulário)
  js/   config.js (edite aqui: whatsapp, catálogo)  images.js (edite aqui: fotos)
        util.js  whatsapp.js (mensagem e link)  booking.js (formulário)  ui.js (página)
  img/  ...suas fotos (quando substituir as de images.js)
```

## Se um dia precisar de agenda compartilhada

Horários bloqueados de verdade exigem um banco de dados e um backend (por exemplo, o Spring Boot do projeto original). Isso não é necessário para o fluxo atual e não foi feito aqui para manter o custo zero.
