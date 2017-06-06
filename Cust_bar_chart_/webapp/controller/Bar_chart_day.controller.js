sap.ui.define([
	"custom/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/viz/ui5/controls/common/feeds/FeedItem",
    "sap/viz/ui5/data/FlattenedDataset",
	"sap/ui/core/routing/History",
	"custom/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(BaseController, JSONModel, History, formatter, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("custom.controller.Bar_chart_day", {
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
			// this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		   //this._oRouter.getRoute("bar_details").attachMatched(this.page_refresh, this);
			var today = new Date();
			var remaining = (today.getDate()) - 14;

			var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
			var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

			var oVizFrame = new sap.viz.ui5.controls.VizFrame({
				height: "700px",
				width: "1000px",
				vizType: "info/dual_stacked_combination",
				uiConfig: {
					applicationSet: "fiori"
				}
			});
			var fixMonth =  today.getMonth() < 12 ? today.getMonth() + 1 : 1 ;
			var monthCount = 0;

			var bar_data_json = sap.ui.getCore().getModel("bar_model").getJSON();
			var bar_data_array = JSON.parse(bar_data_json);
			bar_data_array = bar_data_array.d.results;

			var bar_data = [];
			for (var i = 0; i < bar_data_array.length; i++) {
			 if (bar_data_array[i].Devclass != '$TMP') { 
				if (bar_data_array[i].CreatedOn != null) {
				//	console.log("hi: " + bar_data_array[i].Object);

					var temp = (new Date(parseInt(bar_data_array[i].CreatedOn.slice(6, bar_data_array[i].CreatedOn.length - 2))));
                   var limitDate = new Date(parseInt(today.getDate()) - 14);
                 //  console.log("limit " + limitDate);
					if(temp.getMonth() == 4){
							console.log("beofore remaining  " + temp.getMonth() + " " + temp.getDate() + " " + temp.getFullYear());
					}
					//if (temp.getDate() < (today.getDate()) && (temp.getDate() >= ((today.getDate()) - 14))) {
					if (temp.getDate() < (today.getDate()) /*&& (temp.getDate() >= limitDate)) */&&  (temp.getDate() >= ((today.getDate()) - 14)) ) 
					{
					
					
     // console.log("array Month",temp.getMonth());
      //console.log("today Month",today.getMonth());
      //console.log("today Year",today.getFullYear());
      //console.log("array Year",temp.getFullYear()); || (temp.getMonth() === (today.getMonth() - 1))
					//	if (temp.getMonth() === (today.getMonth()) && temp.getFullYear() === today.getFullYear()) {
						
						if (((temp.getMonth() == today.getMonth()) ) && (temp.getFullYear() == today.getFullYear())) {
								
							bar_data.push(months[temp.getMonth() ] + " " + temp.getDate() + " " + temp.getFullYear());
							//console.log("array Month",temp.getMonth());
						}

					}
     
					if (remaining < 0) {
					
						if ((today.getMonth()) === 0) {
							if (temp.getDate() >= (days[days.length - 1] - Math.abs(remaining)) && (temp.getFullYear() === (today.getFullYear() - 1))) {
								bar_data.push(months[days.length - 1] + " " + temp.getDate() + " " + (today.getFullYear() - 1));
								//	monthCount = monthCount + 1;
							}
						} else if ((temp.getMonth() === (today.getMonth() -1)) && temp.getDate() > (days[today.getMonth() ] - Math.abs(remaining)) && (temp.getFullYear() === today.getFullYear())) {
						
							bar_data.push(months[temp.getMonth() ] + " " + temp.getDate() + " " + today.getFullYear());
						    //monthCount = monthCount + 1;
						      //bar_data.push(months[fixMonth - 1] + " " + temp.getDate() + " " + today.getFullYear());
								//bar_data.push(months[temp.getMonth()] + " " + temp.getDate() + " " + temp.getFullYear());
						}

					} 

				}
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
					name: 'Day',
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
					text: "Objects created Daily in RPD"
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
						text: "Day"
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
					'values': ["Day"]

				});

			oVizFrame.addFeed(feedSecondaryValues);
			oVizFrame.addFeed(feedAxisLabels);

			//	alert(feedSecondaryValues.getProperty("values"));
			//	alert(feedSecondaryValues.getValues("Delta"));

		},

		handleListItemPress: function(oItem) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			var j_model = new sap.ui.model.json.JSONModel();
			var bar_detail_object = new Object();
            
			bar_detail_object.Businessprocess = oItem.getSource().getBindingContext().getProperty("Businessprocess");
			bar_detail_object.Month = oItem.getSource().getBindingContext90.getProperty("Month");

			j_model.setData(bar_detail_object);
			sap.ui.getCore().setModel(j_model, "bar_detail_object_model");
            	console.log("handlepress", bar_detail_object.Month);
			oRouter.navTo("bar_details");
			
			/*START */
		
           /*END*/
		},
		   _setupSelectionList: function() {
//this.getView().byId('bar_model').setModel(new JSONModel(this._selectedData));
//this.getView().byId('idcolumn').setModel(new JSONModel(this._selectedData));
        },
		onSelectM: function(event) {			
			   var data = event.getParameter("data");
			
				var Day = new Object();
				this._selectedData.push(data[0].data.Day);
				//Month.ba=data[0].data.Month.split(" ")[0];
				Day.ba=data[0].data.Day;
				Day.fa=data[0].data.Delta;
				Day.pa=data[0].data.Current;
				var j_model = new sap.ui.model.json.JSONModel();
				j_model.setData(Day);
				sap.ui.getCore().setModel(Day,"bar_selected");
				//sap.ui.getCore().setModel(Month,"idcolumn");
				this.getRouter().navTo("bar_details", {
					CustId: Day.ba
					//CustId: data[0].data.Month
				});
		},
		
		m: function(value) {
				var fixedFloat = sap.ui.core.format.NumberFormat.getFloatInstance({
					style: 'Standard',
					maxFractionDigits: 2
				});
				return fixedFloat.format(value);
			},

		bar_details_page: function() {
			this.getRouter().navTo("bar_details");
			//	this.getRouter().navTo("worklist");
		}

	});
});