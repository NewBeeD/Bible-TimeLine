import { createContext, useReducer } from "react";

export const TimeLineContext = createContext()

export const timeLineReducer = (state, action) =>{

  switch(action.type){

    case 'SET_DIFFICULTY':
      return {
        difficulty: action.payload  
      }

    default:
      return state

  }


}

export const TimeLineContextProvider = ({ children }) => {

  const [state, dispatch] = useReducer(timeLineReducer, {
    difficulty: null
  })

  return (
    <TimeLineContext.Provider value={{...state, dispatch}} >
      { children }
    </TimeLineContext.Provider>
  )
}

