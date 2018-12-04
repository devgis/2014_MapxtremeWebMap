<%--//////////////////////////////////////////////////////////////////////////////////////////////
//
//   (c) Pitney Bowes MapInfo Corporation, 2008.  All rights reserved.
//
//   This software is only provided as a demonstration by MapInfo.  
//   No licence or other right is granted.  
//   No use, transmission or copying is permitted.
//
//   This software is provided by MapInfo "as is" and any express or implied warranties, 
//   including, but not limited to, the implied warranties of merchantability and fitness 
//   for a particular purpose are disclaimed.  In no event shall MapInfo be liable for any 
//   direct, indirect, incidental, special, exemplary, or consequential damages (including, 
//   but not limited to, procurement of substitute goods or services; loss of use, data or
//   profits; or business interruption) however caused and whether in contract, strict 
//   liability, or tort (including negligence) arising in any way out of the use of this 
//   software, even if advised of the possibility of such damage.
//
//////////////////////////////////////////////////////////////////////////////////////////////--%>

<%@ Page Language="C#" AutoEventWireup="true"  CodeFile="MapForm.aspx.cs" Inherits="_Default" %>

<%@ Register Assembly="MapInfo.WebControls, Version=6.8.0.536, Culture=neutral, PublicKeyToken=0a9556cc66c0af57"
    Namespace="MapInfo.WebControls" TagPrefix="cc1" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
<head runat="server">
    <title>城市燃气模拟实验管道泄漏事故预警系统</title>
</head>
<body>
    <form id="form1" runat="server">
    <table style="position:absolute;left: 150px; top: 0px;">
        <tr border=1>
                <td><cc1:ZoomInTool ID="ZoomInTool1" runat="server" MapControlID="MapControl1"/><cc1:ZoomOutTool ID="ZoomOutTool1" runat="server" MapControlID="MapControl1" /><cc1:CenterTool ID="CenterTool1" runat="server" MapControlID="MapControl1" /><cc1:PanTool ID="PanTool1" runat="server" MapControlID="MapControl1" />
                    <asp:DropDownList ID="DropDownList1" runat="server">
                        <asp:ListItem>主站</asp:ListItem>
                        <asp:ListItem>基站</asp:ListItem>
                        <asp:ListItem>子机</asp:ListItem>
                    </asp:DropDownList>
                    <asp:TextBox ID="TextBox1" runat="server"></asp:TextBox>
                    <asp:Button ID="Button1" runat="server" OnClick="Button1_Click" Text="查询" /></td>
        </tr>
        <tr><td><cc1:MapControl ID="MapControl1" runat="server" Height="600px" Width="800px"  MapAlias="Map1"/></td></tr>
    </table>
    
    <table width=150 border=1 style="position:absolute;left: 0px; top: 0px;">
    <tr><td>
    <asp:TreeView ID="TreeView2" runat="server" OnSelectedNodeChanged="TreeView2_SelectedNodeChanged">
        </asp:TreeView>
        </td>
        </tr>
    </table>
    <table style="position:absolute; left: 0px; top: 0px;">
        
    </table>              
        
    </form>
</body>
</html>
