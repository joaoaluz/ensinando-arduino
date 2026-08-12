import { useState, type ReactNode } from 'react'
import { Panel } from './Panel'
import { Button } from './Button'
import { Feedback, ConceptBox } from './Feedback'
import { HintSystem } from './HintSystem'
import { playSound } from '../game/sound'
import { XP } from '../game/xp'

export type Choice = {
  id: string
  label: string
  icon?: string
  /** Linha pequena de apoio embaixo do rótulo. */
  note?: string
  /** Renderiza o rótulo em fonte monoespaçada (alternativas em código). */
  mono?: boolean
}

type Props = {
  question: string
  /** Contexto curto acima das opções. */
  intro?: string
  /** Elemento visual acima da pergunta: circuito, código, placa... */
  visual?: ReactNode
  choices: Choice[]
  correctId: string
  /** Texto do feedback de acerto. */
  successText: ReactNode
  /** Conceito revelado após o acerto. */
  concept?: ReactNode
  /** Mensagens de erro progressivas (§43). A última se repete. */
  wrongMessages?: string[]
  hints?: string[]
  /** Uma coluna por opção (bom para textos longos). */
  stacked?: boolean
  /** Disparado no instante do acerto — use para creditar o XP na hora. */
  onCorrect?: () => void
  /** XP exibido no feedback de acerto. */
  xpAmount?: number
  onSolved: () => void
  continueLabel?: string
}

const DEFAULT_WRONG = [
  'Pense de novo no papel de cada peça dentro do circuito.',
  'Quase lá. Compare as opções restantes e elimine a que não faz sentido.',
]

export function MultipleChoice({
  question,
  intro,
  visual,
  choices,
  correctId,
  successText,
  concept,
  wrongMessages = DEFAULT_WRONG,
  hints = [],
  stacked = false,
  onCorrect,
  xpAmount = XP.CORRECT,
  onSolved,
  continueLabel = 'Continuar',
}: Props) {
  const [picked, setPicked] = useState<string | null>(null)
  const [solved, setSolved] = useState(false)
  const [wrongIds, setWrongIds] = useState<string[]>([])
  const [attempts, setAttempts] = useState(0)

  function choose(id: string) {
    if (solved) return

    if (id === correctId) {
      playSound('correct')
      setPicked(id)
      setSolved(true)
      onCorrect?.()
      return
    }

    playSound('wrong')
    setPicked(id)
    setAttempts((n) => n + 1)
    setWrongIds((list) => (list.includes(id) ? list : [...list, id]))
  }

  const wrongMessage =
    wrongMessages[Math.min(attempts - 1, wrongMessages.length - 1)] ?? DEFAULT_WRONG[0]

  return (
    <Panel hud>
      {intro ? <p className="question__hint">{intro}</p> : null}
      {visual ? <div style={{ marginBottom: 24 }}>{visual}</div> : null}
      <h3 className="question">{question}</h3>
      <p className="question__hint">Escolha uma opção. Errar faz parte — dá para tentar de novo.</p>

      <div
        className={`options ${stacked ? 'options--stacked' : ''}`}
        role="group"
        aria-label={question}
      >
        {choices.map((choice) => {
          const isCorrect = solved && choice.id === correctId
          const isWrong = wrongIds.includes(choice.id)
          const isDim = solved && choice.id !== correctId

          return (
            <button
              key={choice.id}
              type="button"
              className={[
                'option',
                isCorrect ? 'option--correct' : '',
                isWrong ? 'option--wrong' : '',
                isDim ? 'option--dim' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => choose(choice.id)}
              disabled={solved || isWrong}
              aria-pressed={picked === choice.id}
            >
              {choice.icon ? (
                <span className="option__icon" aria-hidden="true">
                  {choice.icon}
                </span>
              ) : null}
              <span className={`option__label ${choice.mono ? 'option__label--mono' : ''}`}>
                {choice.label}
                {choice.note ? <span className="option__note">{choice.note}</span> : null}
              </span>
              {isCorrect ? (
                <span className="option__mark" aria-label="resposta correta">
                  ✔
                </span>
              ) : null}
              {isWrong ? (
                <span className="option__mark" aria-label="resposta incorreta">
                  ✕
                </span>
              ) : null}
            </button>
          )
        })}
      </div>

      {solved ? (
        <>
          <Feedback kind="correct">
            {successText}
            <div className="feedback__xp">+{xpAmount} XP</div>
          </Feedback>
          {concept ? <ConceptBox>{concept}</ConceptBox> : null}
          <div className="btn-row" style={{ marginTop: 24 }}>
            <Button variant="success" onClick={() => onSolved()}>
              {continueLabel} →
            </Button>
          </div>
        </>
      ) : null}

      {!solved && attempts > 0 ? <Feedback kind="wrong">{wrongMessage}</Feedback> : null}

      {!solved ? <HintSystem hints={hints} autoReveal={attempts >= 2 ? 1 : 0} /> : null}
    </Panel>
  )
}
