var spriteObject = {

	sourceX :0,
	sourceY :0,
	sourceWidth :64,
	sourceHeight :64,

	X:0,
	Y:0,
	Width:64,
	Height:64,

	vx:0,
	vy:0,

	visible:true,

	//physics properties
	accelerationX :0,
	accelerationY :0,
	speedLimit:500,
	friction :0.98,
	bounce:-0.7,
	gravity:0.3,

	//platform properties
	isOnGround:undefined,
	jumpForce : -10,

	//getters
	centerX : function (){
		return this.x + (this.Width/2);
		},
	centerY : function(){
		return this.y +(this.Height/2);
		},
	halfWidth :function(){
		return this.Width/2;
		},
	halfHeight :function(){
		return this.Height/2;
		},
}
	var canvas =document.querySelector("canvas");
	var dsurface = canvas.getContext("2d");

	//objects array
	sprites = [];
	var assetToLoad = [];
	var assetsLoaded = 0;

	var cat = Object.create(spriteObject);
	cat.X = canvas.width/2 - cat.halfWidth();
	cat.Y = canvas.height/2 - cat.halfHeight();
	sprites.push(cat);

	var box = Object.create(spriteObject);
	box.sourceX = 150;
	box.sourceY = 100;

	//load the image
	var image = new Image();
	image.addEventListener("load",loadhandler,false);
	image.src = "image/ball.png";
	assetToLoad.push(image);

	//game states
	var LOADING = 0;
	var PLAYING = 1;
	var gameState = LOADING;

	//keys to move
	var UP = 38;
	var DOWN =40;
	var	LEFT = 37;
	var RIGHT = 39;

	//movement direction
	var moveUp =false;
	var moveDown = false;
	var moveLeft = false;
	var moveRight =  false;

	//add event listener for keys
	window.addEventListener("keydown",function(event){
		switch(event.keyCode)
		{
			case UP :
				console.log("up");
				moveUp = true;
				break;
			case DOWN:
				console.log("down");
				moveDown = true;
				break;
			case LEFT :
				console.log("left");
				moveLeft = true;
				break;
			case RIGHT :
				console.log("right");
				moveRight = true;
				break;
		}
	},false);

	window.addEventListener("keyup",function(event){
		switch(event.keyCode)
		{
			case UP :
				moveUp = false;
				break;
			case DOWN:
				moveDown = false;
				break;
			case LEFT :
				moveLeft = false;
				break;
			case RIGHT :
				moveRight = false;
				break;
		}
	},false);

	update();

	function update(){

		requestAnimationFrame(update,canvas);

		switch(gameState)
		{
			case LOADING :
				console.log("wait loading");
				break;

			case PLAYING:
				playGame();
				break;
		}
		render();
	}

	function loadhandler()
	{
		assetsLoaded++
		if(assetsLoaded ==assetToLoad.length)
		{
			console.log("assetsLoaded", assetToLoad);
			gameState = PLAYING;
		}
	}

	function playGame(){
		//make movement by applying acceleration
		if(moveUp && !moveDown)
		{
			cat.accelerationY =-0.2;
			cat.friction = 1;
			cat.gravity = 0;

		}
		if(moveDown && !moveUp )
		{
			cat.accelerationY =0.2;
			cat.friction = 1;
		}
		if(moveLeft && !moveRight)
		{
			cat.accelerationX =-0.2;
			cat.friction = 1;
		}
		if(moveRight && !moveLeft)
		{
			cat.accelerationX =0.2;
			cat.friction = 1;
		}

		//set to velocity and accleration to zero in none keys are pressed
		if(!moveUp && !moveDown)
		{
			cat.accelerationY = 0;
			//cat.vy = 0;
		}
		if(!moveLeft && !moveRight)
		{
			cat.accelerationX = 0;
			//cat.vx = 0;
		}

		if(!moveUp && !moveDown && !moveLeft && !moveRight)
		{
		cat.friction = 0.98;
		cat.gravity = 0.3;
		}

		//apply acceleration
		cat.vx +=cat.accelerationX;
		cat.vy +=cat.accelerationY;

		//apply friction
		cat.vx *=cat.friction;
	
		//remove friction to implement gravity 
		//cat.vy *=cat.friction;

		//apply gravity 
		cat.vy +=cat.gravity;


		//limit the speed of cat
		if(cat.vx > cat.speedLimit)
		{
			cat.vx = cat.speedLimit;
		}

		if(cat.vx < -cat.speedLimit)
		{
			cat.vx = -cat.speedLimit;
		}
		if(cat.vy > cat.speedLimit *2)
		{
			cat.vy = cat.speedLimit*2;
			
		}
		if(cat.vy < -cat.speedLimit)
		{
			cat.vy = -cat.speedLimit;
		}

		console.log("cat.vy :" ,cat.vy);
			
		//now move the cat
		cat.X +=cat.vx;
		cat.Y +=cat.vy;

		//displaying the result
		// console.log("cat.vx :" , cat.vx);
		// console.log("cat.X :" ,cat.X);


		//give the limitation to the cat so that they do not move out of the boundary
		if(cat.X < 0)
		{
			cat.vx *=cat.bounce;
			cat.X = 0;
		}
		if(cat.X + cat.Width > canvas.width)
		{
			cat.vx *=cat.bounce;
			cat.X = canvas.width - cat.Width;
		}
		if(cat.Y < 0)
		{
			cat.vy *=cat.bounce;
			cat.Y = 0;
		}
		if(cat.Y + cat.Height > canvas.height)
		{
			cat.vy *=cat.bounce;
			cat.Y = canvas.height - cat.Height;
		}

		
		
	}	
		function render()
		{
			dsurface.clearRect(0,0,canvas.width,canvas.height);

		//	dsurface.fillRect(box.sourceX,box.sourceY,box.sourceWidth,box.sourceHeight,Math.floor(box.X),Math.floor(box.Y),box.Width,box.Height);

			if(sprites.length !==0)
			{
				for (var i = 0 ; i < sprites.length ; i++)
				{
					var sprite = sprites[i];
					if(sprite.visible)
					{		
					dsurface.drawImage(image,sprite.sourceX,sprite.sourceY,sprite.sourceWidth,sprite.sourceHeight,
										Math.floor(sprite.X),Math.floor(sprite.Y),sprite.Width,sprite.Height);
				}
			}
		}
	}


