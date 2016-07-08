consoleRec(['я', 'умею', 'писать', 'рекурсивные', 'функции'], 123);

function consoleRec(){
	if (arguments[0] && arguments[0][0]){
		console.log(arguments[0][0]);
    arguments[0].splice(0,1);
    consoleRec(arguments[0]);
  }
}

