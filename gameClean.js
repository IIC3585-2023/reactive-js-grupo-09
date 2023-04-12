const canvas = document.getElementById('canvas');
const canvasContext = canvas.getContext('2d');
canvasContext.font = '16px arial';
canvasContext.fillStyle = '#ffff';
canvasContext.fillText(
  'CLICK HERE TO START',
  canvas.width / 2,
  canvas.height / 2
);
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
  rxjs.map(() => update()),
  rxjs.map(() => draw()),
  rxjs.map(() => {
    if (map[pacman.getMapY()][pacman.getMapX()] == 2) {
      map[pacman.getMapY()][pacman.getMapX()] = 3;
      score++;
    }
  }),
  rxjs.map(() => {
    if (map[pacmanSecond.getMapY()][pacmanSecond.getMapX()] == 2) {
      map[pacmanSecond.getMapY()][pacmanSecond.getMapX()] = 3;
      score++;
    }
  })
);

/* const restartPacmanAndGhosts = () => {
  createNewPacman();
};
 */

// little refactor
// add ti ganme interval
const update = () => {
  pacman.moveProcess();
  pacmanSecond.moveProcess();
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
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  createRect(0, 0, canvas.width, canvas.height, 'black');
  drawWalls();
  drawFoods();
  pacman.draw();
  pacmanSecond.draw();
  drawScore();
  drawRemainingLives();
};

createNewPacman();

const clickCanvas$ = rxjs.fromEvent(canvas, 'click');
clickCanvas$
  .pipe(rxjs.take(1))
  .subscribe(() => gameInterval$.subscribe(), { once: true });

const keyboardObservable = (pacman, keys) => {
  const keyboardEvent$ = rxjs.fromEvent(window, 'keydown').pipe(
    rxjs.filter((event) => {
      return Object.keys(keys).includes(event.key);
    })
  );

  keyboardEvent$.subscribe((event) => {
    pacman.nextDirection = keys[event.key];
  });
};

const keysPacman = {
  ArrowLeft: DIRECTION_LEFT,
  ArrowUp: DIRECTION_UP,
  ArrowRight: DIRECTION_RIGHT,
  ArrowDown: DIRECTION_BOTTOM,
};

const keysPacmanSecond = {
  a: DIRECTION_LEFT,
  w: DIRECTION_UP,
  d: DIRECTION_RIGHT,
  s: DIRECTION_BOTTOM,
};

// keyboard observer
keyboardObservable(pacman, keysPacman);
keyboardObservable(pacmanSecond, keysPacmanSecond);
