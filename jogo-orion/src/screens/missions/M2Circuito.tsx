import { useEffect, useState } from 'react'
import { getMission } from '../../game/missions'
import { useGame } from '../../game/GameContext'
import { XP } from '../../game/xp'
import { MissionRunner, type StepDef, type StepApi } from '../../components/MissionRunner'
import { DialogueBox } from '../../components/DialogueBox'
import { MultipleChoice } from '../../components/MultipleChoice'
import { CircuitBoard } from '../../components/CircuitBoard'
import { Panel } from '../../components/Panel'
import { Button } from '../../components/Button'
import { Feedback, ConceptBox } from '../../components/Feedback'
import { HintSystem } from '../../components/HintSystem'

const mission = getMission('circuito')

/** Desafio interativo: fechar a chave e ver a corrente circular (§16). */
function SwitchChallenge({ api }: { api: StepApi }) {
  const { unlockAchievement } = useGame()
  const [closed, setClosed] = useState(false)
  const [everClosed, setEverClosed] = useState(false)

  useEffect(() => {
    // Só na primeira vez que o LED acende: o aluno pode abrir e fechar à vontade.
    if (!closed || everClosed) return
    setEverClosed(true)
    unlockAchievement('primeira-luz')
    // Credita no instante em que o LED acende, não no clique de continuar.
    api.awardStep(XP.CHALLENGE, 'Circuito fechado')
  }, [closed, everClosed, unlockAchievement, api])

  return (
    <Panel hud>
      <h3 className="question">Feche o caminho da energia e acenda o LED.</h3>
      <p className="question__hint">
        Clique na chave do circuito. Observe o que acontece com a corrente e com o LED.
      </p>

      <CircuitBoard closed={closed} onToggle={() => setClosed((value) => !value)} />

      <div className="btn-row" style={{ marginTop: 24, justifyContent: 'center' }}>
        <Button onClick={() => setClosed((value) => !value)}>
          {closed ? '⏻ Abrir a chave' : '⏻ Fechar a chave'}
        </Button>
      </div>

      {everClosed ? (
        <>
          <Feedback kind="correct" title="💡 Primeira luz!">
            Com a chave fechada, a energia sai da fonte, percorre todo o caminho e volta. O LED
            acende.
            <div className="feedback__xp">+{XP.CHALLENGE} XP</div>
          </Feedback>
          <ConceptBox>
            <p>
              Um <strong>circuito fechado</strong> é um caminho completo: a corrente sai, passa
              pelos componentes e retorna à fonte. Se qualquer ponto do caminho for interrompido, o
              circuito fica <strong>aberto</strong> e nada funciona.
            </p>
            <p>
              Abra e feche a chave algumas vezes. Essa é a coisa mais importante da eletricidade
              básica: <strong>o caminho precisa estar completo</strong>.
            </p>
          </ConceptBox>
          <div className="btn-row" style={{ marginTop: 24 }}>
            <Button variant="success" onClick={() => api.solve(XP.CHALLENGE, 'Circuito fechado')}>
              Continuar →
            </Button>
          </div>
        </>
      ) : (
        <HintSystem
          hints={['A chave é a peça inclinada no fio de cima. Clique nela para encostar as pontas.']}
        />
      )}
    </Panel>
  )
}

export function M2Circuito() {
  const steps: StepDef[] = [
    {
      id: 'intro',
      render: (api) => (
        <DialogueBox
          lines={[
            'Os componentes foram identificados. Bom trabalho.',
            'Agora precisamos criar um caminho completo para a energia.',
            'Um circuito só funciona quando esse caminho forma um ciclo fechado — sai da fonte e volta para ela.',
          ]}
          onContinue={api.next}
          continueLabel="Ir para o painel elétrico"
        />
      ),
    },
    {
      id: 'switch',
      render: (api) => <SwitchChallenge api={api} />,
    },
    {
      id: 'q-fechado',
      render: (api) => (
        <MultipleChoice
          visual={<CircuitBoard closed sourceLabel="BATERIA" />}
          intro="Leitura de diagnóstico"
          question="Este circuito está fechado?"
          choices={[
            { id: 'sim', icon: '✅', label: 'Sim', note: 'O caminho vai e volta sem interrupção.' },
            { id: 'nao', icon: '🚫', label: 'Não', note: 'Existe uma interrupção no caminho.' },
          ]}
          correctId="sim"
          successText="Isso. O caminho é contínuo: a energia sai da bateria, passa pelo LED e volta."
          concept={
            <>
              Repare que o fio de baixo também faz parte do circuito. Esse{' '}
              <strong>caminho de volta</strong> é tão necessário quanto o de ida — no Arduino, ele
              tem um nome: <strong>GND</strong>.
            </>
          }
          wrongMessages={[
            'Olhe de novo: siga o caminho com o dedo, da bateria até o LED e de volta. Ele se interrompe em algum ponto?',
          ]}
          onCorrect={api.awardStep}
          onSolved={api.solve}
        />
      ),
    },
    {
      id: 'q-aberto',
      render: (api) => (
        <MultipleChoice
          visual={<CircuitBoard closed={false} sourceLabel="BATERIA" />}
          intro="Nova leitura"
          question="A chave foi aberta. O que acontece quando o caminho é interrompido?"
          choices={[
            {
              id: 'nada',
              icon: '⚫',
              label: 'O circuito não funciona',
              note: 'A corrente não circula e o LED apaga.',
            },
            {
              id: 'mais',
              icon: '🔆',
              label: 'O LED acende mais forte',
              note: 'A energia se acumula no LED.',
            },
            {
              id: 'igual',
              icon: '➖',
              label: 'Nada muda',
              note: 'O LED continua aceso normalmente.',
            },
          ]}
          correctId="nada"
          stacked
          successText="Exato. Sem caminho completo, não há corrente — e sem corrente, nada acende."
          concept={
            <>
              Um fio solto, um componente mal encaixado ou uma perna do LED fora do lugar produzem
              exatamente esse resultado. Quando algo não funcionar na montagem real, a primeira
              pergunta é sempre: <strong>o caminho está fechado?</strong>
            </>
          }
          wrongMessages={[
            'Volte ao circuito interativo do passo anterior: o que acontecia com o LED quando a chave abria?',
            'Sem caminho de volta, a corrente simplesmente não circula.',
          ]}
          hints={['Energia parada não acende nada. Ela precisa circular.']}
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
        title: 'Fluxo elétrico restabelecido',
        text: 'Você entendeu a diferença entre circuito aberto e fechado. Agora vamos cuidar do componente mais delicado da estação: o LED.',
      }}
    />
  )
}
