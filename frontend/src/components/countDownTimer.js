import { Typography, Box } from "@mui/material"
import { useState, useEffect } from "react"

export const CountDownTimer = (props) => {

  const [counter, setCounter] = useState(props.time)
  
  useEffect(() => {

    if(counter > 0){
      setTimeout(() => setCounter(counter -1), 1000)
    }
  }, [counter])

  
  return(

    <>
      <Typography variant="h3">00:{counter < 10? `0${counter}`: counter}</Typography>
      
    </>   
  )
}
