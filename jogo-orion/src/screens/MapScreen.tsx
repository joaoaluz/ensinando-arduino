import { useNavigate } from 'react-router-dom'
import { useGame } from '../game/GameContext'
import { ACHIEVEMENTS } from '../game/achievements'
import { MissionMap } from '../components/MissionMap'
import { Panel } from '../components/Panel'
import { Button } from '../components/Button'
import { XPBar } from '../components/XPBar'

export function MapScreen() {
  const { state, activeMission, completionRatio, allMissionsDone } = useGame()
  const navigate = useNavigate()

  return (
    <main className="page page--wide">
      <div className="map__head">
        <div>
          <p className="eyebrow">🚀 Estação Órion</p>
          <h1 className="map__title">Mapa da Estação</h1>
          <p className="muted">
            {allMissionsDone
              ? 'Todos os setores foram restaurados. Ative o sinalizador.'
              : 'Restaure um setor de cada vez. O próximo só abre quando o anterior estiver em ordem.'}
          </p>
        </div>

        <div className="btn-row">
          <span className="badge badge--amber">
            ⚡ {Math.round(completionRatio * 100)}% da estação restaurada
          </span>
          {activeMission ? (
            <Button variant="primary" onClick={() => navigate(activeMission.path)}>
              {activeMission.icon} Continuar
            </Button>
          ) : (
            <Button variant="primary" onClick={() => navigate('/vitoria')}>
              🚨 Ativar sinalizador
            </Button>
          )}
        </div>
      </div>

      <div className="map__grid">
        <MissionMap />

        <div className="stack">
          <Panel title="👨‍🚀 Engenheiro">
            <XPBar />
            <p className="tiny" style={{ marginTop: 16 }}>
              Dicas usadas: {state.hintsUsed} · Setores concluídos: {state.completedMissions.length}
            </p>
          </Panel>

          <Panel title="🏆 Conquistas">
            <div className="ach-list">
              {ACHIEVEMENTS.map((achievement) => {
                const unlocked = state.achievements.includes(achievement.id)
                return (
                  <div
                    key={achievement.id}
                    className={`ach ${unlocked ? 'ach--unlocked' : 'ach--locked'}`}
                  >
                    <span className="ach__icon" aria-hidden="true">
                      {unlocked ? achievement.icon : '🔒'}
                    </span>
                    <div>
                      <div className="ach__name">{achievement.name}</div>
                      <div className="ach__desc">
                        {unlocked ? achievement.description : 'Ainda não desbloqueada.'}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Panel>

          <div className="teacher-note">
            <strong>Para o professor:</strong> o progresso fica salvo no navegador de cada aluno. O
            botão ⟲ no topo reinicia tudo.
          </div>
        </div>
      </div>
    </main>
  )
}
