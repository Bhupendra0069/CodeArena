import { useEffect, useRef, useCallback } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

/**
 * Custom hook that creates and manages a Socket.IO connection for a battle room.
 *
 * @param {string|null} token   - JWT token for authentication
 * @param {object}      handlers - Map of socket event names to callback functions
 * @returns {{ socket: Socket|null, joinRoom, setReady, disconnect }}
 */
export const useBattleSocket = (token, handlers = {}) => {
  const socketRef = useRef(null)
  const handlersRef = useRef(handlers)

  // Keep handlers ref up to date without reconnecting
  useEffect(() => {
    handlersRef.current = handlers
  }, [handlers])

  useEffect(() => {
    if (!token) return

    // Create socket connection with JWT auth
    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    socketRef.current = socket

    // Register all event handlers from the handlers map
    const events = [
      'room_joined',
      'player_connected',
      'player_disconnected',
      'player_ready_update',
      'battle_started',
      'timer_update',
      'battle_finished',
      'error',
      'auth_error',
      'connect',
      'disconnect',
      'connect_error',
    ]

    events.forEach((event) => {
      socket.on(event, (...args) => {
        if (handlersRef.current[event]) {
          handlersRef.current[event](...args)
        }
      })
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [token]) // Only reconnect if token changes

  const joinRoom = useCallback((roomCode) => {
    socketRef.current?.emit('join_room', { roomCode })
  }, [])

  const setReady = useCallback((roomCode) => {
    socketRef.current?.emit('player_ready', { roomCode })
  }, [])

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect()
  }, [])

  return {
    socket: socketRef.current,
    joinRoom,
    setReady,
    disconnect,
  }
}
