consoleRec(['я', 'умею', 'писать', 'рекурсивные', 'функции'], 0);

function consoleRec(array, num){
	if (array.length > num){
		console.log(array[num]);
    consoleRec(array, num+1);
  }
}
