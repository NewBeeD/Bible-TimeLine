

export const solution = (order, events) => {

  let eventSolution = [];

  for (let x = 0; x < events.length; x++) {
    
    let index = events.findIndex(object => {return object.id === order[x]})

    eventSolution.push(events[index])    
  }

  return eventSolution
}

