import { Box, Typography, Card, List, ListItem, ListItemAvatar, ListItemText, Paper, Container, Avatar, Stack, Button } from "@mui/material"
import '../App.css'
import { DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'
import { useState } from "react"
import { numberGen } from "../modules/numberGen"
import { Link } from "react-router-dom"
import { useTimeLineContext } from "../hooks/useTimeLineContext"
import { eventsCheck } from '../modules/eventsOrderFinder'
import { orderChecker } from "../modules/orderChecker"



export const Gamepage = () => {


  const {difficulty, dispatch} = useTimeLineContext()  
  const [data, setData] = useState(numberGen(difficulty))

  let newList = [];
  let eventsOrder = eventsCheck(data)

  

  const nextSet = () =>{

    let bool = orderChecker(eventsOrder, data)
    if(bool){setData(numberGen(difficulty))}
  }
    

  const handleDragDrop = (result) => {

    if(!result.destination){return}

    const items = Array.from(data)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setData(items)
  }

  const changeCategory = () =>{
    dispatch({type: 'SET_DIFFICULTY', payload: null})
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
              sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper', textAlign: 'center'}}>

              {data && data.map((points, index)=> (
                
                <Draggable key={points.id} draggableId={points.id.toString()} index={index}>

                {(provided) => (

                  <Paper ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} elevation={3} sx={{marginBottom: '20px'}}>

                    <ListItem sx={{textAlign: "center"}}>
                      <ListItemText  primary={points.event} />
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

      

      <Stack display='flex' justifyContent='center' direction='row' spacing={16} sx={{marginTop: '10px'}}>
          <Button variant="outlined" color="secondary" >Reset</Button>
          <Button variant="outlined" color="secondary" onClick={nextSet}>Next</Button>
      </Stack>
    </div>
  )
}



