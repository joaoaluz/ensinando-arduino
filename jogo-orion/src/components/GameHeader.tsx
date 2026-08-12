import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useGame } from '../game/GameContext'
import { TOTAL_MISSIONS } from '../game/missions'
import { XPBar } from './XPBar'
import { Button } from './Button'

export function GameHeader() {
  const { state, reset } = useGame()
  const location = useLocation()
  const navigate = useNavigate()

  const onMap = location.pathname === '/missao'
  const onHome = location.pathname === '/'

  function handleReset() {
    const ok = window.confirm(
      'Reiniciar a missão?\n\nTodo o progresso, XP e conquistas serão apagados.',
    )
    if (!ok) return
    reset()
    navigate('/')
  }

  if (onHome) return null

  return (
    <header className="header">
      <Link to="/missao" className="header__brand" aria-label="Voltar ao mapa da estação">
        <span className="header__logo" aria-hidden="true">
          🚀
        </span>
        <span>
          <span className="header__title">Estação Órion</span>
          <br />
          <span className="header__subtitle">Sistema de Emergência</span>
        </span>
      </Link>

      <div className="header__xp">
        <XPBar compact />
      </div>

      <div className="header__actions">
        <span className="badge badge--muted" title="Missões concluídas">
          {state.completedMissions.length}/{TOTAL_MISSIONS} ✔
        </span>
        {!onMap ? (
          <Button size="sm" variant="ghost" onClick={() => navigate('/missao')}>
            ← Mapa
          </Button>
        ) : null}
        <Button size="sm" variant="ghost" onClick={handleReset} aria-label="Reiniciar o progresso">
          ⟲
        </Button>
      </div>
    </header>
  )
}
