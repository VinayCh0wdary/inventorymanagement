sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("inventorymanagement.controller.product", {
            onInit: function () {
                var globalModel = this.getOwnerComponent().getModel("localmodel");
                this.getView().setModel(globalModel, "globalModel");
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("routeproduct").attachMatched(this._onRouteMatched, this);
            },
            _onRouteMatched: function (oEvent) {
                var issue = oEvent.getParameter("arguments").ProductCollection
                var oArgs = JSON.parse(issue);
                var oModel = new sap.ui.model.json.JSONModel(oArgs);
                var sQuery = oArgs;
                var oList = this.getView().getModel("localmodel").getData().ProductCollection;
                // oList.filter(aFilter);
        
                let filteredUsers = [];
                for (let i = 0; i < oList.length; i++) {
                  if (oList[i].Productnumber == sQuery) {
                    filteredUsers = [...filteredUsers, oList[i]];
                  }
                }
        
                // filteredUsers = filteredUsers[0];
                var oModel = new sap.ui.model.json.JSONModel(filteredUsers[0]);
                this.getView().setModel(oModel, "unScanModel");
                console.log(filteredUsers);
        
            },


        });
    });