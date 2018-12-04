<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="Default" %>
<%@ Register TagPrefix="ucTop" TagName="TopBanner" Src="UserControls/TopBanner.ascx" %>
<%@ Register TagPrefix="ucBottom" TagName="BottomBanner" Src="UserControls/BottomBanner.ascx" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">

<HTML xmlns="http://www.w3.org/1999/xhtml" >
	<HEAD>
		<title>城市燃气模拟实验管道泄漏事故预警系统</title>
		<meta name="GENERATOR" Content="Microsoft Visual Studio .NET 7.1">
		<meta name="CODE_LANGUAGE" Content="C#">
		<meta name="vs_defaultClientScript" content="JavaScript">
		<meta name="vs_targetSchema" content="http://schemas.microsoft.com/intellisense/ie5">
		<link href="CSS/ASPNET2WebNormal.css" type="text/css" rel="stylesheet">
	</HEAD>
	<body topmargin="0" bottommargin="0" bgColor="#996600">
		<form id="Form1" method="post" runat="server">
			<table width="780" align="center" border="0" cellpadding="0" cellspacing="0">
				<tr>
					<td><ucTop:TopBanner ID="top" runat="server" /></td>
				</tr>
				<tr valign="top">
					<td height="270" align="center" bgcolor="#ffcc99">
						<table border="0" cellpadding="1" cellspacing="0" width="420" bgcolor="orange">
							<tr>
								<td align="left" height="60" valign="top" colspan="2"><font class="Head">城市燃气模拟实验管道泄漏事故预警系统&nbsp;<br></font>
								</td>
							</tr>
							<tr>
								<td height="33" width="100" align="right"><font class="Normal">用户名：</font></td>
								<td align="left"><asp:TextBox ID="UserName" Runat="server" CssClass="NormalText" Width="150"></asp:TextBox><font color="red" class="Normal">*</font>
									<asp:RequiredFieldValidator id="RFVUserName" runat="server" ErrorMessage="用户名不能为空" ControlToValidate="UserName"
										CssClass="Normal" Display="Dynamic"></asp:RequiredFieldValidator></td>
							</tr>
							<tr>
								<td height="33" width="100" align="right"><font class="Normal">密 码：</font></td>
								<td align="left"><asp:TextBox ID="Password" Runat="server" CssClass="NormalText" Width="150" TextMode="Password"></asp:TextBox><font color="red" class="Normal">*</font>
									<asp:RequiredFieldValidator id="RFVPassword" runat="server" ErrorMessage="密码不能为空" ControlToValidate="Password"
										CssClass="Normal" Display="Dynamic"></asp:RequiredFieldValidator>
								</td>
							</tr>
							<tr>
								<td height="33" width="100" align="right"><font class="Normal">验证码：</font></td>
								<td align="left" valign="bottom"><asp:TextBox ID="Validator" Runat="server" CssClass="NormalText" Width="150"></asp:TextBox><font color="red" class="Normal">*</font>
									<asp:Image ID="ValidateImage" runat="server" Height="25px" Width="100px" ImageAlign="AbsBottom" />
									<asp:RequiredFieldValidator id="rfv" runat="server" ErrorMessage="验证码不能为空" ControlToValidate="Validator"
										CssClass="Normal" Display="Dynamic"></asp:RequiredFieldValidator>
								</td>
							</tr>
						</table>
						<table border="0" cellpadding="1" cellspacing="0" width="420" bgcolor="orange">
							<tr>
								<td align="right" width="180">
									<asp:Button ID="LoginBtn" Runat="server" Text="登录" CssClass="CommandButton" Width="80px" OnClick="LoginBtn_Click"></asp:Button>
								</td>
								<td align="center" width="100">
									<asp:Button ID="CancelBtn" Runat="server" Text="取消" CssClass="CommandButton" CausesValidation="False"
										Width="80px" OnClick="CancelBtn_Click"></asp:Button></td>
								<td width="80">&nbsp;</td>
							</tr>
							<tr>
								<td colspan="3" align="center" bgcolor="orange" height="20"><asp:Label ID="Message" Runat="server" CssClass="Normal" Width="100%" ForeColor="Red"></asp:Label></td>
							</tr>
						</table>
					</td>
				</tr>
				<tr>
					<td><ucBottom:BottomBanner ID="Bottom" runat="server" /></td>
				</tr>
			</table>
		</form>
	</body>
</HTML>
