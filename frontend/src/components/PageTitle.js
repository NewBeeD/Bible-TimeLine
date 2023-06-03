import { Typography, Box, Stack, Grid, Button, MenuItem, Select, TextField } from '@mui/material'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useTimeLineContext } from "../hooks/useTimeLineContext"
import { localStorageData } from "../modules/localStorageData"

export const PageTitle = () => {

  const [active, setActive] = useState(0)
  const [choice, setChoice] = useState('')
  const {difficulty, dispatch} = useTimeLineContext()

  const setDifficulty = (value) => {

    setActive(value)

    let dataPoint = {category: 'category', data: value}

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

          <Button variant='outlined' onClick={() => setDifficulty(1)}><Typography variant='body1' sx={{color: (active === 1? 'red': 'white')}}>Old Testament</Typography></Button>

          <Button variant='outlined' onClick={() => setDifficulty(2)} sx={{color: (active === 2? 'red': 'white')}}><Typography variant='body1'>New Testament</Typography></Button>

          <Button variant='outlined' onClick={() => setDifficulty(3)} sx={{color: (active === 3? 'red': 'white')}}><Typography variant='body1'>Mixed</Typography></Button>

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


        <Stack direction='row' justifyContent='center' spacing={2} sx={{marginTop: '40px'}}>
          {/* <Button variant='outlined' size='large'>Easy</Button>
          <Button variant='outlined' size='large'>Medium</Button>
          <Button variant='outlined' size='large'>Hard</Button> */}
          <Link to='/game' style={{ textDecoration: 'none', color: 'red'}}>
           
              <Typography variant='h4'>START</Typography>
        
            </Link>
        </Stack>

      </Box>



    </Box>


    
  )
}
