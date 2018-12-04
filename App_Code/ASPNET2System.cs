using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;

//��Դ��������www.51aspx.com(���������������)

namespace DocumentManager
{
    /// <summary>
    /// Summary description for ASPNET2System
    /// </summary>
    public class ASPNET2System
    {
        ///����ע����ֵ��������޸ģ�����
        public static string PROJECTNAME                   = "WebGIS";
        public static string PROJECTDESN = "����ȼ��ģ��ʵ��ܵ�й©�¹�Ԥ��ϵͳ";
        public static string PROJECTTREEROOTNODEDATA       = "0";       

        public static string OPERATIONADDSUCCESSMESSAGE    = "���������ɹ�������";
        public static string OPERATIONADDFAILUREMESSAGE    = "���������ʧ�ܣ�����";

        public static string OPERATIONUPDATESUCCESSMESSAGE = "�޸�������ɹ�������";
        public static string OPERATIONUPDATEFAILUREMESSAGE = "�޸�������ʧ�ܣ�����";

        public static string OPERATIONDELETESUCCESSMESSAGE = "ɾ��������ɹ�������";
        public static string OPERATIONDELETEFAILUREMESSAGE = "ɾ��������ʧ�ܣ�����";

        public static string OPERATIONNOSELECTMESSAGE      = "��ѡ����������������";
        public static string OPERATIONDELETEMESSAGE        = "��ȷ��Ҫɾ����ѡ�����������";
        public static string PasswordErrorMESSAGE          = "��������������������������룡����";

        public static string OPERATIONDATANULL             = "����Ϊ�գ�����";


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
                ///�ж�ֵ�Ƿ���ȣ��������ÿؼ���SelectedIndex
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
                ///�ж�ֵ�Ƿ���ȣ��������ÿؼ���SelectedIndex
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
