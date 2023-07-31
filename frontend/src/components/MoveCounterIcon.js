import { useState, useEffect } from "react"
import { Typography } from "@mui/material"

export const MoveCounterIcon = ({moveCounter, level}) => {

  const [remainingMove, setRemainingMoves] = useState(level + 1)


  useEffect(()=>{

    if(remainingMove > -1){
      setRemainingMoves(()=> (remainingMove) - 1)

    }
    
  }, [moveCounter]) 


  return (
    (remainingMove > -1? (<Typography variant="h1" sx={{color: (remainingMove < 3? 'red': 'inherit')}}>{remainingMove}</Typography>): '')
  )
}
