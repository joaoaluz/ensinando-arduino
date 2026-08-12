import type { Mission, MissionId } from './types'

/**
 * Registro de missões (§8, §12, §42).
 *
 * PARA ADICIONAR UMA MISSÃO NOVA:
 *  1. adicione o id em `MissionId` (game/types.ts)
 *  2. adicione uma entrada aqui, com `order` na posição desejada
 *  3. crie a tela em screens/missions/ e registre a rota em App.tsx
 * O mapa, o desbloqueio progressivo e a navegação se ajustam sozinhos.
 */
export const MISSIONS: Mission[] = [
  {
    id: 'energia',
    order: 1,
    code: 'MISSÃO 01',
    name: 'Caça à Energia',
    icon: '⚡',
    tagline: 'Identifique os componentes da estação.',
    path: '/missao/energia',
    mapLabel: 'ENERGIA',
  },
  {
    id: 'circuito',
    order: 2,
    code: 'MISSÃO 02',
    name: 'O Fluxo Elétrico',
    icon: '🔌',
    tagline: 'Circuito aberto ou fechado?',
    path: '/missao/circuito',
    mapLabel: 'CIRCUITO',
  },
  {
    id: 'led',
    order: 3,
    code: 'MISSÃO 03',
    name: 'Salve o LED',
    icon: '💡',
    tagline: 'Polaridade e o papel do resistor.',
    path: '/missao/led',
    mapLabel: 'LED',
  },
  {
    id: 'arduino',
    order: 4,
    code: 'MISSÃO 04',
    name: 'O Cérebro da Estação',
    icon: '🤖',
    tagline: 'Conheça a placa e seus pinos.',
    path: '/missao/arduino',
    mapLabel: 'ARDUINO',
  },
  {
    id: 'programacao',
    order: 5,
    code: 'MISSÃO 05',
    name: 'O Tradutor',
    icon: '💻',
    tagline: 'Traduza ações em comandos.',
    path: '/missao/programacao',
    mapLabel: 'PROGRAMA',
  },
  {
    id: 'montagem',
    order: 6,
    code: 'MISSÃO 06',
    name: 'Construa o Sinalizador',
    icon: '🔧',
    tagline: 'Monte o circuito, peça por peça.',
    path: '/missao/montagem',
    mapLabel: 'OFICINA',
  },
  {
    id: 'codigo',
    order: 7,
    code: 'MISSÃO 07',
    name: 'O Código Secreto',
    icon: '📟',
    tagline: 'Escreva o programa do sinalizador.',
    path: '/missao/codigo',
    mapLabel: 'CÓDIGO',
  },
  {
    id: 'debug',
    order: 8,
    code: 'CHEFE FINAL',
    name: 'Caçador de Bugs',
    icon: '👾',
    tagline: 'Algo ainda está errado. Encontre.',
    path: '/missao/debug',
    mapLabel: 'DEBUG',
  },
]

export const MISSIONS_BY_ID: Record<MissionId, Mission> = Object.fromEntries(
  MISSIONS.map((m) => [m.id, m]),
) as Record<MissionId, Mission>

export const TOTAL_MISSIONS = MISSIONS.length

export function getMission(id: MissionId): Mission {
  return MISSIONS_BY_ID[id]
}

export function nextMission(id: MissionId): Mission | null {
  const current = MISSIONS_BY_ID[id]
  return MISSIONS.find((m) => m.order === current.order + 1) ?? null
}
