import type { GameState } from './types'
import { MISSIONS } from './missions'
import { levelForXp } from './levels'

/**
 * Preparo para o MODO PROFESSOR (§39).
 *
 * NÃO há backend neste MVP — e não deve haver. O que existe aqui é o contrato:
 * um "relatório de progresso" serializável e um transporte plugável. Quando um
 * servidor existir, basta implementar `ProgressTransport` e chamar
 * `setProgressTransport(...)` no main.tsx. Nenhum componente muda.
 */

export type ProgressReport = {
  studentName: string | null
  sessionCode: string | null
  xp: number
  levelName: string
  completed: number
  total: number
  achievements: number
  hintsUsed: number
  updatedAt: string
}

export function buildProgressReport(
  state: GameState,
  studentName: string | null = null,
  sessionCode: string | null = null,
): ProgressReport {
  return {
    studentName,
    sessionCode,
    xp: state.xp,
    levelName: levelForXp(state.xp).name,
    completed: state.completedMissions.length,
    total: MISSIONS.length,
    achievements: state.achievements.length,
    hintsUsed: state.hintsUsed,
    updatedAt: new Date().toISOString(),
  }
}

export interface ProgressTransport {
  send(report: ProgressReport): void | Promise<void>
}

/** Transporte padrão: não faz nada. Nada sai do navegador do aluno no MVP. */
let transport: ProgressTransport = { send: () => {} }

export function setProgressTransport(next: ProgressTransport): void {
  transport = next
}

export function reportProgress(report: ProgressReport): void {
  void transport.send(report)
}
