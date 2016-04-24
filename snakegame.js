var canvas = null;
var ctx = null;

var xhead; //head position
var yhead; //^
var dx=cw; //amount of distance it moves
var dy=cw; //^
var x1food; //wrong food position
var y1food;
var x2food;
var y2food;
var x3food; //correct food position
var y3food;
var randnum1; //random numbers
var randnum2;
var randnum3; 
var ques; //question
var cw=15; //cell width

var rightPressed = true; //snake initially moves right
var leftPressed = false;
var topPressed = false;
var bottomPressed = false;
var directionflag=1;

var snake_array=[]; //snake body in an array
var speed=150;
var ds=5; //change in speed
var clrReturn;
var score=0;
var length=4;
var flag=0;
var life=3;

var heart=new Image();
heart.src="heart.png";

function lives(){
	for(var i=life; i>0; i--){
		ctx.drawImage(heart,25*i,canvas.height-40,20,20); //draw hearts for lives
	}
}

function create_snake(){

	for(var i=length-1;i>=0;i--){
		snake_array.push({ x:(i+2) , y: 2 }); //snake object with x position variable
	}
	xhead = snake_array[0].x;
	yhead = snake_array[0].y;
}

function drawbody(){
	
	for(var i=0; i<snake_array.length; i++){

		var temp=snake_array[i];
		if(i==0){
			ctx.beginPath();
	ctx.arc(temp.x*cw,temp.y*cw,8,0,2*Math.PI);
	ctx.fillStyle = "black";
	ctx.fill();
	ctx.strokeStyle = "black";
	ctx.stroke();
	ctx.closePath();
		} else {
		ctx.beginPath();
	ctx.arc(temp.x*cw,temp.y*cw,8,0,2*Math.PI);
	ctx.fillStyle = "darkgreen";
	ctx.fill();
	ctx.strokeStyle = "black";
	ctx.stroke();
	ctx.closePath(); }
}
	
}

function food_circle(randnum,xfood,yfood){
		ctx.fillStyle="yellow";
	if(randnum.toString().length==1){
		ctx.arc(xfood,yfood,12,0,2*Math.PI,false);
		ctx.fill();
		ctx.fillStyle="black";
		ctx.fillText(randnum,xfood-5,yfood+7);}
	  else if(randnum.toString().length==2){
		ctx.arc(xfood,yfood,13,0,2*Math.PI,false);
		ctx.fill();
		ctx.fillStyle="black";
		ctx.fillText(randnum,xfood-9,yfood+7);}
	  else if(randnum.toString().length==3){
		ctx.arc(xfood,yfood,15,0,2*Math.PI,false);
		ctx.fill();
		ctx.fillStyle="black";
		ctx.fillText(randnum,xfood-14,yfood+7);}
}

function drawfood(){
	ctx.beginPath();
	ctx.font="bold 16px arial";
	food_circle(randnum1,x1food,y1food);
	ctx.closePath();
	ctx.beginPath();
	food_circle(randnum2,x2food,y2food);
	ctx.closePath();
	ctx.beginPath();
	food_circle(randnum3,x3food,y3food);
	ctx.closePath();
}

function border(){
	ctx.beginPath();
	ctx.rect(0,0,cw+cw/2,canvas.height);
	ctx.rect(0,0,canvas.width,cw+cw/2);
	ctx.rect(canvas.width-cw-cw/2,0,cw+cw/2,canvas.height);
	ctx.rect(0,canvas.height-15,canvas.width,15);
	ctx.fillStyle="#6c2e08";
	ctx.fill();
	ctx.font="20px arial";
	ctx.fillStyle="black";
	ctx.fillText("Speed: "+speed,20,300);
	ctx.closePath();
}

function question(){
	ques=3+Math.floor(Math.random()*12);
	document.getElementById('ques').innerHTML=ques;
}

/*function drawques(){
	ctx.beginPath();
	ctx.fillStyle="blue";
	ctx.font="20px arial";
	ctx.fillText("Which of these numbers is divisible by "+ques ,200,395);
	ctx.closePath();
}*/

function update_game(){
	x1food=45+Math.floor(Math.random()*(canvas.width-80)/15)*15; //between 30 and width-15
	y1food=45+Math.floor(Math.random()*(canvas.height-80)/15)*15; // ^
	x2food=45+Math.floor(Math.random()*(canvas.width-80)/15)*15; //between 30 and width-15
	y2food=45+Math.floor(Math.random()*(canvas.height-80)/15)*15;
	x3food=45+Math.floor(Math.random()*(canvas.width-80)/15)*15; //between 30 and width-15
	y3food=45+Math.floor(Math.random()*(canvas.height-80)/15)*15;
	if(x1food<x2food+30 && y1food<y2food+30 && x1food>x2food-30 && y1food>y2food-30 || x2food<x3food+30 && y2food<y3food+30 && x2food>x3food-30 && y2food>y3food-30 || x1food<x3food+30 && y1food<y3food+30 && x1food>x3food-30 && y1food>y3food-30 ){
		update_game();
	}
	randnum1=Math.floor(Math.random()*150);
	randnum2=Math.floor(Math.random()*150);
	question();
	randnum3=ques*Math.floor(2+Math.random()*10);
		if(randnum1==randnum2 || randnum2==randnum3 || randnum3==randnum1 || randnum1%ques==0 || randnum2%ques==0){
			update_game();
		} else {
			update_speed();
	}
}

function update_speed(){
	clearInterval(clrReturn);   // clear the initial set interval
		if(speed==80){
			clrReturn=setInterval(move,speed);
		} else{
			speed=speed-ds;				// update the speed to make it faster
			clrReturn=setInterval(move,speed);  // new set interval with new speed
		}
}

function check(){
	if(xhead*15==x3food && yhead*15==y3food){
		update_game();
		score++;		// eats the right food
		flag=1;
	} else if (xhead*15==x1food && yhead*15== y1food || xhead*15==x2food && yhead*15==y2food) {
		update_game();
		score--;
																																											life--;		//eats the wrong food
		flag=1;
	}
	document.getElementById('score').innerHTML=score;
}

function move(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	lives();
	drawbody();
	drawfood();
	//drawques();
	border();
	conditions();
	direction();
	collision();
	check();
	
	if(flag==1){
		flag=0;
		var tail={ x:xhead, y:yhead };		//tail becomes the new head and tail
	}else {
	var tail=snake_array.pop();		//pop the tail
	tail={ x:xhead, y:yhead };
			}
	snake_array.unshift(tail);		//add tail at the start

	directionflag=1;

}

function conditions(){
			if(xhead*cw<=cw || xhead*cw>=canvas.width-cw || yhead*cw<=cw || yhead*cw>=canvas.height-20 || !life){  //border and lives
				after_collision();
			}
}

function collision(){
	for(var i=0;i<snake_array.length;i++){
		if (snake_array[i].x==xhead && snake_array[i].y==yhead){	//body collision
			after_collision();
		}
	}
}

function after_collision(){
			ctx.beginPath();
			ctx.fillStyle="red";
			ctx.arc(xhead*cw,yhead*cw,8,0,2*Math.PI);
			ctx.fill();
			ctx.strokeStyle="black";
			ctx.stroke();
			ctx.closePath();
			clearInterval(clrReturn);
			play_again();
}

addEventListener("keydown", keyDownHandler, false);

function keyDownHandler(e) {
	if(directionflag==1){
    if( (e.keyCode == 39 || e.keyCode==68) && leftPressed!=true) { 	   //right
        	keyreset();
        	rightPressed = true;
        	directionflag=0;
    }

    else if( (e.keyCode == 37 || e.keyCode==65) && rightPressed!=true) { //left
        	keyreset();
        	leftPressed = true;
        	directionflag=0;
    }

    else if( (e.keyCode == 38 || e.keyCode==87) && bottomPressed!=true){  //top
        	keyreset();
        	topPressed = true;
        	directionflag=0;
    }

    else if( (e.keyCode == 40 || e.keyCode==83)&& topPressed!=true){  //down
        	keyreset();
        	bottomPressed = true;
        	directionflag=0;
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
			location.reload();
	}
}

window.onload = function() {
	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");

	canvas.width=600; //width
canvas.height=400; //height

	create_snake();
	update_game();	
}
