var svg = document.getElementById("svg");
var clear = document.getElementById("clear");
var start = document.getElementById("start");
var textbox = document.getElementById("textbox");
var submit = document.getElementById("submit");
var NS = "http://www.w3.org/2000/svg"
var elements = [];
var requestId;
var move = false;
var lastCircleData = null;
var lastCircleDrawn = null;
var newCircleAllowed = true;
var text = document.getElementById("text")

//svg.setAttribute("width", window.innerWidth);
//svg.setAttribute("height", window.innerHeight);

var width = document.body.clientWidth;
var height = window.innerHeight - 70;
svg.setAttribute("width", width);
svg.setAttribute("height", height);

textbox.style.visibility = "hidden";
textbox.value = 50;
submit.style.visibility = "hidden";


var newCircle = function(e) {
    text.style.visibility = "hidden";
    if (!(newCircleAllowed)) {
	return;
    }
    lastCircleData = {
	x : e.offsetX,
	y : e.offsetY,
	vx : 0,
	vy : 0,
	ax : 0,
	ay : 0,
	q : 5,
    };
    lastCircleDrawn = drawCircle(lastCircleData);
    elements.push(lastCircleData);
    textbox.style.visibility = "visible";
    submit.style.visibility = "visible";
    submit.disabled = false;
    //console.log("new circle");
    newCircleAllowed = false;
}

var checkEnd = function() {
    for (var i = 0; i < elements.length; i++) {
	var circle = elements[i];
	if ((circle.x > -30) && (circle.x < (width + 30)) && (circle.y > -30) && (circle.y < (height + 30))) {
	    return false
	}
    }
    return true;
}


var updateCircles = function() {
    for (var i = 0; i < elements.length; i++) {
	var circle = elements[i];
	if ((circle != lastCircleData) && (circle != undefined)) {
	    //console.log("before updating...");
	    //console.log(circle.x);
	    //console.log(circle.y);
	    circle.x += circle.vx;
	    circle.y += circle.vy;
	    circle.vx += circle.ax;
	    circle.vy += circle.ay;
	    //ax = calcAx(circle);
	    //ay = calcAy(circle);
	    var a = calcA(circle);
	    circle.ax = a[0];
	    circle.ay = a[1];
	    //console.log("after updating...")
	    //console.log(circle.cx);
	    //console.log(circle.cy);
	    for (var j = 0; j < elements.length; j++) {
		var otherCircle = elements[j];
		if ((otherCircle != circle) && (otherCircle != lastCircleData) && (otherCircle != undefined)) {
		    if ((Math.abs(circle.x - otherCircle.x) + Math.abs(circle.y - otherCircle.y)) < 20) {
			delete elements[i];
			delete elements[j];
		    }
		}
	    }
	}
    }
    elements = elements.filter(function(n){ return n != undefined });
    if (elements.length == 0) {
	svg.innerHTML = "";
    }
}


var calcA = function(circle) {
    var sumAX = 0;
    var sumAY = 0;
    console.log("circles creating the force");
    for (var i = 0; i < elements.length; i++) {
	var otherCircle = elements[i];
	if ((otherCircle != lastCircleData) && (otherCircle != circle) && (otherCircle != undefined)) {
	    //console.log(otherCircle);
	    var r3 = Math.pow((Math.pow((circle.x - otherCircle.x), 2) + Math.pow((circle.y - otherCircle.y), 2)), 1.5);
	    //console.log("r: " + r);
	    //var angle = (circle.y - otherCircle.y) / (circle.x - otherCircle.x)
	    var otherQ = otherCircle.q;
	    var q = circle.q;
	    //console.log("dx: " + (circle.x - otherCircle.x));
	    //console.log("qq: " + (q * otherQ));
	    var ax = (q * otherCircle.q / r3) * (circle.x - otherCircle.x);
	    var ay = (q * otherCircle.q / r3) * (circle.y - otherCircle.y);
	    if ((!isNaN(ax))) {
		sumAX += ax;
	    }
	    if (!(isNaN(ay))) {
		sumAY += ay;
	    }
	}
    }
    console.log(sumAX);
    console.log(sumAY);
    var result = [sumAX * 20, sumAY * 20];;
    console.log(result);
    return(result);
    //return [.01, .01];
}


var drawCircle = function(circle) {
    //console.log("drawing circle");
    var c = document.createElementNS(NS, "circle");
    //console.log(circle.x);
    //console.log(circle.y);
    c.setAttribute("cx", circle.x);
    c.setAttribute("cy", circle.y);
    //c.setAttribute("r", Math.sqrt(Math.abs(circle.q)) * 13);
    c.setAttribute("r", 15);
    if (circle.q > 0) {
	var color = "rgba(0,255,0," + (circle.q/10) + ")";
	//console.log("positive");
	c.setAttribute("fill", color);
    }
    else {
	var color = "rgba(255,0,0," + (Math.abs(circle.q)/10) + ")";
	c.setAttribute("fill", color);
    }
    c.setAttribute("stroke","black");
    svg.appendChild(c);
    return c;
}

var animate = function(){
    console.log(elements);
    console.log("animating");
    /*var i = 0;
      console.log(svg.children);
      var max = svg.childElementCount - 1;
      while (i < max) {
      svg.removeChild(svg.children[0]);
      i++;
      }
    */
    svg.innerHTML = "";
      if (elements.length == 0) {
	  end()
	  svg.innerHTML = "";
	window.alert("Collision! There are no more charges!");
	return;
    }
    if (checkEnd()) {
	svg.innerHTML = "";
	window.alert("All of the charges are off of the screen!");
	end();
	return;
    }	    
    if (lastCircleData != null) {
	lastCircleDrawn = drawCircle(lastCircleData);
    } 
    updateCircles();
    for (var i = 0; i < elements.length; i++) {
	var circle = elements[i];
	if (circle != lastCircleData) {
	    drawCircle(circle);
	}
    }
}


var end = function(e) {
    clearInterval(requestId);
    elements = [];
    move = false;
    start.innerHTML = "start";
    newCircleAllowed = true;
    textbox.style.visibility = "hidden";
    textbox.value = 50;
    submit.style.visibility = "hidden";
    svg.innerHTML = "";
}

var action = function(e) {
    if (!(move)) {
	start.innerHTML = "pause";
	requestId = setInterval(animate, 10);
	move = true;
    }
    else {
	start.innerHTML = "start";
	clearInterval(requestId);
	move = false;
    }
}

var updateCharge = function(e) {
    submit.disabled = true;
    input = textbox.value;
    //console.log("updating");
    //console.log(input);
    if (input >= -100 && input <= 100 && input != "") {
	submit.disabled = false;
	svg.removeChild(lastCircleDrawn);
	lastCircleData.q = input / 10
	lastCircleDrawn = drawCircle(lastCircleData);
    }
}


var assignCharge = function(e) {
    newCircleAllowed = true;
    lastCircleData = null;
    lastCircleDrawn = null;
    textbox.value = 50;
    textbox.style.visibility = "hidden";
    submit.style.visibility = "hidden";
}



svg.addEventListener("click", newCircle);
clear.addEventListener("click", end);
start.addEventListener("click", action);
submit.addEventListener("click", assignCharge);
textbox.addEventListener("input", updateCharge);
