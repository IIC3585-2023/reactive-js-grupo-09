const canvas = document.getElementById('canvas');
const canvasContext = canvas.getContext('2d');
const pacmanFrames = document.getElementById('animation');
const pacmanSecondFrames = document.getElementById('animation_green');
const ghostFrames = document.getElementById('ghosts');

const createRect = (x, y, width, height, color) => {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(x, y, width, height);
};

// directions encoding
const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_BOTTOM = 1;

// Game variables
const fps = 30;
const oneBlockSize = 20; // defines the size of the map
const wallSpaceWidth = oneBlockSize / 1.6;
const wallOffset = (oneBlockSize - wallSpaceWidth) / 2;
const wallInnerColor = 'black';

// pacmans
let pacman;
let pacmanSecond;

// statistics
let score = 0;
let lives = 3;

const createNewPacman = () => {
  pacman = new Pacman(
    oneBlockSize,
    oneBlockSize,
    oneBlockSize,
    oneBlockSize,
    oneBlockSize / 5,
    pacmanFrames
  );
  pacmanSecond = new Pacman(
    oneBlockSize * 19,
    oneBlockSize * 21,
    oneBlockSize,
    oneBlockSize,
    oneBlockSize / 5,
    pacmanSecondFrames
  );
};

// ciclo principal del juego
const gameInterval$ = rxjs.interval(1000 / fps).pipe(
  rxjs.tap(console.log),
  rxjs.map(() => update()),
  rxjs.map(() => draw())
  /*   rxjs.map(() => {
    if ( map[this.getMapY()][this.getMapX()] == 2) {
      map[this.getMapY()][this.getMapX()] = 3;
      score++;
  }
  }) */
);

gameInterval$.subscribe();

/* const restartPacmanAndGhosts = () => {
  createNewPacman();
};
 */

// little refactor
// add ti ganme interval
const update = () => {
  pacman.moveProcess();
  pacmanSecond.moveProcess();
  pacman.eat();
  pacmanSecond.eat();
};

// important needs changes
const drawFoods = () => {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (map[i][j] == 2) {
        createRect(
          j * oneBlockSize + oneBlockSize / 3,
          i * oneBlockSize + oneBlockSize / 3,
          oneBlockSize / 3,
          oneBlockSize / 3,
          '#FEB897'
        );
      }
    }
  }
};

// important need changes
const draw = () => {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height); // no estoy seguro para que hace esto
  createRect(0, 0, canvas.width, canvas.height, 'black');
  drawWalls(); //
  drawFoods(); // this needs refactor
  pacman.draw();
  pacmanSecond.draw();
  drawScore();
  drawRemainingLives();
};

createNewPacman();

// keyboard observer
const keyboardEvent$ = rxjs.fromEvent(window, 'keydown');
keyboardEvent$.subscribe((event) => {
  const k = event.keyCode;
  setTimeout(() => {
    if (k == 37) {
      // left arrow
      pacman.nextDirection = DIRECTION_LEFT;
    } else if (k == 38) {
      // up arrow
      pacman.nextDirection = DIRECTION_UP;
    } else if (k == 39) {
      // right arrow
      pacman.nextDirection = DIRECTION_RIGHT;
    } else if (k == 40) {
      // bottom arrow
      pacman.nextDirection = DIRECTION_BOTTOM;
    }
    // second pacman
    if (k == 65) {
      // a
      pacmanSecond.nextDirection = DIRECTION_LEFT;
    } else if (k == 87) {
      // w
      pacmanSecond.nextDirection = DIRECTION_UP;
    } else if (k == 68) {
      // d
      pacmanSecond.nextDirection = DIRECTION_RIGHT;
    } else if (k == 83) {
      // s
      pacmanSecond.nextDirection = DIRECTION_BOTTOM;
    }
  }, 1);
});
