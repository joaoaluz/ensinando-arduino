import type { Level } from './types'

/** Níveis do jogo (§11). */
export const LEVELS: Level[] = [
  { index: 0, minXp: 0, icon: '👨‍🚀', name: 'Recruta' },
  { index: 1, minXp: 100, icon: '🔧', name: 'Técnico' },
  { index: 2, minXp: 200, icon: '⚡', name: 'Engenheiro' },
  { index: 3, minXp: 350, icon: '🤖', name: 'Especialista' },
  { index: 4, minXp: 500, icon: '🚀', name: 'Comandante da Estação' },
]

export function levelForXp(xp: number): Level {
  let found = LEVELS[0]
  for (const lvl of LEVELS) if (xp >= lvl.minXp) found = lvl
  return found
}

export type LevelProgress = {
  level: Level
  next: Level | null
  /** XP conquistado dentro do nível atual. */
  xpInLevel: number
  /** XP total que o nível atual exige para ser vencido. */
  xpSpanOfLevel: number
  /** Quanto falta para o próximo nível (0 se já é o máximo). */
  xpToNext: number
  /** 0..1 — usado pela barra de progresso. */
  ratio: number
}

export function levelProgress(xp: number): LevelProgress {
  const level = levelForXp(xp)
  const next = LEVELS.find((l) => l.minXp > level.minXp) ?? null

  if (!next) {
    return { level, next: null, xpInLevel: xp - level.minXp, xpSpanOfLevel: 0, xpToNext: 0, ratio: 1 }
  }

  const xpSpanOfLevel = next.minXp - level.minXp
  const xpInLevel = xp - level.minXp
  return {
    level,
    next,
    xpInLevel,
    xpSpanOfLevel,
    xpToNext: next.minXp - xp,
    ratio: Math.max(0, Math.min(1, xpInLevel / xpSpanOfLevel)),
  }
}
