export const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition
export const canRecord = Boolean(navigator.mediaDevices?.getUserMedia && window.MediaRecorder)

export function browserSpeak(text, code, onStart, onEnd) {
  if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
    onEnd()
    return
  }
  const utterance = new SpeechSynthesisUtterance(text)
  const voices = speechSynthesis.getVoices()
  const findVoice = tag => voices.find(voice => voice.lang.toLowerCase() === tag.toLowerCase())
    || voices.find(voice => voice.lang.toLowerCase().split('-')[0] === tag.toLowerCase().split('-')[0])
  const voice = findVoice(code) || (code === 'kaa' && (findVoice('uz-UZ') || findVoice('ru-RU')))
  if (voice) utterance.voice = voice
  utterance.lang = voice?.lang || (code === 'kaa' ? 'uz-UZ' : code)
  utterance.rate = 0.86
  utterance.onstart = onStart
  utterance.onend = onEnd
  utterance.onerror = onEnd
  speechSynthesis.speak(utterance)
}

export function rewardSound() {
  const Context = window.AudioContext || window.webkitAudioContext
  if (!Context) return
  try {
    const audio = new Context()
    const now = audio.currentTime
    ;[523.25, 659.25, 783.99].forEach((frequency, index) => {
      const oscillator = audio.createOscillator()
      const gain = audio.createGain()
      const start = now + index * 0.08
      oscillator.frequency.value = frequency
      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.exponentialRampToValueAtTime(0.055, start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.19)
      oscillator.connect(gain).connect(audio.destination)
      oscillator.start(start)
      oscillator.stop(start + 0.2)
    })
    setTimeout(() => audio.close().catch(() => {}), 500)
  } catch {}
}
