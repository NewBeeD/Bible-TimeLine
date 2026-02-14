import Cookie from 'js-cookie'


export const setCookie = (name, value, expire) => {

  const date = new Date()
  date.setTime(date.getTime() + expire * 24 * 60 * 60 * 1000)
  let expireDate = "expires=" + date.toUTCString()

  const val = JSON.stringify(value)
  document.cookie = `${name}=${val}; ${expireDate}`
}


export const deleteCookie = (name) => {

  setCookie(name, null, null)
}



export const firstCookie = (difficulty, score) => {

    let OT = {easy: 0, medium: 0, hard: 0}
    let NT = {easy: 0, medium: 0, hard: 0}
    let MX = {easy: 0, medium: 0, hard: 0}
    let data = {}

    const diffMode = difficulty.diffMode.level
    const gameMode = difficulty.data

    const difficultyCheck = (mode) =>{

      if(mode === 'OT'){

        switch(diffMode){

          case 4:
            OT = {...OT, easy: score}
            break;
          
          case 5:
            OT = {...OT, medium: score}
            break;
          
          case 6:
            OT = {...OT, hard: score}
            break;

          default:
            break;
        }
      }
      
      else if(mode === 'NT'){

        switch(diffMode){

          case 4:
            NT = {...NT, easy: score}
            break;
          
          case 5:
            NT = {...NT, medium: score}
            break;
          
          case 6:
            NT = {...NT, hard: score}
            break;

          default:
            break;
        }
      }

      else if(mode === 'MX'){

        switch(diffMode){

          case 4:
            MX = {...MX, easy: score}
            break;
          
          case 5:
            MX = {...MX, medium: score}
            break;
          
          case 6:
            MX = {...MX, hard: score}
            break;

          default:
            break;
        }
      }

    }

    
    switch(gameMode){

      case 1:
        difficultyCheck('OT')
        break;
      
      case 2:
        difficultyCheck('NT')
        break;

      case 3:
        difficultyCheck('MX')
        break;

      default:
        break;
    }



    data = {OT, NT, MX}  

    setCookie('bibleTimeLine', data, 25550)
}


export const getCookie = () => {

  const cookieName = 'bibleTimeLine'
  const cookieRaw = Cookie.get(cookieName)

  if(!cookieRaw){
    return null
  }

  try {
    const cookieData = JSON.parse(cookieRaw)
    return cookieData;
  }
  catch(error){
    return null
  }

}

export const updateCookie = (difficulty, score) => {

  const cookieName = 'bibleTimeLine'
  let cookieData = getCookie()

  if(!cookieData){
    firstCookie(difficulty, score)
    return
  }

  let OT = {...cookieData.OT}
  let NT = {...cookieData.NT}
  let MX = {...cookieData.MX}
  let updateScore;

  const diffMode = difficulty.diffMode.level
  const gameMode = difficulty.data

  function upgradeScore(){

    switch(gameMode){

      case 1:
        compareScore('OT')
        break;
      
      case 2:
        compareScore('NT')
        break;
      
      case 3:
        compareScore('MX')
        break;

      default:
        break;

    }
    
    function compareScore(mode){

      if(diffMode === 4){
        updateScore = (score > cookieData[mode].easy)
        if(updateScore === true){applyScoreUpdate(mode, diffMode)}
      }

      else if(diffMode === 5){
        updateScore = (score > cookieData[mode].medium)
        if(updateScore === true){applyScoreUpdate(mode, diffMode)}
      }

      else if(diffMode === 6){
        updateScore = (score > cookieData[mode].hard)
        if(updateScore === true){applyScoreUpdate(mode, diffMode)}
      }
    }

  }


  function applyScoreUpdate(mode, difficultyLevel){
    
    if(mode === 'OT' && difficultyLevel === 4){ OT = {...OT, easy:score}}
    if(mode === 'OT' && difficultyLevel === 5){ OT = {...OT, medium:score}}
    if(mode === 'OT' && difficultyLevel === 6){ OT = {...OT, hard:score}}

    if(mode === 'NT' && difficultyLevel === 4){ NT = {...NT, easy:score}}
    if(mode === 'NT' && difficultyLevel === 5){ NT = {...NT, medium:score}}
    if(mode === 'NT' && difficultyLevel === 6){ NT = {...NT, hard:score}}

    if(mode === 'MX' && difficultyLevel === 4){ MX = {...MX, easy:score}}
    if(mode === 'MX' && difficultyLevel === 5){ MX = {...MX, medium:score}}
    if(mode === 'MX' && difficultyLevel === 6){ MX = {...MX, hard:score}}
  }

  upgradeScore()

  cookieData = {OT, NT, MX}

  setCookie(cookieName, cookieData, 25550)  


  // const difficultyCheck = (mode) =>{

  //   if(mode === 'OT'){

  //     switch(diffMode){

  //       case 4:
  //         OT = {...OT, easy: score}
  //         break;
        
  //       case 5:
  //         OT = {...OT, medium: score}
  //         break;
        
  //       case 6:
  //         OT = {...OT, hard: score}
  //     }
  //   }
    
  //   else if(mode === 'NT'){

  //     switch(diffMode){

  //       case 4:
  //         NT = {...NT, easy: score}
  //         break;
        
  //       case 5:
  //         NT = {...NT, medium: score}
  //         break;
        
  //       case 6:
  //         NT = {...NT, hard: score}
  //     }
  //   }

  //   else if(mode === 'MX'){

  //     switch(diffMode){

  //       case 4:
  //         MX = {...MX, easy: score}
  //         break;
        
  //       case 5:
  //         MX = {...MX, medium: score}
  //         break;
        
  //       case 6:
  //         MX = {...MX, hard: score}
  //     }
  //   }

  // }

  // switch(gameMode){

  //   case 1:
  //     difficultyCheck('OT')
  //     break;
    
  //   case 2:
  //     difficultyCheck('NT')
  //     break;

  //   case 3:
  //     difficultyCheck('MX')
  //     break;
  // }



}


