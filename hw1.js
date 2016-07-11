let num = 0;
function consoleRec(array){
        if (array.length > num){
                console.log(array[num]);
    num += 1;
    consoleRec(array);
  }
}

module.exports = consoleRec;
