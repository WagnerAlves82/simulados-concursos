import { useEffect, useState, useCallback } from 'react'

export function useTimer(initialTime: number, onTimeUp?: () => void) {
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return

    const interval = setInterval(() => {
      setTimeLeft(time => {
        if (time <= 1) {
          setIsRunning(false)
          onTimeUp?.()
          return 0
        }
        return time - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, timeLeft, onTimeUp])

  const start = useCallback(() => setIsRunning(true), [])
  const pause = useCallback(() => setIsRunning(false), [])
  const reset = useCallback((newTime?: number) => {
    setTimeLeft(newTime || initialTime)
    setIsRunning(false)
  }, [initialTime])

  return {
    timeLeft,
    isRunning,
    start,
    pause,
    reset
  }
}
