import { Box, Typography, List, ListItem, ListItemText, Paper, Container, Stack, Button, AppBar, Toolbar, Drawer, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, Divider, Switch } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import '../App.css'
import { DragDropContext, Droppable, Draggable} from '@hello-pangea/dnd'
import { useState, useEffect } from "react"
import { numberGen } from "../modules/numberGen"
import { Link, Navigate } from "react-router-dom"
import { eventsCheck } from '../modules/eventsOrderFinder'
import { orderChecker } from "../modules/orderChecker"
import { solution } from "../modules/solution"
import { updateCookie, firstCookie } from "../modules/tempCookie";
import { MoveCounterIcon } from "../components/MoveCounterIcon";



import ReactCountdownClock from 'react-countdown-clock'
// import { useWindowSize } from "@uidotdev/usehooks";
// import breakPoint from "../modules/BreakPointCalculator";





export const Gamepage = () => {


  // const {difficulty, dispatch} = useTimeLineContext()

  let parsedDifficulty = null;

  try {
    parsedDifficulty = JSON.parse(localStorage.getItem('data'));
  } catch (error) {
    parsedDifficulty = null;
  }

  const hasValidDifficulty = !!(parsedDifficulty?.data && parsedDifficulty?.diffMode?.level && parsedDifficulty?.diffMode?.time)
  const difficulty = hasValidDifficulty
    ? parsedDifficulty
    : { data: 2, diffMode: { level: 4, time: 30 } }

 
  const [data, setData] = useState(numberGen(difficulty.data, difficulty.diffMode.level))
  const [truth, setTruth] = useState('')
  const [animation, setAnimation] = useState(null)
  const [btnNxtDisabled, setBtnNxtDisabled] = useState(false)
  const [btnSolDisabled, setBtnSolDisabled] = useState(false)

  const [score, setScore] = useState(0)
  const showScore = true

  // const [countdown, setCountDown] = useState(() => <CountDownTimer />)
  
  const [counter, setCounter] = useState(difficulty.diffMode.time)
  const [isDrawerOPen, setIsDrawerOpen] = useState(false)
  const [timer, setTimer] = useState(false)
  const [open, setOpen] = useState(true)
  const [moveCounter, setMoveCounter] = useState(1)
  const [blankTimer, setBlankTimer] = useState(false)
  const [modal, setModal] = useState(true)


  const moveCounterFunction = () =>{


    let gameMode = difficulty.diffMode.level

    if(moveCounter > parseInt(gameMode, 10)){

      if(modal === true){
        firstCookie(difficulty, score)
      }
      else{
        updateCookie(difficulty, score)
      }
      
      setBtnNxtDisabled(true) 
      setBlankTimer(true)
      setMoveCounter(1)}
  }

  


  // random number added to the counter so as to render on every problem set
  const randomNum = (boolData) => {

    if(boolData.toString() === 'true'){ return 0 }
    return Math.random()
  }

  const timerChange = (event) => {
    setTimer(event.target.checked);
  }
  

  // Returns the correct order of the events
  let eventsOrder = eventsCheck(data)

  const nextSet = () =>{

    // Matches the solution to the order entered, returns true or false
    let bool = orderChecker(eventsOrder, data)

    if(bool){

      if(btnNxtDisabled && btnSolDisabled){

        setBtnNxtDisabled(false)
        setBtnSolDisabled(false)
        setBlankTimer(false)
        setScore(0)
      }
      else{
        setScore((scr) => scr + 1)
      }

      setMoveCounter(1)

      setData(numberGen(difficulty.data, difficulty.diffMode.level))
      // setCounter(40 + randomNum(timer))
      
      
      switch(difficulty.diffMode.level){

        case 4:
          setCounter(30 + randomNum(timer))
          break;
        
        case 5:
          setCounter(40 + randomNum(timer))
          break;

        case 6:
          setCounter(50 + randomNum(timer))
          break;

        default:
          break;
      }
    }
    else{
      setTruth('red')
      setAnimation(true)}
  }
    
  // Drag and Drop Functionality
  const handleDragDrop = (result) => {


    const {source, destination} = result

    setTruth('none')
    setAnimation(false)
    

    if(!result.destination){return}

    const items = Array.from(data)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    
    if(source.draggableId !== destination.droppableId && source.index !== destination.index){

      setMoveCounter(() => moveCounter + 1)

      setData(items)
      moveCounterFunction()}
    // moveCounterFunction()
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


    if(modal === true){
      firstCookie(difficulty, score)
    }
    else{
      updateCookie(difficulty, score)
    }
    
    setData(solutionData)
    setTimeout(setBlue, 1000)
    setBtnNxtDisabled(true)
    setScore(score)
    
    
    setTimeout(() => {setBtnSolDisabled(true); setBlankTimer(true)}, 300);
    
  }

  function setBlue(){
    setTruth('none')
  }

  
  // Setting up temporary highscore data storage
  useEffect(() => {
    if(document.cookie){
      setModal(false)
      setOpen(false)
    }
  }, [])

  const cookieFunction = () => {

    setBtnNxtDisabled(true)

    if(modal === true){
      firstCookie(difficulty, score)
    }
    else{
      updateCookie(difficulty, score)
    }

    setScore(score)
    
  }

  if (!hasValidDifficulty) {
    return <Navigate to='/' replace />
  }


  if(open){
    return (

      <div minHeight="100vh" className="gamePage">

        <AppBar position="static" sx={{ backgroundColor: '#173174', marginBottom: {xs: '185px', sm: '150px', md: '100px', lg: '200px'} }}>
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

              <Button onClick={changeCategory}><Typography variant="h5" sx={{alignItems: 'center', color: 'white'}}><Link to='/' style={{textDecoration: 'none', color: 'white'}}>Bible TimeLine</Link></Typography></Button>

            </Box>

            <Box direction="row" spacing={1} sx={{ display: 'flex', alignItems: 'center'}}>

              <Typography></Typography>
              {/* <Switch color="secondary"/> */}
            </Box>

          </Toolbar>
        </AppBar>


        {modal && <Dialog open={open} >

          <DialogTitle><Typography component="div" variant="h4">How to Play</Typography></DialogTitle>
          <DialogTitle><Typography component="div" variant="h5">Find the order of events in {difficulty.diffMode.level} moves</Typography></DialogTitle>

          <DialogContent>
            <DialogContentText>Simply drag and drop events in their chronological order.</DialogContentText>
            <Divider sx={{marginY: '10px'}}/>
            <DialogContentText>Click next if you are confident in your order of events.</DialogContentText>
            <Divider sx={{marginY: '10px'}}/>
            <DialogContentText>If it shows red, that means your order is not correct, so try again.</DialogContentText>
            <Divider sx={{marginY: '10px'}}/>
            <DialogContentText>If you are unable to solve, then click solution to see the answer.</DialogContentText>

          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpen(false)}>OK</Button>
          </DialogActions>

        </Dialog>}

      
        <Container sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', minHeight: '300px'}}>
  
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
                <ListItemText  primary={points.event} primaryTypographyProps={{fontSize: {xs:'20px', sm:'25px', md: '28px'}}} />
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

      </div>
    )
  }
  else{

    return (

      <div minHeight="100vh" className="gamePage">
  
        <AppBar position="static" sx={{ backgroundColor: '#173174' }}>
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
  
              <Button onClick={changeCategory}><Typography variant="h5" sx={{alignItems: 'center', color: 'white'}}><Link to='/' style={{textDecoration: 'none', color: 'white'}}>Bible TimeLine</Link></Typography></Button>
  
            </Box>
  
            <Box direction="row" spacing={1} sx={{ display: 'flex', alignItems: 'center'}}>
  
              <Typography></Typography>
              {/* <Switch color="secondary"/> */}
            </Box>
  
          </Toolbar>
        </AppBar>
  
        {/* Drawer */}
        <Drawer anchor="left" 
        open={isDrawerOPen}
        onClose={() => setIsDrawerOpen(false)
        }>
  
          <Box p={2} width='250px' textAlign='center' justifyContent='center' role='presentation'>
  
            <Typography variant="h4" style={{color: '#173174'}}> Settings </Typography>
  
            <Box marginTop={10}>
  
              <Box>
                <Stack spacing={10} direction='row' alignItems='center' justifyContent='center' >
  
                  <Box>
                    <Typography>Speedster</Typography>
                  </Box>
  
                  <Box>
                    <Switch 
                    checked={timer}
                    onChange={timerChange}
                    />              
                  </Box>
  
                </Stack>
              </Box>
  
              <Box>
                <Typography marginTop={5} variant="body1" sx={{cursor: 'pointer'}}>ScoreBoard</Typography>
              </Box>
              
  
            </Box>
  
          </Box>
  
        </Drawer>
  
        {/* CountDown Timer */}
        <Box display='flex' justifyContent='center' marginTop={{xs:5, sm:8, md:10, lg:12}} marginBottom={2}>
  
          {/* <Box>
            <Typography variant="h3">00:{counter < 10? `0${counter}`: counter}</Typography>
          </Box> */}

        {!blankTimer? <ReactCountdownClock 
                      seconds={counter}
                      color="#173174"
                      alpha={0.9}
                      size={150}
                      onComplete={cookieFunction}
                      /> : <ReactCountdownClock 
                      seconds={0}
                      color="#090"
                      alpha={0.9}
                      size={150}
                      /> }

  
        </Box>
  
        {showScore && <Box margin='auto' marginY={2} sx={{textAlign: 'center', border: '2px solid #173174', width: '120px', borderRadius: '10px'}}>
  
          {showScore && 
          <Box sx={{textAlign: 'center'}}>
  
            <Typography variant="h3" style={{color: '#173174'}}>{ score }</Typography>
            
          </Box>}
  
        </Box>}
  
        
  
        <Container sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', minHeight: '300px'}}>
  
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
                        <ListItemText  primary={points.event} primaryTypographyProps={{fontSize: {xs:'20px', sm:'25px', md: '28px'}}} />
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

        {!btnSolDisabled && 
        
        <Stack display='flex' justifyContent='center' direction='row' spacing={{xs: 15, sm: 20, md: 25, lg: 15}} sx={{marginTop: '0px'}}>
            
            <Button variant="outlined" size="large" color="secondary" onClick={nextSet} disabled={btnNxtDisabled} startIcon={<MoveCounterIcon moveCounter={moveCounter} level={difficulty.diffMode.level}/>}>Next</Button>
            <Button variant="outlined" color="secondary" onClick={eventSolution} disabled={btnSolDisabled}>Solution</Button>
        </Stack>}

        {btnSolDisabled && 

          <Stack display='flex' justifyContent='center' direction='row' spacing={{xs: 15, sm: 20, md: 25, lg: 15}} sx={{marginTop: '0px'}}>

            <Button 
            variant="outlined" 
            size="large" 
            color="secondary" 
            onClick={nextSet} 
            >
              Try Again
            </Button>

          </Stack>
        }
  
        
  
        
  
  
      </div>
    )


  }
}



