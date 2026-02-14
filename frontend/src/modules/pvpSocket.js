import { io } from 'socket.io-client'

let socketInstance = null

export const getPvpServerUrl = () => {
  if(process.env.REACT_APP_PVP_SERVER_URL){
    return process.env.REACT_APP_PVP_SERVER_URL
  }

  if(typeof window !== 'undefined'){
    const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:'
    const hostname = window.location.hostname || 'localhost'
    return `${protocol}//${hostname}:4000`
  }

  return 'http://localhost:4000'
}

export const getPvpSocket = () => {
  if(socketInstance){
    return socketInstance
  }

  const serverUrl = getPvpServerUrl()
  socketInstance = io(serverUrl, {
    transports: ['websocket', 'polling'],
    autoConnect: true,
    timeout: 7000,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 600
  })

  return socketInstance
}

export const ensurePvpSocketConnected = (connectTimeoutMs = 7000) => {
  const socket = getPvpSocket()

  if(socket.connected){
    return Promise.resolve(socket)
  }

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      socket.off('connect', handleConnect)
      socket.off('connect_error', handleError)
      reject(new Error('Could not connect to PvP server'))
    }, connectTimeoutMs)

    const handleConnect = () => {
      clearTimeout(timeoutId)
      socket.off('connect_error', handleError)
      resolve(socket)
    }

    const handleError = () => {
      clearTimeout(timeoutId)
      socket.off('connect', handleConnect)
      reject(new Error('Could not connect to PvP server'))
    }

    socket.once('connect', handleConnect)
    socket.once('connect_error', handleError)
    socket.connect()
  })
}

export const emitPvpAck = (socket, eventName, payload, ackTimeoutMs = 8000) => {
  return new Promise((resolve, reject) => {
    socket.timeout(ackTimeoutMs).emit(eventName, payload, (error, response) => {
      if(error){
        reject(new Error(`Request timeout: ${eventName}`))
        return
      }

      resolve(response)
    })
  })
}

export const disconnectPvpSocket = () => {
  if(socketInstance){
    socketInstance.disconnect()
    socketInstance = null
  }
}
