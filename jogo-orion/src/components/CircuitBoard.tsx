type Props = {
  /** true = caminho fechado, corrente circula, LED aceso. */
  closed: boolean
  /** Callback do clique na chave. Sem ele, a chave vira só ilustração. */
  onToggle?: () => void
  /** Rótulo da fonte à esquerda. */
  sourceLabel?: string
  /** Mostra um resistor entre a fonte e o LED. */
  withResistor?: boolean
}

/**
 * Circuito interativo em SVG (§16): bateria → chave → (resistor) → LED → volta.
 * O objetivo é fazer o aluno VER a diferença entre caminho aberto e fechado,
 * não simular eletricidade.
 */
export function CircuitBoard({
  closed,
  onToggle,
  sourceLabel = 'BATERIA',
  withResistor = false,
}: Props) {
  const wireClass = closed ? 'wire wire--live' : 'wire'

  return (
    <div className="circuit">
      <svg
        className="circuit__svg"
        viewBox="0 0 560 300"
        role="img"
        aria-label={
          closed
            ? 'Circuito fechado: a corrente percorre todo o caminho e o LED está aceso.'
            : 'Circuito aberto: há uma interrupção no caminho e o LED está apagado.'
        }
      >
        {/* ---- Fonte de energia ---- */}
        <rect
          x="24"
          y="110"
          width="76"
          height="86"
          rx="10"
          fill="#132542"
          stroke="#3d5a86"
          strokeWidth="2"
        />
        <rect x="40" y="128" width="44" height="12" rx="3" fill="#ffb545" />
        <rect x="40" y="150" width="44" height="8" rx="3" fill="#46608c" />
        <rect x="40" y="166" width="44" height="8" rx="3" fill="#46608c" />
        <text x="62" y="216" className="svg-label" textAnchor="middle">
          {sourceLabel}
        </text>
        <text x="62" y="102" className="svg-label" textAnchor="middle">
          + / −
        </text>

        {/* ---- Fio superior: fonte → chave ---- */}
        <path className={wireClass} d="M100 132 H 196" />
        {closed ? <path className="wire--flow" d="M100 132 H 196" /> : null}

        {/* ---- Chave (interruptor) ---- */}
        <circle cx="200" cy="132" r="6" fill="#7fa5d8" />
        <circle cx="268" cy="132" r="6" fill="#7fa5d8" />
        <g
          className={onToggle ? 'switch-hit' : undefined}
          onClick={() => onToggle?.()}
          role={onToggle ? 'button' : undefined}
          tabIndex={onToggle ? 0 : undefined}
          aria-label={onToggle ? (closed ? 'Abrir a chave' : 'Fechar a chave') : undefined}
          onKeyDown={(event) => {
            if (!onToggle) return
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              onToggle()
            }
          }}
        >
          {/* Área de clique generosa para uso no projetor. O retângulo também
              é o indicador de foco por teclado (ver .switch-frame no CSS). */}
          <rect
            className="switch-frame"
            x="184"
            y="86"
            width="100"
            height="66"
            rx="10"
            fill="transparent"
          />
          <line
            className="switch-knob"
            x1="200"
            y1="132"
            x2={closed ? 268 : 258}
            y2={closed ? 132 : 96}
            stroke={closed ? '#3ee0ff' : '#8fb0dd'}
            strokeWidth="6"
            strokeLinecap="round"
          />
        </g>
        <text x="234" y="176" className="svg-label" textAnchor="middle">
          CHAVE: {closed ? 'FECHADA' : 'ABERTA'}
        </text>

        {/* ---- Resistor opcional ---- */}
        {withResistor ? (
          <>
            <path className={wireClass} d="M268 132 H 320" />
            {closed ? <path className="wire--flow" d="M268 132 H 320" /> : null}
            <rect
              x="320"
              y="118"
              width="56"
              height="28"
              rx="6"
              fill="#2b1e12"
              stroke="#c99a4f"
              strokeWidth="2"
            />
            <rect x="330" y="118" width="5" height="28" fill="#c25c3a" />
            <rect x="341" y="118" width="5" height="28" fill="#111" />
            <rect x="352" y="118" width="5" height="28" fill="#c98f3a" />
            <text x="348" y="104" className="svg-label" textAnchor="middle">
              RESISTOR
            </text>
            <path className={wireClass} d="M376 132 H 452" />
            {closed ? <path className="wire--flow" d="M376 132 H 452" /> : null}
          </>
        ) : (
          <>
            <path className={wireClass} d="M268 132 H 452" />
            {closed ? <path className="wire--flow" d="M268 132 H 452" /> : null}
          </>
        )}

        {/* ---- LED ---- */}
        <g>
          {closed ? <circle cx="470" cy="132" r="42" fill="rgba(255,181,69,0.22)" /> : null}
          <circle
            className="led-glow"
            cx="470"
            cy="132"
            r="22"
            fill={closed ? '#ffcf6b' : '#3a4459'}
            stroke={closed ? '#ffb545' : '#5a6b80'}
            strokeWidth="3"
            style={closed ? { filter: 'drop-shadow(0 0 18px rgba(255,181,69,0.95))' } : undefined}
          />
          <path
            d="M462 146 v 34 M478 146 v 34"
            stroke="#8fb0dd"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <text
            x="470"
            y="92"
            className={`svg-label ${closed ? 'svg-label--bright' : ''}`}
            textAnchor="middle"
          >
            LED
          </text>
        </g>

        {/* ---- Retorno pelo fio de baixo ---- */}
        <path className={wireClass} d="M470 180 V 244 H 62 V 196" />
        {closed ? <path className="wire--flow" d="M470 180 V 244 H 62 V 196" /> : null}
        <text x="266" y="272" className="svg-label" textAnchor="middle">
          CAMINHO DE VOLTA
        </text>
      </svg>

      <div className="circuit__status">
        <span className={`badge ${closed ? 'badge--green' : 'badge--muted'}`}>
          {closed ? '🟢 Circuito fechado' : '⚪ Circuito aberto'}
        </span>
        <span className="muted">{closed ? 'O LED está aceso.' : 'O LED está apagado.'}</span>
      </div>
    </div>
  )
}
