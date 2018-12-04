<%@ Page Language="C#" AutoEventWireup="true" CodeFile="UpdateUserPwd.aspx.cs" Inherits="UpdateUserPwd" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>用户管理</title>
		<meta content="Microsoft Visual Studio 7.0" name="GENERATOR">
		<meta content="C#" name="CODE_LANGUAGE">
		<meta content="JavaScript" name="vs_defaultClientScript">
		<meta content="http://schemas.microsoft.com/intellisense/ie5" name="vs_targetSchema">
		<LINK href="../../Css/ASPNET2BaseCSS.css" type="text/css" rel="stylesheet">
	</HEAD>
	<body leftMargin="0" topMargin="0" MS_POSITIONING="GridLayout">
		<form id="MsgSend" method="post" runat="server">
			<table border="0" cellpadding="0" cellspacing="0" style="BORDER-COLLAPSE: collapse" bordercolor="#111111"
				width="100%" height="1">
				<tr height="30">
					<td width="3%" bgcolor="#c0d9e6" class="GbText" background="../../Images/treetopbg.jpg"><font color="#006699" size="3"><img src="../../Images/moduleheaher.GIF" width="16" height="16"></font></td>
					<td bgcolor="#c0d9e6" class="GbText" background="../../Images/treetopbg.jpg"><b>修改用户密码</b></td>
				</tr>
			</table>
			<TABLE class="GbText" style="BORDER-COLLAPSE: collapse" borderColor="#93bee2" cellSpacing="0"
				cellPadding="0" width="100%" border="1">
				<TR height="30">
					<TD align="right" width="150"><asp:label id="lblLReceiver" runat="server" Width="93px">用户旧密码</asp:label><FONT face="宋体">:</FONT></TD>
					<TD><FONT face="宋体">&nbsp;</FONT>
						<asp:textbox id="PasswordOld" runat="server" Width="150px" CssClass="InputCss" TextMode="Password"></asp:textbox>
						<asp:RequiredFieldValidator id="rfN" runat="server" ErrorMessage="旧密码不能为空！" ControlToValidate="PasswordOld"></asp:RequiredFieldValidator></TD>
				</TR>
				<TR height="30">
					<TD align="right"><asp:label id="lblAdditionalNo" runat="server">用户新密码</asp:label><FONT face="宋体">:</FONT></TD>
					<TD><FONT face="宋体">&nbsp;</FONT>
						<asp:textbox id="Password" runat="server" Width="150px" CssClass="InputCss" TextMode="Password"></asp:textbox>
						<asp:RequiredFieldValidator id="rfP" runat="server" ErrorMessage="新密码不能为空！" ControlToValidate="Password"></asp:RequiredFieldValidator></TD>
				</TR>
				<TR height="30">
					<TD align="right"><asp:label id="Label1" runat="server">确认新密码</asp:label><FONT face="宋体">:</FONT></TD>
					<TD><FONT face="宋体">&nbsp;</FONT>
						<asp:textbox id="PasswordStr" runat="server" Width="150px" CssClass="InputCss" TextMode="Password"></asp:textbox>
						<asp:CompareValidator id="cvP" runat="server" ErrorMessage="两次输入的密码不相等！" ControlToValidate="PasswordStr"
							ControlToCompare="Password"></asp:CompareValidator></TD>
				</TR>
				<TR height="30">
					<TD align="right">&nbsp;</TD>
					<TD><FONT face="宋体">&nbsp;</FONT><asp:button id="UpdateBtn" runat="server" Width="100px" CssClass="ButtonCss" Text="修      改" OnClick="UpdateBtn_Click"></asp:button><FONT face="宋体">&nbsp;&nbsp;&nbsp;
						</FONT>
						<asp:button id="ReturnBtn" runat="server" Width="100px" CssClass="ButtonCss" Text="返      回"
							CausesValidation="False" OnClick="ReturnBtn_Click"></asp:button></TD>
				</TR>
			</TABLE>
		</form>
	</body>
</HTML>
