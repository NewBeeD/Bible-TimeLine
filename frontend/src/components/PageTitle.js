import { Typography, Box, Stack, Grid, Button, MenuItem, Select, TextField, Divider } from '@mui/material'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { HighscoreDisplay } from './HighscoreDisplay'
import { useTimeLineContext } from "../hooks/useTimeLineContext"

import { FindHighScore } from '../modules/FindHighScore'

// Firebase Support
import { auth } from '../firebaseAuth/firebaseSDK'
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth'
import { signOut } from 'firebase/auth'


export const PageTitle = () => {

  const [active, setActive] = useState(2)

  const [choice, setChoice] = useState('')
  // const {difficulty, dispatch} = useTimeLineContext()
  const [mode, setMode] = useState({level: 4, time: 30})
  const [highScore, setHighScore] = useState()
  const [showSigninBtn, setShowSignInBtn] = useState(true)
  const [name, setName] = useState('')

  // Google authentication
  const provider = new GoogleAuthProvider()

  // This function is used to check if the user is signed in
  onAuthStateChanged(auth, (user) => {

      if(user){
        setShowSignInBtn(false)
        setName(user.displayName)
        // console.log(user.photoURL);
      }
      else{
        setShowSignInBtn(true)
      }
    })


  const signinWithGoogle = () => {

    signInWithPopup(auth, provider)
    .then((results) => {

      setShowSignInBtn(false)
      console.log(results);
    })
    .catch((error) => console.log(error))
  }


  const signOutUser = () => {

    console.log('In signout function');

    signOut(auth).then(() => {
      console.log('Signout Successful');
      setShowSignInBtn(true)
    }).catch((err) => console.log(err))
  }

  
  
  
  const setCategory = () => {

    let dataPoint = {category: 'category', data: active, diffMode: mode}
    let valueString = JSON.stringify(dataPoint)
    localStorage.setItem('data', valueString)
  }


  const handleChange = (e) => {
    setChoice(e.target.value)
  }


  useEffect(()=>{

    if(document.cookie){setHighScore(FindHighScore(active, mode))}

    else {setHighScore(0)}

    
  }, [active, mode])
 
  
  return (

    <Box 
    display='flex'
    justifyContent="center"
    alignItems="center"
    minHeight="inherit"
    >

      <Box
      display='flex'
      flexDirection='column'
      spacing={8}>

        <Box>
          <Typography component='h1' color='#c5c6c7' sx={{typography: {sm: 'h1', xs: 'h3'}, textAlign: 'center', marginX: '14px'}}>
            Bible TimeLine
          </Typography>
        </Box>

        {/* Highscore display for each mode click */}

        <Box marginTop={{xs: 4, sm: 10, lg: 5}}>
          
          <HighscoreDisplay highscore={highScore}/>

        </Box>


        {!showSigninBtn && <Stack margin='auto' marginTop={2}>
            <Link to='/leaderboard'>
              <Button variant='contained'>
                <Typography sx={{ color: 'white', letterSpacing: 2}}>LeaderBoard</Typography>
              </Button>
            </Link>
          </Stack>}


        <Stack justifyContent='center' spacing={2} sx={{marginTop: {xs: '60px', sm: '70px', lg: '50px'}, marginX: '14px'}}>

          <Button variant='outlined' onClick={() => setActive(1)}><Typography sx={{color: (active === 1? '#1976d2': 'white'), fontWeight: 'bold', letterSpacing: {xs:'2px', sm: '7px', md: '8px', lg: '9px'}}}>Old Testament</Typography></Button>

          <Button variant='outlined' onClick={() => setActive(2)} ><Typography variant='body1' sx={{color: (active === 2? '#1976d2': 'white'), fontWeight: 'bold', letterSpacing: {xs:'2px', sm: '7px', md: '8px', lg: '9px'}}}>New Testament</Typography></Button>

          <Button variant='outlined' onClick={() => setActive(3)} ><Typography variant='body1' sx={{color: (active === 3? '#1976d2': 'white'), fontWeight: 'bold', letterSpacing: {xs:'2px', sm: '7px', md: '8px', lg: '9px'}}}>Mixed</Typography></Button>


         
        </Stack>

        <Stack 
        direction='row' 
        justifyContent='center' 
        marginTop={{xs: 4, sm: 10, lg: 7}}
        spacing={{xs: 2, sm: 5, lg: 6}}
        >
          <Button variant='outlined' onClick={() => setMode({level: 4, time:30})}><Typography variant='body1' sx={{color: (mode.level === 4? '#1976d2': 'white'), fontWeight: 'bold', letterSpacing: {xs:'2px', sm: '5px', md: '4px', lg: '5px'}}}>Easy</Typography></Button>

          <Button variant='outlined' onClick={() => setMode({level: 5, time:40})} ><Typography variant='body1' sx={{color: (mode.level === 5? '#1976d2': 'white'), fontWeight: 'bold', letterSpacing: {xs:'2px', sm: '5px', md: '4px', lg: '5px'}}}>Medium</Typography></Button>

          <Button variant='outlined' onClick={() => setMode({level: 6, time:50})} ><Typography variant='body1' sx={{color: (mode.level === 6? '#1976d2': 'white'), fontWeight: 'bold', letterSpacing: {xs:'2px', sm: '5px', md: '4px', lg: '5px'}}}>Hard</Typography></Button>
        </Stack>


        <Stack direction='row' justifyContent='center' spacing={2} sx={{marginTop: '40px'}}>
          {/* <Button variant='outlined' size='large'>Easy</Button>
          <Button variant='outlined' size='large'>Medium</Button>
          <Button variant='outlined' size='large'>Hard</Button> */}
          <Link to='/game' style={{ textDecoration: 'none', color: 'red'}}>
           
              <Button variant='contained' onClick={setCategory}><Typography variant='h4' sx={{color: 'white'}}>START</Typography></Button>
        
            </Link>
        </Stack>

        <Stack marginTop={2} spacing={1} sx={{ marginX: '120px'}}>

          {/* <Button variant='contained'><Typography sx={{ color: 'white'}}>SignIn</Typography></Button> */}

          {showSigninBtn &&  (<Button variant='contained' onClick={signinWithGoogle}><Typography sx={{ color: 'white', letterSpacing: 2}}>SignIn with Google</Typography></Button>)}

        </Stack>

        {!showSigninBtn && 
        <Stack margin='auto' marginTop={4}>
          <Typography sx={{ color: 'white', letterSpacing: 2, textTransform: 'capitalize'}}>Welcome {name}!</Typography>
        </Stack>
      }

      {!showSigninBtn && <Stack margin='auto' marginTop={2}>
        <button variant='outlined' onClick={signOutUser}><Typography sx={{ letterSpacing: 1, padding: '2px', cursor: 'pointer'}}>Logout</Typography></button>
      </Stack>}

      </Box>



    </Box>


    
  )
}
