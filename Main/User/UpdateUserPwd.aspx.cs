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
        ///�ж��û��Ƿ��½
        if (Session["UserID"] == null)
        {
            Response.Redirect("~/Default.aspx");
        }
    }

    protected void UpdateBtn_Click(object sender, EventArgs e)
    {
        ///�ж��û��Ƿ��¼
        if (Session["UserID"] == null)
        {
            return;
        }

        ///�ж��û�����ľ������Ƿ���ȷ
        User user = new User();
        SqlDataReader recu = user.GetSingleUser(Int32.Parse(Session["UserID"].ToString()));

        if (recu.Read())
        {
            String str = DocumentManager.User.Encrypt(PasswordOld.Text.Trim());
            if (recu["Password"].ToString() != DocumentManager.User.Encrypt(PasswordOld.Text.Trim()))
            {
                ///��ʾ���������Ϣ
                Response.Write("<script>window.alert('" + ASPNET2System.PasswordErrorMESSAGE + "')</script>");
                return;
            }
        }
        else
        {
            ///��ʾ���������Ϣ
            Response.Write("<script>window.alert('" + ASPNET2System.PasswordErrorMESSAGE + "')</script>");
            return;
        }
        ///�ر����ݶ�ȡ��������Դ
        recu.Close();

        try
        {
            ///�޸��û�������
            user.UpdateUserPwd(Int32.Parse(Session["UserID"].ToString()),
                DocumentManager.User.Encrypt(Password.Text.Trim()));

            ///��ʾ���������Ϣ
            Response.Write("<script>window.alert('" + ASPNET2System.OPERATIONUPDATESUCCESSMESSAGE + "')</script>");
        }
        catch (Exception ex)
        {
            ///��ʾ��Ӳ����е�ʧ�ܡ�������Ϣ
            Response.Redirect("~/Main/ErrorPage.aspx?ErrorUrl="
                + ASPNET2System.RedirectErrorUrl(Request.RawUrl)
                + "&ErrorMessage=" + ex.Message.Replace("\n", " "));
        }
    }

    protected void ReturnBtn_Click(object sender, EventArgs e)
    {
        ///���ع���ҳ��
        Response.Redirect("~/Main/User/UserManage.aspx");
    }
}
