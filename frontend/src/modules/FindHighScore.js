import { getCookie } from "../modules/tempCookie";


export const FindHighScore = (active, mode) => {

  const cookieData = getCookie()

  if(!cookieData){
    return 0
  }

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
      return 0
  
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
      return 0
  
  }

  return cookieData?.[gameCategory]?.[gameDifficulty] ?? 0
}
