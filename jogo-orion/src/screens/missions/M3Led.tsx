import { getMission } from '../../game/missions'
import { MissionRunner, type StepDef } from '../../components/MissionRunner'
import { DialogueBox } from '../../components/DialogueBox'
import { MultipleChoice } from '../../components/MultipleChoice'
import { Panel } from '../../components/Panel'

const mission = getMission('led')

/** Anatomia do LED: perna longa (ânodo) e perna curta (cátodo). */
function LedAnatomy() {
  return (
    <Panel title="🔬 Análise do componente">
      <svg
        viewBox="0 0 460 280"
        className="board"
        style={{ maxWidth: 420 }}
        role="img"
        aria-label="LED ampliado: a perna longa é o ânodo (positivo) e a perna curta é o cátodo (negativo), do lado do chanfro."
      >
        {/* Cúpula do LED */}
        <path
          d="M170 130 A 60 60 0 0 1 290 130 L290 168 L170 168 Z"
          fill="rgba(255,181,69,0.35)"
          stroke="#ffb545"
          strokeWidth="3"
        />
        {/* Chanfro do lado do cátodo */}
        <path d="M290 150 L290 168 L268 168 Z" fill="#0e182a" stroke="#ffb545" strokeWidth="2" />
        <rect x="164" y="166" width="132" height="12" rx="4" fill="#ffb545" opacity="0.55" />

        {/* Perna longa: ânodo */}
        <path d="M196 178 V 250" stroke="#9fb2c8" strokeWidth="7" strokeLinecap="round" />
        <text x="196" y="272" className="svg-label svg-label--bright" textAnchor="middle">
          PERNA LONGA
        </text>
        <text x="196" y="112" className="svg-label" textAnchor="middle" fill="#34e39b">
          ÂNODO (+)
        </text>
        <path d="M196 120 V 150" stroke="#34e39b" strokeWidth="2" strokeDasharray="4 4" />

        {/* Perna curta: cátodo */}
        <path d="M266 178 V 222" stroke="#9fb2c8" strokeWidth="7" strokeLinecap="round" />
        <text x="290" y="244" className="svg-label svg-label--bright" textAnchor="middle">
          PERNA CURTA
        </text>
        <text x="300" y="112" className="svg-label" textAnchor="middle" fill="#ff6b7a">
          CÁTODO (−)
        </text>
        <path d="M280 120 V 150" stroke="#ff6b7a" strokeWidth="2" strokeDasharray="4 4" />

        {/* Sentido da corrente */}
        <path d="M60 210 H 150" stroke="#3ee0ff" strokeWidth="4" strokeLinecap="round" />
        <path d="M150 210 l -14 -8 v 16 z" fill="#3ee0ff" />
        <text x="100" y="196" className="svg-label" textAnchor="middle">
          CORRENTE
        </text>
      </svg>

      <p className="muted" style={{ marginTop: 12 }}>
        A perna mais longa é o <strong>ânodo</strong> e vai para o lado positivo. A perna curta é o{' '}
        <strong>cátodo</strong> e vai para o GND. Do lado do cátodo, a base do LED tem um{' '}
        <strong>chanfro</strong> — uma parte reta — que serve de pista quando as pernas já foram
        cortadas.
      </p>
    </Panel>
  )
}

/** Três circuitos possíveis para o desafio do resistor (§18). */
function CircuitOption({ label, chain }: { label: string; chain: string[] }) {
  return (
    <div className="comp" style={{ textAlign: 'left' }}>
      <div className="mcard__code">CIRCUITO {label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-md)', marginTop: 6 }}>
        {chain.join('  →  ')}
      </div>
    </div>
  )
}

export function M3Led() {
  const steps: StepDef[] = [
    {
      id: 'intro',
      render: (api) => (
        <DialogueBox
          lines={[
            'A energia já circula pela estação. Excelente.',
            'Mas o componente que vamos usar como sinalizador é delicado: o LED.',
            'Duas coisas podem estragá-lo: ligá-lo ao contrário ou deixar corrente demais passar por ele.',
          ]}
          onContinue={api.next}
          continueLabel="Examinar o LED"
        />
      ),
    },
    {
      id: 'q-polaridade',
      render: (api) => (
        <MultipleChoice
          visual={<LedAnatomy />}
          intro="Desafio 1 de 2 — polaridade"
          question="O LED possui direção? Importa de que lado cada perna é ligada?"
          choices={[
            {
              id: 'sim',
              icon: '↔️',
              label: 'Sim, ele tem lado certo',
              note: 'Ligado ao contrário, não acende.',
            },
            {
              id: 'nao',
              icon: '🔁',
              label: 'Não, tanto faz',
              note: 'Funciona nos dois sentidos, como um fio.',
            },
          ]}
          correctId="sim"
          successText="Isso mesmo. O LED só deixa a corrente passar em um sentido."
          concept={
            <>
              <p>
                O LED é um componente <strong>polarizado</strong>. Isso significa que precisamos
                observar a direção em que ele está conectado.
              </p>
              <p>
                Se estiver invertido, ele simplesmente não acende — e a boa notícia é que, num
                circuito com resistor, isso não o queima. Na montagem real: se o LED não acender,
                vire-o.
              </p>
            </>
          }
          wrongMessages={[
            'Compare com o fio: o fio conduz nos dois sentidos. O LED se comporta assim também?',
            'Repare que as duas pernas do LED têm tamanhos diferentes. Por que o fabricante faria isso?',
          ]}
          hints={['As pernas têm tamanhos diferentes justamente para você saber qual é qual.']}
          onCorrect={api.awardStep}
          onSolved={api.solve}
        />
      ),
    },
    {
      id: 'q-resistor',
      render: (api) => (
        <MultipleChoice
          visual={
            <Panel title="📐 Três montagens possíveis">
              <div className="comp-grid">
                <CircuitOption label="A" chain={['🔋 Fonte', '💡 LED']} />
                <CircuitOption label="B" chain={['🔋 Fonte', '🧱 Resistor', '💡 LED']} />
                <CircuitOption label="C" chain={['🔋 Fonte', '🧱 Resistor']} />
              </div>
            </Panel>
          }
          intro="Desafio 2 de 2 — proteção"
          question="Qual circuito representa uma ligação básica correta do LED?"
          choices={[
            { id: 'a', label: 'Circuito A', note: 'Fonte direto no LED.' },
            { id: 'b', label: 'Circuito B', note: 'Fonte → resistor → LED.' },
            { id: 'c', label: 'Circuito C', note: 'Fonte → resistor, sem LED.' },
          ]}
          correctId="b"
          successText="O resistor entra antes do LED e limita a corrente que chega até ele."
          concept={
            <>
              <p>
                No <strong>A</strong>, o LED recebe corrente demais e queima. No <strong>C</strong>,
                não há LED nenhum — nada acende. O <strong>B</strong> é a montagem clássica.
              </p>
              <p>
                Na prática, um resistor de <strong>220Ω</strong> (as faixas vermelho-vermelho-marrom)
                resolve para praticamente qualquer LED comum ligado ao Arduino.
              </p>
            </>
          }
          wrongMessages={[
            'Pense no que acontece com o LED quando nada limita a corrente que chega nele.',
            'Precisamos de duas coisas no caminho: algo que emita luz e algo que segure a corrente.',
          ]}
          hints={[
            'O circuito correto precisa conter o LED — senão não existe sinalizador.',
            'E antes do LED precisa haver alguma coisa protegendo-o.',
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
        title: 'LED em segurança',
        text: 'Polaridade entendida e resistor no lugar certo. Falta quem dê as ordens: o cérebro da estação.',
      }}
    />
  )
}
