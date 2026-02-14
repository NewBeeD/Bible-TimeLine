import { Box, Typography, Stack, Button } from "@mui/material"



import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import '../Css/leaderBoardCss.css'
import { useState } from "react"

import { sortDifficultyMode } from "../modules/SortDifficultyMode";

export const LeaderBoard = () => {


  const dataPoints = [
    {name: 'Danphil', easyscore: '9', mediumscore: '7', hardscore: '4', difficulty: 'easy', mode: 'newtestament'},
    {name: 'Lee', easyscore: '11', mediumscore: '3', hardscore: '2', difficulty: 'easy', mode: 'oldtestament'},
    {name: 'Kalinda', easyscore: '5', mediumscore: '4', hardscore: '8', difficulty: 'medium', mode: 'newtestament'},
    {name: 'Yuvanka', easyscore: '4', mediumscore: '8', hardscore: '1', difficulty: 'hard', mode: 'oldtestament'},
    {name: 'Phillippa', easyscore: '8', mediumscore: '9', hardscore: '3', difficulty: 'easy', mode: 'newtestament'},
    {name: 'Johnny', easyscore: '15', mediumscore: '5', hardscore: '4', difficulty: 'medium', mode: 'mixed'},
    {name: 'Greg', easyscore: '9', mediumscore: '0', hardscore: '7', difficulty: 'hard', mode: 'oldtestament'},
    {name: 'Gerrald', easyscore: '3', mediumscore: '0', hardscore: '1', difficulty: 'easy', mode: 'newtestament'}
    
  ]

  const initialPrint = dataPoints.filter(modeName => modeName.mode === 'newtestament')

  const [data, setData] = useState(initialPrint)
  const [color, setColor] = useState('newtestament')
  const [arrow, setArrow] = useState({easy: false, medium: false, hard: false})

  const filterData = (gameMode) => {
 
    let newScores = dataPoints.filter(modeName => modeName.mode === gameMode)
    setData(newScores)
    setColor(gameMode)
  }

  const sortFunction = (difficultyMode) => {

    switch(difficultyMode){

      case 'easy':
        setArrow({...arrow, easy: !arrow.easy})
        setData(sortDifficultyMode(dataPoints, arrow, color, 'easy'))
        break;
      
      case 'medium':
        setArrow({...arrow, medium: !arrow.medium})
        setData(sortDifficultyMode(dataPoints, arrow, color, 'medium'))
        break;

      case 'hard':
        setArrow({...arrow, hard: !arrow.hard})
        setData(sortDifficultyMode(dataPoints, arrow, color, 'hard'))
        break;

      default:
        break;
    }

    
    
  }
  
  
  return (

    <Stack justifyContent='center' alignItems='center' sx={{ width: '100%', height: '100vh'}}>  

    <Box marginTop={0}>
      <Typography variant="h3">LEADERBOARD</Typography>
    </Box>

    <Stack direction='row' marginTop={8} spacing={5}>
      <Button variant="outlined" onClick={() => filterData('oldtestament')} sx={{color: (color === 'oldtestament'? 'red': 'black')}}>Old Testament</Button>
      <Button variant="outlined" onClick={() => filterData('newtestament')} sx={{color: (color === 'newtestament'? 'red': 'black')}}>New-Testament</Button>
      <Button variant="outlined" onClick={() => filterData('mixed')} sx={{color: (color === 'mixed'? 'red': 'black')}}>Mixed</Button>
    </Stack>

    <Stack direction='row' marginTop={8} marginBottom={4} height='40px' width='90%' boxShadow={5} justifyContent='center' alignItems='center' sx={{borderRadius: '7px'}} >

      <Box width={200} sx={{textAlign: 'center'}}>
        Name
      </Box>

      <Box width={200} sx={{textAlign: 'center'}}>
        <Button className="leaderBoard" variant="text" onClick={() => sortFunction('easy')} endIcon={arrow.easy?<KeyboardArrowDownIcon/>: <KeyboardArrowUpIcon/>} disableRipple>Easy</Button>
      </Box>

      <Box width={200} sx={{textAlign: 'center'}}>
        <Button className="leaderBoard" variant="text"  onClick={() => sortFunction('medium')} endIcon={arrow.medium?<KeyboardArrowDownIcon/>: <KeyboardArrowUpIcon/>} disableRipple>Medium</Button>
      </Box>

      <Box width={200} sx={{textAlign: 'center'}}>
        <Button className="leaderBoard" variant="text" onClick={() => sortFunction('hard')} endIcon={arrow.hard?<KeyboardArrowDownIcon/>: <KeyboardArrowUpIcon/>} disableRipple>Hard</Button>
      </Box>

    </Stack>

   

    {data.map(datapoint => 
      (<Stack key={`${datapoint.name}-${datapoint.mode}`} direction='row' marginTop={2} height='35px' width='90%' boxShadow={5} justifyContent='center' alignItems='center' sx={{borderRadius: '7px'}} >

        <Box width={200} sx={{textAlign: 'center'}}>

          {datapoint.name}
          
        </Box>

        <Box width={200} sx={{textAlign: 'center'}}>
          {datapoint.easyscore === '0'? '-': datapoint.easyscore}
        </Box>

        <Box width={200} sx={{textAlign: 'center'}}>
          {datapoint.mediumscore === '0'? '-': datapoint.mediumscore}
        </Box>

        <Box width={200} sx={{textAlign: 'center'}}>
          {datapoint.hardscore === '0'? '-': datapoint.hardscore}
        </Box>

        </Stack>)
      )}


      
    </Stack>
    
  )
}
