import { Typography, Box } from '@mui/material'

export const HighscoreDisplay = (props) => {


  return (
    
    <Box  marginTop={4}>

      <Box justifyContent='center' alignItems='center' >


        <Box margin='auto' width={180} height={100}  sx={{ border: '1px dashed white', borderTop: 'none', textAlign: 'center', borderRadius: '20px'}}>

          <Typography sx={{ color: 'white'}}> Your High Score</Typography>

          <Typography variant='h2' justifyContent='center' alignItems='center'  sx={{ color: 'white'}}>{props.highscore? props.highscore: 0}</Typography>

        </Box>

      </Box>


    </Box>
  )
}
