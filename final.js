	const canvas = document.getElementById('canvas');
	const context = canvas.getContext('2d');

	canvas.width = 500;
	canvas.height = 320;

	const leftKey = 37;
	const upKey = 38;
	const rightKey = 39;
	const downKey = 40;

    class Mover {
		constructor(x, y, xD, yD, width, height) {
			this.x = x;
			this.y = y;
			this.xD = xD;
			this.yD = yD;
			this.width = width;
			this.height = height;
		}
		
		draw() {
			context.fillStyle = 'orangered';
			context.fillRect(this.x, this.y, this.width, this.height);
			this.x += this.xD;
			this.y += this.yD;
		}
	}   
  
	const mover = new Mover(10, 140, 0, 0, 10, 10)
  
	document.addEventListener('keydown', function(event) {
		if(event.keyCode === rightKey) {
			mover.xD = 5;
		}
	}, false);
  
     
	document.addEventListener('keydown', function(event) {
		if(event.keyCode === leftKey) {
			mover.xD = -5;
		}
	}, false);
  
  
	document.addEventListener('keydown', function(event) {
		if(event.keyCode === upKey) {
            if (mover.y > 5) {
                mover.yD = -5;
            } else {
                mover.yD = 0;
            }
		}
	}, false);
  
	document.addEventListener('keydown', function(event) {
		if(event.keyCode === downKey) {
            if (mover.y < canvas.height - 5) {
			    mover.yD = 5;
            } else {
                mover.yD = 0;
            }
		}
	}, false);
  
	document.addEventListener('keyup', function(event) {
		mover.xD = 0;
		mover.yD = 0;
	}, false);
 
	const rand = function(min, max) {
		return Math.random() * (max - min) + min;
	}

    const drawRandomCircle = function() {
        let x = rand(100, 500);
        let y = rand(100, 320);
        let radius = rand(10, 80);
        
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI, false);
        context.lineWidth = 3;
        context.strokeStyle = '#FF0000';
        context.stroke();
    }

    const drawRandomTriangle = function() {
        context.beginPath();
        let x = canvas.width / 2;
        let y = canvas.height / 2;
        context.moveTo(x, y);
        context.lineTo(100, 300);
        context.lineTo(300, 300);
        context.closePath();
        
        context.lineWidth = 10;
        context.strokeStyle = '#777777';
        context.stroke();
        
        context.fillStyle = "#FFCC00";
        context.fill();
    }
  
	class WallPiece {
		constructor(x, y, width, height, xD, colors) {
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.xD = xD;
            this.colors = colors;
		}
		
		draw() {
			context.fillStyle = 'green';
			context.fillRect(this.x, this.y, this.width, this.height);
			this.x += this.xD;
		}
	}
	
	var topPieces = [];
	var bottomPieces = [];
	
	var topPieceX = 400;
	var bottomPieceX = 400;
	
	for(i = 0; i < 25; ++i) {
		const topPiece = new WallPiece(topPieceX, 0, 30, rand(50, 150), -2, ['red', 'blue', 'orange']);
		const bottomPiece = new WallPiece(bottomPieceX, 200, 30, rand(200, 400), -2, ['red', 'blue', 'orange']);
		
		topPieceX += 250;
		bottomPieceX += 250;
		
		topPieces.push(topPiece);
		bottomPieces.push(bottomPiece);
	}

    var currentScore = 0;
    var currentBonus = 0;
    var currentExtraBonus = 0;

    const drawScore = function(score) {
        context.font="20px Georgia";
        var scoreText = "Score: " + score;
        context.fillStyle = "red";
        context.fillText(scoreText, 10, 50);
    }

    const drawBonus = function(bonus) {
        context.font="20px Georgia";
        var scoreText = "Bonus: " + bonus;
        context.fillStyle = "blue";
        context.fillText(scoreText, 10, 80);
    }

    const drawExtraBonus = function(bonus) {
        context.font="20px Georgia";
        var scoreText = "Extra Bonus: " + bonus;
        context.fillStyle = "pink";
        context.fillText(scoreText, 10, 110);
    }

	const loop = function() {
		context.fillStyle = 'GreenYellow';
		context.fillRect(0, 0, canvas.width, canvas.height);
	
		mover.draw(); 
	
		for(index = 0; index < 25; ++index) {
			topPieces[index].draw();
			bottomPieces[index].draw();
			
            let moverXWidth = mover.x + mover.width;
            let collideInXAxis = moverXWidth > topPieces[index].x && moverXWidth < topPieces[index].x + topPieces[index].width;
            let collideWithTop = (mover.y <= topPieces[index].y + topPieces[index].height) && collideInXAxis;
			let collideWithBottom = mover.y + mover.height >= bottomPieces[index].y && collideInXAxis;
			
			if (collideWithTop || collideWithBottom) {
                alert("GAME OVER");
                return;
			}
            
            if (mover.x == topPieces[index].x + topPieces[index].width) {
                ++currentScore;
				
				if (currentScore == 25) {
					alert("*** YOU WIN ***");
					return;
				}
				
                drawScore(currentScore);
                
                if (mover.width < 50) {
                    if (currentScore % 5 == 0) {
                        mover.width += 5;
                        mover.height += 5;
                    }
                }
                
                if (currentScore % 3 == 0) {
                    drawRandomTriangle()
                    currentExtraBonus += 1;
                } else if (currentScore % 4 == 0) {
                    drawRandomTriangle()
                    drawRandomTriangle()
                    currentExtraBonus += 2;
                }
                
                let passedLevels = currentScore / 10;
                
                if (passedLevels == 1) {
                    drawRandomCircle();
                    currentBonus += 1;
                } else if (passedLevels == 2) {
                    drawRandomCircle();
                    drawRandomCircle();
                    currentBonus += 2;
                } else if (passedLevels == 3) {
                    drawRandomCircle();
                    drawRandomCircle();
                    drawRandomCircle();
                    currentBonus += 3;
                } else if (passedLevels == 4) {
                    drawRandomCircle();
                    drawRandomCircle();
                    drawRandomCircle();
                    drawRandomCircle();
                    currentBonus += 4;
                }
            }
		}
        
        drawScore(currentScore);
        drawBonus(currentBonus);
        drawExtraBonus(currentExtraBonus);
        
		requestAnimationFrame(loop);
	};
  
	loop();
