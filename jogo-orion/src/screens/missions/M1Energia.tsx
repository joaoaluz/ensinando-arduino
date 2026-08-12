import { getMission } from '../../game/missions'
import { MissionRunner, type StepDef } from '../../components/MissionRunner'
import { DialogueBox } from '../../components/DialogueBox'
import { MultipleChoice } from '../../components/MultipleChoice'
import { ComponentGrid, type ComponentInfo } from '../../components/ComponentCard'
import { Panel } from '../../components/Panel'

const mission = getMission('energia')

const BENCH: ComponentInfo[] = [
  { id: 'bateria', icon: '🔋', name: 'Bateria', role: 'Fornece a energia do circuito.' },
  { id: 'led', icon: '💡', name: 'LED', role: 'Transforma energia elétrica em luz.' },
  { id: 'resistor', icon: '🧱', name: 'Resistor', role: 'Limita a corrente que passa.' },
  { id: 'fio', icon: '🔌', name: 'Fio', role: 'Leva a energia de um ponto a outro.' },
  { id: 'arduino', icon: '🤖', name: 'Arduino', role: 'Controla o circuito: é o cérebro.' },
  { id: 'botao', icon: '🔘', name: 'Botão', role: 'Abre e fecha o caminho quando pressionado.' },
]

/** Grid da bancada com as funções já descobertas reveladas. */
function Bench({ revealed }: { revealed: string[] }) {
  return (
    <Panel title="🧰 Bancada de componentes">
      <ComponentGrid items={BENCH} revealed={revealed} />
      <p className="tiny" style={{ marginTop: 12 }}>
        Cada resposta certa revela a função de um componente.
      </p>
    </Panel>
  )
}

export function M1Energia() {
  const steps: StepDef[] = [
    {
      id: 'intro',
      render: (api) => (
        <div className="stack">
          <DialogueBox
            lines={[
              'Engenheiro, aqui é a Central de Controle.',
              'O sistema detectou que ainda existe energia disponível na estação — mas nenhum componente está funcionando.',
              'Antes de consertar qualquer coisa, precisamos saber o que cada peça faz.',
            ]}
            onContinue={api.next}
            continueLabel="Ver a bancada"
          />
          <Bench revealed={[]} />
        </div>
      ),
    },
    {
      id: 'q-bateria',
      render: (api) => (
        <MultipleChoice
          visual={<Bench revealed={[]} />}
          intro="Desafio 1 de 4"
          question="Qual componente fornece energia ao circuito?"
          choices={[
            { id: 'bateria', icon: '🔋', label: 'Bateria' },
            { id: 'led', icon: '💡', label: 'LED' },
            { id: 'resistor', icon: '🧱', label: 'Resistor' },
          ]}
          correctId="bateria"
          successText="A bateria é a fonte de energia do circuito."
          concept={
            <>
              Todo circuito precisa de uma <strong>fonte</strong>. Ela é o ponto de partida da
              energia. Mais adiante, quem vai fazer esse papel é o próprio Arduino, alimentado pelo
              cabo USB.
            </>
          }
          wrongMessages={[
            'Esse componente usa energia, mas não a fornece. Quem entrega energia para os outros?',
            'Pense no que você coloca dentro de um controle remoto para ele funcionar.',
          ]}
          hints={['A fonte é o componente que você troca quando o brinquedo "morre".']}
          onCorrect={api.awardStep}
          onSolved={api.solve}
        />
      ),
    },
    {
      id: 'q-led',
      render: (api) => (
        <MultipleChoice
          visual={<Bench revealed={['bateria']} />}
          intro="Desafio 2 de 4"
          question="Qual componente transforma energia elétrica em luz?"
          choices={[
            { id: 'led', icon: '💡', label: 'LED' },
            { id: 'fio', icon: '🔌', label: 'Fio' },
            { id: 'botao', icon: '🔘', label: 'Botão' },
          ]}
          correctId="led"
          successText="O LED acende quando a corrente passa por ele no sentido certo."
          concept={
            <>
              <strong>LED</strong> quer dizer "diodo emissor de luz". É ele que vai virar o
              sinalizador de emergência da estação.
            </>
          }
          wrongMessages={[
            'Esse componente participa do caminho, mas não emite luz.',
            'Procure a peça que, em qualquer aparelho, é aquela luzinha que acende.',
          ]}
          onCorrect={api.awardStep}
          onSolved={api.solve}
        />
      ),
    },
    {
      id: 'q-resistor',
      render: (api) => (
        <MultipleChoice
          visual={<Bench revealed={['bateria', 'led']} />}
          intro="Desafio 3 de 4"
          question="Qual componente ajuda a limitar a corrente?"
          choices={[
            { id: 'resistor', icon: '🧱', label: 'Resistor' },
            { id: 'bateria', icon: '🔋', label: 'Bateria' },
            { id: 'arduino', icon: '🤖', label: 'Arduino' },
          ]}
          correctId="resistor"
          successText="O resistor segura parte da corrente e protege os outros componentes."
          concept={
            <>
              Corrente demais queima o LED. O <strong>resistor</strong> funciona como um
              estreitamento no caminho: passa energia, mas com calma.
            </>
          }
          wrongMessages={[
            'Esse não segura corrente — pense em quem faz o papel de "freio".',
            'O nome do componente já entrega: ele resiste à passagem da corrente.',
          ]}
          onCorrect={api.awardStep}
          onSolved={api.solve}
        />
      ),
    },
    {
      id: 'q-arduino',
      render: (api) => (
        <MultipleChoice
          visual={<Bench revealed={['bateria', 'led', 'resistor']} />}
          intro="Desafio 4 de 4"
          question='Qual componente podemos usar como "cérebro" para controlar o circuito?'
          choices={[
            { id: 'arduino', icon: '🤖', label: 'Arduino' },
            { id: 'resistor', icon: '🧱', label: 'Resistor' },
            { id: 'fio', icon: '🔌', label: 'Fio' },
          ]}
          correctId="arduino"
          successText="O Arduino executa instruções e decide quando ligar ou desligar cada pino."
          concept={
            <>
              Os outros componentes sempre fazem a mesma coisa. O <strong>Arduino</strong> faz o que
              você mandar — e é por isso que ele precisa de um programa.
            </>
          }
          wrongMessages={[
            'Esse componente não toma decisões: ele sempre faz a mesma coisa.',
            'Procure a peça que precisa ser programada.',
          ]}
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
        title: 'Setor de energia identificado',
        text: 'Você já sabe o papel de cada componente. Agora precisamos fazer a energia circular.',
        extra: <Bench revealed={BENCH.map((item) => item.id)} />,
      }}
    />
  )
}
