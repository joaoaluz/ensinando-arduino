# 🚀 Missão: Restaurar a Estação

Jogo educacional web para uma **aula ao vivo de introdução ao Arduino**, para pessoas que nunca
programaram.

O aluno é um engenheiro recém-recrutado da estação espacial Órion, que sofreu um apagão. Para
religar o sinalizador de emergência, ele precisa aprender — na ordem — o que é um circuito, por que
o LED tem polaridade, para que serve o resistor, o que é um pino digital e como escrever o programa
que faz o LED piscar.

O jogo termina no ponto que interessa:

> **"Agora conecte o seu Arduino de verdade e faça o LED piscar."**

---

## Como executar

```bash
npm install
```

```bash
npm run dev
```

Abre em `http://localhost:5173`. Outros comandos:

| Comando             | O que faz                                        |
| ------------------- | ------------------------------------------------ |
| `npm run dev`       | Servidor de desenvolvimento com hot reload        |
| `npm run build`     | Checagem de tipos + build de produção em `dist/`  |
| `npm run preview`   | Serve o `dist/` para conferir o build             |
| `npm run typecheck` | Só a checagem de tipos                            |

**Requisitos:** Node 18+ (testado no Node 22). Sem backend, sem banco, sem chaves de API.

O build usa caminhos relativos (`base: './'`) e rotas em hash, então o `dist/` funciona em qualquer
lugar — GitHub Pages, Netlify, uma pasta compartilhada ou até um pen drive.

---

## Para dar a aula

- **Compartilhe a tela** e jogue junto com a turma, ou peça que cada aluno abra no próprio
  navegador. O layout foi calibrado para leitura em projetor (fontes grandes, alto contraste).
- **O progresso fica salvo no `localStorage`** de cada navegador. Fechar a aba não perde nada.
- **O botão ⟲ no topo reinicia tudo** (pede confirmação). Útil entre turmas.
- **As missões desbloqueiam em ordem.** Colar o link de uma missão futura no chat não pula etapas:
  a rota devolve o aluno ao mapa.
- Cada desafio paga XP **uma única vez**, para sempre. Recarregar a página não gera XP extra.

Percurso completo: **8 missões**, ~610 XP no total, o suficiente para chegar ao último nível
(🚀 Comandante da Estação, 500 XP).

---

## Estrutura do projeto

```
src/
├── main.tsx               Ponto de entrada
├── App.tsx                Rotas (HashRouter) + layout
│
├── game/                  ESTADO — nenhum arquivo aqui importa React DOM
│   ├── types.ts           GameState, Mission, Achievement, MissionId
│   ├── missions.ts        Registro das missões (ordem, ícone, rota)
│   ├── levels.ts          Faixas de nível e cálculo de progresso
│   ├── xp.ts              Tabela de XP
│   ├── achievements.ts    Definição das conquistas
│   ├── storage.ts         Carregar/salvar/limpar localStorage (com validação)
│   ├── GameContext.tsx    Reducer + provider + hook useGame()
│   ├── sound.ts           Barramento de som (stub — ver "Som" abaixo)
│   └── session.ts         Contrato do futuro modo professor (stub)
│
├── components/            APRESENTAÇÃO — reutilizáveis e desacoplados
│   ├── GameHeader · XPBar · ProgressIndicator · AchievementPopup
│   ├── Panel · Button · Feedback (+ ConceptBox) · HintSystem
│   ├── MissionMap · MissionCard · MissionGate · MissionRunner
│   ├── DialogueBox · MultipleChoice · MatchPairs · OrderList
│   ├── SlotBuilder        Montagem por encaixes (clique ou arrastar)
│   ├── CircuitBoard       Circuito em SVG com chave interativa
│   ├── ArduinoBoard       Placa em SVG com regiões clicáveis
│   ├── ComponentCard · CodeBlock · CodeChallenge · CodeEditor · BugHunt
│
├── screens/
│   ├── HomeScreen · MapScreen · VictoryScreen
│   └── missions/          Uma missão por arquivo (M1…M7 + BossDebug)
│
└── styles/                theme (tokens) · base · ui · scenes · challenges
```

### Como o estado é organizado

Tudo vive em um único reducer (`game/GameContext.tsx`) e é persistido em `localStorage` sob a chave
`orion:save`:

```ts
type GameState = {
  version: number            // schema; um save de versão diferente é descartado
  xp: number
  level: number
  currentMission: number
  completedMissions: MissionId[]
  achievements: AchievementId[]
  hintsUsed: number
  awardedKeys: string[]      // chaves de XP já pagas → impede farmar recarregando
  missionProgress: Record<MissionId, string[]>  // passos feitos → retoma onde parou
  started: boolean
  finished: boolean
}
```

Duas decisões que sustentam o resto:

- **`awardedKeys` é o que impede o XP infinito.** Cada desafio tem uma chave única
  (`"circuito:switch"`). `award()` ignora chaves já pagas, e a lista é persistida — então recarregar
  ou refazer a missão não gera XP novo. Como é idempotente, chamar `award` duas vezes é seguro.
- **`missionProgress` guarda os passos concluídos**, e não um índice. Assim, inserir um passo novo no
  meio de uma missão não corrompe saves antigos.

Componentes nunca leem `localStorage` nem calculam XP: eles chamam `useGame()`.

---

## Como adicionar uma missão nova

Três passos — o mapa, o desbloqueio e a navegação se ajustam sozinhos.

**1. Registre o id** em `src/game/types.ts`:

```ts
export type MissionId = 'energia' | /* … */ | 'sensor'
```

**2. Adicione a entrada** em `src/game/missions.ts`, com o `order` na posição desejada:

```ts
{
  id: 'sensor',
  order: 9,
  code: 'MISSÃO 09',
  name: 'O Sensor',
  icon: '🌡️',
  tagline: 'Ler o mundo, não só acender luzes.',
  path: '/missao/sensor',
  mapLabel: 'SENSOR',
}
```

**3. Crie a tela** em `src/screens/missions/` e registre a rota em `App.tsx`:

```tsx
<Route path="/missao/sensor" element={<MissionGate id="sensor"><M8Sensor /></MissionGate>} />
```

### Como uma missão é escrita

Uma missão é só uma **lista de passos**. O `MissionRunner` cuida de avançar, salvar o progresso,
pagar o XP, mostrar a tela de conclusão e liberar a próxima missão.

```tsx
export function M8Sensor() {
  const steps: StepDef[] = [
    {
      id: 'intro',
      render: (api) => <DialogueBox lines={['…']} onContinue={api.next} />,
    },
    {
      id: 'q-leitura',
      render: (api) => (
        <MultipleChoice
          question="…"
          choices={[…]}
          correctId="…"
          successText="…"
          concept={<>Explicação que só aparece DEPOIS da tentativa.</>}
          wrongMessages={['Primeira dica ao errar', 'Segunda, mais direta']}
          hints={['Aparece sozinha após 2 erros']}
          onCorrect={api.awardStep}   // credita o XP no instante do acerto
          onSolved={api.solve}        // avança quando o aluno clica em Continuar
        />
      ),
    },
  ]

  return <MissionRunner mission={getMission('sensor')} steps={steps}
    completion={{ title: '…', text: '…' }} />
}
```

A API entregue a cada passo:

| Método                       | Efeito                                                   |
| ---------------------------- | -------------------------------------------------------- |
| `api.next()`                 | avança sem pagar XP (diálogos)                            |
| `api.awardStep(xp?, label?)` | paga o XP do passo **sem** avançar (usar no acerto)       |
| `api.solve(xp?, label?)`     | paga o XP (se ainda não pago) **e** avança                |
| `api.award(chave, xp, label)`| paga um XP extra, com chave própria                       |

Valores de XP em `src/game/xp.ts` — use as constantes, nunca números soltos:
`CORRECT 10 · CHALLENGE 20 · BUG 30 · CODE 40 · FINAL 100`.

### Como adicionar uma conquista

Acrescente o id em `AchievementId` (`types.ts`), a definição em `achievements.ts` e chame
`unlockAchievement('id')` no momento certo. O popup e a lista do mapa aparecem sozinhos.

---

## Decisões de projeto

**Por que o código não aparece pronto.** O programa final é descoberto comando a comando na missão 7:
cada acerto acrescenta uma linha ao programa mostrado na tela. Só depois disso o aluno recebe o
editor.

**A validação do código não é um compilador.** `CodeEditor` verifica a *presença* dos elementos
(`pinMode`, `OUTPUT`, `digitalWrite`, `HIGH`, `LOW`, dois `delay`) por expressão regular, e devolve
uma mensagem contextual para a primeira falha — nunca a resposta. Aceita `13` ou uma variável como
`led`, com ou sem comentários.

**Dicas não descontam XP de verdade.** O contador `hintsUsed` é só informativo. Punir quem pede ajuda
não faz sentido para uma turma de iniciantes.

**Sem drag-and-drop obrigatório.** As atividades de montagem e ordenação funcionam por clique e por
teclado; arrastar é um extra no `SlotBuilder`. Drag-and-drop puro quebra no celular e é ruim para
acessibilidade.

**Sem simulador de Arduino.** O jogo ensina o suficiente para a montagem real; o Tinkercad aparece só
como convite opcional no fim (`TINKERCAD_URL` em `VictoryScreen.tsx`).

---

## Som

Não há áudio no MVP, mas toda a interface já chama `playSound('correct' | 'wrong' | …)`. Para ativar:

1. coloque os arquivos em `public/sounds/<nome>.mp3`
2. mude `enabled` para `true` em `src/game/sound.ts`

Nenhum componente precisa mudar.

---

## Modo professor (preparado, não implementado)

`src/game/session.ts` define o contrato — `ProgressReport` e a interface `ProgressTransport`. Hoje o
transporte padrão não faz nada e **nada sai do navegador do aluno**. Quando existir um servidor,
basta implementar a interface e chamar `setProgressTransport(...)` no `main.tsx`.

---

## Acessibilidade

Contraste alto sobre fundo escuro; alvos de clique grandes; navegação por teclado (inclusive a chave
do circuito e as setas de ordenação); `aria-label` nos controles interativos e nos SVGs; estados de
acerto/erro sempre com ícone **e** texto, nunca só cor; XP e conquistas anunciados por `aria-live`; e
respeito a `prefers-reduced-motion`.

**Emojis:** a interface usa emoji como ícones. Windows, macOS, Android e iOS trazem a fonte de emoji
por padrão. Em algumas distribuições Linux enxutas pode ser preciso instalar `fonts-noto-color-emoji`
para que apareçam coloridos em vez de quadradinhos.

---

## Estado de verificação

Percurso completo automatizado no Chromium (as 8 missões, do início à vitória):

- fluxo inteiro jogável até a tela final — 610 XP, nível máximo, 5/5 conquistas
- **zero erros de console**
- progresso persiste após recarregar; refazer uma missão **não** gera XP novo
- missão bloqueada acessada por URL volta para o mapa
- sem rolagem horizontal em 390 px, 820 px, 1440 px e 1920 px
