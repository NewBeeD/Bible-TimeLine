import { Box, Typography, Stack, Button, Skeleton, Container, Paper, ToggleButtonGroup, ToggleButton } from "@mui/material"

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState, useEffect } from "react"
import { sortDifficultyMode } from "../modules/SortDifficultyMode";
import { Link } from "react-router-dom";

// Firebase Database config
import { db } from "../firebaseAuth/firebaseSDK";
import { ref, onValue } from 'firebase/database'
import { leaderboardData } from "../modules/leaderboardEntries";


// const dataPoints = [
//     {name: 'Danphil', easyscore: '9', mediumscore: '7', hardscore: '4', difficulty: 'easy', mode: 'newtestament'},
//     {name: 'Lee', easyscore: '11', mediumscore: '3', hardscore: '2', difficulty: 'easy', mode: 'oldtestament'},
//     {name: 'Kalinda', easyscore: '5', mediumscore: '4', hardscore: '8', difficulty: 'medium', mode: 'newtestament'},
//     {name: 'Yuvanka', easyscore: '4', mediumscore: '8', hardscore: '1', difficulty: 'hard', mode: 'oldtestament'},
//     {name: 'Phillippa', easyscore: '8', mediumscore: '9', hardscore: '3', difficulty: 'easy', mode: 'newtestament'},
//     {name: 'Johnny', easyscore: '15', mediumscore: '5', hardscore: '4', difficulty: 'medium', mode: 'mixed'},
//     {name: 'Greg', easyscore: '9', mediumscore: '0', hardscore: '7', difficulty: 'hard', mode: 'oldtestament'},
//     {name: 'Gerrald', easyscore: '3', mediumscore: '0', hardscore: '1', difficulty: 'easy', mode: 'newtestament'}
    
//   ]



export const LeaderBoard = () => {

  const [allUserData, setAllUserData] = useState([])
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() =>{
    
    const userData = ref(db, 'users/')

    const unsubscribe = onValue(userData, (snapshot) => {

      let highScore = snapshot.val()
      const playerDataOrganized = leaderboardData(highScore)
      const firstEntry = playerDataOrganized.filter(modeName => modeName.mode === 'newtestament')
      setAllUserData(playerDataOrganized)
      setData(firstEntry)
      setIsLoading(false)
      
    }, () => {
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Problem function
  // const initialPrint = allUserData.filter(modeName => modeName.mode === 'newtestament')

  // console.log(initialPrint);

  const [color, setColor] = useState('newtestament')
  const [arrow, setArrow] = useState({easy: false, medium: false, hard: false})

  // This function is used to filter the user data by game mode category
  const filterData = (gameMode) => {
 
    let newScores = allUserData.filter(modeName => modeName.mode === gameMode)
    setData(newScores)
    setColor(gameMode)
  }

  const handleModeChange = (event, gameMode) => {
    if(gameMode){
      filterData(gameMode)
    }
  }

  // This is a sorting function by organizing datapoint from high to low (vice-versa)
  const sortFunction = (difficultyMode) => {

    switch(difficultyMode){

      case 'easy':
        setArrow({...arrow, easy: !arrow.easy})
        setData(sortDifficultyMode(data, arrow, color, 'easy'))
        break;
      
      case 'medium':
        setArrow({...arrow, medium: !arrow.medium})
        setData(sortDifficultyMode(data, arrow, color, 'medium'))
        break;

      case 'hard':
        setArrow({...arrow, hard: !arrow.hard})
        setData(sortDifficultyMode(data, arrow, color, 'hard'))
        break;
      
      default:
        break;
    }

    
    
  }
  
  
  return (
      <Container maxWidth='lg' sx={{ py: 6 }}>
        <Stack spacing={3}>
          <Stack direction='row' justifyContent='space-between' alignItems='center'>
            <Typography variant='h4'>Leaderboard</Typography>
            <Link to='/' style={{textDecoration: 'none'}}>
              <Button variant='outlined'>Home</Button>
            </Link>
          </Stack>

          <Paper sx={{ p: 2 }}>
            <Stack spacing={2}>
              <ToggleButtonGroup
                exclusive
                value={color}
                onChange={handleModeChange}
                fullWidth
              >
                <ToggleButton value='oldtestament'>Old Testament</ToggleButton>
                <ToggleButton value='newtestament'>New Testament</ToggleButton>
                <ToggleButton value='mixed'>Mixed</ToggleButton>
              </ToggleButtonGroup>

              <Stack direction='row' sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 1 }}>
                <Box flex={2}><Typography fontWeight='bold'>Player</Typography></Box>
                <Box flex={1} textAlign='center'>
                  <Button variant='text' onClick={() => sortFunction('easy')} endIcon={arrow.easy ? <KeyboardArrowDownIcon/> : <KeyboardArrowUpIcon/>}>
                    Easy
                  </Button>
                </Box>
                <Box flex={1} textAlign='center'>
                  <Button variant='text' onClick={() => sortFunction('medium')} endIcon={arrow.medium ? <KeyboardArrowDownIcon/> : <KeyboardArrowUpIcon/>}>
                    Medium
                  </Button>
                </Box>
                <Box flex={1} textAlign='center'>
                  <Button variant='text' onClick={() => sortFunction('hard')} endIcon={arrow.hard ? <KeyboardArrowDownIcon/> : <KeyboardArrowUpIcon/>}>
                    Hard
                  </Button>
                </Box>
              </Stack>

              {isLoading ? (
                <Skeleton variant="rectangular" width='100%' height={220} animation="wave"/>
              ) : allUserData.length > 0 ? (
                data.length > 0 ? data.map((datapoint) => (
                  <Stack key={`${datapoint.mode}-${datapoint.playerName}`} direction='row' sx={{ py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }} alignItems='center'>
                    <Box flex={2}>
                      <Typography sx={{ textTransform: 'capitalize' }}>{datapoint.playerName}</Typography>
                    </Box>
                    <Box flex={1} textAlign='center'>{datapoint.easy === 0 ? '-' : datapoint.easy}</Box>
                    <Box flex={1} textAlign='center'>{datapoint.medium === 0 ? '-' : datapoint.medium}</Box>
                    <Box flex={1} textAlign='center'>{datapoint.hard === 0 ? '-' : datapoint.hard}</Box>
                  </Stack>
                )) : (
                  <Typography textAlign='center' sx={{ py: 3 }}>No scores yet for this category.</Typography>
                )
              ) : (
                <Typography textAlign='center' sx={{ py: 3 }}>No players yet. Play a game to create the first score.</Typography>
              )}
            </Stack>
          </Paper>
        </Stack>
      </Container>
    
  )
}
