import { useState, useEffect } from "react"
import { Typography } from "@mui/material"

export const MoveCounterIcon = ({moveCounter, level}) => {

  const [remainingMove, setRemainingMoves] = useState((level + 2) - moveCounter)


  // useEffect(()=>{

  //   if(remainingMove > -1){
  //     setRemainingMoves(()=> (remainingMove) - 1)
  //   }
    
  // }, [moveCounter]) 
  // console.log('remainingMove',remainingMove);
  // // console.log('remainingMoves',remainingMove);


  return (
    // (remainingMove > -1? (<Typography variant="h1" sx={{color: (remainingMove < 3? 'red': 'inherit')}}>{(level + 1) - moveCounter}</Typography>): '')

  <Typography>{(level + 1) - moveCounter}</Typography>
  )
  
}
