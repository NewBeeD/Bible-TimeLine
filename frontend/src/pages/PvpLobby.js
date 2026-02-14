import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Alert, Avatar, Box, Button, Chip, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Paper, Stack, Typography } from '@mui/material'
import { getPvpSocket } from '../modules/pvpSocket'
import { PvpConnectionBadge } from '../components/PvpConnectionBadge'

export const PvpLobby = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [room, setRoom] = useState(null)
  const [error, setError] = useState('')
  const [confirmExitOpen, setConfirmExitOpen] = useState(false)

  const roomCode = location.state?.roomCode
  const playerId = location.state?.playerId

  const amHost = room?.hostPlayerId === playerId

  const buildFallbackColor = (seed = '') => {
    const palette = ['#2563eb', '#7c3aed', '#0891b2', '#16a34a', '#db2777', '#f59e0b', '#ea580c']
    const index = Math.abs(seed.split('').reduce((total, char) => total + char.charCodeAt(0), 0)) % palette.length
    return palette[index]
  }

  const buildAvatarLabel = (name = '') => {
    const trimmed = name.trim()
    if(!trimmed){
      return 'P'
    }
    return trimmed[0].toUpperCase()
  }

  useEffect(() => {
    if(!roomCode || !playerId){
      navigate('/pvp/join', { replace: true })
      return
    }

    const socket = getPvpSocket()

    const handleRoomState = (payload) => {
      if(payload?.roomCode === roomCode){
        setRoom(payload)
      }
    }

    const handleMatchStarted = (payload) => {
      if(payload?.roomCode === roomCode){
        navigate('/pvp/round', { state: { roomCode, playerId } })
      }
    }

    const handleError = (payload) => {
      if(payload?.roomCode === roomCode){
        setError(payload?.error || 'Room error')
      }
    }

    const handleRoomClosed = (payload) => {
      if(payload?.roomCode === roomCode){
        navigate('/pvp/join', { replace: true })
      }
    }

    socket.on('room_state', handleRoomState)
    socket.on('match_started', handleMatchStarted)
    socket.on('room_error', handleError)
    socket.on('room_closed', handleRoomClosed)

    socket.emit('get_room_state', { roomCode })

    return () => {
      socket.off('room_state', handleRoomState)
      socket.off('match_started', handleMatchStarted)
      socket.off('room_error', handleError)
      socket.off('room_closed', handleRoomClosed)
    }
  }, [navigate, roomCode, playerId])

  const startMatch = () => {
    const socket = getPvpSocket()
    socket.emit('start_match', { roomCode, playerId })
  }

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
            backgroundColor: 'rgba(11, 12, 16, 0.88)',
            border: '1px solid rgba(255,255,255,0.12)'
          }}
        >
          <Stack spacing={3}>
            <Stack direction='row' alignItems='center' justifyContent='space-between'>
              <Typography variant='h5' sx={{ color: 'white', fontWeight: 700 }}>Lobby 👥</Typography>
              <PvpConnectionBadge />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent='space-between'>
              <Typography sx={{ color: 'grey.300' }}>Game code</Typography>
              <Chip label={roomCode} color='secondary' sx={{ fontWeight: 700, letterSpacing: '0.15em', color: 'white' }} />
            </Stack>

            {error && <Alert severity='error'>{error}</Alert>}

            <Grid container spacing={1.5}>
              {room?.players?.map((player) => (
                <Grid item xs={12} sm={6} md={4} key={player.playerId}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.75,
                      borderRadius: 2,
                      border: '1px solid rgba(255,255,255,0.16)',
                      backgroundColor: 'rgba(255,255,255,0.04)'
                    }}
                  >
                    <Stack direction='row' spacing={1.5} alignItems='center'>
                      <Avatar
                        src={player.avatar || ''}
                        alt={player.name}
                        sx={{
                          bgcolor: player.avatar ? 'transparent' : buildFallbackColor(player.playerId || player.name),
                          animation: 'pvpAvatarFloat 2.1s ease-in-out infinite',
                          '@keyframes pvpAvatarFloat': {
                            '0%': { transform: 'translateY(0px)' },
                            '50%': { transform: 'translateY(-4px)' },
                            '100%': { transform: 'translateY(0px)' }
                          }
                        }}
                      >
                        {!player.avatar && buildAvatarLabel(player.name)}
                      </Avatar>
                      <Stack spacing={0.6}>
                        <Typography sx={{ color: 'white', fontWeight: 600 }}>{player.name}</Typography>
                        <Chip
                          size='small'
                          label={player.connected ? 'Connected' : 'Disconnected'}
                          color={player.connected ? 'success' : 'default'}
                          sx={{ color: player.connected ? 'white' : '#e5e7eb' }}
                        />
                      </Stack>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button variant='outlined' color='error' fullWidth onClick={handleExitClick}>Exit Game</Button>
              {amHost && <Button variant='contained' fullWidth onClick={startMatch}>Start Match</Button>}
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
