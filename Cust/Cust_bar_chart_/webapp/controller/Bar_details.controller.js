sap.ui.define([
		"custom/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"custom/model/formatter",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator"
	], function (BaseController, JSONModel, History, formatter, Filter, FilterOperator) {
		"use strict";

		return BaseController.extend("custom.controller.Bar_details", {

			formatter: formatter,

	onInit: function () {
          
			var whole_model_json = sap.ui.getCore().getModel("bar_model").getJSON();
			var whole_data = JSON.parse(whole_model_json).d.results;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			//var bar_selected = sap.ui.getCore().getModel("bar_selected");
			//alert(bar_selected.ba);
			/*START B
			var j_model = new sap.ui.model.json.JSONModel();
			var bar_detail_object = new Object();
            
			bar_detail_object.Date = bar_selected.ba;
			bar_detail_object.Delta = bar_selected.fa;
			bar_detail_object.Current = bar_selected.pa;
			j_model.setData(bar_detail_object);
			sap.ui.getCore().setModel(j_model, "bar_detail_object_model");
			END B*/
			
			oRouter.getRoute("bar_details").attachMatched(this._onRouteMatched, this);
		},
		
		_onRouteMatched : function () {
			var j_model = new sap.ui.model.json.JSONModel();
			//var Month = new sap.ui.model.json.JSONModel();
			
						/*START BS */
			var bar_selected= sap.ui.getCore().getModel("bar_selected");
			var j_model = new sap.ui.model.json.JSONModel();
			var bar_detail_object = new Object();
            
			bar_detail_object.Date = bar_selected.ba;
			bar_detail_object.Delta = bar_selected.fa;
			bar_detail_object.Current = bar_selected.pa;
			console.log("date " + bar_detail_object.Date);
			console.log("current " + bar_detail_object.Current);
			console.log("delta " + bar_detail_object.Delta);
			j_model.setData(bar_detail_object);
			sap.ui.getCore().setModel(j_model, "bar_detail_object_model");
			/*END BS*/
			j_model.setData(JSON.parse(sap.ui.getCore().getModel("bar_detail_object_model").getJSON()));
			this.setModel(j_model);
			//this.setModel(Month);
		}
		
	
		
		});
		
	}
);