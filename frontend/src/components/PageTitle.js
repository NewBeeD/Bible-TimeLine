import { Typography, Box, Stack, Grid, Button } from '@mui/material'

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
          <Typography variant='h1' component='h1'>
            Bible TimeLine
          </Typography>
        </Box>

        <Stack direction='row' justifyContent='center' spacing={8} sx={{marginTop: '70px'}}>
          <Button variant='outlined' size='large'>Easy</Button>
          <Button variant='outlined' size='large'>Medium</Button>
          <Button variant='outlined' size='large'>Hard</Button>
        </Stack>

      </Box>



    </Box>


    
  )
}
