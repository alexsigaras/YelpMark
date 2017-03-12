/* Based on http://depts.washington.edu/aimgroup/proj/dollar/ page,
 * modified by Seungwoo Lee
 */
var _isDown, _points, _r, _g, _rc, _state, _startingPoint, _addedNumber = 0;

function onLoad(){
	_isDown = false;
	_state = 0;
}

function strokenizer(element)
{
	$("<div class='strokeResult'></div>").appendTo(element);
	$('<canvas class="strokeCanvas"></canvas>').appendTo(element);
	attachEvent(element);
}

function attachEvent(element)
{
	element.onmousedown = mouseDownEvent;
	element.onmousemove = mouseMoveEvent;
	element.onmouseup = mouseUpEvent;
	element.onmouseout = mouseOutEvent;	
}

function getCanvasRect(canvas)
{
	var w = canvas.width;
	var h = canvas.height;

	var cx = canvas.offsetLeft;
	var cy = canvas.offsetTop;
	while (canvas.offsetParent != null)
	{
		canvas = canvas.offsetParent;
		cx += canvas.offsetLeft;
		cy += canvas.offsetTop;
	}
	return {x: cx, y: cy, width: w, height: h};
}

function getScrollY()
{
	return $(window).scrollTop();
}
//
// Mouse Events
//

function mouseDownEvent(e)
{
	var x = e.clientX;
	var y = e.clientY;
	
	_startingPoint = {x:x,y:y};
	
	var canvas = $('canvas.strokeCanvas', this).css("z-index",10)[0];
	
	_g = canvas.getContext('2d');	
		
	_points = new Array();
	_r = new DollarRecognizer();

	canvas.width = $(canvas).width();
	canvas.height = $(canvas).height();		
	_rc = getCanvasRect(canvas); // canvas rect on page

	_g.clearRect(0, 0, _rc.width, _rc.height);
		
	document.onselectstart = function() { return false; } // disable drag-select
	document.onmousedown = function() { return false; } // disable drag-select
	
	_isDown = true;

	x -= _rc.x;
	y -= _rc.y - getScrollY();

	_g.fillStyle="rgb(0,0,255)";
	_g.fillRect(x - 4, y - 4, 8,8);

	_points.length = 1; // clear
	_points[0] = new Point(x, y);
}

function mouseMoveEvent(e)
{
	var x = e.clientX;
	var y = e.clientY;

	if (_isDown)
	{
		x -= _rc.x;
		y -= _rc.y - getScrollY();
		_points[_points.length] = new Point(x, y); // append
		drawConnectedPoint(_points.length - 2, _points.length - 1);
	}
}

function mouseUpEvent(e)
{
	var x = e.clientX;
	var y = e.clientY;

	document.onselectstart = function() { return true; } // enable drag-select
	document.onmousedown = function() { return true; } // enable drag-select
	
	if (_isDown)
	{
		_isDown = false;
		if (_points.length >= 10)
		{
			var result = _r.Recognize(_points, false);// document.getElementById('useProtractor').checked);
			//drawText(this, result.Name + " (" + round(result.Score,2) + ").");
			setTimeout(stateController, 0, this, result.Name);
		}
		else // fewer than 10 points were inputted
		{
			drawText(this, "Too few points made. Please try again.");
		}
		_g.clearRect(0, 0, _rc.width, _rc.height);
		$('canvas.strokeCanvas', this).css("z-index",-1);
	}
}

function mouseOutEvent() 
{
	/*
	if(_isDown){	
		_isDown = false;
		console.log("out : " + _isDown);
		_g.clearRect(0, 0, _sd.width, _sd.height);
	}
	*/
}

function drawText(element, str)
{
	$('.strokeResult', element).text(str);
	setTimeout(function(){$('.strokeResult', element).text('')}, 0)
}

function drawConnectedPoint(from, to)
{
	_g.beginPath();
	_g.strokeStyle = "rgb(0,0,225)";
	_g.moveTo(_points[from].X, _points[from].Y);
	_g.lineTo(_points[to].X, _points[to].Y);
	_g.closePath();
	_g.stroke();
}

function round(n, d) // round 'n' to 'd' decimals
{
	d = Math.pow(10, d);
	return Math.round(n * d) / d
}

//
// Unistroke Adding and Clearing
//
function onClickAddExisting()
{
	if (_points.length >= 10)
	{
		var unistrokes = document.getElementById('unistrokes');
		var name = unistrokes[unistrokes.selectedIndex].value;
		var num = _r.AddGesture(name, _points);
		drawText("\"" + name + "\" added. Number of \"" + name + "\"s defined: " + num + ".");
	}
}

function onClickAddCustom()
{
	var name = document.getElementById('custom').value;
	if (_points.length >= 10 && name.length > 0)
	{
		var num = _r.AddGesture(name, _points);
		//drawText("\"" + name + "\" added. Number of \"" + name + "\"s defined: " + num + ".");
	}
	var length = _r.Unistrokes.length - 1;
	var points = _r.Unistrokes[length].Points;
	var str = "this.Unistrokes[" + length + "] = new Unistroke(\"" + name + "\", new Array(";
	for(var cnt = 0;cnt < points.length; cnt++){
		str += "new Point(" + parseInt(points[cnt].X) + "," + parseInt(points[cnt].Y) + ")," ;
	}
	str += "));";
}

function onClickCustom()
{
	document.getElementById('custom').select();
}

function onClickDelete()
{
	var num = _r.DeleteUserGestures(); // deletes any user-defined unistrokes
	alert("All user-defined gestures have been deleted. Only the 1 predefined gesture remains for each of the " + num + " types.");
}

function stateController(element, result){
	/*
	if(result == "explorer open"){		
		if(ib.hasClassName(element, 'bgd')) {
			ib.showImageSearcher();
		}
		else {
			drawText(element, "Already Explorer Mode");
		}
	}
	else if(result == "rotate right"){		
		if(ib.hasClassName(element, 'bgd')) {
			var element = $(document.elementFromPoint(_startingPoint.x, _startingPoint.y));	
			if(element[0].tagName == 'IMG') ie.rotate(element, 'left');
			else drawText(element, "There is no selected image");
		}
		else {
			drawText(element, "Operational only on image editing mode");
		}
	}
	else if(result == "rotate left"){
		if(ib.hasClassName(element, 'bgd')) {
			var element = $(document.elementFromPoint(_startingPoint.x, _startingPoint.y));			
			if(element[0].tagName == 'IMG') ie.rotate(element, 'right');
			else drawText(element, "There is no selected image");
		}
		else {
			drawText(element, "Operational only on image editing mode");
		}

	}
	else if(result == "scaleup"){
		if(ib.hasClassName(element, 'bgd')){
			var element = $(document.elementFromPoint(_startingPoint.x, _startingPoint.y));	
			if(element[0].tagName == 'IMG') ie.scale(element, 'up');			
			else drawText(element, "There is no selected image");
		}
		else {
			drawText(element, "Operational only on image editing mode");
		}
	}
	else if(result == "scaledown"){		
		if(ib.hasClassName(element, 'bgd')){
			var element = $(document.elementFromPoint(_startingPoint.x, _startingPoint.y));			
			if(element[0].tagName == 'IMG') ie.scale(element, 'down');
			else drawText(element, "There is no selected image");
		}
		else {
			drawText(element, "Operational only on image editing mode");
		}
	}
	else if(result == "okay"){
		if(ib.hasClassName(element, 'is')) {
			ib.hideImageSearcher();		
		}
		else {
			drawText(element, "Operational only on image searching mode");			
		}
	}
	else if(result == "left"){
		if(ib.hasClassName(element, 'is')){
			if(ib.cp == 1) alert("There is no more left page");
			else {
				ib.cp -= 1;
				ib.movePage($('#imageSearcherWrapper'), 'left');
			}
		}
		else {
			drawText(element, "Operational only on image searching mode");			
		}
	}
	else if(result == "right"){		
		if(ib.hasClassName(element, 'is')){
			if(ib.cp == 3) alert("There is no more right page");
			else {
				ib.cp += 1;
				ib.movePage($('#imageSearcherWrapper'),'right');
			}
		}
		else {
			drawText(element, "Operational only on image searching mode");			
		}			
	}
	else if(result == "check"){
		if(ib.hasClassName(element, "is")){
			var element = $(document.elementFromPoint(_startingPoint.x, _startingPoint.y));		
			ib.addSubImage(element.attr('src'));
		}
		else {
			drawText(element, "Operational only on image searching mode");			
		}
	}
	else if(result == "cancel"){
		if(ib.hasClassName(element, 'is')) {
			ib.cancelImageSearcher();		
		}
		else {
			drawText(element, "Operational only on image searching mode");			
		}n
	}	
	else if(result == "delete"){
		if(ib.hasClassName(element, "id") || ib.hasClassName(element, "bgd")){
			var selectedImg = $(document.elementFromPoint(_startingPoint.x, _startingPoint.y));
			if(ib.hasClassName(element, "id")){
				try {
					ib.delSubImage(selectedImg.parent().attr('class').split(' ')[1]);				
				}
				catch(err) {
					ib.delSubImage(null);				
				}
			}
			else {
				ie.delImage(selectedImg);	
			}
		}
		else {
			drawText(element, "Operational only on image display or editing mode");				
		}	
	}
	*/
	var currentStr = $('#inputBox').val();
	console.log(result);
	chars = ['s','u','h','i'];
	if(chars.indexOf(result) > -1)
		$('#inputBox').val(currentStr + result);
}