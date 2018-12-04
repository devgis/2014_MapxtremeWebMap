<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<!--
**
**   Description : STYLESHEET FOR GENERATION OF THE HTML Treeview
**
**   Date : 26/01/2003 - version : 1.2
**   Author : Jean-Michel Garnier, http://rollerjm.free.fr
**   Source is free but feel free (!) to send any comment / suggestion to garnierjm@ifrance.com
**   Updates :
**   - 07/01/2003 : add img-directory parameter
**   - 18/01/2003 : remove deploy-treeview parameter, add XSLT param-isMozilla, refactoring bc of DTD changes
** 
-->
	
	<!-- Change the encoding here if you need it, i.e. UTF-8 -->
	<xsl:output method="html" encoding="iso-8859-1" indent="yes"/>
	
	<!-- ************************************ Parameters ************************************ -->
	<!-- deploy-treeview, boolean - true if you want to deploy the tree-view at the first print -->
	<xsl:param name="param-deploy-treeview" select="'false'"/>
	
	<!-- is the client Netscape / Mozilla or Internet Explorer. Thanks to Bill, 90% of sheeps use Internet Explorer so it will the default value-->	
	<xsl:param name="param-is-netscape" select="'false'"/>

	<!-- hozizontale distance in pixels between a folder and its leaves -->
	<xsl:param name="param-shift-width" select="15"/>
	
	<!-- image source directory-->
	<xsl:param name="param-img-directory" select="/treeview/custom-parameters/param[@name='img-directory']/@value"/>
	
	<!-- hozizontale distance in pixels between a folder and its leaves -->
	<xsl:param name="param-table-width" select="400"/>
	
	<!-- mapalias -->
	<xsl:param name="param-mapzoom" select="/treeview/custom-parameters/param[@name='mapzoom']/@value"/>

	
	<!-- ************************************ Variables ************************************ -->
	<xsl:variable name="var-simple-quote">'</xsl:variable>
	<xsl:variable name="var-slash-quote">\'</xsl:variable>
	
<!--
**
**  Model "treeview"
** 
**  This model transforms an XML treeview into an html treeview
**  
-->
	<xsl:template match="/treeview">
		<link rel="stylesheet" href="{$param-img-directory}treeview.css" type="text/css"/>
		<table width="{$param-table-width}" border="2" cellspacing="0" cellpadding="0">
			<tr>
				<td>
					<table style="BACKGROUND-COLOR:darkblue" border="0" cellspacing="0" cellpadding="0">
						<tr>
							<td style="COLOR:white" width="{$param-table-width}">Treeview2_1</td>
							<td width="{$param-table-width}"></td>
							<td><img src="Treeview2_3/Visible.gif"/></td>
						</tr>
					</table>
				</td>
			</tr>
		  	<tr><td>
		  		<!-- Apply the template folder starting with a depth in the tree of 1-->
				<xsl:apply-templates select="branch">
					<xsl:with-param name="depth" select="1"/>
				</xsl:apply-templates>
			</td></tr>
			<table width = "400" style="BACKGROUND-COLOR:darkblue" border="2" cellspacing="0" cellpadding="0">
				<tr><td><label style="COLOR:white">Treeview2_2</label><input  readonly="true" value = "{$param-mapzoom}"></input></td></tr>
			</table>
		 </table>			
	</xsl:template>

<!--
**
**  Model "branch"
** 
**  This model transforms a branch element. Prints out folders & leafs for the branch.
**  
-->
	<xsl:template match="branch">
		<xsl:param name="depth"/>
		<table border="0" cellspacing="0" cellpadding="0">
			<tr>
				<!-- If first level of depth, do not shift of $param-shift-width-->
				<xsl:if test="$depth>1">
					<td width="{$param-shift-width}"></td>
				</xsl:if>
				
					<xsl:if test="@branchtype='folder'">
						<td>
						<!--
						**
						**  Model "folder"
						** 
						**  This model transforms a folder element. Prints a plus (+) or minus (-)  image, the folder image and a title
						**  
						-->
						<a class="branch">
						<xsl:if test="@code">  				
								<xsl:attribute name="onclick">toggle2(this)</xsl:attribute>
						</xsl:if>
						<xsl:if test="not(@code)">
								<xsl:attribute name="onclick">toggle2(this)</xsl:attribute>
						</xsl:if>
							
						<!-- If the treeview is unfold, the image minus (-) is displayed-->
						<xsl:if test="@expanded">
							<xsl:if test="@expanded='true'">
									<img src="{$param-img-directory}minus.gif"/>
								</xsl:if>
								<!-- plus (+) otherwise-->
							<xsl:if test="@expanded='false'">
								<img src="{$param-img-directory}plus.gif"/>
								</xsl:if>
						</xsl:if>
						<xsl:if test="not(@expanded)">
							<xsl:if test="$param-deploy-treeview = 'true'">
								<img src="{$param-img-directory}minus.gif"/>
							</xsl:if>
							
							<xsl:if test="$param-deploy-treeview = 'false' or not(@expanded)">
								<img src="{$param-img-directory}plus.gif"/>
							</xsl:if>
						</xsl:if>
						
						<img src="{$param-img-directory}{@img}">
							<!-- if the attribut alt is present-->
						<xsl:if test="@alt">
							<!-- if Netscape / Mozilla -->
							<xsl:if test="$param-is-netscape='true'">
								<xsl:attribute name="title"><xsl:value-of select="@alt"/></xsl:attribute>
							</xsl:if>
							<!-- if Internet Explorer -->
							<xsl:if test="$param-is-netscape='false'">
								<xsl:attribute name="alt"><xsl:value-of select="@alt"/></xsl:attribute>
							</xsl:if>								
						</xsl:if>
						</img>
						<xsl:value-of select="@title"/>
						</a>
						<xsl:choose>
							<xsl:when test="@nocheckbox='true'">
							</xsl:when>
							<xsl:otherwise>
								<input type="checkbox">
									<xsl:attribute name="onclick">ApplyChanges(this, '<xsl:value-of select="@uniqueid"/>', 'LayerVisibility')</xsl:attribute>
									<xsl:attribute name="layerAlias"><xsl:value-of select="@alias"/></xsl:attribute>
									<xsl:attribute name="layerType"><xsl:value-of select="@type"/></xsl:attribute>
									<xsl:if test="@visible='false'">
										<xsl:if test="@rangevisible='true'">
											<xsl:attribute name="style">BACKGROUND-COLOR: fuchsia</xsl:attribute>
										</xsl:if>
									</xsl:if>
									<xsl:if test="@visible='true'">
										<xsl:attribute name="checked">checked</xsl:attribute>
									</xsl:if>
								</input>
							</xsl:otherwise>
						</xsl:choose>
			
						<!-- Shall we expand all the leaves of the treeview ? no by default-->
						<div>
							<xsl:if test="@expanded">
								<xsl:if test="@expanded='true'">
										<xsl:attribute name="style">display:block;</xsl:attribute>
									</xsl:if>
									<!-- plus (+) otherwise-->
								<xsl:if test="@expanded='false'">
									<xsl:attribute name="style">display:none;</xsl:attribute>
									</xsl:if>
							</xsl:if>
							
							<xsl:if test="not(@expanded)">
								<xsl:if test="$param-deploy-treeview = 'true'">
									<xsl:attribute name="style">display:block;</xsl:attribute>						
								</xsl:if>
														
								<xsl:if test="$param-deploy-treeview = 'false'">
									<xsl:attribute name="style">display:none;</xsl:attribute>
								</xsl:if>
							</xsl:if>						
							
							<!-- Thanks to the magic of reccursive calls, all the descendants of the present folder are gonna be built -->
								<xsl:apply-templates select="branch">
								<xsl:with-param name="depth" select="$depth+1"/>
							</xsl:apply-templates>
						</div>
						</td>
					</xsl:if> <!-- endif branchtype == folder -->
					<xsl:if test="@branchtype='leaf'">
						<td width="{$param-table-width}">
						<!--
						**
						**  Model "leaf"
						** 
						**  This model prints an image plus the name of the element
						**  
						-->
						<a class="leaf">
							<!-- if it is the last leaf, print a different image for the link to the folder-->
							<xsl:choose>
								<xsl:when test="position()=last()">
									<img src="{$param-img-directory}lastlink.gif"/>
								</xsl:when>
								<xsl:otherwise>
									<img src="{$param-img-directory}link.gif"/>
								</xsl:otherwise>
							</xsl:choose>
							
							<img src="{$param-img-directory}{@img}">
								<!-- if the attribut alt is present-->
								<xsl:if test="@alt">
									<!-- if Netscape / Mozilla -->
									<xsl:if test="$param-is-netscape='true'">
										<xsl:attribute name="title"><xsl:value-of select="@alt"/></xsl:attribute>
									</xsl:if>
									<!-- if Internet Explorer -->
									<xsl:if test="$param-is-netscape='false'">
										<xsl:attribute name="alt"><xsl:value-of select="@alt"/></xsl:attribute>
									</xsl:if>								
								</xsl:if>
							</img>

							<xsl:value-of select="@title"/>
						</a>
							<td>
								<input type="checkbox">
									<xsl:attribute name="onclick">ApplyChanges(this, '<xsl:value-of select="@uniqueid"/>', 'LayerVisibility')</xsl:attribute>
									<xsl:attribute name="layerAlias"><xsl:value-of select="@alias"/></xsl:attribute>
									<xsl:attribute name="layerType"><xsl:value-of select="@type"/></xsl:attribute>
									<xsl:if test="@visible='false'">
										<xsl:if test="@rangevisible='true'">
											<xsl:attribute name="style">BACKGROUND-COLOR: fuchsia</xsl:attribute>
										</xsl:if>
									</xsl:if>
									<xsl:if test="@visible='true'">
										<xsl:attribute name="checked">checked</xsl:attribute>
									</xsl:if>
								</input>
							</td>
						</td>
					</xsl:if> <!-- endif branchtype == leaf -->
			</tr>
	  </table>
	</xsl:template>
	
<!--
**
**  Model "replace-string"
** 
**  reusable replace-string function **  
-->
	<xsl:template name="replace-string">
		<xsl:param name="text"/>
		<xsl:param name="from"/>
		<xsl:param name="to"/>
		<xsl:choose>
			<xsl:when test="contains($text, $from)">
				<xsl:variable name="before" select="substring-before($text, $from)"/>
				<xsl:variable name="after" select="substring-after($text, $from)"/>
				<xsl:variable name="prefix" select="concat($before, $to)"/>
				<xsl:value-of select="$before"/>
				<xsl:value-of select="$to"/>
				<xsl:call-template name="replace-string">
					<xsl:with-param name="text" select="$after"/>
					<xsl:with-param name="from" select="$from"/>
					<xsl:with-param name="to" select="$to"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$text"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	
</xsl:stylesheet>




