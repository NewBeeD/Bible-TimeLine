import { setCookie, getCookie, deleteCookie, updateCookie, firstCookie } from "./tempCookie";

// Firebase Support
import { db } from "../firebaseAuth/firebaseSDK";
import { auth } from '../firebaseAuth/firebaseSDK'
import {  onAuthStateChanged } from 'firebase/auth'
import {set, ref, onValue} from 'firebase/database'





export const FindHighScore = (active, mode, userHighScores) => {


  // let uid;
  // let userData;
  // let userScore;

  // onAuthStateChanged(auth, (user) => {

  //   if(user){

  //     uid = user.uid   
  //     userData = ref(db, 'users/' + uid + '/data')      

  //     onValue(userData, (snapshot) => {
        
  //       userScore = snapshot.val()
  //       console.log(userScore);
  //     })

  //   }
  //   else{
  //     alert('User Not Logged In')     
  //   }
  // })


  // const cookieName = 'bibleTimeLine'
  // const cookie = getCookie(cookieName)
  // const cookieData = userScores
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

  console.log('User Scores', userHighScores);

  return userHighScores[gameCategory][gameDifficulty];  
  // return 4;  
}
