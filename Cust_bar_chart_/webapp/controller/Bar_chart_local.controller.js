sap.ui.define([
	"custom/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"custom/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(BaseController, JSONModel, History, formatter, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("custom.controller.Bar_chart_local", {
	 _selectedData: [],

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		 
		onInit: function() {

			var oVizFrame = new sap.viz.ui5.controls.VizFrame({
				height: "700px",
				width: "1000px",
				vizType: "info/dual_stacked_combination",
				uiConfig: {
					applicationSet: "fiori"
				}
			});

			var bar_data_json = sap.ui.getCore().getModel("bar_model").getJSON();
			var bar_data_array = JSON.parse(bar_data_json);
			bar_data_array = bar_data_array.d.results;

			//alert(parseInt(bar_data_array[0].CreatedOn.slice(6,bar_data_array[0].CreatedOn.length-2)));
			var bar_data = [];
			for (var i = 0; i < bar_data_array.length; i++) {
			//	console.log("before if stmt " + bar_data_array[i].Devclass);
				 if (bar_data_array[i].Devclass == '$TMP') { 
				 	console.log(bar_data_array[i].Devclass);
				if (bar_data_array[i].CreatedOn != null) {
					var temp = (new Date(parseInt(bar_data_array[i].CreatedOn.slice(6, bar_data_array[i].CreatedOn.length - 2)))).getFullYear();

					bar_data.push(temp);
				} else if (bar_data_array[i].Createdon != null) {
					temp = (new Date(parseInt(bar_data_array[i].Createdon.slice(6, bar_data_array[i].Createdon.length - 2)))).getFullYear();
					//temp = (new Date(parseInt(bar_data_array[i].Createdon.slice(6, bar_data_array[0].Createdon.length - 2)))).getFullYear();
					bar_data.push(temp);

				} else if (bar_data_array[i].Cdat != null) {
					var temp = (new Date(parseInt(bar_data_array[i].Cdat.slice(6, bar_data_array[i].Cdat.length - 2)))).getFullYear();
					bar_data.push(temp);
				} else if (bar_data_array[i].AS4DATE != null) {
					var temp = (new Date(parseInt(bar_data_array[i].AS4DATE.slice(6, bar_data_array[i].AS4DATE.length - 2)))).getFullYear();
					bar_data.push(temp);
				} else
					bar_data.push(2012);
			}
			}

			var hash = {};

			var parsed_date = bar_data;
			
			var bar_array = [];
			for (var i = 0; i < parsed_date.length; i++) {
				if (hash[parsed_date[i]] == undefined) {
					hash[parsed_date[i]] = {};
					hash[parsed_date[i]].count = 1;
				} else
					hash[parsed_date[i]].count = hash[parsed_date[i]].count + 1;
			}
			var hash_keys = Object.keys(hash);
			hash_keys = hash_keys.sort();
			var cum_count = 0;

			for (var i = 0; i < hash_keys.length; i++) {
				var temp_obj = new Object();
				
			//	console.log("Cum Count " + cum_count);
				temp_obj.Year = hash_keys[i];
				if(i == 0){
					temp_obj.Value = hash[hash_keys[i]].count - hash[hash_keys[i]].count;
				}else{
					temp_obj.Value = hash[hash_keys[i-1]].count + cum_count;
				}
				
				
			
				temp_obj.Diff =  hash[hash_keys[i]].count;
				//	console.log(hash[hash_keys[i]].count + cum_count + " && previously: " + hash[hash_keys[i]].count );
			
				
				cum_count = temp_obj.Value;

				bar_array.push(temp_obj);
			}
			//alert(Object.length(hash));
			//alert(hash[1930].count);
			console.log("object: %O", hash);
			var bar_model = new sap.ui.model.json.JSONModel();
			var bar_object = new Object();
			bar_object.Objects = bar_array;
			bar_model.setData(bar_object);

			var oVizFrame = this.getView().byId("idcolumn");

			//      2.Create a JSON Model and set the data
			var oModel = new sap.ui.model.json.JSONModel();
			var data = {
				'Population': [{
					"Year": "2010",
					"Value": "158626687",
					//"Diff" : "123"
				}, {
					"Year": "2011",
					"Value": "531160986",
				//	"Diff" : "124"
				}, {
					"Year": "2012",
					"Value": "915105168",
				//	"Diff" : "125"
				}, {
					"Year": "2013",
					"Value": "1093786762",
				//	"Diff" : "126"
				}, {
					"Year": "2014",
					"Value": "1274018495",
				//	"Diff" : "127"
				}]
			};
			oModel.setData(data);

			//      3. Create Viz dataset to feed to the data to the graph
			var oDataset = new sap.viz.ui5.data.FlattenedDataset({
				dimensions: [{
					name: 'Year',
					value: "{Year}"
					
				}],

				measures: [{
					name: 'Delta',
					value: '{Diff}'
				}, {
					name: 'Current',
					value: '{Value}'
				}],

				data: {
					path: "/Objects"
				}
			});
			oVizFrame.setDataset(oDataset);
			oVizFrame.setModel(bar_model);

			//      4.Set Viz properties

			oVizFrame.setVizProperties({
				title: {
					text: "Objects created in RPD"
				},
				plotArea: {
					colorPalette: d3.scale.category20().range(),
					dataShape: {
						secondaryAxis: ["bar", "bar"]
					},
					dataLabel:{
                      showTotal: true
                 }
				},
					valueAxis: {
					title: {
						visible: true,
						text: "Number of Items"
					}
				},
				categoryAxis: {
					title: {
						visible: true,
						text: "Year"
					}
				},
				interaction : { 
					selectability : { 
						mode : "single"
						} 
					
				}
			});

			var feedSecondaryValues = new sap.viz.ui5.controls.common.feeds.FeedItem({
					'uid': "valueAxis",
					'type': "Measure",
					'values': ["Delta", "Current"]
				}),
				feedAxisLabels = new sap.viz.ui5.controls.common.feeds.FeedItem({
					'uid': "categoryAxis",
					'type': "Dimension",
					'values': ["Year"]
				});

			oVizFrame.addFeed(feedSecondaryValues);
			oVizFrame.addFeed(feedAxisLabels);

		},
		onSelectM: function(event) {			
			   var data = event.getParameter("data");
			//	console.log("object: %O", data);
			//	console.log(data[0].data.Year);
			//	console.log(data[0].data.Delta);
			//	console.log(data[0].data);
				var Year = new Object();
				this._selectedData.push(data[0].data.Year);
				//Month.ba=data[0].data.Month.split(" ")[0];
		
				Year.ba=data[0].data.Year;
				Year.fa=data[0].data.Delta;
				Year.pa=data[0].data.Current;
				var j_model = new sap.ui.model.json.JSONModel();
				j_model.setData(Year);
				sap.ui.getCore().setModel(Year,"bar_selected");
				//sap.ui.getCore().setModel(Month,"idcolumn");
				this.getRouter().navTo("bar_details", {
					CustId: Year.ba
					//CustId: data[0].data.Month
				});
		},
		

		bar_details_page: function() {
			this.getRouter().navTo("bar_details");
		}

	});
});