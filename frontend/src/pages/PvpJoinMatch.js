import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, Box, Button, Container, Paper, Stack, TextField, Typography } from '@mui/material'
import { auth } from '../firebaseAuth/firebaseSDK'
import { ensurePvpSocketConnected, emitPvpAck, getPvpServerUrl } from '../modules/pvpSocket'
import { PvpConnectionBadge } from '../components/PvpConnectionBadge'

export const PvpJoinMatch = () => {
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState(auth.currentUser?.displayName || 'Player')
  const [roomCode, setRoomCode] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const joinGame = async () => {
    if(submitting){
      return
    }

    setSubmitting(true)
    setError('')

    try{
      const socket = await ensurePvpSocketConnected()

      const response = await emitPvpAck(socket, 'join_room', {
        roomCode: roomCode.trim(),
        player: {
          name: displayName || 'Player',
          avatar: auth.currentUser?.photoURL || '',
          uid: auth.currentUser?.uid || null
        }
      })

      if(!response?.ok){
        setError(response?.error || 'Could not join game room')
        return
      }

      navigate('/pvp/lobby', {
        state: {
          roomCode: response.roomCode,
          playerId: response.playerId,
          host: false
        }
      })
    }
    catch(error){
      setError(`Cannot reach PvP server at ${getPvpServerUrl()}. Start server (cd server ; npm install ; npm start) and try again.`)
    }
    finally{
      setSubmitting(false)
    }
  }

  return (
    <Box
      minHeight='100vh'
      sx={{
        background: 'radial-gradient(circle at top, #7c3aed 0%, #312e81 35%, #0f172a 100%)',
        py: { xs: 4, sm: 7 },
        px: { xs: 1.5, sm: 2.5 },
        fontFamily: 'Inter, Segoe UI, Arial, Helvetica, sans-serif'
      }}
    >
      <Container maxWidth='sm'>
        <Paper
          elevation={8}
          sx={{
            p: { xs: 2.5, sm: 4 },
            borderRadius: 3.2,
            backgroundColor: 'rgba(255,255,255,0.10)',
            border: '1px solid rgba(255,255,255,0.22)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Stack spacing={3}>
            <Stack direction='row' alignItems='center' justifyContent='space-between'>
              <Typography variant='h5' sx={{ color: 'white', fontWeight: 800, letterSpacing: '0.02em' }}>Join PvP Match 🚀</Typography>
              <PvpConnectionBadge />
            </Stack>

            <TextField
              label='Display name'
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              fullWidth
              size='small'
              sx={{
                '& .MuiInputLabel-root': { color: 'grey.400' },
                '& .MuiInputBase-input': { color: 'white' }
              }}
            />

            <TextField
              label='6 digit room code'
              value={roomCode}
              onChange={(event) => setRoomCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
              fullWidth
              size='small'
              sx={{
                '& .MuiInputLabel-root': { color: 'grey.400' },
                '& .MuiInputBase-input': { color: 'white', letterSpacing: '0.2em' }
              }}
              inputProps={{ inputMode: 'numeric' }}
            />

            {error && <Alert severity='error'>{error}</Alert>}

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button variant='outlined' fullWidth onClick={() => navigate('/')}>Back</Button>
              <Button variant='contained' fullWidth onClick={joinGame} disabled={submitting || roomCode.length !== 6}>
                {submitting ? 'Joining...' : 'Join Lobby'}
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}
