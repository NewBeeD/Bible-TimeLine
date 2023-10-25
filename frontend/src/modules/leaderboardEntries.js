



export const leaderboardData = (userScores) => {

  let oldTestamentData;
  let newTestamentData;
  let mixedData;
  let allData = [];


  const userData = Object.values(userScores).map((user) => [user.data, user.userName, user.userImg])
  const userNames = Object.values(userScores).map((user) => user.userName)

  console.log(userData);


  for(let i = 0; i < userNames.length; i++){

    for(const key in userData[i][0]){


      if(key === 'OT'){ 
        oldTestamentData =  {...userData[i][0]['OT'], playerName: userNames[i], playerImg: userData[i][2], mode: 'oldtestament'}
        allData.push(oldTestamentData)
      }

      if(key === 'NT'){ 
        newTestamentData = {...userData[i][0]['NT'], playerName: userNames[i], playerImg: userData[i][2], mode: 'newtestament'}
        allData.push(newTestamentData)}

      if(key === 'OT'){ 
        mixedData = {...userData[i][0]['MX'], playerName: userNames[i], playerImg: userData[i][2], mode: 'mixed'}
        allData.push(mixedData)
      }

    }
  }



  return allData
}