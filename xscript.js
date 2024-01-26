import Swal from './node_modules/sweetalert2/src/sweetalert2.js'

const GameBoard = document.getElementById("game-board");
var columns = 4;
let allTiles = [];

class Tile {
  #tileElement
  #value
  #x
  #y

  constructor(tileContainer, value) {
    this.#tileElement = document.createElement("div");
    tileContainer.append(this.#tileElement);
    this.value = value;
  }

  set value(v) {
    this.#value = v;
    this.#tileElement.textContent = v;
    this.#tileElement.classList.value = "";
    this.#tileElement.classList.add("tile");
    this.#tileElement.classList.add(`x${v}`);
  }

  set x(value) {
    this.#x = value;
    this.#tileElement.style.setProperty("--x", value);
  }

  set y(value) {
    this.#y = value;
    this.#tileElement.style.setProperty("--y", value);
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

function createTiles(gridElement) {
  const tiles = [];
  for (let i = 0; i < 4; i++) {
    tiles.push([]);
    for (let j = 0; j < 4; j++) {
      const tile = new Tile(gridElement, null);
      tile.x = i;
      tile.y = j;
      tiles[i].push(tile);
    }
  }
  return tiles;
}

function viewTiles() {
  for (let i = 0; i < 4; i++) {
    let rowString = '';
    for (let j = 0; j < 4; j++) {
      rowString += `(${allTiles[i][j].x}, ${allTiles[i][j].y}) `;
    }
    console.log(rowString);
  }
}

function randomEmptyTile() {
  const emptyTiles1 = allTiles[0].filter(tile => tile.value === null);
  const emptyTiles2 = allTiles[1].filter(tile => tile.value === null);
  const emptyTiles3 = allTiles[2].filter(tile => tile.value === null);
  const emptyTiles4 = allTiles[3].filter(tile => tile.value === null);
  const emptyTiles = [...emptyTiles1, ...emptyTiles2, ...emptyTiles3, ...emptyTiles4]
  return emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
}

function startGame() {
  allTiles = createTiles(GameBoard);
  randomEmptyTile().value = Math.random() > .5 ? 2 : 4;
  randomEmptyTile().value = Math.random() > .5 ? 2 : 4;
  document.addEventListener("keydown", handleUserInput);
}

function checkEmpty() {
  if (randomEmptyTile() == undefined) {
    Swal.fire({
      title: 'Game Over',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Restart',
    }).then((result) => {
      if (result.isConfirmed) {
        resetGame();
      }
    });
    return true;
  } else {
    return false;
  }
}

function handleUserInput(event) {
  if (event.key === "ArrowUp" && canPerformUpAction()) {
    allTiles = slideUp(allTiles)
    if (!checkEmpty()) {
      document.removeEventListener("keydown", handleUserInput);
      document.addEventListener("keydown", handleUserInput, { once: true });
      randomEmptyTile().value = Math.random() > .5 ? 2 : 4;
      if (!canMove()) {
        checkEmpty();
      }
    }
  } else if (event.key === "ArrowDown" && canPerformDownAction()) {
    allTiles = slideDown(allTiles)
    if (!checkEmpty()) {
      document.removeEventListener("keydown", handleUserInput);
      document.addEventListener("keydown", handleUserInput, { once: true });
      randomEmptyTile().value = Math.random() > .5 ? 2 : 4;
      if (!canMove()) {
        checkEmpty();
      }
    }
  } else if (event.key === "ArrowLeft" && canPerformLeftAction()) {
    allTiles = slideLeft(allTiles)
    if (!checkEmpty()) {
      document.removeEventListener("keydown", handleUserInput);
      document.addEventListener("keydown", handleUserInput, { once: true });
      randomEmptyTile().value = Math.random() > .5 ? 2 : 4;
      if (!canMove()) {
        checkEmpty();
      }
    }
  } else if (event.key === "ArrowRight" && canPerformRightAction()) {
    allTiles = slideRight(allTiles)
    if (!checkEmpty()) {
      document.removeEventListener("keydown", handleUserInput);
      document.addEventListener("keydown", handleUserInput, { once: true });
      randomEmptyTile().value = Math.random() > .5 ? 2 : 4;
      if (!canMove()) {
        checkEmpty();
      }
    }
  } else if (event.key === "r") {
    viewTiles()
    document.removeEventListener("keydown", handleUserInput);
    document.addEventListener("keydown", handleUserInput, { once: true });
  } else {
    document.removeEventListener("keydown", handleUserInput);
    document.addEventListener("keydown", handleUserInput, { once: true });
  }
}

function canPerformUpAction() {
  let tempBoard = allTiles
  let tempBoardV2 = slideUp(tempBoard)
  if (tempBoard == tempBoardV2) {
    return false
  } else {
    return true;
  }
}

function canPerformDownAction() {
  let tempBoard = allTiles
  let tempBoardV2 = slideDown(tempBoard)
  if (tempBoard == tempBoardV2) {
    return false
  } else {
    return true;
  }
}

function canPerformLeftAction() {
  let tempBoard = allTiles
  let tempBoardV2 = slideLeft(tempBoard)
  if (tempBoard == tempBoardV2) {
    return false
  } else {
    return true;
  }
}

function canPerformRightAction() {
  let tempBoard = allTiles
  let tempBoardV2 = slideRight(tempBoard)
  if (tempBoard == tempBoardV2) {
    return false
  } else {
    return true;
  }
}

function transposeArray(array) {
  return array[0].map((_, colIndex) => array.map(row => row[colIndex]));
}

function slideUp(board) {
  board = slideTiles(board);
  return board;
}

function slideLeft(board) {
  // Transpose the board to make slideUp act as slideLeft
  board = transposeArray(board);

  // Apply the slideUp logic (which will now work as slideLeft)
  board = slideTiles(board);

  // Transpose the result back to its original form
  board = transposeArray(board);
  return board;
}

function slideDown(board) {
  // Reverse each row of the board
  board = board.map(row => row.reverse());

  // Apply the slideUp logic (which will now work as slideDown)
  board = slideTiles(board);

  // Reverse each row of the result
  board = board.map(row => row.reverse());
  return board;
}

function slideRight(board) {
  // Reverse each row of the board
  board = transposeArray(board).map(row => row.reverse());

  // Apply the slideLeft logic (which will now work as slideRight)
  board = slideTiles(board);

  // Reverse each row of the result
  board = transposeArray(board)
  board = transposeArray(board).map(row => row.reverse());
  board = transposeArray(board)
  return board;
}

function slideTiles(board) {
  const newAllTiles = [];
  for (let r = 0; r < 4; r++) {
    let row = board[r].slice(); // Create a copy of the row
    row = slide(row);
    newAllTiles[r] = row;
  }
  return newAllTiles; // Update allTiles with the new array
}

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

  return row;
}

function canMove() {
  if (canPerformDownAction() && canPerformUpAction() && canPerformLeftAction() && canPerformRightAction()) {
    return true;
  } else {
    return false;
  }
}

function resetGame() {
  allTiles = [];
  allTiles = createTiles(GameBoard);
  randomEmptyTile().value = Math.random() > .5 ? 2 : 4;
  randomEmptyTile().value = Math.random() > .5 ? 2 : 4;
  document.removeEventListener("keydown", handleUserInput);
  document.addEventListener("keydown", handleUserInput, { once: true });
}

startGame();