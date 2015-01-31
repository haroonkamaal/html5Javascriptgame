(function() {

	var spriteobject = {
		sourcex: 0,
		sourcey: 0,
		soucewidth: 64,
		sourceheight: 64,

		x: 0,
		y: 0,
		width: 64,
		height: 64,

		visible: true,

		vx: 0,
		vy: 0,

		centerX: function() {
			return this.x + (this.width / 2);
		},
		centerY: function() {
			return this.y + (this.height / 2);
		},
		halfWidth: function() {
			return this.width / 2;
		},
		halfHeight: function() {
			return this.height / 2;
		},
	}

	// the message object
	var messageobject = {
		x: 0,
		y: 0,
		visible: true,
		text: "Message",
		font: "normal bold 20px Helvetica",
		fillStyle: "red",
		textBaseline: "top"
	};
	var gametimer = {
		time: 0,
		interval: undefined,

		start: function() {
			var self = this;
			this.interval = setInterval(function() {
				self.tick();
			}, 1000);
		},
		tick: function() {
			this.time--;
		},
		stop: function() {
			clearInterval(this.interval);
		},
		reset: function() {
			this.time = 0;
		}
	};
	gametimer.time = 10;
	gametimer.start();

	//the map of the game
	var map =
		[
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
			[3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
			[3, 1, 2, 2, 2, 1, 2, 1, 2, 1, 3],
			[3, 1, 1, 2, 1, 1, 1, 1, 1, 1, 3],
			[3, 1, 1, 1, 1, 2, 1, 1, 2, 1, 3],
			[3, 1, 2, 1, 2, 2, 1, 2, 2, 1, 3],
			[3, 1, 1, 1, 1, 1, 2, 1, 1, 1, 3],
			[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
		];

	//The game objects map
	var gameobjects =
		[
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0],
			[0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0],
			[0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0],
			[0, 0, 0, 0, 5, 0, 0, 5, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		];

	var canvas = document.querySelector("canvas");
	var dsurface = canvas.getContext("2d");

	var tilesheetcolumns = 5;
	var size = 64;

	var EMPTY = 0;
	var FLOOR = 1;
	var BOX = 2;
	var WALL = 3;
	var ALIEN = 4;
	var BOMB = 5

	var alien = null;

	//array for the game
	var assettoload = [];
	var sprites = [];
	var bombs = [];
	var boxes = [];
	var messages = [];

	var gameovermessage = Object.create(messageobject);
	var timermessage = Object.create(messageobject);

	var bombsDefused = 0;
	var timedisplay = null;
	var gameOverDisplay = null;
	var gameOverMessage = null;
	var timerMessage = null;

	var assetsloaded = 0;

	//no of rows and columns in map
	var ROWS = map.length;
	var COLUMNS = map[0].length;

	//game states
	var LOADING = 0;
	var BUILD_MAP = 1;
	var PLAYING = 2;
	var OVER = 3;
	var gameState = LOADING;

	//code for keys
	var up = 38;
	var down = 40;
	var left = 37;
	var right = 39;

	var moveup = false;
	var movedown = false;
	var moveright = false;
	var moveleft = false;

	var image = new Image();
	image.addEventListener("load", loadhandler, false);
	image.src = "image/timeBombPanic.png";
	assettoload.push(image);

	window.addEventListener("keydown", function(event) {
		switch (event.keyCode) {
			case up:
				moveup = true;
				break;
			case down:
				movedown = true;
				break;
			case left:
				moveleft = true;
				break;
			case right:
				moveright = true;
				break;
		}
	}, false);

	window.addEventListener("keyup", function(event) {
		switch (event.keyCode) {
			case up:
				moveup = false;
				break;
			case down:
				movedown = false;
				break;
			case left:
				moveleft = false;
				break;
			case right:
				moveright = false;
				break;
		}
	}, false);



	function loadhandler() {
		assetsloaded++;
		if (assetsloaded == assettoload.length) {

			image.removeEventListener("load", loadhandler, false);

			gameState = BUILD_MAP;
		}
	}

	update();

	function update() {
		requestAnimationFrame(update, canvas);

		switch (gameState) {
			case LOADING:
				// console.log("its.loading ");
				break;

			case BUILD_MAP:
				buildmap(map);
				buildmap(gameobjects);
				createotherobjects();
				gameState = PLAYING;
				break;

			case PLAYING:
				playgame();
				break;

			case OVER:
				gameover();
				break;
		}
		render();
	}

	function buildmap(levelmap) {
		for (var row = 0; row < ROWS; row++) {

			for (var column = 0; column < COLUMNS; column++) {

				var currenttile = levelmap[row][column]

				if (currenttile !== EMPTY) {
					var tilesheetx = Math.floor((currenttile - 1) % tilesheetcolumns) * size;
					var tilesheety = Math.floor((currenttile - 1) / tilesheetcolumns) * size;

					switch (currenttile) {
						case FLOOR:
							var floor = Object.create(spriteobject);
							floor.sourcex = tilesheetx;
							floor.sourcey = tilesheety;
							floor.x = column * size;
							floor.y = row * size;
							sprites.push(floor);
							break;

						case BOX:
							var box = Object.create(spriteobject);
							box.sourcex = tilesheetx;
							box.sourcey = tilesheety;
							box.x = column * size;
							box.y = row * size;
							sprites.push(box);
							boxes.push(box);
							break;

						case WALL:
							var wall = Object.create(spriteobject);
							wall.sourcex = tilesheetx;
							wall.sourcey = tilesheety;

							// console.log("wall.sourcex ", wall.sourcex);
							// console.log("wall.sourcey ", wall.sourcey);

							wall.x = column * size;
							wall.y = row * size;
							sprites.push(wall);
							break;

						case BOMB:
							var bomb = Object.create(spriteobject);
							bomb.sourcex = tilesheetx;
							bomb.sourcey = tilesheety;
							bomb.sourcewidth = 48;
							bomb.sourceheight = 36;
							bomb.width = 48;
							bomb.height = 36;
							bomb.x = column * size + 10;
							bomb.y = row * size + 16;
							bombs.push(bomb);
							sprites.push(bomb);
							break;

						case ALIEN:
							//Note: "alien" has already been defined in the main
							//program so you don't need to precede it with "var"
							alien = Object.create(spriteobject);
							alien.sourcex = tilesheetx;
							alien.sourcey = tilesheety;
							alien.x = column * size;
							alien.y = row * size;
							sprites.push(alien);
							break;

					}
				}
			}
		}
	}

	function createotherobjects() {
		timeDisplay = Object.create(spriteobject);
		timeDisplay.sourceX = 0;
		timeDisplay.sourceY = 64;
		timeDisplay.sourceWidth = 128;
		timeDisplay.sourceHeight = 48;
		timeDisplay.width = 128;
		timeDisplay.height = 48;
		timeDisplay.x = canvas.width / 2 - timeDisplay.width / 2;
		timeDisplay.y = 8;
		sprites.push(timeDisplay);

		gameOverDisplay = Object.create(spriteobject);
		gameOverDisplay.sourceX = 0;
		gameOverDisplay.sourceY = 129;
		gameOverDisplay.sourceWidth = 316;
		gameOverDisplay.sourceHeight = 290;
		gameOverDisplay.width = 316;
		gameOverDisplay.height = 290;
		gameOverDisplay.x = canvas.width / 2 - gameOverDisplay.width / 2;
		gameOverDisplay.y = canvas.height / 2 - gameOverDisplay.height / 2;
		gameOverDisplay.visible = false;
		sprites.push(gameOverDisplay);

		gameOverMessage = Object.create(messageobject);
		gameOverMessage.x = 275;
		gameOverMessage.y = 270;
		gameOverMessage.font = "bold 30px Helvetica";
		gameOverMessage.fillStyle = "black";
		gameOverMessage.text = "";
		gameOverMessage.visible = false;
		messages.push(gameOverMessage);

		timerMessage = Object.create(messageobject);
		timerMessage.x = 330;
		timerMessage.y = 10;
		timerMessage.font = "bold 40px Helvetica"
		timerMessage.fillStyle = "white";
		timerMessage.text = "";
		messages.push(timerMessage);
	}

	function playgame() {
		//Up
		if (moveup && !movedown) {
			// console.log("up");
			alien.vy -= 1;
		}
		//Down
		if (movedown && !moveup) {
			// console.log("down");
			alien.vy += 1;
		}
		//Left
		if (moveleft && !moveright) {
			// console.log("left");
			alien.vx -= 1;
		}
		//Right
		if (moveright && !moveleft) {
			// console.log("right");
			alien.vx += 1;
		}

		//Set the alien's velocity to zero if none of the keys are being pressed
		if (!moveup && !movedown) {
			alien.vy = 0;
		}
		if (!moveleft && !moveright) {
			alien.vx = 0;
		}

		alien.x += alien.vx;
		alien.y += alien.vy;

		alien.x = Math.max(64, Math.min(alien.x + alien.vx, canvas.width - alien.width - 64));
		alien.y = Math.max(64, Math.min(alien.y + alien.vy, canvas.height - alien.height - 64))

		//  for(var i = 0; i < boxes.length; i++)
		// {
		// 	blockRectangle(alien, boxes[i]);
		// } 	

		for (var i = 0; i < bombs.length; i++) {
			var bomb = bombs[i];
			if (hittest(alien, bomb) && bomb.visible) {
				bomb.visible = false;
				bombsDefused++;
				if (bombsDefused === bombs.length) {
					// gameState = OVER;
				}
			}
		}
	}

	function hittest(alien, bomb) {
		var hit = false;
		var vx = alien.centerX() - bomb.centerX();
		var vy = alien.centerY() - bomb.centerY();

		var vx1 = alien.centerX() - bomb.centerX();
		var vy1 = alien.centerY() - bomb.centerY();


		// console.log("alien.centerX() ",alien.centerX());
		// console.log("bomb.centerX() ",bomb.centerX() );
		// console.log("alien.centerY() ",alien.centerY());
		// console.log("bomb.centerY() ",bomb.centerY() );

		// var magnitude1 = Math.sqrt(vx1*vx1 + vy1*vy1);
		// var totalRadii1 = alien.halfWidth() + bomb1.halfWidth();
		// console.log("magnitude1 ",magnitude1);
		// console.log("totalRadii1 ",totalRadii1 );

		var magnitude = Math.sqrt(vx * vx + vy * vy);
		var totalRadii = alien.halfWidth() + bomb.halfWidth();

		// console.log("magnitude ", magnitude);
		// console.log("totalRadii ", totalRadii);

		if (magnitude < totalRadii) { //|| magnitude1 < totalRadii1){
			hit = true;
		} else {
			hit = false
		}
		return hit;
	}

	function gameover() {
		gametimer.stop();
		gameOverDisplay.visible = true;
		gameOverMessage.visible = true;
		if (bombsDefused === bombs.length) {
			gameOverMessage.text = "You Won!";
		} else {
			gameOverMessage.text = "You Lost!";
		}
	}

	function render() {
		dsurface.clearRect(0, 0, canvas.width, canvas.height);
		//Display the sprites
		if (sprites.length !== 0) {
			for (var i = 0; i < sprites.length; i++) {
				var sprite = sprites[i];
				if (sprite.visible) {
					dsurface.drawImage(image, sprite.sourcex, sprite.sourcey, sprite.soucewidth, sprite.sourceheight, Math.floor(sprite.x),
						Math.floor(sprite.y), sprite.width, sprite.height);
				}
			}
		}
		if (messages.length !== 0) {
			for (var i = 0; i < messages.length; i++) {
				var message = messages[i];
				if (message.visible) {
					dsurface.font = message.font;
					dsurface.fillStyle = message.fillStyle;
					dsurface.textBaseline = message.textBaseline;
					dsurface.fillText(message.text, message.x, message.y);
				}
			}
		}
	}
}());