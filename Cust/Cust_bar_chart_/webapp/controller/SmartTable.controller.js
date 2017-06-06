sap.ui.define([
		"custom/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"custom/model/formatter",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator"
	], function (BaseController, JSONModel, History, formatter, Filter, FilterOperator) {
		"use strict";

		return BaseController.extend("custom.controller.SmartTable", {

	onInit: function() {
		this._oPriceFilter = null;
		this._oGlobalFilter = null;
		/*
		var oModel, oView;
		jQuery.sap.require("sap.ui.core.util.MockServer");
		var oMockServer = new sap.ui.core.util.MockServer({
			rootUri: "sapuicompsmarttable/"
		});
		this._oMockServer = oMockServer;
		oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smarttable/mockserver/metadata.xml", "test-resources/sap/ui/comp/demokit/sample/smarttable/mockserver/");
		oMockServer.start();
		oModel = new sap.ui.model.odata.ODataModel("sapuicompsmarttable", true);
		oModel.setCountSupported(false);
		oView = this.getView();
		oView.setModel(oModel);
		*/
	},
	onExit: function() {
		/*
		this._oMockServer.stop();
		*/
	},
	
	onSearch: function() {
		/*
		this._oMockServer.stop();
		*/
	
		var smart_table = this.byId("list");
		
	},
	_filter : function () {
			var oFilter = null;

			if (this._oGlobalFilter && this._oPriceFilter) {
				console.log("if");
				oFilter = new sap.ui.model.Filter([this._oGlobalFilter, this._oPriceFilter], true);
			} else if (this._oGlobalFilter) {
				console.log("if1");
				oFilter = this._oGlobalFilter;
			} else if (this._oPriceFilter) {
				console.log("if2");
				oFilter = this._oPriceFilter;
			}
			
			console.log("before odata call");

			this.getView().byId("list").getBinding("items").filter(oFilter, "Application");
			console.log("after odata call");
		},

		filterGlobally : function(oEvent) {
			
			var sQuery = oEvent.getParameter("query");
			console.log(sQuery);
			this._oGlobalFilter = null;

			if (sQuery) {
				this._oGlobalFilter = new Filter([
					new Filter("Businessprocess", FilterOperator.EQ, sQuery)
				], false)
			}
			console.log("before call");
			this._filter();
			console.log("after call");
			
		}
});


	}
);