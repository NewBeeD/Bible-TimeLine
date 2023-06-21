import { Box, Typography, Card, List, ListItem, ListItemAvatar, ListItemText, Paper, Container, Avatar, Stack, Button, AppBar, Toolbar } from "@mui/material"
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







export const Gamepage = () => {


  // const {difficulty, dispatch} = useTimeLineContext()

  const difficulty = JSON.parse(localStorage.getItem('data'));
 
  const [data, setData] = useState(numberGen(difficulty.data))
  const [truth, setTruth] = useState('')
  const [animation, setAnimation] = useState(null)
  const counterVal = useRef()
  const [btnDisabled, setBtnDisabled] = useState(false)
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false)

  const [counter, setCounter] = useState(30)

  let newList = [];
  let eventsOrder = eventsCheck(data)

  

  const nextSet = () =>{

    let bool = orderChecker(eventsOrder, data)
    if(bool){
      setData(numberGen(difficulty.data))
      setCounter(30)
      setScore((scr) => scr + 10)
    }
    else{
      setTruth('red')
      setAnimation(true)}
  }
    

  const handleDragDrop = (result) => {

    setTruth('none')
    setAnimation(false)

    if(!result.destination){return}

    const items = Array.from(data)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setData(items)
  }

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

  useEffect(() => {

    counterVal.current = setInterval(decreaseNum, 1000);
    return () => clearInterval(counterVal.current);

  })


  const decreaseNum = () => {

    if(counter > 0){
      setCounter((prev) => prev - 1)
    }
    else{
      // setCounter(0)
      clearInterval(counterVal.current);
      setBtnDisabled(true)
    }};

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
            >
                <MenuIcon />
              </IconButton>

          </Box>        


          <Box >

            <Button onClick={changeCategory}><Typography variant="h5" sx={{alignItems: 'center'}}><Link to='/' style={{textDecoration: 'none'}}>Bible TimeLine</Link></Typography></Button>

          </Box>

          <Box direction="row" spacing={1} sx={{ display: 'flex', alignItems: 'center'}}>

            <Typography></Typography>
            <Switch color="secondary"/>
          </Box>

        </Toolbar>
      </AppBar>

      



      <Box display='flex' justifyContent='center' marginTop={8}>

        <Box>
          <Typography variant="h3">00:{counter < 10? `0${counter}`: counter}</Typography>
        </Box>


        {showScore && <Box display='flex' alignContent='center' marginLeft={10} color='red' sx={{backgroundColor: 'black', paddingX: '10px'}}>
          <Typography variant="h3">{ score}</Typography>
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



