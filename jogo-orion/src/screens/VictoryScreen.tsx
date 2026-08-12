import { useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useGame } from '../game/GameContext'
import { XP } from '../game/xp'
import { ACHIEVEMENTS_BY_ID } from '../game/achievements'
import { Panel } from '../components/Panel'
import { CodeBlock } from '../components/CodeBlock'
import { SOLUTION } from '../components/CodeEditor'
import { XPBar } from '../components/XPBar'

const TINKERCAD_URL = 'https://www.tinkercad.com/circuits'

export function VictoryScreen() {
  const { state, allMissionsDone, award, unlockAchievement, finish, progress } = useGame()

  useEffect(() => {
    if (!allMissionsDone) return
    award('victory:final', XP.FINAL, 'Missão concluída')
    unlockAchievement('engenheiro-orion')
    finish()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allMissionsDone])

  // Sem todos os setores restaurados não há sinalizador para ativar.
  if (!allMissionsDone) return <Navigate to="/missao" replace />

  return (
    <main className="page">
      <div className="victory">
        <div className="victory__beacon" aria-hidden="true">
          🚨
        </div>

        <h1 className="victory__alert">🚨 Sinalizador ativado 🚨</h1>

        <p className="victory__station">
          Estação Órion
          <br />
          <span className="muted" style={{ fontSize: 'var(--fs-sm)' }}>
            Sistema de emergência
          </span>
        </p>

        <div className="victory__online">ONLINE</div>

        <div className="victory__bar" role="img" aria-label="Sistema restaurado: 100 por cento">
          <span />
        </div>

        <p className="eyebrow">Missão concluída</p>

        <div className="victory__stats">
          <div className="vstat">
            <div className="vstat__value">{state.xp}</div>
            <div className="vstat__label">XP total</div>
          </div>
          <div className="vstat">
            <div className="vstat__value">
              {progress.level.icon} {progress.level.name}
            </div>
            <div className="vstat__label">Patente</div>
          </div>
          <div className="vstat">
            <div className="vstat__value">{state.completedMissions.length}</div>
            <div className="vstat__label">Setores restaurados</div>
          </div>
          <div className="vstat">
            <div className="vstat__value">
              {state.achievements.length}/{Object.keys(ACHIEVEMENTS_BY_ID).length}
            </div>
            <div className="vstat__label">Conquistas</div>
          </div>
        </div>

        <Panel title="🏆 Conquistas desbloqueadas" className="stack">
          <div className="ach-list">
            {state.achievements.map((id) => {
              const achievement = ACHIEVEMENTS_BY_ID[id]
              return (
                <div className="ach ach--unlocked" key={id}>
                  <span className="ach__icon" aria-hidden="true">
                    {achievement.icon}
                  </span>
                  <div>
                    <div className="ach__name">{achievement.name}</div>
                    <div className="ach__desc">{achievement.description}</div>
                  </div>
                </div>
              )
            })}
          </div>
          <div style={{ marginTop: 20 }}>
            <XPBar />
          </div>
        </Panel>

        {/* O ponto de chegada do produto inteiro (§41, §49). */}
        <div className="callout">
          <h3>🔧 Agora vale de verdade</h3>
          <p className="muted">
            O jogo acabou aqui — mas o sinalizador de verdade ainda não está piscando na sua mesa.
            Monte o circuito com as peças reais e envie este programa para o seu Arduino.
          </p>
          <ol>
            <li>Encaixe o LED e o resistor na protoboard.</li>
            <li>Ligue o pino 13 ao resistor, o resistor ao LED e o LED de volta ao GND.</li>
            <li>Conecte o Arduino ao computador pelo cabo USB.</li>
            <li>Abra a Arduino IDE, cole o programa abaixo e clique em Carregar.</li>
          </ol>
        </div>

        <div style={{ width: '100%', textAlign: 'left' }}>
          <CodeBlock code={SOLUTION} label="Programa final — copie para a Arduino IDE" />
        </div>

        {/* Tinkercad é só um convite lateral, nunca a mecânica do jogo (§40). */}
        <div className="callout callout--cyan">
          <h3>🧪 Quer continuar experimentando?</h3>
          <p className="muted">
            Existe uma ferramenta chamada Tinkercad que permite montar e simular circuitos
            virtualmente, direto no navegador — útil para testar ideias antes de mexer nas peças.
          </p>
          <p style={{ marginTop: 16 }}>
            <a
              className="btn btn--sm"
              href={TINKERCAD_URL}
              target="_blank"
              rel="noreferrer noopener"
            >
              Conhecer o laboratório virtual ↗
            </a>
          </p>
        </div>

        <div className="btn-row" style={{ justifyContent: 'center' }}>
          <Link className="btn btn--ghost" to="/missao">
            ← Voltar ao mapa
          </Link>
        </div>
      </div>
    </main>
  )
}
