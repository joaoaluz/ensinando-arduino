import type { ReactNode } from 'react'

type Props = {
  kind: 'correct' | 'wrong' | 'info'
  title?: string
  children: ReactNode
}

const DEFAULTS: Record<Props['kind'], { icon: string; title: string }> = {
  correct: { icon: '✅', title: 'Correto!' },
  wrong: { icon: '❌', title: 'Ainda não.' },
  info: { icon: 'ℹ️', title: 'Registro' },
}

/**
 * Feedback textual + ícone. Nunca depende só de cor (§37) e o texto é
 * anunciado por leitores de tela assim que aparece.
 */
export function Feedback({ kind, title, children }: Props) {
  const preset = DEFAULTS[kind]
  return (
    <div className={`feedback feedback--${kind}`} role="status">
      <span className="feedback__icon" aria-hidden="true">
        {preset.icon}
      </span>
      <div>
        <div className="feedback__title">{title ?? preset.title}</div>
        <div className="feedback__text">{children}</div>
      </div>
    </div>
  )
}

/** Explicação do conceito — mostrada DEPOIS da tentativa, nunca antes (§3). */
export function ConceptBox({ tag = 'Conceito', children }: { tag?: string; children: ReactNode }) {
  return (
    <div className="concept">
      <div className="concept__tag">📘 {tag}</div>
      <div className="muted">{children}</div>
    </div>
  )
}
