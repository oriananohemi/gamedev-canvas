// Codigo aprendido en la leccion 1

// ctx.beginPath();
// ctx.rect(20,40,50,50);
// ctx.fillStyle = "#FF0000";
// ctx.fill();
// ctx.closePath();

// ctx.beginPath();
// ctx.arc(240, 160, 20, 0, 2*Math.PI, false);
// ctx.fillStyle = "green";
// ctx.fill();
// ctx.closePath();

// ctx.beginPath();
// ctx.rect(160, 10, 100, 40);
// ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
// ctx.stroke();
// ctx.closePath();

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d")
var ballRadius = 7;
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = -3;
var dy = -3;
var paddleHeight = 5;
var paddleWidth	= 75;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount =  5;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var lives = 4;
var colorBall = "red";

var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
	bricks[c] = [];
	for (var r = 0; r < brickRowCount; r++) {
		bricks[c][r] = { x: 0, y: 0, status: 1 };
	}
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
	if (e.keyCode == 39) {
		rightPressed = true;
	}
	else if (e.keyCode == 37) {
		leftPressed = true;
	}
}

function keyUpHandler(e) {
	if (e.keyCode == 39) {
		rightPressed = false;
	}
	else if (e.keyCode == 37) {
		leftPressed = false;
	}
}

function mouseMoveHandler(e) {
	var relativeX = e.clientX - canvas.offsetLeft;
	if (relativeX > 0 && relativeX < canvas.width) {
		paddleX = relativeX - paddleWidth / 2;
	}
}

function aleatorio(inferior, superior) {
	numPosibilidades = superior - inferior
	aleat = Math.random() * numPosibilidades
	aleat = Math.floor(aleat)
	return parseInt(inferior) + aleat
}

function cambiaColorAleatorio() {
	const hexadecimalDigits = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F")
	let colorAleatorio = "#";
	for (let i = 0; i < 6; i++) {
		const positionArray = aleatorio(0, hexadecimalDigits.length)
		colorAleatorio += hexadecimalDigits[positionArray]
	}
	colorBall = colorAleatorio;
} 

function collisionDetection() {
	for (var c = 0; c < brickColumnCount; c++) {
		for (var r = 0; r < brickRowCount; r++) {
			var b = bricks[c][r];
			if (b.status == 1) {
				if (x >= b.x && x <= b.x + brickWidth && y >= b.y && y <= b.y + brickHeight + ballRadius) {
					dy = -dy;
					b.status = 0;
					score++;
					cambiaColorAleatorio();
					if (score == brickRowCount * brickColumnCount) {
						alert("YOU WIN, CONGRATULATIONS!");
						document.location.reload();
					}
				}
			}
		}
	}
}


function drawBall() {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
	ctx.fillStyle = colorBall;
	ctx.fill();
	ctx.closePath();
}

function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}

function drawBricks() {
	for (var c = 0; c < brickColumnCount; c++) {
		for (var r = 0; r < brickRowCount; r++) {
			if (bricks[c][r].status == 1) {
			var brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
			var brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
			bricks[c][r].x = brickX;
			bricks[c][r].y = brickY;
			ctx.beginPath()
			ctx.rect(brickX, brickY, brickWidth, brickHeight);
			ctx.fillStyle = "#0095DD";
			ctx.fill();
			ctx.closePath();
			}
		}
	}
}

function drawScore() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBricks();
	drawBall();
	drawPaddle();
	drawScore();
	drawLives()
	collisionDetection();

	if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
		dx = -dx;
		cambiaColorAleatorio();
	}
	if (y + dy < ballRadius) {
		dy = -dy;
		cambiaColorAleatorio();
	}
	else if (y + dy >= canvas.height - ballRadius) {
		if (x >= paddleX && x <= paddleX + paddleWidth) {
				dy = -dy;
	} 
	else{
		lives--;
		if(!lives) {
			alert("GAME OVER");
			document.location.reload();
			cambiaColorAleatorio();
		}
		else {
			alert("You lost a life");
			x = canvas.width / 2;
			y = canvas.height - 30;
			dx = 3;
			dy = -3;
			paddleX = (canvas.width-paddleWidth) / 2;
		  }
		}
	}
	
	if (rightPressed && paddleX < canvas.width - paddleWidth) {
		paddleX += 7;
	}
	else if (leftPressed && paddleX > 0) {
		paddleX -= 7;
	}

	x += dx;
	y += dy;
	
	requestAnimationFrame(draw);
}

draw();
