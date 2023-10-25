import { Box, Typography,  Stack, Button, Skeleton } from "@mui/material"

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import '../Css/leaderBoardCss.css'
import { useState, useEffect } from "react"
import { sortDifficultyMode } from "../modules/SortDifficultyMode";
import { Link } from "react-router-dom";

// Firebase Database config
import { db } from "../firebaseAuth/firebaseSDK";
import { auth } from '../firebaseAuth/firebaseSDK'
import {  onAuthStateChanged } from 'firebase/auth'
import {set, ref, onValue} from 'firebase/database'
import { leaderboardData } from "../modules/leaderboardEntries";


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



export const LeaderBoard = () => {

  const [userHighScores, setUserHighScores] = useState([])
  const [allUserData, setAllUserData] = useState(false)


  useEffect(() =>{
    
    const userData = ref(db, 'users/')

    onValue(userData, (snapshot) => {
      let highScore = snapshot.val()
      const playerDataOrganized = leaderboardData(highScore)
      const firstEntry = playerDataOrganized.filter(modeName => modeName.mode === 'newtestament')
      setAllUserData(playerDataOrganized)
      setData(firstEntry)
      console.log(playerDataOrganized);
    })
  }, [])

  // Problem function
  // const initialPrint = allUserData.filter(modeName => modeName.mode === 'newtestament')

  // console.log(initialPrint);

  const [data, setData] = useState()
  const [color, setColor] = useState('newtestament')
  const [arrow, setArrow] = useState({easy: false, medium: false, hard: false})

  // This function is used to filter the user data by game mode category
  const filterData = (gameMode) => {
 
    let newScores = allUserData.filter(modeName => modeName.mode === gameMode)
    console.log(newScores);
    setData(newScores)
    setColor(gameMode)
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

    

    <Stack marginTop={7} alignItems='center' sx={{ width: '100%', height: '100vh'}}>  

    <Stack>

      <Box>

        <Link to='/'>

          <Typography variant="h3" sx={{color: 'blue'}}>Home</Typography>

        </Link>
        
      </Box>
    </Stack>

    <Box marginTop={10}>
      <Typography variant="h3">LEADERBOARD</Typography>
    </Box>

    <Stack direction='row' marginTop={8} spacing={5}>
      <Button variant="outlined" onClick={() => filterData('oldtestament')} sx={{color: (color === 'oldtestament'? 'red': 'black'), width: {xs: 30, sm: 130, md: 140, lg: 170}}}>

        <Typography sx={{ fontSize: {xs: 12, sm: 15, md: 17, lg: 20}}}>
          Old Testament
        </Typography>
        

        
      </Button>

      <Button variant="outlined" onClick={() => filterData('newtestament')} sx={{color: (color === 'newtestament'? 'red': 'black'), width: {xs: 30, sm: 130, md: 140, lg: 170}}}>
        
        <Typography sx={{ fontSize: {xs: 12, sm: 15, md: 17, lg: 20}}}>
          New Testament
        </Typography>
        
      </Button>
      
      <Button variant="outlined" onClick={() => filterData('mixed')} sx={{color: (color === 'mixed'? 'red': 'black'), width: {xs: 30, sm: 130, md: 140, lg: 170}}}>
        
        <Typography sx={{ fontSize: {xs: 12, sm: 15, md: 17, lg: 20}}}>
          Mixed
        </Typography>

      </Button>
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

   

    {allUserData ? (data.map(datapoint => 
      (<Stack direction='row' marginTop={2} height='35px' width='90%' boxShadow={5} justifyContent='center' alignItems='center' sx={{borderRadius: '7px'}} >

        <Box width={200} sx={{textAlign: 'center', paddingY: 10}}>

          <Stack justifyContent='center' direction='row'>

            {/* <img src={datapoint.playerImg} width={40} height={40} alt=""/> */}

            <Typography sx={{textTransform: 'capitalize', fontSize: {xs: 12, sm: 20, md: 20, lg: 22}}}>{datapoint.playerName}</Typography>

            {/* <img src={datapoint.playerImg} width={40} height={40} alt=""/> */}

            
          </Stack>        
          
        </Box>

        <Box width={200} sx={{textAlign: 'center'}}>
          {datapoint.easy === 0? '-': datapoint.easy}
        </Box>

        <Box width={200} sx={{textAlign: 'center'}}>
          {datapoint.medium === 0? '-': datapoint.medium}
        </Box>

        <Box width={200} sx={{textAlign: 'center'}}>
          {datapoint.hard === 0? '-': datapoint.hard}
        </Box>

        </Stack>)
      )): <Skeleton variant="rectangular" width='90%' height='20%' animation="wave"/>}

      
    </Stack>
    
  )
}
