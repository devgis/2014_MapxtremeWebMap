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
// Javascript client side drawing code for Microsoft Internet Explorer 

function MapInfoWebLog(msg)
{
	var t = document.getElementById("t1");
	if (t != null) {
		t.value = msg;
	}
}

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
	if (_map != null && _map.MapTools != null) {
		if (_map.MapTools.CurrentTool != null) {
			_map.MapTools.CurrentTool.Stop(_map);
		}
		for (i = 0; i < _map.MapTools.Tools.length; i++) {
			var tool = _map.MapTools.Tools[i];
			if (tool != null) {
				if (toolName == tool.Name) {
					_map.MapTools.CurrentTool = tool;
					_map.style.cursor = tool.cursorUrl;
					tool.Start(_map);
				}
			}
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

//////////////////////////////////////////////////////////////////////////////////////////
// DHTML related methods:

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

//////////////////////////////////////////////////////////////////////////////////////////
// VML related methods:

function MapInfoWebEnableVML()
{
	document.namespaces.add("v", "urn:schemas-microsoft-com:vml")
	if(document.styleSheets.length < 1)
	{
	var oStyleEl = document.createElement("style");
	document.body.appendChild(oStyleEl);
	}
	document.styleSheets.item(0).addRule("v\\:*", "behavior:url(#default#VML)");
}

function MapInfoWebUpdateRectangle(map, startPoint, currentPoint)
{
	// TODO Try/catch

	// If a rectangle VML hasn't been created:
	var rect = document.getElementById("MapInfoWebEntity");
	if(!rect) {	
		MapInfoWebEnableVML();
		// TODO Should we expose line styles at the tool level???
		// Create a vml rect with absolute positioning:
		var rect = document.createElement("<v:rect/>");
		rect.id = "MapInfoWebEntity";
		rect.style.position = "absolute";
		rect.style.visibility = 'visible';
		// Set the rect style to the map parent's z-index:
		rect.style.zIndex = map.parentElement.style.zIndex + 200;
		
		// Create a fill with no opacity:
		var fill = document.createElement("<v:fill opacity=0.40></v:fill>");
		
		// Create a dashed stroke:
		var stroke = document.createElement("<v:stroke dashstyle='solid'></v:fill>");
		
		// Add the rect to the document body:
		document.body.appendChild(rect);
		
		// Add the stroke and fill to the rect:
		rect.appendChild(fill);		
		rect.appendChild(stroke);		
	}
	
	// Clip the current point based on the size of the image:
	currentPoint.x = Math.max(map.origin.x, Math.min(currentPoint.x, map.origin.x + map.offsetWidth+2));
	currentPoint.y = Math.max(map.origin.y, Math.min(currentPoint.y, map.origin.y + map.offsetHeight+2));
	
	// Set the rect position based on the adjusted start and current points:
	rect.style.top = Math.min(startPoint.y, currentPoint.y);
	rect.style.left = Math.min(startPoint.x, currentPoint.x);
	rect.style.width = Math.abs(currentPoint.x - startPoint.x);
	rect.style.height =  Math.abs(currentPoint.y - startPoint.y);
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

function MapInfoWebUpdateCircle(map, startPoint, currentPoint)
{
	// TODO Try/catch

	// If a circle VML hasn't been created:
	var circle = document.getElementById("MapInfoWebEntity");
	if(!circle)
	{	
		MapInfoWebEnableVML();
		// TODO Should we expose line styles at the tool level???
		// Create a vml circle with absolute positioning:
		circle = document.createElement("<v:arc startangle='0' endangle='360'/>");
		circle.style.position = "absolute";
		circle.style.visibility = 'visible';
		circle.id = "MapInfoWebEntity";
		
		// Set the rect style to the map parent's z-index:
		circle.style.zIndex = map.parentElement.style.zIndex + 200;
		
		// Create a fill with no opacity:
		var fill = document.createElement("<v:fill opacity=0.40></v:fill>");
		
		// Create a dashed stroke:
		var stroke = document.createElement("<v:stroke dashstyle='solid'></v:fill>");
		
		// Add the rect to the document body:
		document.body.appendChild(circle);
		
		// Add the stroke and fill to the rect:
		circle.appendChild(fill);		
		circle.appendChild(stroke);
		
	}

	// Clip the current point based on the size of the image:
	currentPoint.x = Math.max(map.origin.x, Math.min(currentPoint.x, map.origin.x + map.offsetWidth+2));
	currentPoint.y = Math.max(map.origin.y, Math.min(currentPoint.y, map.origin.y + map.offsetHeight+2));

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
		
	if ( currentTop > map.origin.y )
		clipTop = 'auto';
	else
		clipTop = map.origin.y - currentTop;
			
	if (currentRight > (map.origin.x + map.width)) 
		clipRight = (map.origin.x + map.width) - currentLeft;
	else 
		clipRight = 'auto';
		
	if (currentBottom > (map.origin.y + map.height)) 
		clipBottom = (map.origin.y + map.height) - currentTop;
	else 
		clipBottom = 'auto';
			
	if (currentLeft > map.origin.x) 
		clipLeft ='auto';
	else 
		clipLeft = map.origin.x - currentLeft;
	
	circle.style.clip = 'rect(' + clipTop + ' ' +  clipRight + ' ' + clipBottom + ' ' + clipLeft +')';
}

function MapInfoWebUpdatePolygon(map, currentPoint, doPolygon)
{
	var line = document.getElementById("MapInfoWebEntity");

	// Clip the current point based on the size of the image:
	currentPoint.x = Math.max(map.origin.x, Math.min(currentPoint.x, map.origin.x + map.offsetWidth+2));
	currentPoint.y = Math.max(map.origin.y, Math.min(currentPoint.y, map.origin.y + map.offsetHeight+2));

	// Now set the polylines points collection so that it draws the segments
	// it contains all the previously clicked points + current point (which is moving)
	// + the first point to complete the polygon
	var offset = line.lineOffset;
	currentPoint.x = currentPoint.x - offset.x;
	currentPoint.y = currentPoint.y - offset.y;
	if (doPolygon) {
		firstPoint = map.PointsData.GetPoint(0);
		firstPoint.x = firstPoint.x - offset.x;
		firstPoint.y = firstPoint.y - offset.y;
		line.points.value = map.PointsData.GetPointsValue(offset) + 
				" " + currentPoint.x + "," + currentPoint.y + " " +
				firstPoint.x + "," + firstPoint.y;
	} else {
		line.points.value = map.PointsData.GetPointsValue(offset) + 
				" " + currentPoint.x + "," + currentPoint.y;
	}
}
//////////////////////////////////////////////////////////////////////////////////////////
// Common methods:

// if 
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
		// In case of radius tool the third point is radius, -99999 we don't want to offset it.
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
function MapInfoWebActivateTool (map, toolName, tool)
{
	if (tool.parentElement.parentElement.disabled) return;
	
	// If we clicked on the same tool control which was active then deactivate it and set current tool to invalid one
	// Otherwise, deactivate the current tool control, and activate the other one. And set the current tool to that one.
	// and create hidden field containing the current toolname
	if (map.activeToolControl != null && map.activeToolControl.id == tool.id && map.activeToolControl.active) {
		map.activeToolControl.Deactivate( map.activeToolControl);
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
		_map.style.cursor = tool.cursorUrl;
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

function MapInfoWebToolOnMouseDown()
{
	this.PointsData.AddPoint(event.x+document.body.scrollLeft, event.y+document.body.scrollTop);
	return false;
}

function MapInfoWebToolOnMouseUp()
{
	var theform = document.forms[0];
	
	// Get the current point
	this.PointsData.AddPoint(event.x+document.body.scrollLeft, event.y+document.body.scrollTop);
	
	// Create hidden field for current tool
	MapInfoWebCreateHiddenField(theform, this.id + "_CurrentToolName", this.id + "_CurrentToolName", this.MapTools.CurrentTool.Name);
	
	// Create hidden field for points data
	this.PointsData.CreatePointsField(this.id);
	
	// Create hidden field that will store selectable layers
	MapInfoWebCreateSelectableLayerField(this.parentElement.id);

	// Do the postback
	this.DoPostBack();
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
		
		map.onmousedown = MapInfoWebToolOnMouseDown;
		map.onmousemove = MapInfoWebRectangleOnMouseMove;
		map.onmouseup = MapInfoWebRectangleOnMouseUp;

		this.started = true;
	}
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

function MapInfoWebRectangleOnMouseMove()
{
	var startPoint = this.PointsData.GetPoint(0);
	if(window.event.button == 1 &&  startPoint != null)
	{
		MapInfoWebUpdateRectangle(this, startPoint, new MapInfoWebPoint(event.x+document.body.scrollLeft, event.y+document.body.scrollTop));
		return false;
	}
}

function MapInfoWebRectangleOnMouseUp()
{
	var theform = document.forms[0];
	
	// Get the current point
	this.PointsData.AddPoint(event.x+document.body.scrollLeft, event.y+document.body.scrollTop);
	if (this.PointsData.Points.length == 2) {
		var fir = this.PointsData.GetPoint(0);
		var sec = this.PointsData.GetPoint(1);
		var dx = this.PointsData.GetPoint(1).x - this.PointsData.GetPoint(0).x;
		var dy = this.PointsData.GetPoint(1).y - this.PointsData.GetPoint(0).y;
		
		if (dx < 0 && dy < 0) {
			this.PointsData.Points.length = 0;
			this.PointsData.AddPoint(sec.x, sec.y);
			this.PointsData.AddPoint(fir.x, fir.y);
		} else if (dx < 0 && dy > 0) {
			this.PointsData.Points.length = 0;
			this.PointsData.AddPoint(sec.x, fir.y);
			this.PointsData.AddPoint(fir.x, sec.y);
		} else if (dx > 0 && dy < 0) {
			this.PointsData.Points.length = 0;
			this.PointsData.AddPoint(fir.x, sec.y);
			this.PointsData.AddPoint(sec.x, fir.y);
		}
	}
	
	// Create hidden field for current tool
	MapInfoWebCreateHiddenField(theform, this.id + "_CurrentToolName", this.id + "_CurrentToolName", this.MapTools.CurrentTool.Name);
	
	// Create hidden field for points data
	this.PointsData.CreatePointsField(this.id);
	
	// Create hidden field that will store selectable layers
	MapInfoWebCreateSelectableLayerField(this.parentElement.id);

	// Do the postback
	this.DoPostBack();
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

function MapInfoWebPanOnMouseDown()
{
	this.parentElement.style.position = 'absolute';
	this.PointsData = new MapInfoWebPointsData();
	this.PointsData.AddPoint(event.x+document.body.scrollLeft, event.y+document.body.scrollTop);
	return false;
}

function MapInfoWebPanOnMouseMove()
{
	if ( this.PointsData != null )
	{
		var startPoint = this.PointsData.GetPoint(0);
		if(window.event.button == 1 &&  startPoint != null)
		{
			MapInfoWebPanImage(this, startPoint, new MapInfoWebPoint(event.x+document.body.scrollLeft, event.y+document.body.scrollTop));
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

function MapInfoWebCircleOnMouseMove()
{
	var startPoint = this.PointsData.GetPoint(0);
	if(window.event.button == 1 &&  startPoint != null)
	{
		MapInfoWebUpdateCircle(this, startPoint, new MapInfoWebPoint(event.x+document.body.scrollLeft, event.y+document.body.scrollTop));
		return false;
	}
}

function MapInfoWebCircleOnMouseUp()
{
	var theform = document.forms[0];
	
	var endPoint = new MapInfoWebPoint(event.x+document.body.scrollLeft, event.y+document.body.scrollTop);
	// Get the current point
	this.PointsData.AddPoint(endPoint.x, endPoint.y);
	
	var startPoint = this.PointsData.GetPoint(0);

	// The startpoint is the center and radius is the distance
	// between the start point and the end point
	
	var radius = Math.sqrt(Math.pow((endPoint.x - startPoint.x), 2) +
							 Math.pow((endPoint.y - startPoint.y), 2));

	// Add radius to pointData object.  x value of xy pair will contain radius value.  y value will be set to 0;
	this.PointsData.AddPoint(radius, -99999);

	// Create hidden field for current tool
	MapInfoWebCreateHiddenField(theform, this.id + "_CurrentToolName", this.id + "_CurrentToolName", this.MapTools.CurrentTool.Name);
	
	// Create hidden field for points data
	this.PointsData.CreatePointsField(this.id);
	
	// Create hidden field that will store selectable layers
	MapInfoWebCreateSelectableLayerField(this.parentElement.id);

	// Do the postback
	this.DoPostBack();
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

function MapInfoWebPolygonOnMouseClick()
{
	var map = MapInfoWebGetMapInternal(this);
	var line = document.getElementById("MapInfoWebEntity");
	// create the vml polyline element		
	if(!line)
	{
		MapInfoWebEnableVML();
		// TODO Should we expose line styles at the tool level???
		// Create a vml polyline with absolute positioning:
		line = document.createElement("<v:polyline points=\"0,0\"/>");
		line.style.position = "absolute";
		line.style.visibility = "visible";
		line.id = "MapInfoWebEntity";
		
		// Set the style to the map parent's z-index:
		line.style.zIndex = map.parentElement.style.zIndex + 200;
		
		// Create a fill with no opacity:
		if (map.doPolygon == true) {
			var fill = document.createElement("<v:fill opacity=0.40></v:fill>");
		} else {
			var fill = document.createElement("<v:fill opacity=0.00></v:fill>");
		}
		
		// Create a dashed stroke:
		var stroke = document.createElement("<v:stroke dashstyle='solid'></v:fill>");
		
		// Add to the document body:
		document.body.appendChild(line);
		
		// Add the stroke and fill to the polyline:
		line.appendChild(fill);		
		line.appendChild(stroke);
		
		// Now add the event handlers for this line which point to event handlers of the map
		// the reason for doing this is when a closed vml shape is formed, any mouse activities
		// within that closed shaped become events for that vml entity not map
		line.onmousemove = MapInfoWebPolygonOnMouseMove;
		line.onclick = MapInfoWebPolygonOnMouseClick;
		line.ondblclick = MapInfoWebPolygonOnDblClick;
		line.activeTool = map.activeTool;
		line.map = map;

		// Store the offset of the polyline we just inserted		
		line.lineOffset = new MapInfoWebPoint(line.offsetLeft, line.offsetTop);
	}
	
	map.PointsData.AddPoint(event.x+document.body.scrollLeft, event.y+document.body.scrollTop);

	return false;
}

function MapInfoWebPolygonOnMouseMove()
{
	var map = MapInfoWebGetMapInternal(this);
	var line = document.getElementById("MapInfoWebEntity");
	if(line)
	{
		MapInfoWebUpdatePolygon(map, new MapInfoWebPoint(event.x+document.body.scrollLeft, event.y+document.body.scrollTop), map.doPolygon);
	}

	return false;

}

function MapInfoWebPolygonOnDblClick()
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
	MapInfoWebCreateSelectableLayerField(map.parentElement.id);

	// Do the postback
	map.DoPostBack();
}