import { useCallback } from 'react'
import confetti from 'canvas-confetti'

/**
 * useSkyrocket — fires a "skyrocket" fireworks celebration effect.
 *
 * Usage:
 *   const { fireWin, fireDraw } = useSkyrocket()
 *   fireWin()   // big multi-burst winner celebration
 *   fireDraw()  // subtle dual-side confetti for a draw
 */
export const useSkyrocket = () => {
  /**
   * Single rocket burst from a given origin point.
   */
  const fireRocket = useCallback((originX, originY) => {
    confetti({
      particleCount: 120,
      spread: 70,
      startVelocity: 55,
      origin: { x: originX, y: originY },
      colors: ['#a855f7', '#c084fc', '#e879f9', '#facc15', '#34d399', '#60a5fa', '#f87171'],
      scalar: 1.2,
      gravity: 1,
      ticks: 300,
    })
  }, [])

  /**
   * Full skyrocket celebration: 3 sequential bursts from different positions.
   * Best for a WIN event.
   */
  const fireWin = useCallback(() => {
    // Initial center burst
    fireRocket(0.5, 0.6)

    // Left burst after 300ms
    setTimeout(() => {
      fireRocket(0.25, 0.65)
    }, 300)

    // Right burst after 600ms
    setTimeout(() => {
      fireRocket(0.75, 0.65)
    }, 600)

    // Grand finale — massive center burst
    setTimeout(() => {
      confetti({
        particleCount: 200,
        spread: 120,
        startVelocity: 65,
        origin: { x: 0.5, y: 0.55 },
        colors: ['#a855f7', '#c084fc', '#facc15', '#34d399', '#ffffff'],
        scalar: 1.4,
        gravity: 0.9,
        ticks: 400,
      })
    }, 900)
  }, [fireRocket])

  /**
   * Subtle dual-side confetti for a DRAW.
   */
  const fireDraw = useCallback(() => {
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: ['#facc15', '#fbbf24', '#d97706'],
      startVelocity: 45,
      ticks: 200,
    })
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: ['#facc15', '#fbbf24', '#d97706'],
      startVelocity: 45,
      ticks: 200,
    })
  }, [])

  return { fireWin, fireDraw, fireRocket }
}
