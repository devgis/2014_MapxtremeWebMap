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

function MapInfo_Web_UI_WebControls_Map_SetActiveTool(tool)
{
	if(this.activeTool != null)
	{
		this.activeTool.Deactivate(this);
	}
	this.activeTool = tool;
	if(this.activeTool != null)
	{
		this.activeTool.Activate(this);
	}
}

function MapInfoWebAddElement(element, id)
{
	var obj = document.createElement(element);
	obj.id = id;
	return(obj);
}

function MapInfoWebCreateHiddenField(theform, elemID, elemName, elemValue)
{
	var ua = navigator.userAgent.toLowerCase();
	var isIE = ( ua.indexOf("msie") != -1 );

	var elem = document.getElementById(elemID);
	if(elem == null)
	{
		if (isIE)
		{
			elem = document.createElement("<input />");
		} else {
			elem = MapInfoWebAddElement("INPUT", elemID);
		}
		elem.type = "hidden";
		elem.id = elemID;
		elem.name = elemName;
		theform.appendChild(elem);
	}
	elem.value = elemValue;
	return elem;
}

function MapInfoWebSelectLayers(){

}

function MapInfoWebSelectLayer(){
	this.name="";
	this.selectable="true";
}

function MapInfoWebCreateSelectableLayerField(id)
{
	var theform = document.forms[0];
	var sellyrsstring="";
	var atleastone = false;
	var lyrsArray = eval("_selectlayers_"+id);
	for ( i=0;i<lyrsArray.Layers.length;i++ )
	{
		var layer = lyrsArray.Layers[i];
		if (layer.selectable == "True")
		{
			if (atleastone)
			{
				sellyrsstring += ',';
			}
			sellyrsstring += layer.name;
			atleastone = true;
		}
	}
	MapInfoWebCreateHiddenField(theform, id+"_SelLayers", id+"_SelLayers", sellyrsstring);
}
