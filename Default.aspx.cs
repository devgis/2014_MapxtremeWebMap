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
using System.Data.SqlClient;

public partial class Default : System.Web.UI.Page
{
    static string sValidator = "";
    private readonly string sValidatorImageUrl = "Main/ValidateImage.aspx?Validator=";

    protected void Page_Load(object sender, EventArgs e)
    {        
        ///添加页面初始化代码
        if (!Page.IsPostBack)
        {
            sValidator = GetRandomint();
            ValidateImage.ImageUrl = sValidatorImageUrl + sValidator;
        }
    }

    protected void LoginBtn_Click(object sender, EventArgs e)
    {
        ///如果页面输入合法
        if (Page.IsValid == true)
        {
            if (Validator.Text != sValidator)
            {
                Message.Text = "验证码输入错误，请重新输入验证码！！！";
                sValidator = GetRandomint();
                ValidateImage.ImageUrl = sValidatorImageUrl + sValidator;
                return;
            }

            String userId = "";

            ///定义类并获取用户的登陆信息            
            DocumentManager.User user = new DocumentManager.User();
            SqlDataReader recu = user.GetUserLogin(UserName.Text.Trim(),
                DocumentManager.User.Encrypt(Password.Text.Trim()));

            ///判断用户是否合法
            if (recu.Read())
            {
                userId = recu["UserID"].ToString();
            }
            recu.Close();

            ///验证用户合法性，并跳转到系统平台
            if ((userId != null) && (userId != ""))
            {
                Session["UserID"] = userId;

                //跳转到登录后的第一个页面
                Response.Redirect("~/Main/Main.aspx");
            }
            else
            {
                sValidator = GetRandomint();
                ValidateImage.ImageUrl = sValidatorImageUrl + sValidator;
                ///显示错误信息
                Message.Text = "你输入的用户名称或者密码有误，请重新输入！";
            }
        }
    }

    protected void CancelBtn_Click(object sender, EventArgs e)
    {
        ///清空用户名称和密码输入框
        UserName.Text = Password.Text = "";
    }

    private String GetRandomint()
    {
        Random random = new Random();
        return (random.Next(100000,999999).ToString());
    }
}
