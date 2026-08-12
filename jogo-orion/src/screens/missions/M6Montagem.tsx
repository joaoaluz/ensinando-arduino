import { getMission } from '../../game/missions'
import { useGame } from '../../game/GameContext'
import { XP } from '../../game/xp'
import { MissionRunner, type StepDef } from '../../components/MissionRunner'
import { DialogueBox } from '../../components/DialogueBox'
import { SlotBuilder } from '../../components/SlotBuilder'
import { Panel } from '../../components/Panel'
import { Button } from '../../components/Button'

const mission = getMission('montagem')

/** Lista de materiais da montagem real — o jogo existe para levar a isto (§41). */
function BillOfMaterials() {
  return (
    <Panel title="🧰 O que você vai precisar na bancada de verdade">
      <div className="comp-grid">
        {[
          { icon: '🤖', name: 'Arduino Uno', role: 'Com o cabo USB.' },
          { icon: '🍞', name: 'Protoboard', role: 'Para encaixar sem solda.' },
          { icon: '💡', name: 'LED', role: 'Qualquer cor.' },
          { icon: '🧱', name: 'Resistor 220Ω', role: 'Vermelho, vermelho, marrom.' },
          { icon: '🔌', name: '2 jumpers', role: 'Fios macho-macho.' },
        ].map((item) => (
          <div className="comp" key={item.name}>
            <span className="comp__icon" aria-hidden="true">
              {item.icon}
            </span>
            <div className="comp__name">{item.name}</div>
            <div className="comp__role">{item.role}</div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

export function M6Montagem() {
  const { unlockAchievement } = useGame()

  const steps: StepDef[] = [
    {
      id: 'intro',
      render: (api) => (
        <div className="stack">
          <DialogueBox
            lines={[
              'Bem-vindo à oficina, engenheiro.',
              'Chegou a hora de montar o sinalizador de emergência.',
              'A corrente vai sair de um pino do Arduino, atravessar os componentes e voltar para a placa. Se esse caminho não se fechar, nada acende.',
            ]}
            onContinue={api.next}
            continueLabel="Ir para a bancada"
          />
          <BillOfMaterials />
        </div>
      ),
    },
    {
      id: 'montar',
      render: (api) => (
        <SlotBuilder
          intro="Montagem do sinalizador"
          question="Monte o caminho da corrente, do pino de saída até o retorno."
          topFixed={<>🤖 ARDUINO — saída</>}
          bottomFixed={<>🤖 ARDUINO — retorno</>}
          slots={[
            { expects: 'pino13', placeholder: 'de onde sai a corrente?' },
            { expects: 'resistor', placeholder: 'o que protege o LED?' },
            { expects: 'led', placeholder: 'o que emite a luz?' },
            { expects: 'gnd', placeholder: 'por onde a corrente volta?' },
          ]}
          pieces={[
            { id: 'pino13', icon: '📍', label: 'Pino 13 (digital)' },
            { id: 'resistor', icon: '🧱', label: 'Resistor 220Ω' },
            { id: 'led', icon: '💡', label: 'LED' },
            { id: 'gnd', icon: '🔻', label: 'GND' },
            { id: 'v5', icon: '⚡', label: '5V' },
            { id: 'botao', icon: '🔘', label: 'Botão' },
          ]}
          hints={[
            'Comece pelo pino que o programa vai controlar. Ele é digital e numerado.',
            'A ordem é: pino de saída → resistor → LED → GND. O 5V e o botão não entram nesta montagem.',
          ]}
          successText={
            <>
              Todos os componentes estão conectados. A corrente sai pelo pino 13, é limitada pelo
              resistor, acende o LED e volta pelo GND — um caminho fechado.
            </>
          }
          onCorrect={() => {
            unlockAchievement('eletricista')
            api.awardStep(XP.CHALLENGE, 'Circuito montado')
          }}
          onSolved={() => api.solve(XP.CHALLENGE, 'Circuito montado')}
        />
      ),
    },
    {
      id: 'real',
      render: (api) => (
        <Panel hud>
          <h3 className="question">🔧 Circuito restaurado</h3>
          <p className="muted" style={{ marginBottom: 24 }}>
            Guarde esta sequência — é exatamente ela que você vai reproduzir com as peças de verdade.
          </p>

          <div className="callout callout--cyan">
            <h3>Como fica na protoboard</h3>
            <ol>
              <li>Um jumper sai do pino 13 do Arduino e vai para uma linha da protoboard.</li>
              <li>Nessa mesma linha, encaixe uma perna do resistor.</li>
              <li>A outra perna do resistor vai para a linha onde está a perna longa do LED.</li>
              <li>A perna curta do LED vai para outra linha.</li>
              <li>Dessa última linha, um jumper volta para o GND do Arduino.</li>
            </ol>
            <p className="tiny" style={{ marginTop: 12 }}>
              Se o LED não acender depois de tudo pronto, a primeira coisa a tentar é inverter as
              pernas dele.
            </p>
          </div>

          <div className="btn-row" style={{ marginTop: 24 }}>
            <Button variant="success" onClick={() => api.next()}>
              Anotado →
            </Button>
          </div>
        </Panel>
      ),
    },
  ]

  return (
    <MissionRunner
      mission={mission}
      steps={steps}
      completion={{
        title: 'Sinalizador montado',
        text: 'O hardware está pronto. Só falta o programa que vai dizer ao Arduino quando acender e quando apagar.',
      }}
    />
  )
}
