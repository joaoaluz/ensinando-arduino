import { useState, type ReactNode } from 'react'
import { Panel } from './Panel'
import { Button } from './Button'
import { Feedback } from './Feedback'
import { HintSystem } from './HintSystem'
import { playSound } from '../game/sound'
import { XP } from '../game/xp'

export const SOLUTION = `int led = 13;

void setup() {
    pinMode(led, OUTPUT);
}

void loop() {
    digitalWrite(led, HIGH);
    delay(1000);

    digitalWrite(led, LOW);
    delay(1000);
}
`

const STARTER = `void setup() {

}

void loop() {

}
`

/** Remove comentários e normaliza espaços — a validação não é um compilador (§26). */
function normalize(code: string): string {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/\/\/[^\n]*/g, ' ')
    .replace(/\s+/g, ' ')
}

type Check = {
  id: string
  label: string
  ok: (code: string) => boolean
  /** Mensagem contextual quando falha — nunca entrega a resposta (§27). */
  message: string
}

const CHECKS: Check[] = [
  {
    id: 'setup',
    label: 'void setup()',
    ok: (code) => /void\s+setup\s*\(\s*\)/.test(code),
    message:
      'Faltou o bloco que roda uma única vez, quando a estação liga. Sem ele o Arduino não sabe se preparar.',
  },
  {
    id: 'loop',
    label: 'void loop()',
    ok: (code) => /void\s+loop\s*\(\s*\)/.test(code),
    message:
      'Faltou o bloco que se repete para sempre. Um sinalizador precisa piscar sem parar — não uma vez só.',
  },
  {
    id: 'pinMode',
    label: 'pinMode(...)',
    ok: (code) => /pinMode\s*\(/.test(code),
    message: 'O Arduino ainda não sabe o que fazer com o pino 13. Falta configurá-lo.',
  },
  {
    id: 'OUTPUT',
    label: 'OUTPUT',
    ok: (code) => /pinMode\s*\([^)]*OUTPUT\s*\)/.test(code),
    message:
      'O pino está configurado, mas não como saída. Para acender um LED, o pino precisa ESCREVER energia, não ler.',
  },
  {
    id: 'HIGH',
    label: 'digitalWrite(..., HIGH)',
    ok: (code) => /digitalWrite\s*\([^)]*HIGH\s*\)/.test(code),
    message: 'Nenhum comando liga o sinalizador. Falta mandar o pino 13 para o estado ligado.',
  },
  {
    id: 'LOW',
    label: 'digitalWrite(..., LOW)',
    ok: (code) => /digitalWrite\s*\([^)]*LOW\s*\)/.test(code),
    message:
      '⚠️ O sinalizador recebeu um comando, mas não encontramos uma instrução para desligá-lo. Assim ele acende e fica aceso.',
  },
  {
    id: 'delay',
    label: 'delay(...)',
    ok: (code) => /delay\s*\(\s*\d+\s*\)/.test(code),
    message:
      'O sinalizador liga e desliga tão rápido que ninguém consegue ver. Falta uma pausa entre as duas coisas.',
  },
  {
    id: 'delay2',
    label: 'duas pausas',
    ok: (code) => (code.match(/delay\s*\(\s*\d+\s*\)/g) ?? []).length >= 2,
    message:
      'Só existe uma pausa. Ele fica aceso um tempo, mas apaga e volta a acender instantaneamente. Falta uma pausa depois de desligar.',
  },
]

type Props = {
  /** Disparado quando o programa passa em todas as verificações. */
  onCorrect?: () => void
  xpAmount?: number
  onSolved: () => void
  /** Rodapé mostrado após validar com sucesso. */
  successExtra?: ReactNode
}

/** Editor final (§26): valida por presença de elementos, não por compilação. */
export function CodeEditor({ onCorrect, xpAmount = XP.CODE, onSolved, successExtra }: Props) {
  const [code, setCode] = useState(STARTER)
  const [results, setResults] = useState<Record<string, boolean> | null>(null)
  const [failure, setFailure] = useState<string | null>(null)
  const [solved, setSolved] = useState(false)
  const [attempts, setAttempts] = useState(0)

  function run() {
    const normalized = normalize(code)
    const map: Record<string, boolean> = {}
    for (const check of CHECKS) map[check.id] = check.ok(normalized)
    setResults(map)

    const firstFail = CHECKS.find((check) => !map[check.id])
    if (!firstFail) {
      playSound('correct')
      setFailure(null)
      setSolved(true)
      onCorrect?.()
      return
    }

    playSound('wrong')
    setFailure(firstFail.message)
    setAttempts((n) => n + 1)
  }

  return (
    <Panel hud>
      <h3 className="question">Escreva o programa do sinalizador</h3>
      <p className="question__hint">
        Use tudo o que você descobriu até aqui. O pino do sinalizador é o <strong>13</strong> e ele
        deve ficar 1 segundo aceso e 1 segundo apagado. Lembre: <code>delay()</code> conta em
        milissegundos, então 1 segundo é <code>1000</code>.
      </p>

      <div className="editor__toolbar">
        <span className="badge">📟 Console de programação</span>
        <div className="btn-row">
          <Button size="sm" variant="ghost" onClick={() => setCode(STARTER)} disabled={solved}>
            Recomeçar do zero
          </Button>
        </div>
      </div>

      <textarea
        className="editor"
        value={code}
        spellCheck={false}
        onChange={(event) => setCode(event.target.value)}
        readOnly={solved}
        aria-label="Editor de código do sinalizador"
      />

      {results ? (
        <div className="checklist" aria-label="Verificações do programa">
          {CHECKS.map((check) => (
            <div key={check.id} className={`check ${results[check.id] ? 'check--ok' : ''}`}>
              <span aria-hidden="true">{results[check.id] ? '✔' : '○'}</span>
              {check.label}
            </div>
          ))}
        </div>
      ) : null}

      {!solved ? (
        <div className="btn-row" style={{ marginTop: 24 }}>
          <Button variant="primary" onClick={run}>
            ▶ Enviar para o Arduino
          </Button>
        </div>
      ) : null}

      {failure && !solved ? (
        <Feedback kind="wrong" title="O sinalizador ainda não pisca.">
          {failure}
        </Feedback>
      ) : null}

      {solved ? (
        <>
          <Feedback kind="correct" title="🚨 Programa aceito">
            O sinalizador começou a piscar. É exatamente este programa que você vai enviar para o
            Arduino de verdade.
            <div className="feedback__xp">+{xpAmount} XP</div>
          </Feedback>
          {successExtra}
          <div className="btn-row" style={{ marginTop: 24 }}>
            <Button variant="success" onClick={() => onSolved()}>
              Continuar →
            </Button>
          </div>
        </>
      ) : null}

      {!solved ? (
        <HintSystem
          hints={[
            'Dentro de setup() vai a configuração do pino. Dentro de loop() vai a sequência que se repete: ligar, esperar, desligar, esperar.',
            'Procure por pinMode(13, OUTPUT); em setup(), e por digitalWrite(13, HIGH); / delay(1000); / digitalWrite(13, LOW); / delay(1000); em loop().',
          ]}
          autoReveal={attempts >= 2 ? 1 : 0}
        />
      ) : null}
    </Panel>
  )
}
