// Class for cases that holds its properties
class caseClass {
    constructor(number, status, moneyObj) {
        this.number = number
        this.status = status
        this.moneyObj = moneyObj
    }
}

// Class for money values that holds its properties
class moneyClass {
    constructor(displayValue, status) {
        this.displayValue = displayValue
        this.value = moneyToInt(displayValue);
        this.status = status
    }
}

// Variable to hold local storage "money"
let userMoney = JSON.parse(localStorage.getItem("money"))

// Global Variables
let money = []
let cases = []
let selectedCases = []
let numberCasesToSelect = 1
let numberCasesSelected = 0
let numberCasesOpened = 0
let round = 0
let bankerStage = 0
let allowEnter = false
let userCase = null
let whichFlash = true
let offer = 0

// Constants
const TOTAL_NUMBER_CASES = 24
const COST_TO_PLAY = 100000
const MONEY_VALUES = ["$1", "$5", "$10", "$25", "$50", "$75", "$100", "$200", "$300", "$400", "$500", "$750", 
"$1,000", "$5,000", "$10,000", "$25,000", "$50,000", "$100,000", "$200,000", "$300,000", "$400,000", "$500,000", "$750,000", "$1,000,000"]
const casesGrid = document.querySelector("#nonselected-cases")
const selectedCasesGrid = document.querySelector("#selected-cases")
const moneyGrid = document.querySelector("#money-container")
const instructionsEl = document.querySelector("#instructions")
const header = document.querySelector("#header")
const userCaseEl = document.querySelector("#user-case")

//initial page setup
goldBackground()

// Display all cases where they should go
function loadCases() {
    // Reset/clear the current contents of the cases grids
    casesGrid.innerHTML = ""
    selectedCasesGrid.innerHTML = ""

    //display the cases in the grid
    for (let i=0; i<TOTAL_NUMBER_CASES; i++) {
        //case is in the main grid
        if (cases[i].status == "grid") {
            casesGrid.innerHTML += `
                <div class="case case-active" onclick="selectCase(${cases[i].number})" style="grid-area: ${parseInt(i/6)+1}/${(i%6)+1}/span 1/span 1;">${cases[i].number}</div>
            `
        }

        //last case is opened in the grid
        else if (cases[i].status == "last-opened") {
            casesGrid.innerHTML += `
                <div class="case case-opened" style="grid-area: ${parseInt(i/6)+1}/${(i%6)+1}/span 1/span 1;">${cases[i].moneyObj.displayValue}</div>
            `
        }
        //case not in the main grid, show a blank case slot
        else {
            casesGrid.innerHTML += `
                <div class="case case-slot" style="grid-area: ${parseInt(i/6)+1}/${(i%6)+1}/span 1/span 1;"></div>
            `
        }
    }

    if (round != 0) {
        // display selected cases in order of selection in selection row
        for (let i=0; i<numberCasesToSelect; i++) {
            try {
                // user can click on the case to open it at end of round
                if (selectedCases[i].status == "openable") {
                    selectedCasesGrid.innerHTML += `
                        <div class="case case-active" onclick="openCase(${i})" style="grid-area: 1/${i+1}/span 1/span 1;">${selectedCases[i].number}</div>
                    `
                }

                //case has been opened, display its "inside" contents
                else if (selectedCases[i].status == "opened") {
                    selectedCasesGrid.innerHTML += `
                        <div class="case case-opened" style="grid-area: 1/${i+1}/span 1/span 1;">${selectedCases[i].moneyObj.displayValue}</div>
                    `
                }

                // case is not in a state to be opened, just display it as normal
                else {
                    selectedCasesGrid.innerHTML += `
                        <div class="case case-active" style="grid-area: 1/${i+1}/span 1/span 1;">${selectedCases[i].number}</div>
                    `
                }
            } catch (e) {
                selectedCasesGrid.innerHTML += `
                    <div class="case case-slot" style="grid-area: 1/${i+1}/span 1/span 1;"></div>
                `
            }
        }
    }

    // if less than 6 cases to select, shift all case slots to left by adding invisible slots
    let invisibleSlots = 6 - numberCasesToSelect
    for (let i=0; i<invisibleSlots; i++) {
        selectedCasesGrid.innerHTML += `
                <div class="case case-slot-invisible" style="grid-area: 1/${numberCasesToSelect+i+1}/span 1/span 1;"></div>
            `
    }
}

// Display all money board values in order
function loadMoney() {
    // Reset/clear the current contents of the money grid
    moneyGrid.innerHTML = ""

    //load the money to be displayed in the grid array
    for (let i=0; i<TOTAL_NUMBER_CASES; i++) {
        //money still active, light it up on display
        if (money[i].status == true) {
            moneyGrid.innerHTML += `
                <div class="money money-active" style="grid-area: ${(i%12)+1}/${parseInt(i/12)+1}/span 1/span 1;">${money[i].displayValue}</div>
            `
        }
        //money already selected/inactive, darken on display
        else {
            moneyGrid.innerHTML += `
                <div class="money money-inactive" style="grid-area: ${(i%12)+1}/${parseInt(i/12)+1}/span 1/span 1;">${money[i].displayValue}</div>
            `
        }
    }
}

//user clicks on this case in the grid, move it to the selected cases row
//only if cases still need to be selected for the round
function selectCase(caseNumber) {
    if (numberCasesSelected < numberCasesToSelect) {
        if (round == 0) {
            userCase = cases[caseNumber-1]
            userCase.status = "selected"
            numberCasesSelected++
            selectUserCase()
        }
        else {
            thisCase = cases[caseNumber-1]
            thisCase.status = "selected"
            selectedCases[numberCasesSelected] = thisCase
            numberCasesSelected++
            loadCases()
            gameplay()
        }
    }
}

//user selecting their case for the game
function selectUserCase() {
    if (numberCasesSelected < numberCasesToSelect) {
        //direct user to choose their case
        instructionsEl.innerHTML = `<h1 class="head1">Select your case.</h1>`
    }

    else {
        //insert the user case into its slot
        userCaseEl.innerHTML = `<div class="case case-active" style="grid-area: 1/1/span 1/span 1;">${userCase.number}</div>`
                
        //now go to normal gameplay
        numberCasesSelected = 0
        numberCasesToSelect = 6
        round = 1
        loadCases()
        gameplay()
    }
}

// opens a case to reveal the money value
function openCase(selectedCasesIndex) {
    thisCase = selectedCases[selectedCasesIndex]
    thisCase.status = "opened"
    numberCasesOpened++
    thisCase.moneyObj.status = false
    loadCases()
    loadMoney()
    gameplay()
}

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

// takes in a round and returns the number of cases selected in that round
function roundData(round) {
    if (round == 1) {
        return 6
    }
    else if (round == 2) {
        return 5
    }
    else if (round == 3) {
        return 4
    }
    else if (round == 4) {
        return 3
    }
    else if (round == 5) {
        return 2
    }
    else if (round == 6) {
        return 1
    }
    else if (round == 7) {
        return 1
    }
    else {
        return 0
    }
}

//contains the displayed instructions and flow of the game
function gameplay() {
    //user must choose cases
    if (numberCasesSelected < numberCasesToSelect) {
        //direct user to choose cases for the round
        if (numberCasesToSelect == 1)
            instructionsEl.innerHTML = `<h1 class="head1">Select ${numberCasesToSelect} case.</h1>`
        else
            instructionsEl.innerHTML = `<h1 class="head1">Select ${numberCasesToSelect} cases.</h1>`
    }

    //user has chosen all the cases for the round, allow for opening them
    else if (numberCasesSelected == numberCasesToSelect) {
        //user has not opened any cases yet
        if (numberCasesOpened == 0) {
            if (numberCasesToSelect == 1)
                instructionsEl.innerHTML = `<h1 class="head1">Open the case.</h1>`
            else
                instructionsEl.innerHTML = `<h1 class="head1">Open the cases.</h1>`
            for (let i=0; i<numberCasesToSelect; i++) {
                selectedCases[i].status = "openable"
            }
            loadCases()
        }
        //user is in the process of opening cases
        else if (numberCasesOpened < numberCasesToSelect) {
            instructionsEl.innerHTML = `<h1 class="head1">Open the cases.</h1>`
        }
        //user has finished opening cases for the round, reset values for next round and prepare for going to banker offer
        else if (numberCasesOpened == numberCasesToSelect) {
            instructionsEl.innerHTML = `<h1 class="head1">Let's hear from the banker...</h1>`
            allowEnter = true
            /*
            numberCasesToSelect = roundData(++round)
            numberCasesOpened = 0
            numberCasesSelected = 0
            */
        }
    }
}

function getBankerOffer() {
    //banker offer is an average of remaining values * (thisround/totalrounds)
    //basically it scales to where you get truer offers the later in the game you go to encourage player to continue
    let sum = 0
    let remainingValues = 0
    for (let i=0; i<TOTAL_NUMBER_CASES; i++) {
        if (money[i].status == true) {
            sum += parseInt(money[i].value)
            remainingValues++
        }
    }

    offer = (parseInt((sum/remainingValues)*(round/7)))
    return intToMoney(offer)
}

//call the banker and get an offer and user chooses deal or no deal
function banker() {
    //The banker is calling...
    if (bankerStage == 0) {
        instructionsEl.innerHTML = `<h1 class="head1-white">The banker is calling...</h1>`
        redBackground()
    }
    //His offer is...
    else if (bankerStage == 1) {
        instructionsEl.innerHTML = `<h1 class="head1-white">His offer is...</h1>`
    }
    //Display the offer. Deal or no deal buttons.
    else if (bankerStage == 2) {
        instructionsEl.innerHTML = `
            <button id="deal-btn" onclick="deal()">DEAL</button>
            <h1 class="head1-white">${getBankerOffer()}</h1>
            <button id="no-deal-btn" onclick="nodeal()">NO DEAL</button>
        `
        allowEnter = false
    }
    bankerStage = (bankerStage + 1) % 3
}

//user selects deal - end game
function deal() {
    //show the user's opened case
    userCaseEl.innerHTML = `<div class="case case-opened" style="grid-area: 1/1/span 1/span 1;">${userCase.moneyObj.displayValue}</div>`

    //open all cases in the grid
    for (let i=0; i<TOTAL_NUMBER_CASES; i++) {
        if (cases[i].status == "grid")
            cases[i].status = "last-opened"
    }
    loadCases()

    //construct final message based on if they won the better or worse case
    let finalMessage = `You won ${intToMoney(offer)}! `
    if (offer > userCase.moneyObj.value)
        finalMessage += "Nice! You made more than your case! Wanna play again?"
    else
        finalMessage += "But you probably should've waited to open your case... wanna play again?"
    
    //display the final message
    instructionsEl.innerHTML = `<h1 class="final-message">${finalMessage}</h1>`

    //update wallet and reset vars
    updateWallet(offer)
    redBackground()
}

//user selects no deal - continue game
function nodeal() {
    round++
    numberCasesToSelect = roundData(round)
    numberCasesSelected = 0
    numberCasesOpened = 0
    selectedCases = []
    loadCases()

    if (round == 8) {
        endgame()
        allowEnter = true
    }
    else {
        goldBackground()
        gameplay()
    }
}

//user has made it all the way to the end of having just 2 cases - selects to keep or switch their case
function endgame() {
    if (bankerStage == 0) {
        instructionsEl.innerHTML = `<h1 class="head1-white">There are 2 cases remaining...</h1>`
    }
    else if (bankerStage == 1) {
        instructionsEl.innerHTML = `<h1 class="head1-white">You can keep/swap your case...</h1>`
    }
    else if (bankerStage == 2) {
        instructionsEl.innerHTML = `
            <button id="deal-btn" onclick="openFinalCases()">KEEP</button>
            <h1 class="head1-white">Choose wisely.</h1>
            <button id="deal-btn" onclick="swap()">SWAP</button>
        `
        allowEnter = false
    }

    bankerStage = (bankerStage + 1) % 3
}

//user decides to swap their selected case
function swap() {
    //find the last case in the grid
    for (let i=0; i<TOTAL_NUMBER_CASES; i++) {
        if (cases[i].status == "grid") {
            var lastCase = cases[i]
            break
        }
    }

    //swap the cases
    lastCase.status = "notingrid"
    userCase.status = "grid"
    userCase = lastCase
    userCaseEl.innerHTML = `<div class="case case-active" style="grid-area: 1/1/span 1/span 1;">${userCase.number}</div>`
    loadCases()

    //go to end of game where you open last 2 cases
    openFinalCases()
}

//after the keep/swap at end of game, open the final 2 cases
function openFinalCases() {
    allowEnter = true
    round = 9

    if (bankerStage == 0) {
        instructionsEl.innerHTML = `<h1 class="head1-white">Let's see what you won...</h1>`
    }

    else if (bankerStage == 1) {
        //show the user's opened case
        userCaseEl.innerHTML = `<div class="case case-opened" style="grid-area: 1/1/span 1/span 1;">${userCase.moneyObj.displayValue}</div>`

        //open the case in the grid
        for (let i=0; i<TOTAL_NUMBER_CASES; i++) {
            if (cases[i].status == "grid") {
                var lastCase = cases[i]
                break
            }
        }
        
        lastCase.status = "last-opened"
        loadCases()

        //construct final message based on if they won the better or worse case
        let finalMessage = `You won ${userCase.moneyObj.displayValue}! `
        if (userCase.moneyObj.value > lastCase.moneyObj.value)
            finalMessage += "Phew! You picked the right case! Wanna play again?"
        else 
            finalMessage += "Oof... that wasn't the best choice. Maybe play again?"
        
        //display the final message
        instructionsEl.innerHTML = `<h1 class="final-message">${finalMessage}</h1>`

        //update wallet and reset vars
        updateWallet(parseInt(userCase.moneyObj.value))
        redBackground()
        allowEnter = false
    }

    bankerStage = (bankerStage + 1) % 2
}

//resets the backgorund to the default gold
function goldBackground() {
    header.innerHTML = `<h1 class="title-small">Money in wallet: ${intToMoney(userMoney)}</h1>
        <button class="btn" onclick="goBack()">GO BACK</button>
        <h1 class="title">Deal or No Deal</h1>
        <button class="btn" onclick="newGame()">NEW GAME</button>
        <h1 class="title-small" id="cost-to-play">Cost to play: ${intToMoney(COST_TO_PLAY)}</h1>`
    document.body.style.background = 'linear-gradient(to right, rgb(255, 254, 191) 0%, rgb(255, 224, 120) 25%, rgb(255, 254, 191) 50%, rgb(255, 224, 120) 75%, rgb(255, 254, 191) 100%)'
    document.body.style.animation = 'none'
}

//set the background to flashing red for banker and endgame
function redBackground() {
    header.innerHTML = `<h1 class="title-small-white">Money in wallet: ${intToMoney(userMoney)}</h1>
        <button class="btn-white" onclick="goBack()">GO BACK</button>
        <h1 class="title-white">Deal or No Deal</h1>
        <button class="btn-white" onclick="newGame()">NEW GAME</button>
        <h1 class="title-small-white" id="cost-to-play">Cost to play: ${intToMoney(COST_TO_PLAY)}</h1>`
    document.body.style.background = 'rgba(0,0,0,0)'
    document.body.style.animation = 'banker-alert 3s ease-in-out 0s infinite normal'
}

//if new game is selected with not enough money, flash the cost to play text
function flashError() {
    let costToPlayEl = document.getElementById("cost-to-play")
        //have to switch btwn 2 of the exact same animation to get past weird CSS limitation
        if (whichFlash) {
            costToPlayEl.style["animation"] = 'flash 0.25s linear 0s 3 normal'
            whichFlash = false
        }
        else {
            costToPlayEl.style["animation"] = 'flash2 0.25s linear 0s 3 normal'
            whichFlash = true
        }
}

//button clicked to go back to landing page
function goBack() {
    window.open("./p1.html", "_top");
}

//update the user's wallet and display this on the screen
function updateWallet(update) {
    userMoney += update
    localStorage.setItem("money", JSON.stringify(userMoney))
}

//button clicked to start a new game
function newGame() {
    //user has enough money to start the game - take this out of their wallet
    if (userMoney >= COST_TO_PLAY) {
        //take money out of wallet
        updateWallet(-COST_TO_PLAY)

        // Reset all vars
        cases = []
        money = []
        selectedCases = []
        numberCasesToSelect = 1
        numberCasesSelected = 0
        numberCasesOpened = 0
        round = 0
        bankerStage = 0
        allowEnter = false
        userCase = null
        whichFlash = true
        offer = 0
        goldBackground()
        userCaseEl.innerHTML = `<div class="case case-slot" style="grid-area: 1/1/span 1/span 1;"></div>`

        //make an array of indices for the money array then shuffle it thrice using Math.random and sort()
        //that way whenever we iteratively add money objects to the cases, they are randomly dispersed
        let moneyIndices = []
        for (let i=0; i<TOTAL_NUMBER_CASES; i++) {
            moneyIndices[i] = i
        }
        let shuffledMoneyIndices = moneyIndices.sort(() => Math.random() - 0.5).sort(() => Math.random() - 0.5).sort(() => Math.random() - 0.5)

        //fill the money grid array with all unique money values
        for (let i=0; i<TOTAL_NUMBER_CASES; i++) {
            money[i] = new moneyClass(MONEY_VALUES[i], true)
        }

        //fill the cases grid array with case values 1 to 24
        for (let i=0; i<TOTAL_NUMBER_CASES; i++) {
            cases[i] = new caseClass(i+1, "grid", money[shuffledMoneyIndices[i]])
        }

        //load the cases and money grids to the screen
        loadCases()
        loadMoney()

        // start the flow of the game
        selectUserCase()
    }

    //user doesn't have enough money to start the game... don't let them start!
    else {
        flashError()
    }
}

//checks for Enter key being pressed
document.addEventListener("keydown", function(event) {
    //event.key == 'Enter' &&
    if (allowEnter) {
        if (round == 8) {
            endgame()
        }
        else if (round == 9) {
            openFinalCases()
        }
        else {
            banker()
        }
    }
})