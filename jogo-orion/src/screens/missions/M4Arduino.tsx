import { getMission } from '../../game/missions'
import { MissionRunner, type StepDef } from '../../components/MissionRunner'
import { DialogueBox } from '../../components/DialogueBox'
import { MultipleChoice } from '../../components/MultipleChoice'
import { ArduinoBoard } from '../../components/ArduinoBoard'
import { Panel } from '../../components/Panel'
import { Button } from '../../components/Button'

const mission = getMission('arduino')

function Board() {
  return (
    <Panel title="🤖 Placa localizada — Arduino Uno">
      <ArduinoBoard />
    </Panel>
  )
}

export function M4Arduino() {
  const steps: StepDef[] = [
    {
      id: 'intro',
      render: (api) => (
        <DialogueBox
          lines={[
            'Temos energia. Temos o circuito. Temos o LED protegido.',
            'Agora precisamos de alguém para controlar tudo isso — algo que decida quando acender e quando apagar.',
            'O Arduino foi localizado no compartimento técnico. Vamos conhecê-lo.',
          ]}
          onContinue={api.next}
          continueLabel="Abrir o compartimento"
        />
      ),
    },
    {
      id: 'explorar',
      render: (api) => (
        <Panel hud>
          <h3 className="question">Reconhecimento da placa</h3>
          <p className="question__hint">
            Clique nas quatro regiões abaixo da placa para descobrir para que serve cada uma. Depois
            siga em frente.
          </p>
          <div style={{ marginTop: 24 }}>
            <ArduinoBoard />
          </div>
          <div className="btn-row" style={{ marginTop: 24 }}>
            <Button variant="success" onClick={() => api.next()}>
              Já explorei a placa →
            </Button>
          </div>
        </Panel>
      ),
    },
    {
      id: 'q-pinos',
      render: (api) => (
        <MultipleChoice
          visual={<Board />}
          intro="Desafio 1 de 2"
          question="Qual desses grupos representa os pinos digitais?"
          choices={[
            { id: 'a', label: 'A) 0  1  2  3  4  5 ... 13', note: 'A fileira de cima da placa.', mono: true },
            { id: 'b', label: 'B) GND  5V  VIN', note: 'A fileira de baixo da placa.', mono: true },
            { id: 'c', label: 'C) USB', note: 'O conector retangular da lateral.', mono: true },
          ]}
          correctId="a"
          stacked
          successText="São os pinos numerados. É neles que ligamos componentes que o programa controla."
          concept={
            <>
              <p>
                Cada pino digital pode ser <strong>entrada</strong> (o Arduino lê algo, como um
                botão) ou <strong>saída</strong> (o Arduino manda energia, como para um LED).
              </p>
              <p>
                Nosso sinalizador vai usar o <strong>pino 13</strong> — o preferido nos primeiros
                projetos, porque a maioria das placas já traz um LED embutido ligado a ele.
              </p>
            </>
          }
          wrongMessages={[
            'Esse grupo tem a ver com alimentação e conexão, não com pinos que o programa controla um a um.',
            'Procure o grupo que é apenas uma sequência de números.',
          ]}
          hints={['Pinos digitais são identificados por números, de 0 a 13.']}
          onCorrect={api.awardStep}
          onSolved={api.solve}
        />
      ),
    },
    {
      id: 'q-gnd',
      render: (api) => (
        <MultipleChoice
          visual={<Board />}
          intro="Desafio 2 de 2"
          question="Para que serve o pino GND?"
          choices={[
            {
              id: 'volta',
              icon: '↩️',
              label: 'É o caminho de volta da corrente',
              note: 'Fecha o circuito de novo na placa.',
            },
            {
              id: 'liga',
              icon: '🔌',
              label: 'É onde se liga o computador',
              note: 'Serve para enviar o programa.',
            },
            {
              id: 'brilho',
              icon: '🔆',
              label: 'Controla o brilho do LED',
              note: 'Quanto mais GND, mais luz.',
            },
          ]}
          correctId="volta"
          stacked
          successText="GND é o ponto de retorno. Sem ele, o circuito nunca se fecha."
          concept={
            <>
              Lembra do <strong>caminho de volta</strong> da missão 2? No Arduino ele se chama{' '}
              <strong>GND</strong> (de <em>ground</em>, terra). A corrente sai por um pino digital,
              atravessa o resistor e o LED, e retorna pelo GND. Sem essa volta, nada acende.
            </>
          }
          wrongMessages={[
            'Volte à missão 2: o que todo circuito precisa além do caminho de ida?',
            'GND vem de "ground". Ele é o ponto de retorno de todo o circuito.',
          ]}
          hints={['Pense no fio de baixo do circuito da missão 2.']}
          onCorrect={api.awardStep}
          onSolved={api.solve}
        />
      ),
    },
  ]

  return (
    <MissionRunner
      mission={mission}
      steps={steps}
      completion={{
        title: 'Cérebro on-line',
        text: 'Você já reconhece os pinos digitais, o GND e o papel do microcontrolador. Só falta ensinar a ele o que dizer.',
      }}
    />
  )
}
