import { getMission } from '../../game/missions'
import { useGame } from '../../game/GameContext'
import { XP } from '../../game/xp'
import { MissionRunner, type StepDef } from '../../components/MissionRunner'
import { DialogueBox } from '../../components/DialogueBox'
import { CodeChallenge } from '../../components/CodeChallenge'
import { CodeEditor, SOLUTION } from '../../components/CodeEditor'
import { CodeBlock } from '../../components/CodeBlock'
import { ConceptBox } from '../../components/Feedback'

const mission = getMission('codigo')

/**
 * O programa vai sendo revelado a cada acerto. O aluno nunca vê o código
 * final antes de tê-lo descoberto pedaço por pedaço (§2, §25).
 */
const STAGE_0 = `void setup() {

}

void loop() {

}
`

const STAGE_1 = `void setup() {
    pinMode(13, OUTPUT);
}

void loop() {

}
`

const STAGE_2 = `void setup() {
    pinMode(13, OUTPUT);
}

void loop() {
    digitalWrite(13, HIGH);
}
`

const STAGE_3 = `void setup() {
    pinMode(13, OUTPUT);
}

void loop() {
    digitalWrite(13, HIGH);
    delay(1000);
}
`

const STAGE_4 = `void setup() {
    pinMode(13, OUTPUT);
}

void loop() {
    digitalWrite(13, HIGH);
    delay(1000);

    digitalWrite(13, LOW);
    delay(1000);
}
`

export function M7Codigo() {
  const { unlockAchievement } = useGame()

  const steps: StepDef[] = [
    {
      id: 'intro',
      render: (api) => (
        <DialogueBox
          lines={[
            'Todo programa de Arduino nasce com duas partes.',
            'setup() roda uma única vez, quando a placa liga: é onde a gente prepara as coisas.',
            'loop() roda para sempre, repetindo sem parar: é onde a estação vive.',
            'Vamos preencher esses dois blocos, um comando de cada vez.',
          ]}
          onContinue={api.next}
          continueLabel="Abrir o console"
        />
      ),
    },
    {
      id: 'q-pinmode',
      render: (api) => (
        <CodeChallenge
          intro="Comando 1 de 4 — dentro de setup()"
          programSoFar={STAGE_0}
          question="Qual comando configura o pino 13 como saída?"
          options={['pinMode(13, OUTPUT);', 'pinMode(13, INPUT);', 'digitalWrite(13, OUTPUT);']}
          correctIndex={0}
          successText="É a primeira coisa que o Arduino precisa saber: esse pino vai escrever, não ler."
          concept={
            <>
              <code>pinMode()</code> recebe duas informações: <strong>qual pino</strong> e{' '}
              <strong>como ele será usado</strong>. <code>OUTPUT</code> é saída (mandar energia) e{' '}
              <code>INPUT</code> é entrada (ler algo).
            </>
          }
          hints={[
            'O Arduino precisa saber se o pino será usado como entrada ou saída.',
            'Procure por pinMode(). E lembre: para acender um LED, o pino precisa ser uma saída.',
          ]}
          onCorrect={api.awardStep}
          onSolved={api.solve}
        />
      ),
    },
    {
      id: 'q-high',
      render: (api) => (
        <CodeChallenge
          intro="Comando 2 de 4 — dentro de loop()"
          programSoFar={STAGE_1}
          question="Qual comando liga o LED?"
          options={['digitalWrite(13, HIGH);', 'digitalWrite(13, LOW);', 'pinMode(13, HIGH);']}
          correctIndex={0}
          successText="HIGH manda energia para o pino 13. O LED acende."
          concept={
            <>
              <code>digitalWrite()</code> também recebe duas informações: o pino e o estado.{' '}
              <code>HIGH</code> é ligado, <code>LOW</code> é desligado. Só existem esses dois
              estados — é por isso que o pino se chama <strong>digital</strong>.
            </>
          }
          hints={['Você já traduziu LIGAR na missão anterior. Qual palavra era?']}
          onCorrect={api.awardStep}
          onSolved={api.solve}
        />
      ),
    },
    {
      id: 'q-delay',
      render: (api) => (
        <CodeChallenge
          intro="Comando 3 de 4 — dentro de loop()"
          programSoFar={STAGE_2}
          question="Qual comando faz o Arduino esperar 1 segundo?"
          options={['delay(1000);', 'delay(1);', 'wait(1000);']}
          correctIndex={0}
          successText="delay() conta em milissegundos: 1000 milissegundos são 1 segundo."
          concept={
            <>
              Sem essa pausa, o Arduino executaria as próximas instruções em microssegundos. O LED
              até piscaria — milhares de vezes por segundo — mas nossos olhos veriam apenas uma luz
              fraca e constante.
            </>
          }
          hints={[
            'O comando existe e você já o viu. O detalhe está no número.',
            'A unidade é o milissegundo. Quantos milissegundos cabem em 1 segundo?',
          ]}
          onCorrect={api.awardStep}
          onSolved={api.solve}
        />
      ),
    },
    {
      id: 'q-low',
      render: (api) => (
        <CodeChallenge
          intro="Comando 4 de 4 — dentro de loop()"
          programSoFar={STAGE_3}
          question="Qual comando desliga o LED?"
          options={['digitalWrite(13, LOW);', 'digitalWrite(13, OFF);', 'pinMode(13, LOW);']}
          correctIndex={0}
          successText="LOW corta a energia do pino. O LED apaga."
          concept={
            <>
              <p>
                Repare que o Arduino não conhece a palavra <code>OFF</code>. O vocabulário dele é
                pequeno e fixo — e é justamente isso que torna tudo previsível.
              </p>
              <p>
                Falta só uma coisa para o pisca-pisca ficar completo: outra pausa depois de apagar.
              </p>
            </>
          }
          hints={['Mesmo comando de ligar, com a outra palavra que você traduziu na missão 5.']}
          onCorrect={api.awardStep}
          onSolved={api.solve}
        />
      ),
    },
    {
      id: 'programa',
      render: (api) => (
        <div className="stack">
          <CodeBlock code={STAGE_4} label="O programa que você descobriu" />
          <ConceptBox tag="Um detalhe de organização">
            <p>
              Repetir o número <code>13</code> em vários lugares funciona, mas dá trabalho se um dia
              você mudar de pino. Programadores costumam guardar esse número em um{' '}
              <strong>nome</strong>:
            </p>
            <p>
              <code>int led = 13;</code> — a partir daí, é só escrever <code>led</code> no lugar do
              número.
            </p>
          </ConceptBox>
          <DialogueBox
            who="Central de Controle"
            lines={[
              'Agora é com você, engenheiro.',
              'Escreva o programa completo no console. Use o nome led para o pino, se quiser.',
            ]}
            onContinue={api.next}
            continueLabel="Assumir o console"
          />
        </div>
      ),
    },
    {
      id: 'editor',
      render: (api) => (
        <CodeEditor
          successExtra={
            <div style={{ marginTop: 20 }}>
              <CodeBlock code={SOLUTION} label="Versão de referência da Central" />
              <p className="tiny" style={{ marginTop: 8 }}>
                A sua versão não precisa ser idêntica a esta. O que importa é que o pino seja
                configurado como saída e que o LED ligue, espere, desligue e espere.
              </p>
            </div>
          }
          onCorrect={() => {
            unlockAchievement('primeiro-programa')
            api.awardStep(XP.CODE, 'Programa do sinalizador')
          }}
          onSolved={() => api.solve(XP.CODE, 'Programa do sinalizador')}
        />
      ),
    },
  ]

  return (
    <MissionRunner
      mission={mission}
      steps={steps}
      completion={{
        title: 'Programa gravado',
        text: 'O sinalizador tem hardware e software. Mas a Central está detectando algo estranho no sistema...',
      }}
    />
  )
}
