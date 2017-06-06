sap.ui.define([
		"custom/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"custom/model/formatter",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator"
	], function (BaseController, JSONModel, History, formatter, Filter, FilterOperator) {
		"use strict";

		return BaseController.extend("custom.controller.Details", {

			formatter: formatter,

		onInit: function () {
			var whole_model_json = sap.ui.getCore().getModel("piModel").getJSON();
			var whole_data = JSON.parse(whole_model_json).d.results;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("details").attachMatched(this._onRouteMatched, this);
		},
		
		_onRouteMatched : function () {
			var j_model = new sap.ui.model.json.JSONModel();
			j_model.setData(JSON.parse(sap.ui.getCore().getModel("detail_object_model").getJSON()));
			this.setModel(j_model);
		},
		
		handleNavButtonPress : function (evt) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("home");
		},
		
		onSelectionChange: function(event) {}
		});
	}
);