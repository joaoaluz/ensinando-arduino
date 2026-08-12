import type { GameState } from './types'
import { levelForXp } from './levels'

export const STORAGE_KEY = 'orion:save'
export const SCHEMA_VERSION = 1

export const initialState: GameState = {
  version: SCHEMA_VERSION,
  xp: 0,
  level: 0,
  currentMission: 1,
  completedMissions: [],
  achievements: [],
  hintsUsed: 0,
  awardedKeys: [],
  missionProgress: {},
  started: false,
  finished: false,
}

/** Aceita apenas arrays de string — evita quebrar a UI com um save corrompido/editado. */
function strArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : []
}

function num(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

/**
 * Lê o save. Qualquer inconsistência cai no estado inicial em vez de estourar:
 * numa aula ao vivo, perder o progresso é ruim, mas tela branca é pior.
 */
export function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState

    const parsed = JSON.parse(raw) as Partial<GameState>
    if (parsed.version !== SCHEMA_VERSION) return initialState

    const xp = Math.max(0, num(parsed.xp, 0))
    return {
      version: SCHEMA_VERSION,
      xp,
      level: levelForXp(xp).index,
      currentMission: Math.max(1, num(parsed.currentMission, 1)),
      completedMissions: strArray(parsed.completedMissions) as GameState['completedMissions'],
      achievements: strArray(parsed.achievements) as GameState['achievements'],
      hintsUsed: Math.max(0, num(parsed.hintsUsed, 0)),
      awardedKeys: strArray(parsed.awardedKeys),
      missionProgress:
        parsed.missionProgress && typeof parsed.missionProgress === 'object'
          ? (parsed.missionProgress as GameState['missionProgress'])
          : {},
      started: parsed.started === true,
      finished: parsed.finished === true,
    }
  } catch {
    return initialState
  }
}

export function saveState(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Modo privado / storage cheio: o jogo segue funcionando, só não persiste.
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* noop */
  }
}
