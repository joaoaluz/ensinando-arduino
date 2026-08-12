/** Tabela de XP (§10). Use sempre estas constantes — nunca números soltos nas telas. */
export const XP = {
  /** Resposta correta em um quiz. */
  CORRECT: 10,
  /** Desafio interativo concluído (montagem, ordenação, associação...). */
  CHALLENGE: 20,
  /** Encontrar um bug. */
  BUG: 30,
  /** Completar um trecho de código. */
  CODE: 40,
  /** Concluir a missão final. */
  FINAL: 100,
} as const

export type XpReason = keyof typeof XP
