import { useEffect } from 'react'
import { useGame } from '../game/GameContext'
import type { Notice } from '../game/GameContext'

const DURATION: Record<Notice['kind'], number> = {
  xp: 2200,
  level: 3800,
  achievement: 4600,
}

function NoticeItem({ notice }: { notice: Notice }) {
  const { dismissNotice } = useGame()

  useEffect(() => {
    const timer = window.setTimeout(() => dismissNotice(notice.id), DURATION[notice.kind])
    return () => window.clearTimeout(timer)
  }, [notice.id, notice.kind, dismissNotice])

  return (
    <div className={`notice notice--${notice.kind}`}>
      <span className="notice__icon" aria-hidden="true">
        {notice.icon}
      </span>
      <div>
        <div className="notice__title">
          {notice.kind === 'achievement' ? 'CONQUISTA: ' : ''}
          {notice.title}
        </div>
        {notice.detail ? <div className="notice__detail">{notice.detail}</div> : null}
      </div>
    </div>
  )
}

/**
 * Fila de avisos: XP, subida de nível e conquistas (§33).
 * `aria-live` garante que leitores de tela também anunciem o ganho.
 */
/** A pilha já vem limitada pelo reducer (MAX_NOTICES). */
export function AchievementPopup() {
  const { notices } = useGame()

  return (
    <div className="notices" aria-live="polite" aria-atomic="false">
      {notices.map((notice) => (
        <NoticeItem key={notice.id} notice={notice} />
      ))}
    </div>
  )
}
