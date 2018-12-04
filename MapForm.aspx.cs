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
//////////////////////////////////////////////////////////////////////////////////////////////

using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using MapInfo.WebControls;
using ApplicationStateManager;
using MapInfo.Mapping;
using MapInfo.Data;

public partial class _Default : System.Web.UI.Page 
{
	private void Page_Load(object sender, System.EventArgs e) 
	{
		if (StateManager.IsManualState()) 
		{
			// If the StateManager doesn't exist in the session put it else get it.
			if (StateManager.GetStateManagerFromSession() == null) 
			{
				//instanciate AppStateManager class
				AppStateManager myStateManager = new AppStateManager();
				//put state manager to session
				StateManager.PutStateManagerInSession(myStateManager);
				//put current map alias to state manager dictionary
				myStateManager.ParamsDictionary[StateManager.ActiveMapAliasKey] = this.MapControl1.MapAlias;
			}

			// Now Restore State
			StateManager.GetStateManagerFromSession().RestoreState();
		}

        if (!Page.IsPostBack)
        {
            #region 加载节点地图数据
            Map mainMap = GetMap();

            FeatureLayer flStation = mainMap.Layers["Station"] as FeatureLayer;
            FeatureLayer flBaseStation = mainMap.Layers["BaseStation"] as FeatureLayer;
            FeatureLayer flSubMachine = mainMap.Layers["SubMachine"] as FeatureLayer;

            //加载主站
            foreach (Feature fStation in (flStation.Table as MapInfo.Data.ITableFeatureCollection))
            {

                TreeNode tn = new TreeNode(fStation["NAME"].ToString());
                tn.Target = fStation["ID"].ToString();
                tn.ImageUrl = Request.MapPath("~/images/1.gif");
                tn.CollapseAll();
                TreeView2.Nodes.Add(tn);
            }

            //加载基站
            foreach (Feature fBaseStation in (flBaseStation.Table as MapInfo.Data.ITableFeatureCollection))
            {
                TreeNode pNode = GetParentStation(fBaseStation["PID"].ToString());
                if (pNode == null)
                    continue;
                TreeNode tn = new TreeNode(fBaseStation["NAME"].ToString());
                tn.Target = fBaseStation["ID"].ToString();
                tn.ImageUrl = Request.MapPath("~/images/2.gif");
                tn.CollapseAll();
                pNode.ChildNodes.Add(tn);
            }


            //加载子机
            foreach (Feature fSubMachine in (flSubMachine.Table as MapInfo.Data.ITableFeatureCollection))
            {
                TreeNode pNode = GetBaseStation(fSubMachine["PID"].ToString());
                if (pNode == null)
                    continue;
                TreeNode tn = new TreeNode(fSubMachine["NAME"].ToString());
                tn.Target = fSubMachine["ID"].ToString();
                tn.ImageUrl = Request.MapPath("~/images/3.gif");
                tn.CollapseAll();
                pNode.ChildNodes.Add(tn);
            }
            TreeView2.ExpandAll();
            #endregion
        }
	}

    private TreeNode GetParentStation(String ID)
    {
        foreach (TreeNode tn in TreeView2.Nodes)
        {
            if (ID.Equals(tn.Target.ToString()))
            {
                return tn;
            }
        }
        return null;
    }

    private TreeNode GetBaseStation(String ID)
    {
        foreach (TreeNode tn in TreeView2.Nodes)
        {
            foreach (TreeNode tnChild in tn.ChildNodes)
            {
                if (ID.Equals(tnChild.Target.ToString()))
                {
                    return tnChild;
                }
            }
        }
        return null;
    }

    
    // At the time of unloading the page, save the state
    private void Page_UnLoad(object sender, System.EventArgs e)
    {
        if (StateManager.IsManualState())
        {
            StateManager.GetStateManagerFromSession().SaveState();
        }

        
    }

    Map map;
    private Map GetMap()
    {
        if(map==null)
        {
            map = MapInfo.Engine.Session.Current.MapFactory[0];
        }
        return map;
    }
    protected void TreeView2_SelectedNodeChanged(object sender, EventArgs e)
    {
        Map mainMap = GetMap();
        String ID = TreeView2.SelectedNode.Target.ToString();
        FeatureLayer layer = mainMap.Layers["Station"] as FeatureLayer;
        if (TreeView2.SelectedNode.Depth == 0)
        {
            layer = mainMap.Layers["Station"] as FeatureLayer;
        }
        else if (TreeView2.SelectedNode.Depth == 1)
        {
            layer = mainMap.Layers["BaseStation"] as FeatureLayer;
        }
        else if (TreeView2.SelectedNode.Depth == 2)
        {
            layer = mainMap.Layers["SubMachine"] as FeatureLayer;
        }
        String Where = String.Format("ID='{0}'",ID);

        Feature fResult = MapInfo.Engine.Session.Current.Catalog.SearchForFeature(layer.Alias, MapInfo.Data.SearchInfoFactory.SearchWhere(Where));
        //MapInfo.Engine.Session.Current.Selections.Clear();
        //MapInfo.Engine.Session.Current.Selections.DefaultSelection.ad
        mainMap.SetView(fResult);

        //if (TreeView2.SelectedNode.Depth == 0)
        //{
        //    layer = mainMap.Layers["Station"] as FeatureLayer;
        //}
        //else if (TreeView2.SelectedNode.Depth == 1)
        //{
        //    mainMap.SetView(fResult);
        //}
        //else if (TreeView2.SelectedNode.Depth == 2)
        //{
        //    mainMap.Center = fResult.Geometry.Centroid;
        //}
        
    }
    protected void Button1_Click(object sender, EventArgs e)
    {
        Map mainMap = GetMap();
        String Name = TextBox1.Text;
        FeatureLayer layer = mainMap.Layers["Station"] as FeatureLayer;
        if (DropDownList1.SelectedIndex == 0)
        {
            layer = mainMap.Layers["Station"] as FeatureLayer;
        }
        else if (DropDownList1.SelectedIndex == 1)
        {
            layer = mainMap.Layers["BaseStation"] as FeatureLayer;
        }
        else if (DropDownList1.SelectedIndex == 2)
        {
            layer = mainMap.Layers["SubMachine"] as FeatureLayer;
        }
        String Where = String.Format("Name='{0}'", Name);

        Feature fResult = MapInfo.Engine.Session.Current.Catalog.SearchForFeature(layer.Alias, MapInfo.Data.SearchInfoFactory.SearchWhere(Where));
        //MapInfo.Engine.Session.Current.Selections.Clear();
        //MapInfo.Engine.Session.Current.Selections.DefaultSelection.ad
        if (fResult == null)
        {
            ShowMessage("名称不存在请重新输入");
        }
        else
        {
            mainMap.SetView(fResult);
        }
    }

    private void ShowMessage(String Message)
    {
        Response.Write("<script>alert('" + Message + "!')</script>");
    }
}