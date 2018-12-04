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

function Command(name, interaction)
{
}
Command.prototype = new IMapXtremeEventHandler();
Command.prototype.constructor = Command;
Command.superclass = IMapXtremeEventHandler.prototype;

Command.prototype.CreateUrl = function()
{
}

Command.prototype.AddParamToUrl = function(param, value)
{
	this.url += "&" + param + "=" + value;
}

Command.prototype.Execute = function()
{
}
Command.prototype.Init = function(name, interaction)
{
	this.name = name;
	if (interaction != null) {
		this.interaction = interaction;
		this.interaction.onComplete = this.eventHandler("Execute");
	}
}

function MapCommand(name, interaction)
{
	if (arguments.length > 0) {
		this.Init(name, interaction);
	}
}
MapCommand.prototype = new Command();
MapCommand.prototype.constructor = MapCommand;
MapCommand.superclass = Command.prototype;
MapCommand.prototype.CreateUrl = function()
{
	var mapImage = this.interaction.element;
	if (!mapImage.mapAlias) mapImage.mapAlias = mapImage.attributes["mapAlias"].value;
	if (!mapImage.exportFormat) mapImage.exportFormat = mapImage.attributes["exportFormat"].value;
	
	this.url = "MapController.ashx?Command="+ this.name + 
					"&Width=" + mapImage.width +
					"&Height=" + mapImage.height +
					"&ExportFormat=" + mapImage.exportFormat +
					"&Ran=" + Math.random();
					
	if (this.interaction.PointsData.NumPoints() > 0) this.AddParamToUrl("Points", this.interaction.PointsData.GetPointsString(mapImage.origin));
	if (mapImage.mapAlias) this.AddParamToUrl("MapAlias", mapImage.mapAlias);
}
MapCommand.prototype.UpdateMap = function()
{
	var mapImage = this.interaction.element;
	
	// Set the source of the image to url to just change the map
	mapImage.style.left = 0;
	mapImage.style.top = 0;
	mapImage.style.clip = 'rect(' + 0 + ' ' +  mapImage.width + ' ' + mapImage.height + ' ' + 0 +')';
	try {
	mapImage.src = this.url;
	} catch(e) { alert("ll"); }
}


MapCommand.prototype.Execute = function()
{
	this.CreateUrl();
	
	this.UpdateMap();
}

function PanCommand(name, interaction)
{
	if (arguments.length > 0) {
		this.Init(name, interaction);
	}
}
PanCommand.prototype = new MapCommand();
PanCommand.prototype.constructor = PanCommand;
PanCommand.superclass = MapCommand.prototype;
PanCommand.prototype.Execute = function()
{
	var mapImage = this.interaction.element;
	
	//This following is a workaround to handle pan redraw issues
	mapImage.style.visibility = "hidden";
	var oldhandler = mapImage.onload;
	mapImage.onload = function (mapImage) {this.style.visibility = ""; this.onload = oldhandler;};
	
	this.CreateUrl();
	// Set the source of the image to url to just change the map
	try {
	mapImage.src = this.url;
	} catch(e) { alert("error"); }
}

// Create XML Http object
function CreateXMLHttp()
{
	var xmlHttp = null;
	if (BrowserType() == IE) {
		xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
	} else if (BrowserType() == NS) {
		xmlHttp = new XMLHttpRequest();
	}
	return xmlHttp;
}

function DistanceCommand(name, interaction)
{
	if (arguments.length > 0) {
		this.Init(name, interaction);
	}
}
DistanceCommand.prototype = new MapCommand();
DistanceCommand.prototype.constructor = DistanceCommand;
DistanceCommand.superclass = MapCommand.prototype;
DistanceCommand.prototype.Execute = function()
{
	this.CreateUrl();
	this.AddParamToUrl("DistanceType", this.distanceType);
	this.AddParamToUrl("DistanceUnit", this.distanceUnit);
	var xmlHttp = CreateXMLHttp();
	xmlHttp.open("GET", this.url, false);
	xmlHttp.send(null);
	this.result = xmlHttp.responseText;
	alert(this.result);
}

function NavigateCommand(name, interaction)
{
	if (arguments.length > 0) {
		this.Init(name, interaction);
	}
	this.Exc = this.eventHandler("Execute");
}
NavigateCommand.prototype = new MapCommand();
NavigateCommand.prototype.constructor = NavigateCommand;
NavigateCommand.superclass = MapCommand.prototype;
NavigateCommand.prototype.Execute = function()
{
	if (this.interaction.element == null) this.interaction.element = FindElement(this.interaction.elementID);
	this.CreateUrl();
	this.AddParamToUrl("Method", this.method);
	this.AddParamToUrl("North", this.north);
	this.AddParamToUrl("East", this.east);
	this.UpdateMap();
}

function ZoomCommand(name, interaction)
{
	if (arguments.length > 0) {
		this.Init(name, interaction);
	}
	this.Exc = this.eventHandler("Execute");
}
ZoomCommand.prototype = new MapCommand();
ZoomCommand.prototype.constructor = ZoomCommand;
ZoomCommand.superclass = MapCommand.prototype;
ZoomCommand.prototype.Execute = function()
{
	if (this.interaction.element == null) this.interaction.element = FindElement(this.interaction.elementID);
	this.CreateUrl();
	this.AddParamToUrl("ZoomLevel", this.zoomLevel);
	this.UpdateMap();
}

function PointSelectionCommand(name, interaction)
{
	if (arguments.length > 0) {
		this.Init(name, interaction);
	}
}
PointSelectionCommand.prototype = new MapCommand();
PointSelectionCommand.prototype.constructor = PointSelectionCommand;
PointSelectionCommand.superclass = MapCommand.prototype;
PointSelectionCommand.prototype.Execute = function()
{
	if (this.interaction.element == null) this.interaction.element = FindElement(this.interaction.elementID);
	this.CreateUrl();
	this.AddParamToUrl("PixelTolerance", this.pixelTolerance);
	this.UpdateMap();
}

function SetOnLoadHandlerToGetMap(mapControlId) {
	// attach function to be executed upon page/dom loading...
	if (BrowserType() == IE) {
		//...for IE, IE has issues with window.onload, using alternate
		// approach of attaching event handler...
		window.attachEvent("onload",function() { GetMap(mapControlId);});
	} else if (BrowserType() == NS) {
		//...for Netscape/Firefox, using an on dom loaded event handler...
		window.addEventListener("load", function() { GetMap(mapControlId);}, false);
	//...others... 
	} else {
		window.onload = GetMap(mapControlId);
	}
}

function GetMap(mapControlId) {
	try {
		var mapImageId = mapControlId + "_Image";
		var mapImage = FindElement(mapImageId);
		if(mapImage) {
			//For situations where percentages (%) are used in the height and width
			// properties of the MapControl (and rendered in the html span and img tags), 
			// for Firefox and Netscape, the pixel dimension of the image object
			// should have been calculated and the heigth and width properties
			// set in the DOM's image object.  For IE, this does not seem to be the case,
			// so the height and width may be 0. See "if" block below.
			var w = mapImage.width;
			var h = mapImage.height;
			var exportFormat = "Gif";
			var url = null;
						
			if (BrowserType() == IE) {
				//If the browser is IE, check if the sizes obtained above are 
				// less than 1 (0, null, nothing),
				// then get height and width in pixels of parent/containing
				// element, namely the SPAN tag, this should have been calculated
				// by IE and the properties set in the style object of SPAN
				if (w < 1) {
					//get width from the SPAN tags "style" property
					w = mapImage.parentElement.style.pixelWidth;
				}
				//get height from the SPAN tags "style" property
				if (h < 1) {
					h = mapImage.parentElement.style.pixelHeight;
				}
				if (!mapImage.mapAlias) {
					mapImage.mapAlias = mapImage.attributes["mapAlias"].value;
				}
				if (!mapImage.exportFormat) {
					mapImage.exportFormat = mapImage.attributes["exportFormat"].value;
					exportFormat = mapImage.exportFormat;
				}
			}
			
			//...set the size of the image object to proper pixel dimensions...
			mapImage.width = w;
			mapImage.height = h;

			//...set the image source to a new URL to get a new map image
			// of the proper pixel dimensions
			url = "MapController.ashx?Command=GetMap" + 
				"&Width=" + w +
				"&Height=" + h +
				"&ExportFormat=" + exportFormat + 
				"&Ran=" + Math.random();
				
			//If the map has an alias defined, append it to the url
			if (mapImage.mapAlias) {
				url += "&MapAlias=" + mapImage.mapAlias;
			}
			mapImage.style.left = 0;
			mapImage.style.top = 0;
			mapImage.style.clip = 'rect(' + 0 + ' ' + w + ' ' + h + ' ' + 0 +')';
			
			//Set the image object src attribute to the url to get a new map image
			mapImage.src = url;
		} else {
			alert("Image '" + mapImageId + "' could not be found on page");	
		}
	} catch (e) {
		alert("Execption in 'GetMap' function (Command.js)");
	}
}
