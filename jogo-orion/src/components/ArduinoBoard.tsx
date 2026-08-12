import { useState } from 'react'

export type BoardPart = 'digital' | 'power' | 'usb' | 'chip'

const PARTS: { id: BoardPart; name: string; desc: string }[] = [
  {
    id: 'digital',
    name: 'Pinos digitais (0 a 13)',
    desc: 'Cada um pode ser entrada ou saída. É onde vamos ligar o LED — no pino 13.',
  },
  {
    id: 'power',
    name: 'GND e 5V',
    desc: 'GND é o "caminho de volta" da corrente. Todo circuito precisa voltar para lá.',
  },
  {
    id: 'usb',
    name: 'Conector USB',
    desc: 'Leva o programa do computador até a placa — e também alimenta o Arduino.',
  },
  {
    id: 'chip',
    name: 'Microcontrolador',
    desc: 'O cérebro. Guarda o seu programa e executa as instruções, uma por uma, para sempre.',
  },
]

/**
 * Ilustração de uma placa Arduino em SVG (§19). Não é realista de propósito:
 * o objetivo é que o aluno reconheça QUATRO regiões, não decore a placa.
 */
export function ArduinoBoard() {
  const [active, setActive] = useState<BoardPart | null>(null)
  const on = (part: BoardPart) => active === part

  const highlight = (part: BoardPart) => ({
    stroke: on(part) ? '#3ee0ff' : 'transparent',
    strokeWidth: 3,
    fill: on(part) ? 'rgba(62,224,255,0.16)' : 'transparent',
    rx: 8,
  })

  return (
    <div>
      <svg className="board" viewBox="0 0 620 300" role="img" aria-label="Placa Arduino Uno simplificada">
        {/* Corpo da placa */}
        <rect x="60" y="40" width="500" height="220" rx="16" fill="#0d5a56" stroke="#1c8f88" strokeWidth="3" />
        <rect x="76" y="56" width="468" height="188" rx="10" fill="none" stroke="#12726c" strokeWidth="2" />

        {/* USB */}
        <rect x="20" y="76" width="52" height="54" rx="6" fill="#9fb2c8" stroke="#c9d8ea" strokeWidth="2" />
        <rect x="28" y="88" width="36" height="30" rx="3" fill="#37475c" />
        <rect {...highlight('usb')} x="12" y="66" width="70" height="74" />
        <text x="46" y="158" className="svg-label" textAnchor="middle">
          USB
        </text>

        {/* Barra de pinos digitais */}
        <rect x="120" y="26" width="400" height="26" rx="5" fill="#12181f" stroke="#2a3846" strokeWidth="2" />
        {Array.from({ length: 14 }, (_, index) => (
          <g key={index}>
            <rect x={130 + index * 27} y={32} width="14" height="14" rx="2" fill="#2c3a4a" />
            <text x={137 + index * 27} y={20} className="svg-pin" textAnchor="middle">
              {13 - index}
            </text>
          </g>
        ))}
        <rect {...highlight('digital')} x="112" y="4" width="416" height="56" />

        {/* Pino 13 em destaque: é o que o jogo vai usar */}
        <circle cx="137" cy="39" r="12" fill="none" stroke="#ffb545" strokeWidth="2.5" />

        {/* Barra de energia */}
        <rect x="200" y="248" width="230" height="26" rx="5" fill="#12181f" stroke="#2a3846" strokeWidth="2" />
        {['5V', 'GND', 'GND', 'VIN', '3V3', 'RST'].map((name, index) => (
          <g key={name + index}>
            <rect x={214 + index * 36} y={254} width="14" height="14" rx="2" fill="#2c3a4a" />
            <text x={221 + index * 36} y={290} className="svg-pin" textAnchor="middle">
              {name}
            </text>
          </g>
        ))}
        <rect {...highlight('power')} x="192" y="240" width="246" height="58" />

        {/* Microcontrolador */}
        <rect x="250" y="120" width="130" height="62" rx="6" fill="#14181c" stroke="#39485a" strokeWidth="2" />
        <circle cx="264" cy="134" r="4" fill="#5a6b80" />
        <text x="315" y="157" className="svg-label" textAnchor="middle" fill="#8fa8c4">
          CHIP
        </text>
        <rect {...highlight('chip')} x="240" y="110" width="150" height="82" />

        {/* Enfeites: LED da placa e cristal */}
        <circle cx="470" cy="120" r="7" fill="#ffb545" opacity="0.85" />
        <text x="470" y="146" className="svg-pin" textAnchor="middle">
          L
        </text>
        <rect x="440" y="180" width="46" height="22" rx="10" fill="#9aa7b4" />
      </svg>

      <div className="board__hotspots">
        {PARTS.map((part) => (
          <button
            key={part.id}
            type="button"
            className={`hotspot ${on(part.id) ? 'hotspot--active' : ''}`}
            onClick={() => setActive(on(part.id) ? null : part.id)}
            aria-pressed={on(part.id)}
          >
            <div className="hotspot__name">{part.name}</div>
            <div className="hotspot__desc">{part.desc}</div>
          </button>
        ))}
      </div>
      <p className="tiny" style={{ marginTop: 12 }}>
        Clique em uma parte para destacá-la na placa.
      </p>
    </div>
  )
}
