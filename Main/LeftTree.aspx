<%@ Page Language="C#" AutoEventWireup="true" CodeFile="LeftTree.aspx.cs" Inherits="LeftTree" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<HTML>
	<HEAD runat="server">
		<title>城市燃气模拟实验管道泄漏事故预警系统</title>
		<meta name="GENERATOR" Content="Microsoft Visual Studio .NET 7.1">
		<meta name="CODE_LANGUAGE" Content="C#">
		<meta name="vs_defaultClientScript" content="JavaScript">
		<meta name="vs_targetSchema" content="http://schemas.microsoft.com/intellisense/ie5">
		<link href="../CSS/ASPNET2BaseCss.css" type="text/css" rel="stylesheet">
		<style>A.linkFooter:link { FONT-WEIGHT: normal; FONT-SIZE: 9px; COLOR: #006699; FONT-FAMILY: Arial, Helvetica, sans-serif; TEXT-DECORATION: none }
	A.linkMenu:link { FONT-WEIGHT: normal; FONT-SIZE: 9pt; COLOR: #006699; FONT-FAMILY: Arial, Helvetica, sans-serif; TEXT-DECORATION: none }
	A.linkMenu:visited { FONT-WEIGHT: normal; FONT-SIZE: 9pt; COLOR: #006699; FONT-FAMILY: Arial, Helvetica, sans-serif; TEXT-DECORATION: none }
	A.linkMenu:active { FONT-WEIGHT: normal; FONT-SIZE: 9pt; COLOR: #ff3300; TEXT-DECORATION: underline }
	A.linkMenu:hover { FONT-WEIGHT: normal; FONT-SIZE: 9pt; COLOR: #ff3300; TEXT-DECORATION: none }
		</style>
	</HEAD>
	<body topmargin="0" leftmargin="0" bgColor="sandybrown" bottomMargin="0">
		<form id="Form1" runat="server" method="post">
			<table width="100%" align="center" bgcolor="#f4a460" height="100%">
				<tr>
					<td width="100%" height="100%" valign="top">
					<asp:TreeView id="LeftTreeView" runat="server" Width="178px" Height="100%" BorderColor="White" BorderWidth="0px" BackColor="SandyBrown" SelectedNodeStyle-ForeColor="ActiveCaption" Font-Bold="False" ImageSet="BulletedList3" ShowLines="True">
                        <SelectedNodeStyle ForeColor="Brown" BackColor="Brown" BorderColor="Maroon" />
                        <RootNodeStyle BorderColor="Maroon" ForeColor="Maroon" />
                        <HoverNodeStyle BorderColor="Green" />
                    </asp:TreeView>
					</td>
				</tr>
			</table>
		</form>
	</body>
</HTML>