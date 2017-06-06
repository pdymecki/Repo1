sap.ui.define([
	"custom/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"custom/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(BaseController, JSONModel, History, formatter, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("custom.controller.Worklist", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function() {
			function wait(_time) {
				//alert("c");
				var t1 = new Date().getTime();
				while (true) {
					var t2 = new Date().getTime();
					if ((t2 - t1) >= _time)
						break;
				}
				return;
			}
			/*
			var piModel = new sap.ui.model.json.JSONModel();
				piModel.loadData("/sap/opu/odata/sap/Z_CDS_CUST_SRV_01/ZCUSTSet");
				
				sap.ui.getCore().setModel(piModel,"piModel");
				wait(5000)
				*/
			//	this.getRouter().navTo("empty");

			//try odata for jsonModel
			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oRouter.getRoute("worklist").attachMatched(this.x, this);

			var data = {
				Process: [{
					name: "Babu"
				}, {
					name: "Kabu"
				}, {
					name: "Jabu"
				}]
			};
			//m.setData(data);

			var oViewModel,
				iOriginalBusyDelay,
				oTable = this.byId("list");
			this._oListSelector = this.getOwnerComponent().oListSelector;

			// keeps the filter and search state

			// Put down worklist table's original value for busy indicator delay,
			// so it can be restored later on. Busy handling on the table is
			// taken care of by the table itself.
			iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
			this._oTable = oTable;
			// keeps the search state
			this._oTableFilterState = {
				aFilter: [],
				aSearch: []
			};

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
				saveAsTileTitle: this.getResourceBundle().getText("saveAsTileTitle", this.getResourceBundle().getText("worklistViewTitle")),
				shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
				shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
				shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
				tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
				tableBusyDelay: 0,

			});
			this.setModel(oViewModel, "worklistView");

			// Make sure, busy indication is showing immediately so there is no
			// break after the busy indication for loading the view's meta data is
			// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			oTable.attachEventOnce("updateFinished", function() {
				// Restore original busy indicator delay for worklist's table
				oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
			});
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished: function(oEvent) {
			// update the worklist's object counter after the table update
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText("worklistTableTitle");
			}
			this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onPress: function(oEvent) {
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource());
		},

		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		onShareInJamPress: function() {
			var oViewModel = this.getModel("worklistView"),
				oShareDialog = sap.ui.getCore().createComponent({
					name: "sap.collaboration.components.fiori.sharing.dialog",
					settings: {
						object: {
							id: location.href,
							share: oViewModel.getProperty("/shareOnJamTitle")
						}
					}
				});
			oShareDialog.open();
		},

		onSearch: function(oEvent) {

			/*

			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
			} else {
			*/
			var oTableSearchState = [];
			this._oTableFilterState.aSearch = [];
			//var sQuery = oEvent.getParameter("query");

			//var search_business_area = this.getView().byId("i1").getText();
			var search_business_area = this.getView().byId("search_business_area").getValue();
			var search_process = this.getView().byId("search_process").getValue();
			var search_process_step = this.getView().byId("search_process_step").getValue();
			var search_wp = this.getView().byId("search_wp").getValue();
			var search_wpd = this.getView().byId("search_wpd").getValue();
			var search_ricefw = this.getView().byId("search_ricefw").getValue();
			var search_ricefw_desc = this.getView().byId("search_ricefw_desc").getValue();
			var search_glm = this.getView().byId("search_glm").getValue();
			var search_gly = this.getView().byId("search_gly").getValue();

			if (search_business_area && search_business_area.length > 0)
				this._oTableFilterState.aSearch.push(new Filter("Businessprocess", FilterOperator.Contains, search_business_area));
			if (search_process != "") {
				this._oTableFilterState.aSearch.push(new Filter("ProcessName", FilterOperator.EQ, search_process));
			}
			if (search_process_step != "") {
				this._oTableFilterState.aSearch.push(new Filter("Processstep", FilterOperator.EQ, search_process_step));
			}

			if (search_wp != "") {
				this._oTableFilterState.aSearch.push(new Filter("WorkPackID", FilterOperator.EQ, search_wp));
			}

			if (search_wpd != "") {
				this._oTableFilterState.aSearch.push(new Filter("WorkPackDesc", FilterOperator.EQ, search_wpd));
			}

			if (search_ricefw != "") {
				this._oTableFilterState.aSearch.push(new Filter("Ricef", FilterOperator.EQ, search_ricefw));
			}
			if (search_ricefw_desc != "")
				this._oTableFilterState.aSearch.push(new Filter("Description", FilterOperator.EQ, search_ricefw_desc));
			if (search_glm != "")
				this._oTableFilterState.aSearch.push(new Filter("RelMo", FilterOperator.EQ, search_glm));
			if (search_gly != "")
				this._oTableFilterState.aSearch.push(new Filter("RelYear", FilterOperator.EQ, search_gly));

			this._applySearch();

			//alert("nnnn");

		},

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh: function() {

			this._oTable.getBinding("items").refresh();
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Shows the selected item on the object page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 
		_showObject: function(oItem) {
			this.getRouter().navTo("object", {
				CustId: oItem.getBindingContext().getProperty("CustId")
			});
		},
*/
//////////MARIAH
		_showObject: function(oItem) {
			this.getRouter().navTo("details", {
				Customerid: oItem.getSource().getBindingContext().getProperty("Customerid")
			});
		},
	
		handleListItemPress: function(oItem) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var j_model = new sap.ui.model.json.JSONModel();
			var detail_object = new Object();
			detail_object.Customerid = oItem.getSource().getBindingContext().getProperty("Customerid");
			detail_object.Businessprocess = oItem.getSource().getBindingContext().getProperty("Businessprocess");
			detail_object.Processstep = oItem.getSource().getBindingContext().getProperty("Processstep");
			detail_object.ProcessName = oItem.getSource().getBindingContext().getProperty("ProcessName");
			detail_object.RelMo = oItem.getSource().getBindingContext().getProperty("RelMo");
			detail_object.Ricef = oItem.getSource().getBindingContext().getProperty("Ricef");
			detail_object.RelYear = oItem.getSource().getBindingContext().getProperty("RelYear");
			detail_object.Description = oItem.getSource().getBindingContext().getProperty("Description");
			detail_object.WorkPackID = oItem.getSource().getBindingContext().getProperty("WorkPackID");
			detail_object.WorkPackDesc = oItem.getSource().getBindingContext().getProperty("WorkPackDesc");
			j_model.setData(detail_object);
			sap.ui.getCore().setModel(j_model,"detail_object_model");

			oRouter.navTo("details");
		},

/////////////////////

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {object} oTableSearchState an array of filters for the search
		 * @private
		 */
		_applySearch: function() {
			//var oViewModel = this.getModel("worklistView");
			var aFilters = this._oTableFilterState.aSearch.concat(this._oTableFilterState.aFilter),
				oViewModel = this.getModel("worklistView");
			//alert(aFilters.toString());
			//	alert(this._oTable.getBinding("items").toString());
			this._oTable.getBinding("items").filter(aFilters, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (this._oTableFilterState.aSearch.length !== 0) {
				oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
			}
		},

	testing: function(){
			alert ("blah");
					var whole_model_json = sap.ui.getCore().getModel("piModel").getJSON();
				var whole_data = JSON.parse(whole_model_json).d.results;
				
				for(var i=0;i<whole_data.length;i++)
				{
					var m = new sap.ui.model.json.JSONModel();
					var temp_obj = new Object();
					temp_obj.Businessprocess=whole_data[i].Businessprocess;
					m.setData(temp_obj);
					sap.ui.getCore().setModel(m,""+whole_data[i].Ricef);
					//alert(JSON.parse((sap.ui.getCore().getModel(""+whole_data[i].Ricef)).getJSON()).Businessprocess+"\n");
				}
			
			},
		show_pie_ba: function() {

			this.getRouter().navTo("pie_business_area");

		},

		show_pie_process: function() {
			this.getRouter().navTo("pie_process");
		},
		show_pie_process_step: function() {
			this.getRouter().navTo("pie_process_step");
		},
		x: function() {

		},
		xy: function() {
			//alert("abc");
			var whole_model_json = sap.ui.getCore().getModel("piModel").getJSON();
			var m = new sap.ui.model.json.JSONModel();
			//	alert(whole_model_json);
			//Data binding for Process
			var whole_data = JSON.parse(whole_model_json).d.results;
			var not_filtered_data = [];
			for (var i = 0; i < whole_data.length; i++)
				if (whole_data[i].ProcessName.length > 0)
					not_filtered_data.push(whole_data[i].ProcessName);
			var filtered_data = not_filtered_data.filter(function(elem, index, self) {
				return index == self.indexOf(elem);
			})
			var ProcessNames_array = [];
			for (var i = 0; i < filtered_data.length; i++) {
				var temp_obj = new Object();
				temp_obj.Name = filtered_data[i];
				ProcessNames_array.push(temp_obj)

			}
			var Process_object = new Object();
			Process_object.Process = ProcessNames_array;
			m.setData(Process_object)
			this.getView().byId("search_process").setModel(m);

			//Data binding for Process step
			var process_step_model = new sap.ui.model.json.JSONModel();
			var not_filtered_process_step = [];
			for (var i = 0; i < whole_data.length; i++)
				if (whole_data[i].Processstep.length > 0)
					not_filtered_process_step.push(whole_data[i].Processstep);
			var filtered_process_step = not_filtered_process_step.filter(function(elem, index, self) {
				return index == self.indexOf(elem);
			})
			var ProcessSteps_array = [];
			for (var i = 0; i < filtered_process_step.length; i++) {
				var temp_obj = new Object();
				temp_obj.Step = filtered_process_step[i];
				ProcessSteps_array.push(temp_obj)

			}
			var ProcessSteps_object = new Object();
			ProcessSteps_object.ProcessStep = ProcessSteps_array;
			process_step_model.setData(ProcessSteps_object)
			this.getView().byId("search_process_step").setModel(process_step_model);

			//Data binding for Business Area
			var ba_model = new sap.ui.model.json.JSONModel();
			var not_filtered_ba = [];
			for (var i = 0; i < whole_data.length; i++)
				if (whole_data[i].Businessprocess.length > 0)
					not_filtered_ba.push(whole_data[i].Businessprocess);
			var filtered_ba = not_filtered_ba.filter(function(elem, index, self) {
				return index == self.indexOf(elem);
			})
			var Bas_array = [];
			for (var i = 0; i < filtered_ba.length; i++) {
				var temp_obj = new Object();
				temp_obj.Area = filtered_ba[i];
				Bas_array.push(temp_obj)

			}
			var Bas_object = new Object();
			Bas_object.Bas = Bas_array;
			ba_model.setData(Bas_object)
			this.getView().byId("search_business_area").setModel(ba_model);

			//Data binding for Go Live Releasse month
			var glm_model = new sap.ui.model.json.JSONModel();
			var not_filtered_glm = [];
			for (var i = 0; i < whole_data.length; i++)
				if (whole_data[i].RelMo.length > 0)
					not_filtered_glm.push(whole_data[i].RelMo);
			var filtered_glm = not_filtered_glm.filter(function(elem, index, self) {
				return index == self.indexOf(elem);
			})
			var Glms_array = [];
			for (var i = 0; i < filtered_glm.length; i++) {
				var temp_obj = new Object();
				temp_obj.Month = filtered_glm[i];
				Glms_array.push(temp_obj)

			}
			var Glms_object = new Object();
			Glms_object.Glms = Glms_array;
			glm_model.setData(Glms_object)
			this.getView().byId("search_glm").setModel(glm_model);

			//Data binding for Work package
			var wpg_model = new sap.ui.model.json.JSONModel();
			var not_filtered_wpg = [];
			for (var i = 0; i < whole_data.length; i++)
				if (whole_data[i].WorkPackID.length > 0)
					not_filtered_wpg.push(whole_data[i].WorkPackID);
			var filtered_wpg = not_filtered_wpg.filter(function(elem, index, self) {
				return index == self.indexOf(elem);
			})

			var Wpgs_array = [];
			for (var i = 0; i < filtered_wpg.length; i++) {
				var temp_obj = new Object();
				temp_obj.Package = filtered_wpg[i];
				Wpgs_array.push(temp_obj)

			}
			var Wpgs_object = new Object();
			Wpgs_object.Wpgs = Wpgs_array;
			wpg_model.setData(Wpgs_object)
			this.getView().byId("search_wp").setModel(wpg_model);

		},
		open_bar_chart: function() {
			this.getRouter().navTo("bar_chart");
		},
		open_bar_chart_month: function() {
			this.getRouter().navTo("bar_chart_month");
		},
		open_bar_chart_day: function() {
			this.getRouter().navTo("bar_chart_day");
		},
		open_bar_chart_local: function() {
			this.getRouter().navTo("bar_chart_local");
		},
		open_bar_chart_month_local: function() {
			this.getRouter().navTo("bar_chart_month_local");
		},
		open_bar_chart_day_local: function() {
			this.getRouter().navTo("bar_chart_day_local");
		}

	});
});