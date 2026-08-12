import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** Título em caixa alta no topo do painel. */
  title?: ReactNode
  /** Cantos de HUD, para painéis de destaque. */
  hud?: boolean
  className?: string
  as?: 'div' | 'section' | 'article'
}

export function Panel({ children, title, hud = false, className = '', as: Tag = 'section' }: Props) {
  return (
    <Tag className={`panel ${hud ? 'panel--hud' : ''} ${className}`.trim()}>
      {title ? <h2 className="panel__title">{title}</h2> : null}
      {children}
    </Tag>
  )
}
