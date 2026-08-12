import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { useGame } from '../game/GameContext'
import { MissionCard } from './MissionCard'

/** Mapa vertical da estação (§12). O próximo setor só abre depois do anterior. */
export function MissionMap() {
  const { missions, missionStatus, allMissionsDone } = useGame()

  return (
    <div className="map__list">
      {missions.map((mission, index) => {
        const status = missionStatus(mission.id)
        return (
          <Fragment key={mission.id}>
            {index > 0 ? (
              <div
                className={`map__connector ${status !== 'locked' ? 'map__connector--active' : ''}`}
                aria-hidden="true"
              />
            ) : null}
            <MissionCard mission={mission} status={status} />
          </Fragment>
        )
      })}

      <div
        className={`map__connector ${allMissionsDone ? 'map__connector--active' : ''}`}
        aria-hidden="true"
      />

      {allMissionsDone ? (
        <Link to="/vitoria" className="map__signal map__signal--ready">
          <div style={{ fontSize: '2rem' }} aria-hidden="true">
            🚨
          </div>
          <strong>SINAL — Ativar o sinalizador de emergência</strong>
          <div className="tiny">Todos os setores restaurados. A estação espera por você.</div>
        </Link>
      ) : (
        <div className="map__signal">
          <div style={{ fontSize: '2rem' }} aria-hidden="true">
            🔒
          </div>
          <strong>SINAL — Sinalizador de emergência</strong>
          <div className="tiny">Restaure todos os setores para ativar.</div>
        </div>
      )}
    </div>
  )
}
