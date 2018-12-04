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

        ///创建Bmp位图
        Bitmap bitMapImage = new System.Drawing.Bitmap(Server.MapPath(ImagePath));
        Graphics graphicImage = Graphics.FromImage(bitMapImage);

        ///设置画笔的输出模式
        graphicImage.SmoothingMode = SmoothingMode.AntiAlias;
        ///添加文本字符串
        graphicImage.DrawString(sValidator, new Font("Arial", 20, FontStyle.Bold), SystemBrushes.WindowText, new Point(0, 0));

        ///设置图像输出的格式
        Response.ContentType = "image/jpeg";

        ///保存数据流
        bitMapImage.Save(Response.OutputStream, ImageFormat.Jpeg);

        ///释放占用的资源
        graphicImage.Dispose();
        bitMapImage.Dispose();
    }
}