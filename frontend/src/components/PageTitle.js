import { Typography, Box, Stack, Grid, Button } from '@mui/material'
import { Link } from 'react-router-dom'

export const PageTitle = () => {
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
          <Typography variant='h1' component='h1' color='#c5c6c7'>
            Bible TimeLine
          </Typography>
        </Box>

        <Stack direction='row' justifyContent='center' spacing={8} sx={{marginTop: '70px'}}>
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
