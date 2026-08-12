import { Fragment, type ReactNode } from 'react'

/**
 * Realce de sintaxe para o subconjunto de C++ que o jogo usa.
 * Não é um parser: é só uma varredura de tokens conhecidos, o bastante
 * para o código ficar legível no projetor.
 */
const TOKEN =
  /(\/\/[^\n]*)|\b(void|int|const)\b|\b(setup|loop|pinMode|digitalWrite|digitalRead|delay)\b|\b(HIGH|LOW|OUTPUT|INPUT)\b|\b(\d+)\b/g

const CLASS_BY_GROUP = ['tok-cmt', 'tok-key', 'tok-fn', 'tok-const', 'tok-num']

function highlight(line: string): ReactNode {
  const parts: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  TOKEN.lastIndex = 0
  while ((match = TOKEN.exec(line)) !== null) {
    if (match.index > lastIndex) parts.push(line.slice(lastIndex, match.index))

    const groupIndex = match.slice(1).findIndex((value) => value !== undefined)
    parts.push(
      <span key={`${match.index}-${match[0]}`} className={CLASS_BY_GROUP[groupIndex]}>
        {match[0]}
      </span>,
    )
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < line.length) parts.push(line.slice(lastIndex))

  return parts.map((part, index) => <Fragment key={index}>{part}</Fragment>)
}

type Props = {
  code: string
  /** Índices (0-based) de linhas destacadas como problemáticas. */
  bugLines?: number[]
  /** Torna cada linha clicável — usado na caça ao bug. */
  onLineClick?: (index: number) => void
  pickedLine?: number | null
  disabled?: boolean
  label?: string
}

export function CodeBlock({
  code,
  bugLines = [],
  onLineClick,
  pickedLine = null,
  disabled = false,
  label,
}: Props) {
  const lines = code.replace(/\n$/, '').split('\n')

  return (
    <div>
      {label ? <div className="match__col-title">{label}</div> : null}
      <pre className="code" tabIndex={0} aria-label={label ?? 'Bloco de código'}>
        {lines.map((line, index) =>
          onLineClick ? (
            <button
              key={index}
              type="button"
              className={[
                'code__line--btn',
                pickedLine === index ? 'code__line--picked' : '',
                bugLines.includes(index) ? 'code__line--bug' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onLineClick(index)}
              disabled={disabled}
              aria-label={`Linha ${index + 1}: ${line.trim() || 'linha em branco'}`}
            >
              {highlight(line) as ReactNode}
              {line.length === 0 ? ' ' : ''}
            </button>
          ) : (
            <span
              key={index}
              className={`code__line ${bugLines.includes(index) ? 'code__line--bug' : ''}`}
            >
              {highlight(line) as ReactNode}
              {'\n'}
            </span>
          ),
        )}
      </pre>
    </div>
  )
}
