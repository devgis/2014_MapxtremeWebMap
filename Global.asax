<%@ Application Language="C#" %>

<%--
//////////////////////////////////////////////////////////////////////////////////////////////
//
//   (c) Pitney Bowes MapInfo Corporation, 2008.  All rights reserved.
//
//   This software is only provided as a demonstration by MapInfo.  
//   No licence or other right is granted.  
//   No use, transmission or copying is permitted.
//
//   This software is provided by MapInfo "as is" and any express or implied warranties, 
//   including, but not limited to, the implied warranties of merchantability and fitness 
//   for a particular purpose are disclaimed.  In no event shall MapInfo be liable for any 
//   direct, indirect, incidental, special, exemplary, or consequential damages (including, 
//   but not limited to, procurement of substitute goods or services; loss of use, data or
//   profits; or business interruption) however caused and whether in contract, strict 
//   liability, or tort (including negligence) arising in any way out of the use of this 
//   software, even if advised of the possibility of such damage.
//
//////////////////////////////////////////////////////////////////////////////////////////////--%>

<script runat="server">

    void Application_Start(object sender, EventArgs e) 
    {
        // Code that runs on application startup

    }
    
    void Application_End(object sender, EventArgs e) 
    {
        //  Code that runs on application shutdown
    }
        
    void Application_Error(object sender, EventArgs e) 
    { 
        // Code that runs when an unhandled error occurs
        Exception ex = Server.GetLastError();
        if (ex != null && ex.Message.Length > 0)
        {
            // If the request was for the map image then write the messages into a bitmap and send it back.
            if (HttpContext.Current.Request.Url.AbsoluteUri.IndexOf("MapController") >= 0)
            {
                // Get height and width from the request if it was a request for map image.
                int mapWidth = System.Convert.ToInt32(HttpContext.Current.Request[MapInfo.WebControls.MapBaseCommand.WidthKey]);
                int mapHeight = System.Convert.ToInt32(HttpContext.Current.Request[MapInfo.WebControls.MapBaseCommand.HeightKey]);

                StringBuilder builder1 = new StringBuilder();
                System.Drawing.Bitmap b = new System.Drawing.Bitmap(mapWidth, mapHeight);
                System.Drawing.Graphics g = System.Drawing.Graphics.FromImage(b);

                // Append the message from exception
                builder1.Append(ex.Message);
                builder1.Append("\r\n");

                // Create stack trace for exception
                System.Diagnostics.StackTrace st = new System.Diagnostics.StackTrace(ex, true);
                for (int num2 = 0; num2 < st.FrameCount; num2++)
                {
                    System.Diagnostics.StackFrame frame1 = st.GetFrame(num2);
                    System.Reflection.MethodBase base1 = frame1.GetMethod();
                    Type type1 = base1.DeclaringType;
                    string text1 = string.Empty;
                    if (type1 != null)
                    {
                        text1 = type1.Namespace;
                    }
                    if (text1 != null)
                    {
                        if (text1.Equals("_ASP") || text1.Equals("ASP"))
                        {
                            //this._fGeneratedCodeOnStack = true;
                        }
                        text1 = text1 + ".";
                    }
                    if (type1 == null)
                    {
                        builder1.Append("   " + base1.Name + "(");
                    }
                    else
                    {
                        string[] textArray1 = new string[] { "   ", text1, type1.Name, ".", base1.Name, "(" };
                        builder1.Append(string.Concat(textArray1));
                    }
                    System.Reflection.ParameterInfo[] infoArray1 = base1.GetParameters();
                    for (int num3 = 0; num3 < infoArray1.Length; num3++)
                    {
                        builder1.Append(((num3 != 0) ? ", " : "") + infoArray1[num3].ParameterType.Name + " " + infoArray1[num3].Name);
                    }
                    builder1.Append(")");
                    builder1.Append("\r\n");
                }

                // write the strings into the rectangle
                g.DrawString(builder1.ToString(), new System.Drawing.Font("Tahoma", 8), new System.Drawing.SolidBrush(System.Drawing.Color.Yellow), new System.Drawing.RectangleF(0, 0, mapWidth, mapHeight), System.Drawing.StringFormat.GenericDefault);

                // Save the bitmap into the stream to send it back
                string contentType = string.Format("text/HTML");
                if (contentType != null) HttpContext.Current.Response.ContentType = contentType;
                b.Save(HttpContext.Current.Response.OutputStream, System.Drawing.Imaging.ImageFormat.Gif);

                // End the response here
                HttpContext.Current.Response.End();
            }
            else
            {
                // Let the exception pass through
            }
        }
    }

    void Session_Start(object sender, EventArgs e) 
    {
        // Code that runs when a new session is started

    }

    void Session_End(object sender, EventArgs e) 
    {
        // Code that runs when a session ends. 
        // Note: The Session_End event is raised only when the sessionstate mode
        // is set to InProc in the Web.config file. If session mode is set to StateServer 
        // or SQLServer, the event is not raised.

    }
       
</script>
