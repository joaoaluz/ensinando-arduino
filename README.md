# Ensinando Arduino

Material para aulas ao vivo de introdução ao Arduino, para pessoas que nunca programaram. É a
mesma aula em três formatos diferentes — escolha o que combina com a turma e o tempo disponível.

## O que tem aqui

| Formato | Onde | O que é |
| --- | --- | --- |
| **Slides** | raiz do repositório | Apresentação HTML com os conceitos: o que é um circuito, LED e polaridade, resistor, pino digital, escrever o código que pisca o LED. |
| **Slides com personagem** | [`v2/`](v2/) | As mesmas apresentações, com um personagem animado que percorre o cenário revelando os componentes e conectando os fios. |
| **Jogo 2D (arquivo único)** | [`v3/`](v3/) | Versão em jogo top-down, sem instalar nada: ande pela estação, colete as peças, monte o circuito. |
| **Jogo completo — Missão: Restaurar a Estação** | [`jogo-orion/`](jogo-orion/) | App React/Vite, a versão mais completa: 8 missões, sistema de XP, conquistas, progresso salvo no navegador. |

Cada slide existe em duas versões:

- **`-alunos`** — termina no desafio, para a turma resolver ao vivo.
- **`-completo`** (ou `-solucao`) — inclui a solução, para o professor acompanhar.

E em três temas, todos cobrindo o mesmo conteúdo de circuitos:

| Tema | Arquivo (raiz) |
| --- | --- |
| Arduino para Todas | `arduino-alunos-desafio.html` / `arduino-completo-solucao.html` |
| Aprendizes de Magia & Circuitos | `magia-circuitos-alunos.html` / `magia-circuitos-completo.html` |
| Elas Titam com Arduino | `elas-titam-alunos.html` / `elas-titam-completo.html` |

## Como usar

**Slides (raiz e `v2/`)** — arquivos HTML únicos e independentes, com os sprites embutidos em
base64. Basta abrir com duplo clique ou hospedar em qualquer lugar estático (GitHub Pages, Netlify,
pen drive, anexo de e-mail) — não precisa da pasta `assets/` ao lado.

**Jogo 2D (`v3/`)** — mesma ideia: abra `v3/index.html` com duplo clique, sem servidor.

**Jogo completo (`jogo-orion/`)** — precisa de Node 18+:

```bash
cd jogo-orion
npm install
npm run dev
```

Abre em `http://localhost:5173`. `npm run build` gera um `dist/` estático que roda em qualquer
host — GitHub Pages, Netlify, Vercel. Detalhes de arquitetura, como adicionar uma missão nova e
dicas para dar a aula estão no [`jogo-orion/README.md`](jogo-orion/README.md).

## Estrutura

```
.
├── arduino-*.html                 slides — tema "Arduino para Todas"
├── magia-circuitos-*.html         slides — tema "Aprendizes de Magia & Circuitos"
├── elas-titam-*.html              slides — tema "Elas Titam com Arduino"
├── v2/                            mesmos slides, com personagem animado
├── v3/                            jogo 2D em arquivo único
├── jogo-orion/                    jogo completo (React + Vite, 8 missões)
└── assets/kenney_medieval-rts/    sprites-fonte usados para gerar os HTMLs em base64
```

## Créditos

Sprites: **Kenney** (kenney.nl) — *RTS Pack: Medieval* e *RTS Pack: Sci-fi*, licença **CC0 1.0**
(domínio público — uso livre, inclusive comercial, crédito não obrigatório).
