import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../game/GameContext'
import { Button } from '../components/Button'

/** Tela inicial cinematográfica (§13). */
export function HomeScreen() {
  const { state, start, activeMission } = useGame()
  const navigate = useNavigate()
  const [launching, setLaunching] = useState(false)

  const hasProgress = state.xp > 0 || state.completedMissions.length > 0

  function accept() {
    setLaunching(true)
    start()
    window.setTimeout(() => navigate('/missao'), 650)
  }

  return (
    <main className={`home ${launching ? 'home--launching' : ''}`}>
      <div className="home__inner">
        <span className="home__alarm">⚠ Alerta de apagão</span>

        <div className="home__station" aria-hidden="true">
          🛰️
        </div>

        <h1 className="home__title">
          Missão:
          <br />
          Restaurar a Estação
        </h1>

        <p className="home__subtitle">Estação Órion // Sistema de Emergência</p>

        <div className="home__brief">
          <p>A estação Órion perdeu energia.</p>
          <p>O sistema de comunicação está offline.</p>
          <p>Precisamos de um engenheiro.</p>
          <p>Você está disponível?</p>
        </div>

        <div className="home__cta">
          <div className="btn-row" style={{ justifyContent: 'center' }}>
            <Button variant="primary" size="lg" onClick={accept} disabled={launching}>
              {hasProgress ? '▸ Retomar missão' : '▸ Aceitar missão'}
            </Button>
          </div>

          {hasProgress && activeMission ? (
            <p className="home__resume muted" style={{ marginTop: 16 }}>
              Progresso salvo: {state.xp} XP · próximo setor {activeMission.icon}{' '}
              {activeMission.name}
            </p>
          ) : null}
        </div>
      </div>
    </main>
  )
}
