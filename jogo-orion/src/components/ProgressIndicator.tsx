type Props = {
  total: number
  /** Índice do passo atual (0-based). */
  current: number
  label?: string
}

/** Pontinhos de progresso dentro de uma missão. */
export function ProgressIndicator({ total, current, label }: Props) {
  return (
    <div
      className="steps"
      role="group"
      aria-label={`Passo ${Math.min(current + 1, total)} de ${total}`}
    >
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={[
            'steps__dot',
            index < current ? 'steps__dot--done' : '',
            index === current ? 'steps__dot--current' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        />
      ))}
      <span className="steps__label">
        {label ?? `${Math.min(current + 1, total)}/${total}`}
      </span>
    </div>
  )
}
