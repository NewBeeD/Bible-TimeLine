import { timelineData } from "../data/csvjson"

export const numberGen = (value) => {

  const [oldTest, newTest] = [0, 473];

  const events = [];
  let start_point = 0;
  let end_point = 0;

  if(value === 1){
    start_point = 0;
    end_point = 472;
  }
  else if( value === 2){
    start_point = 471;
    end_point = 582;
  }
  else{
    start_point = 0;
    end_point = 582;
  }


  function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  for(let i = 0; i < 4; i++){

    let value = randomIntFromInterval(start_point, end_point)

    events.push(timelineData[value - 1])
  }

  return events;
  
}
