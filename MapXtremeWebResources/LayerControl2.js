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

function toggle2(node) {

    var nextDIV = node.nextSibling;

    while(nextDIV.nodeName != "DIV") {
    nextDIV = nextDIV.nextSibling;
    }

    if (nextDIV.style.display == 'none') {

    if (node.childNodes.length > 0) {

        if (node.childNodes.item(0).nodeName == "IMG") {
        node.childNodes.item(0).src = getImgDirectory(node.childNodes.item(0).src) + "minus.gif";
        }
    }
    nextDIV.style.display = 'block';
    }
    else {

    if (node.childNodes.length > 0) {
        if (node.childNodes.item(0).nodeName == "IMG") {
            node.childNodes.item(0).src = getImgDirectory(node.childNodes.item(0).src) + "plus.gif";
        }
    }
    nextDIV.style.display = 'none';
    }
}

function getImgDirectory(source) {
    return source.substring(0, source.lastIndexOf('/') + 1);
}

function selectLeaf(title, url) {
    alert("You just clicked on title = " + title + ":: url = " + url);
}

// Due to problems in setting outerhtml in NetScape/FireFox this is required
function SetOuterHTML(doc, ele, html)
{
	if (BrowserType() == NS) {
		var range = doc.createRange();
		range.setStartBefore(ele);
		var frag = range.createContextualFragment(html);
		ele.parentNode.replaceChild(frag, ele);
	} else {
		ele.outerHTML = html;
	}
}

function IMapXtremeEventHandler()
{
}

IMapXtremeEventHandler.prototype.layerEventHandler=function(a){
		var b=this;
		b=b;
		return function() 
		{
			if (a != null) return b[a]();
		}
	}

function LayerInfo(uniqueID, mapControlID, resourcePath, xsltFile)
{
	this.uniqueID = uniqueID;
	this.mapControlID = mapControlID;
	this.resourcePath = resourcePath;
	this.xsltFile = xsltFile;
	window.onload = this.layerEventHandler("UpdateLayerHTML");
}
LayerInfo.prototype = new IMapXtremeEventHandler();
LayerInfo.prototype.constructor = LayerInfo;
LayerInfo.superclass = IMapXtremeEventHandler.prototype;

LayerInfo.prototype.UpdateLayerHTML = function()
{
	this.mapImage = FindElement(this.mapControlID+"_Image");
	if (!this.mapImage.mapAlias) this.mapImage.mapAlias = this.mapImage.attributes["mapAlias"].value;
	if (!this.mapImage.exportFormat) this.mapImage.exportFormat = this.mapImage.attributes["exportFormat"].value;
	this.mapImage.onload = this.layerEventHandler("UpdateLayerHTML");
	
	this.mapAlias = this.mapImage.mapAlias;
	var me = document.getElementById(this.uniqueID);
	
	var url = "LayerController.ashx?Command=GetHTML"+
					"&UniqueID=" + this.uniqueID +
					"&MapAlias=" + this.mapAlias +
					"&XsltFile=" + this.xsltFile +
					"&R=" + Math.random();
	var xmlHttp = CreateXMLHttp();
	xmlHttp.open("POST", url, false);
	xmlHttp.send(this.resourcePath);
	var layerHTML = xmlHttp.responseText;
	me.innerHTML = layerHTML;
	
//	SetOuterHTML(document, me, layerHTML);
//	me.id = this.uniqueID+"_div";
}

function ApplyChanges(obj, uniqueID, command)
{
	if (!obj.layerAlias) obj.layerAlias = obj.attributes["layerAlias"].value;
	if (!obj.layerType) obj.layerType = obj.attributes["layerType"].value;
	
	var me = eval(uniqueID + "LayerInfo");
	var url = "MapController.ashx?Command="+ command + 
					"&MapAlias=" + me.mapAlias +
					"&LayerAlias=" + obj.layerAlias +
					"&LayerType=" + obj.layerType +
					"&Visible=" + obj.checked +
					"&Width=" +me.mapImage.width +
					"&Height=" + me.mapImage.height +
					"&ExportFormat=" + me.mapImage.exportFormat +
					"&Left=0"+
					"&Top=0"+
					"&Right="+ me.mapImage.width +
					"&Bottom="+ me.mapImage.height +
					"&R=" + Math.random();

	me.mapImage.src = url;
}

function SelectedNodeChanged(node, name, code, lyrCntrlID, mapid, lyrid)
{
}

function AppendLayerScriptToForm(script)
{
	var scr = document.getElementById('LayerActivationScript');
	if (!scr) scr = document.createElement('script');
	scr.id = 'LayerActivationScript';
	scr.type = 'text/javascript';
	scr.text = script;
	document.forms[0].appendChild(scr);
}