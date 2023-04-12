// draw canvas
const ctx = canvas.getContext("2d");
ctx.font = "16px arial";
ctx.textAlign = "center";
ctx.fillText("Click to Start", canvas.width / 2, canvas.height / 2);

const blocks = setBoard('level-1.txt');

// start event
const clickCanvas$ = rxjs.fromEvent(canvas, "click");
clickCanvas$.pipe(
    rxjs.take(1),
    // rxjs.tap(() => drawBlocks(setBoard('level-1.txt')))
    )
    .subscribe( () =>  requestAnimationFrame(update), {once: true});

// keyboard event
const keyUp$ = rxjs.fromEvent(document, "keyup");
const keyDown$ = rxjs.fromEvent(document, "keydown");

keyUp$.subscribe( () => {
                            playersDirections[0] = [0,0];
                            playersDirections[1] = [0,0]
                        } );

keyDown$.subscribe( (e) => keyboardEvent(e) );


const frameRate = 30;
var frameCount = 0;

// define keys to listen to
const KEYMAP = {
    up: [87, 38],
    down: [83, 40],
    right: [68, 39],
    left: [65, 37]
};

const playersDirections = {
    0: [0,0],
    1: [0,0]
}

// sets key to true if key is down
function keyboardEvent(event) {
    if (KEYMAP.up.includes(event.keyCode)){
        if (event.keyCode == KEYMAP.up[0]){
            playersDirections[0][1] = -1
        }
        else{
            playersDirections[1][1] = -1
        }
    }
    else if (KEYMAP.down.includes(event.keyCode)){
        if (event.keyCode == KEYMAP.down[0]){
            playersDirections[0][1] = 1
        }
        else{
            playersDirections[1][1] = 1
        }
    }

    else if (KEYMAP.right.includes(event.keyCode)){
        if (event.keyCode == KEYMAP.right[0]){
            playersDirections[0][0] = 1
        }
        else{
            playersDirections[1][0] = 1
        }
    }

    else if (KEYMAP.left.includes(event.keyCode)){
        if (event.keyCode == KEYMAP.left[0]){
            playersDirections[0][0] = -1
        }
        else{
            playersDirections[1][0] = -1
        }
    }
}


const player1 = {
    x: 0, y: 0, w: 50, h: 50, speed: 5,
    draw() {
        var img = document.getElementById("mario");
        ctx.drawImage(img, player1.x, player1.y, player1.w, player1.h);
    },
    move() {
        player1.x += playersDirections[0][0]*player1.speed
        player1.y += playersDirections[0][1]*player1.speed
        if (player1.y < 0) { player1.y = 0 }
        if (player1.y + player1.h > canvas.height ) { player1.y = canvas.height - player1.h }
        if (player1.x + player1.w > canvas.width ) { player1.x = canvas.width - player1.w }
        if (player1.x < 0) { player1.x = 0 }
    }
}

const player2 = {
    x: 0, y: 0, w: 50, h: 50, speed: 5,
    draw() {
        var img = document.getElementById("luigi");
        ctx.drawImage(img, player2.x, player2.y, player2.w, player2.h);
    },
    move() {
        player2.x += playersDirections[1][0]*player2.speed
        player2.y += playersDirections[1][1]*player2.speed
        if (player2.y < 0) { player2.y = 0 }
        if (player2.y + player2.h > canvas.height ) { player2.y = canvas.height - player2.h }
        if (player2.x + player2.w > canvas.width ) { player2.x = canvas.width - player2.w }
        if (player2.x < 0) { player2.x = 0 }
    }
}

function update(){
     if (frameCount % (60 / frameRate) === 0) {
         ctx.clearRect(0,0,canvas.width, canvas.height);
         player1.move();
         player1.draw();
         player2.move();
         player2.draw();
         drawBlocks(blocks);
        //  drawBlocks(INITIAL_OBJECTS.blocks)
        //  if (!keys.anykey) {
        //      ctx.fillText("Arrow keys to move!", canvas.width / 2, canvas.height / 2);
        //  }
     }
     frameCount += 1;
     requestAnimationFrame(update);
}



function setBoard(path) {
    const blocks = [];
    const width = 45;
    const height = 45;

    let board = fs.readFile(path).split('\n');

    console.log(board)

    board.forEach((row, i) => {
        row.forEach((block, j) => {
            if (block == "#"){
                blocks.push({
                    x: 50 * i,
                    y: 50 * j,
                    width,
                    height,
                });
            }
        })
    });

    // for (let i = 0; i < 11; i++) {
    //     blocks.push({
    //         x: 50 * i,
    //         y:0,
    //         width:width,
    //         height:height
    //     });

    //     blocks.push({
    //         x: 50 * i,
    //         y: 500,
    //         width:width,
    //         height:height
    //     })
    // };

    // for (let i = 0; i < 9; i++) {
    //     blocks.push({
    //         x: 0,
    //         y:50+50*i,
    //         width:width,
    //         height:height
    //     });
    //     blocks.push({
    //         x: 500,
    //         y:50+50*i,
    //         width:width,
    //         height:height
    //     });
    // };

    // [1,2,4,5,6,8,9].forEach((i) => {
    //     blocks.push({
    //         x: 50,
    //         y: 50*i,
    //         width:width,
    //         height:height
    //     });

    //     blocks.push({
    //         x: 450,
    //         y: 50*i,
    //         width:width,
    //         height:height
    //     });
    // });

    // [2,3,4,6,7,8].forEach((i) => {
    //     blocks.push({
    //         x: 150,
    //         y: 50*i,
    //         width:width,
    //         height:height
    //     });

    //     blocks.push({
    //         x: 350,
    //         y: 50*i,
    //         width:width,
    //         height:height
    //     });
    // });

    // [1,2,3,7,8,9].forEach((i) => {
    //     blocks.push({
    //         x: 250,
    //         y: 50*i,
    //         width:width,
    //         height:height
    //     });

    // });

    return blocks;
}

function drawBlock(block) {
    ctx.beginPath();
    ctx.rect(
        block.x,
        block.y,
        block.width,
        block.height
    );
    ctx.fill();
    ctx.closePath();
}

function drawBlocks(blocks) {
    blocks.forEach((block) => drawBlock(block));
}

// const INITIAL_OBJECTS = {
//     blocks: factory(),
//     score: 0
// };

