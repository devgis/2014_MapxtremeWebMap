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
            ///�󶨿ؼ�������
            BindUserData();
        }

        ///���ɾ��ȷ�϶Ի���
        deleteBtn.Attributes.Add("onclick", "return confirm('" + ASPNET2System.OPERATIONDELETEMESSAGE + "');");
    }

    private void BindUserData()
    {
        ///�����ȡ���ݵ���
        User user = new User();
        SqlDataReader recu = user.GetUsers();

        ///�趨�ؼ�������Դ
        UserList.DataSource = recu;

        ///�趨�ؼ���Text���Ժ�Value����
        UserList.DataTextField = "UserName";
        UserList.DataValueField = "UserID";

        ///�󶨿ؼ�������
        UserList.DataBind();

        ///�ر����ݶ�ȡ�������ݿ������
        recu.Close();
    }

    protected void AddBtn_Click(object sender, EventArgs e)
    {
        ///��ת�����ҳ��
        Response.Redirect("~/Main/User/AddUser.aspx"); 
    }   

    protected void viewBtn_Click(object sender, ImageClickEventArgs e)
    {
        if (UserList.SelectedIndex > -1)
        {
            ///��ת���鿴ҳ��
            Response.Redirect("~/Main/User/ViewUser.aspx?UserID=" + UserList.SelectedValue);           
        }
        else
        {
            ///��ʾ���������Ϣ
            Response.Write("<script>window.alert('" + ASPNET2System.OPERATIONNOSELECTMESSAGE + "')</script>");
        }				
    }

    protected void deleteBtn_Click(object sender, ImageClickEventArgs e)
    {
        if (UserList.SelectedIndex > -1)
        {
            ///������User
            User user = new User();
            try
            {
                ///ɾ���û�
                user.DeleteUser(Int32.Parse(UserList.SelectedValue));

                ///��ʾ���������Ϣ
                Response.Write("<script>window.alert('" + ASPNET2System.OPERATIONDELETESUCCESSMESSAGE + "')</script>");

                ///���°�����
                BindUserData();
            }
            catch (Exception ex)
            {
                ///��ʾ��Ӳ����е�ʧ�ܡ�������Ϣ
                Response.Redirect("~/Main/ErrorPage.aspx?ErrorUrl="
                    + ASPNET2System.RedirectErrorUrl(Request.RawUrl)
                    + "&ErrorMessage=" + ex.Message.Replace("\n", " "));
            }
        }
        else
        {
            ///��ʾ���������Ϣ
            Response.Write("<script>window.alert('" + ASPNET2System.OPERATIONNOSELECTMESSAGE + "')</script>");
        }				
    }
}
