import { type ReactNode } from 'react'
import { MultipleChoice, type Choice } from './MultipleChoice'
import { CodeBlock } from './CodeBlock'

type Props = {
  question: string
  intro?: string
  /** Alternativas escritas em código. */
  options: string[]
  /** Índice da alternativa correta. */
  correctIndex: number
  successText: ReactNode
  concept?: ReactNode
  hints?: string[]
  /** Programa montado até aqui — mostra a descoberta acontecendo (§25). */
  programSoFar?: string
  /** Disparado no instante do acerto — credita o XP na hora. */
  onCorrect?: () => void
  xpAmount?: number
  onSolved: () => void
}

/**
 * Desafio de código: o aluno escolhe o comando certo entre alternativas.
 * A cada acerto o programa cresce na tela — o código final não é entregue
 * pronto, ele é descoberto (§2).
 */
export function CodeChallenge({
  question,
  intro,
  options,
  correctIndex,
  successText,
  concept,
  hints,
  programSoFar,
  onCorrect,
  xpAmount,
  onSolved,
}: Props) {
  const choices: Choice[] = options.map((option, index) => ({
    id: String(index),
    label: option,
    mono: true,
  }))

  return (
    <MultipleChoice
      question={question}
      intro={intro}
      visual={
        programSoFar ? <CodeBlock code={programSoFar} label="Programa do sinalizador" /> : undefined
      }
      choices={choices}
      correctId={String(correctIndex)}
      successText={successText}
      concept={concept}
      hints={hints}
      onCorrect={onCorrect}
      xpAmount={xpAmount}
      stacked
      wrongMessages={[
        'Esse comando existe, mas não faz o que precisamos aqui. Leia o nome dele com calma.',
        'Compare os comandos: um configura o pino, outro escreve um valor nele, outro faz esperar.',
      ]}
      onSolved={onSolved}
    />
  )
}
