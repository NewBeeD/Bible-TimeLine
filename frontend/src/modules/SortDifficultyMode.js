import { useState } from "react"

export const sortDifficultyMode = (dataPoints, arrow, gameMode, difficultyMode) => {

  // ascending
  // homes.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

  // descending
  // homes.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));


  let newScores = dataPoints.filter(modeName => modeName.mode === gameMode)

  if(difficultyMode === 'easy'){

    if(arrow.easy){

      newScores.sort((a, b) => parseFloat(a.easy) - parseFloat(b.easy));
    }
    else{

      newScores.sort((a, b) => parseFloat(b.easy) - parseFloat(a.easy));
    }

  }

  else if(difficultyMode === 'medium'){

    if(arrow.medium){

      newScores.sort((a, b) => parseFloat(a.medium) - parseFloat(b.medium));
    }
    else{

      newScores.sort((a, b) => parseFloat(b.medium) - parseFloat(a.medium));
    }

  }

  else if(difficultyMode === 'hard'){

    if(arrow.hard){

      newScores.sort((a, b) => parseFloat(a.hard) - parseFloat(b.hard));
    }
    else{

      newScores.sort((a, b) => parseFloat(b.hard) - parseFloat(a.hard));
    }

  }
  
  return newScores
}
