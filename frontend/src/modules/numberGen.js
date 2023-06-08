import { timelineData } from "../data/csvjson"

export const numberGen = (value) => {

  const [oldTest, newTest] = [0, 473];
  let list = [];

  let bool = true;

  let events = [];
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

  function arrGen(){

    for(let i = 0; i < 4; i++){

      let randomNum = randomIntFromInterval(start_point, end_point)

      if(!list.includes(randomNum)){list.push(randomNum)}
  
    }
  }



  function eventsAssembler(arr){   

    for(let i = 0; i < arr.length; i++){

      events.push(timelineData[arr[i] - 1])
    }
}
 

  function eventsFinder(){

    arrGen()
    eventsAssembler(list)
  }

  eventsFinder()

  // console.log(events);

  return events;
  
}
