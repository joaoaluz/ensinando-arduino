import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useGame } from '../game/GameContext'
import type { MissionId } from '../game/types'

/**
 * Impede o acesso direto por URL a uma missão ainda bloqueada.
 * Sem isso, colar um link no chat da aula pularia etapas do aprendizado.
 */
export function MissionGate({ id, children }: { id: MissionId; children: ReactNode }) {
  const { isUnlocked } = useGame()
  if (!isUnlocked(id)) return <Navigate to="/missao" replace />
  return <>{children}</>
}
