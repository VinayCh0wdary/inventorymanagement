sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    "sap/ui/model/json/JSONModel",
    'sap/ui/export/library',
    'sap/ui/export/Spreadsheet',
    'sap/m/MessageToast'
],
    function (Controller, Filter, FilterOperator, JSONModel, exportLibrary, Spreadsheet, MessageToast) {
        "use strict";
        var EdmType = exportLibrary.EdmType;

        return Controller.extend("inventorymanagement.controller.Warehouse1", {
            onInit: function () {
                // Set up local models
                this.localmodel = this.getView().getModel("localmodel");
                var oRouter = this.getOwnerComponent().getRouter();
                var oModel = this.getView().getModel("localmodel");
                this.getView().setModel(oModel);
                oRouter.getRoute("routedetails").attachMatched(this._onRouteMatched, this);
                this.oFilterBar = this.getView().byId("filterbar");
                this.oTable = this.getView().byId("table");

                var oTableModel = new JSONModel();
                this.getView().setModel(oTableModel, "tableData");

                // Load data from local storage if exists
                this._loadFromSessionStorage();
            },
            uploadButtonPress: function (oEvent) {
                // Get uploaded raw data
                const rawData = oEvent.getParameter("rawData");

                // Save to the model for binding to table
                const model = this.getView().getModel("tableData");
                model.setData(rawData);

                // Save data to local storage
                this._saveToSessionStorage(rawData);

                // Notify the user
                MessageToast.show("Data uploaded and saved to local storage!");
            },
            // Save data to session storage
            _saveToSessionStorage: function (data) {
                try {
                    const jsonData = JSON.stringify(data);  // Convert data to JSON string
                    sessionStorage.setItem("uploadedData", jsonData);  // Save to session storage
                } catch (e) {
                    console.error("Failed to save to session storage:", e);
                }
            },

            // Load data from session storage and bind to table
            _loadFromSessionStorage: function () {
                try {
                    const storedData = sessionStorage.getItem("uploadedData");
                    if (storedData) {
                        const parsedData = JSON.parse(storedData);  // Parse the JSON string
                        const model = this.getView().getModel("tableData");
                        model.setData(parsedData);  // Set the data to the model
                        MessageToast.show("Data loaded from session storage!");
                    }
                } catch (e) {
                    console.error("Failed to load from session storage:", e);
                }
            },

            _onRouteMatched: function (oEvent) {
                // var selectedItem = oEvent.getParameter("arguments").selectedItem;
                var warehouse = oEvent.getParameter("arguments").text;
                var localmodel = this.getView().getModel("localmodel");
                var data = localmodel.getData();

                if (warehouse == "Warehouse111") {
                    localmodel.setProperty("/Warehouse", data.Warehouse111);
                } else if (warehouse == "Warehouse222") {
                    localmodel.setProperty("/Warehouse", data.Warehouse222);
                } else {
                    localmodel.setProperty("/Warehouse", data.Warehouse333);
                }
                localmodel.setProperty("/WarehouseName", warehouse);
            },
            onSearch: function () {
                var aTableFilters = this.oFilterBar.getFilterGroupItems().reduce(function (aResult, oFilterGroupItem) {
                    var oControl = oFilterGroupItem.getControl(),
                        aSelectedKeys = oControl.getSelectedKeys(),
                        // aSelectedKeys = oControl.getProperty("value"),
                        // sPath = oControl.getBindingInfo("items").path.split("/")[1],
                        aFilters = aSelectedKeys.map(function (sSelectedKey) {
                            return new Filter({
                                path: oFilterGroupItem.getName(),
                                operator: FilterOperator.Contains,
                                value1: sSelectedKey
                            });
                        });

                    // aFilters = new Filter({
                    //     path: sPath,
                    //     operator: FilterOperator.Contains,
                    //     value1: aSelectedKeys
                    // });

                    if (aSelectedKeys.length > 0) {
                        aResult.push(new Filter({
                            filters: aFilters
                        }));
                    }

                    return aResult;
                }, []);

                this.oTable.getBinding("items").filter(aTableFilters);
                this.oTable.setShowOverlay(false);
            },
            // onChange: function (oEvent) {

            //     var oRouter = this.getOwnerComponent().getRouter();
            //     var selecteditems = oEvent.getSource().getSelectedItem().getBindingContext("localmodel");
            //     var ProductCollection = selecteditems.getObject().ProductID;
            //     //var oItem = this.getView().byId("CID").getValue();
            //     //oRouter.navTo("RouteToScantag");
            //     // var obj = this.getView().getModel("localmodel").getData();
            //     // var oTable = this.getView().byId('table');


            //     // var aSelectedItems = oTable.getSelectedItems();
            //     // //var aSelectedItems = oTable.getSelectedItems();

            //     // // Iterate through selected items and retrieve their data
            //     // aSelectedItems.forEach(function (oSelectedItem) {
            //     //     var oContext = oSelectedItem.getBindingContext();
            //     //     var oSelectedData = oContext.getObject(); // This will give you the data of the selected item
            //     //     console.log(oSelectedData); // Do whatever you want with the selected data
            //     // });

            //     // var ID = oEvent.getParameters().listItem.getProperty("title")
            //     // var ProductCollection = oEvent.getParameters().listItem.getProperty("title")
            //     oRouter.navTo("routeproduct", {
            //         ProductCollection
            //         // oRouter.navTo("routeproduct", {

            //     });
            // },
            onChange: function (oEvent) {
                var oRouter = this.getOwnerComponent().getRouter();
                var selectedItem = oEvent.getSource().getSelectedItem();

                // Check if selectedItem is defined
                if (selectedItem) {
                    var selectedContext = selectedItem.getBindingContext("localmodel");
                    if (selectedContext) {
                        var ProductCollection = selectedContext.getObject().ProductID;
                        oRouter.navTo("routeproduct", { ProductCollection });
                    } else {
                        console.error("Binding context not found");
                    }
                } else {
                    console.error("No item selected");
                }
            },

            onPressGoto: function (oEvent) {
                var oRouter = this.getOwnerComponent().getRouter();
                // var selecteditems = oEvent.getSource().getSelectedItem().getBindingContext("localmodel");
                // var ProductCollection = selecteditems.getObject().ProductID;
                oRouter.navTo("routechart", {

                });
            },
            createColumnConfig: function () {
                return [
                    {
                        label: 'ProductID',
                        property: 'ProductID',
                        type: EdmType.Number,
                        scale: 0
                    },
                    {
                        label: 'Name',
                        property: 'Name',
                        type: EdmType.String
                    },
                    {
                        label: 'Manufacturer',
                        property: 'Manufacturer',
                        width: '25'
                    },
                    {
                        label: 'Storage',
                        property: 'Storage',
                        width: '25'
                    },
                    {
                        label: 'Section',
                        property: 'Section',
                        width: '18'
                    },
                    {
                        label: 'Bin',
                        property: 'Bin',
                        type: EdmType.String
                    },
                    {
                        label: 'Rack',
                        property: 'Rack',
                        type: EdmType.String
                    }
                ];
            },

            onExport: function () {
                var aCols, oBinding, oSettings, oSheet, oTable;

                oTable = this.byId('table');
                oBinding = oTable.getBinding('items');
                aCols = this.createColumnConfig();

                oSettings = {
                    workbook: { columns: aCols },
                    dataSource: oBinding
                };

                oSheet = new Spreadsheet(oSettings);
                oSheet.build()
                    .then(function () {
                        MessageToast.show('Spreadsheet export has finished');
                    }).finally(function () {
                        oSheet.destroy();
                    });
            }
        });
    });
