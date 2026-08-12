import { useState, type ReactNode } from 'react'
import { Panel } from './Panel'
import { Button } from './Button'
import { Feedback } from './Feedback'
import { playSound } from '../game/sound'
import { XP } from '../game/xp'

export type Pair = {
  id: string
  /** Lado esquerdo: a ação em português. */
  left: string
  /** Lado direito: o comando do Arduino. */
  right: string
}

type Props = {
  question: string
  intro?: string
  pairs: Pair[]
  leftTitle?: string
  rightTitle?: string
  successText: ReactNode
  /** Disparado quando a última associação é feita. */
  onCorrect?: () => void
  xpAmount?: number
  onSolved: () => void
}

/** Embaralha de forma estável por render inicial (não remexe a cada clique). */
function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/** Associação por cliques (§21): escolha uma ação, depois o comando dela. */
export function MatchPairs({
  question,
  intro,
  pairs,
  leftTitle = 'Ação',
  rightTitle = 'Comando do Arduino',
  successText,
  onCorrect,
  xpAmount = XP.CHALLENGE,
  onSolved,
}: Props) {
  const [rightOrder] = useState(() => shuffle(pairs))
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [matched, setMatched] = useState<string[]>([])
  const [shakeId, setShakeId] = useState<string | null>(null)
  const [errors, setErrors] = useState(0)

  const solved = matched.length === pairs.length

  function pickLeft(id: string) {
    if (matched.includes(id)) return
    setSelectedLeft(selectedLeft === id ? null : id)
    setShakeId(null)
  }

  function pickRight(id: string) {
    if (matched.includes(id) || !selectedLeft) return

    if (selectedLeft === id) {
      playSound('correct')
      const next = [...matched, id]
      setMatched(next)
      setSelectedLeft(null)
      setShakeId(null)
      if (next.length === pairs.length) onCorrect?.()
      return
    }

    playSound('wrong')
    setErrors((n) => n + 1)
    setShakeId(id)
    window.setTimeout(() => setShakeId(null), 400)
  }

  return (
    <Panel hud>
      {intro ? <p className="question__hint">{intro}</p> : null}
      <h3 className="question">{question}</h3>
      <p className="question__hint">
        Clique em uma ação à esquerda e depois no comando correspondente à direita.
      </p>

      <div className="match">
        <div>
          <div className="match__col-title">{leftTitle}</div>
          <div className="match__items">
            {pairs.map((pair) => {
              const isMatched = matched.includes(pair.id)
              return (
                <button
                  key={pair.id}
                  type="button"
                  className={[
                    'match__item',
                    selectedLeft === pair.id ? 'match__item--selected' : '',
                    isMatched ? 'match__item--paired' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => pickLeft(pair.id)}
                  disabled={isMatched}
                  aria-pressed={selectedLeft === pair.id}
                >
                  {pair.left}
                  {isMatched ? <span className="match__pairmark">✔</span> : null}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <div className="match__col-title">{rightTitle}</div>
          <div className="match__items">
            {rightOrder.map((pair) => {
              const isMatched = matched.includes(pair.id)
              return (
                <button
                  key={pair.id}
                  type="button"
                  className={[
                    'match__item',
                    'match__item--code',
                    isMatched ? 'match__item--paired' : '',
                    shakeId === pair.id ? 'match__item--shake' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => pickRight(pair.id)}
                  disabled={isMatched}
                >
                  {pair.right}
                  {isMatched ? <span className="match__pairmark">✔</span> : null}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <p className="tiny" style={{ marginTop: 16 }}>
        {matched.length} de {pairs.length} associações corretas.
      </p>

      {!solved && errors > 0 ? (
        <Feedback kind="wrong" title="Essa dupla não combina.">
          Leia o nome do comando em voz alta: ele costuma dizer o que faz.
        </Feedback>
      ) : null}

      {solved ? (
        <>
          <Feedback kind="correct" title="Tradução completa!">
            {successText}
            <div className="feedback__xp">+{xpAmount} XP</div>
          </Feedback>
          <div className="btn-row" style={{ marginTop: 24 }}>
            <Button variant="success" onClick={() => onSolved()}>
              Continuar →
            </Button>
          </div>
        </>
      ) : null}
    </Panel>
  )
}
