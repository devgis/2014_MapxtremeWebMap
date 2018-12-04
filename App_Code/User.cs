using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Security.Cryptography;
using SQLHelper;
using System.Data.SqlClient;
using System.Text;

namespace DocumentManager
{
    /// <summary>
    /// Summary description for User
    /// </summary>
    public class User
    {
        public static readonly int USERTYPESUPERADMIN = 0;
        public static readonly int USERTYPEADMIN = 1;
        public static readonly int USERTYPENORMAL = 2;

        public SqlDataReader GetUserLogin(string sUserName, string sPassword)
        {
            ///������SQLHelper
            SQLHelper.SQLHelper sqlHelper = new SQLHelper.SQLHelper();

            ///���屣������ݿ��ȡ�Ľ����DataReader
            SqlDataReader dr = null;

            ///�����������ݿ�Ĳ���			
            SqlParameter[] paramList = {
										   sqlHelper.CreateInParam("@UserName",SqlDbType.VarChar,200,sUserName),
										   sqlHelper.CreateInParam("@Password",SqlDbType.VarChar,255,sPassword)
									   };

            try
            {
                ///ִ�д洢����
                sqlHelper.RunProc("Pr_GetUserLogin", paramList, out dr);
            }
            catch (Exception ex)
            {
                ///�׳�ִ�����ݿ��쳣
                SystemError.CreateErrorLog(ex.Message);
                throw new Exception(ex.Message, ex);
            }

            ///���ش����ݿ��ȡ�Ľ��
            return (dr);
        }

        public SqlDataReader GetUsers()
        {
            ///������SQLHelper
            SQLHelper.SQLHelper sqlHelper = new SQLHelper.SQLHelper();

            ///���屣������ݿ��ȡ�Ľ����DataReader
            SqlDataReader dr = null;

            try
            {
                ///ִ�д洢����
                sqlHelper.RunProc("Pr_GetUsers", out dr);
            }
            catch (Exception ex)
            {
                ///�׳�ִ�����ݿ��쳣
                SystemError.CreateErrorLog(ex.Message);
                throw new Exception(ex.Message, ex);
            }

            ///���ش����ݿ��ȡ�Ľ��
            return (dr);
        }

        public SqlDataReader GetSingleUser(int nUserID)
        {
            ///������SQLHelper
            SQLHelper.SQLHelper sqlHelper = new SQLHelper.SQLHelper();

            ///���屣������ݿ��ȡ�Ľ����DataReader
            SqlDataReader dr = null;

            ///�����������ݿ�Ĳ���			
            SqlParameter[] paramList = {
										   sqlHelper.CreateInParam("@UserID",SqlDbType.Int,4,nUserID)
									   };

            try
            {
                ///ִ�д洢����
                sqlHelper.RunProc("Pr_GetSingleUser", paramList, out dr);
            }
            catch (Exception ex)
            {
                ///�׳�ִ�����ݿ��쳣
                SystemError.CreateErrorLog(ex.Message);
                throw new Exception(ex.Message, ex);
            }

            ///���ش����ݿ��ȡ�Ľ��
            return (dr);
        }

        public int AddUser(string sUserName, string sPassword, string sEmail,int nRoleID)
        {
            ///������SQLHelper
            SQLHelper.SQLHelper sqlHelper = new SQLHelper.SQLHelper();

            ///�����������ݿ�Ĳ���			
            SqlParameter[] paramList = {
										   sqlHelper.CreateInParam("@UserName",SqlDbType.VarChar,200,sUserName),
										   sqlHelper.CreateInParam("@Password",SqlDbType.VarChar,255,sPassword),
                                           sqlHelper.CreateInParam("@Email",SqlDbType.VarChar,200,sEmail),
										   sqlHelper.CreateInParam("@RoleID",SqlDbType.Int,4,nRoleID)
									   };

            try
            {
                ///ִ�д洢����
                return (sqlHelper.RunProc("Pr_AddUser", paramList));
            }
            catch (Exception ex)
            {
                ///�׳�ִ�����ݿ��쳣
                SystemError.CreateErrorLog(ex.Message);
                throw new Exception(ex.Message, ex);
            }
        }

        public void UpdateUserPwd(int nUserID, string sPassword)
        {
            ///������SQLHelper
            SQLHelper.SQLHelper sqlHelper = new SQLHelper.SQLHelper();

            ///�����������ݿ�Ĳ���			
            SqlParameter[] paramList = {
										   sqlHelper.CreateInParam("@UserID",SqlDbType.Int,4,nUserID),
										   sqlHelper.CreateInParam("@Password",SqlDbType.VarChar,255,sPassword)
									   };

            try
            {
                ///ִ�д洢����
                sqlHelper.RunProc("Pr_UpdateUserPwd", paramList);
            }
            catch (Exception ex)
            {
                ///�׳�ִ�����ݿ��쳣
                SystemError.CreateErrorLog(ex.Message);
                throw new Exception(ex.Message, ex);
            }
        }

        public void DeleteUser(int nUserID)
        {
            ///������SQLHelper
            SQLHelper.SQLHelper sqlHelper = new SQLHelper.SQLHelper();

            ///�����������ݿ�Ĳ���			
            SqlParameter[] paramList = {
										   sqlHelper.CreateInParam("@UserID",SqlDbType.Int,4,nUserID)
									   };

            try
            {
                ///ִ�д洢����
                sqlHelper.RunProc("Pr_DeleteUser", paramList);
            }
            catch (Exception ex)
            {
                ///�׳�ִ�����ݿ��쳣
                SystemError.CreateErrorLog(ex.Message);
                throw new Exception(ex.Message, ex);
            }
        }

        /// <summary>
        /// �û����ܺ���
        /// </summary>
        public static String Encrypt(string password)
        {
            Byte[] clearBytes = new UnicodeEncoding().GetBytes(password);
            Byte[] hashedBytes = ((HashAlgorithm)CryptoConfig.CreateFromName("MD5")).ComputeHash(clearBytes);

            return BitConverter.ToString(hashedBytes);
        }

        /// <summary>
        /// �ж��û������ͣ�
        /// 0����������Ա��
        /// 1������Ա��
        /// 2����ͨ�û���
        /// </summary>
        /// <param name="sUserID"></param>
        /// <returns>UserType</returns>
        public static int IsAuthorityAdmin(string sUserID)
        {
            ///�û�IDΪ��
            if (sUserID == null || sUserID == "")
            {
                return (Int32.MaxValue);
            }

            ///��ȡ�û�����������
            string sUserType = "";
            User user = new User();
            SqlDataReader recu = user.GetSingleUser(Int32.Parse(sUserID));
            if (recu.Read())
            {
                ///��ȡ�û�����
                sUserType = recu["UserType"].ToString();
            }
            recu.Close();
            if (sUserType == "")
            {
                return (Int32.MaxValue);
            }
            return (Int32.Parse(sUserType));
        }
    }
}