<%@ Page Language="C#" AutoEventWireup="true" CodeFile="AddUser.aspx.cs" Inherits="AddUser" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<HEAD runat="server">
		<title>用户管理</title>
		<meta content="Microsoft Visual Studio 7.0" name="GENERATOR">
		<meta content="C#" name="CODE_LANGUAGE">
		<meta content="JavaScript" name="vs_defaultClientScript">
		<meta content="http://schemas.microsoft.com/intellisense/ie5" name="vs_targetSchema">
		<LINK href="../../Css/ASPNET2BaseCss.css" type="text/css" rel="stylesheet">
	</HEAD>
	<body leftMargin="0" topMargin="0">
		<form id="Form1" method="post" runat="server">
			<table border="0" cellpadding="0" cellspacing="0" style="BORDER-COLLAPSE: collapse" bordercolor="#111111"
				width="100%" height="1">
				<tr height="30">
					<td width="3%" bgcolor="#c0d9e6" class="GbText" background="../../Images/treetopbg.jpg"><font color="#006699" size="3"><img src="../../Images/moduleheaher.gif" width="16" height="16"></font></td>
					<td bgcolor="#c0d9e6" class="GbText" background="../../Images/treetopbg.jpg"><b>添加用户</b></td>
				</tr>
			</table>
			<TABLE class="GbText" style="BORDER-COLLAPSE: collapse" borderColor="#93bee2" cellSpacing="0"
				cellPadding="0" width="100%" border="1">
				<TR height="30">
					<TD align="right" width="150"><asp:label id="lblLReceiver" runat="server" Width="93px">用户名称</asp:label><FONT face="宋体">:</FONT></TD>
					<TD align="left"><FONT face="宋体">&nbsp;</FONT>
						<asp:textbox id="UserName" runat="server" Width="150px" CssClass="InputCss"></asp:textbox>
						<asp:RequiredFieldValidator id="rfN" runat="server" ErrorMessage="用户名称不能为空！" ControlToValidate="UserName"></asp:RequiredFieldValidator></TD>
				</TR>
				<TR height="30">
					<TD align="right" width="150"><asp:label id="lblAdditionalNo" runat="server">用户密码</asp:label><FONT face="宋体">:</FONT></TD>
					<TD align="left"><FONT face="宋体">&nbsp;</FONT>
						<asp:textbox id="Password" runat="server" Width="150px" CssClass="InputCss" TextMode="Password"></asp:textbox>
						<asp:RequiredFieldValidator id="rfP" runat="server" ErrorMessage="密码不能为空！" ControlToValidate="Password"></asp:RequiredFieldValidator></TD>
				</TR>
				<TR height="30">
					<TD align="right" width="150"><asp:label id="Label1" runat="server">确认密码</asp:label><FONT face="宋体">:</FONT></TD>
					<TD align="left"><FONT face="宋体">&nbsp;</FONT>
						<asp:textbox id="PasswordStr" runat="server" Width="150px" CssClass="InputCss" TextMode="Password"></asp:textbox>
						<asp:CompareValidator id="cvP" runat="server" ErrorMessage="两次输入的密码不相等！" ControlToValidate="PasswordStr"
							ControlToCompare="Password"></asp:CompareValidator></TD>
				</TR>
				<TR height="30">
					<TD align="right" width="150"><asp:label id="Label3" runat="server" Width="93px">电子邮件</asp:label><FONT face="宋体">:</FONT></TD>
					<TD align="left"><FONT face="宋体">&nbsp;</FONT>
						<asp:textbox id="Email" runat="server" Width="150px" CssClass="InputCss"></asp:textbox>
						<asp:RequiredFieldValidator id="rfE" runat="server" ErrorMessage="电子邮件不能为空！" ControlToValidate="Email" Display="Dynamic"></asp:RequiredFieldValidator>&nbsp;
                        <asp:RegularExpressionValidator ID="reE" runat="server" ControlToValidate="Email"
                            ErrorMessage="电子邮件格式不正确！" ValidationExpression="\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*"></asp:RegularExpressionValidator></TD>
				</TR>
				<TR height="30">
					<TD align="right" width="150"><asp:label id="Label2" runat="server">用户角色</asp:label><FONT face="宋体">:</FONT></TD>
					<TD align="left"><FONT face="宋体">&nbsp;</FONT>
						<asp:dropdownlist id="RoleList" runat="server" Width="150px" CssClass="SelectSta">							
                            <asp:ListItem>管理员</asp:ListItem>
                            <asp:ListItem>普通</asp:ListItem>
						</asp:dropdownlist></TD>
				</TR>
				<TR height="30">
					<TD align="right" width="150">&nbsp;</TD>
					<TD align="left"><FONT face="宋体">&nbsp;</FONT><asp:button id="AddBtn" runat="server" Width="100px" CssClass="ButtonCss" Text="添      加" OnClick="AddBtn_Click"></asp:button><FONT face="宋体">&nbsp;&nbsp;&nbsp;
						</FONT>
						<asp:button id="ReturnBtn" runat="server" Width="100px" CssClass="ButtonCss" Text="返      回"
							CausesValidation="False" OnClick="ReturnBtn_Click"></asp:button></TD>
				</TR>
			</TABLE>
		</form>
	</body>
</HTML>
