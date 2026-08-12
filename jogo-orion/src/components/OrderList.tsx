import { useState, type ReactNode } from 'react'
import { Panel } from './Panel'
import { Button } from './Button'
import { Feedback } from './Feedback'
import { HintSystem } from './HintSystem'
import { playSound } from '../game/sound'
import { XP } from '../game/xp'

export type OrderItem = {
  id: string
  text: string
}

type Props = {
  question: string
  intro?: string
  /** Itens já embaralhados na ordem em que devem aparecer no começo. */
  items: OrderItem[]
  /** Ordem correta, por id. */
  correctOrder: string[]
  successText: ReactNode
  /** Revelado após acertar (ex.: o código equivalente). */
  reveal?: ReactNode
  hints?: string[]
  /** Disparado quando a sequência é verificada e está correta. */
  onCorrect?: () => void
  xpAmount?: number
  onSolved: () => void
}

/** Ordenação por setas (§22). Setas em vez de arrastar: funciona com teclado. */
export function OrderList({
  question,
  intro,
  items,
  correctOrder,
  successText,
  reveal,
  hints = [],
  onCorrect,
  xpAmount = XP.CHALLENGE,
  onSolved,
}: Props) {
  const [order, setOrder] = useState(items)
  const [checked, setChecked] = useState(false)
  const [solved, setSolved] = useState(false)
  const [attempts, setAttempts] = useState(0)

  function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= order.length) return
    const copy = [...order]
    ;[copy[index], copy[target]] = [copy[target], copy[index]]
    setOrder(copy)
    setChecked(false)
  }

  function check() {
    const ok = order.every((item, index) => item.id === correctOrder[index])
    setChecked(true)
    if (ok) {
      playSound('correct')
      setSolved(true)
      onCorrect?.()
    } else {
      playSound('wrong')
      setAttempts((n) => n + 1)
    }
  }

  function rowClass(index: number) {
    if (!checked) return 'order__row'
    return `order__row ${order[index].id === correctOrder[index] ? 'order__row--ok' : 'order__row--bad'}`
  }

  return (
    <Panel hud>
      {intro ? <p className="question__hint">{intro}</p> : null}
      <h3 className="question">{question}</h3>
      <p className="question__hint">Use as setas para reorganizar os passos.</p>

      <ol className="order">
        {order.map((item, index) => (
          <li className={rowClass(index)} key={item.id}>
            <span className="order__num">{index + 1}</span>
            <span className="order__text">{item.text}</span>
            {!solved ? (
              <span className="order__moves">
                <button
                  type="button"
                  className="order__btn"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label={`Mover "${item.text}" para cima`}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="order__btn"
                  onClick={() => move(index, 1)}
                  disabled={index === order.length - 1}
                  aria-label={`Mover "${item.text}" para baixo`}
                >
                  ↓
                </button>
              </span>
            ) : (
              <span aria-hidden="true">✔</span>
            )}
          </li>
        ))}
      </ol>

      {!solved ? (
        <div className="btn-row" style={{ marginTop: 24 }}>
          <Button variant="primary" onClick={check}>
            Verificar sequência
          </Button>
        </div>
      ) : null}

      {checked && !solved ? (
        <Feedback kind="wrong">
          {attempts >= 2
            ? 'Pense no que o LED faz: ele acende, fica um tempo aceso, apaga e fica um tempo apagado.'
            : 'A ordem ainda não está certa. Os passos marcados em vermelho estão fora do lugar.'}
        </Feedback>
      ) : null}

      {solved ? (
        <>
          <Feedback kind="correct" title="Sequência correta!">
            {successText}
            <div className="feedback__xp">+{xpAmount} XP</div>
          </Feedback>
          {reveal}
          <div className="btn-row" style={{ marginTop: 24 }}>
            <Button variant="success" onClick={() => onSolved()}>
              Continuar →
            </Button>
          </div>
        </>
      ) : null}

      {!solved ? <HintSystem hints={hints} autoReveal={attempts >= 2 ? 1 : 0} /> : null}
    </Panel>
  )
}
