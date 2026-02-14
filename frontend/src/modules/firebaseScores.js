import { auth, db } from '../firebaseAuth/firebaseSDK'
import { ref, runTransaction, set, update } from 'firebase/database'

const getCategoryFromMode = (mode) => {
  if(mode === 1){ return 'OT' }
  if(mode === 2){ return 'NT' }
  if(mode === 3){ return 'MX' }
  return null
}

const getDifficultyFromLevel = (level) => {
  if(level === 4){ return 'easy' }
  if(level === 5){ return 'medium' }
  if(level === 6){ return 'hard' }
  return null
}

export const upsertPlayerScore = async (difficulty, score) => {
  const user = auth.currentUser
  if(!user){
    return false
  }

  const category = getCategoryFromMode(difficulty?.data)
  const difficultyName = getDifficultyFromLevel(difficulty?.diffMode?.level)
  if(!category || !difficultyName){
    return false
  }

  const rawScore = Number(score)
  if(Number.isNaN(rawScore)){
    return false
  }
  const numericScore = Math.max(0, rawScore)

  const userRootRef = ref(db, 'users/' + user.uid)
  const scoreRef = ref(db, `users/${user.uid}/data/${category}/${difficultyName}`)

  try{
    await update(userRootRef, {
      userName: user.displayName || 'Player',
      userImg: user.photoURL || ''
    })
  }
  catch(error){
    console.log(error)
  }

  try{
    const transactionResult = await runTransaction(scoreRef, (currentValue) => {
      const existingScore = Number(currentValue) || 0
      return Math.max(existingScore, numericScore)
    })

    if(transactionResult.committed){
      return true
    }
  }
  catch(error){
    console.log(error)
  }

  try{
    await set(scoreRef, numericScore)
    return true
  }
  catch(error){
    console.log(error)
  }

  return false
}
