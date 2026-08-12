import { useState, type ReactNode } from 'react'
import { Panel } from './Panel'
import { Button } from './Button'
import { Feedback } from './Feedback'
import { HintSystem } from './HintSystem'
import { CodeBlock } from './CodeBlock'
import { playSound } from '../game/sound'
import { XP } from '../game/xp'

type Props = {
  /** Fala do inimigo / alerta do sistema. */
  alert: string
  code: string
  /** Índice (0-based) da linha com o erro. */
  bugLine: number
  question?: string
  /** Explicação do erro, revelada após o acerto. */
  explanation: ReactNode
  /** Como o código deveria ser. */
  fixedCode?: string
  hints?: string[]
  /** Disparado no instante em que o bug é localizado. */
  onCorrect?: () => void
  xpAmount?: number
  onSolved: () => void
}

/** Caça ao bug por clique na linha (§29). */
export function BugHunt({
  alert,
  code,
  bugLine,
  question = 'Clique na linha que está causando o problema.',
  explanation,
  fixedCode,
  hints = [],
  onCorrect,
  xpAmount = XP.BUG,
  onSolved,
}: Props) {
  const [picked, setPicked] = useState<number | null>(null)
  const [solved, setSolved] = useState(false)
  const [attempts, setAttempts] = useState(0)

  function pick(index: number) {
    if (solved) return
    setPicked(index)
    if (index === bugLine) {
      playSound('correct')
      setSolved(true)
      onCorrect?.()
    } else {
      playSound('wrong')
      setAttempts((n) => n + 1)
    }
  }

  return (
    <Panel hud>
      <div className="dialogue__who" style={{ color: 'var(--red)' }}>
        <span aria-hidden="true">👾</span> Alerta do sistema
      </div>
      <p className="dialogue__lines" style={{ marginBottom: 24 }}>
        {alert}
      </p>

      <h3 className="question">{question}</h3>

      <div style={{ marginTop: 16 }}>
        <CodeBlock
          code={code}
          onLineClick={pick}
          pickedLine={picked}
          bugLines={solved ? [bugLine] : []}
          disabled={solved}
          label="Código encontrado no sistema"
        />
      </div>

      {!solved && attempts > 0 ? (
        <Feedback kind="wrong" title="Essa linha está correta.">
          {attempts >= 2
            ? 'Leia linha por linha e pergunte: "esta instrução faz o que a estação precisa?".'
            : 'Continue procurando. Compare cada linha com o que você já sabe que o programa deveria fazer.'}
        </Feedback>
      ) : null}

      {solved ? (
        <>
          <Feedback kind="correct" title="🐛 Bug localizado!">
            {explanation}
            <div className="feedback__xp">+{xpAmount} XP</div>
          </Feedback>
          {fixedCode ? (
            <div style={{ marginTop: 16 }}>
              <CodeBlock code={fixedCode} label="Como deveria ser" />
            </div>
          ) : null}
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
