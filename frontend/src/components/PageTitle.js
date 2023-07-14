import { Typography, Box, Stack, Grid, Button, MenuItem, Select, TextField, Divider } from '@mui/material'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useTimeLineContext } from "../hooks/useTimeLineContext"
import { localStorageData } from "../modules/localStorageData"


export const PageTitle = () => {

  const [active, setActive] = useState(2)
  const [active2, setActive2] = useState(0)
  const [choice, setChoice] = useState('')
  // const {difficulty, dispatch} = useTimeLineContext()
  const [mode, setMode] = useState({level: 4, time: 30})

  
  
  
  const setCategory = () => {

    let dataPoint = {category: 'category', data: active, diffMode: mode}
    let valueString = JSON.stringify(dataPoint)
    localStorage.setItem('data', valueString)
  }


  const handleChange = (e) => {
    setChoice(e.target.value)
  }
 
  
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

        <Stack justifyContent='center' spacing={2} sx={{marginTop: '120px', marginX: '14px'}}>

          <Button variant='outlined' onClick={() => setActive(1)}><Typography variant='body1' sx={{color: (active === 1? 'red': 'white')}}>Old Testament</Typography></Button>

          <Button variant='outlined' onClick={() => setActive(2)} sx={{color: (active === 2? 'red': 'white')}}><Typography variant='body1'>New Testament</Typography></Button>

          <Button variant='outlined' onClick={() => setActive(3)} sx={{color: (active === 3? 'red': 'white')}}><Typography variant='body1'>Mixed</Typography></Button>

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
        marginTop={4}spacing={8}
        >
          <Button variant='outlined' onClick={() => setMode({level: 4, time:30})}><Typography variant='body1' sx={{color: (mode.level === 4? 'red': 'white')}}>Easy</Typography></Button>

          <Button variant='outlined' onClick={() => setMode({level: 5, time:40})} sx={{color: (mode.level === 5? 'red': 'white')}}><Typography variant='body1'>Medium</Typography></Button>

          <Button variant='outlined' onClick={() => setMode({level: 6, time:50})} sx={{color: (mode.level === 6? 'red': 'white')}}><Typography variant='body1'>Hard</Typography></Button>
        </Stack>


        <Stack direction='row' justifyContent='center' spacing={2} sx={{marginTop: '40px'}}>
          {/* <Button variant='outlined' size='large'>Easy</Button>
          <Button variant='outlined' size='large'>Medium</Button>
          <Button variant='outlined' size='large'>Hard</Button> */}
          <Link to='/game' style={{ textDecoration: 'none', color: 'red'}}>
           
              <Button onClick={setCategory}><Typography variant='h4' color='error'>START</Typography></Button>
        
            </Link>
        </Stack>

      </Box>



    </Box>


    
  )
}
