import { useState } from 'react'
import { useGame } from '../game/GameContext'
import { Button } from './Button'

type Props = {
  /** Até 2 dicas por desafio (§28). */
  hints: string[]
  /** Revela a primeira dica automaticamente (ex.: após 2 erros). */
  autoReveal?: number
}

/**
 * Dicas progressivas. Não descontam XP de verdade (§28): a "punição" é
 * apenas visual — o contador de dicas usadas — para não desestimular quem
 * está aprendendo.
 */
export function HintSystem({ hints, autoReveal = 0 }: Props) {
  const { useHint } = useGame()
  const [revealed, setRevealed] = useState(0)
  const shown = Math.max(revealed, Math.min(autoReveal, hints.length))
  const hasMore = shown < hints.length

  function reveal() {
    setRevealed(shown + 1)
    useHint()
  }

  if (hints.length === 0) return null

  return (
    <div className="hints">
      {hints.slice(0, shown).map((hint, index) => (
        <div className="hint" key={index}>
          <span aria-hidden="true">💡</span>
          <div>
            <div className="hint__label">
              Dica {index + 1} de {hints.length}
            </div>
            <div className="hint__text">{hint}</div>
          </div>
        </div>
      ))}

      {hasMore ? (
        <Button
          size="sm"
          variant="ghost"
          onClick={reveal}
          style={{ marginTop: shown ? 12 : 0 }}
          aria-label={`Mostrar dica ${shown + 1}`}
        >
          💡 {shown === 0 ? 'Pedir uma dica' : 'Pedir outra dica'}
        </Button>
      ) : null}
    </div>
  )
}
