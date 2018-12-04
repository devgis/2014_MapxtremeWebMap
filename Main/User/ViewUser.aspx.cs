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
        ///��ȡ������ֵ
        if (Request.Params["UserID"] != null)
        {
            nUserID = Int32.Parse(Request.Params["UserID"].ToString());
        }

        if (!Page.IsPostBack)
        {
            ///�󶨿ؼ�������
            if (nUserID > -1)
            {                
                BindUserData(nUserID);
            }
        }
    }

    private void BindUserData(int nUserID)
    {
        ///�����ȡ���ݵ���
        User user = new User();
        SqlDataReader recu = user.GetSingleUser(nUserID);

        ///��ȡ���ݣ�����ʾ����ҳ��
        if (recu.Read())
        {
            ///����TextBox�ؼ�������
            UserName.Text = recu["UserName"].ToString();
            Email.Text = recu["Email"].ToString();
            RoleList.SelectedIndex = Convert.ToInt32(recu["RoleID"]);

            /////����ѡ��ؼ���ֵ
            //ASPNET2System.SetListBoxItem(RoleList, recu["RoleID"].ToString());
        }

        ///�ر����ݶ�ȡ�������ݿ������
        recu.Close();    
    }
    protected void ReturnBtn_Click(object sender, EventArgs e)
    {
        ///���ع���ҳ��
        Response.Redirect("~/Main/User/UserManage.aspx");
    }
}
