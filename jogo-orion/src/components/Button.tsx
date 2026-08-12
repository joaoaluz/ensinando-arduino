import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { playSound } from '../game/sound'

type Variant = 'default' | 'primary' | 'ghost' | 'success'
type Size = 'sm' | 'md' | 'lg'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: Variant
  size?: Size
}

export function Button({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  onClick,
  ...rest
}: Props) {
  const classes = [
    'btn',
    variant !== 'default' ? `btn--${variant}` : '',
    size !== 'md' ? `btn--${size}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={classes}
      onClick={(event) => {
        playSound('click')
        onClick?.(event)
      }}
      {...rest}
    >
      {children}
    </button>
  )
}
