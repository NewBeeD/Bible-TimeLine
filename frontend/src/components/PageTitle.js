import { Typography, Box, Stack, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Paper, Chip } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { HighscoreDisplay } from './HighscoreDisplay'
import { useTimeLineContext } from "../hooks/useTimeLineContext"
// import { localStorageData } from "../modules/localStorageData"
import { FindHighScore } from '../modules/FindHighScore'
import { GAME_TYPES } from '../modules/gameModes'
import { createBlankScores, normalizeUserScores } from '../modules/scoreSchema'


// Firebase Support
import { auth, db } from '../firebaseAuth/firebaseSDK'
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth'
import { signOut } from 'firebase/auth'
import { set, ref, onValue, update } from 'firebase/database'

const blankScores = createBlankScores()


export const PageTitle = () => {

  const [active, setActive] = useState(2)
  const { dispatch } = useTimeLineContext()
  const navigate = useNavigate()
  const [mode, setMode] = useState({level: 4, time: 30})
  const [gameType, setGameType] = useState(GAME_TYPES.CLASSIC)
  const [highScore, setHighScore] = useState()
  const [showSigninBtn, setShowSignInBtn] = useState(true)
  const [name, setName] = useState('')
  const [howToPlayOpen, setHowToPlayOpen] = useState(false)



  // Google authentication
  const provider = new GoogleAuthProvider()


  const signinWithGoogle = () => {

    signInWithPopup(auth, provider)
    .then(() => {
      setShowSignInBtn(false)
    })
    .catch((error) => console.log(error))
  }


  const signOutUser = () => {

    signOut(auth).then(() => {
      setShowSignInBtn(true)
    }).catch((err) => console.log(err))
  }

  
  
  
  const startGame = () => {
    if(gameType === GAME_TYPES.PVP){
      navigate('/pvp/create', { state: { data: active, diffMode: mode, gameType } })
      return
    }

    navigate('/game', { state: { data: active, diffMode: mode, gameType } })
  }

  const joinPvpGame = () => {
    navigate('/pvp/join')
  }

  useEffect(()=>{

    let unsubscribeUserData = () => {}

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {

      if(user){
        setShowSignInBtn(false)
        setName(user.displayName)
  
        const userData = ref(db, 'users/' + user.uid + '/data')

        unsubscribeUserData = onValue(userData, (snapshot) => {

          const userHighScores = snapshot.val()
          
          // Set highscores for new users
          if(userHighScores === null){

            let uid;
            let referenceData;

            uid = user.uid   
            referenceData = ref(db, 'users/' + uid)      

            set((referenceData), {

            userName: user.displayName,
            data: blankScores,
            userImg: user.photoURL
          })


            setHighScore(FindHighScore(active, mode, blankScores, gameType))
          }
          else{
            const normalizedScores = normalizeUserScores(userHighScores)
            dispatch({type: 'SET_DATA', payload: normalizedScores})
            setHighScore(FindHighScore(active, mode, normalizedScores, gameType))

            update(ref(db, 'users/' + user.uid + '/data'), normalizedScores)
              .catch((error) => console.log(error))
          }
          
        })
      }
      else{
        
        setShowSignInBtn(true)
        setHighScore(FindHighScore(active, mode, blankScores, gameType))
      }
    })

    return () => {
      unsubscribeUserData()
      unsubscribeAuth()
    }

  }, [active, mode, dispatch, gameType])
 
  
  return (

    <Box 
    display='flex'
    justifyContent="center"
    alignItems="center"
    minHeight="inherit"
    py={{ xs: 3, sm: 5 }}
    px={2}
    >

      <Paper
        elevation={10}
        sx={{
          width: '100%',
          maxWidth: 820,
          borderRadius: 4,
          p: { xs: 2.2, sm: 3.2 },
          backgroundColor: 'rgba(11, 12, 16, 0.88)',
          border: '1px solid rgba(255,255,255,0.12)'
        }}
      >
        <Stack spacing={2.4}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2} justifyContent='space-between' alignItems={{ xs: 'flex-start', sm: 'center' }}>
            <Box>
              <Typography component='h1' sx={{ typography: { sm: 'h3', xs: 'h4' }, color: 'white', fontWeight: 700 }}>
                Bible TimeLine
              </Typography>
              <Typography sx={{ color: 'grey.300' }}>
                Pick a category, difficulty and mode to start.
              </Typography>
            </Box>
            {!showSigninBtn && <Chip label={`Welcome ${name || 'Player'}`} color='secondary' sx={{ color: 'white' }} />}
          </Stack>

          <Box>
            <HighscoreDisplay highscore={highScore}/>
          </Box>

          {!showSigninBtn &&
            <Stack direction='row' spacing={1.2}>
              <Link to='/leaderboard' style={{textDecoration: 'none', width: '100%'}}>
                <Button variant='contained' fullWidth>
                  <Typography sx={{ color: 'white', letterSpacing: 1.2}}>Open Leaderboard</Typography>
                </Button>
              </Link>
            </Stack>
          }

          <Stack spacing={1.2}>
            <Typography sx={{ color: 'grey.300', fontWeight: 600 }}>Category</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
              <Button variant={active === 1 ? 'contained' : 'outlined'} onClick={() => setActive(1)} fullWidth>
                <Typography sx={{color: 'white', fontWeight: 'bold'}}>Old Testament</Typography>
              </Button>
              <Button variant={active === 2 ? 'contained' : 'outlined'} onClick={() => setActive(2)} fullWidth>
                <Typography variant='body1' sx={{color: 'white', fontWeight: 'bold'}}>New Testament</Typography>
              </Button>
              <Button variant={active === 3 ? 'contained' : 'outlined'} onClick={() => setActive(3)} fullWidth>
                <Typography variant='body1' sx={{color: 'white', fontWeight: 'bold'}}>Mixed</Typography>
              </Button>
            </Stack>
          </Stack>

          <Stack spacing={1.2}>
            <Typography sx={{ color: 'grey.300', fontWeight: 600 }}>Difficulty</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
              <Button variant={mode.level === 4 ? 'contained' : 'outlined'} onClick={() => setMode({level: 4, time:30})} fullWidth>
                <Typography variant='body1' sx={{color: 'white', fontWeight: 'bold'}}>Easy</Typography>
              </Button>
              <Button variant={mode.level === 5 ? 'contained' : 'outlined'} onClick={() => setMode({level: 5, time:40})} fullWidth>
                <Typography variant='body1' sx={{color: 'white', fontWeight: 'bold'}}>Medium</Typography>
              </Button>
              <Button variant={mode.level === 6 ? 'contained' : 'outlined'} onClick={() => setMode({level: 6, time:50})} fullWidth>
                <Typography variant='body1' sx={{color: 'white', fontWeight: 'bold'}}>Hard</Typography>
              </Button>
            </Stack>
          </Stack>

          <Stack spacing={1.2}>
            <Typography sx={{ color: 'grey.300', fontWeight: 600 }}>Game Mode</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
              <Button variant={gameType === GAME_TYPES.CLASSIC ? 'contained' : 'outlined'} onClick={() => setGameType(GAME_TYPES.CLASSIC)} fullWidth>
                <Typography variant='body1' sx={{color: 'white', fontWeight: 'bold'}}>Classic</Typography>
              </Button>
              <Button variant={gameType === GAME_TYPES.SPEED ? 'contained' : 'outlined'} onClick={() => setGameType(GAME_TYPES.SPEED)} fullWidth>
                <Typography variant='body1' sx={{color: 'white', fontWeight: 'bold'}}>Speed</Typography>
              </Button>
              <Button variant={gameType === GAME_TYPES.PVP ? 'contained' : 'outlined'} onClick={() => setGameType(GAME_TYPES.PVP)} fullWidth>
                <Typography variant='body1' sx={{color: 'white', fontWeight: 'bold'}}>PvP</Typography>
              </Button>
            </Stack>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
            <Button variant='outlined' fullWidth onClick={() => setHowToPlayOpen(true)}><Typography sx={{color: 'white'}}>How to Play</Typography></Button>
            <Button variant='contained' fullWidth onClick={startGame} disabled={showSigninBtn}><Typography variant='h6' sx={{color: 'white'}}>{gameType === GAME_TYPES.PVP ? 'Create Match' : 'Start Game'}</Typography></Button>
            {gameType === GAME_TYPES.PVP &&
              <Button variant='contained' color='secondary' fullWidth onClick={joinPvpGame} disabled={showSigninBtn}>
                <Typography sx={{color: 'white'}}>Join Match</Typography>
              </Button>
            }
          </Stack>

        <Dialog open={howToPlayOpen} onClose={() => setHowToPlayOpen(false)}>
          <DialogTitle><Typography variant='h5'>How to Play</Typography></DialogTitle>
          <DialogTitle>
            <Typography variant='body1'>Current selection: {gameType === GAME_TYPES.PVP ? 'PvP' : gameType === GAME_TYPES.SPEED ? 'Speed' : 'Classic'}</Typography>
          </DialogTitle>

          <DialogContent>
            <DialogContentText>
              Core objective: drag and drop Bible events into the correct chronological order.
            </DialogContentText>
            <Divider sx={{marginY: '10px'}}/>

            <DialogContentText>
              Classic Mode: solve one ordering puzzle. Difficulty controls puzzle size (Easy 4, Medium 5, Hard 6 events).
            </DialogContentText>
            <Divider sx={{marginY: '10px'}}/>

            <DialogContentText>
              Speed Mode: solve as many puzzles as possible before the timer ends. Unlimited attempts during the timer.
            </DialogContentText>
            <Divider sx={{marginY: '10px'}}/>

            <DialogContentText>
              PvP Classic: players share the same round puzzle, submit once per round, and round points are shown on the leaderboard.
            </DialogContentText>
            <Divider sx={{marginY: '10px'}}/>

            <DialogContentText>
              PvP Race (3 Orders): each round has 3 shared problems. Players can retry each problem unlimited times. Each correctly completed problem gives 1 point. First player to complete all 3 ends the round for everyone.
            </DialogContentText>
            <Divider sx={{marginY: '10px'}}/>

            <DialogContentText>
              PvP rounds are timed. If time runs out, the round closes for all players and points are calculated from completed answers.
            </DialogContentText>
            <Divider sx={{marginY: '10px'}}/>

            <DialogContentText>
              At match end, total points across rounds decide the final leaderboard and podium (top 3 players).
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setHowToPlayOpen(false)}>OK</Button>
          </DialogActions>
        </Dialog>

        {showSigninBtn && 
        <Stack marginTop={1}>
          <Typography sx={{ color: 'white', textAlign: 'center' }}>Sign in to save scores to leaderboard</Typography>
        </Stack>
        }

        <Stack marginTop={1} spacing={1}>

          {/* <Button variant='contained'><Typography sx={{ color: 'white'}}>SignIn</Typography></Button> */}

          {showSigninBtn &&  (<Button variant='contained' onClick={signinWithGoogle}><Typography sx={{ color: 'white', letterSpacing: 2}}>Sign In with Google</Typography></Button>)}

        </Stack>

        {!showSigninBtn && <Stack marginTop={1}>
          <Button variant='outlined' color='inherit' onClick={signOutUser}><Typography sx={{ letterSpacing: 1, color: 'white'}}>Logout</Typography></Button>
        </Stack>}

      </Stack>
      </Paper>



    </Box>


    
  )
}
