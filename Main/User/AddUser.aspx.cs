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
using DocumentManager;
using System.Data.SqlClient;

public partial class AddUser : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!Page.IsPostBack)
        {
            ///绑定控件的数据
        }

        ///设置按钮的可用性
        AddBtn.Enabled = RoleList.Items.Count > 0 ? true : false;
    }


    protected void AddBtn_Click(object sender, EventArgs e)
    {  
        ///如果页面输入内容合法
        if (Page.IsValid == true)
        {
            ///定义类User
            DocumentManager.User user = new User();
            try
            {
                ///添加新用户
                user.AddUser(UserName.Text.Trim(),
                    DocumentManager.User.Encrypt(Password.Text.Trim()),
                    Email.Text.Trim(),
                    RoleList.SelectedIndex);

                ///显示操作结果信息
                Response.Write("<script>window.alert('" + ASPNET2System.OPERATIONADDSUCCESSMESSAGE + "')</script>");
            }
            catch (Exception ex)
            {
                ///显示添加操作中的失败、错误信息
                Response.Redirect("~/Main/ErrorPage.aspx?ErrorUrl="
                    + ASPNET2System.RedirectErrorUrl(Request.RawUrl)
                    + "&ErrorMessage=" + ex.Message.Replace("\n", " "));
            }
        }
    }

    protected void ReturnBtn_Click(object sender, EventArgs e)
    {
        ///返回管理页面
        Response.Redirect("~/Main/User/UserManage.aspx");
    }
}
