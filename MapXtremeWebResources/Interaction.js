///////////////////////////////////////////////////////////////////////////////
//
//   (c) Pitney Bowes MapInfo Corporation, 2008.  All rights reserved.
//
//   The source code below is provided as sample code only. The end user of the
//   Licensed Product that contains this code may use the code below for
//   development purposes. This software is provided by Pitney Bowes MapInfo
//   "as is" and any express or implied warranties, including, but not limited
//   to, the implied warranties of merchantability and fitness for a particular
//   purpose are disclaimed.  In no event shall Pitney Bowes MapInfo be liable
//   for any direct, indirect, incidental, special, exemplary, or consequential
//   damages (including, but not limited to, procurement of substitute goods or
//   services; loss of use, data or profits; or business interruption) however
//   caused and whether in contract, strict liability, or tort (including
//   negligence) arising in any way out of the use of this software, even if
//   advised of the possibility of such damage.
//
///////////////////////////////////////////////////////////////////////////////

function IMapXtremeEventHandler()
{
}

IMapXtremeEventHandler.prototype.eventHandler=function(a){
	var b=this;
	b=b;
	return function(c) 
	{
		if (!c) c=GetEvent(this, c);
		if(c){
			if (!c.target) c.target=c.srcElement;
			if (BrowserType() == IE) {
				c.target.doc = c.target.document;
			} else if (BrowserType() == NS) {
				c.target.doc = c.target.ownerDocument;
			}
		}
		if (a != null) return b[a](c);
	}
}


function GetEvent(element, evt)
{
	var imgEvent = null;
	if (element.Frame == null) {
		if (evt != null) {
			imgEvent = evt;
		} else {
			try {imgEvent = event;}catch(e){;}
		}
	}
	else {
		imgEvent = element.Frame.event;
	}
	return imgEvent;
}

//////////////////////////////////////////////////////////////////////////////////////////
// Point data handling methods

function Point(x, y)
{
	this.x = parseInt(x);
	this.y = parseInt(y);
}

function PointsData()
{
	this.Points = new Array();
}

// Append the point to points collection
PointsData.prototype.NumPoints = function()
{
	return this.Points.length;
}

PointsData.prototype.AddPoint = function(x, y)
{
	this.Points[this.Points.length] = new Point(x,y);
}

// Get point from points collection
PointsData.prototype.GetPoint = function(indx)
{
	if (this.Points[indx] != null) {
		return new Point(this.Points[indx].x, this.Points[indx].y);
	} else {
		return null;
	}
}

// Return the string representation of point collection, The format is "numpts,x y,x y,x y...,x y"
PointsData.prototype.GetPointsString = function(offset)
{
	var pointString = "" + this.Points.length + ",";
	for (i = 0; i < this.Points.length; i++) {
		if (i>0)
		{
			pointString += ","
		}
		// In case of radius tool the third point is radius, -99999 we don't want to offset it.
		if (this.Points[i].y != -99999) {
			pointString += (this.Points[i].x - offset.x) + "_" + (this.Points[i].y - offset.y);	
		} else {
			pointString += (this.Points[i].x) + "_" + (this.Points[i].y);	
		}
	}
	return pointString;
}

// Return the string representation of point collection, The format is "x,y x,y x,y ... x,y"
PointsData.prototype.GetPointsValue = function(offset)
{
	var pointString = "";
	for (i = 0; i < this.Points.length; i++) {
		if (i>0)
		{
			pointString += " "
		}
		pointString += (this.Points[i].x - offset.x) + "," + (this.Points[i].y - offset.y);		
	}
	return pointString;
}

PointsData.prototype.Clear = function()
{
	this.Points.length = 0;
}

//////////////////////////////////////////////////////////////////////////////////////////
// Misc methods

function GetAbsPos(elem)
{
	if (elem == null) { return new Point(0,0); }
	var left = elem.offsetLeft;
	var top = elem.offsetTop;
	if(elem.offsetParent)
	{
		pt = GetAbsPos(elem.offsetParent);
		left += pt.x;
		top += pt.y;
	}
	return new Point(left, top);
}

// Get browser type
var IE = 1;
var NS = 2;
function BrowserType()
{
	if (navigator.appName.toLowerCase().indexOf("microsoft") >= 0) {
		return IE;
	} else if (navigator.appName.toLowerCase().indexOf("netscape") >= 0) {
		return NS;
	}
}

// Check to see if the left button was held down
function LButtonDown(e)
{
	if (BrowserType() == IE) {
		if (e.button == 1) { return true;}
	} else if (BrowserType() == NS) {
		if (e.button == 0) return true;
	}
	return false;
}

function GetElementInternal(object)
{
	var element = null;
	if (object.element) {
		element = object.element;
	} else {
		element = object;
	}
	return element;
}

function FindElement(id)
{
	var i;
	var ele = document.getElementById(id);
	if (ele != null) {
		return ele;
	}

	if (parent.frames.length > 0) {
		for (i=0;i<parent.frames.length;i++) {
			var doc = parent.frames[i].document;
			var ele = doc.getElementById(id);
			if (ele != null) {
				ele.Frame = parent.frames[i];
				return ele;
			}
		}
	}
	return null;
}

// Get proper scrollTop and ScrollLeft. Depending upon the doctype used in the html it may not return the right value
function GetScrollTop(element)
{
    return Math.max(element.doc.body.scrollTop, element.doc.documentElement.scrollTop);
}

function GetScrollLeft(element)
{
    return Math.max(element.doc.body.scrollLeft, element.doc.documentElement.scrollLeft);
}

//////////////////////////////////////////////////////////////////////////////////////////
// VML related methods:

function EnableVML(element)
{
	element.doc.namespaces.add("v", "urn:schemas-microsoft-com:vml")
	if(element.doc.styleSheets.length < 1)
	{
	var oStyleEl = element.doc.createElement("style");
	element.doc.body.appendChild(oStyleEl);
	}
	element.doc.styleSheets.item(0).addRule("v\\:*", "behavior:url(#default#VML)");
}

//////////////////////////////////////////////////////////////////////////////////////////
// Mozilla related methods
function AddElement(element, id)
{
	var obj = document.createElement(element);
	obj.id = id;
	return(obj);
}

function MkDiv(object, x, y, w, h)
{
	x = x - object.left;
	y = y - object.top;
	var divObj = AddElement("DIV", "");
	divObj.style.position = 'absolute';
	divObj.style.left = x + 'px'; 
	divObj.style.top = y + 'px'; 
	divObj.style.width = w + 'px'; 
	divObj.style.height = h + 'px';
	divObj.style.clip = 'rect(0,'+w+'px,'+h+'px,0)';
	divObj.style.overflow = 'hidden';
	divObj.style.backgroundColor = 'black';
	object.appendChild(divObj);
}

function MkOvQds(object,cx, cy, xl, xr, yt, yb, w, h)
{
	this.MkDiv(object,xr+cx, yt+cy, w, h);
	this.MkDiv(object,xr+cx, yb+cy, w, h);
	this.MkDiv(object,xl+cx, yb+cy, w, h);
	this.MkDiv(object,xl+cx, yt+cy, w, h);
}

function MkLin(object, x1, y1, x2, y2)
{
	if (x1 > x2)
	{
		var _x2 = x2;
		var _y2 = y2;
		x2 = x1;
		y2 = y1;
		x1 = _x2;
		y1 = _y2;
	}
	var dx = x2-x1, dy = Math.abs(y2-y1),
	x = x1, y = y1,
	yIncr = (y1 > y2)? -1 : 1;

	if (dx >= dy)
	{
		var pr = dy<<1,
		pru = pr - (dx<<1),
		p = pr-dx,
		ox = x;
		while ((dx--) > 0)
		{
			++x;
			if (p > 0)
			{
				MkDiv(object, ox, y, x-ox, 1);
				y += yIncr;
				p += pru;
				ox = x;
			}
			else p += pr;
		}
		MkDiv(object, ox, y, x2-ox+1, 1);
	}

	else
	{
		var pr = dx<<1,
		pru = pr - (dy<<1),
		p = pr-dy,
		oy = y;
		if (y2 <= y1)
		{
			while ((dy--) > 0)
			{
				if (p > 0)
				{
					MkDiv(object, x++, y, 1, oy-y);
					y += yIncr;
					p += pru;
					oy = y;
				}
				else
				{
					y += yIncr;
					p += pr;
				}
			}
			MkDiv(object, x2, y2, 1, oy-y2);
		}
		else
		{
			while ((dy--) > 0)
			{
				y += yIncr;
				if (p > 0)
				{
					MkDiv(object, x++, oy, 1, y-oy);
					p += pru;
					oy = y;
				}
				else p += pr;
			}
			MkDiv(object, x2, oy, 1, y2-oy);
		}
	}
}

function MkRect(object, x, y, w, h)
{
	var stroke = 1;
	MkDiv(object, x, y, w, stroke);
	MkDiv(object, x+w, y, stroke, h);
	MkDiv(object, x, y+h, w+stroke, stroke);
	MkDiv(object, x, y+stroke, stroke, h-stroke);
}

function MkEllipse(object, left, top, width, height)
{
	var a = width>>1, b = height>>1,
	wod = width&1, hod = (height&1)+1,
	cx = left+a, cy = top+b,
	x = 0, y = b,
	ox = 0, oy = b,
	aa = (a*a)<<1, bb = (b*b)<<1,
	st = (aa>>1)*(1-(b<<1)) + bb,
	tt = (bb>>1) - aa*((b<<1)-1),
	w, h;
	while (y > 0)
	{
		if (st < 0)
		{
			st += bb*((x<<1)+0x3);
			tt += (bb<<1)*(++x);
		}
		else if (tt < 0)
		{
			st += bb*((x<<1)+0x3) - (aa<<1)*(y-1);
			tt += (bb<<1)*(++x) - aa*(((y--)<<1)-0x3);
			w = x-ox;
			h = oy-y;
			if (w&0x2 && h&0x2)
			{
				MkOvQds(object,cx, cy, -x+0x2, ox+wod, -oy, oy-1+hod, 1, 1);
				MkOvQds(object,cx, cy, -x+1, x-1+wod, -y-1, y+hod, 1, 1);
			}
			else MkOvQds(object,cx, cy, -x+1, ox+wod, -oy, oy-h+hod, w, h);
			ox = x;
			oy = y;
		}
		else
		{
			tt -= aa*((y<<1)-0x3);
			st -= (aa<<1)*(--y);
		}
	}
	MkDiv(object,cx-a, cy-oy, a-ox+1, (oy<<1)+hod);
	MkDiv(object,cx+ox+wod, cy-oy, a-ox+1, (oy<<1)+hod);
}

function MkPolyline(object, x, y)
{
	var i = x.length-1; 
	while (i >= 0) {
		MkLin(object, x[i], y[i], x[--i], y[i]);
	}
}

//////////////////////////////////////////////////////////////////////////////////////////
// Base class for interaction
function Interaction(elementID, onComplete)
{
	if (arguments.length > 0) {
		this.InitParams(elementID, onComplete);
	}
}
Interaction.prototype = new IMapXtremeEventHandler();
Interaction.prototype.constructor = Interaction;
Interaction.superclass = IMapXtremeEventHandler.prototype;

Interaction.prototype.InitParams = function(elementID, onComplete)
{
	this.elementID = elementID;
	this.onComplete = onComplete;
	this.PointsData = new PointsData();
	this.dragReqd = true;
	this.clearOnEsc = false;
};

Interaction.prototype.InitHandlers = function()
{
	if (this.element == null) this.element = FindElement(this.elementID);
	this.element.origin = GetAbsPos(this.element);
	this.element.onmouseover = this.eventHandler("OnOver");
	this.element.onmousedown = this.eventHandler("OnDown");
	this.element.onmousemove = this.eventHandler("OnMove");
	this.element.onmouseup = this.eventHandler("OnUp");
	this.element.onclick = this.eventHandler("OnClick");
	this.element.ondblclick = this.eventHandler("OnDblClick");
}

Interaction.prototype.DeinitHandlers = function()
{
	this.element.onmouseover = null;
	this.element.onmousedown = null;
	this.element.onmousemove = null;
	this.element.onmouseup = null;
	this.element.onclick = null;
	this.element.ondblclick = null;
}

Interaction.prototype.OnOver = function(e)
{
	this.element.event = e;
}

Interaction.prototype.OnDown = function(e)
{
	if (LButtonDown(e)) {
		this.Clear();
		this.PointsData.AddPoint(e.clientX+GetScrollLeft(this.element), e.clientY+GetScrollTop(this.element));
		return false;
	}
};

Interaction.prototype.OnMove = function(e)
{
	var startPoint = this.PointsData.GetPoint(0);
	if(startPoint != null)
	{
		if (this.dragReqd) { 
			if (LButtonDown(e)) {
				this.Update(e.target, startPoint, new Point(e.clientX+GetScrollLeft(this.element), e.clientY+GetScrollTop(this.element)));
			}
		} else {
			this.Update(e.target, startPoint, new Point(e.clientX+GetScrollLeft(this.element), e.clientY+GetScrollTop(this.element)));
		}
	}
	return false;
}

Interaction.prototype.OnUp = function(e)
{
}

Interaction.prototype.OnClick = function(e)
{
}

Interaction.prototype.OnKeyPress = function(e)
{
	var code;
	if (e != null) {code = e.keyCode;} else {code = this.parentWindow.event.keyCode;}
	if (code == 27) this.Clear();
}

Interaction.prototype.Update = function(element, startPoint, currentPoint) 
{
	element.origin = GetAbsPos(element);
	if (BrowserType() == IE) {
		this.UpdateIE(element, startPoint, currentPoint);
	} else if (BrowserType() == NS) {
		this.UpdateMoz(element, startPoint, currentPoint);
	}
}

Interaction.prototype.Clear = function()
{
	var ent = this.element.doc.getElementById('MapInfoWebEntity');
	if (ent != null) {
			this.element.doc.body.removeChild(ent);
	}
}

Interaction.prototype.UpdateIE = function(element, startPoint, currentPoint) {};
Interaction.prototype.UpdateMoz = function(element, startPoint, currentPoint) {};

//////////////////////////////////////////////////////////////////////////////////////////
// Null Interaction
function NullInteraction(elementID, onComplete)
{
	if (arguments.length > 0) {
		this.InitParams(elementID, onComplete);
	}
}
NullInteraction.prototype = new Interaction();
NullInteraction.prototype.constructor = NullInteraction;
NullInteraction.superclass = Interaction.prototype;
NullInteraction.prototype.InitHandlers = function()
{
	this.element.onmousedown = null;
	this.element.onmousemove = null;
	this.element.onmouseup = null;
}

//////////////////////////////////////////////////////////////////////////////////////////
// Click Interaction
function ClickInteraction(elementID, onComplete)
{
	if (arguments.length > 0) {
		this.InitParams(elementID, onComplete);
	}
}
ClickInteraction.prototype = new Interaction();
ClickInteraction.prototype.constructor = ClickInteraction;
ClickInteraction.superclass = Interaction.prototype;
ClickInteraction.prototype.InitHandlers = function()
{
	ClickInteraction.superclass.InitHandlers.call(this);
	this.element.onmousedown = null;
	this.element.onmousemove = null;
	this.element.onmouseup = null;
	this.element.ondblclick = null;
}
ClickInteraction.prototype.OnClick=function (e)
{
	this.Clear();
	this.PointsData.AddPoint(e.clientX+GetScrollLeft(this.element), e.clientY+GetScrollTop(this.element));
	this.onComplete();
	this.PointsData.Clear();
}

//////////////////////////////////////////////////////////////////////////////////////////
// Rectangle Interaction
function RectInteraction(elementID, onComplete)
{
	if (arguments.length > 0) {
		this.InitParams(elementID, onComplete);
	}
}
RectInteraction.prototype = new Interaction();
RectInteraction.prototype.constructor = RectInteraction;
RectInteraction.superclass = Interaction.prototype;
RectInteraction.prototype.InitHandlers = function()
{
	RectInteraction.superclass.InitHandlers.call(this);
	this.element.onclick = null;
	this.element.ondblclick = null;
}
RectInteraction.prototype.UpdateMoz = function(element, startPoint, currentPoint)
{
	var rect = element.doc.getElementById("MapInfoWebEntity");
	if(!rect)
	{	
		// TODO Should we expose line styles at the tool level???
		var rect = AddElement("DIV", "RubberRect");
		rect.style.position = 'absolute';
		rect.style.visibility = 'visible';
		rect.id = "MapInfoWebEntity";
		
		
		// Set the rect style to the map parent's z-index:
		rect.style.zIndex = element.parentNode.style.zIndex + 200;
		
		// Add the rect to the document body:
		element.doc.body.appendChild(rect);
		rect.style.left = startPoint.x + 'px'; 
		rect.style.top = startPoint.y + 'px'; 
		
		rect.left = startPoint.x;
		rect.top = startPoint.y;		
		
		// Add event handlers for the element
		rect.onmousedown = element.onmousedown;
		rect.onmousemove = element.onmousemove;
		rect.onmouseup = element.onmouseup;

		rect.element = element;
	}
	
	// Convert the start and current points (which are offset by the map) to absolute
	// positions:
	rect.innerHTML = '';

	// Clip the current point based on the size of the image:
	currentPoint.x = Math.max(element.origin.x, Math.min(currentPoint.x, element.origin.x + element.offsetWidth+2));
	currentPoint.y = Math.max(element.origin.y, Math.min(currentPoint.y, element.origin.y + element.offsetHeight+2));
	
	// Set the rect position based on the adjusted start and current points:
	MkRect(rect, Math.min(startPoint.x, currentPoint.x), Math.min(startPoint.y, currentPoint.y),
					 Math.abs(currentPoint.x - startPoint.x), Math.abs(currentPoint.y - startPoint.y));
}

RectInteraction.prototype.UpdateIE = function(element, startPoint, currentPoint)
{
	// If a rectangle VML hasn't been created:
	var rect = element.doc.getElementById("MapInfoWebEntity");
	if(!rect) {	
		EnableVML(element);
		// TODO Should we expose line styles at the tool level???
		// Create a vml rect with absolute positioning:
		var rect = element.doc.createElement("<v:rect/>");
		rect.id = "MapInfoWebEntity";
		rect.style.position = "absolute";
		rect.style.visibility = 'visible';
		// Set the rect style to the map parent's z-index:
		rect.style.zIndex = element.parentElement.style.zIndex + 200;
		
		// Create a fill with no opacity:
		var fill = element.doc.createElement("<v:fill opacity=0.40></v:fill>");
		
		// Create a dashed stroke:
		var stroke = element.doc.createElement("<v:stroke dashstyle='solid'></v:fill>");
		
		// Add the rect to the document body:
		element.doc.body.appendChild(rect);
		
		// Add the stroke and fill to the rect:
		rect.appendChild(fill);		
		rect.appendChild(stroke);		
	}
	
	// Clip the current point based on the size of the image:
	currentPoint.x = Math.max(element.origin.x, Math.min(currentPoint.x, element.origin.x + element.offsetWidth+2));
	currentPoint.y = Math.max(element.origin.y, Math.min(currentPoint.y, element.origin.y + element.offsetHeight+2));
	
	// Set the rect position based on the adjusted start and current points:
	rect.style.top = Math.min(startPoint.y, currentPoint.y);
	rect.style.left = Math.min(startPoint.x, currentPoint.x);
	rect.style.width = Math.abs(currentPoint.x - startPoint.x);
	rect.style.height =  Math.abs(currentPoint.y - startPoint.y);
}

RectInteraction.prototype.OnUp=function (e)
{
	this.PointsData.AddPoint(e.clientX+GetScrollLeft(this.element), e.clientY+GetScrollTop(this.element));
	if (this.PointsData.NumPoints() == 2 && this.onComplete) {
		var fir = this.PointsData.GetPoint(0);
		var sec = this.PointsData.GetPoint(1);
		var dx = this.PointsData.GetPoint(1).x - this.PointsData.GetPoint(0).x;
		var dy = this.PointsData.GetPoint(1).y - this.PointsData.GetPoint(0).y;
		
		if (dx < 0 && dy < 0) {
			this.PointsData.Clear();
			this.PointsData.AddPoint(sec.x, sec.y);
			this.PointsData.AddPoint(fir.x, fir.y);
		} else if (dx < 0 && dy > 0) {
			this.PointsData.Clear();
			this.PointsData.AddPoint(sec.x, fir.y);
			this.PointsData.AddPoint(fir.x, sec.y);
		} else if (dx > 0 && dy < 0) {
			this.PointsData.Clear();
			this.PointsData.AddPoint(fir.x, sec.y);
			this.PointsData.AddPoint(sec.x, fir.y);
		}
		this.onComplete();
	}
	this.PointsData.Clear();
	if (!this.clearOnEsc) this.Clear();
}

//////////////////////////////////////////////////////////////////////////////////////////
// Radius interaction
function RadInteraction(elementID, onComplete)
{
	if (arguments.length > 0) {
		this.InitParams(elementID, onComplete);
	}
}
RadInteraction.prototype = new Interaction();
RadInteraction.prototype.constructor = RadInteraction;
RadInteraction.superclass = Interaction.prototype;
RadInteraction.prototype.InitHandlers = function()
{
	RadInteraction.superclass.InitHandlers.call(this);
	this.element.onclick = null;
	this.element.ondblclick = null;
}
RadInteraction.prototype.UpdateMoz = function(element, startPoint, currentPoint) 
{
	// If a circle VML hasn't been created:
	var circle = element.doc.getElementById("MapInfoWebEntity");
	if(!circle)
	{	
		// TODO Should we expose line styles at the tool level???
		// Create a vml circle with absolute positioning:
		circle = AddElement("DIV", "RubberCir");
		circle.style.position = "absolute";
		circle.style.visibility = 'visible';
		circle.id = "MapInfoWebEntity";
		
		// Set the rect style to the map parent's z-index:
		circle.style.zIndex = element.parentNode.style.zIndex + 200;
		
		// Add the rect to the document body:
		element.doc.body.appendChild(circle);
		
		// Add event handlers for the element
		circle.onmousedown = element.onmousedown;
		circle.onmousemove = element.onmousemove;
		circle.onmouseup = element.onmouseup;
		element.doc.onmousemove = element.onmousemove;
		element.doc.onmouseup = element.onmouseup;
	}

	circle.innerHTML = '';

	// Clip the current point based on the size of the image:
	//currentPoint.x = Math.max(element.origin.x, Math.min(currentPoint.x, element.origin.x + element.offsetWidth+2));
	//currentPoint.y = Math.max(element.origin.y, Math.min(currentPoint.y, element.origin.y + element.offsetHeight+2));

	// Radius is the distance between the center and the current point
	var radius = Math.sqrt(Math.pow((currentPoint.x - startPoint.x), 2) + Math.pow((currentPoint.y - startPoint.y), 2))

	// The left and top are the center minus the radius
	circle.style.left = (startPoint.x - radius) + 'px';
	circle.style.top = (startPoint.y - radius) + 'px';
	
	circle.left = (startPoint.x - radius); 
	circle.top = (startPoint.y - radius);
	
	// The width and height are the same as the diameter
	circle.style.width = (2*radius) + 'px';   
	circle.style.height =  circle.style.width;
	
	// Check to see if circle goes out of bounds, and if so, set the clipping 
	// parameters
	
	var clipTop, clipRight, clipBottom, clipLeft;
	currentLeft = parseInt(circle.style.left);
	currentTop = parseInt(circle.style.top);
	currentRight = currentLeft + parseInt(circle.style.width);
	currentBottom = currentTop + parseInt(circle.style.height);
		
	if ( currentTop > this.element.origin.y )
		clipTop = 'auto';
	else
		clipTop = (this.element.origin.y - currentTop) + 'px';
			
	if (currentRight > (this.element.origin.x + this.element.width)) 
		clipRight = ((this.element.origin.x + this.element.width) - currentLeft) + 'px';
	else 
		clipRight =  'auto';
		
	if (currentBottom > (this.element.origin.y + this.element.height)) 
		clipBottom = ((this.element.origin.y + this.element.height) - currentTop) + 'px';
	else 
		clipBottom =  'auto';
			
	if (currentLeft > this.element.origin.x) 
		clipLeft =  'auto';
	else 
		clipLeft = (this.element.origin.x - currentLeft) + 'px';
	
    circle.style.clip = 'rect(' + clipTop + ' ' +  clipRight + ' ' + clipBottom + ' ' + clipLeft + ')';
	MkEllipse(circle, startPoint.x - radius, startPoint.y - radius, radius*2, radius*2);
};

RadInteraction.prototype.UpdateIE = function(element, startPoint, currentPoint)
{
	// If a circle VML hasn't been created:
	var circle = element.doc.getElementById("MapInfoWebEntity");
	if(!circle)
	{	
		EnableVML(element);
		// TODO Should we expose line styles at the tool level???
		// Create a vml circle with absolute positioning:
		circle = element.doc.createElement("<v:arc startangle='0' endangle='360'/>");
		circle.style.position = "absolute";
		circle.style.visibility = 'visible';
		circle.id = "MapInfoWebEntity";
		
		// Set the rect style to the map parent's z-index:
		circle.style.zIndex = element.parentElement.style.zIndex + 200;
		
		// Create a fill with no opacity:
		var fill = element.doc.createElement("<v:fill opacity=0.40></v:fill>");
		
		// Create a dashed stroke:
		var stroke = element.doc.createElement("<v:stroke dashstyle='solid'></v:fill>");
		
		// Add the circle  to the document body:
		element.doc.body.appendChild(circle);
		
		// Add the stroke and fill to the rect:
		circle.appendChild(fill);		
		circle.appendChild(stroke);
	}

	// Clip the current point based on the size of the image:
//	currentPoint.x = Math.max(element.origin.x, Math.min(currentPoint.x, element.origin.x + element.offsetWidth+2));
//	currentPoint.y = Math.max(element.origin.y, Math.min(currentPoint.y, element.origin.y + element.offsetHeight+2));

	// Radius is the distance between the center and the current point
	var radius = Math.sqrt(Math.pow((currentPoint.x - startPoint.x), 2) + Math.pow((currentPoint.y - startPoint.y), 2))

	// The left and top are the center minus the radius
	circle.style.left = startPoint.x - radius;
	circle.style.top = startPoint.y - radius;
	
	// The width and height are the same as the diameter
	circle.style.width = 2*radius;
	circle.style.height =  circle.style.width;
	
	// Check to see if circle goes out of bounds, and if so, set the clipping 
	// parameters
	
	var clipTop, clipRight, clipBottom, clipLeft;
	currentLeft = parseInt(circle.style.left);
	currentTop = parseInt(circle.style.top);
	currentRight = currentLeft + parseInt(circle.style.width);
	currentBottom = currentTop + parseInt(circle.style.height);
		
	if ( currentTop > this.element.origin.y )
		clipTop = 'auto';
	else
		clipTop = this.element.origin.y - currentTop;
			
	if (currentRight > (this.element.origin.x + this.element.width)) 
		clipRight = (this.element.origin.x + this.element.width) - currentLeft;
	else 
		clipRight = 'auto';
		
	if (currentBottom > (this.element.origin.y + this.element.height)) 
		clipBottom = (this.element.origin.y + this.element.height) - currentTop;
	else 
		clipBottom = 'auto';
			
	if (currentLeft > this.element.origin.x) 
		clipLeft = 'auto';
	else 
		clipLeft = this.element.origin.x - currentLeft;
	
	circle.style.clip = 'rect(' + clipTop + ' ' +  clipRight + ' ' + clipBottom + ' ' + clipLeft +')';
};

RadInteraction.prototype.OnUp=function (e)
{

	// Get the current point
	var endPoint = new Point(e.clientX+GetScrollLeft(this.element), e.clientY+GetScrollTop(this.element));
	
	// Get start point which is the center
	var startPoint = this.PointsData.GetPoint(0);

	// The startpoint is the center and radius is the distance between the start point and the end point
	var radius = 0;
	if (startPoint == null) {
		this.PointsData.AddPoint(endPoint.x, endPoint.y);
	} else {
		var radius = Math.sqrt(Math.pow((endPoint.x - startPoint.x), 2) + Math.pow((endPoint.y - startPoint.y), 2));
	}

	// The first point is center, radius is in the x coord of the next point
	this.PointsData.AddPoint(radius, -99999);

	// Call back 	
	if (this.onComplete) this.onComplete();
	this.PointsData.Clear();
	if (!this.clearOnEsc) this.Clear();
	
	this.element.doc.onmousemove = null;
	this.element.doc.onmouseup = null;
};

//////////////////////////////////////////////////////////////////////////////////////////
// Line Interaction
function LineInteraction(elementID, onComplete)
{
	if (arguments.length > 0) {
		this.InitParams(elementID, onComplete);
		this.element.onclick = null;
	}
}
LineInteraction.prototype = new Interaction();
LineInteraction.prototype.constructor = LineInteraction;
LineInteraction.superclass = Interaction.prototype;
LineInteraction.prototype.InitHandlers = function()
{
	LineInteraction.superclass.InitHandlers.call(this);
	this.element.onclick = null;
	this.element.ondblclick = null;
}
LineInteraction.prototype.UpdateMoz = function(element, startPoint, currentPoint) 
{
	var line = element.doc.getElementById("MapInfoWebEntity");
	if(!line)
	{	
		// TODO Should we expose line styles at the tool level???
		line = AddElement("DIV", "RubberPolygon");
		line.style.position = "absolute";
		line.style.visibility = 'visible';
		line.id = "MapInfoWebEntity";
		
		// Set the style to the map parent's z-index:
		line.style.zIndex = this.element.parentNode.style.zIndex + 200;
		
		// Add to the document body:
		element.doc.body.appendChild(line);
		
		// Now set the event handlers for click and dblclick for the div element
		line.onmousemove = this.element.onmousemove;
		line.onmouseup = this.element.onmouseup;
		
		line.style.left = (currentPoint.x + GetScrollLeft(element)) + 'px';
		line.style.top = (currentPoint.y + GetScrollTop(element)) + 'px';
		
		line.left = currentPoint.x + GetScrollLeft(element);
		line.top = currentPoint.y + GetScrollTop(element);
	}
	
	var tempX = new Array();
	var tempY = new Array();
	for (i=0; i<this.PointsData.Points.length; i++) {
		var pt = this.PointsData.GetPoint(i);
		tempX[i] = pt.x;
		tempY[i] = pt.y;
	}
	
	tempX[tempX.length]  = currentPoint.x;
	tempY[tempY.length]  = currentPoint.y;
	
	line.innerHTML = '';
	MkPolyline(line, tempX, tempY);
}

LineInteraction.prototype.UpdateIE = function(element, startPoint, currentPoint) 
{
	var line = element.doc.getElementById("MapInfoWebEntity");
	// create the vml polyline element		
	if(!line)
	{
		EnableVML(element);
		// TODO Should we expose line styles at the tool level???
		// Create a vml polyline with absolute positioning:
		line = element.doc.createElement("<v:polyline points=\"0,0\"/>");
		line.style.position = "absolute";
		line.style.visibility = "visible";
		line.id = "MapInfoWebEntity";
		
		// Set the style to the map parent's z-index:
		line.style.zIndex = this.element.parentElement.style.zIndex + 200;
		
		// Create a fill with no opacity:
		if (this.doPolygon == true) {
			var fill = element.doc.createElement("<v:fill opacity=0.40></v:fill>");
		} else {
			var fill = element.doc.createElement("<v:fill opacity=0.00></v:fill>");
		}
		
		// Create a dashed stroke:
		var stroke = element.doc.createElement("<v:stroke dashstyle='solid'></v:fill>");
		
		// Add to the document body:
		element.doc.body.appendChild(line);
		
		// Add the stroke and fill to the polyline:
		line.appendChild(fill);		
		line.appendChild(stroke);
		
		// Now add the event handlers for this line which point to event handlers of the map
		// the reason for doing this is when a closed vml shape is formed, any mouse activities
		// within that closed shaped become events for that vml entity not map
		line.onmousemove = this.element.onmousemove; 
		line.onclick = this.element.onclick;
		line.ondblclick = this.element.ondblclick;
		line.Frame = this.element.Frame;

		// Store the offset of the polyline we just inserted		
		line.lineOffset = new Point(line.offsetLeft, line.offsetTop);
	}
		// Update line coordinates
		currentPoint.x = currentPoint.x - line.lineOffset.x;
		currentPoint.y = currentPoint.y - line.lineOffset.y;
		line.points.value = this.PointsData.GetPointsValue(line.lineOffset) + 
				" " + currentPoint.x + "," + currentPoint.y;
}

LineInteraction.prototype.OnUp=function (e)
{
	this.element.onmousemove = null;
	this.PointsData.Clear();
	if (!this.clearOnEsc) this.Clear();
}

//////////////////////////////////////////////////////////////////////////////////////////
// Polyline Interaction
function PolylineInteraction(elementID, onComplete)
{
	if (arguments.length > 0) {
		this.InitParams(elementID, onComplete);
		this.doPolygon = false;
		this.dragReqd = false;
	}
}
PolylineInteraction.prototype = new Interaction();
PolylineInteraction.prototype.constructor = PolylineInteraction;
PolylineInteraction.superclass = Interaction.prototype;
PolylineInteraction.prototype.InitHandlers = function()
{
	PolylineInteraction.superclass.InitHandlers.call(this);
	this.element.onmousedown = null;
	this.element.onmouseup = null;
}
PolylineInteraction.prototype.LineIE = function(e)
{
	var line = this.element.doc.getElementById("MapInfoWebEntity");
	// create the vml polyline element		
	if(!line)
	{
		EnableVML(this.element);
		// TODO Should we expose line styles at the tool level???
		// Create a vml polyline with absolute positioning:
		line = this.element.doc.createElement("<v:polyline points=\"0,0\"/>");
		line.style.position = "absolute";
		line.style.visibility = "visible";
		line.id = "MapInfoWebEntity";
		
		// Set the style to the map parent's z-index:
		line.style.zIndex = this.element.parentElement.style.zIndex + 200;
		
		// Create a fill with no opacity:
		if (this.doPolygon == true) {
			var fill = this.element.doc.createElement("<v:fill opacity=0.40></v:fill>");
		} else {
			var fill = this.element.doc.createElement("<v:fill opacity=0.00></v:fill>");
		}
		
		// Create a dashed stroke:
		var stroke = this.element.doc.createElement("<v:stroke dashstyle='solid'></v:fill>");
		
		// Add to the document body:
		this.element.doc.body.appendChild(line);
		
		// Add the stroke and fill to the polyline:
		line.appendChild(fill);		
		line.appendChild(stroke);
		
		// Now add the event handlers for this line which point to event handlers of the map
		// the reason for doing this is when a closed vml shape is formed, any mouse activities
		// within that closed shaped become events for that vml entity not map
		line.onmousemove = this.element.onmousemove; 
		line.onclick = this.element.onclick;
		line.ondblclick = this.element.ondblclick;
		line.Frame = this.element.Frame;

		// Store the offset of the polyline we just inserted		
		line.lineOffset = new Point(line.offsetLeft, line.offsetTop);
	}
}

PolylineInteraction.prototype.LineNS = function(e)
{
	var line = this.element.doc.getElementById("MapInfoWebEntity");
	if(!line)
	{	
		// TODO Should we expose line styles at the tool level???
		line = AddElement("DIV", "RubberPolygon");
		line.style.position = "absolute";
		line.style.visibility = 'visible';
		line.id = "MapInfoWebEntity";
		
		// Set the style to the map parent's z-index:
		line.style.zIndex = this.element.parentNode.style.zIndex + 200;
		
		// Add to the document body:
		this.element.doc.body.appendChild(line);
		
		// Now set the event handlers for click and dblclick for the div element
		line.onclick = this.element.onclick;
		line.onmousemove = this.element.onmousemove;
		line.ondblclick = this.element.ondblclick;
		
		line.style.left = (line.left = e.clientX+GetScrollLeft(this.element)) + 'px'; 
		line.style.top = (line.top = e.clientX+GetScrollLeft(this.element)) + 'px'; 
	}
}

PolylineInteraction.prototype.OnClick=function (e)
{
	if (this.PointsData.NumPoints() <= 0) this.Clear();
	if (BrowserType() == IE) {
		this.LineIE(e);
	} else if (BrowserType() == NS) {
		this.LineNS(e);
	}
	this.PointsData.AddPoint(e.clientX+GetScrollLeft(this.element), e.clientY+GetScrollTop(this.element));
	return false;
}

PolylineInteraction.prototype.OnDblClick=function (e)
{
	if (this.onComplete) this.onComplete();
	this.PointsData.Clear();
	if (!this.clearOnEsc) this.Clear();
}

PolylineInteraction.prototype.UpdateMoz = function(element, startPoint, currentPoint) 
{
	// Clip the current point based on the size of the image:
	currentPoint.x = Math.max(element.origin.x, Math.min(currentPoint.x, element.origin.x + element.offsetWidth+2));
	currentPoint.y = Math.max(element.origin.y, Math.min(currentPoint.y, element.origin.y + element.offsetHeight+2));

	// Now set the polylines points collection so that it draws the segments
	// it contains all the previously clicked points + current point (which is moving)
	// + the first point to complete the polygon
	var line = element.doc.getElementById("MapInfoWebEntity");

	var tempX = new Array();
	var tempY = new Array();
	for (i=0; i<this.PointsData.Points.length; i++) {
		var pt = this.PointsData.GetPoint(i);
		tempX[i] = pt.x;
		tempY[i] = pt.y;
	}
	
	tempX[tempX.length]  = currentPoint.x;
	tempY[tempY.length]  = currentPoint.y;
	if (this.doPolygon) {
		var firstPoint = this.PointsData.GetPoint(0);
		tempX[tempX.length]  = firstPoint.x;
		tempY[tempY.length]  = firstPoint.y;
	}	
	
	if (line != null) {
		line.innerHTML = '';
		MkPolyline(line, tempX, tempY);
	}
}

PolylineInteraction.prototype.UpdateIE = function(element, startPoint, currentPoint) 
{
	var line = element.doc.getElementById("MapInfoWebEntity");

	// Clip the current point based on the size of the image:
	currentPoint.x = Math.max(element.origin.x, Math.min(currentPoint.x, element.origin.x + element.offsetWidth+2));
	currentPoint.y = Math.max(element.origin.y, Math.min(currentPoint.y, element.origin.y + element.offsetHeight+2));

	// Now set the polylines points collection so that it draws the segments
	// it contains all the previously clicked points + current point (which is moving)
	// + the first point to complete the polygon
	var offset = line.lineOffset;
	currentPoint.x = currentPoint.x - offset.x;
	currentPoint.y = currentPoint.y - offset.y;
	if (this.doPolygon) {
		firstPoint = this.PointsData.GetPoint(0);
		firstPoint.x = firstPoint.x - offset.x;
		firstPoint.y = firstPoint.y - offset.y;
		line.points.value = this.PointsData.GetPointsValue(offset) + 
				" " + currentPoint.x + "," + currentPoint.y + " " +
				firstPoint.x + "," + firstPoint.y;
	} else {
		line.points.value = this.PointsData.GetPointsValue(offset) + 
				" " + currentPoint.x + "," + currentPoint.y;
	}
}

//////////////////////////////////////////////////////////////////////////////////////////
// Polygon Interaction
function PolygonInteraction(elementID, onComplete)
{
	if (arguments.length > 0) {
		this.InitParams(elementID, onComplete);
		this.doPolygon = true;
		this.dragReqd = false;
	}
}
PolygonInteraction.prototype = new PolylineInteraction();
PolygonInteraction.prototype.constructor = PolygonInteraction;
PolygonInteraction.superclass = PolylineInteraction.prototype;
PolygonInteraction.prototype.InitHandlers = function()
{
	PolygonInteraction.superclass.InitHandlers.call(this);
	this.element.onmousedown = null;
	this.element.onmouseup = null;
}

//////////////////////////////////////////////////////////////////////////////////////////
// Drag Interaction
function DragInteraction(element, onComplete)
{
	if (arguments.length > 0) {
		this.InitParams(element, onComplete);
	}
}
DragInteraction.prototype = new Interaction();
DragInteraction.prototype.constructor = DragInteraction;
DragInteraction.superclass = Interaction.prototype;
DragInteraction.prototype.InitHandlers = function()
{
	DragInteraction.superclass.InitHandlers.call(this);
	this.element.onclick = null;
	this.element.ondblclick = null;
}

DragInteraction.prototype.OnDown = function(e)
{
	if (LButtonDown(e)) {
		this.element.style.zIndex = 200;
		this.Clear();
		this.PointsData.AddPoint(e.clientX+GetScrollLeft(this.element), e.clientY+GetScrollTop(this.element));
		if (!this.origin) this.origin = new Point(this.element.origin.x, this.element.origin.y);
		return false;
	}
};

DragInteraction.prototype.OnMove = function(e)
{
	var startPoint = this.PointsData.GetPoint(0);
	if(startPoint != null)
	{
		if (this.dragReqd) { 
			if (LButtonDown(e)) {
				this.Update(this.element, startPoint, new Point(e.clientX+GetScrollLeft(this.element), e.clientY+GetScrollTop(this.element)));
			}
		} else {
			this.Update(this.element, startPoint, new Point(e.clientX+GetScrollLeft(this.element), e.clientY+GetScrollTop(this.element)));
		}
		var currentPoint = new Point(e.clientX+GetScrollLeft(this.element), e.clientY+GetScrollTop(this.element));
		if (currentPoint.x <= this.origin.x || currentPoint.x >= (this.origin.x + this.element.width) || currentPoint.y <= this.origin.y || currentPoint.y >= (this.origin.y + this.element.height)) {
			this.OnUp(e);
		}
	}
	return false;
}

DragInteraction.prototype.Update = function(element, startPoint, currentPoint) 
{
	if (BrowserType() == IE) {
		//element.parentElement.style.position = "relative";
		this.UpdateIE(element, startPoint, currentPoint);
	} else if (BrowserType() == NS) {
		//element.parentNode.style.position = "relative";
		this.UpdateMoz(element, startPoint, currentPoint);
	}
}

DragInteraction.prototype.UpdateMoz = function(element, startPoint, currentPoint)
{
	var clipTop, clipRight, clipBottom, clipLeft;
	var currentLeft, currentTop, currentRight, currentBottom;
	
	// Calculate absolute current coordinates of the image
	currentLeft = element.origin.x + (currentPoint.x - startPoint.x);
	currentTop = element.origin.y + (currentPoint.y - startPoint.y);
	currentRight = currentLeft + element.width;
	currentBottom = currentTop + element.height;
	element.BorderWidth = 2;

	// Check to see if image goes out of bounds, and if so, set the clipping 
	// parameters
	if ( currentTop > element.origin.y ) {
		clipTop = 0;
	} else {
		clipTop = element.origin.y - currentTop;
	}		
	if (currentRight > (element.origin.x + element.width)) {
		clipRight = (element.origin.x + element.width) - currentLeft - element.BorderWidth;
	} else { 
		clipRight = currentRight - currentLeft - element.BorderWidth;
	}
	if (currentBottom > (element.origin.y + element.height)) { 
		clipBottom = (element.origin.y + element.height) - currentTop - element.BorderWidth;
	} else {
		clipBottom = currentBottom - currentTop - element.BorderWidth;
	}		
	if (currentLeft > element.origin.x) {
		clipLeft = 0;
	} else {
		clipLeft = element.origin.x - currentLeft;
	}
	// Set the map image's style parameters to actually move the image	
	element.style.position = "absolute";
	//Firefox needs to added the element.origin.x/y values to the new left/top of
	// the element.style when using other than absolute positioning (e.g. relative and
	// strict) for the map drag to display in the correct location
	var newleft = currentLeft - element.origin.x;
	var newtop = currentTop - element.origin.y;
	//Get the computed style here, this handles using external css file for styles
	var posStyle = document.defaultView.getComputedStyle(element.parentNode, "").getPropertyValue("POSITION");
	//If the computed style is nothing, then check for the style in the dom
	if(posStyle == "") {
		posSytle = element.parentNode.style.position;
	}
	//If the style position is not "absolute" we need to add element.origin to
	// compensate for the relative positioning
	if(posStyle != "absolute") {
		newleft = element.origin.x + newleft;
		newtop = element.origin.y + newtop;	
	}
	
	element.style.left = newleft + 'px';
	element.style.top = newtop + 'px';	
	
	element.style.clip = 'rect(' + clipTop + 'px, ' +  clipRight + 'px, ' + clipBottom + 'px, ' + clipLeft +'px)';
	this.drag = true;

}

DragInteraction.prototype.UpdateIE = function(element, startPoint, currentPoint)
{
	var clipTop, clipRight, clipBottom, clipLeft;
	var currentLeft, currentTop, currentRight, currentBottom;
	
	// Calculate absolute current coordinates of the image
	currentLeft = element.origin.x + (currentPoint.x - startPoint.x);
	currentTop = element.origin.y + (currentPoint.y - startPoint.y);
	currentRight = currentLeft + element.width;
	currentBottom = currentTop + element.height;
	element.BorderWidth = 2;

	// Check to see if image goes out of bounds, and if so, set the clipping 
	// parameters
	if ( currentTop > element.origin.y ) {
		clipTop = 0;
	} else {
		clipTop = element.origin.y - currentTop;
	}
	if (currentRight > (element.origin.x + element.width)) {
		clipRight = (element.origin.x + element.width) - currentLeft - element.BorderWidth;
	} else { 
		clipRight = currentRight - currentLeft - element.BorderWidth;
	}
	if (currentBottom > (element.origin.y + element.height)) { 
		clipBottom = (element.origin.y + element.height) - currentTop - element.BorderWidth;
	} else {
		clipBottom = currentBottom - currentTop - element.BorderWidth;
	}
	if (currentLeft > element.origin.x) {
		clipLeft = 0;
	} else {
		clipLeft = element.origin.x - currentLeft;
	}
	// Set the map image's style parameters to actually move the image	
	element.style.position = "absolute";
	element.style.left = (currentLeft - element.origin.x) + 'px';
	element.style.top = (currentTop - element.origin.y) + 'px';	
	element.style.clip = 'rect(' + clipTop + 'px, ' +  clipRight + 'px, ' + clipBottom + 'px, ' + clipLeft +'px)';
	this.drag = true;
}

DragInteraction.prototype.OnUp=function (e)
{
	if (this.drag) {
	this.element.style.position='relative';
		this.element.style.left = 0;
		this.element.style.top = 0;
		this.element.style.clip = 'rect(' + 0 + ' ' +  this.element.width + ' ' + this.element.height + ' ' + 0 +')';
		this.PointsData.AddPoint(e.clientX+GetScrollLeft(this.element), e.clientY+GetScrollTop(this.element));
		if (this.onComplete) this.onComplete();
		this.PointsData.Clear();
		this.drag = false;
	}
}
