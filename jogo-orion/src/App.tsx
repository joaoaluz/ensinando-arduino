import { useEffect } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { GameProvider } from './game/GameContext'
import { GameHeader } from './components/GameHeader'
import { AchievementPopup } from './components/AchievementPopup'
import { HomeScreen } from './screens/HomeScreen'
import { MapScreen } from './screens/MapScreen'
import { VictoryScreen } from './screens/VictoryScreen'
import { M1Energia } from './screens/missions/M1Energia'
import { M2Circuito } from './screens/missions/M2Circuito'
import { M3Led } from './screens/missions/M3Led'
import { M4Arduino } from './screens/missions/M4Arduino'
import { M5Programacao } from './screens/missions/M5Programacao'
import { M6Montagem } from './screens/missions/M6Montagem'
import { M7Codigo } from './screens/missions/M7Codigo'
import { BossDebug } from './screens/missions/BossDebug'
import { MissionGate } from './components/MissionGate'

/** Sempre começar a rota nova pelo topo da página. */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])
  return null
}

/**
 * Rotas (§8). Cada missão é protegida por <MissionGate>: acessar uma URL
 * bloqueada devolve o aluno ao mapa, em vez de pular etapas.
 *
 * PARA ADICIONAR UMA MISSÃO: registre-a em game/missions.ts e acrescente
 * uma <Route> aqui, com o mesmo `path`.
 */
export default function App() {
  return (
    <GameProvider>
      <HashRouter>
        <ScrollToTop />
        <div className="app-shell">
          <GameHeader />
          <AchievementPopup />

          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/missao" element={<MapScreen />} />

            <Route
              path="/missao/energia"
              element={
                <MissionGate id="energia">
                  <M1Energia />
                </MissionGate>
              }
            />
            <Route
              path="/missao/circuito"
              element={
                <MissionGate id="circuito">
                  <M2Circuito />
                </MissionGate>
              }
            />
            <Route
              path="/missao/led"
              element={
                <MissionGate id="led">
                  <M3Led />
                </MissionGate>
              }
            />
            <Route
              path="/missao/arduino"
              element={
                <MissionGate id="arduino">
                  <M4Arduino />
                </MissionGate>
              }
            />
            <Route
              path="/missao/programacao"
              element={
                <MissionGate id="programacao">
                  <M5Programacao />
                </MissionGate>
              }
            />
            <Route
              path="/missao/montagem"
              element={
                <MissionGate id="montagem">
                  <M6Montagem />
                </MissionGate>
              }
            />
            <Route
              path="/missao/codigo"
              element={
                <MissionGate id="codigo">
                  <M7Codigo />
                </MissionGate>
              }
            />
            <Route
              path="/missao/debug"
              element={
                <MissionGate id="debug">
                  <BossDebug />
                </MissionGate>
              }
            />

            <Route path="/vitoria" element={<VictoryScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <footer className="footer">
            Estação Órion · jogo educacional de introdução ao Arduino · o progresso fica salvo neste
            navegador
          </footer>
        </div>
      </HashRouter>
    </GameProvider>
  )
}
