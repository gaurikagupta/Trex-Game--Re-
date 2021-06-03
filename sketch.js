var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var back, backImage;
var ground2, groundImage2;
var ground3, groundImage3;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score=0;
var gameOver, restart;


function preload(){
  trex_running = loadAnimation("trex1.png","trex2.png","trex3.png");
  trex_collided = loadAnimation("trex3.png");
  backImage=loadImage("back1.jpg");
  groundImage = loadImage("back2.png");
  groundImage2= loadImage("back2.png");
  groundImage3=loadImage("back2.png");
  cloudImage = loadImage("cloudImage.png");
  obstacle1 = loadImage("cactus.png");
  obstacle2 = loadImage("cactusGroup.png");
  obstacle3 = loadImage("cactus.png");
  obstacle4 = loadImage("cactusGroup.png");
  obstacle5 = loadImage("cactus.png");
  obstacle6 = loadImage("cactusGroup.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(displayWidth, displayHeight);
  
  //Creating the background
  back=createSprite(displayWidth/2,displayHeight/2+160);
  back.addImage(backImage);
  back.scale=15;

  //Creating the trex
  trex = createSprite(displayWidth/2-250,displayHeight/2+80,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  //Creating the first ground
  ground2=createSprite(displayWidth/2+180,displayHeight/2+5);
  ground2.addImage(groundImage2);
  ground2.scale=3.5;

  //Creating the second ground
  ground = createSprite(displayWidth-600,displayHeight/2+5);
  ground.addImage(groundImage);
  ground.scale=3.5;
  ground.x = ground.width/2;
  ground.velocityX = -(6 + 3*score/100);

  //Creating the third ground
  ground3=createSprite(displayWidth-1000,displayHeight/2+80);
  ground3.addImage(groundImage3);
  ground3.scale=4.5;

  //Creating GAMEOVER and RESTART options
  gameOver = createSprite(displayWidth/2-220,displayHeight/2-150);
  gameOver.addImage(gameOverImg);
  restart = createSprite(displayWidth/2-220,displayHeight/2+40);
  restart.addImage(restartImg);
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  gameOver.visible = false;
  restart.visible = false;
  
  //Creating the invisible ground
  invisibleGround = createSprite(displayWidth/2-100,displayHeight/2+220,displayWidth/2-200,10);
  invisibleGround.visible = false;
  
  //Creating groups
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  //Setting score to 0
  score = 0;
  

}

function draw() {
  //trex.debug = true;
  camera.x=World.mouseX;
  background(255);
  


  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("UP_ARROW") && trex.y >=displayHeight/2+160) {
      trex.velocityY = -17;
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
 
  
  drawSprites();
  textSize(30);
  fill("black");
  text("Score: "+ score, displayWidth/2+150,displayHeight/2-250);
  text("Press the UP ARROW KEY to jump!", displayWidth/2-870,displayHeight/2-250);
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(displayWidth,displayHeight/2-80,40,10);
    cloud.y = Math.round(random(80,displayHeight/2-80));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = displayWidth;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount%100===0) {
    var obstacle = createSprite(camera.x,540,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assigning scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    //obstacle.debug=true;
    obstacle.setCollider("circle",0,0,60);
    
    //adding each obstacle to the group
    obstaclesGroup.add(obstacle);

  }

}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
 
  
  score = 0;
  
}