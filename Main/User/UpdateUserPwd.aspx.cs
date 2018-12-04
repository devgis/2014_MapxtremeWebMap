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

public partial class UpdateUserPwd : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        ///判断用户是否登陆
        if (Session["UserID"] == null)
        {
            Response.Redirect("~/Default.aspx");
        }
    }

    protected void UpdateBtn_Click(object sender, EventArgs e)
    {
        ///判断用户是否登录
        if (Session["UserID"] == null)
        {
            return;
        }

        ///判断用户输入的旧密码是否正确
        User user = new User();
        SqlDataReader recu = user.GetSingleUser(Int32.Parse(Session["UserID"].ToString()));

        if (recu.Read())
        {
            String str = DocumentManager.User.Encrypt(PasswordOld.Text.Trim());
            if (recu["Password"].ToString() != DocumentManager.User.Encrypt(PasswordOld.Text.Trim()))
            {
                ///显示操作结果信息
                Response.Write("<script>window.alert('" + ASPNET2System.PasswordErrorMESSAGE + "')</script>");
                return;
            }
        }
        else
        {
            ///显示操作结果信息
            Response.Write("<script>window.alert('" + ASPNET2System.PasswordErrorMESSAGE + "')</script>");
            return;
        }
        ///关闭数据读取器和数据源
        recu.Close();

        try
        {
            ///修改用户的密码
            user.UpdateUserPwd(Int32.Parse(Session["UserID"].ToString()),
                DocumentManager.User.Encrypt(Password.Text.Trim()));

            ///显示操作结果信息
            Response.Write("<script>window.alert('" + ASPNET2System.OPERATIONUPDATESUCCESSMESSAGE + "')</script>");
        }
        catch (Exception ex)
        {
            ///显示添加操作中的失败、错误信息
            Response.Redirect("~/Main/ErrorPage.aspx?ErrorUrl="
                + ASPNET2System.RedirectErrorUrl(Request.RawUrl)
                + "&ErrorMessage=" + ex.Message.Replace("\n", " "));
        }
    }

    protected void ReturnBtn_Click(object sender, EventArgs e)
    {
        ///返回管理页面
        Response.Redirect("~/Main/User/UserManage.aspx");
    }
}
