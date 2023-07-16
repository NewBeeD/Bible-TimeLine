import { Typography, Box, Stack, Grid, Button, MenuItem, Select, TextField, Divider, FormControl, FormLabel } from '@mui/material'

export const HighscoreDisplay = (props) => {


  return (
    
    <Box  marginTop={4}>

      <Box justifyContent='center' alignItems='center' >


        <Box margin='auto' width={180} height={100}  sx={{ border: '3px dashed white', textAlign: 'center', borderRadius: '20px'}}>

          <Typography variant='h2' justifyContent='center' alignItems='center' marginTop={1.5} sx={{ color: 'white'}}>{props.highscore}</Typography>

        </Box>

      </Box>


    </Box>
  )
}
