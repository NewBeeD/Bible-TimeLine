import { setCookie, getCookie, deleteCookie, updateCookie, firstCookie } from "../modules/tempCookie";


export const FindHighScore = (active, mode) => {

  const cookieName = 'bibleTimeLine'
  const cookieData = getCookie(cookieName)
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
  
  }

  return cookieData[gameCategory][gameDifficulty];  
}
