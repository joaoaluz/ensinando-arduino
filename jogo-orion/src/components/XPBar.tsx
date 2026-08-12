import { useGame } from '../game/GameContext'

/** Nível, XP atual, XP para o próximo nível e barra de progresso (§11). */
export function XPBar({ compact = false }: { compact?: boolean }) {
  const { state, progress } = useGame()
  const { level, next, ratio, xpToNext } = progress
  const percent = Math.round(ratio * 100)

  return (
    <div className={`xpbar ${next ? '' : 'xpbar--full'}`}>
      <div className="xpbar__avatar" aria-hidden="true">
        {level.icon}
      </div>

      <div className="xpbar__body">
        <div className="xpbar__labels">
          <span className="xpbar__level">{level.name}</span>
          <span className="xpbar__numbers">
            {next ? `${state.xp} / ${next.minXp} XP` : `${state.xp} XP · MÁX`}
          </span>
        </div>

        <div
          className="xpbar__track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-label={`Progresso de nível: ${percent}% até ${next ? next.name : 'o nível máximo'}`}
        >
          <div className="xpbar__fill" style={{ width: `${percent}%` }} />
        </div>

        {!compact && next ? (
          <p className="tiny" style={{ marginTop: 4 }}>
            Faltam {xpToNext} XP para {next.icon} {next.name}
          </p>
        ) : null}
      </div>
    </div>
  )
}
