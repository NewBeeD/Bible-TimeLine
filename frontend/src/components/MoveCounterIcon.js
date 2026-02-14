import { Typography } from "@mui/material"

export const MoveCounterIcon = ({moveCounter, level}) => {
  return (
    <Typography>{level - moveCounter}</Typography>
  )
  
}
