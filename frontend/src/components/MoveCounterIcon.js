import { Typography } from "@mui/material"

export const MoveCounterIcon = ({moveCounter, level}) => {

  return (
  <Typography>{(level + 1) - moveCounter}</Typography>
  )
  
}
