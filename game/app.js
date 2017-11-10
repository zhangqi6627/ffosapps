window.addEventListener("load", function() {
  console.log("Hello World!");
  var w = window;
  requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
  
  var mCanvas = document.getElementById("mCanvas");
  var mContext = mCanvas.getContext("2d");
  
  // init background
  var bgReady = false;
  var bgImage = new Image();
  bgImage.onload = function(){
    bgReady = true;
  };
  bgImage.src = "images/background.png";

  // init hero
  var heroReady = false;
  var heroImage = new Image();
  heroImage.onload = function(){
    heroReady = true;
  };
  heroImage.src = "images/hero.png";

  // init monster
  var monsterReady = false;
  var monsterImage = new Image();
  monsterImage.onload = function(){
    monsterReady = true;
  };
  monsterImage.src = "images/monster.png";

  // init params
  var hero = {speed : 32};
  var monster = {};
  var monstersCaught = 0;

  // add listener
  var keysDown = {};
  window.addEventListener("keydown",function(e){
    if(e.keyCode == 38){
      hero.y -= hero.speed;
    }else if(e.keyCode == 40){
      hero.y += hero.speed;
    }else if(e.keyCode == 37){
      hero.x -= hero.speed;
    }else if(e.keyCode == 39){
      hero.x += hero.speed;
    }
    if (hero.x <= (monster.x + 32) && monster.x <= (hero.x + 32) && hero.y <= (monster.y + 32) && monster.y <= (hero.y + 32)) {
      ++monstersCaught;
      reset();
    }
  }, false);

  // reset game
  var reset = function(){
    hero.x = mCanvas.width / 2;
    hero.y = mCanvas.height / 2;
    monster.x = 32 + (Math.random() * (mCanvas.width - 64));
    monster.y = 32 + (Math.random() * (mCanvas.height - 64));
  };

  //
  var update = function(modifier){
    var moves = hero.speed * modifier;
    if(38 in keysDown){
      hero.y -= moves;
    }else if(40 in keysDown){
      hero.y += moves;
    }else if(37 in keysDown){
      hero.x -= moves;
    }else if(39 in keysDown){
      hero.x += moves;
    }
    if (hero.x <= (monster.x + 32) && monster.x <= (hero.x + 32) && hero.y <= (monster.y + 32) && monster.y <= (hero.y + 32)) {
      ++monstersCaught;
      reset();
    }
  };

  //
  var render = function(){
    if(bgReady){
      mContext.drawImage(bgImage, 0, 0);
    }
    if(heroReady){
      mContext.drawImage(heroImage, hero.x, hero.y);
    }
    if(monsterReady){
      mContext.drawImage(monsterImage, monster.x, monster.y);
    }
    mContext.fillText("Goblins caught: " + monstersCaught, 32, 32);
  };
  // score
  mContext.fillStyle = "rgb(250, 250, 250)";
  mContext.font = "24px Helvetica";
  mContext.textAlign = "left";
  mContext.textBaseline = "top";
  mContext.fillText("Goblins caught: " + monstersCaught, 32, 32);

  // mainLoop
  var mainLoop = function(){
    var now = Date.now();
    var delta = now - then;
    render();
    then = now;
    requestAnimationFrame(mainLoop); // loop
  };
  
  // start game
  var then = Date.now();
  reset();
  mainLoop();
});
