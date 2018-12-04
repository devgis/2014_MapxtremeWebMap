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

public partial class ViewUser : System.Web.UI.Page
{
    int nUserID = -1;

    protected void Page_Load(object sender, EventArgs e)
    {
        ///获取参数的值
        if (Request.Params["UserID"] != null)
        {
            nUserID = Int32.Parse(Request.Params["UserID"].ToString());
        }

        if (!Page.IsPostBack)
        {
            ///绑定控件的数据
            if (nUserID > -1)
            {                
                BindUserData(nUserID);
            }
        }
    }

    private void BindUserData(int nUserID)
    {
        ///定义获取数据的类
        User user = new User();
        SqlDataReader recu = user.GetSingleUser(nUserID);

        ///读取数据，并显示在网页上
        if (recu.Read())
        {
            ///设置TextBox控件的数据
            UserName.Text = recu["UserName"].ToString();
            Email.Text = recu["Email"].ToString();
            RoleList.SelectedIndex = Convert.ToInt32(recu["RoleID"]);

            /////设置选择控件的值
            //ASPNET2System.SetListBoxItem(RoleList, recu["RoleID"].ToString());
        }

        ///关闭数据读取器和数据库的连接
        recu.Close();    
    }
    protected void ReturnBtn_Click(object sender, EventArgs e)
    {
        ///返回管理页面
        Response.Redirect("~/Main/User/UserManage.aspx");
    }
}
