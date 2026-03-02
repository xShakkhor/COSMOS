import { useRef, useEffect, useState, useCallback } from 'react'

export function useSoundEffects() {
  const audioContextRef = useRef(null)
  const [isEnabled, setIsEnabled] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
      }
      setIsEnabled(true)
    }
    
    const handleInteraction = () => {
      initAudio()
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('keydown', handleInteraction)
    }
    
    document.addEventListener('click', handleInteraction)
    document.addEventListener('keydown', handleInteraction)
    
    return () => {
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('keydown', handleInteraction)
    }
  }, [])

  const playTone = useCallback((frequency, duration, type = 'sine', volume = 0.1) => {
    if (!audioContextRef.current || isMuted) return
    
    try {
      const ctx = audioContextRef.current
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)
      oscillator.type = type
      
      gainNode.gain.setValueAtTime(volume, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + duration)
    } catch (e) {
      console.log('Audio error:', e)
    }
  }, [isMuted])

  const playClick = useCallback(() => {
    playTone(800, 0.1, 'sine', 0.08)
    setTimeout(() => playTone(1200, 0.05, 'sine', 0.05), 50)
  }, [playTone])

  const playWarp = useCallback(() => {
    const ctx = audioContextRef.current
    if (!ctx || isMuted) return
    
    try {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      oscillator.type = 'sawtooth'
      oscillator.frequency.setValueAtTime(200, ctx.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.5)
      
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
      
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.5)
    } catch (e) {
      console.log('Audio error:', e)
    }
  }, [isMuted])

  const playHover = useCallback(() => {
    playTone(600, 0.05, 'sine', 0.03)
  }, [playTone])

  const playSuccess = useCallback(() => {
    playTone(523, 0.1, 'sine', 0.08)
    setTimeout(() => playTone(659, 0.1, 'sine', 0.08), 100)
    setTimeout(() => playTone(784, 0.15, 'sine', 0.08), 200)
  }, [playTone])

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev)
  }, [])

  return {
    isEnabled,
    isMuted,
    playClick,
    playWarp,
    playHover,
    playSuccess,
    toggleMute
  }
}
