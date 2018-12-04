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

// Layers collection belonging to map
function MapInfoWebMapLayers()
{
}

// Layer object
function MapInfoWebMapLayer()
{
	this.name="";
	this.visible="";
	this.visiblerangeenabled="";
	this.rangestart="";
	this.rangeend="";
	this.selectable="";
	this.type="";
	this.id="";
	this.alias="";
}

function MapInfoWebUpdateVisible(lyrCntrlID)
{
	if (_curLayer)
	{
		var visElem;
		var selElem;
		if (_curLayer.type == "nonselectable")
		{
			visElem = document.getElementById("chkLblVisible_"+lyrCntrlID);
		} else if (_curLayer.type == "featurelayer")
		{
			visElem = document.getElementById("chkLyrVisible_"+lyrCntrlID);
			selElem = document.getElementById("chkLyrSelectable_"+lyrCntrlID);
		}
		if (visElem.checked == true)
		{
			_curLayer.visible = "True";
			if (selElem)
			{
				selElem.disabled = false;
			}			
		} else {
			_curLayer.visible = "False";
			if (selElem)
			{
				selElem.disabled = true;
			}
		}
		updateLayerArray(lyrCntrlID);
	}
}

function MapInfoWebUpdateZoomDisplay(lyrCntrlID)
{
	if (_curLayer)
	{
		var visrangeElem;
		var rangestartElem;
		var rangeendElem;
		
		if (_curLayer.type == "nonselectable")
		{
			visrangeElem = document.getElementById("chkLblZmRange_"+lyrCntrlID);
			rangestartElem = document.getElementById("lblMinzoom_"+lyrCntrlID);	
			rangeendElem = document.getElementById("lblMaxzoom_"+lyrCntrlID);
		} else if (_curLayer.type == "featurelayer")
		{
			visrangeElem = document.getElementById("chkLyrZmRange_"+lyrCntrlID);
			rangestartElem = document.getElementById("lyrMinzoom_"+lyrCntrlID);	
			rangeendElem = document.getElementById("lyrMaxzoom_"+lyrCntrlID);
		}

		if (visrangeElem.checked == true)
		{
			_curLayer.visiblerangeenabled = "True";
			rangestartElem.disabled = false;
			rangeendElem.disabled = false;
		} else {
			_curLayer.visiblerangeenabled = "False";
			rangestartElem.disabled = true;
			rangeendElem.disabled = true;
		}
		_curLayer.rangestart = rangestartElem.value;
		_curLayer.rangeend = rangeendElem.value;
		updateLayerArray(lyrCntrlID);
	}
}

function MapInfoWebUpdateSelectable(lyrCntrlID, mapid)
{
	if (_curLayer)
	{
		if (_curLayer.type == "featurelayer")
		{
			var lyrsArray = eval("_selectlayers_"+mapid);
			for ( i=0;i<lyrsArray.Layers.length;i++ )
			{
				var layer = lyrsArray.Layers[i];
				if (_curLayer.name == layer.name)
				{
					var selElem = document.getElementById("chkLyrSelectable_"+lyrCntrlID);
					if (selElem.checked == true)
					{
						layer.selectable = "True";
					} else {
						layer.selectable = "False";
					}
				}
			}
		}
	}
}

function MapInfoWebSelectedNodeChanged(node, name, code, lyrCntrlID, mapid, lyrid)
{
	updateNodeStyle(node);
	if (_curElemType == "root")
	{
		var mapzoomElem = document.getElementById("mapzoom_"+lyrCntrlID);
		eval("_map_"+lyrCntrlID).zoom = mapzoomElem.value;
		MapInfoWebUpdateZoomDisplay(lyrCntrlID);
	}
	if (code == "nonselectable")
	{
		if ( setCurrentLayer(lyrid, "nonselectable", lyrCntrlID) )
		{
			var visElem = document.getElementById("chkLblVisible_"+lyrCntrlID);
			var visrangeElem = document.getElementById("chkLblZmRange_"+lyrCntrlID);
			var rangestartElem = document.getElementById("lblMinzoom_"+lyrCntrlID);
			var rangeendElem = document.getElementById("lblMaxzoom_"+lyrCntrlID);

			showPanel("lblsourcepanel", lyrCntrlID);
		}
	} else if (code == "featurelayer")
	{
		if ( setCurrentLayer(lyrid, "featurelayer", lyrCntrlID) )
		{
			var visElem = document.getElementById("chkLyrVisible_"+lyrCntrlID);
			var visrangeElem = document.getElementById("chkLyrZmRange_"+lyrCntrlID);
			var rangestartElem = document.getElementById("lyrMinzoom_"+lyrCntrlID);
			var rangeendElem = document.getElementById("lyrMaxzoom_"+lyrCntrlID);
			var selElem = document.getElementById("chkLyrSelectable_"+lyrCntrlID);

			var lyrsArray = eval("_selectlayers_"+mapid);
			for ( i=0;i<lyrsArray.Layers.length;i++ )
			{
				var layer = lyrsArray.Layers[i];
				if (_curLayer.name == layer.name)
				{
					if (layer.selectable == "True")
					{
						selElem.checked = true;
					} else {
						selElem.checked = false;
					}
				}
				if (_curLayer.visible == "True")
				{
					selElem.disabled = false;
				} else {
					selElem.disabled = true;
				}
			}
			showPanel("ftrlayerpanel", lyrCntrlID);
		}
	}
	if (_curLayer.visible == "True")
	{
		visElem.checked = true;
	} else {
		visElem.checked = false;
	}
	if (_curLayer.visiblerangeenabled == "True")
	{
		visrangeElem.checked = true;
	} else {
		visrangeElem.checked = false;
	}
	if ( visrangeElem.checked == true )
	{
		rangestartElem.disabled = false;
		rangeendElem.disabled = false;
	} else {
		rangestartElem.disabled = true;
		rangeendElem.disabled = true;
	}
	rangestartElem.value = _curLayer.rangestart;
	rangeendElem.value = _curLayer.rangeend;
	_curElemType = "lyrnode";
}

function setCurrentLayer(id, type, lyrCntrlID)
{
	var layer;
	var i;
	var found=false;
	var lyrsArray = eval("_layers_"+lyrCntrlID);
	for ( i=0;i<lyrsArray.Layers.length;i++ )
	{
		layer = lyrsArray.Layers[i];
		if ((layer.id == id) )
		{
			_curLayer = layer;
			found = true;
			break;
		}
	}
	if (found == true)
	{
		return true;
	} else {
		return false;
	}
}

function updateLayerArray(lyrCntrlID)
{
	var layer;
	var i;
	var lyrsArray = eval("_layers_"+lyrCntrlID);
	for ( i=0;i<lyrsArray.Layers.length;i++ )
	{
		layer = lyrsArray.Layers[i];
		if ( (layer.id == _curLayer.id) )
		{
			lyrsArray.Layers[i] = _curLayer;
			break;
		}
	}
}

// Apply changes button onclick handler
function MapInfoWebApplyChanges(lyrCntrlID, mapID)
{
	var mapzoomElem = document.getElementById("mapzoom_"+lyrCntrlID);
	eval("_map_"+lyrCntrlID).zoom = mapzoomElem.value;
	MapInfoWebUpdateZoomDisplay(lyrCntrlID);
	var lyrsArray = eval("_layers_"+lyrCntrlID);
	for ( i=0;i<lyrsArray.Layers.length;i++ )
	{
		var form=document.forms[0];
		var elemID = lyrsArray.Layers[i].id;
		var elemValue = MapInfoWebBuildPropertiesString(lyrsArray.Layers[i], lyrCntrlID);
		MapInfoWebCreateHiddenField(form, elemID, elemID, elemValue);
	}
	MapInfoWebCreateSelectableLayerField(mapID);

	MapInfoWebUpdateEntireGroupZoomDisplay(lyrCntrlID);
	var grpsArray = eval("_groups_"+lyrCntrlID);
	for ( i=0;i<grpsArray.Layers.length;i++ )
	{
		var form=document.forms[0];
		var elemID = grpsArray.Layers[i].alias;
		var elemValue = MapInfoWebBuildGroupsPropertiesString(grpsArray.Layers[i], lyrCntrlID);
		MapInfoWebCreateHiddenField(form, elemID, elemID, elemValue);
	}

	// Write out tree state to hidden field
	elemID = lyrCntrlID+"_TreeStateData";
	elemValue = MapInfoWebBuildTreeState(lyrCntrlID);
	MapInfoWebCreateHiddenField(form, elemID, elemID, elemValue);

	eval("_lyrcntrl_"+lyrCntrlID).DoPostBack();
}

function MapInfoWebBuildPropertiesString(layer, lyrCntrlID){
	var sep = "^";
	var propString;
	propString = eval("_map_"+lyrCntrlID).zoom + sep;
	propString = propString + layer.name + sep;
	propString = propString + layer.type + sep;
	propString = propString + layer.visible + sep;
	propString = propString + layer.visiblerangeenabled + sep;
	propString = propString + layer.rangestart + sep;
	propString = propString + layer.rangeend + sep;
	propString = propString + layer.id;
	return propString;
}

function MapInfoWebBuildGroupsPropertiesString(group, lyrCntrlID){
	var sep = "^";
	var propString;
	propString = group.alias + sep;
	propString = propString + group.allvisible + sep;
	propString = propString + group.visible + sep;
	propString = propString + group.allzoomrange + sep;
	propString = propString + group.visiblerangeenabled + sep;
	propString = propString + group.rangestart + sep;
	propString = propString + group.rangeend + sep;
	return propString;
}

// Map object
function MapInfoWebMap()
{
	this.name="";
	this.zoom="";
}

function MapInfoWebLayerControlPanel()
{
	this.panel="";
}

function MapInfoWebGroupLayers()
{
}

function MapInfoWebGroupLayer()
{
	this.alias="";
	this.allvisible="";
	this.visible="";
	this.allzoomrange="";
	this.visiblerangeenabled="";
	this.rangestart="";
	this.rangeend="";
}

function MapInfoWebUpdateGroupVisible(lyrCntrlID)
{
	if (_curGroupLayer)
	{
		var allvisElem = document.getElementById("chkEntireGrpVisible_"+lyrCntrlID);
		var visElem = document.getElementById("chkGrpVisible_"+lyrCntrlID);
		if (allvisElem.checked == true)
		{
			_curGroupLayer.allvisible = "True";
			visElem.disabled = false;
		} else {
			_curGroupLayer.allvisible = "False";
			visElem.disabled = true;
		}
		if (visElem.checked == true)
		{
			_curGroupLayer.visible = "True";
		} else {
			_curGroupLayer.visible = "False";
		}
		updateGroupLayerArray(lyrCntrlID);
	}
}

function MapInfoWebUpdateEntireGroupZoomDisplay(lyrCntrlID)
{
	if (_curGroupLayer)
	{
		var allvisrangeElem = document.getElementById("chkEntireGrpZoomRanged_"+lyrCntrlID);
		var visrangeElem = document.getElementById("chkGrpLyrZmRange_"+lyrCntrlID);
		var rangestartElem = document.getElementById("grpLyrMinzoom_"+lyrCntrlID);	
		var rangeendElem = document.getElementById("grpLyrMaxzoom_"+lyrCntrlID);

		if (allvisrangeElem.checked == true)
		{
			_curGroupLayer.allzoomrange = "True";
			visrangeElem.disabled = false;
		} else {
			_curGroupLayer.allzoomrange = "False";
			visrangeElem.disabled = true;
		}
		if (visrangeElem.checked == true)
		{
			_curGroupLayer.visiblerangeenabled = "True";
		} else {
			_curGroupLayer.visiblerangeenabled = "False";
		}
		if ( visrangeElem.disabled == true )
		{
			rangestartElem.disabled = true;
			rangeendElem.disabled = true;
		} else {
			if (visrangeElem.checked == true)
			{
				rangestartElem.disabled = false;
				rangeendElem.disabled = false;
			} else {
				rangestartElem.disabled = true;
				rangeendElem.disabled = true;
			}
		}
		_curGroupLayer.rangestart = rangestartElem.value;
		_curGroupLayer.rangeend = rangeendElem.value;
		updateGroupLayerArray(lyrCntrlID);
	}
}

function setGroupPanelElements(lyrCntrlID)
{
	var allvisElem = document.getElementById("chkEntireGrpVisible_"+lyrCntrlID);
	var visElem = document.getElementById("chkGrpVisible_"+lyrCntrlID);
	var allvisrangeElem = document.getElementById("chkEntireGrpZoomRanged_"+lyrCntrlID);
	var visrangeElem = document.getElementById("chkGrpLyrZmRange_"+lyrCntrlID);
	var rangestartElem = document.getElementById("grpLyrMinzoom_"+lyrCntrlID);	
	var rangeendElem = document.getElementById("grpLyrMaxzoom_"+lyrCntrlID);

	if (_curGroupLayer.allvisible == "True")
	{
		allvisElem.checked = true;
		visElem.disabled = false;
	} else {
		allvisElem.checked = false;
		visElem.disabled = true;
	}
	if (_curGroupLayer.visible == "True")
	{
		visElem.checked = true;
	} else {
		visElem.checked = false;
	}
	if (_curGroupLayer.allzoomrange == "True")
	{
		allvisrangeElem.checked = true;
		visrangeElem.disabled = false;
	} else {
		allvisrangeElem.checked = false;
		visrangeElem.disabled = true;
	}
	if (_curGroupLayer.visiblerangeenabled == "True")
	{
		visrangeElem.checked = true;
	} else {
		visrangeElem.checked = false;
	}
	if ( visrangeElem.disabled == true )
	{
		rangestartElem.disabled = true;
		rangeendElem.disabled = true;
	} else {
		if (visrangeElem.checked == true)
		{
			rangestartElem.disabled = false;
			rangeendElem.disabled = false;
		} else {
			rangestartElem.disabled = true;
			rangeendElem.disabled = true;
		}
	}
	rangestartElem.value = _curGroupLayer.rangestart;
	rangeendElem.value = _curGroupLayer.rangeend;
}

function updateGroupLayerArray(lyrCntrlID)
{
	var group;
	var i;
	var grpsArray = eval("_groups_"+lyrCntrlID);
	for ( i=0;i<grpsArray.Layers.length;i++ )
	{
		group = grpsArray.Layers[i];
		if ( (group.alias == _curGroupLayer.alias) )
		{
			grpsArray.Layers[i] = _curGroupLayer;
			break;
		}
	}
}

function setCurrentGroup(alias, lyrCntrlID)
{
	var group;
	var i;
	var found=false;
	var grpsArray = eval("_groups_"+lyrCntrlID);
	for ( i=0;i<grpsArray.Layers.length;i++ )
	{
		group = grpsArray.Layers[i];
		if ((group.alias == alias) )
		{
			_curGroupLayer = group;
			found = true;
			break;
		}
	}
	if (found == true)
	{
		return true;
	} else {
		return false;
	}
}

function MapInfoWebTreeFolders()
{
}

function MapInfoWebTreeFolder()
{
	this.alias="";
	this.expanded="";
}

function MapInfoWebBuildTreeState(lcid)
{
	var propString="";
	var foldersArray = eval("_treeFolders_"+lcid);
	var isFirst = true;
	for ( i=0;i<foldersArray.Folders.length;i++ )
	{
		var folder = foldersArray.Folders[i];
		if ( !isFirst )
		{
			propString = propString + "^";
		}
		propString = propString + folder.alias + "^";
		propString = propString + folder.expanded;
		isFirst = false;
	}
	return propString;
}

// ---------------------------------------------------------------------------
// --- Name:    Easy DHTML Treeview                                         --
// --- Original idea by : D.D. de Kerf                  --
// --- Updated by Jean-Michel Garnier, garnierjm@yahoo.fr                   --
// ---------------------------------------------------------------------------

/*****************************************************************************
Name : toggle
Parameters :  node , DOM element (<a> tag)
Description :     Description, collapse or unfold a branch
Author : Jean-Michel Garnier /  D.D. de Kerf
*****************************************************************************/

function toggle(node, lyrCntrlID, lyrAlias) {
	if (node.className == "branch")
	{
		updateTreeState(node, lyrCntrlID, lyrAlias);
	}
	updateNodeStyle(node);
    // Get the next tag (read the HTML source)
	var nextDIV = node.nextSibling;

	// find the next DIV
	while(nextDIV.nodeName != "DIV") {
		nextDIV = nextDIV.nextSibling;
	}

	// Unfold the branch if it isn't visible
	if (nextDIV.style.display == 'none') {

		// Change the image (if there is an image)
		if (node.childNodes.length > 0) {

			if (node.childNodes.item(0).nodeName == "IMG") {
				node.childNodes.item(0).src = getImgDirectory(node.childNodes.item(0).src) + "minus.gif";
			}
		}

		nextDIV.style.display = 'block';
	}
	// Collapse the branch if it IS visible
	else {

		// Change the image (if there is an image)
		if (node.childNodes.length > 0) {
			if (node.childNodes.item(0).nodeName == "IMG") {
  				node.childNodes.item(0).src = getImgDirectory(node.childNodes.item(0).src) + "plus.gif";
			}
		}
		nextDIV.style.display = 'none';
	}
}

/*****************************************************************************
Name : toggle2
Parameters :  node DOM element (<a> tag), folderCode String
Description :    if you use the "code" attribute in a folder element, toggle2 is called
instead of toggle. The consequence is that you MUST implement a selectFolder function in your page.
Author : Jean-Michel Garnier
*****************************************************************************/
function toggle2(node, folderCode, id, lyrCntrlID, mapid) {
	if (_curElemType == "groupfolder")
	{
		MapInfoWebUpdateGroupVisible(lyrCntrlID);
		MapInfoWebUpdateEntireGroupZoomDisplay(lyrCntrlID);
	} 
	else if (_curElemType == "labelfolder")
	{
		MapInfoWebUpdateVisible(lyrCntrlID);
		MapInfoWebUpdateZoomDisplay(lyrCntrlID);
	}
	else if (_curElemType == "lyrnode")
	{
		MapInfoWebUpdateVisible(lyrCntrlID);
		MapInfoWebUpdateZoomDisplay(lyrCntrlID);
		MapInfoWebUpdateSelectable(lyrCntrlID, mapid);
	}
	if (folderCode == 1)
	{
		var mapzoomElem = document.getElementById("mapzoom_" + lyrCntrlID);
		mapzoomElem.value = eval("_map_"+lyrCntrlID).zoom;
		updateNodeStyle(node);
		showPanel("root", lyrCntrlID)
		_curElemType = "root";
	} 
	else if (folderCode == 2)
	{
		toggle(node, lyrCntrlID, id);
		MapInfoWebSelectedNodeChanged(node, id, "nonselectable", lyrCntrlID, mapid, id);
		_curElemType = "labelfolder";
	} 
	else if (folderCode == 3)
	{
		setCurrentGroup(id, lyrCntrlID);
		setGroupPanelElements(lyrCntrlID);
		toggle(node, lyrCntrlID, id);
		showPanel("grplayerpanel", lyrCntrlID);
		_curElemType = "groupfolder";
	}
	else if (folderCode == 4)
	{
		toggle(node, lyrCntrlID, id);
		MapInfoWebSelectedNodeChanged(node, id, "featurelayer", lyrCntrlID, mapid, id);
		_curElemType = "featurefolder";
	}
}

/*****************************************************************************
Name : getImgDirectory
Parameters : Image source path
Return : Image source Directory
Author : Jean-Michel Garnier
*****************************************************************************/

function getImgDirectory(source) {
    return source.substring(0, source.lastIndexOf('/') + 1);
}

/***********************************************************************
* Tabbed dialog support												   *
************************************************************************/

function showPanel(panel, lyrCntrlID){
	//hide visible panel, show selected panel, set tab
	curPanel = eval("currentPanel_"+lyrCntrlID)
	hidePanel(curPanel.panel);
	document.getElementById(panel + "_" + lyrCntrlID).style.display = 'block';
	document.getElementById('activePanel_'+lyrCntrlID).innerHtml = document.getElementById(panel + "_" + lyrCntrlID).innerHtml
	curPanel.panel = panel + "_" + lyrCntrlID
	//setState(panel);
}
function hidePanel(panelname){
	//hide visible panel, unhilite tab
	document.getElementById(panelname).style.display = 'none';
	//document.getElementById('tab'+currentPanel).style.backgroundColor = '#ffffff';
	//document.getElementById('tab'+currentPanel).style.color = 'navy';
}
function setState(tabNum){
	if(tabNum==currentPanel){
		document.getElementById('tab'+tabNum).style.backgroundColor = '#ddddff';
		document.getElementById('tab'+tabNum).style.color = 'red';
	}else{
		document.getElementById('tab'+tabNum).style.backgroundColor = '#ffffff';
		document.getElementById('tab'+tabNum).style.color = 'navy';
	}
}
function hover(tab){
	tab.style.backgroundColor = 'ddddff';
}

function updateNodeStyle(node){
	if (_curNode)
	{
		_curNode.style.backgroundColor = "";
	} 
	node.style.backgroundColor = "#0066FF";
	_curNode = node;
}

function updateTreeState(node, lcid, lyrAlias){
	var foldersArray = eval("_treeFolders_"+lcid);
	var folder;
	for ( i=0;i<foldersArray.Folders.length;i++ )
	{
		folder = foldersArray.Folders[i];
		if ( folder.alias == lyrAlias )
		{
			break;
		}
	}
	// This function is called as node is toggled.  So if node display is none,
	// it means the folder will be expanded as a result of the calling procedure (toggle)
	var nextDIV = node.nextSibling;

	// find the next DIV
	while(nextDIV.nodeName != "DIV") {
		nextDIV = nextDIV.nextSibling;
	}

	// Unfold the branch if it isn't visible
	if (nextDIV.style.display == 'none') {
		folder.expanded = "true";
	} else {
		folder.expanded = "false";	
	}
}

// Control Validation
//-------------------------------------------------------------------
// isDigit(value)
//   Returns true if value is a 1-character digit
//-------------------------------------------------------------------
function isDigit(num) {
	if (num.length>1)
	{
		return false;
	}
	var validChars="1234567890";
	validChars = validChars + _decimalSeparator
	if (validChars.indexOf(num)!=-1)
	{
		return true;
	}
	return false;
}


function isNumeric(val) {
	for (n = 0; n < val.length; n++)
	{
		if ( ! isDigit(val.charAt(n))) {
			return false;
		}
	}
	return true;	
}

function isLess(val1, val2) {
	return parseFloat(val1) < parseFloat(val2);
}

function isMore(val1, val2) {
	return parseFloat(val1) > parseFloat(val2);
}

function validate(obj, lyrCntrlID)
{
	if (obj.type == "text")
	{
		if (!isNumeric(obj.value))
		{
			alert(validate_numericfield);
			if (obj.id == 'mapzoom_'+ lyrCntrlID)
			{
				obj.value = eval("_map_"+lyrCntrlID).zoom;
				return false;
			}
			if (obj.id == 'lyrMinzoom_'+ lyrCntrlID ||
				obj.id == 'lblMinzoom_'+ lyrCntrlID )
			{
				obj.value = _curLayer.rangestart;
				return false;
			}
			if (obj.id == 'lyrMaxzoom_'+ lyrCntrlID || 
				obj.id == 'lblMaxzoom_'+ lyrCntrlID )
			{
				obj.value = _curLayer.rangeend;
				return false;
			}
		}
		if (obj.id == 'lyrMinzoom_'+ lyrCntrlID)
		{
			var elem = document.getElementById("lyrMaxzoom_"+lyrCntrlID);
			if ( isMore(obj.value, elem.value) )
			{
				alert(validate_mingtrmax);
				obj.value = _curLayer.rangestart;
				return false;
			}
		}
		if (obj.id == 'lblMinzoom_'+ lyrCntrlID)
		{
			var elem = document.getElementById("lblMaxzoom_"+lyrCntrlID);
			if ( isMore(obj.value, elem.value) )
			{
				alert(validate_mingtrmax);
				obj.value = _curLayer.rangestart;
				return false;
			}
		}
		if (obj.id == 'lyrMaxzoom_'+ lyrCntrlID)
		{
			var elem = document.getElementById("lyrMinzoom_"+lyrCntrlID);
			if ( isLess(obj.value, elem.value) )
			{
				alert(validate_maxltmin);
				obj.value = _curLayer.rangeend;
				return false;
			}
		}
		if (obj.id == 'lblMaxzoom_'+ lyrCntrlID)
		{
			var elem = document.getElementById("lblMinzoom_"+lyrCntrlID);
			if ( isLess(obj.value, elem.value) )
			{
				alert(validate_maxltmin);
				obj.value = _curLayer.rangeend;
				return false;
			}
		}
	}
	return true;
}
