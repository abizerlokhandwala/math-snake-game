//Flow of program

//Starts with creation of the snake array when the webpage loads

//update_game() function makes the random positions and numbers required, and gives a setInterval with the required initial speed and the looping function as move()

//move() function displays the food, borders, snake, obstruction rock etc and also sees the direction and other required conditions, and then 
//pops the last element of the array and adds it to the start of the array to make the snake move

//when the food is eaten, it doesnt pop the last element of the array and instead only adds an extra elemnt to the array

var start_flag=0;

function game(){

var canvas = null;
var ctx = null;

var xhead; //head position
var yhead; //^
var cw=15; //cell width
var dx=cw; //amount of distance it moves
var dy=cw; //^
var xfood1; //wrong food position
var yfood1;
var xfood2;
var yfood2;
var xfood3; //correct food position
var yfood3;
var xrock; //obstructing rock position
var yrock;
var randnum1; //random numbers
var randnum2;
var randnum3; 
var ques; //question
var animx; //gobbling animation x
var animy; // y^
var anim_check; //check if anim is over

var rightPressed = true; //snake initially moves right
var leftPressed = false;
var topPressed = false;
var bottomPressed = false;
var directionflag=1; // 1 to say that direction change is allowed

var snake_array=[]; //snake body in an array
var speed=150;
var ds=5; //change in speed
var clrReturn;
var score=0;
var length=4; //initial length
var flag=0; //0 for length not increasing, 1 for increase
var life=3;
var rotate=2; //1 is top, 2 right, 3 down, 4 left

var headtop=new Image();			//initialising the images for the canvas
headtop.src="images/headtop.png";

var headright=new Image();
headright.src="images/headright.png";

var headdown=new Image();
headdown.src="images/headdown.png";

var headleft=new Image();
headleft.src="images/headleft.png";

var leftrock=new Image();
leftrock.src="images/leftrock.png";

var rightrock=new Image();
rightrock.src="images/rightrock.png";

var bottomrock=new Image();
bottomrock.src="images/bottomrock.png";

var toprock=new Image();
toprock.src="images/toprock.png";

var collisionrock=new Image();
collisionrock.src="images/obs_rock.png";

var apple=new Image();
apple.src="images/apple.png";

function create_snake(){

	for(var i=length-1;i>=0;i--){
		snake_array.push({ x:(i+2) , y: 3 }); //snake object with x position variable
	}
	xhead = snake_array[0].x;
	yhead = snake_array[0].y;
}

function drawbody(){
	
	for(var i=0; i<snake_array.length; i++){

		var temp=snake_array[i];
		if(i==0){
			ctx.beginPath();
			if(rotate==1){
				ctx.drawImage(headtop,temp.x*cw-10,temp.y*cw-20,20,30); //top head image
			}
			if(rotate==2){
				ctx.drawImage(headright,temp.x*cw-10,temp.y*cw-10,30,20); //right head image etc
			}
			if(rotate==3){
				ctx.drawImage(headdown,temp.x*cw-10,temp.y*cw-10,20,30);
			}
			if(rotate==4){
				ctx.drawImage(headleft,temp.x*cw-20,temp.y*cw-10,30,20);
			}
	ctx.closePath();
		} else if(temp.x==animx && temp.y==animy){ //for gobbling
		ctx.beginPath();
	ctx.arc(temp.x*cw,temp.y*cw,11,0,2*Math.PI); //display snake body with higher radius to show gobbling effect
	ctx.fillStyle = "darkgreen";
	ctx.fill();
	ctx.strokeStyle = "black";
	ctx.stroke();
	ctx.closePath(); } 
	else {					//normal display of snake body			
		ctx.beginPath();
	ctx.arc(temp.x*cw,temp.y*cw,8,0,2*Math.PI);
	ctx.fillStyle = "darkgreen";
	ctx.fill();
	ctx.strokeStyle = "black";
	ctx.stroke();
	ctx.closePath();
	}
}
reset_anim(); //stop the gobbling anim
}

function reset_anim() {
	if(anim_check==0){ //check if gobbling is over
	animx=null;
	animy=null;
	}else anim_check--; //gobbling effect one step closer to completion
}

function obs_rock(){ //display the obstruction rock
	ctx.drawImage(collisionrock,xrock,yrock,45,45);
}

function food_circle(randnum,xfood,yfood){ //display the apples with the text
		ctx.fillStyle="yellow";
		ctx.font="16px arial";
	if(randnum.toString().length==1){
		/*ctx.arc(xfood,yfood,12,0,2*Math.PI,false);
		ctx.fill();*/
		ctx.drawImage(apple,xfood-15,yfood-18,30,33);
		ctx.fillText(randnum,xfood-5,yfood+7);
	}
	  else if(randnum.toString().length==2){
		/*ctx.arc(xfood,yfood,13,0,2*Math.PI,false);
		ctx.fill();*/
		ctx.drawImage(apple,xfood-15,yfood-18,30,33);
		ctx.fillText(randnum,xfood-9,yfood+7);
	}
	  else if(randnum.toString().length==3){
		/*ctx.arc(xfood,yfood,15,0,2*Math.PI,false);
		ctx.fill();*/
		ctx.drawImage(apple,xfood-18,yfood-18,35,35);
		ctx.fillText(randnum,xfood-14,yfood+7);
	}
}

function drawfood(){
	ctx.beginPath();
	food_circle(randnum1,xfood1,yfood1);
	ctx.closePath();
	ctx.beginPath();
	food_circle(randnum2,xfood2,yfood2);
	ctx.closePath();
	ctx.beginPath();
	food_circle(randnum3,xfood3,yfood3);
	obs_rock();
	ctx.closePath();
}

function border(){
	ctx.beginPath();
		
	for(var i=0;i<20;i++){
		ctx.drawImage(bottomrock,i*30,canvas.height-cw-cw/1.5,35,30); //bottom rocks
		ctx.drawImage(leftrock,-4,i*30,35,35); //left rocks
		ctx.drawImage(toprock,i*30,-4,35,33);  //top rocks
		ctx.drawImage(rightrock,canvas.width-2*cw-cw/20,i*30,33,35);  //right rocks
		
	}
	ctx.closePath();
}

function question(){
	ques=3+Math.floor(Math.random()*12); //question is between 3 and 15
	document.getElementById('ques').innerHTML=ques; //export ques to html doc
}

function rock_check(xposition,yposition){ //check if rock spawns next to a food particle position
	if(xposition>=xrock && xposition<=xrock+50 && yposition<=yrock+60 && yposition>=yrock || xrock<=xhead*cw+30 && xrock>=xhead*cw-60 && yrock>=yhead*cw-40 && yrock<=yhead*cw){
		update_game();
	}
}

function update_game(){
	xfood1=45+Math.floor(Math.random()*(canvas.width-80)/15)*15; //between 45 and width-45
	yfood1=45+Math.floor(Math.random()*(canvas.height-80)/15)*15; // ^
	xfood2=45+Math.floor(Math.random()*(canvas.width-80)/15)*15; //between 45 and width-45
	yfood2=45+Math.floor(Math.random()*(canvas.height-80)/15)*15;
	xfood3=45+Math.floor(Math.random()*(canvas.width-80)/15)*15; //between 45 and width-45
	yfood3=45+Math.floor(Math.random()*(canvas.height-80)/15)*15;
	xrock=45+Math.floor(Math.random()*(canvas.width-120)/15)*15; //between 45 and width-75
	yrock=45+Math.floor(Math.random()*(canvas.height-120)/15)*15;

	if(xfood1<xfood2+30 && yfood1<yfood2+30 && xfood1>xfood2-30 && yfood1>yfood2-30 || xfood2<xfood3+30 && yfood2<yfood3+30 && xfood2>xfood3-30 && yfood2>yfood3-30 || xfood1<xfood3+30 && yfood1<yfood3+30 && xfood1>xfood3-30 && yfood1>yfood3-30 ){
		update_game(); //food doesnt spawn next to each other
	}

	rock_check(xfood1,yfood1);
	rock_check(xfood2,yfood2);
	rock_check(xfood3,yfood3);

	randnum1=2+Math.floor(Math.random()*150); //between 2 and 152
	randnum2=2+Math.floor(Math.random()*150);
	question();
	randnum3=ques*Math.floor(2+Math.random()*10);
		if(randnum1==randnum2 || randnum2==randnum3 || randnum3==randnum1 || randnum1%ques==0 || randnum2%ques==0){ //if 2 nos are the same or wrong ans are right
			update_game();
		} else {
			update_speed();
	}
}

function update_speed(){ //decrease speed
	clearInterval(clrReturn);   // clear the initial set interval
		if(speed==50){
			clrReturn=setInterval(move,speed);
		} else{
			speed=speed-ds;				// update the speed to make it faster
			clrReturn=setInterval(move,speed);  // new set interval with new speed
		}
}

function check(){
	document.getElementById("myCanvas").style.backgroundColor="none"; //no bg color
	document.getElementById("myCanvas").style.backgroundImage="url('images/grass.jpg')"; //give default bg
	if(xhead*15==xfood3 && yhead*15==yfood3){ //eats the right particle
		update_game();
		score++;		
		flag=1; //length should increase
		animx=xhead; animy=yhead; //save the place where gobbling animation takes place
		anim_check=snake_array.length;
	} else if (xhead*15==xfood1 && yhead*15==yfood1 || xhead*15==xfood2 && yhead*15==yfood2) {
		update_game();
		if(score){ //negative score not possible
		score--;
		}																																						
		life--;		//eats the wrong food

		document.getElementById("myCanvas").style.backgroundImage="none"; //no bg image
		document.getElementById("myCanvas").style.backgroundColor="red"; //gives red effect, wrong answer
		document.getElementById("life"+(life+1)).style.display= "none";
		flag=1; //length should increase
		animx=xhead; animy=yhead; //save the place where gobbling animation takes place
		anim_check=snake_array.length;
	}
	document.getElementById('score').innerHTML=score;
}

function move(){
	ctx.clearRect(0,0,canvas.width,canvas.height); //clear canvas
	drawfood();
	drawbody();
	border();
	conditions();
	direction();
	collision();
	check();
	if(flag==1){
		flag=0;
		var tail={ x:xhead, y:yhead };		//variable tail becomes the new head and tail
	}else {
	var tail=snake_array.pop();		//pop the last element and store in variable tail
	tail={ x:xhead, y:yhead };
			}
	snake_array.unshift(tail);		//add variable tail at the start

	directionflag=1; //direction change allowed after movement of snake is done

}

function conditions(){ //conditions for death
			if(xhead*cw<=cw || xhead*cw>=canvas.width-cw || yhead*cw<=cw || yhead*cw>=canvas.height-20 || !life || xhead*cw<=xrock+2*cw && xhead*cw>xrock && yhead*cw<=yrock+2*cw && yhead*cw>=yrock){  //border and lives
				after_collision(); 
			}
}

function collision(){ //conditions for body collision
	for(var i=0;i<snake_array.length;i++){
		if (snake_array[i].x==xhead && snake_array[i].y==yhead){	//body collision
			after_collision();
		}
	}
}

function after_collision(){
			document.getElementById("myCanvas").style.backgroundImage="url('images/grass.jpg')"; //give bg
			ctx.beginPath();
			ctx.fillStyle="red"; //give red collision head
			ctx.arc(xhead*cw,yhead*cw,10,0,2*Math.PI);
			ctx.fill();
			ctx.strokeStyle="black";
			ctx.stroke();
			ctx.closePath();
			clearInterval(clrReturn);
			play_again();
}

function keyDownHandler(e) { //movement
	if(directionflag==1){ //direction change allowed
    if( (e.keyCode == 39 || e.keyCode==68) && leftPressed!=true) { 	   //right
        	keyreset(); //make all directions false
        	rightPressed = true;
        	directionflag=0; //direction change not allowed until snake movement
        	rotate=2;
    }

    else if( (e.keyCode == 37 || e.keyCode==65) && rightPressed!=true) { //left
        	keyreset();
        	leftPressed = true;
        	directionflag=0;
        	rotate=4;
    }

    else if( (e.keyCode == 38 || e.keyCode==87) && bottomPressed!=true){  //top
        	keyreset();
        	topPressed = true;
        	directionflag=0;
        	rotate=1;
    }

    else if( (e.keyCode == 40 || e.keyCode==83)&& topPressed!=true){  //down
        	keyreset();
        	bottomPressed = true;
        	directionflag=0;
        	rotate=3;
    }
}
}

function direction(){

	if(rightPressed==true){ //new head is at the right
		xhead++;
	}
	else if(leftPressed==true){	//new head is at the left
		xhead--;
	}
	else if(bottomPressed==true){	//new head is at the bottom
		yhead++;
	}
	else if(topPressed==true){	//new head is at the top
		yhead--;
	}
}

function keyreset() {
    rightPressed = false;
    leftPressed = false;
    topPressed = false;
    bottomPressed = false;
}

function play_again(){
	alert("GAME OVER\nYour score is: "+score);
	if(confirm("Play again?")){
			game();
	}
}

if(start_flag==1){
	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");

	canvas.width=600; //width
	canvas.height=400; //height
	document.getElementById("life1").style.display= "inline-block";
	document.getElementById("life2").style.display= "inline-block";
	document.getElementById("life3").style.display= "inline-block";
	addEventListener("keydown", keyDownHandler, false);
	create_snake(); //make snake array
	update_game();	//start with making random numbers and positions of food particles, and giving a setInterval
}

window.onload = function() { //functions start only after loading of the html file
	
	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");

	canvas.width=600; //width
	canvas.height=400; //height

	start_flag=1;

	addEventListener("keydown", keyDownHandler, false);
	create_snake(); //make snake array
	update_game();	//start with making random numbers and positions of food particles, and giving a setInterval
}
}

game();