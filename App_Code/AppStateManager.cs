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
using MapInfo.Engine;
using MapInfo.Geometry;
using MapInfo.Mapping;
using MapInfo.WebControls;

/// <summary>
/// Summary description for AppStateManager
/// </summary>
namespace ApplicationStateManager
{
    /// <summary>
    /// State management can be complex operation. It is efficient to save and restore what is needed.
    /// The method used here is described in the BEST PRACTISES documentation. This is a template application
    /// which changes zoom, center, default selection and layer visibility. Hence we save and restore only these objects.
    /// </summary>
    [Serializable]
    public class AppStateManager : StateManager
    {
        public AppStateManager()
        {
        }

        // Restore the users state
        public override void RestoreState()
        {
            string mapAlias = ParamsDictionary[ActiveMapAliasKey] as string;
            Map map = GetMapObj(mapAlias);

            // If this is a clean pooled object save the default state for new users to 
            // access later.
            if (!IsDirtyMapXtremeSession(map))
            {
                SaveDefaultState(map);
            }

            // If it was user's first time and the session is dirty, restore the default state.
            if (IsUsersFirstTime())
            {
                if (IsDirtyMapXtremeSession(map))
                {
                    RestoreDefaultState(map);
                }
            }
            else
            {
                // If this is an existing user then restore the last state they saved
                // Make sure to also check if this is a clean or dirty pooled object, you may
                // have to restore some base state or tables prior to restoring users state. The best
                // practice is to save all modified or added MapXtreme objects to the users state
                // and restore them in the correct order. But in some instances clean up or
                // initialization of the pooled MapXtreme Session may be necessary
                if (IsDirtyMapXtremeSession(map))
                {
                    // TODO: Manual work to prepare the dirty Pooled MapXtreme Session instance
                }
                else
                {
                    // TODO: Manual work to prepare the clean Pooled MapXtreme Session instance
                }
                RestoreZoomCenterState(map);

                // Just by deserializing the binary stream we reset the MapFactory Deault layers collection
                // Any MapXtreme class that supports the ISerializable interface will automatically be 
                // restored to the current MapXtreme Session.
                ManualSerializer.RestoreMapXtremeObjectFromHttpSession("Layers");
                ManualSerializer.RestoreMapXtremeObjectFromHttpSession("Selection");
            }
        }

        // Save the users current state
        public override void SaveState()
        {
            string mapAlias = ParamsDictionary[ActiveMapAliasKey] as string;
            Map map = GetMapObj(mapAlias);

            if (map != null)
            {
                SaveZoomCenterState(map);
                ManualSerializer.SaveMapXtremeObjectIntoHttpSession(map.Layers, "Layers");
                ManualSerializer.SaveMapXtremeObjectIntoHttpSession(MapInfo.Engine.Session.Current.Selections.DefaultSelection, "Selection");
                // Mark the users HTTPSession as dirty
                HttpContext.Current.Session["UserDirtyFlag"] = true;
            }
        }

        // Check if this is user's first time accessing this page. 
        private bool IsUsersFirstTime()
        {
            return (HttpContext.Current.Session["UserDirtyFlag"] == null);
        }

        // This method checks if the mapinfo session from the pool is dirty or clean
        private bool IsDirtyMapXtremeSession(Map map)
        {
            // Check if the MapXtreme session is dirty

            return (MapInfo.Engine.Session.Current.CustomProperties["DirtyFlag"] != null);
        }

        // When the MapXtreme Session is not dirty save the initial state of this session read from the 
        // initial workspace from the web.config.
        private void SaveDefaultState(Map map)
        {
            HttpApplicationState application = HttpContext.Current.Application;
            if (application["DefaultZoom"] == null)
            {
                // Store default selection
                application["DefaultSelection"] = ManualSerializer.BinaryStreamFromObject(MapInfo.Engine.Session.Current.Selections.DefaultSelection);
                // Store layers collection
                application["DefaultLayers"] = ManualSerializer.BinaryStreamFromObject(map.Layers);
                // Store the original zoom and center.
                application["DefaultCenter"] = map.Center;
                application["DefaultZoom"] = map.Zoom;
            }
            // This pooled MapXtreme Session instance should be marked as dirty
            MapInfo.Engine.Session.Current.CustomProperties["DirtyFlag"] = true;
        }

        // When session is dirty but it is first time for user, this will be applied to give users it's initial state
        private void RestoreDefaultState(Map map)
        {
            HttpApplicationState application = HttpContext.Current.Application;
            // Get the default layers, center, and zoomfrom the Application. Clear Layers first, 
            // this resets the zoom and center which we will set later
            map.Layers.Clear();

            // Just by deserializing the binary stream we reset the MapFactory Deault layers collection
            // Any MapXtreme class that supports the ISerializable interface will automatically be 
            // restored to the current MapXtreme Session. 
            byte[] bytes = application["DefaultLayers"] as byte[];
            Object obj = ManualSerializer.ObjectFromBinaryStream(bytes);

            // Deserialzing rules are the same for the default selection
            bytes = application["DefaultSelection"] as byte[];
            obj = ManualSerializer.ObjectFromBinaryStream(bytes);

            // For zoom and center, these are simple types and need to be assigned to the map object.
            map.Zoom = (MapInfo.Geometry.Distance)application["DefaultZoom"];
            map.Center = (DPoint)application["DefaultCenter"];
        }

        // Return the Map from the Sessions MapFactory based on Alias. If not found return 
        // the first map in the collection.
        private Map GetMapObj(string mapAlias)
        {
            Map map = null;
            if (mapAlias == null || mapAlias.Length <= 0)
            {
                map = MapInfo.Engine.Session.Current.MapFactory[0];
            }
            else
            {
                map = MapInfo.Engine.Session.Current.MapFactory[mapAlias];
                if (map == null) map = MapInfo.Engine.Session.Current.MapFactory[0];
            }
            return map;
        }
    }
}
