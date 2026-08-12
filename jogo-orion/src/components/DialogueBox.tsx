import { Panel } from './Panel'
import { Button } from './Button'

type Props = {
  /** Quem está falando. Padrão: a Central de Controle da estação. */
  who?: string
  icon?: string
  lines: string[]
  onContinue?: () => void
  continueLabel?: string
}

/** Caixa de diálogo da Central de Controle (§35). Introduz cada missão. */
export function DialogueBox({
  who = 'Central de Controle',
  icon = '🛰️',
  lines,
  onContinue,
  continueLabel = 'Continuar',
}: Props) {
  return (
    <Panel className="dialogue" hud>
      <div className="dialogue__who">
        <span aria-hidden="true">{icon}</span> {who}
      </div>

      <div className="dialogue__lines">
        {lines.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>

      {onContinue ? (
        <Button variant="primary" onClick={() => onContinue()}>
          {continueLabel} →
        </Button>
      ) : null}
    </Panel>
  )
}
