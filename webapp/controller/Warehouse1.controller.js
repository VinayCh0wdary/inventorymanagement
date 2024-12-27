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
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("routedetails").attachMatched(this._onRouteMatched, this);
            // Get references to important controls and models
            this.oTable = this.getView().byId("table");
            this.oFilterBar = this.getView().byId("filterbar");  // Reference to the FilterBar
            var oTableModel = new JSONModel();
            this.getView().setModel(oTableModel, "tableData");
            this.getView().setModel(this.getOwnerComponent().getModel("localmodel"), "localmodel");
        },
        _onRouteMatched: function (oEvent) {
            const warehouse = oEvent.getParameter("arguments").text;
            const coordinates = oEvent.getParameter("arguments").coordinates;
            this.getView().getModel("localmodel").setProperty("/WarehouseName", warehouse);
            this.getView().getModel("localmodel").setProperty("/WarehouseCoordinates", coordinates);
            this.getView().getModel("tableData").setData([]);
            this._loadFromSessionStorage(coordinates);
        },
        uploadButtonPress: function (oEvent) {
            const rawData = oEvent.getParameter("rawData");
            const tableModel = this.getView().getModel("tableData");
            tableModel.setData(rawData);
            const coordinates = this.getView().getModel("localmodel").getProperty("/WarehouseCoordinates");
            this._saveToSessionStorage(rawData, coordinates);

            MessageToast.show("Data uploaded and saved for this location!");
        },
        _saveToSessionStorage: function (data, coordinates) {
            try {
                const jsonData = JSON.stringify(data);
                sessionStorage.setItem(`warehouseData_${coordinates}`, jsonData);
            } catch (e) {
                console.error("Failed to save to session storage:", e);
            }
        },
        _loadFromSessionStorage: function (coordinates) {
            try {
                const storageKey = `warehouseData_${coordinates}`;
                const storedData = sessionStorage.getItem(storageKey);
                if (storedData) {
                    const parsedData = JSON.parse(storedData);
                    this.getView().getModel("tableData").setData(parsedData);
                    MessageToast.show("Data loaded from session storage for this location!");
                } else {
                    MessageToast.show("No data found for this location.");
                }
            } catch (e) {
                console.error("Failed to load from session storage:", e);
            }
        },
        onSearch: function () {
            // Get the selected values from each filter item
            var aFilters = [];
            // Get selected keys for CI Name filter
            var aCINames = this.getView().byId("SID").getSelectedKeys();
            if (aCINames.length > 0) {
                var oCINameFilter = new Filter({
                    filters: aCINames.map(function (sCIName) {
                        return new Filter("CIName", FilterOperator.EQ, sCIName);
                    }),
                    and: false
                });
                aFilters.push(oCINameFilter);
            }
            // Get selected keys for Domain Name filter
            var aDomainNames = this.getView().byId("SectionId").getSelectedKeys();
            if (aDomainNames.length > 0) {
                var oDomainNameFilter = new Filter({
                    filters: aDomainNames.map(function (sDomainName) {
                        return new Filter("DomainName", FilterOperator.EQ, sDomainName);
                    }),
                    and: false
                });
                aFilters.push(oDomainNameFilter);
            }
            // Get selected keys for Manufacturer filter
            var aManufacturers = this.getView().byId("BinId").getSelectedKeys();
            if (aManufacturers.length > 0) {
                var oManufacturerFilter = new Filter({
                    filters: aManufacturers.map(function (sManufacturer) {
                        return new Filter("Manufacturer", FilterOperator.EQ, sManufacturer);
                    }),
                    and: false
                });
                aFilters.push(oManufacturerFilter);
            }
            // Apply the filters to the table's binding
            var oBinding = this.oTable.getBinding("items");
            oBinding.filter(aFilters);
        },
        onChange: function (oEvent) {
            var oRouter = this.getOwnerComponent().getRouter();
            var selectedItem = oEvent.getSource().getSelectedItem();
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
            oRouter.navTo("routechart", {});
        },
        createColumnConfig: function () {
            return [
                { label: 'CI Name', property: 'CIName', type: EdmType.Number, scale: 0 },
                { label: 'Domain Name', property: 'DomainName', type: EdmType.String },
                { label: 'IP Address', property: 'IPAddress', width: '25' },
                { label: 'CPU', property: 'CPU', width: '25' },
                { label: 'RAM', property: 'RAM', width: '18' },
                { label: 'Manufacturer', property: 'Manufacturer', type: EdmType.String }
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
