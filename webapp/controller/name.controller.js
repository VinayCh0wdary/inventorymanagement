sap.ui.define([
    "sap/ui/core/mvc/Controller",
     "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("inventorymanagement.controller.name", {
            onInit: function () {
                const sPath = sap.ui.require.toUrl("inventorymanagement/image/aim.png");
                const oModel = new JSONModel({ imagePath: sPath });
                this.getView().setModel(oModel, "view");
            },

            onPress: function (oEvent) {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            // Navigate to the target route
            oRouter.navTo("routelogin");
            },
           
        });
    });