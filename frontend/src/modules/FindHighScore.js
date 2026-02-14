export const FindHighScore = (active, mode, userHighScores) => {


  let gameCategory;
  let gameDifficulty;


  switch(active){

    case 1:
      gameCategory = 'OT'
      break;

    case 2:
      gameCategory = 'NT'
      break;

    case 3:
      gameCategory = 'MX'
      break;
    
    default:
      break;
  
  }

  switch(mode.level){

    case 4:
      gameDifficulty = 'easy'
      break;

    case 5:
      gameDifficulty = 'medium'
      break;

    case 6:
      gameDifficulty = 'hard'
      break;
    
    default:
      break;
  
  }



  if(!gameCategory || !gameDifficulty){
    return 0
  }

  return userHighScores[gameCategory][gameDifficulty];  
  // return 4;  
}
