



export const leaderboardData = (userScores) => {

  if(!userScores){
    return []
  }

  const blankScores = {easy: 0, medium: 0, hard: 0}
  const allData = []

  Object.values(userScores).forEach((user) => {
    const userData = user?.data || {}
    const playerName = user?.userName || 'player'
    const playerImg = user?.userImg || ''

    allData.push({
      ...blankScores,
      ...(userData.OT || {}),
      playerName,
      playerImg,
      mode: 'oldtestament'
    })

    allData.push({
      ...blankScores,
      ...(userData.NT || {}),
      playerName,
      playerImg,
      mode: 'newtestament'
    })

    allData.push({
      ...blankScores,
      ...(userData.MX || {}),
      playerName,
      playerImg,
      mode: 'mixed'
    })
  })

  return allData
}