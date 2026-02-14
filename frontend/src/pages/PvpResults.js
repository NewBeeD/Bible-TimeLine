import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Alert, Avatar, Box, Button, Chip, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Stack, Typography } from '@mui/material'
import { getPvpSocket } from '../modules/pvpSocket'
import { auth } from '../firebaseAuth/firebaseSDK'
import { upsertPvpCategoryStats } from '../modules/firebaseScores'
import { PvpConnectionBadge } from '../components/PvpConnectionBadge'

export const PvpResults = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const roomCode = location.state?.roomCode
  const playerId = location.state?.playerId

  const [results, setResults] = useState(location.state?.roundResults || null)
  const [room, setRoom] = useState(null)
  const [finalBoard, setFinalBoard] = useState(null)
  const [error, setError] = useState('')
  const [confirmExitOpen, setConfirmExitOpen] = useState(false)
  const hasSavedFinalStats = useRef(false)

  const amHost = useMemo(() => room?.hostPlayerId === playerId, [room, playerId])

  useEffect(() => {
    if(!roomCode || !playerId){
      navigate('/pvp/join', { replace: true })
      return
    }

    const socket = getPvpSocket()

    const handleRoundEnded = (payload) => {
      if(payload?.roomCode === roomCode){
        setResults(payload)
      }
    }

    const handleRoundStarted = (payload) => {
      if(payload?.roomCode === roomCode){
        navigate('/pvp/round', { state: { roomCode, playerId } })
      }
    }

    const handleMatchEnded = (payload) => {
      if(payload?.roomCode === roomCode){
        setFinalBoard(payload)
      }
    }

    const handleRoomState = (payload) => {
      if(payload?.roomCode === roomCode){
        setRoom(payload)
      }
    }

    const handleRoomClosed = (payload) => {
      if(payload?.roomCode === roomCode){
        navigate('/pvp/join', { replace: true })
      }
    }

    const handleRoomError = (payload) => {
      if(payload?.roomCode === roomCode){
        setError(payload?.error || 'Room error')
      }
    }

    socket.on('round_ended', handleRoundEnded)
    socket.on('round_started', handleRoundStarted)
    socket.on('match_ended', handleMatchEnded)
    socket.on('room_state', handleRoomState)
    socket.on('room_closed', handleRoomClosed)
    socket.on('room_error', handleRoomError)

    socket.emit('get_room_state', { roomCode })

    return () => {
      socket.off('round_ended', handleRoundEnded)
      socket.off('round_started', handleRoundStarted)
      socket.off('match_ended', handleMatchEnded)
      socket.off('room_state', handleRoomState)
      socket.off('room_closed', handleRoomClosed)
      socket.off('room_error', handleRoomError)
    }
  }, [navigate, roomCode, playerId])

  const nextRound = () => {
    const socket = getPvpSocket()
    socket.emit('next_round', { roomCode, playerId })
  }

  const board = finalBoard?.leaderboard || results?.leaderboard || []

  const leaveGame = () => {
    const socket = getPvpSocket()
    socket.emit('leave_room', { roomCode, playerId })
    navigate('/', { replace: true })
  }

  const handleExitClick = () => {
    if(amHost){
      leaveGame()
      return
    }

    setConfirmExitOpen(true)
  }

  useEffect(() => {
    const persistFinalStats = async () => {
      if(!finalBoard || hasSavedFinalStats.current){
        return
      }

      const user = auth.currentUser
      if(!user){
        return
      }

      const me = finalBoard.leaderboard?.find((entry) => entry.uid && entry.uid === user.uid)
      if(!me){
        return
      }

      const winner = finalBoard.leaderboard?.[0]
      const didWin = winner?.uid && winner.uid === user.uid

      hasSavedFinalStats.current = true
      await upsertPvpCategoryStats({
        categoryMode: finalBoard.category,
        points: me.totalPoints || 0,
        won: didWin
      })
    }

    persistFinalStats().catch(() => {
      hasSavedFinalStats.current = false
    })
  }, [finalBoard])

  return (
    <Box
      minHeight='100vh'
      sx={{
        background: 'linear-gradient(135deg, #173174 0%, #1f2833 45%, #0b0c10 100%)',
        py: { xs: 3, sm: 6 }
      }}
    >
      <Container maxWidth='md'>
        <Paper
          elevation={8}
          sx={{
            p: { xs: 2.5, sm: 4 },
            borderRadius: 3,
            backgroundColor: 'rgba(11, 12, 16, 0.9)',
            border: '1px solid rgba(255,255,255,0.12)'
          }}
        >
          <Stack spacing={2.2}>
            <Stack direction='row' alignItems='center' justifyContent='space-between'>
              <Typography variant='h5' sx={{ color: 'white', fontWeight: 700 }}>
                {finalBoard ? 'Final Leaderboard 🏆' : `Round ${results?.roundNumber || '-'} Results`}
              </Typography>
              <Stack direction='row' spacing={1}>
                <PvpConnectionBadge />
                <Button size='small' variant='outlined' color='error' onClick={handleExitClick}>Exit Game</Button>
              </Stack>
            </Stack>

            {error && <Alert severity='error'>{error}</Alert>}

            <Stack spacing={1}>
              {board.map((entry, index) => (
                <Paper
                  key={entry.playerId}
                  elevation={0}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    border: '1px solid rgba(255,255,255,0.16)',
                    backgroundColor: index === 0 ? 'rgba(25, 118, 210, 0.2)' : 'rgba(255,255,255,0.04)'
                  }}
                >
                  <Stack direction='row' spacing={1.5} alignItems='center' justifyContent='space-between'>
                    <Stack direction='row' spacing={1.2} alignItems='center'>
                      <Chip size='small' label={index + 1} color={index === 0 ? 'secondary' : 'default'} sx={{ color: index === 0 ? 'white' : '#f3f4f6' }} />
                      <Avatar src={entry.avatar || ''} alt={entry.name} />
                      <Typography sx={{ color: 'white', fontWeight: 600 }}>{entry.name}</Typography>
                    </Stack>

                    <Stack direction='row' spacing={1}>
                      {!finalBoard && <Chip label={`Round: ${entry.roundPoints || 0}`} size='small' variant='outlined' sx={{ color: '#f3f4f6' }} />}
                      <Chip label={`Total: ${entry.totalPoints || 0}`} size='small' color='secondary' sx={{ color: 'white' }} />
                    </Stack>
                  </Stack>
                </Paper>
              ))}
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              {!finalBoard && amHost && <Button variant='contained' fullWidth onClick={nextRound}>Next Round</Button>}
              {!finalBoard && !amHost && <Typography sx={{ color: 'grey.300', alignSelf: 'center' }}>Waiting for host to continue...</Typography>}
            </Stack>

            <Dialog open={confirmExitOpen} onClose={() => setConfirmExitOpen(false)}>
              <DialogTitle>Leave Match?</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  If you leave now, you will exit this PvP match and return to home.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setConfirmExitOpen(false)}>Cancel</Button>
                <Button color='error' onClick={leaveGame}>Exit Match</Button>
              </DialogActions>
            </Dialog>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}
