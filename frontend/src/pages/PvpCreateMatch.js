import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Alert, Box, Button, Container, Paper, Stack, TextField, Typography } from '@mui/material'
import { auth } from '../firebaseAuth/firebaseSDK'
import { ensurePvpSocketConnected, emitPvpAck, getPvpServerUrl } from '../modules/pvpSocket'
import { GAME_TYPES, PVP_ROUND_PLAN } from '../modules/gameModes'
import { PvpConnectionBadge } from '../components/PvpConnectionBadge'

export const PvpCreateMatch = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const selected = location.state || { data: 2, diffMode: { level: 4, time: 30 }, gameType: GAME_TYPES.PVP }
  const [displayName, setDisplayName] = useState(auth.currentUser?.displayName || 'Player')
  const [maxPlayers, setMaxPlayers] = useState(4)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const categoryName = useMemo(() => {
    if(selected.data === 1){ return 'Old Testament' }
    if(selected.data === 2){ return 'New Testament' }
    return 'Mixed'
  }, [selected.data])

  const createGame = async () => {
    if(submitting){
      return
    }

    setSubmitting(true)
    setError('')

    try{
      const socket = await ensurePvpSocketConnected()

      const response = await emitPvpAck(socket, 'create_room', {
        host: {
          name: displayName || 'Player',
          avatar: auth.currentUser?.photoURL || '',
          uid: auth.currentUser?.uid || null
        },
        settings: {
          category: selected.data,
          maxPlayers,
          roundPlan: PVP_ROUND_PLAN
        }
      })

      if(!response?.ok){
        setError(response?.error || 'Could not create game room')
        return
      }

      navigate('/pvp/lobby', {
        state: {
          roomCode: response.roomCode,
          playerId: response.playerId,
          host: true
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
        background: 'linear-gradient(135deg, #173174 0%, #1f2833 45%, #0b0c10 100%)',
        py: { xs: 4, sm: 7 }
      }}
    >
      <Container maxWidth='sm'>
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
              <Typography variant='h5' sx={{ color: 'white', fontWeight: 700 }}>Create PvP Match 🎮</Typography>
              <PvpConnectionBadge />
            </Stack>

            <Typography sx={{ color: 'grey.300', textAlign: 'center' }}>
              Round order: 3 Easy, 2 Medium, 1 Hard
            </Typography>
            <Typography sx={{ color: 'grey.300', textAlign: 'center' }}>Category: {categoryName}</Typography>

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
              label='Max players'
              type='number'
              value={maxPlayers}
              onChange={(event) => setMaxPlayers(Math.min(20, Math.max(2, Number(event.target.value) || 2)))}
              fullWidth
              size='small'
              sx={{
                '& .MuiInputLabel-root': { color: 'grey.400' },
                '& .MuiInputBase-input': { color: 'white' }
              }}
              inputProps={{ min: 2, max: 20 }}
            />

            {error && <Alert severity='error'>{error}</Alert>}

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button variant='outlined' fullWidth onClick={() => navigate('/')}>Back</Button>
              <Button variant='contained' fullWidth onClick={createGame} disabled={submitting}>
                {submitting ? 'Creating...' : 'Create & Go To Lobby'}
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}
