import { useState, useEffect } from "react"
import { Typography } from "@mui/material"

export const MoveCounterIcon = ({moveCounter, level}) => {


  const [remainingMove, setRemainingMoves] = useState(level + 2)


  useEffect(()=>{

    if(remainingMove > 0){
      setRemainingMoves(()=> (level + 2) - moveCounter)
    }

    
  }, [moveCounter])




  return (
    (remainingMove > 0? (<Typography variant="h1" sx={{color: (remainingMove < 3? 'red': 'inherit')}}>{remainingMove}</Typography>): '')
  )
}
