using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;

public partial class LeftTree : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        ///显示树型菜单
        if (!Page.IsPostBack)
        {
            TreeNode tn1=new TreeNode("地图");
            tn1.Target = "MainFrame";
            tn1.NavigateUrl="../MapForm.aspx";
            LeftTreeView.Nodes.Add(tn1);


            TreeNode tn2 = new TreeNode("实时数据");
            tn2.Target = "MainFrame";
            tn2.NavigateUrl = "Data/ViewData.aspx";
            LeftTreeView.Nodes.Add(tn2);

            TreeNode tn5 = new TreeNode("上报数据");
            tn5.Target = "MainFrame";
            tn5.NavigateUrl = "Data/UpdateData.aspx";
            LeftTreeView.Nodes.Add(tn5);


            TreeNode tn8 = new TreeNode("用户管理");
            tn8.Target = "MainFrame";
            tn8.NavigateUrl = "User/UserManage.aspx";
            LeftTreeView.Nodes.Add(tn8);


            TreeNode tn9 = new TreeNode("修改密码");
            tn9.Target = "MainFrame";
            tn9.NavigateUrl = "User/UpdateUserPwd.aspx";
            LeftTreeView.Nodes.Add(tn9);
        }
    }

}
