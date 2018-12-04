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
        ///���ҳ���ʼ������
        if (!Page.IsPostBack)
        {
            sValidator = GetRandomint();
            ValidateImage.ImageUrl = sValidatorImageUrl + sValidator;
        }
    }

    protected void LoginBtn_Click(object sender, EventArgs e)
    {
        ///���ҳ������Ϸ�
        if (Page.IsValid == true)
        {
            if (Validator.Text != sValidator)
            {
                Message.Text = "��֤���������������������֤�룡����";
                sValidator = GetRandomint();
                ValidateImage.ImageUrl = sValidatorImageUrl + sValidator;
                return;
            }

            String userId = "";

            ///�����ಢ��ȡ�û��ĵ�½��Ϣ            
            DocumentManager.User user = new DocumentManager.User();
            SqlDataReader recu = user.GetUserLogin(UserName.Text.Trim(),
                DocumentManager.User.Encrypt(Password.Text.Trim()));

            ///�ж��û��Ƿ�Ϸ�
            if (recu.Read())
            {
                userId = recu["UserID"].ToString();
            }
            recu.Close();

            ///��֤�û��Ϸ��ԣ�����ת��ϵͳƽ̨
            if ((userId != null) && (userId != ""))
            {
                Session["UserID"] = userId;

                //��ת����¼��ĵ�һ��ҳ��
                Response.Redirect("~/Main/Main.aspx");
            }
            else
            {
                sValidator = GetRandomint();
                ValidateImage.ImageUrl = sValidatorImageUrl + sValidator;
                ///��ʾ������Ϣ
                Message.Text = "��������û����ƻ��������������������룡";
            }
        }
    }

    protected void CancelBtn_Click(object sender, EventArgs e)
    {
        ///����û����ƺ����������
        UserName.Text = Password.Text = "";
    }

    private String GetRandomint()
    {
        Random random = new Random();
        return (random.Next(100000,999999).ToString());
    }
}
