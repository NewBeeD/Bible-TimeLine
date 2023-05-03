<Box 
      display='flex' 
      justifyContent='center' 
      minHeight='100vh' 
      alignItems="center"
      sx={{ border: '2px solid red', margin: '0px', padding: '0px'}}>

        <Box
        sx={{border: '2px solid black', width: 'auto', height: 'auto', marginTop: '-80px', textAlign: 'center'}}>

          <DragDropContext>
            <Droppable id='characters'>

              {(provided) => (

              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {data.map(({id, title}, index) => {
                  return (

                    <Draggable key={id} draggableId={id} index={index}>
  
                      {(provided) => (
  
                        <li {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                          <div style={{border: '2px solid red', margin: '4px 4px', padding: '4px', fontSize: '40px'}}>
                            {title}
                          </div>
                        </li>
  
                      )}
  
                    </Draggable>
                    
  
                  )})}
              </ul>


              )}


            </Droppable>
          </DragDropContext>
        
        </Box>


      </Box>