import { Typography, Box, Stack, Grid, Button, MenuItem, Select, TextField, Divider } from '@mui/material'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { HighscoreDisplay } from './HighscoreDisplay'
import { useTimeLineContext } from "../hooks/useTimeLineContext"
import { localStorageData } from "../modules/localStorageData"
import { FindHighScore } from '../modules/FindHighScore'


export const PageTitle = () => {

  const [active, setActive] = useState(2)
  const [active2, setActive2] = useState(0)
  const [choice, setChoice] = useState('')
  // const {difficulty, dispatch} = useTimeLineContext()
  const [mode, setMode] = useState({level: 4, time: 30})
  const [highScore, setHighScore] = useState()

  
  
  
  const setCategory = () => {

    let dataPoint = {category: 'category', data: active, diffMode: mode}
    let valueString = JSON.stringify(dataPoint)
    localStorage.setItem('data', valueString)
  }


  const handleChange = (e) => {
    setChoice(e.target.value)
  }


  useEffect(()=>{

    setHighScore(FindHighScore(active, mode))
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

        <Box marginTop={{xs: 4, sm: 10, lg: 6}}>
          
          <HighscoreDisplay highscore={highScore}/>

        </Box>


        <Stack justifyContent='center' spacing={2} sx={{marginTop: {xs: '60px', sm: '70px', lg: '80px'}, marginX: '14px'}}>

          <Button variant='outlined' onClick={() => setActive(1)}><Typography sx={{color: (active === 1? '#1976d2': 'white'), fontWeight: 'bold', letterSpacing: {xs:'2px', sm: '7px', md: '8px', lg: '9px'}}}>Old Testament</Typography></Button>

          <Button variant='outlined' onClick={() => setActive(2)} ><Typography variant='body1' sx={{color: (active === 2? '#1976d2': 'white'), fontWeight: 'bold', letterSpacing: {xs:'2px', sm: '7px', md: '8px', lg: '9px'}}}>New Testament</Typography></Button>

          <Button variant='outlined' onClick={() => setActive(3)} ><Typography variant='body1' sx={{color: (active === 3? '#1976d2': 'white'), fontWeight: 'bold', letterSpacing: {xs:'2px', sm: '7px', md: '8px', lg: '9px'}}}>Mixed</Typography></Button>

          {/* <TextField
          variant='outlined'
          label="Your Choice"
          select
          value={choice}
          onChange={handleChange}
          sx={{width: '170px', input: { color: 'red' }}}>

            <MenuItem value='STORY'>Stories</MenuItem>
            <MenuItem value='CHARACTER'>Characters</MenuItem>
            <MenuItem value='BOOKS'>Books</MenuItem>

          </TextField> */}


         
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

      </Box>



    </Box>


    
  )
}
