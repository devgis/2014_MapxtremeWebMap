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
            ///定义类SQLHelper
            SQLHelper.SQLHelper sqlHelper = new SQLHelper.SQLHelper();

            ///定义保存从数据库获取的结果的DataReader
            SqlDataReader dr = null;

            ///创建访问数据库的参数			
            SqlParameter[] paramList = {
										   sqlHelper.CreateInParam("@UserName",SqlDbType.VarChar,200,sUserName),
										   sqlHelper.CreateInParam("@Password",SqlDbType.VarChar,255,sPassword)
									   };

            try
            {
                ///执行存储过程
                sqlHelper.RunProc("Pr_GetUserLogin", paramList, out dr);
            }
            catch (Exception ex)
            {
                ///抛出执行数据库异常
                SystemError.CreateErrorLog(ex.Message);
                throw new Exception(ex.Message, ex);
            }

            ///返回从数据库获取的结果
            return (dr);
        }

        public SqlDataReader GetUsers()
        {
            ///定义类SQLHelper
            SQLHelper.SQLHelper sqlHelper = new SQLHelper.SQLHelper();

            ///定义保存从数据库获取的结果的DataReader
            SqlDataReader dr = null;

            try
            {
                ///执行存储过程
                sqlHelper.RunProc("Pr_GetUsers", out dr);
            }
            catch (Exception ex)
            {
                ///抛出执行数据库异常
                SystemError.CreateErrorLog(ex.Message);
                throw new Exception(ex.Message, ex);
            }

            ///返回从数据库获取的结果
            return (dr);
        }

        public SqlDataReader GetSingleUser(int nUserID)
        {
            ///定义类SQLHelper
            SQLHelper.SQLHelper sqlHelper = new SQLHelper.SQLHelper();

            ///定义保存从数据库获取的结果的DataReader
            SqlDataReader dr = null;

            ///创建访问数据库的参数			
            SqlParameter[] paramList = {
										   sqlHelper.CreateInParam("@UserID",SqlDbType.Int,4,nUserID)
									   };

            try
            {
                ///执行存储过程
                sqlHelper.RunProc("Pr_GetSingleUser", paramList, out dr);
            }
            catch (Exception ex)
            {
                ///抛出执行数据库异常
                SystemError.CreateErrorLog(ex.Message);
                throw new Exception(ex.Message, ex);
            }

            ///返回从数据库获取的结果
            return (dr);
        }

        public int AddUser(string sUserName, string sPassword, string sEmail,int nRoleID)
        {
            ///定义类SQLHelper
            SQLHelper.SQLHelper sqlHelper = new SQLHelper.SQLHelper();

            ///创建访问数据库的参数			
            SqlParameter[] paramList = {
										   sqlHelper.CreateInParam("@UserName",SqlDbType.VarChar,200,sUserName),
										   sqlHelper.CreateInParam("@Password",SqlDbType.VarChar,255,sPassword),
                                           sqlHelper.CreateInParam("@Email",SqlDbType.VarChar,200,sEmail),
										   sqlHelper.CreateInParam("@RoleID",SqlDbType.Int,4,nRoleID)
									   };

            try
            {
                ///执行存储过程
                return (sqlHelper.RunProc("Pr_AddUser", paramList));
            }
            catch (Exception ex)
            {
                ///抛出执行数据库异常
                SystemError.CreateErrorLog(ex.Message);
                throw new Exception(ex.Message, ex);
            }
        }

        public void UpdateUserPwd(int nUserID, string sPassword)
        {
            ///定义类SQLHelper
            SQLHelper.SQLHelper sqlHelper = new SQLHelper.SQLHelper();

            ///创建访问数据库的参数			
            SqlParameter[] paramList = {
										   sqlHelper.CreateInParam("@UserID",SqlDbType.Int,4,nUserID),
										   sqlHelper.CreateInParam("@Password",SqlDbType.VarChar,255,sPassword)
									   };

            try
            {
                ///执行存储过程
                sqlHelper.RunProc("Pr_UpdateUserPwd", paramList);
            }
            catch (Exception ex)
            {
                ///抛出执行数据库异常
                SystemError.CreateErrorLog(ex.Message);
                throw new Exception(ex.Message, ex);
            }
        }

        public void DeleteUser(int nUserID)
        {
            ///定义类SQLHelper
            SQLHelper.SQLHelper sqlHelper = new SQLHelper.SQLHelper();

            ///创建访问数据库的参数			
            SqlParameter[] paramList = {
										   sqlHelper.CreateInParam("@UserID",SqlDbType.Int,4,nUserID)
									   };

            try
            {
                ///执行存储过程
                sqlHelper.RunProc("Pr_DeleteUser", paramList);
            }
            catch (Exception ex)
            {
                ///抛出执行数据库异常
                SystemError.CreateErrorLog(ex.Message);
                throw new Exception(ex.Message, ex);
            }
        }

        /// <summary>
        /// 用户加密函数
        /// </summary>
        public static String Encrypt(string password)
        {
            Byte[] clearBytes = new UnicodeEncoding().GetBytes(password);
            Byte[] hashedBytes = ((HashAlgorithm)CryptoConfig.CreateFromName("MD5")).ComputeHash(clearBytes);

            return BitConverter.ToString(hashedBytes);
        }

        /// <summary>
        /// 判断用户的类型：
        /// 0：超级管理员；
        /// 1：管理员；
        /// 2：普通用户。
        /// </summary>
        /// <param name="sUserID"></param>
        /// <returns>UserType</returns>
        public static int IsAuthorityAdmin(string sUserID)
        {
            ///用户ID为空
            if (sUserID == null || sUserID == "")
            {
                return (Int32.MaxValue);
            }

            ///获取用户所属的类型
            string sUserType = "";
            User user = new User();
            SqlDataReader recu = user.GetSingleUser(Int32.Parse(sUserID));
            if (recu.Read())
            {
                ///读取用户类型
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