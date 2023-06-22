import { Box, Typography, Card, List, ListItem, ListItemAvatar, ListItemText, Paper, Container, Avatar, Stack, Button, AppBar, Toolbar, Drawer, Radio, RadioGroup, FormControl, FormControlLabel, FormLabel } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import '../App.css'
import { DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'
import { useState, useEffect, useRef } from "react"
import { numberGen } from "../modules/numberGen"
import { Link } from "react-router-dom"
import { useTimeLineContext } from "../hooks/useTimeLineContext"
import { eventsCheck } from '../modules/eventsOrderFinder'
import { orderChecker } from "../modules/orderChecker"
import { solution } from "../modules/solution"
import Switch from '@mui/material/Switch';

import ReactCountdownClock from 'react-countdown-clock'
import CountDownTimer from "../components/CountDownTimer";








export const Gamepage = () => {


  // const {difficulty, dispatch} = useTimeLineContext()

  const difficulty = JSON.parse(localStorage.getItem('data'));
 
  const [data, setData] = useState(numberGen(difficulty.data, 4))
  const [truth, setTruth] = useState('')
  const [animation, setAnimation] = useState(null)
  const counterVal = useRef()
  const [btnDisabled, setBtnDisabled] = useState(false)
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false)

  const [countdown, setCountDown] = useState(() => <CountDownTimer />)
  

  const [counter, setCounter] = useState(40)
  const [isDrawerOPen, setIsDrawerOpen] = useState(false)
  const [value, setValue] = useState(4);
  const [timer, setTimer] = useState(false)

  const handleChange = (event) => {
    setValue(parseInt(event.target.value, 10));
    numberGen(difficulty.data, value)
    
  };
  
  // random number added to the counter so as to render on every problem set
  const randomNum = (boolData) => {

    if(boolData.toString() === 'true'){ return 0 }
    return Math.random()
  }

  const timerChange = (event) => {
    setTimer(event.target.checked);
  }


  let newList = [];

  // Returns the correct order of the events
  let eventsOrder = eventsCheck(data)

  const nextSet = () =>{

    // Matches the solution to the order entered, returns true or false
    let bool = orderChecker(eventsOrder, data)

    if(bool){
      setData(numberGen(difficulty.data, value))
      setCounter(40 + randomNum(timer))
      setScore((scr) => scr + 10)
      
      switch(value){

        case 5:
          setCounter(50 + randomNum(timer))
          break;
        
        case 6:
          setCounter(60 + randomNum(timer))
          break;

        case 7:
          setCounter(70 + randomNum(timer))
          break;
      }
    }
    else{
      setTruth('red')
      setAnimation(true)}
  }
    
  // Drag and Drop Functionality
  const handleDragDrop = (result) => {

    setTruth('none')
    setAnimation(false)

    if(!result.destination){return}

    const items = Array.from(data)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setData(items)
  }

  // Removing Gamemode from local-storage 
  const changeCategory = () =>{
    // dispatch({type: 'SET_DIFFICULTY', payload: null})
    // localStorage.clear()
    localStorage.removeItem('data');
  }

  const eventSolution = () => {

    let solutionData = solution(eventsOrder, data) 
    setTruth('blue')
    setData(solutionData)
    setTimeout(setBlue, 1500)
  }

  function setBlue(){
    setTruth('none')
  }

  // useEffect(() => {

  //   counterVal.current = setInterval(decreaseNum, 1000);
  //   return () => clearInterval(counterVal.current);

  // })


  // const decreaseNum = () => {

  //   if(counter > 0){
  //     setCounter((prev) => prev - 1)
  //   }
  //   else{
  //     // setCounter(0)
  //     clearInterval(counterVal.current);
  //     setBtnDisabled(true)
  //   }};


  let order = eventsCheck(data)

 
  return (

    <div minHeight="100vh" className="gamePage">

      <AppBar position="static" >
        <Toolbar sx={{ justifyContent: "space-between" }}>

          <Box>

            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={()=>setIsDrawerOpen(true)}
            >
                <MenuIcon />
              </IconButton>

          </Box>        


          <Box >

            <Button onClick={changeCategory}><Typography variant="h5" sx={{alignItems: 'center'}}><Link to='/' style={{textDecoration: 'none'}}>Bible TimeLine</Link></Typography></Button>

          </Box>

          <Box direction="row" spacing={1} sx={{ display: 'flex', alignItems: 'center'}}>

            <Typography></Typography>
            {/* <Switch color="secondary"/> */}
          </Box>

        </Toolbar>
      </AppBar>

      <Drawer anchor="left" 
      open={isDrawerOPen}
      onClose={() => setIsDrawerOpen(false)
      }>

        <Box p={2} width='250px' textAlign='center' justifyContent='center' role='presentation'>

          <Typography>
            SETTINGS
          </Typography>


          <Stack marginTop={10} >

            <Stack direction='column' spacing={8} justifyContent='center' alignContent='center'>
              {/* <Stack>
                <Typography>Difficulty</Typography>

              </Stack> */}

              <Stack justifyContent='center' alignContent='center' direction='row'>

                <FormControl>
                  <FormLabel>Difficulty</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={value}
                      onChange={handleChange}
                      sx={{ width: '250px'}}
                    >
                      <FormControlLabel value="4" control={<Radio />} labelPlacement='start' label="4" />
                      <FormControlLabel value="5" control={<Radio />} labelPlacement='start' label="5" />
                      <FormControlLabel value="6" control={<Radio />} labelPlacement='start' label="6" />
                      {/* <FormControlLabel value="7" control={<Radio />} labelPlacement='start' label="7" /> */}
                    </RadioGroup>
                </FormControl>
                
              </Stack>

              <Stack spacing={15} direction='row' alignItems='center' justifyContent='center' >

                <Box>
                  <Typography>Timed</Typography>
                </Box>

                <Box>
                  <Switch 
                  checked={timer}
                  onChange={timerChange}
                  />              
                </Box>

              </Stack>


            </Stack>

          </Stack>

        </Box>

      </Drawer>

      



      <Box display='flex' justifyContent='center' marginTop={15} marginBottom={1}>

        {/* <Box>
          <Typography variant="h3">00:{counter < 10? `0${counter}`: counter}</Typography>
        </Box> */}

        <ReactCountdownClock 
            seconds={counter}
            color="#090"
            alpha={0.9}
            size={150}
            onComplete={() => setBtnDisabled(true)}
            />   


        {showScore && <Box display='flex' alignContent='center' marginLeft={10} color='red' sx={{backgroundColor: 'black', paddingX: '10px'}}>
          <Typography variant="h3">{ score }</Typography>
        </Box>}

      </Box>

      

      <Container maxWidth='sm' sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', minHeight: '400px'}}>

        <DragDropContext onDragEnd={handleDragDrop}>

          <Droppable droppableId="list">

            {(provided) => (

              <List 
              {...provided.droppableProps} 
              ref={provided.innerRef} 
              sx={{width: '100%', maxWidth: 560, bgcolor: 'background.paper', textAlign: 'center'}}>

              {data && data.map((points, index)=> (
                
                <Draggable key={points.id} draggableId={points.id.toString()} index={index}>

                {(provided) => (

                  <Paper ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} elevation={3} sx={{marginBottom: '20px', border: (truth === 'red'? '2px solid red': truth === 'blue'? '2px solid blue': 'none')}} className={(animation? 'shake': '')}>

                    <ListItem sx={{textAlign: "center"}} >
                      <ListItemText  primary={points.event} primaryTypographyProps={{fontSize: '25px'}} />
                    </ListItem>

                  </Paper>

                )}

              </Draggable>
              ))}

              {provided.placeholder}


            </List>
            )}
        
          </Droppable>
        </DragDropContext>

      </Container>

      

      <Stack display='flex' justifyContent='center' direction='row' spacing={16} sx={{marginTop: '0px'}}>
          
          <Button variant="outlined" size="large" color="secondary" onClick={nextSet} disabled={btnDisabled}>Next</Button>
          <Button variant="outlined" color="secondary" onClick={eventSolution}>Solution</Button>
      </Stack>


    </div>
  )
}



