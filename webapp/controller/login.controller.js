sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"],
  function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("inventorymanagement.controller.Login", {
       onInit: function () {
            // Create a JSON model
            var oModel = new JSONModel();

            // Load local JSON data (assuming the file is named 'data.json' in the 'model' folder)
            oModel.loadData(sap.ui.require.toUrl("inventorymanagement/model/company.json"));

            // Set the model to the view
            this.getView().setModel(oModel);
        },
        
        loginsucess: function(oEvent) {
          // Assuming you want to get the selected company key or any other relevant information
          var sWarehouse = this.byId("companySelect").getSelectedKey();
          
          // Get the router
          var oRouter = this.getOwnerComponent().getRouter();
        
          // Navigate to the route with the parameter
          oRouter.navTo("routemap", {
            text: sWarehouse,
          });
        },
        

      onLoginPress: function (oEvent) {
        // Get selected company, username, and password
        var sCompany = this.byId("companySelect").getSelectedKey();
        var sUsername = this.byId("usernameInput").getValue();
        var sPassword = this.byId("passwordInput").getValue();

        // You can add your authentication logic here
        if (sUsername && sPassword && sCompany) {
          // Perform authentication
          this.loginsucess();
          console.log("Authenticating for company:", sCompany);
        } else {
          sap.m.MessageToast.show("Please fill all fields.");
        }
       
      },
    });
  }
);
