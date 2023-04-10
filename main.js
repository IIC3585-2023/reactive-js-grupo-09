const SCALING_FACTOR = 3;
const ctx = canvas.getContext("2d");
const frameRate = 30;  // must divide into 60 by whole number eg 60,30,20,15,10
var frameCount = 0;

// define keys to listen to
const KEYMAP = {
    up: [87,38],
    down: [83, 40],
    right: [68, 39],
    left: [65, 37]
};

const playersDirections = {
    1: [0,0],
    2: [0,0]
}

// sets key to true if key is down
function keyboardEvent(event) {
    if (event.type == "keyup"){
        playersDirections[1] = [0,0]
        playersDirections[2] = [0,0]
    }
    else if (KEYMAP.up.includes(event.keyCode)){
        if (event.keyCode == KEYMAP.up[0]){
            playersDirections[1] = [0,-1]
        }
        else{
            playersDirections[2] = [0,-1]
        }
    }
    else if (KEYMAP.down.includes(event.keyCode)){
        if (event.keyCode == KEYMAP.down[0]){
            playersDirections[1] = [0,1]
        }
        else{
            playersDirections[2] = [0,1]
        }
    }

    else if (KEYMAP.right.includes(event.keyCode)){
        if (event.keyCode == KEYMAP.right[0]){
            playersDirections[1] = [1,0]
        }
        else{
            playersDirections[2] = [1,0]
        }
    }

    else if (KEYMAP.left.includes(event.keyCode)){
        if (event.keyCode == KEYMAP.left[0]){
            playersDirections[1] = [-1,0]
        }
        else{
            playersDirections[2] = [-1,0]
        }
    }
}

// add key listeners to window
const keyupEvent = rxjs.fromEvent(document, "keyup");
const keydownEvent = rxjs.fromEvent(document, "keydown");
keyupEvent.subscribe( (x) => keyboardEvent(x) );
keydownEvent.subscribe( (x) => keyboardEvent(x) );

// For SO snippet as it will not focus without user click.
const clickCanvas = rxjs.fromEvent(canvas, "click");
clickCanvas.subscribe( () =>  requestAnimationFrame(update), {once: true});
ctx.canvas.width = SCALING_FACTOR * canvas.width;
ctx.canvas.height = SCALING_FACTOR * canvas.height;
ctx.font = "16px arial";
ctx.textAlign = "center";
ctx.fillText("Click to Start", canvas.width / 2, canvas.height / 2);


const player1 = {
    x: 0, y: 0, w: 50, h: 50, speed: 5,
    draw() {
        var img = document.getElementById("mario");
        ctx.drawImage(img, player1.x, player1.y, player1.w, player1.h);
    },
    move() {
        player1.x += playersDirections[1][0]*player1.speed
        player1.y += playersDirections[1][1]*player1.speed
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
        player2.x += playersDirections[2][0]*player2.speed
        player2.y += playersDirections[2][1]*player2.speed
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
        //  if (!keys.anykey) {
        //      ctx.fillText("Arrow keys to move!", canvas.width / 2, canvas.height / 2);
        //  }
     }
     frameCount += 1;
     requestAnimationFrame(update);
}
