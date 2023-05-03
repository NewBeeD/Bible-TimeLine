import { Box, Typography, Card, List, ListItem, ListItemAvatar, ListItemText, Paper, Container, Avatar } from "@mui/material"
import '../App.css'
import { DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'

export const Gamepage = () => {


  return (

    <div>
      <Container maxWidth='sm'>

        <DragDropContext>

          <Droppable droppableId="list">

            {(provided) => (

              <List {...provided.droppableProps} ref={provided.innerRef} sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>

              {data.map(({id, title}, index)=> {
                return(

                  <Draggable key={id} draggableId={id.toString()} index={index}>

                    {(provided) => (

                      <Paper ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} elevation={3} sx={{marginBottom: '10px'}}>

                        <ListItem>
                          <ListItemText primary={title} />
                        </ListItem>

                      </Paper>

                    )}

                  </Draggable>
                )
              })}


            </List>
            )}
        
          </Droppable>
        </DragDropContext>


      </Container>
    </div>
  )
}



const data = [
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
