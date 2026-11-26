// Web Audio API Synthesizer & Voice Engine for SoundVault
// Generates authentic genre-matched musical tracks with melody, harmony, bass, and drums,
// alongside human voice track announcements via SpeechSynthesis.

class AudioEngine {
  constructor() {
    this.audioCtx = null
    this.masterGain = null
    this.isPlaying = false
    this.currentSong = null
    this.scheduleTimer = null
    this.speechUtterance = null
    this.lastSpokenSongId = null
    this.volume = 0.8
    this.isMuted = false

    // Timing tracking
    this.bpm = 110
    this.beatLength = 60 / 110
    this.stepIndex = 0
    this.nextNoteTime = 0
  }

  initContext() {
    if (typeof window === 'undefined') return false
    try {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext
        if (!AudioContext) return false
        this.audioCtx = new AudioContext()
        this.masterGain = this.audioCtx.createGain()
        this.masterGain.gain.setValueAtTime(
          this.isMuted ? 0 : Math.max(0, Math.min(1, this.volume)),
          this.audioCtx.currentTime
        )
        this.masterGain.connect(this.audioCtx.destination)
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume()
      }
      return true
    } catch (e) {
      console.warn('AudioContext initialization error:', e)
      return false
    }
  }

  setVolume(vol, isMuted) {
    this.volume = vol
    this.isMuted = isMuted
    if (this.audioCtx && this.masterGain) {
      const targetGain = isMuted ? 0 : Math.max(0, Math.min(1, vol))
      this.masterGain.gain.cancelScheduledValues(this.audioCtx.currentTime)
      this.masterGain.gain.linearRampToValueAtTime(
        targetGain,
        this.audioCtx.currentTime + 0.05
      )
    }
    if (isMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }

  // Voice announcement: Speaks the track intro with smooth voice
  speakVoiceAnnouncement(song) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    if (this.isMuted || this.volume <= 0) return

    try {
      window.speechSynthesis.cancel()
      const announcement = `Now playing: ${song.title}, by ${song.artist}`
      const utterance = new SpeechSynthesisUtterance(announcement)
      utterance.volume = Math.min(1, this.volume)
      utterance.rate = 1.0
      utterance.pitch = 1.05
      
      // Select an expressive natural English voice if available
      const voices = window.speechSynthesis.getVoices()
      const naturalVoice = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Natural') ||
            v.name.includes('Google') ||
            v.name.includes('Samantha') ||
            v.name.includes('David') ||
            v.name.includes('Zira'))
      ) || voices.find((v) => v.lang.startsWith('en'))
      
      if (naturalVoice) utterance.voice = naturalVoice

      window.speechSynthesis.speak(utterance)
      this.speechUtterance = utterance
    } catch (e) {
      console.warn('SpeechSynthesis error:', e)
    }
  }

  // Sound generator helpers
  createKick(time) {
    if (!this.audioCtx || !this.masterGain) return
    const osc = this.audioCtx.createOscillator()
    const gain = this.audioCtx.createGain()

    osc.frequency.setValueAtTime(140, time)
    osc.frequency.exponentialRampToValueAtTime(32, time + 0.15)

    gain.gain.setValueAtTime(0.7, time)
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2)

    osc.connect(gain)
    gain.connect(this.masterGain)

    osc.start(time)
    osc.stop(time + 0.22)
  }

  createSnare(time, soft = false) {
    if (!this.audioCtx || !this.masterGain) return
    // Noise buffer
    const bufferSize = Math.floor(this.audioCtx.sampleRate * 0.12)
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate)
    const output = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1
    }

    const whiteNoise = this.audioCtx.createBufferSource()
    whiteNoise.buffer = noiseBuffer

    const filter = this.audioCtx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.setValueAtTime(soft ? 1200 : 800, time)

    const gain = this.audioCtx.createGain()
    const vol = soft ? 0.2 : 0.35
    gain.gain.setValueAtTime(vol, time)
    gain.gain.exponentialRampToValueAtTime(0.001, time + (soft ? 0.08 : 0.12))

    whiteNoise.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)

    whiteNoise.start(time)
    whiteNoise.stop(time + 0.13)

    // Body tone
    const osc = this.audioCtx.createOscillator()
    const oscGain = this.audioCtx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(180, time)
    osc.frequency.exponentialRampToValueAtTime(80, time + 0.08)
    oscGain.gain.setValueAtTime(soft ? 0.15 : 0.3, time)
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.08)
    osc.connect(oscGain)
    oscGain.connect(this.masterGain)
    osc.start(time)
    osc.stop(time + 0.09)
  }

  createHiHat(time, open = false) {
    if (!this.audioCtx || !this.masterGain) return
    const dur = open ? 0.15 : 0.04
    const bufferSize = Math.floor(this.audioCtx.sampleRate * dur)
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate)
    const output = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1
    }

    const whiteNoise = this.audioCtx.createBufferSource()
    whiteNoise.buffer = noiseBuffer

    const filter = this.audioCtx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.setValueAtTime(7000, time)

    const gain = this.audioCtx.createGain()
    gain.gain.setValueAtTime(open ? 0.18 : 0.12, time)
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur)

    whiteNoise.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)

    whiteNoise.start(time)
    whiteNoise.stop(time + dur + 0.01)
  }

  playTone(freq, time, duration, type = 'sine', gainVal = 0.2, filterFreq = 2000) {
    if (!this.audioCtx || !this.masterGain || !freq) return
    const osc = this.audioCtx.createOscillator()
    const gain = this.audioCtx.createGain()
    const filter = this.audioCtx.createBiquadFilter()

    osc.type = type
    osc.frequency.setValueAtTime(freq, time)

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(filterFreq, time)

    gain.gain.setValueAtTime(0.001, time)
    gain.gain.linearRampToValueAtTime(gainVal, time + 0.03)
    gain.gain.exponentialRampToValueAtTime(0.001, time + Math.max(0.05, duration))

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)

    osc.start(time)
    osc.stop(time + duration + 0.05)
  }

  getGenreConfig(genre = 'Synthwave') {
    const g = genre.toLowerCase()
    if (g.includes('synth') || g.includes('retro')) {
      return {
        bpm: 114,
        type: 'synthwave',
        scale: [220, 261.63, 329.63, 392, 440, 523.25], // Am pentatonic
        chords: [
          [220, 261.63, 329.63], // Am
          [174.61, 220, 261.63], // F
          [130.81, 164.81, 196], // C
          [196, 246.94, 293.66]  // G
        ],
        bassNotes: [110, 87.31, 65.41, 98],
        leadWave: 'sawtooth',
        filterFreq: 1800
      }
    }
    if (g.includes('lo-fi') || g.includes('lofi')) {
      return {
        bpm: 76,
        type: 'lofi',
        scale: [146.83, 174.61, 220, 261.63, 293.66, 349.23],
        chords: [
          [146.83, 174.61, 220, 261.63], // Dm7
          [196, 246.94, 293.66, 349.23], // G7
          [130.81, 164.81, 196, 246.94], // Cmaj7
          [220, 261.63, 329.63, 392]     // Am7
        ],
        bassNotes: [73.42, 98, 65.41, 110],
        leadWave: 'triangle',
        filterFreq: 900
      }
    }
    if (g.includes('electronic') || g.includes('dance')) {
      return {
        bpm: 126,
        type: 'electronic',
        scale: [196, 220, 261.63, 293.66, 329.63, 392, 440],
        chords: [
          [196, 246.94, 293.66], // G
          [164.81, 196, 246.94], // Em
          [130.81, 164.81, 196], // C
          [146.83, 220, 293.66]  // D
        ],
        bassNotes: [98, 82.41, 65.41, 73.42],
        leadWave: 'sawtooth',
        filterFreq: 2400
      }
    }
    if (g.includes('r&b') || g.includes('soul')) {
      return {
        bpm: 86,
        type: 'rnb',
        scale: [233.08, 261.63, 277.18, 311.13, 349.23, 415.3],
        chords: [
          [233.08, 277.18, 349.23, 415.3], // Bbm7
          [155.56, 196, 233.08, 277.18],  // Eb7
          [207.65, 261.63, 311.13, 392],   // Abmaj7
          [138.59, 174.61, 207.65, 246.94] // Dbmaj7
        ],
        bassNotes: [116.54, 77.78, 103.83, 69.3],
        leadWave: 'triangle',
        filterFreq: 1100
      }
    }
    if (g.includes('rock')) {
      return {
        bpm: 128,
        type: 'rock',
        scale: [164.81, 196, 220, 246.94, 293.66, 329.63],
        chords: [
          [164.81, 246.94, 329.63], // E5
          [196, 293.66, 392],       // G5
          [220, 329.63, 440],       // A5
          [146.83, 220, 293.66]     // D5
        ],
        bassNotes: [82.41, 98, 110, 73.42],
        leadWave: 'sawtooth',
        filterFreq: 2800
      }
    }
    if (g.includes('jazz')) {
      return {
        bpm: 104,
        type: 'jazz',
        scale: [130.81, 155.56, 174.61, 196, 233.08, 261.63],
        chords: [
          [130.81, 155.56, 196, 233.08], // Cm7
          [174.61, 220, 261.63, 311.13], // F7
          [233.08, 293.66, 349.23, 440], // Bbmaj7
          [196, 246.94, 293.66, 349.23]  // G7
        ],
        bassNotes: [65.41, 87.31, 116.54, 98],
        leadWave: 'sine',
        filterFreq: 1200
      }
    }
    if (g.includes('classical')) {
      return {
        bpm: 88,
        type: 'classical',
        scale: [261.63, 293.66, 329.63, 349.23, 392, 440, 493.88, 523.25],
        chords: [
          [261.63, 329.63, 392], // C
          [220, 261.63, 329.63], // Am
          [174.61, 220, 261.63], // F
          [196, 246.94, 293.66]  // G
        ],
        bassNotes: [130.81, 110, 87.31, 98],
        leadWave: 'triangle',
        filterFreq: 2000
      }
    }
    if (g.includes('ambient')) {
      return {
        bpm: 54,
        type: 'ambient',
        scale: [146.83, 174.61, 220, 246.94, 293.66, 370],
        chords: [
          [146.83, 220, 293.66],
          [174.61, 220, 261.63],
          [196, 246.94, 293.66],
          [146.83, 220, 329.63]
        ],
        bassNotes: [73.42, 87.31, 98, 73.42],
        leadWave: 'sine',
        filterFreq: 700
      }
    }
    // Default Pop / Indie
    return {
      bpm: 118,
      type: 'pop',
      scale: [196, 220, 246.94, 293.66, 329.63, 392],
      chords: [
        [196, 246.94, 293.66],
        [164.81, 196, 246.94],
        [130.81, 164.81, 196],
        [146.83, 220, 293.66]
      ],
      bassNotes: [98, 82.41, 65.41, 73.42],
      leadWave: 'triangle',
      filterFreq: 1800
    }
  }

  // The sequencer step scheduler
  scheduleStep(stepIndex, time, config) {
    const { bpm, type, scale, chords, bassNotes, leadWave, filterFreq } = config
    const beat = 60 / bpm
    const stepInBar = stepIndex % 16 // 16 sixteenth-notes per bar
    const barIndex = Math.floor(stepIndex / 16)
    const chordIndex = barIndex % chords.length
    const currentChord = chords[chordIndex]
    const currentBass = bassNotes[chordIndex]

    // 1. DRUMS
    if (type === 'electronic') {
      // Four on the floor kick
      if (stepInBar % 4 === 0) this.createKick(time)
      // Clap / Snare on 4 and 12
      if (stepInBar === 4 || stepInBar === 12) this.createSnare(time)
      // Open hi-hat on offbeat (2, 6, 10, 14)
      if (stepInBar % 4 === 2) this.createHiHat(time, true)
    } else if (type === 'synthwave') {
      if (stepInBar === 0 || stepInBar === 8) this.createKick(time)
      if (stepInBar === 4 || stepInBar === 12) this.createSnare(time)
      if (stepInBar % 2 === 0) this.createHiHat(time, false)
    } else if (type === 'lofi') {
      if (stepInBar === 0 || stepInBar === 10) this.createKick(time)
      if (stepInBar === 4 || stepInBar === 12) this.createSnare(time, true)
      if (stepInBar % 4 === 0 || stepInBar % 4 === 3) this.createHiHat(time, false)
    } else if (type === 'rock') {
      if (stepInBar === 0 || stepInBar === 6 || stepInBar === 8) this.createKick(time)
      if (stepInBar === 4 || stepInBar === 12) this.createSnare(time)
      if (stepInBar % 2 === 0) this.createHiHat(time, false)
    } else if (type === 'ambient') {
      // Very minimal ambient rhythm
      if (stepInBar === 0 && barIndex % 2 === 0) this.createKick(time)
    } else {
      // Standard Pop / Indie / R&B
      if (stepInBar === 0 || stepInBar === 8) this.createKick(time)
      if (stepInBar === 4 || stepInBar === 12) this.createSnare(time)
      if (stepInBar % 2 === 0) this.createHiHat(time, false)
    }

    // 2. BASSLINE
    if (type === 'synthwave') {
      // Continuous 8th note rolling bass
      if (stepInBar % 2 === 0) {
        this.playTone(currentBass, time, beat * 0.45, 'sawtooth', 0.22, 500)
      }
    } else if (type === 'electronic') {
      if (stepInBar % 2 === 0) {
        const octaveNote = stepInBar % 4 === 2 ? currentBass * 2 : currentBass
        this.playTone(octaveNote, time, beat * 0.4, 'sawtooth', 0.25, 700)
      }
    } else if (type === 'ambient') {
      if (stepInBar === 0) {
        this.playTone(currentBass * 0.5, time, beat * 3.8, 'sine', 0.3, 300)
      }
    } else {
      // Standard bass on beat 1 and 3
      if (stepInBar === 0 || stepInBar === 8) {
        this.playTone(currentBass, time, beat * 0.8, 'triangle', 0.3, 400)
      }
    }

    // 3. CHORDS / HARMONY
    if (type === 'ambient') {
      if (stepInBar === 0) {
        currentChord.forEach((note) => {
          this.playTone(note, time, beat * 3.8, 'sine', 0.08, 600)
        })
      }
    } else if (type === 'classical') {
      // Waltz style: root on 1, chord on 2 and 3
      if (stepInBar === 0 || stepInBar === 5 || stepInBar === 10) {
        currentChord.forEach((note) => {
          this.playTone(note, time, beat * 0.8, 'triangle', 0.1, 1500)
        })
      }
    } else if (stepInBar === 0 || stepInBar === 8) {
      currentChord.forEach((note) => {
        this.playTone(note, time, beat * 1.8, 'triangle', 0.1, filterFreq)
      })
    }

    // 4. MELODY / ARPEGGIO
    if (type === 'synthwave' || type === 'electronic') {
      // 16th note arp
      const noteIdx = (stepInBar * 2 + barIndex) % scale.length
      const melodyFreq = scale[noteIdx]
      this.playTone(melodyFreq, time, beat * 0.22, leadWave, 0.12, filterFreq)
    } else if (type === 'lofi' || type === 'rnb') {
      // Chill syncopated lead
      if (stepInBar === 2 || stepInBar === 6 || stepInBar === 11 || stepInBar === 14) {
        const noteIdx = (stepInBar + barIndex * 3) % scale.length
        this.playTone(scale[noteIdx] * 2, time, beat * 0.4, 'sine', 0.15, 1200)
      }
    } else if (type === 'classical') {
      if (stepInBar % 2 === 0) {
        const noteIdx = (stepInBar / 2 + barIndex) % scale.length
        this.playTone(scale[noteIdx], time, beat * 0.35, 'triangle', 0.14, 1800)
      }
    } else {
      // Pop / Indie melody
      if (stepInBar === 0 || stepInBar === 3 || stepInBar === 7 || stepInBar === 10) {
        const noteIdx = (stepInBar + barIndex * 2) % scale.length
        this.playTone(scale[noteIdx], time, beat * 0.35, leadWave, 0.14, filterFreq)
      }
    }
  }

  startPlayback(song, startTimeSeconds = 0) {
    if (!song) return
    this.initContext()

    this.currentSong = song
    this.isPlaying = true
    const config = this.getGenreConfig(song.genre)
    this.bpm = config.bpm
    const stepDuration = 60 / this.bpm / 4 // 16th note duration

    // Compute step index based on current time
    this.stepIndex = Math.floor(startTimeSeconds / stepDuration)
    this.nextNoteTime = this.audioCtx.currentTime + 0.05

    // Trigger voice announcement on new song start
    if (this.lastSpokenSongId !== song.id && startTimeSeconds < 2) {
      this.lastSpokenSongId = song.id
      this.speakVoiceAnnouncement(song)
    }

    if (this.scheduleTimer) clearInterval(this.scheduleTimer)

    // Schedule ahead loop (Chris Wilson two-clocks pattern)
    this.scheduleTimer = setInterval(() => {
      if (!this.isPlaying || !this.audioCtx) return

      const lookahead = 0.25 // schedule 250ms ahead
      while (this.nextNoteTime < this.audioCtx.currentTime + lookahead) {
        this.scheduleStep(this.stepIndex, this.nextNoteTime, config)
        this.nextNoteTime += stepDuration
        this.stepIndex++
      }
    }, 50)
  }

  pause() {
    this.isPlaying = false
    if (this.scheduleTimer) {
      clearInterval(this.scheduleTimer)
      this.scheduleTimer = null
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }

  resume(startTimeSeconds = 0) {
    if (this.currentSong) {
      this.startPlayback(this.currentSong, startTimeSeconds)
    }
  }

  seek(song, newTimeSeconds) {
    this.startPlayback(song, newTimeSeconds)
  }

  stop() {
    this.pause()
    this.currentSong = null
    this.stepIndex = 0
  }
}

export const audioEngine = new AudioEngine()
