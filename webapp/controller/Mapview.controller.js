sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("inventorymanagement.controller.Mapview", {
            onInit: function () {
  
            },

            onClickSpot: function (oEvent) {

                const oRouter = this.getOwnerComponent().getRouter();
                const oContext = oEvent.getSource().getBindingContext("localmodel");
                const sWarehouse = oContext.getProperty("text");   // e.g., "Delhi", "New York"
                const sCoordinates = oContext.getProperty("pos");  // e.g., "77.1024902;28.7040592;0"
            
                // Navigate to 'Warehouse' with warehouse name and coordinates as parameters
                oRouter.navTo("routedetails", {
                    text: sWarehouse,
                    coordinates: sCoordinates
                });
            },
           
        });
    });