import type { Achievement, AchievementId } from './types'

/** Conquistas (§33). */
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'primeira-luz',
    icon: '💡',
    name: 'Primeira Luz',
    description: 'Acendeu o primeiro LED.',
  },
  {
    id: 'eletricista',
    icon: '🔌',
    name: 'Eletricista',
    description: 'Completou uma montagem de circuito.',
  },
  {
    id: 'cacador-de-bugs',
    icon: '🐛',
    name: 'Caçador de Bugs',
    description: 'Encontrou um erro de programação.',
  },
  {
    id: 'primeiro-programa',
    icon: '🤖',
    name: 'Primeiro Programa',
    description: 'Escreveu seu primeiro programa Arduino.',
  },
  {
    id: 'engenheiro-orion',
    icon: '🚀',
    name: 'Engenheiro Órion',
    description: 'Restaurou o sistema de emergência.',
  },
]

export const ACHIEVEMENTS_BY_ID: Record<AchievementId, Achievement> = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.id, a]),
) as Record<AchievementId, Achievement>
