# v3 — Estação Órion (jogo 2D)

Jogo top-down com os sprites do Kenney. **Abre com duplo clique** em
`index.html` — arquivo único, sprites embutidos, sem servidor e sem instalar
nada.

## Controles

| Tecla | Ação |
|---|---|
| **W A S D** ou **setas** | andar |
| **E** (ou espaço / enter) | interagir, avançar diálogo |
| **Esc** | fechar painel |

## O jogo

Você é a engenheira da estação. O sinalizador de emergência está apagado e as
peças foram espalhadas pelos quatro setores.

1. **Encontre as 4 peças** — LED, resistor 220Ω, jumpers e protoboard. Cada uma
   fica num setor diferente e, ao recolher, explica para que serve.
2. **Monte o circuito** na bancada do centro — coloque as peças na ordem em que
   a corrente passa: `Pino 13 → Resistor → LED → GND`. Errar mostra quantas
   estão fora de lugar, sem entregar a resposta.
3. **Ligue a torre** à direita — o sinalizador começa a piscar e aparece o
   código do Arduino que faz exatamente aquilo.

A barra de baixo é no estilo Doom: contador de peças, objetivo atual, retrato e
as peças funcionando como keycards.

## Sobre o "engine Doom"

Você pediu engine Doom. Isso **não dá com estes assets**, e o motivo é concreto:
Doom é um raycaster em primeira pessoa, onde os sprites são vistos **de frente**.
Os sprites do Kenney RTS são **top-down** — você vê o topo da cabeça. Num
raycaster eles apareceriam como cabeças e telhados flutuando de lado.

O que foi feito: um jogo **2D top-down** de verdade (game loop em canvas,
colisão, câmera que segue, interação por proximidade) — que é para isso que
esses sprites existem. O "Doom" entrou onde cabe: cenário marciano, level com
salas e corredores, e a barra de status.

Para primeira pessoa mesmo, seria preciso outro pacote: texturas de parede +
sprites frontais. O código do jogo não se aproveita; seria começar do zero.

## Detalhe técnico

O pacote Kenney RTS é de terreno aberto e **não tem tile de parede**. As paredes
são desenhadas no canvas (bloco sólido + topo iluminado + sombra na base) e a
pedra do pacote entra por cima só como textura — sozinha, ela lia como uma
pedrinha solta em vez de um muro.

## Mudar o mapa

O mapa é a constante `MAPA` dentro do arquivo, uma linha de texto por fileira:

```
# parede   . chão      , chão do centro
c cristal  v vegetação
1 LED  2 resistor  3 jumpers  4 protoboard
A bancada  S torre do sinalizador  P início
```

Todas as linhas precisam do mesmo comprimento, e `P A S 1 2 3 4` aparecem
exatamente uma vez cada.

## Créditos

Sprites: **Kenney** (kenney.nl) — *RTS Pack: Sci-fi*. Licença **CC0 1.0**
(domínio público): uso livre, inclusive comercial, sem obrigação de crédito.
