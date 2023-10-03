
const canvasGrid = 32;


function resize() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const canvas = document.getElementById('game');
  const gameBack = document.getElementById('game-back');

  if (canvas && gameBack) {
    const squareSize = Math.min(windowWidth, windowHeight) * 0.98;
    canvas.width = squareSize;
    canvas.height = squareSize;
    gameBack.style.width = squareSize + 'px';
    gameBack.style.height = squareSize + 'px';
    drawGrid();
  }
}

window.addEventListener('resize', resize);
console.log('Loaded');

setTimeout(() => {
  resize();
}, 100);

function countPixels(gridArray, x, y) {
  pixelsFound = 0;

  newY = y-1;
  if (newY < 0) newY = gridArray.length-1;
  if (gridArray[newY][x] == true) pixelsFound++;
  newY = y+1;
  if (newY == gridArray.length) newY = 0;
  if (gridArray[newY][x] == true) pixelsFound++;

  newX = x-1;
  if (newX < 0) newX = gridArray[0].length-1;
  if (gridArray[y][newX] == true) pixelsFound++;
  newX = x+1;
  if (newX == gridArray[0].length) newX = 0;
  if (gridArray[y][newX] == true) pixelsFound++;

  newY = y-1;
  newX = x-1;
  if (newY < 0) newY = gridArray.length-1;
  if (newX < 0) newX = gridArray[0].length-1;
  if (gridArray[newY][newX] == true) pixelsFound++;

  newY = y+1;
  newX = x+1;
  if (newY == gridArray.length) newY = newY = 0;
  if (newX == gridArray[0].length) newX = newX = 0;
  if (gridArray[newY][newX] == true) pixelsFound++;

  newY = y-1;
  newX = x+1;
  if (newY < 0) newY = gridArray.length-1;
  if (newX == gridArray[0].length) newX = 0;
  if (gridArray[newY][newX] == true) pixelsFound++;

  newY = y-1;
  newX = x+1;
  if (newY < 0) newY = gridArray.length-1;
  if (newX == gridArray[0].length) newX = 0;
  if (gridArray[newY][newX] == true) pixelsFound++;

  return pixelsFound;
}

let gameArray = createNewArray();

function makeStep(gridArray) {
  const nextGen = createNewArray();

  for (let y = 0; y < gridArray.length; y++) {
    for (let x = 0; x < gridArray[y].length; x++) {
      if (!gridArray[y][x] && countPixels(gridArray, x, y) === 3) nextGen[y][x] = true;
      else if (gridArray[y][x] && (countPixels(gridArray, x, y) === 2 || countPixels(gridArray, x, y) === 3)) nextGen[y][x] = true;
      else nextGen[y][x] = false;
    }
  }
  return nextGen;
}

function drawGrid() {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const cellSize = canvas.width / canvasGrid;
  for (let i = 0; i < canvasGrid; i++) {
    for (let j = 0; j < canvasGrid; j++) {
      ctx.fillStyle = gameArray[i][j] ? '#6699ff' : '#111';
      ctx.fillRect(4 + i * cellSize, 4 + j * cellSize, cellSize - 8, cellSize - 8);
    }
  }
}

function end(gridArray) {
  for (let y = 0; y < gridArray.length; y++) {
    for (let x = 0; x < gridArray[y].length; x++) {
      if (gridArray[y][x]) return false;
    }
  }
  return true;
}



function same(gridArray) {
  for (let y = 0; y < gridArray.length; y++) {
    for (let x = 0; x < gridArray[y].length; x++) {
      if (gridArray[y][x] != gameArray[y][x]) return false;
    }
  }
  return true;
}

function remainingPixels(gridArray) {
  var pixels = 0;
  for (let y = 0; y < gridArray.length; y++) {
    for (let x = 0; x < gridArray[y].length; x++) {
      if (gridArray[y][x]) pixels++;
    }
  }
  return pixels;
}

survival = 0;
nextPoint = 20;
keepSame = 0;
gameSet = 0;

setInterval(() => {
  gameSet++;
  newGameArray = makeStep(gameArray);
  if (same(newGameArray)) {
    if (!keepSame) keepSame = 5;
  }
  gameArray = newGameArray;
  drawGrid();
  if (end(gameArray)) {
    if (!keepSame) keepSame = 5;
  } else if (gameSet > 200) {
    if (!keepSame) keepSame = 5;
  }
  
  if (keepSame) {
    keepSame--;
    if (keepSame == 1) {
      gameArray = createNewArray();
      survival = 0;
      nextPoint = 20;
      keepSame = 0;
      gameSet = 0;
    }
  }
}, 100);


function createNewArray() {
  const split = 6;
  myArray = Array.from({ length: canvasGrid }, () =>
    Array.from({ length: canvasGrid }, () => Math.random() < 0.5)
  );
  for (let y = 0; y < myArray.length; y++) {
    for (let x = 0; x < myArray[y].length; x++) {
      if (y < myArray.length/split || y > myArray.length*(split-1)/split) myArray[y][x] = false;
      if (x < myArray.length/split || x > myArray.length*(split-1)/split) myArray[y][x] = false;
    }
  }
  return myArray;
}