sap.ui.define([
	"custom/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"custom/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(BaseController, JSONModel, History, formatter, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("custom.controller.Bar_chart_month", {
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
			var today = new Date();

			var previousMonths = today.getMonth() - 6;

			var months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November",
				"December"
			];

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
				 if (bar_data_array[i].Devclass != '$TMP') { //
				if (bar_data_array[i].CreatedOn != null) {
					var temp = (new Date(parseInt(bar_data_array[i].CreatedOn.slice(6, bar_data_array[i].CreatedOn.length - 2))));

					// Filter Years (Current & Prev)
					if (temp.getFullYear() === today.getFullYear() || temp.getFullYear() === (today.getFullYear() - 1)) {
						//filters the months to only include the last 6 months (excluding the current year)
						if (temp.getMonth() < today.getMonth() && (temp.getMonth()) >= (today.getMonth() - 6)) {
							//	if((today.getMonth() - temp.getMonth()) > 0){

							//uses values that are in the current year
							if (temp.getFullYear() === today.getFullYear()) {
								bar_data.push(months[temp.getMonth()] + " " + today.getFullYear());
							}
							//	}

						}

						//if months fall into the previous year
						if (previousMonths < 0) {
							//checks how many months to go back starting from December
							if (temp.getMonth() >= (months.length - Math.abs(previousMonths))) {
								// uses values that are in the previous year
								if (temp.getFullYear() === today.getFullYear() - 1) {
									bar_data.push(months[temp.getMonth()] + " " + (today.getFullYear() - 1));
								}

							}
						}

					}

				}
			}//
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
				if(i === 0){
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
					"Value": "158626687"
				}, {
					"Year": "2011",
					"Value": "531160986"
				}, {
					"Year": "2012",
					"Value": "915105168"
				}, {
					"Year": "2013",
					"Value": "1093786762"
				}, {
					"Year": "2014",
					"Value": "1274018495"
				}]
			};
			oModel.setData(data);

			//      3. Create Viz dataset to feed to the data to the graph
			var oDataset = new sap.viz.ui5.data.FlattenedDataset({
				dimensions: [{
					name: 'Month',
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
						text: "Month"
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
					'values': ["Month"]
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
				var Month = new Object();
				this._selectedData.push(data[0].data.Month);
				//Month.ba=data[0].data.Month.split(" ")[0];
		
				Month.ba=data[0].data.Month;
				Month.fa=data[0].data.Delta;
				Month.pa=data[0].data.Current;
				var j_model = new sap.ui.model.json.JSONModel();
				j_model.setData(Month);
				sap.ui.getCore().setModel(Month,"bar_selected");
				//sap.ui.getCore().setModel(Month,"idcolumn");
				this.getRouter().navTo("bar_details", {
					CustId: Month.ba
					//CustId: data[0].data.Month
				});
		},
		
		bar_details_page: function() {
			this.getRouter().navTo("bar_details");
		}

	});
});