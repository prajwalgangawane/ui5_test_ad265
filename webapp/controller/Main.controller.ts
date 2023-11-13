import Controller from "sap/ui/core/mvc/Controller";
import MessageToast from "sap/m/MessageToast";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import JSONModel from "sap/ui/model/json/JSONModel";
import Filter from "sap/ui/model/Filter";
import { IconTabBar$SelectEvent } from "sap/m/IconTabBar";
import ListBinding from "sap/ui/model/ListBinding";
import FilterOperator from "sap/ui/model/FilterOperator";
import { Threshold } from "../format/utils";
import Dialog from "sap/m/Dialog";
import { ListItemBase$PressEvent } from "sap/m/ListItemBase";
import UIComponent from "sap/ui/core/UIComponent";

/**
 * @namespace com.sap.prajwalgangawane.test.controller
 */
export default class Main extends Controller {

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {
        const ownerComp = this.getOwnerComponent();
        this.getSensorModel().dataLoaded().then(function () {
            const resourceModel = ownerComp?.getModel("i18n") as ResourceModel;
            const resourceBundle = resourceModel.getResourceBundle() as ResourceBundle;
            MessageToast.show(resourceBundle.getText("msgSensorDataLoaded") as string, { closeOnBrowserNavigation: false });
        }.bind(this)).catch(function (oErr: Error) {
            MessageToast.show(oErr.message, { closeOnBrowserNavigation: false });
        });
    }

    public getSensorModel() {
        const ownerComp = this.getOwnerComponent();
        const oModel = ownerComp?.getModel("sensorModel") as JSONModel;
        return oModel;
    }

    private statusFilters: Filter[] = []

    onFilterSelect(event: IconTabBar$SelectEvent): void {

        const listBinding = this.getView()?.byId("sensorsList")?.getBinding("items") as ListBinding;
        const key = (event.getParameter("key") as string);

        if (key === "Cold") {
            this.statusFilters = [new Filter("temperature", FilterOperator.LT, Threshold.Warm, false)];
        } else if (key === "Warm") {
            this.statusFilters = [new Filter("temperature", FilterOperator.BT, Threshold.Warm, Threshold.Hot)];
        } else if (key === "Hot") {
            this.statusFilters = [new Filter("temperature", FilterOperator.GT, Threshold.Hot, false)];
        } else {
            this.statusFilters = [];
        }

        listBinding.filter(this.statusFilters);
    }

    private dialog: Promise<Dialog>;

    onCustomerInfoPress(): void {
        this.dialog ??= this.loadFragment({
            name: "com.sap.prajwalgangawane.test.view.CustomerDialog"
        }) as Promise<Dialog>;

        this.dialog.then((dialog) => dialog.open())
            .catch((err: Error) => MessageToast.show(err.message));
    }

    onCustomerInfoClose(): void {
        this.dialog.then(function (dialog) {
            dialog.close();
        }).catch(function (err: Error) {
            MessageToast.show(err.message);
        });
    }

    navToSensorStatus(event: ListItemBase$PressEvent) {
        const sensorIndex = event.getSource().getBindingContext("sensorModel")?.getProperty("index");
        (this.getOwnerComponent() as UIComponent).getRouter().navTo("RouteSensorStatus", {index: sensorIndex});
    }

}