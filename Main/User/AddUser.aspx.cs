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
            ///�󶨿ؼ�������
        }

        ///���ð�ť�Ŀ�����
        AddBtn.Enabled = RoleList.Items.Count > 0 ? true : false;
    }


    protected void AddBtn_Click(object sender, EventArgs e)
    {  
        ///���ҳ���������ݺϷ�
        if (Page.IsValid == true)
        {
            ///������User
            DocumentManager.User user = new User();
            try
            {
                ///������û�
                user.AddUser(UserName.Text.Trim(),
                    DocumentManager.User.Encrypt(Password.Text.Trim()),
                    Email.Text.Trim(),
                    RoleList.SelectedIndex);

                ///��ʾ���������Ϣ
                Response.Write("<script>window.alert('" + ASPNET2System.OPERATIONADDSUCCESSMESSAGE + "')</script>");
            }
            catch (Exception ex)
            {
                ///��ʾ��Ӳ����е�ʧ�ܡ�������Ϣ
                Response.Redirect("~/Main/ErrorPage.aspx?ErrorUrl="
                    + ASPNET2System.RedirectErrorUrl(Request.RawUrl)
                    + "&ErrorMessage=" + ex.Message.Replace("\n", " "));
            }
        }
    }

    protected void ReturnBtn_Click(object sender, EventArgs e)
    {
        ///���ع���ҳ��
        Response.Redirect("~/Main/User/UserManage.aspx");
    }
}
