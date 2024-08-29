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
                var oRouter = this.getOwnerComponent().getRouter();
                var sWarehouse = oEvent.getSource().getText();

                // var oItem = this.getView().byId("CID").getValue();
                // var obj = {
                // 	"warehouse": sWarehouse,
                // };
                //oRouter.navTo("RouteToScantag");
                oRouter.navTo("routedetails", {
                    text: sWarehouse
                });
                // var oRouter = this.getOwnerComponent().getRouter();
                // oRouter.navTo("routedetails", {});

            },
            // onSelectionChanged: function(oEvent) {
            //     var aSelectedElements = oEvent.getParameter("elements");
            //     // Process the selected data
            //     this.processSelectedData(aSelectedElements);
            // },

            // processSelectedData: function(aSelectedElements) {
            //     if (aSelectedElements && aSelectedElements.length > 0) {
            //         var selectedText = aSelectedElements[0].getText(); // Replace with the actual method to get text
            //         // Use the selected text as needed
            //         console.log("Selected Text:", selectedText);
            //     }
            // }
            // onPressGoto:function(oEvent)
            // {
            //     var oRouter = this.getOwnerComponent().getRouter();
            //     oRouter.navTo("routechart", {
                   
            //     });   
            // }
        });
    });