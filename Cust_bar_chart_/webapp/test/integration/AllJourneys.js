jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
		"sap/ui/test/Opa5",
		"custom/test/integration/pages/Common",
		"sap/ui/test/opaQunit",
		"custom/test/integration/pages/Worklist",
		"custom/test/integration/pages/Object",
		"custom/test/integration/pages/NotFound",
		"custom/test/integration/pages/Browser",
		"custom/test/integration/pages/App"
	], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "custom.view."
	});

	sap.ui.require([
		"custom/test/integration/WorklistJourney",
		"custom/test/integration/ObjectJourney",
		"custom/test/integration/NavigationJourney",
		"custom/test/integration/NotFoundJourney",
		"custom/test/integration/FLPIntegrationJourney"
	], function () {
		QUnit.start();
	});
});