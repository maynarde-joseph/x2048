import Swal from './node_modules/sweetalert2/src/sweetalert2.js'

const GameBoard = document.getElementById("game-board");
const restartButton = document.getElementById('restartButton');
let allTiles = [];

// Class for tiles
class Tile {
  #tileV
  #value
  #x
  #y

  constructor(tileContainer, value) {
    this.#tileV = document.createElement("div");
    tileContainer.append(this.#tileV);
    this.value = value;
  }

  set value(v) {
    this.#value = v;
    this.#tileV.textContent = v;
    this.#tileV.classList.value = "";
    this.#tileV.classList.add("tile");
    this.#tileV.classList.add(`tile-${v}`);
  }

  set x(value) {
    this.#x = value;
    this.#tileV.style.setProperty("--x", value);
  }

  set y(value) {
    this.#y = value;
    this.#tileV.style.setProperty("--y", value);
  }

  get value() {
    return this.#value;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }
}

// Function to create 4 by 4 grid
function createTiles(gridElement) {
  const tiles = [];
  for (let i = 0; i < 4; i++) {
    tiles.push([]);
    for (let j = 0; j < 4; j++) {
      const tile = new Tile(gridElement, null);
      tile.x = j;
      tile.y = i;
      tiles[i].push(tile);
    }
  }
  return tiles;
}

function resetTiles(allCurrTiles) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      allCurrTiles[i][j].value = null;
    }
  }
}

// Function print all coordinates in console
function viewTiles(board) {
  for (let i = 0; i < 4; i++) {
    let rowString = '';
    for (let j = 0; j < 4; j++) {
      rowString += `(${board[i][j].x}, ${board[i][j].y}) `;
    }
    console.log(rowString);
  }
}

// Function to randomly select an empty tile
function randomEmptyTile() {
  const emptyTiles1 = allTiles[0].filter(tile => tile.value === null);
  const emptyTiles2 = allTiles[1].filter(tile => tile.value === null);
  const emptyTiles3 = allTiles[2].filter(tile => tile.value === null);
  const emptyTiles4 = allTiles[3].filter(tile => tile.value === null);
  const emptyTiles = [...emptyTiles1, ...emptyTiles2, ...emptyTiles3, ...emptyTiles4]
  return emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
}

// Function to start the game
function startGame() {
  allTiles = createTiles(GameBoard);
  randomEmptyTile().value = Math.random() > .5 ? 2 : 4;
  randomEmptyTile().value = Math.random() > .5 ? 2 : 4;
  restartButton.addEventListener('click', function() {NewGamePopUp();});
  document.addEventListener("keydown", handleUserInput);
}

// Function to check if there are any empty spaces
function checkEmpty() {
  if (randomEmptyTile() == undefined) {
    GameOverPopUp()
    return true;
  } else {
    return false;
  }
}

// Function to handle user input
// ArrowUp, ArrowDown, ArrowLeft, ArrowRight to move and r to print coordinates
function handleUserInput(event) {
  sleep(1).then(() => { 
    if (!canMove()) {
      return;
    }
  });
  if (event.key === "ArrowLeft" && canPerformUpAction(allTiles)) {
    allTiles = slideUp(allTiles)
    if (!checkEmpty()) {
      randomEmptyTile().value = Math.random() > .5 ? 2 : 4;
      allPop(allTiles);
      document.removeEventListener("keydown", handleUserInput);
      document.addEventListener("keydown", handleUserInput, { once: true });
    }
  } else if (event.key === "ArrowRight" && canPerformDownAction(allTiles)) {
    allTiles = slideDown(allTiles)
    if (!checkEmpty()) {
      randomEmptyTile().value = Math.random() > .5 ? 2 : 4;
      allPop(allTiles);
      document.removeEventListener("keydown", handleUserInput);
      document.addEventListener("keydown", handleUserInput, { once: true });
    }
  } else if (event.key === "ArrowUp" && canPerformLeftAction(allTiles)) {
    allTiles = slideLeft(allTiles)
    if (!checkEmpty()) {
      randomEmptyTile().value = Math.random() > .5 ? 2 : 4;
      allPop(allTiles);
      document.removeEventListener("keydown", handleUserInput);
      document.addEventListener("keydown", handleUserInput, { once: true });
    }
  } else if (event.key === "ArrowDown" && canPerformRightAction(allTiles)) {
    allTiles = slideRight(allTiles)
    if (!checkEmpty()) {
      randomEmptyTile().value = Math.random() > .5 ? 2 : 4;
      allPop(allTiles);
      document.removeEventListener("keydown", handleUserInput);
      document.addEventListener("keydown", handleUserInput, { once: true });
    }
  } else if (event.key === "r") {
    viewTiles(allTiles)
    document.removeEventListener("keydown", handleUserInput);
    document.addEventListener("keydown", handleUserInput, { once: true });
  } else {
    document.removeEventListener("keydown", handleUserInput);
    document.addEventListener("keydown", handleUserInput, { once: true });
  }
}

// Function to check if can slide up
function canPerformUpAction(board) {
  return canSlideTiles(board);
}

// Function to check if can slide down
function canPerformDownAction(board) {
  board = board.map(row => row.reverse());
  let returnValue = canSlideTiles(board);
  board = board.map(row => row.reverse());
  return returnValue;
}

// Function to check if can slide left
function canPerformLeftAction(board) {
  board = transposeArray(board);
  let returnValue = canSlideTiles(board);
  board = transposeArray(board);
  return returnValue;
}

// Function to check if can sldie right
function canPerformRightAction(board) {
  board = transposeArray(board).map(row => row.reverse());
  // Apply the slideLeft logic (which will now work as slideRight)
  let returnValue = canSlideTiles(board);
  // Reverse each row of the result
  board = transposeArray(board)
  board = transposeArray(board).map(row => row.reverse());
  board = transposeArray(board)
  return returnValue;
}

// Function to interchange rows and columns
function transposeArray(array) {
  return array[0].map((_, colIndex) => array.map(row => row[colIndex]));
}

// Function to slide up
function slideUp(board) {
  board = slideTiles(board);
  return board;
}

// Function to slide left
function slideLeft(board) {
  board = transposeArray(board);
  board = slideTiles(board);
  board = transposeArray(board);
  return board;
}

// Function to slide down
function slideDown(board) {
  board = board.map(row => row.reverse());
  board = slideTiles(board);
  board = board.map(row => row.reverse());
  return board;
}

// Function to slide right
function slideRight(board) {
  board = transposeArray(board).map(row => row.reverse());
  board = slideTiles(board);
  board = transposeArray(board)
  board = transposeArray(board).map(row => row.reverse());
  board = transposeArray(board)
  return board;
}

// Function to seperate array and slide()
function slideTiles(board) {
  const newAllTiles = [];
  for (let r = 0; r < 4; r++) {
    let row = board[r].slice(); // Create a copy of the row
    row = slide(row);
    newAllTiles[r] = row;
  }
  return newAllTiles; // Update allTiles with the new array
}

// Function to slide and merge tiles
function slide(row) {
  // first shift through all null
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i].value === null) {
      for (let j = i + 1; j < row.length; j++) {
        if (row[j].value !== null) {
          // Swap the values of the tiles at positions i and j
          const temp = row[i].value;
          row[i].value = row[j].value;
          row[j].value = temp;
          break; // Exit the inner loop after swapping
        }
      }
    }
  }

  // merge all adjacent tiles
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i].value == row[i+1].value && row[i].value != null) {
      row[i].value = row[i].value * 2
      row[i+1].value = null
    }
  }

  // second shift through all null
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i].value === null) {
      for (let j = i + 1; j < row.length; j++) {
        if (row[j].value !== null) {
          // Swap the values of the tiles at positions i and j
          const temp = row[i].value;
          row[i].value = row[j].value;
          row[j].value = temp;
          break; // Exit the inner loop after swapping
        }
      }
    }
  }

  // make all pop
  return row;
}

function allPop(board) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] !== null) {
        const value = board[i][j].value;
        board[i][j].value = null;
        sleep(0.1).then(() => { board[i][j].value = value; });
      }
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function that seperate array and checks if can canSlide()
function canSlideTiles(board) {
  let canMove = false;
  for (let r = 0; r < 4; r++) {
    let row = board[r].slice(); // Create a copy of the row
    if (canSlide(row)) {
      canMove = true;
    }
  }
  return canMove; // Update allTiles with the new array
}

// Function to check if slide or merge is possible
function canSlide(row) {
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i].value === null && row[i+1].value !== null) {
      console.log("HAS 0")
      return true;
    }
  }
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i].value == row[i+1].value && row[i].value != null) {
      console.log("MERGEABLE")
      return true;
    }
  }
  console.log("NONE")
  return false;
}

// Function that checks if can move in any direction
function canMove() {
  if (!canPerformDownAction(allTiles) && !canPerformUpAction(allTiles) && !canPerformLeftAction(allTiles) && !canPerformRightAction(allTiles)) {
    GameOverPopUp()
    return false;
  } else {
    return true;
  }
}

// Function to create a popup
function GameOverPopUp() {
  Swal.fire({
    title: 'Game Over',
    confirmButtonColor: '#8f7a66',
    confirmButtonText: 'Restart',
    heightAuto: false,
  }).then((result) => {
    if (result.isConfirmed) {
      resetGame();
    }
  });
}

function NewGamePopUp() {
  Swal.fire({
    title: 'New Game?',
    showCancelButton: true,
    confirmButtonColor: '#8f7a66',
    cancelButtonColor: '#e5cda1',
    confirmButtonText: 'Restart',
    heightAuto: false,
  }).then((result) => {
    if (result.isConfirmed) {
      resetGame();
    }
  });
}

// Function to reset the game 
function resetGame() {
  resetTiles(allTiles);
  randomEmptyTile().value = Math.random() > .5 ? 2 : 4;
  randomEmptyTile().value = Math.random() > .5 ? 2 : 4;
  document.removeEventListener("keydown", handleUserInput);
  document.addEventListener("keydown", handleUserInput, { once: true });
}

// Start the game
startGame();