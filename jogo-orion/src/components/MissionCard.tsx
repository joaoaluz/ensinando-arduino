import { Link } from 'react-router-dom'
import type { Mission, MissionStatus } from '../game/types'

const STATUS_BADGE: Record<MissionStatus, { className: string; text: string }> = {
  locked: { className: 'badge badge--muted', text: '🔒 Bloqueada' },
  available: { className: 'badge', text: '🟡 Disponível' },
  done: { className: 'badge badge--green', text: '🟢 Concluída' },
}

export function MissionCard({ mission, status }: { mission: Mission; status: MissionStatus }) {
  const badge = STATUS_BADGE[status]

  const content = (
    <>
      <span className="mcard__icon" aria-hidden="true">
        {status === 'locked' ? '🔒' : mission.icon}
      </span>
      <span className="mcard__body">
        <span className="mcard__code">
          {mission.code} · {mission.mapLabel}
        </span>
        <span className="mcard__name">{mission.name}</span>
        <span className="mcard__tagline">
          {status === 'locked' ? 'Conclua a missão anterior para liberar este setor.' : mission.tagline}
        </span>
      </span>
      <span className="mcard__status">
        <span className={badge.className}>{badge.text}</span>
      </span>
    </>
  )

  if (status === 'locked') {
    return (
      <div
        className="mcard mcard--locked"
        aria-disabled="true"
        aria-label={`${mission.name}: bloqueada`}
      >
        {content}
      </div>
    )
  }

  return (
    <Link
      to={mission.path}
      className={`mcard mcard--${status}`}
      aria-label={`${mission.code}: ${mission.name} — ${badge.text}`}
    >
      {content}
    </Link>
  )
}
