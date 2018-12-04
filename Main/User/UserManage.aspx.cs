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

public partial class UserManage : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!Page.IsPostBack)
        {
            ///绑定控件的数据
            BindUserData();
        }

        ///添加删除确认对话框
        deleteBtn.Attributes.Add("onclick", "return confirm('" + ASPNET2System.OPERATIONDELETEMESSAGE + "');");
    }

    private void BindUserData()
    {
        ///定义获取数据的类
        User user = new User();
        SqlDataReader recu = user.GetUsers();

        ///设定控件的数据源
        UserList.DataSource = recu;

        ///设定控件的Text属性和Value属性
        UserList.DataTextField = "UserName";
        UserList.DataValueField = "UserID";

        ///绑定控件的数据
        UserList.DataBind();

        ///关闭数据读取器和数据库的连接
        recu.Close();
    }

    protected void AddBtn_Click(object sender, EventArgs e)
    {
        ///跳转到添加页面
        Response.Redirect("~/Main/User/AddUser.aspx"); 
    }   

    protected void viewBtn_Click(object sender, ImageClickEventArgs e)
    {
        if (UserList.SelectedIndex > -1)
        {
            ///跳转到查看页面
            Response.Redirect("~/Main/User/ViewUser.aspx?UserID=" + UserList.SelectedValue);           
        }
        else
        {
            ///显示操作结果信息
            Response.Write("<script>window.alert('" + ASPNET2System.OPERATIONNOSELECTMESSAGE + "')</script>");
        }				
    }

    protected void deleteBtn_Click(object sender, ImageClickEventArgs e)
    {
        if (UserList.SelectedIndex > -1)
        {
            ///定义类User
            User user = new User();
            try
            {
                ///删除用户
                user.DeleteUser(Int32.Parse(UserList.SelectedValue));

                ///显示操作结果信息
                Response.Write("<script>window.alert('" + ASPNET2System.OPERATIONDELETESUCCESSMESSAGE + "')</script>");

                ///重新绑定数据
                BindUserData();
            }
            catch (Exception ex)
            {
                ///显示添加操作中的失败、错误信息
                Response.Redirect("~/Main/ErrorPage.aspx?ErrorUrl="
                    + ASPNET2System.RedirectErrorUrl(Request.RawUrl)
                    + "&ErrorMessage=" + ex.Message.Replace("\n", " "));
            }
        }
        else
        {
            ///显示操作结果信息
            Response.Write("<script>window.alert('" + ASPNET2System.OPERATIONNOSELECTMESSAGE + "')</script>");
        }				
    }
}
