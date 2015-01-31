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
            r1.vy *=-1;
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
            r1.vx *=-1;
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