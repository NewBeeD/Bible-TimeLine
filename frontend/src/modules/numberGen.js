import { timelineData } from "../data/csvjson"

export const numberGen = () => {

  const [oldTest, newTest] = [0, 473];

  const events = [];



  function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  for(let i = 0; i < 4; i++){

    let value = randomIntFromInterval(0, 582)

    events.push(timelineData[value - 1])
  }

  return events;
  
}
