import { Box, Typography, Card, List, ListItem, ListItemAvatar, ListItemText, Paper, Container, Avatar, Stack, Button } from "@mui/material"
import '../App.css'
import { DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'
import { useState } from "react"
import { numberGen } from "../modules/numberGen"


export const Gamepage = () => {

  


  const [data, setData] = useState(numberGen())

  const nextSet = () =>{}
  const resetData = () =>{}

  console.log(data);





  const handleDragDrop = (result) => {

    if(!result.destination){return}

    const items = Array.from(data)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setData(items)
  }


  return (

    <div>

      <Typography variant="h2" display='flex' justifyContent='center' sx={{marginTop: '60px'}}>Bible TimeLine</Typography>

      
      <Container maxWidth='sm' sx={{ marginTop: '60px', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>

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

      <Stack display='flex' justifyContent='center' direction='row' spacing={16} sx={{marginTop: '30px'}}>
          <Button variant="outlined" color="secondary" onClick={nextSet}>Next</Button>
          <Button variant="outlined" color="secondary" onClick={resetData}>Reset</Button>
      </Stack>
    </div>
  )
}



const dataEntry = [
  {
    id: '1',
    title: 'Abraham departs from the land of Nod'
  },
  {
    id: '2',
    title: 'David Kills Goliath'
  },
  {
    id: '3',
    title: 'Joshua becomes the first Judge'
  },
  {
    id: '4',
    title: 'Solomon Prays for Wisdom'
  },
  {
    id: '5',
    title: 'Hannah prays for a Child'
  },
  {
    id: '6',
    title: 'Samuel hears God"s Voice'
  },
  {
    id: '7',
    title: 'Eli is saddened by the loss of the Ark'
  }
]
