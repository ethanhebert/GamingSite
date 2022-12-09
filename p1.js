//constants
const DEFAULT_MONEY_VALUE = 100000
const caseBtn = document.querySelector("#case");
const userMoneyEl = document.querySelector("#user-money");
const TOTAL_NUMBER_CASES = 24
const MONEY_VALUES = ["$1", "$5", "$10", "$25", "$50", "$75", "$100", "$200", "$300", "$400", "$500", "$750", 
"$1,000", "$5,000", "$10,000", "$25,000", "$50,000", "$100,000", "$200,000", "$300,000", "$400,000", "$500,000", "$750,000", "$1,000,000"]

//holds the value from local storage "money" as an integer
let userMoney = DEFAULT_MONEY_VALUE

//see if there's a money var in local storage and retrieve its value
let fromLocal = JSON.parse(localStorage.getItem("money"))
if (fromLocal)
    userMoney = fromLocal

//send userMoney to the local storage
localStorage.setItem("money", JSON.stringify(userMoney))

//render the money to the screen
renderMoney()

//render the current amount of money to the screen
function renderMoney() {
    userMoneyEl.innerHTML = `<h2>Money in wallet: ${intToMoney(userMoney)}</h2>`
}

//user clicks button to refill their money
function resetMoney() {
    userMoney = DEFAULT_MONEY_VALUE
    localStorage.setItem("money", JSON.stringify(userMoney))
    renderMoney()
}


//controls the case button on hover/no hover
caseBtn.addEventListener("mouseover", function() {
  this.textContent = MONEY_VALUES[Math.floor(Math.random() * TOTAL_NUMBER_CASES)];
})
caseBtn.addEventListener("mouseout", function() {
  this.textContent = 1 + Math.floor(Math.random() * TOTAL_NUMBER_CASES);
})

//convert pure integer into a money value with $ and ,
function intToMoney(int) {
    //reversed array of offer to then add commas and $ to look like money
    let value = int.toString().split("").reverse()
    
    let valueArr = []
    let valueArrIndex = 0
    let beforeComma = 0
    for (let i=0; i<value.length; i++) {
        valueArr[valueArrIndex] = value[i]
        beforeComma++
        valueArrIndex++
        if (beforeComma == 3 && i != value.length-1) {
            valueArr[valueArrIndex] = ","
            valueArrIndex++
            beforeComma = 0
        }
        if (i == value.length-1) {
            valueArr[valueArrIndex] = "$"
        }
    }

    return valueArr.reverse().join('')
}

//convert money value with $ and , to a pure integer
function moneyToInt(money) {
    return parseInt(money.replaceAll('$','').replaceAll(',',''))
}