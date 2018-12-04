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
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Drawing.Text;
using System.Drawing;

public partial class ValidateImage : System.Web.UI.Page
{
    private readonly string ImagePath = "../Images/Validator.jpg";
    private static string sValidator = "";

    private void Page_Load(object sender, System.EventArgs e)
    {
        if (Request.Params["Validator"] != null)
        {
            sValidator = Request.Params["Validator"].ToString();
        }

        ///����Bmpλͼ
        Bitmap bitMapImage = new System.Drawing.Bitmap(Server.MapPath(ImagePath));
        Graphics graphicImage = Graphics.FromImage(bitMapImage);

        ///���û��ʵ����ģʽ
        graphicImage.SmoothingMode = SmoothingMode.AntiAlias;
        ///����ı��ַ���
        graphicImage.DrawString(sValidator, new Font("Arial", 20, FontStyle.Bold), SystemBrushes.WindowText, new Point(0, 0));

        ///����ͼ������ĸ�ʽ
        Response.ContentType = "image/jpeg";

        ///����������
        bitMapImage.Save(Response.OutputStream, ImageFormat.Jpeg);

        ///�ͷ�ռ�õ���Դ
        graphicImage.Dispose();
        bitMapImage.Dispose();
    }
}