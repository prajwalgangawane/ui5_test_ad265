/*global QUnit*/
import opaTest from "sap/ui/test/opaQunit";
import AppPage from "./pages/AppPage";
import ViewPage from "./pages/MainPage";

import Opa5 from "sap/ui/test/Opa5";

QUnit.module("Navigation Journey");

const onTheAppPage = new AppPage();
const onTheViewPage = new ViewPage();
Opa5.extendConfig({
	viewNamespace: "com.sap.prajwalgangawane.test.view.",
	autoWait: true
});

opaTest("Should see the initial page of the app", function () {
	// Arrangements
	onTheAppPage.iStartMyUIComponent({
		componentConfig: {
			name: "com.sap.prajwalgangawane.test"
		}
	});

	// Assertions
	onTheAppPage.iShouldSeeTheApp();
	onTheViewPage.iShouldSeeThePageView();


	//Cleanup
	onTheAppPage.iTeardownMyApp();
});