import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../game/GameContext'
import { nextMission } from '../game/missions'
import { XP } from '../game/xp'
import type { Mission } from '../game/types'
import { Panel } from './Panel'
import { Button } from './Button'
import { ProgressIndicator } from './ProgressIndicator'

/** API entregue a cada passo da missão. */
export type StepApi = {
  /** Paga XP (uma única vez, para sempre) e avança para o próximo passo. */
  solve: (xpAmount?: number, label?: string) => void
  /**
   * Paga o XP do passo atual SEM avançar. Serve para creditar no instante do
   * acerto, deixando o aluno ler o feedback antes de seguir. Como `award` é
   * idempotente por chave, chamar `solve()` depois não paga de novo.
   */
  awardStep: (xpAmount?: number, label?: string) => void
  /** Paga XP sem avançar — para passos com vários prêmios. */
  award: (suffix: string, amount: number, label?: string) => void
  /** Avança sem pagar XP (usado pelos diálogos). */
  next: () => void
}

export type StepDef = {
  id: string
  render: (api: StepApi) => ReactNode
}

type Props = {
  mission: Mission
  steps: StepDef[]
  /** Texto da tela de conclusão da missão. */
  completion: { title: string; text: ReactNode; extra?: ReactNode }
}

/**
 * Casca de uma missão: narrativa → desafios → feedback → XP → conclusão (§42).
 *
 * As missões declaram apenas a LISTA DE PASSOS; toda a mecânica de avanço,
 * persistência, XP e desbloqueio vive aqui. É isso que torna barato criar
 * uma missão nova.
 */
export function MissionRunner({ mission, steps, completion }: Props) {
  const game = useGame()
  const navigate = useNavigate()
  const bodyRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)

  // Retoma no primeiro passo ainda não concluído (progresso sobrevive ao reload).
  const [index, setIndex] = useState(() => {
    const done = game.state.missionProgress[mission.id] ?? []
    const firstPending = steps.findIndex((step) => !done.includes(step.id))
    return firstPending === -1 ? steps.length : firstPending
  })

  const finished = index >= steps.length

  useEffect(() => {
    if (finished) {
      game.completeMission(mission.id)
      game.award(`${mission.id}:mission`, XP.CHALLENGE, `Missão ${mission.name} concluída`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished, mission.id])

  // Rola até o topo do conteúdo ao trocar de passo — no projetor, o aluno
  // precisa ver o começo do desafio novo, não o fim do anterior.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    bodyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [index])

  const step = steps[index]

  const api = useMemo<StepApi>(() => {
    function advance(stepId: string) {
      game.completeStep(mission.id, stepId)
      setIndex((current) => current + 1)
    }
    return {
      solve: (xpAmount = XP.CORRECT, label) => {
        if (!step) return
        game.award(`${mission.id}:${step.id}`, xpAmount, label)
        advance(step.id)
      },
      awardStep: (xpAmount = XP.CORRECT, label) => {
        if (!step) return
        game.award(`${mission.id}:${step.id}`, xpAmount, label)
      },
      award: (suffix, amount, label) => {
        game.award(`${mission.id}:${suffix}`, amount, label)
      },
      next: () => {
        if (!step) return
        advance(step.id)
      },
    }
  }, [game, mission.id, step])

  const following = nextMission(mission.id)

  return (
    <main className="page">
      <div className="mission__head">
        <div className="mission__ident">
          <span className="mission__icon" aria-hidden="true">
            {mission.icon}
          </span>
          <div>
            <div className="mission__code">{mission.code}</div>
            <h1 className="mission__name">{mission.name}</h1>
          </div>
        </div>
        <ProgressIndicator total={steps.length} current={index} />
      </div>

      <div className="mission__body" ref={bodyRef} key={finished ? 'done' : step.id}>
        {finished ? (
          <Panel className="complete" hud>
            <span className="complete__icon" aria-hidden="true">
              ✅
            </span>
            <h2 className="complete__title">{completion.title}</h2>
            <p className="complete__text">{completion.text}</p>
            {completion.extra}

            <div className="btn-row" style={{ justifyContent: 'center', marginTop: 24 }}>
              {following ? (
                <Button variant="primary" onClick={() => navigate(following.path)}>
                  {following.icon} Ir para {following.name}
                </Button>
              ) : (
                <Button variant="primary" onClick={() => navigate('/vitoria')}>
                  🚨 Ativar o sinalizador
                </Button>
              )}
              <Button variant="ghost" onClick={() => navigate('/missao')}>
                Voltar ao mapa
              </Button>
              <Button variant="ghost" onClick={() => setIndex(0)}>
                ⟲ Refazer
              </Button>
            </div>
          </Panel>
        ) : (
          step.render(api)
        )}
      </div>
    </main>
  )
}
