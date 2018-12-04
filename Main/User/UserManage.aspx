<%@ Page Language="C#" AutoEventWireup="true" CodeFile="UserManage.aspx.cs" Inherits="UserManage" %>

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
		<form id="MsgSend" method="post" runat="server">
			<table border="0" cellpadding="0" cellspacing="0" style="BORDER-COLLAPSE: collapse" bordercolor="#111111"
				width="100%" height="1">
				<tr height="30">
					<td width="3%" bgcolor="#c0d9e6" class="GbText" background="../../Images/treetopbg.jpg"><font color="#006699" size="3"><img src="../../Images/moduleheaher.GIF" width="16" height="16"></font></td>
					<td bgcolor="#c0d9e6" class="GbText" background="../../Images/treetopbg.jpg"><b>用户管理</b></td>
				</tr>
			</table>
			<TABLE class="GbText" style="BORDER-COLLAPSE: collapse" borderColor="#93bee2" cellSpacing="0"
				cellPadding="0" width="100%" border="1">
				<tr valign="top">
					<td width="150">
						<font class="Normal">说明：
							<br>
							1:选择上下移动按钮可以改变用户的排列顺序；
							<br>
							2:选择"<font color="red" style="FONT-WEIGHT: bold">pen</font>"型按钮可以修改你所选的用户，并在下面的文本框中填写修改后的用户名称；
							<br>
							3:选择"<font color="red" style="FONT-WEIGHT: bold">X</font>"型按钮可以删除你所选的用户。</font>
					</td>
					<td align="left">
						<table cellSpacing="0" cellPadding="0">
							<tr>
								<td>
									<asp:ListBox id="UserList" width="150" rows="10" runat="server" />
								</td>
								<td>
									<table>
									<tr>
											<td>
												<asp:ImageButton id="viewBtn" ImageUrl="~/images/edit.gif" AlternateText="查看此项" runat="server"
													CommandName="edit" OnClick="viewBtn_Click" />
											</td>
										</tr>
										<tr>
											<td>
												<asp:ImageButton id="deleteBtn" ImageUrl="~/images/delete.gif" AlternateText="删除此项" runat="server"
													CommandName="delete" OnClick="deleteBtn_Click" />
											</td>
										</tr>										
									</table>
								</td>
							</tr>
						</table>
					</td>
				</tr>
				<TR height="30" width="150">
					<TD align="right">&nbsp;</TD>
					<TD><FONT face="宋体">&nbsp;</FONT><asp:button id="AddBtn" runat="server" Width="100px" CssClass="ButtonCss" Text="添      加" OnClick="AddBtn_Click"></asp:button><FONT face="宋体">&nbsp;&nbsp;&nbsp;
						</FONT>
					</TD>
				</TR>
			</TABLE>
		</form>
	</body>
</HTML>
