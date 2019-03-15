//declaring needed html elements
var deck = document.querySelector(".deck");
var restartBttn = document.getElementsByClassName("restart");
var moveCounter = document.querySelector(".moves")
var wonMain = document.querySelector(".won-main");
var starPanel = document.querySelector(".stars");
var timerDisplay = document.querySelector(".timer");

var starsScore = document.querySelector(".stars-score");
var movesScore = document.querySelector(".moves-score");
var timerScore = document.querySelector(".timer-score");

var timerCount = 0;
var timerPtr;
//Holds the whole card deck
var cardDeck = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt",
                "fa-cube", "fa-leaf", "fa-bomb", "fa-bicycle", "fa-diamond",
                "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube",
                "fa-leaf", "fa-bomb", "fa-bicycle"];

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
//initializing the whole game
function initGame() {
  //declaring some variables
  var randDeck = shuffle(cardDeck);
  var openCards = [];
  var moves = 0;
  var matches = 0;
  var incorrectGuess = 0;
  var maxStars = 3;
  //updating the current moves
  moveCounter.textContent = moves;
  timerCount = 0;

  resetStars();
  clearTimeout(timerPtr);
  startTimer();
  //creates the card deck
  for (var i = 0; i < 16; i++) {
    var newCard = document.createElement("li");
    newCard.classList.add("card");
    var cardSkin = document.createElement("i");
    cardSkin.classList.add("fa", randDeck[i]);
    newCard.append(cardSkin);
    deck.append(newCard);

    var cards = document.getElementsByClassName("card");

    //adding an event listener to each card and the Game logic
    for (const card of cards) {
      card.addEventListener("click", function() {
        //true if 2 cards are getting compared
        if(openCards.length < 2) {

          // Checks if the clicked cards are already revealed
          if (!card.classList.contains("show")) {
            if (!card.classList.contains("match")){
              card.classList.add("open", "show");
              //adding clicked card to "openCards"
              openCards.push(card);
            }
          }

          //true if two cards are revealed
          if (openCards.length > 1) {
            moves++;
            moveCounter.textContent = moves;

            //if the cards are the same
            if(openCards[0].children[0].classList.value == openCards[1].children[0].classList.value) {
              for (const openCard of openCards) {
                openCard.classList.value = "card match";
              }
              matches++;
              if (matches == deck.childElementCount/2) {
                wonGame(maxStars, moves);
              }
              openCards = [];
            }

            //if the cards are different
            else {
              for (const openCard of openCards) {
                openCard.classList.value = "card incorrect";
              }
              incorrectGuess++;

              switch (incorrectGuess) {
                case 15:
                  starPanel.children[0].lastChild.classList.value = "fa fa-star-o";
                  maxStars--
                  break;
                case 20:
                  starPanel.children[1].lastChild.classList.value = "fa fa-star-o";
                  maxStars--
                  break;
                default:
                  break;
              }

              //sets a timeout for the reveald cards
              setTimeout(function() {
                for (const openCard of openCards) {
                  openCard.classList.remove("incorrect");
                }
                openCards = [];
              }, 1000);
            }
          }
        }
      });
    }
  }
}

//adding an event listener for every restart button
for (button of restartBttn) {
  button.addEventListener("click", function() {
    if(deck.childElementCount > 0) {
      var childElements = deck.childElementCount;

      for(let i = 0; i < childElements; i++) {
        deck.firstElementChild.remove();
      }
    }
    wonMain.style.display = "none";
    initGame();
  });
}

//sets up the winnig screen
function wonGame(stars, moves) {
  starsScore.textContent = stars;
  movesScore.textContent = moves;
  timerScore.textContent = timerCount;
  wonMain.style.display = "flex";
}

//resets the stars
function resetStars() {
  for (star of starPanel.children) {
    star.lastChild.classList.value = "fa fa-star";
  }
}

//creates the timer
function startTimer() {
  timerDisplay.textContent = timerCount;
  timerCount ++;
  timerPtr = setTimeout(startTimer, 1000);
}

//calling the initGame function to start the Game
initGame();
