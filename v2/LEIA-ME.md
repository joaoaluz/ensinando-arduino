# v2 — slides com sprites

Mesma aula da v1, com uma camada de personagem animado.

| Arquivo | Tema | Slides |
|---|---|---|
| `magia-circuitos-completo.html` | Aprendizes de Magia & Circuitos | 16 (com solução do semáforo) |
| `magia-circuitos-alunos.html` | idem | 14 (termina no desafio) |
| `elas-titam-completo.html` | Elas Titam com Arduino | 16 (com solução) |
| `elas-titam-alunos.html` | idem | 14 (termina no desafio) |

**São arquivos únicos e independentes.** Os sprites estão embutidos em base64,
então dá para abrir de qualquer pasta, mandar por e-mail ou levar em pen drive —
não precisa da pasta `assets/` ao lado.

## O que o boneco faz

**Slide 1 (abertura)** — o personagem atravessa a tela devagar, só de enfeite.

**Slide "Conhecendo as peças"** — clique em **Procurar**. O personagem sai
andando pelo cenário, para em cada uma das 4 construções e, a cada parada,
revela a descrição de um componente. O contador no canto marca `1/4`, `2/4`…

Enquanto a peça não é encontrada, a descrição fica embaçada com um `?`. O botão
**Mostrar todas** revela tudo de uma vez — use se quiser pular a animação ou se
alguém chegou atrasado.

**Slide "Conectando os Fios"** — clique em **Puxar os cabos**. O personagem
percorre o trajeto de cada jumper *no próprio diagrama*, e o fio vai sendo
desenhado atrás dele: primeiro do pino 13 até o LED, depois do GND até o
resistor. É o caminho da corrente, feito passo a passo.

Fora da animação, o diagrama aparece completo e correto — se ninguém apertar o
botão, o slide continua certo.

## Limite dos sprites (importante)

Os sprites do Kenney são **top-down** (vista de cima) e têm **um único quadro
por personagem** — não existe ciclo de caminhada nem vista de perfil. Então o
boneco não mexe as pernas: ele desliza, **gira para a direção em que anda** e
ganha um balanço curto enquanto se move. É a solução padrão para sprites
top-down e funciona bem no projetor.

Se um dia você quiser pernas se mexendo de verdade, precisa de outro tipo de
asset: um *character spritesheet* lateral com quadros de caminhada (o Kenney tem
alguns, como o "Toon Characters" ou o "Platformer Pack"). Aí a animação vira
`steps()` sobre a spritesheet e o resto do código continua igual.

## Acessibilidade

- Nada depende da animação: todo o texto está sempre no HTML (leitor de tela lê
  a descrição mesmo embaçada).
- Com `prefers-reduced-motion` ligado no sistema, nada se move e as peças já
  aparecem reveladas.
- O botão **Mostrar todas** é a saída manual para qualquer situação.

## Créditos dos assets

Sprites: **Kenney** (kenney.nl) — *RTS Pack: Medieval* e *RTS Pack: Sci-fi*.
Licença **CC0 1.0** (domínio público): uso livre, inclusive comercial, sem
obrigação de crédito. O crédito acima é cortesia.

- Tema bruxas → pack medieval
- Tema Elas Titam → pack sci-fi

## Trocar o personagem

Cada tema usa um elenco fixo de 9 sprites. Para trocar, procure o bloco
`const SP = {` no fim do arquivo — são imagens em base64. O jeito prático de
mudar é regerar a partir da pasta `assets/`, trocando o nome do arquivo em
`SPRITE_SETS` no gerador.

Atualmente:

| Papel | Tema bruxas | Tema Elas Titam |
|---|---|---|
| personagem | `medievalUnit_02` | `scifiUnit_01` |
| chão | `medievalTile_16` | `scifiTile_42` |
| 4 paradas | `medievalStructure_07 / 09 / 11 / 04` | `scifiStructure_09 / 11 / 15 / 16` |
