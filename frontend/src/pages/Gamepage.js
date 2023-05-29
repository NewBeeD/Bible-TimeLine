import { Box, Typography, Card, List, ListItem, ListItemAvatar, ListItemText, Paper, Container, Avatar, Stack, Button } from "@mui/material"
import '../App.css'
import { DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'
import { useState } from "react"
import { numberGen } from "../modules/numberGen"
import { Link } from "react-router-dom"
import { useTimeLineContext } from "../hooks/useTimeLineContext"
import { eventsCheck } from '../modules/eventsOrderFinder'
import { orderChecker } from "../modules/orderChecker"
import { solution } from "../modules/solution"





export const Gamepage = () => {


  const {difficulty, dispatch} = useTimeLineContext()
 
  const [data, setData] = useState(numberGen(difficulty))
  const [truth, setTruth] = useState('')
  const [animation, setAnimation] = useState(null)

  let newList = [];
  let eventsOrder = eventsCheck(data)

  

  const nextSet = () =>{

    let bool = orderChecker(eventsOrder, data)
    if(bool){setData(numberGen(difficulty))}
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
    dispatch({type: 'SET_DIFFICULTY', payload: null})
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

  let order = eventsCheck(data)


  return (

    <div>

      <Button onClick={changeCategory}><Typography variant="h4" sx={{marginLeft: '40px', marginTop: '40px'}}><Link to='/' style={{ textDecoration: 'none'}}>HOME</Link></Typography></Button>

      <Typography variant="h2" display='flex' justifyContent='center' sx={{marginTop: '60px'}}>Bible TimeLine</Typography>

      <Container maxWidth='sm' sx={{ marginTop: '60px', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', minHeight: '400px'}}>

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

                  <Paper ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} elevation={3} sx={{marginBottom: '20px', border: (truth == 'red'? '2px solid red': truth == 'blue'? '2px solid blue': 'none')}} className={(animation? 'shake': '')}>

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
          
          <Button variant="outlined" size="large" color="secondary" onClick={nextSet}>Next</Button>
          <Button variant="outlined" color="secondary" onClick={eventSolution}>Solution</Button>
      </Stack>


    </div>
  )
}



