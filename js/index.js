"strict-mode";
// GAME LOGIC
/*
1) Create The UI ✔✔
2) Display The Cards ✔✔
3) Make It Flab When Clicks ✔✔
4) Disable Events While Transition ✔✔
5) Disable Clicks After Flapped ✔✔
6) Flap Again After 3 Seconds If No Others Choosen ✔✔
7) Clear Timer If Another Cards Flapped ✔✔
8) Check For A Match After Flap Another Card ✔✔
9) If 
  9-A) No Match
    9-A.1) Flap The Two Cards ✔✔
    9-A.2) Decrease The Tries By One ❌❌
    9-A.3) Check If Tries Reaches 0 ❌❌
      9-A.3.a) Yes! You Lose Try Again ❌❌
  9-B) Match
    9-B.1) Keep The Two Cards Flapped ✔✔
    9-B.2) Increase The Matches By One ✔✔
    9-B.3) Check If Matches Equals Acual Matches
      9-B-3.a) Yes Congratulations Winning The Game

10) Create A Button For Restart The Game With The Report Message
*/

const images = [
  "./assets/images/angular.svg",
  "./assets/images/aurelia.svg",
  "./assets/images/backbone.svg",
  "./assets/images/ember.svg",
  "./assets/images/react.svg",
  "./assets/images/vue.svg",
];

// Elements
const gameBox = document.querySelector("[data-name=box]");
const timerEl = document.querySelector("[data-timer]");
const triesEl = document.querySelector("[data-tries]");
const popup = document.querySelector("[data-popup]");
const endGameTitle = document.querySelector("[data-gameOver]");
const playAgainBtn = document.querySelector("[data-playAgain]");

// Global Variables
let firstCard, secondCard, timerId;
let countTimeOnCardsNum = (images.length / 1.5) * 10;
let isRunning = true;
let actions = {
  matches: 0,
  tries: 10,
};

timerEl.textContent = calcMinAndSec(countTimeOnCardsNum);
triesEl.textContent = `${actions.tries} tries left`;

// MAIN FUNCTIONS
function addImagesToUI() {
  const cards = createElements(images);

  gameBox.innerHTML = cards;
}

function handleImgClick(element) {
  if (firstCard && secondCard) return;
  element.classList.add("flib");
  handleSelection(element);
}

const gameTime = setInterval(() => {
  countTimeOnCardsNum--;

  if (countTimeOnCardsNum === 0) {
    isRunning = false;
    handleEndGame();
  }

  timerEl.textContent = calcMinAndSec(countTimeOnCardsNum);
}, 1000);

playAgainBtn.addEventListener("click", () => location.assign("/"));

// HELPER FUNCTIONS
function handleSelection(clickedElement) {
  if (!firstCard && !secondCard) {
    firstCard = clickedElement;
    timer();
    return;
  }

  if (firstCard !== undefined && !secondCard) {
    clearTimeout(timerId);
    secondCard = clickedElement;

    checkMatch();
  }
}

// The quick brown fox jumps over the lazy dog.

function timer() {
  timerId = setTimeout(() => {
    firstCard.classList.remove("flib");
    firstCard = undefined;
  }, 3000);

  return timerId;
}

function checkMatch() {
  if (firstCard.dataset.framework === secondCard.dataset.framework) {
    actions.matches++;
    if (actions.matches === 6) {
      handleEndGame();
    }
    firstCard.style.visibility = "hidden";
    secondCard.style.visibility = "hidden";
    [firstCard, secondCard] = [undefined, undefined];
    return;
  }

  // Not A Match
  setTimeout(() => {
    firstCard.classList.remove("flib");
    secondCard.classList.remove("flib");
    actions.tries--;
    if (actions.tries === 0) {
      handleEndGame();
    }
    triesEl.textContent = `${actions.tries} tries left`;

    [firstCard, secondCard] = [undefined, undefined];
  }, 1200);
}

function createRandom() {
  return Math.floor(Math.random() * 12);
}

function createElements(images) {
  let cards = "";
  let isFirsLoop = true;

  for (let i = 0; i < 6; i++) {
    const dataFramework = images[i].match(/\/([a-z]+)\./)[1];
    const card = `
    <div style='order: ${createRandom()};' onclick='handleImgClick(this)' class='card' data-framework=${dataFramework}>
      <img class='img front-face' src=${images[i]} alt='framework' />
      <img class='img back-face' src='./assets/images/js-badge.svg' alt='js-badge' />
    </div>
  `;
    cards += card;

    // This Makes Loop Creates Two Elements For Each Image In The Array
    // Without Duplicating The Array Or Duplicating The Loop
    if (i === 5 && isFirsLoop) {
      i = -1;
      isFirsLoop = false;
    }
  }

  return cards;
}

function calcMinAndSec(timeRemaining) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return `${minutes > 9 ? minutes : "0" + minutes}:${
    seconds > 9 ? seconds : "0" + seconds
  }`;
}

function handleEndGame() {
  popup.classList.add("show");
  clearInterval(gameTime);

  if (!isRunning) {
    endGameTitle.textContent = "Time Over 😓";
  } else if (actions.tries === 0) {
    endGameTitle.textContent = "End Of Tries 😓";
  } else if (actions.matches === 6) {
    endGameTitle.textContent = "You Won 🎉";
    playAgainBtn.textContent = "Play Again";
  }

  return;
}

addImagesToUI();
