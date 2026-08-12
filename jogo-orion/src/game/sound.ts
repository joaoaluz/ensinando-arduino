/**
 * Barramento de som (§36).
 *
 * No MVP não há áudio: esta camada existe para que adicionar som depois seja
 * trocar UMA função, sem tocar em nenhum componente. Zero dependências.
 *
 * Para ativar:
 *   1. coloque os arquivos em /public/sounds/<nome>.mp3
 *   2. troque `enabled` para true
 */
export type SoundName = 'click' | 'correct' | 'wrong' | 'alert' | 'xp' | 'achievement' | 'mission'

const enabled = false

const cache = new Map<SoundName, HTMLAudioElement>()

export function playSound(name: SoundName): void {
  if (!enabled) return
  try {
    let audio = cache.get(name)
    if (!audio) {
      audio = new Audio(`${import.meta.env.BASE_URL}sounds/${name}.mp3`)
      audio.volume = 0.4
      cache.set(name, audio)
    }
    audio.currentTime = 0
    void audio.play()
  } catch {
    // Áudio é enfeite: falhar aqui nunca pode interromper a aula.
  }
}
