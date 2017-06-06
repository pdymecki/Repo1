sap.ui.define([
		"custom/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"custom/model/formatter",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator"
	], function (BaseController, JSONModel, History, formatter, Filter, FilterOperator) {
		"use strict";

		return BaseController.extend("custom.controller.Pie_Process_Step", {

			formatter: formatter,

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			/**
			 * Called when the worklist controller is instantiated.
			 * @public
			 */
			onInit : function () {
				
			var pi_data_json = sap.ui.getCore().getModel("piModel").getJSON();
			
			var pi_data_array= JSON.parse(pi_data_json);
			var pi_data=pi_data_array.d.results;
			
		
			function business_area_exists(item){
				for(var i=0;i<business_areas.length;i++){
					if(business_areas[i].name==item){
						business_areas[i].count=business_areas[i].count+1;
						return true;
					}
				}
				return false;
			}
			
			function get_percentage(_count){
				var total = business_areas_all.length;
				var result= (_count/total)*100;
				return parseFloat(Math.round(result * 100) / 100).toFixed(2);//Rounding to 2 decimal places
			}
			var business_areas_all=[];
			
			for(var i=0;i<pi_data.length;i++){
				if(pi_data[i].Processstep.length>0)
				business_areas_all.push(pi_data[i].Processstep);
			}
		
			var business_areas=[];
			
				
				for(var i=0;i<business_areas_all.length;i++){
					if(!business_area_exists(business_areas_all[i])){
						var temp_obj = new Object();
						temp_obj.name = business_areas_all[i];
						temp_obj.count=1;
						business_areas.push(temp_obj);
					}
				}
				
			
		for(var i=0;i<business_areas.length;i++){
				//str=str+business_areas[i].name+"     "+business_areas[i].count+"\n";
					business_areas[i].name=business_areas[i].name+" ("+business_areas[i].count+") "+get_percentage(business_areas[i].count)+"%";
			}
			var pi_object = new Object();
			pi_object.Business_Areas = business_areas;
		
		
				var oVizFrame = this.getView().byId("idpiechart");
				var oModel = new sap.ui.model.json.JSONModel();
		
	
		oModel.setData(pi_object);
				
				var oDataset = new sap.viz.ui5.data.FlattenedDataset({
					dimensions : [{
			        name : 'name',
					value : "{name}"}],
			               
			measures : [{
				name : 'count',
				value : '{count}'} ],
			             
			data : {
				path : "/Business_Areas"
			}
					             
				
			});	
			
			oVizFrame.setDataset(oDataset);
			oVizFrame.setModel(oModel);	
			
			
			oVizFrame.setVizProperties({
			title:{
				text : "Process Step"
			},
            plotArea: {
        //    	colorPalette : d3.scale.category20().range(),
        //    	drawingEffect: "glossy"
                },
				interaction : { 
					selectability : { 
						mode : "single"
						} 
					
				}
				
			});
		
		var feedSize = new sap.viz.ui5.controls.common.feeds.FeedItem({
		      'uid': "size",
		      'type': "Measure",
		      'values': ["count"]
		    }), 
		    feedColor = new sap.viz.ui5.controls.common.feeds.FeedItem({
		      'uid': "color",
		      'type': "Dimension",
		      'values': ["name"]
		    });
		oVizFrame.addFeed(feedSize);
		oVizFrame.addFeed(feedColor);
			},
			try: function(){
				alert(sap.ui.getCore().getModel("piModel").getJSON());
			}
		});
	}
);