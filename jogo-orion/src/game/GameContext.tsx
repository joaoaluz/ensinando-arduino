import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import type { AchievementId, GameState, Mission, MissionId, MissionStatus } from './types'
import { MISSIONS, MISSIONS_BY_ID } from './missions'
import { levelForXp, levelProgress, type LevelProgress } from './levels'
import { ACHIEVEMENTS_BY_ID } from './achievements'
import { initialState, loadState, saveState, clearState } from './storage'
import { playSound } from './sound'

/** Aviso efêmero (toast / popup). Nunca é persistido. */
export type Notice = {
  id: number
  kind: 'xp' | 'level' | 'achievement'
  icon: string
  title: string
  detail?: string
}

type InternalState = {
  game: GameState
  notices: Notice[]
  noticeSeq: number
}

type Action =
  | { type: 'START' }
  | { type: 'AWARD'; key: string; amount: number; label?: string }
  | { type: 'COMPLETE_STEP'; mission: MissionId; step: string }
  | { type: 'COMPLETE_MISSION'; mission: MissionId }
  | { type: 'UNLOCK_ACHIEVEMENT'; id: AchievementId }
  | { type: 'USE_HINT' }
  | { type: 'FINISH' }
  | { type: 'DISMISS_NOTICE'; id: number }
  | { type: 'RESET' }

/** Teto da pilha de avisos: mais que isto cobriria o desafio na tela. */
const MAX_NOTICES = 3

function pushNotice(state: InternalState, notice: Omit<Notice, 'id'>): InternalState {
  const id = state.noticeSeq + 1
  return {
    ...state,
    noticeSeq: id,
    // Descarta os mais antigos em vez de acumular: quem sai da tela também
    // sai do estado, senão os avisos não renderizados nunca seriam limpos.
    notices: [...state.notices, { ...notice, id }].slice(-MAX_NOTICES),
  }
}

function reducer(state: InternalState, action: Action): InternalState {
  const { game } = state

  switch (action.type) {
    case 'START':
      return { ...state, game: { ...game, started: true } }

    case 'AWARD': {
      // Coração da regra anti-farm (§10): a chave só paga uma vez, e ela é persistida.
      if (game.awardedKeys.includes(action.key)) return state

      const xp = game.xp + action.amount
      const prevLevel = levelForXp(game.xp)
      const newLevel = levelForXp(xp)

      let next: InternalState = {
        ...state,
        game: {
          ...game,
          xp,
          level: newLevel.index,
          awardedKeys: [...game.awardedKeys, action.key],
        },
      }
      next = pushNotice(next, {
        kind: 'xp',
        icon: '✨',
        title: `+${action.amount} XP`,
        detail: action.label,
      })
      if (newLevel.index > prevLevel.index) {
        next = pushNotice(next, {
          kind: 'level',
          icon: newLevel.icon,
          title: 'NOVO NÍVEL',
          detail: newLevel.name,
        })
      }
      return next
    }

    case 'COMPLETE_STEP': {
      const done = game.missionProgress[action.mission] ?? []
      if (done.includes(action.step)) return state
      return {
        ...state,
        game: {
          ...game,
          missionProgress: { ...game.missionProgress, [action.mission]: [...done, action.step] },
        },
      }
    }

    case 'COMPLETE_MISSION': {
      if (game.completedMissions.includes(action.mission)) return state
      const order = MISSIONS_BY_ID[action.mission].order
      return {
        ...state,
        game: {
          ...game,
          completedMissions: [...game.completedMissions, action.mission],
          currentMission: Math.max(game.currentMission, order + 1),
        },
      }
    }

    case 'UNLOCK_ACHIEVEMENT': {
      if (game.achievements.includes(action.id)) return state
      const achievement = ACHIEVEMENTS_BY_ID[action.id]
      const next: InternalState = {
        ...state,
        game: { ...game, achievements: [...game.achievements, action.id] },
      }
      return pushNotice(next, {
        kind: 'achievement',
        icon: achievement.icon,
        title: achievement.name,
        detail: achievement.description,
      })
    }

    case 'USE_HINT':
      return { ...state, game: { ...game, hintsUsed: game.hintsUsed + 1 } }

    case 'FINISH':
      return { ...state, game: { ...game, finished: true } }

    case 'DISMISS_NOTICE':
      return { ...state, notices: state.notices.filter((n) => n.id !== action.id) }

    case 'RESET':
      clearState()
      return { game: initialState, notices: [], noticeSeq: state.noticeSeq }
  }
}

export type GameApi = {
  state: GameState
  notices: Notice[]
  progress: LevelProgress
  missions: Mission[]
  /** Total de missões concluídas / total. */
  completionRatio: number

  start(): void
  /** Paga XP uma única vez por `key`. Chamar de novo é seguro (no-op). */
  award(key: string, amount: number, label?: string): void
  isAwarded(key: string): boolean
  completeStep(mission: MissionId, step: string): void
  isStepDone(mission: MissionId, step: string): boolean
  completeMission(mission: MissionId): void
  unlockAchievement(id: AchievementId): void
  useHint(): void
  finish(): void
  dismissNotice(id: number): void
  reset(): void

  missionStatus(id: MissionId): MissionStatus
  isUnlocked(id: MissionId): boolean
  /** Última missão liberada e ainda não concluída (para o botão "continuar"). */
  activeMission: Mission | null
  allMissionsDone: boolean
}

const GameContext = createContext<GameApi | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    game: loadState(),
    notices: [],
    noticeSeq: 0,
  }))

  useEffect(() => {
    saveState(state.game)
  }, [state.game])

  const game = state.game

  const missionStatus = useCallback(
    (id: MissionId): MissionStatus => {
      if (game.completedMissions.includes(id)) return 'done'
      const mission = MISSIONS_BY_ID[id]
      const previous = MISSIONS.find((m) => m.order === mission.order - 1)
      if (!previous) return 'available'
      return game.completedMissions.includes(previous.id) ? 'available' : 'locked'
    },
    [game.completedMissions],
  )

  const api = useMemo<GameApi>(() => {
    const allMissionsDone = MISSIONS.every((m) => game.completedMissions.includes(m.id))
    return {
      state: game,
      notices: state.notices,
      progress: levelProgress(game.xp),
      missions: MISSIONS,
      completionRatio: game.completedMissions.length / MISSIONS.length,

      start: () => dispatch({ type: 'START' }),
      award: (key, amount, label) => {
        if (!game.awardedKeys.includes(key)) playSound('xp')
        dispatch({ type: 'AWARD', key, amount, label })
      },
      isAwarded: (key) => game.awardedKeys.includes(key),
      completeStep: (mission, step) => dispatch({ type: 'COMPLETE_STEP', mission, step }),
      isStepDone: (mission, step) => (game.missionProgress[mission] ?? []).includes(step),
      completeMission: (mission) => {
        if (!game.completedMissions.includes(mission)) playSound('mission')
        dispatch({ type: 'COMPLETE_MISSION', mission })
      },
      unlockAchievement: (id) => {
        if (!game.achievements.includes(id)) playSound('achievement')
        dispatch({ type: 'UNLOCK_ACHIEVEMENT', id })
      },
      useHint: () => dispatch({ type: 'USE_HINT' }),
      finish: () => dispatch({ type: 'FINISH' }),
      dismissNotice: (id) => dispatch({ type: 'DISMISS_NOTICE', id }),
      reset: () => dispatch({ type: 'RESET' }),

      missionStatus,
      isUnlocked: (id) => missionStatus(id) !== 'locked',
      activeMission: MISSIONS.find((m) => missionStatus(m.id) === 'available') ?? null,
      allMissionsDone,
    }
  }, [game, state.notices, missionStatus])

  return <GameContext.Provider value={api}>{children}</GameContext.Provider>
}

export function useGame(): GameApi {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame precisa estar dentro de <GameProvider>')
  return ctx
}
