
var spriteObject = {

	sourceX :0,
	sourceY :0,
	sourceWidth :128,
	sourceHeight :128,

	X:0,
	Y:0,
	Width:128,
	Height:128,

	vx:0,
	vy:0,

	visible:true,

	//physics properties
	accelerationX :0,
	accelerationY :0,
	speedLimit:50,
	friction :0.98,
	bounce:-0.7,
	gravity:0.3,

	//platform properties
	isOnGround:undefined,
	jumpForce : -15,

	//getters
	centerX : function (){
		return this.X + (this.Width/2);
		},
	centerY : function(){
		return this.Y +(this.Height/2);
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
	var sprites = [];
	var assetToLoad = [];
	var boxes = [];

	var assetsLoaded = 0;

	

	var box = Object.create(spriteObject);
	box.X = 350;
	box.Y = 295;
	box.Height = 25;
	boxes.push(box);
	var image1 = new Image();
	image1.addEventListener("load",loadhandler,false);
	image1.src = "image/box.png";
	assetToLoad.push(image1);



	var box1 = Object.create(spriteObject);
	box1.X = 100;
	box1.Y = 230;
	box1.Height = 25;
	boxes.push(box1);
	var image2 = new Image();
	image2.addEventListener("load",loadhandler,false);
	image2.src = "image/box.png";
	assetToLoad.push(image2);


	var box2 = Object.create(spriteObject);
	box2.X = 500;
	box2.Y = 150;
	box2.Height = 25;
	boxes.push(box2);
	var image3 = new Image();
	image3.addEventListener("load",loadhandler,false);
	image3.src = "image/box.png";
	assetToLoad.push(image3);

	var box3 = Object.create(spriteObject);
	box3.X = 700;
	box3.Y = 170;
	box3.Height = 25;
	boxes.push(box3);
	var image4 = new Image();
	image4.addEventListener("load",loadhandler,false);
	image4.src = "image/box.png";
	assetToLoad.push(image4);

	var box4 = Object.create(spriteObject);
	box4.X = 0;
	box4.Y = 100;
	box4.Height = 25;
	boxes.push(box4);
	var image5 = new Image();
	image5.addEventListener("load",loadhandler,false);
	image5.src = "image/box.png";
	assetToLoad.push(image5);

					
	var cat = Object.create(spriteObject);
	cat.X = canvas.width/2 - cat.halfWidth();
	cat.Y = canvas.height/2 - cat.halfHeight();
	cat.Width = 64;
	cat.Height =64,
	sprites.push(cat);
	//load the image
	var image = new Image();
	image.addEventListener("load",loadhandler,false);
	image.src = "image/box.png";
	assetToLoad.push(image);

	//game states
	var LOADING = 0;
	var PLAYING = 1;
	var gameState = LOADING;

	//keys to move
	
	var	LEFT = 37;
	var RIGHT = 39;
	var SPACE = 32;
	//movement direction
	var moveLeft = false;
	var moveRight =  false;
	var jump = false;
	//add event listener for keys
	window.addEventListener("keydown",function(event){
		switch(event.keyCode)
		{
			
			case LEFT :
				console.log("left");
				moveLeft = true;
				break;
			case RIGHT :
				console.log("right");
				moveRight = true;
				break;
			case SPACE : 
				jump = true;
		}
	},false);

	window.addEventListener("keyup",function(event){
		switch(event.keyCode)
		{
			
			case LEFT :
				moveLeft = false;
				break;
			case RIGHT :
				moveRight = false;
				break;
			case SPACE:
				jump = false;
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
		assetsLoaded++;
		if(assetsLoaded ==assetToLoad.length)
		{
			console.log("assetsLoaded", assetToLoad);
			gameState = PLAYING;
		}
	}

	var mouseX = 0;
	var mouseY = 0;

	
	function playGame()
	{

		//make movement by applying acceleration
	
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
		
		if(!moveLeft && !moveRight)
		{
			cat.accelerationX = 0;
			cat.friction = 0.98;	
		}

		if(jump & cat.isOnGround)
		{
			cat.vy +=cat.jumpForce;
			cat.isOnGround = false;
			cat.friction;
		}

		if( !moveLeft && !moveRight)
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
		if(cat.isOnGround)
		{
			cat.vx *=cat.friction;
		}
		// if(cat.vy < -cat.speedLimit)
		// {
		// 	cat.vy = -cat.speedLimit;
		// }

		// console.log("cat.vy :" ,cat.vy);
			
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
			
			cat.Y = canvas.height - cat.Height;
			cat.isOnGround = true;
			cat.vy -=cat.gravity;
		}	

		
			if(boxes.length !==0)
			{
				for(var i =0 ; i<boxes.length;i++)
				{
				var box = boxes[i];

				blockRectangle(cat,boxes[i],true)
				if(cat.Y + cat.Height == boxes[i].Y)
			{
				cat.isOnGround = true;
			}
			}
			
		}
		// if(boxes.length !==0)
		// 	{
		// 		for(var i =0 ; i<boxes.length;i++)
		// 		{
		// 		var box = boxes[i];


		//  		var collisionSide = blockRectangle(cat,boxes[i],false)

		//  		if(collisionSide == "bottom" && cat.vy >= 0)
		//  		{
		//  			cat.isOnGround = true;
		//  			cat.vy = -cat.gravity;

		//  		}else if(collisionSide == "top" && cat.vy <=0)
		//  		{
		//  			cat.vy =0;
		//  		}else if(collisionSide ="right" && cat.vx >=0)
		//  		{
		//  			cat.vx =0;
		//  		}else if(collisionSide ="left" && cat.vx <=0)
		//  		{
		//  			cat.vx=0;
		//  		}
		//  		if(collisionSide !=="bottom" && cat.vy >0){
		//  			cat.isOnGround = false;
		//  			// cat.vy =-cat.gravity;
		//  		}
		//  		if(collisionSide =="bottom" && cat.vy > 0)
		//  		{
		//  			cat.isOnGround = true;
		//  			cat.vy =-cat.gravity;
		//  		}
		// 	}
		// }
	 }
	
			function blockRectangle(r1, r2 , bounce) {
		  //A variable to tell us which side the 
		  //collision is occurring on
		  if(typeof bounce == "undefined")
		  {
		    bounce = false;
		  }

  ////Create an optional collision vector object to represent the bounce surface
  var s ={};

  var collisionSide = "";

  //Calculate the distance vector
  var vx = r1.centerX() - r2.centerX();
  var vy = r1.centerY() - r2.centerY();

  //Figure out the combined half-widths and half-heights
  var combinedHalfWidths = r1.halfWidth() + r2.halfWidth();
  var combinedHalfHeights = r1.halfHeight() + r2.halfHeight();

  //Check whether vx is less than the combined half widths 
  if (Math.abs(vx) < combinedHalfWidths) {
    //A collision might be occurring! 
    //Check whether vy is less than the combined half heights 
    if (Math.abs(vy) < combinedHalfHeights) {
      //A collision has occurred! This is good! 
      //Find out the size of the overlap on both the X and Y axes
      var overlapX = combinedHalfWidths - Math.abs(vx);
      var overlapY = combinedHalfHeights - Math.abs(vy);

      //The collision has occurred on the axis with the
      //*smallest* amount of overlap. Let's figure out which
      //axis that is

      if (overlapX >= overlapY) {
        //The collision is happening on the X axis 
        //But on which side? vy can tell us
        if (vy > 0) {
          collisionSide = "top";

          //Move the rectangle out of the collision
          r1.Y = r1.Y + overlapY;
        } else {
          collisionSide = "bottom";

          //Move the rectangle out of the collision
          r1.Y = r1.Y - overlapY;
        }
        //bpunce
          if(bounce)
          {
            r1.vy *=-0.5;
          }

        } else {
        //The collision is happening on the Y axis 
        //But on which side? vx can tell us
        if (vx > 0) {
          collisionSide = "left";

          //Move the rectangle out of the collision
          r1.X = r1.X + overlapX;
        } else {
          collisionSide = "right";

          //Move the rectangle out of the collision
          r1.X = r1.X - overlapX;
        }
          if(bounce)
          {
            r1.vx *=-0.5;
          }
        }
    } else {
      //No collision
      collisionSide = "none";
    }
  } else {
    //No collision
    collisionSide = "none";
  }

  return collisionSide;
}


		function render()
		{
			dsurface.clearRect(0,0,canvas.width,canvas.height);

					dsurface.drawImage(image1,box.X,box.Y,box.Width,box.Height);
					dsurface.drawImage(image2,box1.X,box1.Y,box1.Width,box1.Height);
					dsurface.drawImage(image3,box2.X,box2.Y,box2.Width,box2.Height);
					dsurface.drawImage(image4,box3.X,box3.Y,box3.Width,box3.Height);
					dsurface.drawImage(image5,box4.X,box4.Y,box4.Width,box4.Height);

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


