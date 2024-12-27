sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"],
  function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("inventorymanagement.controller.Login", {
      onInit: function () {
      },
      loginsucess: function (role, warehouse) {
        var oLocalModel = this.getOwnerComponent().getModel("localmodel");
        oLocalModel.setProperty("/UserRole", role);
        oLocalModel.setProperty("/isUploadButtonVisible", role === "Admin");
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("routemap", {
          text: warehouse,
          role: role,
        });
      },
      onLoginPress: function (oEvent) {
        var sCompany = "Kelloges"; // Static company name
        var sUsername = this.byId("usernameInput").getValue();
        var sPassword = this.byId("passwordInput").getValue();
        var aUsers = [
          {
            username: "admin", password: "adminPass",role: "Admin", 
          },
          {
            username: "employee",password: "employeepass",role: "Employee",
          },
        ];
        var user = aUsers.find(function (user) {
          return user.username === sUsername && user.password === sPassword;
        });
        if (user) {
          this.loginsucess(user.role, sCompany); // Pass the static company name
          console.log("Logged in as:", user.role);
        } else {
          // If authentication fails
          sap.m.MessageToast.show("Invalid username or password.");
        }
      },
    });
  }
);
