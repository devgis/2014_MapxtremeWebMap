using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;

//该源码下载自www.51aspx.com(５１ａｓｐｘ．ｃｏｍ)

namespace DocumentManager
{
    /// <summary>
    /// Summary description for ASPNET2System
    /// </summary>
    public class ASPNET2System
    {
        ///作者注：此值请勿随便修改！！！
        public static string PROJECTNAME                   = "WebGIS";
        public static string PROJECTDESN = "城市燃气模拟实验管道泄漏事故预警系统";
        public static string PROJECTTREEROOTNODEDATA       = "0";       

        public static string OPERATIONADDSUCCESSMESSAGE    = "添加数据项成功！！！";
        public static string OPERATIONADDFAILUREMESSAGE    = "添加数据项失败！！！";

        public static string OPERATIONUPDATESUCCESSMESSAGE = "修改数据项成功！！！";
        public static string OPERATIONUPDATEFAILUREMESSAGE = "修改数据项失败！！！";

        public static string OPERATIONDELETESUCCESSMESSAGE = "删除数据项成功！！！";
        public static string OPERATIONDELETEFAILUREMESSAGE = "删除数据项失败！！！";

        public static string OPERATIONNOSELECTMESSAGE      = "请选择操作的数据项！！！";
        public static string OPERATIONDELETEMESSAGE        = "你确定要删除所选择的数据项吗？";
        public static string PasswordErrorMESSAGE          = "旧密码输入错误，请重新输入密码！！！";

        public static string OPERATIONDATANULL             = "数据为空！！！";


        public static string RedirectErrorUrl(String sErrorUrl)
        {
            if (sErrorUrl == null || sErrorUrl == "")
            {
                return ("");
            }
            return ((sErrorUrl.IndexOf("?") > -1) ? sErrorUrl.Substring(0, sErrorUrl.IndexOf("?")) : sErrorUrl);
        }

        public static void SetListBoxItem(ListBox listBox, string sItemValue)
        {
            int index = 0;
            foreach (ListItem item in listBox.Items)
            {
                ///判断值是否相等，并且设置控件的SelectedIndex
                if (item.Value.ToLower() == sItemValue.ToLower())
                {
                    listBox.SelectedIndex = index;
                    break;
                }
                index++;
            }
        }

        public static void SetListBoxItem(DropDownList listBox, string sItemValue)
        {
            int index = 0;
            foreach (ListItem item in listBox.Items)
            {
                ///判断值是否相等，并且设置控件的SelectedIndex
                if (item.Value.ToLower() == sItemValue.ToLower())
                {
                    listBox.SelectedIndex = index;
                    break;
                }
                index++;
            }
        }
    }
}
