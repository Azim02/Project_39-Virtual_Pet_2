//declaring variables -

var dog,sadDog,happyDog, database;
var foodS,foodStock;

var addFood;
var foodObj;

var feed, lastFed

//function to load images, animations, sounds, etc....
function preload(){
  //loading images
  sadDog = loadImage("dogImg.png");
  happyDog = loadImage("dogImg1.png");
}

//setup function
function setup() {
  //database..
  database = firebase.database();

  //creating the canvas
  var canvas = createCanvas(900,500);

  //creating foodObj
  foodObj = new Food();

  //fetching foodStock -
  foodStock = database.ref('Food');
  foodStock.on("value",readStock);
  
  //creating dog sprite, adding image to it and scaling it
  dog = createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale = 0.15;

  //creating addFood button -
  addFood = createButton("Add Food");
  //positioning it -
  addFood.position(825,95);
  //if mousePressed 
  addFood.mousePressed(addFoods);

  //creating feed button -
  feed = createButton("Feed The Dog");
  //positioning it -
  feed.position(700,95);
  //if mousePressed 
  feed.mousePressed(feedDog);

}

//draw function -
function draw(){

  //background -
  background(46,139,87);

  //displaying foodObj
  foodObj.display();

 //fetching fedTime -
  fedTime = database.ref('FeedTime')
  fedTime.on("value",function(data){
    lastFed=data.val()
  })
  
  //showing last fed time -
  //font color
  fill(255,255,255);
  //font size
  textSize(15);
  //condtions -
  if(lastFed>=12){
    text("Last Feed: "+ lastFed%12+"PM",350,30)
  }else if(lastFed==0){
    text("Last Feed: 12 AM",350,30)
  }else{
    text("Last Feed: "+ lastFed+"AM",350,30)
  }

  //drawing everything
  drawSprites();
}

//function to read food Stock - 

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);

  var food_stock_val = foodObj.getFoodStock();
  if(food_stock_val <= 0){
    foodObj.updateFoodStock(food_stock_val * 0);
  }else{
    foodObj.updateFoodStock(food_stock_val -1);
  }

  database.ref('/').update({
    Food:foodObj.getFoodStock(),
      FeedTime:hour()
    
  })

}

//function to add food in stock -
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}