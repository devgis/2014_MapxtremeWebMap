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

function Tool (id, interaction, command)
{
	if (arguments.length > 0) {
		this.Init(id, interaction, command);
	}
}
Tool.prototype = new IMapXtremeEventHandler();
Tool.prototype.constructor = Tool;
Tool.superclass = IMapXtremeEventHandler.prototype;

Tool.prototype.Activate = function() 
{
}

Tool.prototype.Deactivate = function()
{
}

Tool.prototype.Init = function(id, interaction, command)
{
	this.id = id;
	this.interaction = interaction;
	this.active = false;
	this.command = command;
	if (this.interaction.onComplete == null) this.interaction.onComplete = this.OnInteractionComplete;
}

Tool.prototype.OnInteractionComplete = function()
{
	this.command.Execute();
}

function ImgTool(id,  interaction, command)
{
	if (arguments.length > 0) {
		this.Init(id, interaction, command);
	}
}
ImgTool.prototype = new Tool();
ImgTool.prototype.constructor = ImgTool;
ImgTool.superclass = Tool.prototype;
ImgTool.prototype.Init = function(id, interaction, command)
{
	ImgTool.superclass.Init.call(this, id, interaction, command);
	this.imgId = this.id + "_Image";
	this.imgElement = document.getElementById(this.imgId);
	this.imgElement.onclick = this.eventHandler("Toggle");
}

ImgTool.prototype.Toggle = function()
{
	if (this.active) {
		this.Deactivate();
	} else {
		this.Activate();
	}
}

ImgTool.prototype.Activate = function()
{
	if (this.interaction.element == null) this.interaction.element = FindElement(this.interaction.elementID);
	if (this.interaction.element != null && this.interaction.element.currentTool) {
		try {
			this.interaction.element.currentTool.Deactivate();
		} catch(e){;}
	}
	this.interaction.InitHandlers();
	this.imgElement.src = this.activeImg;
	this.interaction.element.style.cursor = this.cursorImg;
	this.interaction.element.currentTool = this;
	this.active = true;
	var activeTool = document.getElementById(this.id+"Active");
	if (activeTool) activeTool.value = this.id + "," + this.interaction.element.id;
}

ImgTool.prototype.Deactivate = function()
{
	this.imgElement.src = this.inactiveImg;
	this.active = false;
	this.interaction.element.style.cursor = null;
	this.interaction.DeinitHandlers();
	var activeTool = document.getElementById(this.id+"Active");
	if (activeTool) activeTool.value = "";
}

function AppendScriptToForm(script)
{
	var scr = document.getElementById('ActivationScript');
	if (!scr) scr = document.createElement('script');
	scr.id = 'ActivationScript';
	scr.type = 'text/javascript';
	scr.text = script;
	document.forms[0].appendChild(scr);
}