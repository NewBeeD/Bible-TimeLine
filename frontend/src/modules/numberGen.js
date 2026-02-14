import { timelineData } from "../data/csvjson"

export const numberGen = (value, difficultySettings) => {

  let list = [];

  let events = [];
  let start_point = 0;
  let end_point = 0;

  if(value === 1){
    start_point = 0;
    end_point = 469;
  }
  else if( value === 2){
    start_point = 470;
    end_point = 581;
  }
  else{
    start_point = 0;
    end_point = 581;
  }


  function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  function arrGen(){
    const maxAvailable = (end_point - start_point) + 1
    const targetCount = Math.min(difficultySettings, maxAvailable)

    while(list.length < targetCount){

      let randomNum = randomIntFromInterval(start_point, end_point)

      if(!list.includes(randomNum)){list.push(randomNum)}
  
    }
  }



  function eventsAssembler(arr){   

    for(let i = 0; i < arr.length; i++){

      events.push(timelineData[arr[i]])
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
