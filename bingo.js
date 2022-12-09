const errorMessage = document.getElementById("error");
const moneyAmount = document.getElementById("moneys");
const cards = document.getElementById("cards");
let numberOfCards = 0;
let numberOfBalls = 0;
let noDuplicateBalls = [];
//Stores a 2 dimensional array for each card
let cardArr = [
	[[],[],[],[],[]],
	[[],[],[],[],[]],
	[[],[],[],[],[]],
	[[],[],[],[],[]],
	];
let ballArr = [];
let flagArr = [];
let money = JSON.parse(localStorage.getItem("money"));


function createCard(cardNumber){
	
	let noDuplicates = [];
	cardNumber.innerHTML +=`<div class="grid-title" style="grid-area: 1/1/span 1/span 1; text-shadow: 5px 5px red;">B</div>`;
	cardNumber.innerHTML +=`<div class="grid-title" style="grid-area: 1/2/span 1/span 1; text-shadow: 5px 5px blue;;">I</div>`;
	cardNumber.innerHTML +=`<div class="grid-title" style="grid-area: 1/3/span 1/span 1; text-shadow: 5px 5px purple;">N</div>`;
	cardNumber.innerHTML +=`<div class="grid-title" style="grid-area: 1/4/span 1/span 1; text-shadow: 5px 5px green;">G</div>`;
	cardNumber.innerHTML +=`<div class="grid-title" style="grid-area: 1/5/span 1/span 1; text-shadow: 5px 5px orange;">O</div>`;
	
	for(let i=2; i<7;i++){
		for(let j=1; j<6;j++){
			if(i == 4 && j == 3){
				cardNumber.innerHTML +=`<div class="free-space" style="grid-area: ${i}/${j}/span 1/span 1;"></div>`;
			}
			else{
				if(fromLocal){
					if(fromLocal[numberOfCards][i-2][j-1] != undefined){
						cardNumber.innerHTML +=`<div class="grid-item" style="grid-area: ${i}/${j}/span 1/span 1;">
										<input type="checkbox" class="visually-hidden">
										<label for="toggle">${cardArr[numberOfCards][i-2][j-1]}</label>
										<div class="control"></div>
										</div>`;
					}else{
					randInt = getRandomInt(15)+1;
					numUsed = randInt + (j-1) * 15;
					while(noDuplicates.includes(numUsed)){
						randInt = getRandomInt(15)+1;
						numUsed = randInt + (j-1) * 15;
					}
					noDuplicates.push(numUsed);
					cardArr[numberOfCards][i-2][j-1] = numUsed
					cardNumber.innerHTML +=`<div class="grid-item" style="grid-area: ${i}/${j}/span 1/span 1;">
										<input type="checkbox" class="visually-hidden">
										<label for="toggle">${numUsed}</label>
										<div class="control"></div>
										</div>`;
				}
				}
				else{
					randInt = getRandomInt(15)+1;
					numUsed = randInt + (j-1) * 15;
					while(noDuplicates.includes(numUsed)){
						randInt = getRandomInt(15)+1;
						numUsed = randInt + (j-1) * 15;
					}
					noDuplicates.push(numUsed);
					cardArr[numberOfCards][i-2][j-1] = numUsed
					cardNumber.innerHTML +=`<div class="grid-item" style="grid-area: ${i}/${j}/span 1/span 1;">
										<input type="checkbox" class="visually-hidden">
										<label for="toggle">${numUsed}</label>
										<div class="control"></div>
										</div>`;
				}
			}
		}
	}

	localStorage.setItem( "card", JSON.stringify(cardArr))
}

function createBall(){
	numberOfBalls++;
	do {
		if(noDuplicateBalls.length == 75){
			return false;
		}
		number = getRandomInt(75) + 1;
	}while(noDuplicateBalls.includes(number));
	noDuplicateBalls.push(number);
	let letter = "A";
	if(number < 16){
		letter = "B";
	}else if(number < 31){
		letter = "I";
	}else if(number < 46){
		letter = "N";
	}else if(number < 61){
		letter = "G";
	}else if(number < 76){
		letter = "O";
	}
	ballUsed = letter + number;
	ballArr.push(number);
	localStorage.setItem( "ball", JSON.stringify(ballArr))
	balls.innerHTML += `<div class="ball-item">${ballUsed}</div>`;
	return true;
}

function renderBalls(){
	if(ballArr){
		let letter = "A";
		let number = 0;
		for(let i = 0; i < ballArr.length; i++){
			number = ballArr[i];
			if(number < 16){
				letter = "B";
			}else if(number < 31){
				letter = "I";
			}else if(number < 46){
				letter = "N";
			}else if(number < 61){
				letter = "G";
			}else if(number < 76){
				letter = "O";
			}
			ballUsed = letter + number;
			numberOfBalls++;
			balls.innerHTML += `<div class="ball-item">${ballUsed}</div>`;
		}
	}
}

function getRandomInt(max){
	return Math.floor(Math.random()* max);
}

function buyCard(){
	if(numberOfCards == 0){
		createCard(grid1);
	}else if (numberOfCards == 1){
		createCard(grid2);
	}else if(numberOfCards == 2){
		createCard(grid3)
	}else if(numberOfCards == 3){
		createCard(grid4)
	}
}

function showCards(){
	if(fromLocal){
		for(let i = 0; i < 4; i++){
			if(fromLocal[i][0][0] > 0){
				buyCard();
				numberOfCards++;
			}
		}
	}
	localStorage.setItem( "money", JSON.stringify(money))
	moneyAmount.innerHTML = `Money Left: ${money}`;
}

function clearAllCards(){
	localStorage.removeItem("card")
	localStorage.removeItem("ball")
	cardArr = [
		[[],[],[],[],[]],
		[[],[],[],[],[]],
		[[],[],[],[],[]],
		[[],[],[],[],[]],
	];
	ballArr=[];
}

function bingoCheck(){
	let ballNumber=0;
	let rowWin = 0;
	let colWin = 0;
	let diag1Win = 1;
	let diag2Win = 1;
	flagArr = [];
	ballNumber = ballArr[ballArr.length - 1];
	for( let cardNumber = 0; cardNumber < numberOfCards; cardNumber++){
		let diag1Win = 1;
		let diag2Win = 1;
		//checks rows
		for( let row = 0; row < 5; row++){
			//check the first element of the each row with the balls
			if(ballArr.includes(cardArr[cardNumber][row][0])){
				rowWin = 0;
				if(row == 2){
					rowWin = 1;
				}
				//check the rest of the values at row
				for(let col = 0; col < 5; col++){
					if(ballArr.includes(cardArr[cardNumber][row][col])){
						console.log("this is rowWin: ");
						console.log(rowWin);
						rowWin++;
					}
				}
				if(rowWin == 5){
					console.log("rowwin at card " + numberOfCards);
					console.log("number of balls ");
					console.log(ballArr.length);
					return true;
				}
			}
		}
		//checks collumns
		for( let col = 0; col < 5; col++){
			//check the first element of the each col with the balls
			if(ballArr.includes(cardArr[cardNumber][0][col])){
				colWin = 0;
				if(col == 2){
					colWin =1;
				}
				//check the rest of the values at col
				for(let row = 0; row < 5; row++){
					if(ballArr.includes(cardArr[cardNumber][row][col])){
						console.log("this is colWin: ");
						console.log(colWin);
						colWin++;
					}
				}
				if(colWin == 5){
					console.log("colwin at card " + numberOfCards);
					console.log("number of balls " + ballArr.length);
					return true;
				}
			}
		}
		//checks across
		for(let row = 0; row<5; row++){
			if(ballArr.includes(cardArr[cardNumber][row][row])){
				console.log("this is diag1Win " + diag1Win)
				diag1Win++;
			}
			if(ballArr.includes(cardArr[cardNumber][row][4-row])){
				diag2Win++;
				console.log("this is diag2Win " + diag2Win)
			}
		}
		if(diag1Win == 5){
			console.log("diag1win at card " + numberOfCards);
			console.log("number of balls " + ballArr.length);
			return true;
		}
		if(diag2Win == 5){
			console.log("diag2win at card " + numberOfCards);
			console.log("number of balls " + ballArr.length);
			return true;
		}
		
	}
}

// clearAllCards();
fromLocal = JSON.parse(localStorage.getItem("card"));
fromLocalBall = JSON.parse(localStorage.getItem("ball"));

if(fromLocal){
	cardArr = fromLocal;
	// numberOfCards = cardArr.size;
}
if(fromLocalBall){
	ballArr = fromLocalBall;
	numberOfBalls = ballArr.size;
}

inputBtn.addEventListener("click", function(){
	document.location.reload();
	if(money < 1000){
		errorMessage.innerHTML = `Not enough money`;

	}
	else if(!fromLocal){
		if(numberOfCards < 2){
			buyCard();
			money -= 1000;
			localStorage.setItem( "money", JSON.stringify(money))
			moneyAmount.innerHTML = `Money Left: ${money}`;
			fromLocal = JSON.parse(localStorage.getItem("card"));
			console.log(fromLocal);
		}else{
			errorMessage.innerHTML = `At card maximum`;
		}
		
	}
	else{
		if(numberOfCards < 2){
			if(fromLocal[numberOfCards][0][0] > 0){
				buyCard();
				localStorage.setItem( "money", JSON.stringify(money))
				moneyAmount.innerHTML = `Money Left: ${money}`;
			}else{
				buyCard();
				money -= 1000;
				localStorage.setItem( "money", JSON.stringify(money))
				moneyAmount.innerHTML = `Money Left: ${money}`;
				console.log(cardArr);
			}
		}
		else{
			errorMessage.innerHTML = `At card maximum`;
		}
	}
});
deleteBtn.addEventListener("click", function(){
	clearAllCards();
	document.location.reload();
	console.log("deleted");
});
checkBtn.addEventListener("click", function(){
	if(money < 1000){
		errorMessage.innerHTML = `Not enough money`;		
	}
	else if (bingoCheck()){
	// Uncomment to test win screen
	// if(true){
		money -= 1000;
		body.innerHTML = "";
		
		body.innerHTML += `<button onclick="window.location='./bingo.html';" id="newBtn"> New Game? </button>`;
		body.innerHTML += `<button onclick="window.location='./p1.html';" id="returnBtn"> Return to landing page </button>`;
		body.innerHTML += `<div id="win-message">You win $50000! </div>`;
		money += 50000;
		moneyAmount.innerHTML = `Money Left: ${money}`;		
		localStorage.setItem( "money", JSON.stringify(money))
		clearAllCards();
		console.log("deleted");
	}else{
		money -= 1000;
		moneyAmount.innerHTML = `Money Left: ${money}`;		
		errorMessage.innerHTML = `No bingo found`;
	}
	
});
ballBtn.addEventListener("click", function(){
	if(money < 150){
		errorMessage.innerHTML = `Not enough money`;
	}
	else{
		if(createBall()){
			money -= 150;
		}
		console.log(money);
		moneyAmount.innerHTML = `Money Left: ${money}`;		
		localStorage.setItem( "money", JSON.stringify(money))
		errorMessage.innerHTML = ``;
	}

})

// document.location.reload();
console.log(cardArr);
renderBalls();
showCards();
if(numberOfCards == 2){
	errorMessage.innerHTML = `At card maximum`;
}
console.log(numberOfCards);
console.log(ballArr.length);
console.log(fromLocal[0][0][0]);
console.log(fromLocal[1][0][0]);
console.log(fromLocal[2][0][0]);
console.log(fromLocal[3][0][0]);
