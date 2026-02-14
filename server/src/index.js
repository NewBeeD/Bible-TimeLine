import { createServer } from 'http'
import { Server } from 'socket.io'
import { allData, newTestamentEvents, oldTestamentEvents } from '../../frontend/src/data/csvjson.js'

const PORT = Number(process.env.PORT || 4000)
const ROUND_PLAN_DEFAULT = [4, 4, 4, 5, 5, 6]

const server = createServer()
const io = new Server(server, {
  cors: {
    origin: '*'
  }
})

const rooms = new Map()

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

const pickDataByCategory = (category) => {
  if(category === 1){ return oldTestamentEvents }
  if(category === 2){ return newTestamentEvents }
  return allData
}

const createRoomCode = () => {
  let tries = 0
  while(tries < 1000){
    const code = String(randomInt(100000, 999999))
    if(!rooms.has(code)){
      return code
    }
    tries += 1
  }

  return null
}

const randomUniqueIndexes = (size, maxExclusive) => {
  const values = new Set()
  while(values.size < size){
    values.add(randomInt(0, maxExclusive - 1))
  }
  return [...values]
}

const shuffle = (arr) => {
  const copy = [...arr]
  for(let i = copy.length - 1; i > 0; i -= 1){
    const j = Math.floor(Math.random() * (i + 1))
    const temp = copy[i]
    copy[i] = copy[j]
    copy[j] = temp
  }
  return copy
}

const timerFromLevel = (level) => {
  if(level === 4){ return 30 }
  if(level === 5){ return 40 }
  if(level === 6){ return 50 }
  return 30
}

const emitRoomState = (room) => {
  const payload = {
    roomCode: room.code,
    hostPlayerId: room.hostPlayerId,
    status: room.status,
    players: room.players.map((player) => ({
      playerId: player.playerId,
      name: player.name,
      avatar: player.avatar,
      uid: player.uid,
      ready: player.ready,
      connected: player.connected,
      totalPoints: player.totalPoints
    })),
    settings: {
      category: room.settings.category,
      maxPlayers: room.settings.maxPlayers,
      roundPlan: room.roundPlan
    },
    activeRound: room.activeRound
      ? {
          roundId: room.activeRound.roundId,
          roundNumber: room.activeRound.roundNumber,
          totalRounds: room.activeRound.totalRounds,
          difficultyLevel: room.activeRound.difficultyLevel,
          endsAt: room.activeRound.endsAt,
          events: room.activeRound.events,
          correctOrder: room.activeRound.correctOrder
        }
      : null
  }

  io.to(room.code).emit('room_state', payload)
}

const getLeaderboard = (room, roundPointsMap = new Map()) => {
  return [...room.players]
    .map((player) => ({
      playerId: player.playerId,
      name: player.name,
      avatar: player.avatar,
      uid: player.uid,
      roundPoints: roundPointsMap.get(player.playerId) || 0,
      totalPoints: player.totalPoints
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints)
}

const closeRoomForEveryone = (room, reason = 'Room closed') => {
  if(!room){
    return
  }

  if(room.roundTimeout){
    clearTimeout(room.roundTimeout)
    room.roundTimeout = null
  }

  io.to(room.code).emit('room_closed', {
    roomCode: room.code,
    reason
  })

  rooms.delete(room.code)
}

const endRound = (room, reason) => {
  if(!room.activeRound){
    return
  }

  if(room.roundTimeout){
    clearTimeout(room.roundTimeout)
    room.roundTimeout = null
  }

  const roundPoints = new Map()

  room.players.forEach((player) => {
    const submission = room.activeRound.submissions.get(player.playerId)
    const points = submission?.points || 0
    roundPoints.set(player.playerId, points)
  })

  room.status = 'round_results'
  const leaderboard = getLeaderboard(room, roundPoints)
  const payload = {
    roomCode: room.code,
    reason,
    roundNumber: room.activeRound.roundNumber,
    totalRounds: room.activeRound.totalRounds,
    leaderboard
  }

  io.to(room.code).emit('round_ended', payload)
  room.lastRoundPayload = payload

  const isLastRound = room.roundIndex === room.roundPlan.length - 1
  if(isLastRound){
    room.status = 'finished'
    const finalPayload = {
      roomCode: room.code,
      category: room.settings.category,
      leaderboard: getLeaderboard(room)
    }
    io.to(room.code).emit('match_ended', finalPayload)
  }

  room.activeRound = null

  emitRoomState(room)
}

const startRound = (room) => {
  if(room.roundIndex >= room.roundPlan.length){
    room.status = 'finished'
    const finalPayload = {
      roomCode: room.code,
      category: room.settings.category,
      leaderboard: getLeaderboard(room)
    }
    io.to(room.code).emit('match_ended', finalPayload)
    emitRoomState(room)
    return
  }

  room.status = 'in_round'

  const difficultyLevel = room.roundPlan[room.roundIndex]
  const timerSeconds = timerFromLevel(difficultyLevel)
  const source = pickDataByCategory(room.settings.category)

  const itemCount = Math.min(difficultyLevel, source.length)
  const indexes = randomUniqueIndexes(itemCount, source.length)
  const events = indexes.map((idx) => source[idx]).filter(Boolean)
  const shuffledEvents = shuffle(events)
  const correctOrder = [...events].sort((a, b) => a.id - b.id).map((item) => item.id)

  const now = Date.now()
  const activeRound = {
    roundId: `${room.code}-${room.roundIndex + 1}-${now}`,
    roundNumber: room.roundIndex + 1,
    totalRounds: room.roundPlan.length,
    difficultyLevel,
    timerSeconds,
    startsAt: now,
    endsAt: now + timerSeconds * 1000,
    events: shuffledEvents,
    correctOrder,
    submissions: new Map()
  }

  room.activeRound = activeRound

  const payload = {
    roomCode: room.code,
    roundId: activeRound.roundId,
    roundNumber: activeRound.roundNumber,
    totalRounds: activeRound.totalRounds,
    difficultyLevel: activeRound.difficultyLevel,
    timerSeconds,
    endsAt: activeRound.endsAt,
    events: activeRound.events,
    correctOrder: activeRound.correctOrder
  }

  io.to(room.code).emit('round_started', payload)
  io.to(room.code).emit('match_started', { roomCode: room.code })
  emitRoomState(room)

  room.roundTimeout = setTimeout(() => {
    endRound(room, 'timer_ended')
  }, timerSeconds * 1000)
}

io.on('connection', (socket) => {
  socket.on('create_room', (payload, callback) => {
    const roomCode = createRoomCode()
    if(!roomCode){
      callback?.({ ok: false, error: 'Could not allocate room code' })
      return
    }

    const playerId = `${Date.now()}-${Math.floor(Math.random() * 100000)}`
    const hostName = payload?.host?.name || 'Host'

    const room = {
      code: roomCode,
      hostPlayerId: playerId,
      status: 'lobby',
      settings: {
        category: payload?.settings?.category || 2,
        maxPlayers: Math.min(20, Math.max(2, Number(payload?.settings?.maxPlayers) || 4))
      },
      roundPlan: Array.isArray(payload?.settings?.roundPlan) && payload.settings.roundPlan.length > 0 ? payload.settings.roundPlan : ROUND_PLAN_DEFAULT,
      players: [
        {
          playerId,
          socketId: socket.id,
          name: hostName,
          avatar: payload?.host?.avatar || '',
          uid: payload?.host?.uid || null,
          ready: true,
          connected: true,
          totalPoints: 0
        }
      ],
      roundIndex: 0,
      activeRound: null,
      roundTimeout: null,
      lastRoundPayload: null
    }

    rooms.set(roomCode, room)
    socket.join(roomCode)

    callback?.({ ok: true, roomCode, playerId })
    emitRoomState(room)
  })

  socket.on('join_room', (payload, callback) => {
    const roomCode = String(payload?.roomCode || '').trim()
    const room = rooms.get(roomCode)

    if(!room){
      callback?.({ ok: false, error: 'Room not found' })
      return
    }

    if(room.status !== 'lobby'){
      callback?.({ ok: false, error: 'Match already started' })
      return
    }

    if(room.players.length >= room.settings.maxPlayers){
      callback?.({ ok: false, error: 'Room is full' })
      return
    }

    const playerId = `${Date.now()}-${Math.floor(Math.random() * 100000)}`

    room.players.push({
      playerId,
      socketId: socket.id,
      name: payload?.player?.name || 'Player',
      avatar: payload?.player?.avatar || '',
      uid: payload?.player?.uid || null,
      ready: true,
      connected: true,
      totalPoints: 0
    })

    socket.join(roomCode)

    callback?.({ ok: true, roomCode, playerId })
    emitRoomState(room)
  })

  socket.on('get_room_state', (payload) => {
    const roomCode = String(payload?.roomCode || '').trim()
    const room = rooms.get(roomCode)
    if(room){
      emitRoomState(room)
      if(room.lastRoundPayload && room.status === 'round_results'){
        socket.emit('round_ended', room.lastRoundPayload)
      }
    }
  })

  socket.on('set_ready', (payload) => {
    const room = rooms.get(String(payload?.roomCode || '').trim())
    if(!room || room.status !== 'lobby'){
      return
    }

    const player = room.players.find((item) => item.playerId === payload?.playerId)
    if(!player){
      return
    }

    player.ready = Boolean(payload?.ready)
    emitRoomState(room)
  })

  socket.on('start_match', (payload) => {
    const room = rooms.get(String(payload?.roomCode || '').trim())
    if(!room || room.status !== 'lobby'){
      return
    }

    if(room.hostPlayerId !== payload?.playerId){
      socket.emit('room_error', { roomCode: room.code, error: 'Only host can start the match' })
      return
    }

    const hasEnoughPlayers = room.players.length > 1
    if(!hasEnoughPlayers){
      socket.emit('room_error', { roomCode: room.code, error: 'At least 2 players are required' })
      return
    }

    room.roundIndex = 0
    startRound(room)
  })

  socket.on('submit_order', (payload) => {
    const room = rooms.get(String(payload?.roomCode || '').trim())
    if(!room || room.status !== 'in_round' || !room.activeRound){
      return
    }

    if(room.activeRound.roundId !== payload?.roundId){
      return
    }

    const player = room.players.find((item) => item.playerId === payload?.playerId)
    if(!player){
      return
    }

    if(room.activeRound.submissions.has(player.playerId)){
      return
    }

    const points = payload?.isCorrect ? 1 : 0

    room.activeRound.submissions.set(player.playerId, {
      isCorrect: Boolean(payload?.isCorrect),
      submittedOrder: Array.isArray(payload?.submittedOrder) ? payload.submittedOrder : [],
      submittedAt: Date.now(),
      points
    })

    player.totalPoints += points

    const everyoneSubmitted = room.players.every((entry) => room.activeRound.submissions.has(entry.playerId))
    if(everyoneSubmitted){
      endRound(room, 'all_submitted')
    }
  })

  socket.on('next_round', (payload) => {
    const room = rooms.get(String(payload?.roomCode || '').trim())
    if(!room || room.status !== 'round_results'){
      return
    }

    if(room.hostPlayerId !== payload?.playerId){
      socket.emit('room_error', { roomCode: room.code, error: 'Only host can continue' })
      return
    }

    room.roundIndex += 1
    startRound(room)
  })

  socket.on('leave_room', (payload) => {
    const roomCode = String(payload?.roomCode || '').trim()
    const room = rooms.get(roomCode)
    if(!room){
      return
    }

    const playerId = payload?.playerId
    if(!playerId){
      return
    }

    if(room.hostPlayerId === playerId){
      closeRoomForEveryone(room, 'Host left the game')
      return
    }

    room.players = room.players.filter((player) => player.playerId !== playerId)
    socket.leave(roomCode)

    if(room.players.length === 0){
      closeRoomForEveryone(room, 'Room is empty')
      return
    }

    emitRoomState(room)
  })

  socket.on('disconnect', () => {
    rooms.forEach((room, roomCode) => {
      const disconnectedPlayer = room.players.find((player) => player.socketId === socket.id)
      if(!disconnectedPlayer){
        return
      }

      if(disconnectedPlayer.playerId === room.hostPlayerId){
        closeRoomForEveryone(room, 'Host disconnected')
        return
      }

      let changed = false

      room.players.forEach((player) => {
        if(player.socketId === socket.id){
          player.connected = false
          changed = true
        }
      })

      if(changed){
        emitRoomState(room)
      }

      if(room.players.every((player) => !player.connected)){
        if(room.roundTimeout){
          clearTimeout(room.roundTimeout)
        }
        rooms.delete(roomCode)
      }
    })
  })
})

server.listen(PORT, () => {
  console.log(`PvP websocket server running on port ${PORT}`)
})
