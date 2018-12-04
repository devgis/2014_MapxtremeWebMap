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

//////////////////////////////////////////////////////////////////////////////////////////
// Javascript client side drawing code for Netscape and Mozilla browsers 

function MapInfoWebLog(msg)
{
	var t = document.getElementById("t1");
	if (t != null) {
		t.value = msg;
	}
}

/////////////////////////////////////////////////////////////////////////////////////////
// Globals
var color='black';

//////////////////////////////////////////////////////////////////////////////////////////
// Returns map object given name
function MapInfoWebGetMap(mapid)
{
	var _map =document.getElementById(mapid +"_Image");
	return _map;
}

// API to set current tool on the maptools. This method should be used by users to set current tool
// on the client side
function MapInfoWebSetCurrentTool(mapid, toolName)
{
	var _map =MapInfoWebGetMap(mapid);
	if (_map.MapTools.CurrentTool != null) {
		_map.MapTools.CurrentTool.Stop(_map);
	}
	for (i = 0; i < _map.MapTools.Tools.length; i++) {
		var tool = _map.MapTools.Tools[i];
		if (toolName == tool.Name) {
			_map.MapTools.CurrentTool = tool;
			tool.Start(_map);
		}
	}
}

// Return current tool object
function MapInfoWebGetCurrentTool(mapid)
{
	var _map =MapInfoWebGetMap(mapid);
	if (_map != null && _map.MapTools != null) {
		return _map.MapTools.CurrentTool;
	}
}

/////////////////////////////////////////////////////////////////////////////////////////
// DHTML related methods:

function MapInfoWebAddElement(element, id)
{
	var obj = document.createElement(element);
	obj.id = id;
	return(obj);
}

function MapInfoWebGetAbsolutePosition(elem)
{
	var left = elem.offsetLeft;
	var top = elem.offsetTop;
	if(elem.offsetParent)
	{
		pt = MapInfoWebGetAbsolutePosition(elem.offsetParent);
		left += pt.x;
		top += pt.y;
	}
	return new MapInfoWebPoint(left, top);
}

////////////////////////
// DHTML related methods
function MapInfoWebmkDiv(object, x, y, w, h)
{
	x = x - object.left;
	y = y - object.top;
	var divObj = MapInfoWebAddElement("DIV", "");
	divObj.style.position = 'absolute';
	divObj.style.left = x + 'px'; 
	divObj.style.top = y + 'px'; 
	divObj.style.width = w + 'px'; 
	divObj.style.height = h + 'px';
	divObj.style.clip = 'rect(0,'+w+'px,'+h+'px,0)';
	divObj.style.overflow = 'hidden';
	divObj.style.backgroundColor = color;
	object.appendChild(divObj);
}

function MapInfoWebmkOvQds(object,cx, cy, xl, xr, yt, yb, w, h)
{
	this.MapInfoWebmkDiv(object,xr+cx, yt+cy, w, h);
	this.MapInfoWebmkDiv(object,xr+cx, yb+cy, w, h);
	this.MapInfoWebmkDiv(object,xl+cx, yb+cy, w, h);
	this.MapInfoWebmkDiv(object,xl+cx, yt+cy, w, h);
}

function MapInfoWebmkLin(object, x1, y1, x2, y2)
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
				MapInfoWebmkDiv(object, ox, y, x-ox, 1);
				y += yIncr;
				p += pru;
				ox = x;
			}
			else p += pr;
		}
		MapInfoWebmkDiv(object, ox, y, x2-ox+1, 1);
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
					MapInfoWebmkDiv(object, x++, y, 1, oy-y);
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
			MapInfoWebmkDiv(object, x2, y2, 1, oy-y2);
		}
		else
		{
			while ((dy--) > 0)
			{
				y += yIncr;
				if (p > 0)
				{
					MapInfoWebmkDiv(object, x++, oy, 1, y-oy);
					p += pru;
					oy = y;
				}
				else p += pr;
			}
			MapInfoWebmkDiv(object, x2, oy, 1, y2-oy);
		}
	}
}

function MapInfoWebmkRect(object, x, y, w, h)
{
	var stroke = 1;
	MapInfoWebmkDiv(object, x, y, w, stroke);
	MapInfoWebmkDiv(object, x+w, y, stroke, h);
	MapInfoWebmkDiv(object, x, y+h, w+stroke, stroke);
	MapInfoWebmkDiv(object, x, y+stroke, stroke, h-stroke);
}

function MapInfoWebmkEllipse(object, left, top, width, height)
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
				MapInfoWebmkOvQds(object,cx, cy, -x+0x2, ox+wod, -oy, oy-1+hod, 1, 1);
				MapInfoWebmkOvQds(object,cx, cy, -x+1, x-1+wod, -y-1, y+hod, 1, 1);
			}
			else MapInfoWebmkOvQds(object,cx, cy, -x+1, ox+wod, -oy, oy-h+hod, w, h);
			ox = x;
			oy = y;
		}
		else
		{
			tt -= aa*((y<<1)-0x3);
			st -= (aa<<1)*(--y);
		}
	}
	MapInfoWebmkDiv(object,cx-a, cy-oy, a-ox+1, (oy<<1)+hod);
	MapInfoWebmkDiv(object,cx+ox+wod, cy-oy, a-ox+1, (oy<<1)+hod);
}

function MapInfoWebmkPolyline(object, x, y)
{
	var i = x.length-1; 
	while (i >= 0) {
		MapInfoWebmkLin(object, x[i], y[i], x[--i], y[i]);
	}
}

function MapInfoWebUpdateLine(map, currentPoint)
{
	// Clip the current point based on the size of the image:
	currentPoint.x = Math.max(map.origin.x, Math.min(currentPoint.x, map.origin.x + map.offsetWidth+2));
	currentPoint.y = Math.max(map.origin.y, Math.min(currentPoint.y, map.origin.y + map.offsetHeight+2));
	
	// Set the starting and ending points
	line = document.GetElementById("MapInfoWebEntity");
	line.innerHTML = '';
	var startPoint = map.GetPoint(0);
	MapInfoWebmkLin(line, startPoint.x, startPoint.y, currentPoint.x, currentPoint.y);
}

function MapInfoWebUpdateRectangle(map, startPoint, currentPoint)
{
	var rect = document.getElementById("MapInfoWebEntity");
	if(!rect)
	{	
		// TODO Should we expose line styles at the tool level???
		var rect = MapInfoWebAddElement("DIV", "RubberRect");
		rect.style.position = 'absolute';
		rect.style.visibility = 'visible';
		rect.id = "MapInfoWebEntity";
		
		
		// Set the rect style to the map parent's z-index:
		rect.style.zIndex = map.parentNode.style.zIndex + 200;
		
		// Add the rect to the document body:
		document.body.appendChild(rect);
		rect.style.left = rect.left = startPoint.x;
		rect.style.top = rect.top = startPoint.y;
		
		// Add event handlers for the element
		rect.onmousedown = MapInfoWebRectangleOnMouseDown;
		rect.onmousemove = MapInfoWebRectangleOnMouseMove;
		rect.onmouseup = MapInfoWebRectangleOnMouseUp;

		rect.map = map;
	}
	
	// Convert the start and current points (which are offset by the map) to absolute
	// positions:
	rect.innerHTML = '';
	//startPoint.x += map.origin.x;
	//startPoint.y += map.origin.y;
	//currentPoint.x += map.origin.x;
	//currentPoint.y += map.origin.y;
	

	// Clip the current point based on the size of the image:
	currentPoint.x = Math.max(map.origin.x, Math.min(currentPoint.x, map.origin.x + map.offsetWidth+2));
	currentPoint.y = Math.max(map.origin.y, Math.min(currentPoint.y, map.origin.y + map.offsetHeight+2));
	
	// Set the rect position based on the adjusted start and current points:
	MapInfoWebmkRect(rect, Math.min(startPoint.x, currentPoint.x), Math.min(startPoint.y, currentPoint.y),
					 Math.abs(currentPoint.x - startPoint.x), Math.abs(currentPoint.y - startPoint.y));
}

function MapInfoWebRemoveRectangle(map)
{
	var rect = document.getElementById("MapInfoWebEntity");
	if(rect)
	{
		document.body.removeChild(rect);
	}
}

function MapInfoWebUpdateCircle(map, startPoint, currentPoint)
{
	// TODO Try/catch

	// If a circle VML hasn't been created:
	var circle = document.getElementById("MapInfoWebEntity");
	if(!circle)
	{	
		// TODO Should we expose line styles at the tool level???
		// Create a vml circle with absolute positioning:
		circle = MapInfoWebAddElement("DIV", "RubberCir");
		circle.style.position = "absolute";
		circle.style.visibility = 'visible';
		circle.id = "MapInfoWebEntity";
		
		// Set the rect style to the map parent's z-index:
		circle.style.zIndex = map.parentNode.style.zIndex + 200;
		
		// Add the rect to the document body:
		document.body.appendChild(circle);
		
		// Add event handlers for the element
		circle.onmousedown = MapInfoWebToolOnMouseDown;
		circle.onmousemove = MapInfoWebCircleOnMouseMove;
		circle.onmouseup = MapInfoWebCircleOnMouseUp;
		document.onmousemove = MapInfoWebCircleOnMouseMove;
		document.onmouseup = MapInfoWebCircleOnMouseUp;
		
		circle.map = map;
		document.map = map;
	}

	circle.innerHTML = '';

	// Clip the current point based on the size of the image:
	//currentPoint.x = Math.max(map.origin.x, Math.min(currentPoint.x, map.origin.x + map.offsetWidth+2));
	//currentPoint.y = Math.max(map.origin.y, Math.min(currentPoint.y, map.origin.y + map.offsetHeight+2));

	// Radius is the distance between the center and the current point
	var radius = Math.sqrt(Math.pow((currentPoint.x - startPoint.x), 2) + Math.pow((currentPoint.y - startPoint.y), 2))

	// The left and top are the center minus the radius
	circle.style.left = circle.left = startPoint.x - radius;
	circle.style.top = circle.top = startPoint.y - radius;
	
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
		
	if ( currentTop > map.origin.y )
		clipTop = 'auto';
	else
		clipTop = map.origin.y - currentTop;
			
	if (currentRight > (map.origin.x + map.width)) 
		clipRight = (map.origin.x + map.width) - currentLeft;
	else 
		clipRight =  'auto';
		
	if (currentBottom > (map.origin.y + map.height)) 
		clipBottom = (map.origin.y + map.height) - currentTop;
	else 
		clipBottom =  'auto';
			
	if (currentLeft > map.origin.x) 
		clipLeft = 'auto';
	else 
		clipLeft = map.origin.x - currentLeft;
	
	circle.style.clip = 'rect(' + clipTop + ' ' +  clipRight + ' ' + clipBottom + ' ' + clipLeft +')';
	MapInfoWebmkEllipse(circle, startPoint.x - radius, startPoint.y - radius, radius*2, radius*2);
}

function MapInfoWebUpdatePolygon(map, currentPoint, doPolygon)
{
	// Clip the current point based on the size of the image:
	currentPoint.x = Math.max(map.origin.x, Math.min(currentPoint.x, map.origin.x + map.offsetWidth+2));
	currentPoint.y = Math.max(map.origin.y, Math.min(currentPoint.y, map.origin.y + map.offsetHeight+2));

	// Now set the polylines points collection so that it draws the segments
	// it contains all the previously clicked points + current point (which is moving)
	// + the first point to complete the polygon
	var line = document.getElementById("MapInfoWebEntity");

	var tempX = new Array();
	var tempY = new Array();
	for (i=0; i<map.PointsData.Points.length; i++) {
		var pt = map.PointsData.GetPoint(i);
		tempX[i] = pt.x;
		tempY[i] = pt.y;
	}
	
	tempX[tempX.length]  = currentPoint.x;
	tempY[tempY.length]  = currentPoint.y;
	if (doPolygon) {
		var firstPoint = map.PointsData.GetPoint(0);
		tempX[tempX.length]  = firstPoint.x;
		tempY[tempY.length]  = firstPoint.y;
	}	
	
	line.innerHTML = '';
	MapInfoWebmkPolyline(line, tempX, tempY);
}

// Method to pan the image and clip if goes out of bounds
function MapInfoWebPanImage (map, startPoint, currentPoint)
{
	var clipTop, clipRight, clipBottom, clipLeft;
	var currentLeft, currentTop, currentRight, currentBottom;
	
	// Calculate absolute current coordinates of the image
	currentLeft = map.origin.x + (currentPoint.x - startPoint.x);
	currentTop = map.origin.y + (currentPoint.y - startPoint.y);
	currentRight = currentLeft + map.width;
	currentBottom = currentTop + map.height;
		
	// Check to see if image goes out of bounds, and if so, set the clipping 
	// parameters
	if ( currentTop > map.origin.y )
		clipTop = 0;
	else
		clipTop = map.origin.y - currentTop;
			
	if (currentRight > (map.origin.x + map.width)) 
		clipRight = (map.origin.x + map.width) - currentLeft - map.BorderWidth;
	else 
		clipRight = currentRight - currentLeft - map.BorderWidth;
		
	if (currentBottom > (map.origin.y + map.height)) 
		clipBottom = (map.origin.y + map.height) - currentTop - map.BorderWidth;
	else 
		clipBottom = currentBottom - currentTop - map.BorderWidth;
			
	if (currentLeft > map.origin.x) 
		clipLeft = 0;
	else 
		clipLeft = map.origin.x - currentLeft;

	// Set the map image's style parameters to actually move the image	
	map.style.position = "absolute";
	map.style.left = currentLeft - map.origin.x; 
	map.style.top = currentTop - map.origin.y;	
	map.style.clip = 'rect(' + clipTop + ' ' +  clipRight + ' ' + clipBottom + ' ' + clipLeft +')';
}

//////////////////////////////////////////////////////////////////////////////////////////
// Common methods:

function MapInfoWebGetMapInternal(object)
{
	var map = null;
	if (object.map) {
		map = object.map;
	} else {
		map = object;
	}
	
	return map;
}

//////////////////////////////////////////////////////////////////////////////////////////
// Point Data object methods

// Append the point to points collection
function MapInfoWebAddPoint(x, y)
{
	this.Points[this.Points.length] = new MapInfoWebPoint(x,y);
}

// Get point from points collection
function MapInfoWebGetPoint(indx)
{
	if (this.Points[indx] != null) {
		return new MapInfoWebPoint(this.Points[indx].x, this.Points[indx].y);
	} else {
		return null;
	}
}

// Return the string representation of point collection, The format is "numpts,x y,x y,x y...,x y"
function MapInfoWebGetPointsString(offset)
{
	var pointString = "" + this.Points.length + ",";
	for (i = 0; i < this.Points.length; i++) {
		if (i>0)
		{
			pointString += ","
		}
		if (this.Points[i].y != -99999) {
			pointString += (this.Points[i].x - offset.x) + " " + (this.Points[i].y - offset.y);	
		} else {
			pointString += (this.Points[i].x) + " " + (this.Points[i].y);	
		}
	}
	return pointString;
}

// Return the string representation of point collection, The format is "x,y x,y x,y ... x,y"
function MapInfoWebGetPointsValue(offset)
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

// Create hidden field containing the string representation of points collection
function MapInfoWebCreatePointsField(id)
{
	var theform = document.forms[0];
	var map = document.getElementById(id);
	var pointstring = this.GetPointsString(map.origin);
	MapInfoWebCreateHiddenField(theform, id+"_PointsData", id+"_PointsData", pointstring);
}

// Point data handling object
function MapInfoWebPointsData()
{
	this.Points = new Array();
	this.AddPoint = MapInfoWebAddPoint;
	this.GetPoint = MapInfoWebGetPoint;
	this.GetPointsString = MapInfoWebGetPointsString;
	this.GetPointsValue = MapInfoWebGetPointsValue;
	this.CreatePointsField = MapInfoWebCreatePointsField;
}

//////////////////////////////////////////////////////////////////////////////////////////
// Point methods:

function MapInfoWebPoint(x, y)
{
	this.x = parseInt(x);
	this.y = parseInt(y);
}

//////////////////////////////////////////////////////////////////////////////////////////
// Tool related objects

// Tool object
function MapInfoWebMapTool()
{
	this.Name = "";
	this.Start = "";
	this.Stop = "";
}

// Tools collection belonging to map
function MapInfoWebMapTools()
{
}

//////////////////////////////////////////////////////////////////////////////////////////
// ToolControl methods:

// Toggle the activation of the tool
function MapInfoWebActivateTool(map, toolName, tool)
{
	var v = document.getElementById(tool.parentControl);
	if (v) {
		if (v.attributes['disabled']) {
			if (v.attributes['disabled'].value == 'disabled') return;
		}
	}
	
	// If we clicked on the same tool control which was active then deactivate it and set current tool to invalid one
	// Otherwise, deactivate the current tool control, and activate the other one. And set the current tool to that one.
	// and create hidden field containing the current toolname
	if (map.activeToolControl != null && map.activeToolControl.id == tool.id && map.activeToolControl.active) {
		map.activeToolControl.Deactivate(map.activeToolControl);
		MapInfoWebSetCurrentTool(map.id, "None");
		var _map = MapInfoWebGetMap(map.id);
		_map.style.cursor = null;
	} else {
		if (map.activeToolControl != null) map.activeToolControl.Deactivate(map.activeToolControl);
		map.activeToolControl = tool;
		if(map.activeToolControl != null)	{
			map.activeToolControl.Activate(tool);
		}
		
		// Create hidden field when tool is activated, to handle multiple maps and tool controls on the same page
		MapInfoWebSetCurrentTool(map.id, toolName);
		var _map =MapInfoWebGetMap(map.id);
		var theform = document.forms[0];
		MapInfoWebCreateHiddenField(theform, _map.id + "_CurrentToolName", _map.id + "_CurrentToolName", _map.MapTools.CurrentTool.Name);
		MapInfoWebCreateHiddenField(theform, _map.id + "_ToolControlParent", _map.id + "_ToolControlParent", tool.parentControl);
	} 
}

// Activate the tool by setting the image source to active image
function MapInfoWebToolActivate(tool)
{
	tool.src = tool.activeSrc;
	tool.active = true;
}

// Deactivate the tool by setting the image source to inactive image
function MapInfoWebToolDeactivate(tool)
{
	tool.src = this.inactiveSrc;
	tool.active = false;
}

function MapInfoWebToolOnMouseDown(evt)
{
	map = MapInfoWebGetMapInternal(this);
	map.PointsData.AddPoint(evt.clientX+document.body.scrollLeft, evt.clientY+document.body.scrollTop);
	return false;
}

function MapInfoWebToolOnMouseUp(evt)
{
	
	var map = MapInfoWebGetMapInternal(this);
	map.onmousemove = null;
	if (this.map != null) this.onmousemove = null;

	var theform = document.forms[0];
	
	// Get the current point
	map.PointsData.AddPoint(evt.clientX+document.body.scrollLeft, evt.clientY+document.body.scrollTop);
	
	// Create hidden field for current tool
	MapInfoWebCreateHiddenField(theform, map.id + "_CurrentToolName", map.id + "_CurrentToolName", map.MapTools.CurrentTool.Name);
	
	// Create hidden field for points data
	map.PointsData.CreatePointsField(map.id);
	
	// Create hidden field that will store selectable layers
	MapInfoWebCreateSelectableLayerField(map.parentNode.id);

	// Do the postback
	map.DoPostBack();
}

//////////////////////////////////////////////////////////////////////////////////////////
// ZoomInTool, RectangleSelect methods:

function MapInfoWebRectangleStart(map)
{
	if(!this.started)
	{
		// Set up the point data object
		map.PointsData = new MapInfoWebPointsData();
		
		// Get the absolute map position:
		map.origin = MapInfoWebGetAbsolutePosition(map);
		
		map.onmousedown = MapInfoWebRectangleOnMouseDown;
		map.onmouseup = MapInfoWebRectangleOnMouseUp;

		this.started = true;
		return false;
	}
}

function MapInfoWebRectangleOnMouseDown(evt)
{
	var map = MapInfoWebGetMapInternal(this);
	map.PointsData = new MapInfoWebPointsData();
	map.PointsData.AddPoint(evt.clientX+document.body.scrollLeft, evt.clientY+document.body.scrollTop);
	map.onmousemove = MapInfoWebRectangleOnMouseMove;
	return false;
}

function MapInfoWebRectangleStop(map)
{
	if(this.started)
	{
		map.onmousedown = null;
		map.onmousemove = null;
		map.onmouseup = null;
		this.started = false;
	}
}

function MapInfoWebRectangleOnMouseMove(evt)
{
	var map = MapInfoWebGetMapInternal(this);
	var startPoint = map.PointsData.GetPoint(0);
	if(startPoint != null)
	{
		MapInfoWebUpdateRectangle(map, startPoint, new MapInfoWebPoint(evt.clientX+document.body.scrollLeft, evt.clientY+document.body.scrollTop));
		return false;
	}
}

function MapInfoWebRectangleOnMouseUp(evt)
{
	var map = MapInfoWebGetMapInternal(this);
	map.onmousemove = null;
	if (this.map != null) this.onmousemove = null;

	var theform = document.forms[0];
	
	// Get the current point
	map.PointsData.AddPoint(evt.clientX+document.body.scrollLeft, evt.clientY+document.body.scrollTop);
	if (map.PointsData.Points.length == 2) {
		var fir = map.PointsData.GetPoint(0);
		var sec = map.PointsData.GetPoint(1);
		var dx = map.PointsData.GetPoint(1).x - map.PointsData.GetPoint(0).x;
		var dy = map.PointsData.GetPoint(1).y - map.PointsData.GetPoint(0).y;
		
		if (dx < 0 && dy < 0) {
			map.PointsData.Points.length = 0;
			map.PointsData.AddPoint(sec.x, sec.y);
			map.PointsData.AddPoint(fir.x, fir.y);
		} else if (dx < 0 && dy > 0) {
			map.PointsData.Points.length = 0;
			map.PointsData.AddPoint(sec.x, fir.y);
			map.PointsData.AddPoint(fir.x, sec.y);
		} else if (dx > 0 && dy < 0) {
			map.PointsData.Points.length = 0;
			map.PointsData.AddPoint(fir.x, sec.y);
			map.PointsData.AddPoint(sec.x, fir.y);
		}
	}
	
	// Create hidden field for current tool
	MapInfoWebCreateHiddenField(theform, map.id + "_CurrentToolName", map.id + "_CurrentToolName", map.MapTools.CurrentTool.Name);
	
	// Create hidden field for points data
	map.PointsData.CreatePointsField(map.id);
	
	// Create hidden field that will store selectable layers
	MapInfoWebCreateSelectableLayerField(map.parentNode.id);

	// Do the postback
	map.DoPostBack();
}

//////////////////////////////////////////////////////////////////////////////////////////
// ZoomOutTool, InfoTool methods:

function MapInfoWebPointStart(map)
{
	if(!this.started)
	{
		map.PointsData = new MapInfoWebPointsData();
		// Get the absolute map position:
		map.origin = MapInfoWebGetAbsolutePosition(map);
		
		map.onmouseup = MapInfoWebToolOnMouseUp;
		this.started = true;
	}
}


function MapInfoWebPointStop(map)
{
	if(this.started)
	{
		map.onmouseup = null;
		this.started = false;
	}
}

//////////////////////////////////////////////////////////////////////////////////////////
// PanTool methods:


function MapInfoWebPanStart(map)
{
	if(!this.started)
	{
		map.PointsData = new MapInfoWebPointsData();

		// Get the absolute map position:
		map.origin = MapInfoWebGetAbsolutePosition(map);
		
		map.onmousedown = MapInfoWebPanOnMouseDown;
		map.onmousemove = MapInfoWebPanOnMouseMove;
		map.onmouseup = MapInfoWebToolOnMouseUp;
		this.started = true;
	}
}

function MapInfoWebPanStop(map)
{
	if(this.started)
	{
		map.onmousedown = null;
		map.onmousemove = null;
		map.onmouseup = null;
		this.started = false;
	}
}

function MapInfoWebPanOnMouseDown(evt)
{
	map = MapInfoWebGetMapInternal(this);
	map.parentNode.style.position = 'absolute';
	map.PointsData.AddPoint(evt.clientX+document.body.scrollLeft, evt.clientY+document.body.scrollTop);
	return false;
}

function MapInfoWebPanOnMouseMove(evt)
{
	var map = MapInfoWebGetMapInternal(this);
	if ( map.PointsData != null )
	{
		var startPoint = map.PointsData.GetPoint(0);
		if(startPoint != null)
		{
			MapInfoWebPanImage(map, startPoint, new MapInfoWebPoint(evt.clientX+document.body.scrollLeft, evt.clientY+document.body.scrollTop));
			return false;
		}
	}
}

//////////////////////////////////////////////////////////////////////////////////////////
// RadiusTool methods:

function MapInfoWebCircleStart(map)
{
	if (!this.started)
	{
		// Set up the point data object
		map.PointsData = new MapInfoWebPointsData();
		
		// Get the absolute map position:
		map.origin = MapInfoWebGetAbsolutePosition(map);
		
		map.onmousedown = MapInfoWebToolOnMouseDown;
		map.onmousemove = MapInfoWebCircleOnMouseMove;
		map.onmouseup = MapInfoWebCircleOnMouseUp;
	
		this.started = true;
	}
}

function MapInfoWebCircleStop(map)
{
	if(this.started)
	{
		map.onmousedown = null;
		map.onmousemove = null;
		map.onmouseup = null;
		this.started = false;
	}
}

function MapInfoWebCircleOnMouseMove(evt)
{
	var map = MapInfoWebGetMapInternal(this);
	var startPoint = map.PointsData.GetPoint(0);
	if(startPoint != null)
	{
		MapInfoWebUpdateCircle(map, startPoint, new MapInfoWebPoint(evt.clientX+document.body.scrollLeft, evt.clientY+document.body.scrollTop));
		return false;
	}
}

function MapInfoWebCircleOnMouseUp(evt)
{
	var theform = document.forms[0];
	var map = MapInfoWebGetMapInternal(this);

	map.onmousemove = null;
	if (this.map != null) this.onmousemove = null;

	var endPoint = new MapInfoWebPoint(evt.clientX+document.body.scrollLeft, evt.clientY+document.body.scrollTop);
	// Get the current point
	map.PointsData.AddPoint(endPoint.x, endPoint.y);
	
	var startPoint = map.PointsData.GetPoint(0);

	// The startpoint is the center and radius is the distance
	// between the start point and the end point
	
	var radius = Math.sqrt(Math.pow((endPoint.x - startPoint.x), 2) +
							 Math.pow((endPoint.y - startPoint.y), 2));

	// Add radius to pointData object.  x value of xy pair will contain radius value.  y value will be set to 0;
	map.PointsData.AddPoint(radius, -99999);

	// Create hidden field for current tool
	MapInfoWebCreateHiddenField(theform, map.id + "_CurrentToolName", map.id + "_CurrentToolName", map.MapTools.CurrentTool.Name);
	
	// Create hidden field for points data
	map.PointsData.CreatePointsField(map.id);
	
	// Create hidden field that will store selectable layers
	MapInfoWebCreateSelectableLayerField(map.parentNode.id);

	// Do the postback
	map.DoPostBack();
}

//////////////////////////////////////////////////////////////////////////////////////////
// DistanceTool methods:

function MapInfoWebDistanceStart(map)
{
	if(!this.started)
	{
		map.PointsData = new MapInfoWebPointsData();

		// Get the absolute map position:
		map.origin = MapInfoWebGetAbsolutePosition(map);
		map.doPolygon = false;

		// Add event handlers to map		
		map.onmousemove = MapInfoWebPolygonOnMouseMove;
		map.onclick = MapInfoWebPolygonOnMouseClick;
		map.ondblclick = MapInfoWebPolygonOnDblClick;
		this.started = true;

	}
}

//////////////////////////////////////////////////////////////////////////////////////////
// PolygonSelectionTool methods:

function MapInfoWebPolygonStart(map)
{
	if(!this.started)
	{
		map.PointsData = new MapInfoWebPointsData();

		// Get the absolute map position:
		map.origin = MapInfoWebGetAbsolutePosition(map);
		map.doPolygon = true;

		// Add event handlers to map		
		map.onmousemove = MapInfoWebPolygonOnMouseMove;
		map.onclick = MapInfoWebPolygonOnMouseClick;
		map.ondblclick = MapInfoWebPolygonOnDblClick;
		this.started = true;

	}
}

function MapInfoWebPolygonStop(map)
{
	if(this.started)
	{
		map.onmousemove = null;
		map.onclick = null;
		map.ondblclick = null;
		this.started = false;
	}
}

function MapInfoWebPolygonOnMouseClick(evt)
{
	var theform = document.forms[0];
	var map = MapInfoWebGetMapInternal(this);
	
	// create the vml polyline element
	var line = document.getElementById("MapInfoWebEntity");
	if(!line)
	{	
		// TODO Should we expose line styles at the tool level???
		line = MapInfoWebAddElement("DIV", "RubberPolygon");
		line.style.position = "absolute";
		line.style.visibility = 'visible';
		line.id = "MapInfoWebEntity";
		
		// Set the style to the map parent's z-index:
		line.style.zIndex = map.parentNode.style.zIndex + 200;
		
		// Add to the document body:
		document.body.appendChild(line);
		
		line.activeTool = map.activeTool;
		line.map = map;
		
		// Now set the event handlers for click and dblclick for the div element
		line.onclick = MapInfoWebPolygonOnMouseClick;
		line.onmousemove = MapInfoWebPolygonOnMouseMove;
		line.ondblclick = MapInfoWebPolygonOnDblClick;
		line.map = map;
		
		line.style.left = line.left = evt.clientX+document.body.scrollLeft;
		line.style.top = line.top = evt.clientX+document.body.scrollLeft;
	}
	
	map.PointsData.AddPoint(evt.clientX+document.body.scrollLeft, evt.clientY+document.body.scrollTop);

	return false;
}

function MapInfoWebPolygonOnMouseMove(evt)
{
	var map = MapInfoWebGetMapInternal(this);
	var line = document.getElementById("MapInfoWebEntity");
	if(line)
	{
		MapInfoWebUpdatePolygon(map, new MapInfoWebPoint(evt.clientX+document.body.scrollLeft, evt.clientY+document.body.scrollTop), map.doPolygon);
	}

	return false;

}

function MapInfoWebPolygonOnDblClick(evt)
{
	var map = MapInfoWebGetMapInternal(this);
	map.onmousemove = null;
	if (this.map != null) this.onmousemove = null;
	
	var theform = document.forms[0];

	// Create hidden field for current tool
	MapInfoWebCreateHiddenField(theform, map.id + "_CurrentToolName", map.id + "_CurrentToolName", map.MapTools.CurrentTool.Name);
	
	// Create hidden field for points data
	map.PointsData.CreatePointsField(map.id);
	
	// Create hidden field that will store selectable layers
	MapInfoWebCreateSelectableLayerField(map.parentNode.id);
	
	// Do the postback
	map.DoPostBack();
}