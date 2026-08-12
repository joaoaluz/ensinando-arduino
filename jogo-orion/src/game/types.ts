/**
 * Tipos centrais do jogo.
 * Regra de arquitetura: nada aqui importa React. Estado é independente da tela.
 */

export type MissionId =
  | 'energia'
  | 'circuito'
  | 'led'
  | 'arduino'
  | 'programacao'
  | 'montagem'
  | 'codigo'
  | 'debug'

export type AchievementId =
  | 'primeira-luz'
  | 'eletricista'
  | 'cacador-de-bugs'
  | 'primeiro-programa'
  | 'engenheiro-orion'

/** Estado global persistido em localStorage. */
export type GameState = {
  /** Versão do schema — permite migrar/descartar saves antigos. */
  version: number
  xp: number
  level: number
  currentMission: number
  completedMissions: MissionId[]
  achievements: AchievementId[]
  hintsUsed: number
  /**
   * Chaves de XP já pagas. É isto que impede o aluno de recarregar a página
   * para farmar XP: cada desafio paga uma única vez, para sempre.
   */
  awardedKeys: string[]
  /** Passos concluídos por missão — permite retomar de onde parou. */
  missionProgress: Partial<Record<MissionId, string[]>>
  /** O jogador já aceitou a missão na tela inicial? */
  started: boolean
  /** Missão final concluída (libera /vitoria). */
  finished: boolean
}

export type Mission = {
  id: MissionId
  /** Ordem no mapa, começando em 1. */
  order: number
  code: string
  name: string
  icon: string
  /** Frase curta mostrada no card do mapa. */
  tagline: string
  path: string
  /** Rótulo do nó no mapa da estação (§12). */
  mapLabel: string
}

export type MissionStatus = 'locked' | 'available' | 'done'

export type Achievement = {
  id: AchievementId
  icon: string
  name: string
  description: string
}

export type Level = {
  index: number
  minXp: number
  icon: string
  name: string
}

/** Feedback padronizado dos desafios. */
export type AnswerState = 'idle' | 'correct' | 'wrong'
