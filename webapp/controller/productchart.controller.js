sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/viz/ui5/format/ChartFormatter',
    'sap/viz/ui5/api/env/Format'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,ChartFormatter,Format) {
        "use strict";

        return Controller.extend("inventorymanagement.controller.productchart", {
            onInit: function () {
                var oVizFrame1 = this.oVizFrame1 = this.getView().byId("idVizFrame2");
                Format.numericFormatter(ChartFormatter.getInstance());
                var formatPattern = ChartFormatter.DefaultPattern;


                var oPopOver1 = this.getView().byId("idPopOver1");
                oPopOver1.connect(oVizFrame1.getVizUid());
                oPopOver1.setFormatString(formatPattern.STANDARDFLOAT);
            }

        });
    });
