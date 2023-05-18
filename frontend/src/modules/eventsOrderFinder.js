

export const eventsCheck = (arr) => {

  let correctList = [];

  for(let x = 0; x < arr.length; x++){
    correctList.push(arr[x].id)
  }

  correctList.sort(function(a, b) {
    return a - b;
  })

  return correctList;
}