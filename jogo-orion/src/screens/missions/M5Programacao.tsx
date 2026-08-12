import { getMission } from '../../game/missions'
import { XP } from '../../game/xp'
import { MissionRunner, type StepDef } from '../../components/MissionRunner'
import { DialogueBox } from '../../components/DialogueBox'
import { MatchPairs } from '../../components/MatchPairs'
import { OrderList } from '../../components/OrderList'
import { CodeBlock } from '../../components/CodeBlock'
import { ConceptBox } from '../../components/Feedback'

const mission = getMission('programacao')

const BLINK_SNIPPET = `digitalWrite(13, HIGH);
delay(1000);
digitalWrite(13, LOW);
delay(1000);
`

export function M5Programacao() {
  const steps: StepDef[] = [
    {
      id: 'intro',
      render: (api) => (
        <DialogueBox
          lines={[
            'O Arduino não entende português, engenheiro.',
            'Ele entende um punhado de palavras muito específicas — e são poucas mesmo.',
            'Vamos traduzir o que queremos fazer para a língua dele.',
          ]}
          onContinue={api.next}
          continueLabel="Abrir o tradutor"
        />
      ),
    },
    {
      id: 'traduzir',
      render: (api) => (
        <MatchPairs
          intro="Desafio 1 de 2 — tradução"
          question="Relacione cada ação ao comando do Arduino."
          pairs={[
            { id: 'ligar', left: '🔆 LIGAR', right: 'HIGH' },
            { id: 'desligar', left: '🌑 DESLIGAR', right: 'LOW' },
            { id: 'esperar', left: '⏳ ESPERAR', right: 'delay()' },
            { id: 'configurar', left: '⚙️ CONFIGURAR', right: 'pinMode()' },
          ]}
          successText={
            <>
              Essas quatro palavras são praticamente todo o vocabulário de que você precisa para
              fazer um LED piscar.
            </>
          }
          onCorrect={() => api.awardStep(XP.CHALLENGE, 'Tradução dos comandos')}
          onSolved={() => api.solve(XP.CHALLENGE, 'Tradução dos comandos')}
        />
      ),
    },
    {
      id: 'ordenar',
      render: (api) => (
        <OrderList
          intro="Desafio 2 de 2 — sequência"
          question="Em que ordem o sinalizador precisa executar estas ações para piscar?"
          items={[
            { id: 'esperar1', text: '⏳ ESPERAR' },
            { id: 'desligar', text: '🌑 DESLIGAR' },
            { id: 'ligar', text: '🔆 LIGAR' },
            { id: 'esperar2', text: '⏳ ESPERAR' },
          ]}
          correctOrder={['ligar', 'esperar1', 'desligar', 'esperar2']}
          hints={[
            'Comece pelo estado que você quer ver primeiro: o sinalizador aceso.',
            'Depois de cada mudança de estado, é preciso esperar — senão ninguém enxerga a mudança.',
          ]}
          successText="Ligar, esperar, desligar, esperar. E então tudo se repete."
          reveal={
            <div style={{ marginTop: 20 }}>
              <CodeBlock code={BLINK_SNIPPET} label="A mesma sequência, na língua do Arduino" />
              <ConceptBox tag="Você acabou de descrever um pisca-pisca">
                <p>
                  Cada linha termina com <strong>ponto e vírgula</strong> — é assim que o Arduino
                  sabe onde uma instrução acaba.
                </p>
                <p>
                  E <code>delay(1000)</code> significa esperar <strong>1000 milissegundos</strong>,
                  ou seja, 1 segundo.
                </p>
              </ConceptBox>
            </div>
          }
          onCorrect={() => api.awardStep(XP.CHALLENGE, 'Sequência do pisca-pisca')}
          onSolved={() => api.solve(XP.CHALLENGE, 'Sequência do pisca-pisca')}
        />
      ),
    },
  ]

  return (
    <MissionRunner
      mission={mission}
      steps={steps}
      completion={{
        title: 'Tradutor calibrado',
        text: 'Você já sabe o que dizer e em que ordem. Antes de escrever o programa inteiro, vamos montar o circuito na oficina.',
      }}
    />
  )
}
