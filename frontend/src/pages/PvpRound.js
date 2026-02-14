import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Alert, Box, Button, Chip, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, ListItem, ListItemText, Paper, Stack, Typography } from '@mui/material'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { eventsCheck } from '../modules/eventsOrderFinder'
import { orderChecker } from '../modules/orderChecker'
import { getPvpSocket } from '../modules/pvpSocket'
import { getLevelName } from '../modules/gameModes'
import { PvpConnectionBadge } from '../components/PvpConnectionBadge'

export const PvpRound = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const roomCode = location.state?.roomCode
  const playerId = location.state?.playerId

  const [round, setRound] = useState(null)
  const [data, setData] = useState([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')
  const [hostPlayerId, setHostPlayerId] = useState(null)
  const [confirmExitOpen, setConfirmExitOpen] = useState(false)

  const amHost = hostPlayerId === playerId

  const roundLabel = useMemo(() => {
    if(!round){
      return ''
    }

    return `${getLevelName(round.difficultyLevel)} (Round ${round.roundNumber}/${round.totalRounds})`
  }, [round])

  useEffect(() => {
    if(!roomCode || !playerId){
      navigate('/pvp/join', { replace: true })
      return
    }

    const socket = getPvpSocket()

    const handleRoundStarted = (payload) => {
      if(payload?.roomCode !== roomCode){
        return
      }

      setRound(payload)
      setData(payload.events || [])
      setSubmitted(false)
      setFeedback('')
    }

    const handleRoundEnded = (payload) => {
      if(payload?.roomCode !== roomCode){
        return
      }

      navigate('/pvp/results', {
        state: {
          roomCode,
          playerId,
          roundResults: payload
        }
      })
    }

    const handleRoomState = (payload) => {
      if(payload?.roomCode !== roomCode){
        return
      }

      setHostPlayerId(payload?.hostPlayerId || null)

      if(payload?.activeRound){
        setRound(payload.activeRound)
        setData(payload.activeRound.events || [])
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

    socket.on('round_started', handleRoundStarted)
    socket.on('round_ended', handleRoundEnded)
    socket.on('room_state', handleRoomState)
    socket.on('room_closed', handleRoomClosed)
    socket.on('room_error', handleRoomError)

    socket.emit('get_room_state', { roomCode })

    return () => {
      socket.off('round_started', handleRoundStarted)
      socket.off('round_ended', handleRoundEnded)
      socket.off('room_state', handleRoomState)
      socket.off('room_closed', handleRoomClosed)
      socket.off('room_error', handleRoomError)
    }
  }, [navigate, roomCode, playerId])

  useEffect(() => {
    if(!round?.endsAt){
      return
    }

    const update = () => {
      const now = Date.now()
      const seconds = Math.max(0, Math.ceil((round.endsAt - now) / 1000))
      setTimeLeft(seconds)
    }

    update()

    const intervalId = setInterval(update, 300)

    return () => clearInterval(intervalId)
  }, [round])

  const handleDragDrop = (result) => {
    const { source, destination } = result

    if(!destination || submitted){
      return
    }

    if(source.index === destination.index){
      return
    }

    const items = Array.from(data)
    const [reordered] = items.splice(source.index, 1)
    items.splice(destination.index, 0, reordered)

    setData(items)
  }

  const submitOrder = () => {
    if(submitted || !round){
      return
    }

    const currentOrder = eventsCheck(data)
    const isCorrect = orderChecker(round.correctOrder, data)

    const socket = getPvpSocket()
    socket.emit('submit_order', {
      roomCode,
      playerId,
      roundId: round.roundId,
      isCorrect,
      submittedOrder: currentOrder
    })

    setSubmitted(true)
    setFeedback(isCorrect ? 'Correct submission sent' : 'Submission sent')
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
        py: { xs: 3, sm: 5 }
      }}
    >
      <Container maxWidth='md'>
        <Paper
          elevation={8}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            backgroundColor: 'rgba(11, 12, 16, 0.9)',
            border: '1px solid rgba(255,255,255,0.12)'
          }}
        >
          <Stack spacing={2}>
            <Stack direction='row' alignItems='center' justifyContent='space-between'>
              <Typography variant='h5' sx={{ color: 'white', fontWeight: 700 }}>PvP Round ⚡</Typography>
              <Stack direction='row' spacing={1}>
                <PvpConnectionBadge />
                <Button size='small' variant='outlined' color='error' onClick={handleExitClick}>Exit Game</Button>
              </Stack>
            </Stack>

            {error && <Alert severity='error'>{error}</Alert>}

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2} justifyContent='space-between'>
              <Chip label={roundLabel || 'Waiting for round...'} color='secondary' sx={{ color: 'white' }} />
              <Chip label={`Time left: ${timeLeft}s`} color={timeLeft <= 5 ? 'warning' : 'default'} sx={{ color: '#f3f4f6' }} />
            </Stack>

            <DragDropContext onDragEnd={handleDragDrop}>
              <Droppable droppableId='pvp-list'>
                {(provided) => (
                  <List
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    sx={{ width: '100%', textAlign: 'center', p: 0 }}
                  >
                    {data.map((point, index) => (
                      <Draggable key={point.id} draggableId={point.id.toString()} index={index}>
                        {(dragProvided) => (
                          <Paper
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            elevation={0}
                            sx={{
                              mb: 1,
                              borderRadius: 2,
                              border: '1px solid rgba(255,255,255,0.16)',
                              backgroundColor: 'rgba(255,255,255,0.06)'
                            }}
                          >
                            <ListItem>
                              <ListItemText
                                primary={point.event}
                                primaryTypographyProps={{ fontSize: { xs: '15px', sm: '18px' }, color: 'white' }}
                              />
                            </ListItem>
                          </Paper>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </List>
                )}
              </Droppable>
            </DragDropContext>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button variant='contained' fullWidth onClick={submitOrder} disabled={submitted || timeLeft <= 0}>
                {submitted ? 'Submitted' : 'Submit'}
              </Button>
            </Stack>

            {feedback && <Typography sx={{ color: 'grey.300', textAlign: 'center' }}>{feedback}</Typography>}

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
