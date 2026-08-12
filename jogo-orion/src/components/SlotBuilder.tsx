import { Fragment, useState, type DragEvent, type ReactNode } from 'react'
import { Panel } from './Panel'
import { Button } from './Button'
import { Feedback } from './Feedback'
import { HintSystem } from './HintSystem'
import { playSound } from '../game/sound'
import { XP } from '../game/xp'

export type Piece = {
  id: string
  icon: string
  label: string
}

export type Slot = {
  /** Id da peça esperada neste encaixe. */
  expects: string
  /** Texto exibido enquanto o encaixe está vazio. */
  placeholder: string
}

type Props = {
  question: string
  intro?: string
  /** Bloco fixo no topo da cadeia (ex.: a placa). */
  topFixed: ReactNode
  /** Bloco fixo no fim da cadeia. */
  bottomFixed: ReactNode
  slots: Slot[]
  /** Peças disponíveis — inclua distratores. */
  pieces: Piece[]
  successText: ReactNode
  hints?: string[]
  /** Disparado quando a montagem é verificada e está correta. */
  onCorrect?: () => void
  xpAmount?: number
  onSolved: () => void
}

/**
 * Montagem por encaixes (§23, §24).
 *
 * Não simula eletricidade — é uma atividade de montagem: colocar os
 * componentes na ordem certa entre o pino e o GND.
 * Funciona por clique (acessível, funciona no celular) e por arrastar.
 */
export function SlotBuilder({
  question,
  intro,
  topFixed,
  bottomFixed,
  slots,
  pieces,
  successText,
  hints = [],
  onCorrect,
  xpAmount = XP.CHALLENGE,
  onSolved,
}: Props) {
  const [filled, setFilled] = useState<(string | null)[]>(() => slots.map(() => null))
  const [activeSlot, setActiveSlot] = useState<number | null>(0)
  const [checked, setChecked] = useState(false)
  const [solved, setSolved] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const pieceById = (id: string | null) => pieces.find((piece) => piece.id === id) ?? null
  const complete = filled.every(Boolean)

  function place(pieceId: string, slotIndex?: number) {
    if (solved) return
    const target = slotIndex ?? activeSlot ?? filled.findIndex((value) => value === null)
    if (target === -1 || target === undefined) return

    // Uma peça só pode ocupar um encaixe: remove de onde estava.
    const next: (string | null)[] = filled.map((value) => (value === pieceId ? null : value))
    next[target] = pieceId

    setFilled(next)
    setChecked(false)
    playSound('click')

    const nextEmpty = next.findIndex((value) => value === null)
    setActiveSlot(nextEmpty === -1 ? null : nextEmpty)
  }

  function clearSlot(index: number) {
    if (solved) return
    setFilled((current) => current.map((value, i) => (i === index ? null : value)))
    setActiveSlot(index)
    setChecked(false)
  }

  function check() {
    const ok = filled.every((value, index) => value === slots[index].expects)
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

  function slotClass(index: number) {
    const classes = ['build__slot']
    if (filled[index]) classes.push('build__slot--filled')
    if (activeSlot === index && !solved) classes.push('build__slot--active')
    if (checked) {
      classes.push(filled[index] === slots[index].expects ? 'build__slot--ok' : 'build__slot--bad')
    }
    return classes.join(' ')
  }

  function onDrop(event: DragEvent<HTMLButtonElement>, index: number) {
    event.preventDefault()
    const pieceId = event.dataTransfer.getData('text/plain')
    if (pieceId) place(pieceId, index)
  }

  return (
    <Panel hud>
      {intro ? <p className="question__hint">{intro}</p> : null}
      <h3 className="question">{question}</h3>
      <p className="question__hint">
        Clique em um encaixe e depois na peça — ou arraste a peça até ele. Para tirar uma peça,
        clique no encaixe preenchido.
      </p>

      <div className="build">
        <div className="build__chain">
          <div className="build__fixed">{topFixed}</div>
          <div className="build__arrow" aria-hidden="true">
            ▼
          </div>

          {slots.map((slot, index) => (
            <Fragment key={index}>
              <button
                type="button"
                className={slotClass(index)}
                onClick={() => (filled[index] ? clearSlot(index) : setActiveSlot(index))}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => onDrop(event, index)}
                aria-label={
                  filled[index]
                    ? `Encaixe ${index + 1}: ${pieceById(filled[index])?.label}. Clique para remover.`
                    : `Encaixe ${index + 1} vazio: ${slot.placeholder}`
                }
              >
                {filled[index] ? (
                  <>
                    <span aria-hidden="true">{pieceById(filled[index])?.icon}</span>
                    {pieceById(filled[index])?.label}
                    {checked ? (
                      <span aria-hidden="true">
                        {filled[index] === slot.expects ? ' ✔' : ' ✕'}
                      </span>
                    ) : null}
                  </>
                ) : (
                  <>[ {slot.placeholder} ]</>
                )}
              </button>
              <div className="build__arrow" aria-hidden="true">
                ▼
              </div>
            </Fragment>
          ))}

          <div className="build__fixed">{bottomFixed}</div>
        </div>

        <div>
          <div className="match__col-title">Peças disponíveis</div>
          <div className="build__tray">
            {pieces.map((piece) => {
              const used = filled.includes(piece.id)
              return (
                <button
                  key={piece.id}
                  type="button"
                  className="tray-item"
                  draggable={!solved && !used}
                  onDragStart={(event) => event.dataTransfer.setData('text/plain', piece.id)}
                  onClick={() => place(piece.id)}
                  disabled={used || solved}
                >
                  <span className="tray-item__icon" aria-hidden="true">
                    {piece.icon}
                  </span>
                  {piece.label}
                </button>
              )
            })}
          </div>
          <p className="tiny" style={{ marginTop: 12 }}>
            Nem toda peça da bancada entra nesta montagem.
          </p>
        </div>
      </div>

      {!solved ? (
        <div className="btn-row" style={{ marginTop: 24 }}>
          <Button variant="primary" onClick={check} disabled={!complete}>
            Verificar montagem
          </Button>
          {!complete ? <span className="tiny">Preencha todos os encaixes para verificar.</span> : null}
        </div>
      ) : null}

      {checked && !solved ? (
        <Feedback kind="wrong" title="A montagem ainda não fecha.">
          Os encaixes marcados com ✕ estão com a peça errada. Lembre: a corrente sai do pino,
          passa pelos componentes e precisa voltar para o GND.
        </Feedback>
      ) : null}

      {solved ? (
        <>
          <Feedback kind="correct" title="🔧 Circuito restaurado">
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

      {!solved ? <HintSystem hints={hints} autoReveal={attempts >= 2 ? 1 : 0} /> : null}
    </Panel>
  )
}
