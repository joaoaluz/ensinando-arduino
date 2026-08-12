import { getMission } from '../../game/missions'
import { useGame } from '../../game/GameContext'
import { XP } from '../../game/xp'
import { MissionRunner, type StepDef } from '../../components/MissionRunner'
import { DialogueBox } from '../../components/DialogueBox'
import { BugHunt } from '../../components/BugHunt'
import { MultipleChoice } from '../../components/MultipleChoice'
import { CodeBlock } from '../../components/CodeBlock'

const mission = getMission('debug')

const BUG_1 = `void setup() {
    pinMode(13, INPUT);
}

void loop() {
    digitalWrite(13, HIGH);
    delay(1000);
}
`

const BUG_1_FIXED = `void setup() {
    pinMode(13, OUTPUT);
}

void loop() {
    digitalWrite(13, HIGH);
    delay(1000);
}
`

const BUG_2 = `void setup() {
    pinMode(13, OUTPUT);
}

void loop() {
    digitalWrite(13, HIGH);
    delay(1000);
}
`

const BUG_3 = `void setup() {
    pinMode(13, OUTPUT);
}

void loop() {
    digitalWrite(13, HIGH);
    digitalWrite(13, LOW);
}
`

export function BossDebug() {
  const { unlockAchievement } = useGame()

  const steps: StepDef[] = [
    {
      id: 'intro',
      render: (api) => (
        <DialogueBox
          who="⚠️ Alerta prioritário"
          icon="👾"
          lines={[
            'Engenheiro, o sinalizador continua sem funcionar corretamente.',
            'Recuperamos três versões antigas do programa que ainda estão rodando em módulos da estação.',
            'Cada uma tem um problema diferente. Encontre todos.',
          ]}
          onContinue={api.next}
          continueLabel="Iniciar varredura"
        />
      ),
    },
    {
      id: 'bug-1',
      render: (api) => (
        <BugHunt
          alert="Módulo 1: o pino 13 recebe o comando de ligar, mas o LED nunca acende. Nenhum erro é reportado."
          code={BUG_1}
          bugLine={1}
          explanation={
            <>
              O pino foi configurado como <code>INPUT</code> — entrada. Assim o Arduino fica
              esperando <em>ler</em> um valor do pino, em vez de <em>escrever</em> energia nele. Para
              acender um LED, o pino precisa ser <code>OUTPUT</code>.
            </>
          }
          fixedCode={BUG_1_FIXED}
          hints={[
            'O problema está em setup(), não em loop().',
            'Pergunte-se: esse pino vai LER alguma coisa ou vai MANDAR energia?',
          ]}
          onCorrect={() => {
            unlockAchievement('cacador-de-bugs')
            api.awardStep(XP.BUG, 'Bug 1 encontrado')
          }}
          onSolved={() => api.solve(XP.BUG, 'Bug 1 encontrado')}
        />
      ),
    },
    {
      id: 'bug-2',
      render: (api) => (
        <MultipleChoice
          visual={<CodeBlock code={BUG_2} label="Módulo 2 — código recuperado" />}
          intro="Bug 2 de 3"
          question="O LED deste módulo acende e fica aceso para sempre. Qual é o problema?"
          choices={[
            {
              id: 'sem-low',
              icon: '🌑',
              label: 'O LED nunca é desligado',
              note: 'Falta um digitalWrite com LOW.',
            },
            {
              id: 'delay-curto',
              icon: '⏱️',
              label: 'O delay é curto demais',
              note: 'Precisaria de mais de 1000.',
            },
            {
              id: 'pino',
              icon: '📍',
              label: 'O pino está errado',
              note: 'Deveria ser outro número.',
            },
          ]}
          correctId="sem-low"
          stacked
          successText="Isso. O programa liga e espera — mas nunca manda desligar."
          concept={
            <>
              <p>
                Como <code>loop()</code> se repete, o Arduino fica ligando um LED que já está ligado.
                O resultado é uma luz constante, não um pisca-pisca.
              </p>
              <p>
                Faltam duas linhas: <code>digitalWrite(13, LOW);</code> e outra{' '}
                <code>delay(1000);</code>.
              </p>
            </>
          }
          wrongMessages={[
            'O código faz o que está escrito nele. Leia de novo: em algum momento ele manda apagar?',
            'Compare com o programa que você escreveu na missão anterior. O que existe lá e não existe aqui?',
          ]}
          hints={['Um pisca-pisca precisa de dois estados. Quantos estados existem neste código?']}
          xpAmount={XP.BUG}
          onCorrect={() => api.awardStep(XP.BUG, 'Bug 2 encontrado')}
          onSolved={() => api.solve(XP.BUG, 'Bug 2 encontrado')}
        />
      ),
    },
    {
      id: 'bug-3',
      render: (api) => (
        <MultipleChoice
          visual={<CodeBlock code={BUG_3} label="Módulo 3 — código recuperado" />}
          intro="Bug 3 de 3"
          question="Este módulo liga e desliga o LED, mas ninguém consegue ver o sinalizador piscando. Por quê?"
          choices={[
            {
              id: 'sem-delay',
              icon: '⏳',
              label: 'Não há tempo suficiente para perceber o piscar',
              note: 'Faltam as pausas entre ligar e desligar.',
            },
            {
              id: 'ordem',
              icon: '🔀',
              label: 'Os comandos estão na ordem errada',
              note: 'Deveria desligar antes de ligar.',
            },
            {
              id: 'input',
              icon: '⚙️',
              label: 'O pino está como INPUT',
              note: 'setup() está incorreto.',
            },
          ]}
          correctId="sem-delay"
          stacked
          successText="Exato. Sem delay(), tudo acontece rápido demais para o olho humano."
          concept={
            <>
              O Arduino executa milhares de instruções por segundo. Ligar e desligar sem pausa faz o
              LED piscar tão rápido que enxergamos apenas uma luz fraca e contínua. É a pausa que
              transforma a repetição em <strong>sinal visível</strong>.
            </>
          }
          wrongMessages={[
            'A ordem está correta e o setup() também. Olhe para o que NÃO está escrito no código.',
            'Compare com o seu programa: entre ligar e desligar havia alguma coisa. O quê?',
          ]}
          hints={['O que existe no seu programa, entre digitalWrite e digitalWrite, que aqui sumiu?']}
          xpAmount={XP.BUG}
          onCorrect={() => api.awardStep(XP.BUG, 'Bug 3 encontrado')}
          onSolved={() => api.solve(XP.BUG, 'Bug 3 encontrado')}
        />
      ),
    },
  ]

  return (
    <MissionRunner
      mission={mission}
      steps={steps}
      completion={{
        title: 'Sistema limpo',
        text: 'Três bugs eliminados. O sinalizador está pronto para ser ativado.',
      }}
    />
  )
}
