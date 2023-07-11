import { useState } from "react"

export const sortDifficultyMode = (dataPoints, arrow, gameMode, difficultyMode) => {

  // ascending
  // homes.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

  // descending
  // homes.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));


  console.log(arrow);

  let newScores = dataPoints.filter(modeName => modeName.mode === gameMode)

  if(difficultyMode === 'easy'){

    if(arrow.easy){

      newScores.sort((a, b) => parseFloat(a.easyscore) - parseFloat(b.easyscore));
    }
    else{

      newScores.sort((a, b) => parseFloat(b.easyscore) - parseFloat(a.easyscore));
    }

  }

  else if(difficultyMode === 'medium'){

    console.log('inside if');

    if(arrow.medium){

      newScores.sort((a, b) => parseFloat(a.mediumscore) - parseFloat(b.mediumscore));
    }
    else{

      newScores.sort((a, b) => parseFloat(b.mediumscore) - parseFloat(a.mediumscore));
    }

  }

  else if(difficultyMode === 'hard'){

    console.log('inside if');

    if(arrow.hard){

      newScores.sort((a, b) => parseFloat(a.hardscore) - parseFloat(b.hardscore));
    }
    else{

      newScores.sort((a, b) => parseFloat(b.hardscore) - parseFloat(a.hardscore));
    }

  }
  
  return newScores
}
