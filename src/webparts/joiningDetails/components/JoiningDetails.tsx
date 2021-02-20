import * as React from 'react';
import styles from './JoiningDetails.module.scss';
import { IJoiningDetailsProps, IJoiningDetailsState } from './IJoiningDetailsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from "@pnp/sp/presets/all";
import * as moment from "moment";
import { Configuration, Configuration as JoiningDetailsConfiguration } from "../models/Configuration";
import { ClientEmployeeMasterListItem, IClientEmployeeMasterListItem } from "../models/IListItems";
import { DetailsList, DetailsListLayoutMode, Selection, SelectionMode, IColumn, CheckboxVisibility } from 'office-ui-fabric-react/lib/DetailsList';
import { IEmployeeDetails } from '../models/IJoiningDetails';
import { CustomDialog } from "./CustomDialog/CustomDialog";
import { EmployeePerDayDataTable } from './DataTable/EmployeePerDayDataTable';
import { Card } from '../../components/Card/Card';
import * as $ from 'jquery';
import 'DataTables.net';
import { SPComponentLoader } from '@microsoft/sp-loader'; 
import { Icon } from 'office-ui-fabric-react';

require("../../assets/applicationStyle.css");

SPComponentLoader.loadCss("https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css");  

export default class JoiningDetails extends React.Component<IJoiningDetailsProps, IJoiningDetailsState> {

  private _joiningListSelection: Selection;
  private _relevingListSelection: Selection;
  private _dialogListColumns: IColumn[];
  private _dataTables: DataTables.Api = null;

  constructor(props: IJoiningDetailsProps) {
    super(props);

    this.state = {
      JoiningDetails: [],
      RelevingDetails: [],
      JoiningEmployeesByDay: [],
      RelevingEmployeesByDay: [],
      showJoiningEmployeesPerDayDialog: false,
      showRelevingEmployeesPerDayDialog: false
    };
    this._dialogListColumns = [
      { key: 'Id', name: 'Country', fieldName: 'Country', minWidth: 200, maxWidth: 400, isResizable: false },
      { key: 'Id', name: 'Client Name', fieldName: 'ClientName', minWidth: 200, maxWidth: 400, isResizable: false },
      { key: 'Id', name: 'Legal Name', fieldName: 'LegalName', minWidth: 200, maxWidth: 700, isResizable: false },



    ];

    this._joiningListSelection = new Selection({
      onSelectionChanged: () => {
        let item: any = this._joiningListSelection.getSelection()[0];
        let items: IClientEmployeeMasterListItem[] = [];
        for (let counter: number = 0; counter < this.state.JoiningDetails.length; counter++) {
          if (this.state.JoiningDetails[counter].Date == item.Date) {
            items = this.state.JoiningDetails[counter].Employees;
          }
        }
        debugger;
        this.setState({ showJoiningEmployeesPerDayDialog: true, JoiningEmployeesByDay: items });

      }
    });



    this._relevingListSelection = new Selection({
      onSelectionChanged: () => {
        let item: any = this._relevingListSelection.getSelection()[0];
        let items: IClientEmployeeMasterListItem[] = [];
        for (let counter: number = 0; counter < this.state.RelevingDetails.length; counter++) {
          if (this.state.RelevingDetails[counter].Date == item.Date) {
            items = this.state.RelevingDetails[counter].Employees;
          }
        }
        debugger;
        this.setState({ showRelevingEmployeesPerDayDialog: true, RelevingEmployeesByDay: items });

      }
    });
  }
  public componentDidMount(): void {
    sp.setup({ spfxContext: this.props.context });

    this.processEmployeeData();
  }
  public componentDidUpdate() {
    $(document).ready(() => {
      debugger;
      if (this._dataTables == null) {
        // this._dataTables.destroy();
        this._dataTables = $(".onboarding-datatable,.upcomingcontract-datatable").DataTable({
          ordering: true,
          searching: true,
          //lengthMenu: [9, 18, 27, 36, 45],
          pageLength: 9,
          dom: 't' 
        });
        
        $("#searchJobDetails").keyup(function(){
          let value=String($(this).val());
          $(".onboarding-datatable").DataTable().search(value).draw();
        });

        $("#searchUpcomingContract").keyup(function(){
          let value=String($(this).val());
          $(".upcomingcontract-datatable").DataTable().search(value).draw();
        }); 
      }

      $(".searchIcon").click(function(){
        $(this).prev().toggleClass("gp-SearchBox-field-open");
        $(this).prev().focus();
        $(this).hide();
      });

      $(".gp-SearchBox-field").focusout(function(){
          if($(this).val()==""){
            $(this).removeClass("gp-SearchBox-field-open");
            $(this).next().show();
          }
      });

    });

  }
  public async processEmployeeData(): Promise<void> {
    debugger;
    let items: any = await this.getDataFromList();
    let clientEmployeeMasterListItemsByStartDate: IClientEmployeeMasterListItem[] = items.start.map((item: any) => {
      return new ClientEmployeeMasterListItem(item[Configuration.FieldNameId], item[Configuration.FieldNameTitle], item[Configuration.FieldNameStartDate], item[Configuration.FieldNameFirstName], item[Configuration.FieldNameLastName], item[Configuration.FieldNameClientName]["Client_x0020_Name"], item[Configuration.FieldNameLegalname], item[Configuration.FieldNameWorkerCountry]["Title"]);
    });
    let clientEmployeeMasterListItemsByEndDate: IClientEmployeeMasterListItem[] = items.end.map((item: any) => {
      return new ClientEmployeeMasterListItem(item[Configuration.FieldNameId], item[Configuration.FieldNameTitle], item[Configuration.FieldNameEndDate], item[Configuration.FieldNameFirstName], item[Configuration.FieldNameLastName], item[Configuration.FieldNameClientName]["Client_x0020_Name"], item[Configuration.FieldNameLegalname], item[Configuration.FieldNameWorkerCountry]["Title"]);
    });
    clientEmployeeMasterListItemsByStartDate = clientEmployeeMasterListItemsByStartDate.sort((a, b) => a.DateValue.getTime() - b.DateValue.getTime());
    clientEmployeeMasterListItemsByEndDate = clientEmployeeMasterListItemsByEndDate.sort((a, b) => a.DateValue.getTime() - b.DateValue.getTime());

    let employeePerStartDay: IEmployeeDetails[] = this.CalculateJoiningUsersPerDateCount(clientEmployeeMasterListItemsByStartDate);
    let employeePerEndDay: IEmployeeDetails[] = this.CalculateJoiningUsersPerDateCount(clientEmployeeMasterListItemsByEndDate);
    this.setState({ JoiningDetails: employeePerStartDay, RelevingDetails: employeePerEndDay });
  }
  private CalculateJoiningUsersPerDateCount(clientEmployeeMasterListItems: IClientEmployeeMasterListItem[]) {
    let joineePerStartDay: IEmployeeDetails[] = [];
    let oldEntry: string = '';
    let itemsPerDateCounter: number = 0;
    let items = [];
    for (let count: number = 0; count < clientEmployeeMasterListItems.length; count++) {
      if (oldEntry == "") {
        oldEntry = clientEmployeeMasterListItems[count].Date;
      }
      if (oldEntry == clientEmployeeMasterListItems[count].Date) {

        itemsPerDateCounter++;
        clientEmployeeMasterListItems[count].Counter = itemsPerDateCounter;

        items.push(clientEmployeeMasterListItems[count]);

      } else {

        joineePerStartDay.push({ Date: oldEntry, Count: itemsPerDateCounter, Employees: [...items] });
        oldEntry = clientEmployeeMasterListItems[count].Date;
        itemsPerDateCounter = 1;
        clientEmployeeMasterListItems[count].Counter = itemsPerDateCounter;
        items = [clientEmployeeMasterListItems[count]];
      }
    }
    joineePerStartDay.push({ Date: oldEntry, Count: itemsPerDateCounter, Employees: [...items] });
    return joineePerStartDay;
  }
  public hideJoiningEmployeeDetailsDialog(): void {

    this.setState({ showJoiningEmployeesPerDayDialog: false });
  }
  public hideRelevingEmployeeDetailsDialog(): void {
    this.setState({ showRelevingEmployeesPerDayDialog: false });
  }
  public async getDataFromList(): Promise<any> {
    let momentTodayDate = moment(new Date());
    let momentDateAfter90Days = moment(new Date()).add(90, 'days');

    let todayString: string = momentTodayDate.format("YYYY-MM-DD");
    let afterSpecificTimeString: string = momentDateAfter90Days.format("YYYY-MM-DD");

    var currentDate = todayString + 'T00:00:00.0000000Z';
    var afterTimeFrameDate = afterSpecificTimeString + 'T00:00:00.0000000Z';
    let startDateItems: any[] = await sp.web.lists.getByTitle(Configuration.ListNameClientEmployeeMaster)
      .items.filter(`(${Configuration.FieldNameStartDate} gt datetime'${currentDate}') and (${Configuration.FieldNameStartDate} le datetime'${afterTimeFrameDate}')`)
      .expand(Configuration.FieldNameClientName, Configuration.FieldNameWorkerCountry)
      .select(`${Configuration.FieldNameWorkerCountry}/Title`, `${Configuration.FieldNameClientName}/Client_x0020_Name`, Configuration.FieldNameId, Configuration.FieldNameTitle, Configuration.FieldNameStartDate, Configuration.FieldNameFirstName, Configuration.FieldNameLastName, Configuration.FieldNameLegalname).getAll();
    let endDateItems: any[] = await sp.web.lists.getByTitle(Configuration.ListNameClientEmployeeMaster).items
      .filter(`(${Configuration.FieldNameEndDate} gt datetime'${currentDate}') and (${Configuration.FieldNameEndDate} le datetime'${afterTimeFrameDate}')`)
      .expand(Configuration.FieldNameClientName, Configuration.FieldNameWorkerCountry)
      .select(`${Configuration.FieldNameWorkerCountry}/Title`, `${Configuration.FieldNameClientName}/Client_x0020_Name`, Configuration.FieldNameId, Configuration.FieldNameTitle, Configuration.FieldNameEndDate, Configuration.FieldNameFirstName, Configuration.FieldNameLastName, Configuration.FieldNameLegalname,).getAll();
    // let items: any[] = await sp.web.lists.getByTitle(JoiningDetailsConfiguration.ListNameClientEmployeeMaster).items.getAll();

    return { start: startDateItems, end: endDateItems };
  }
  public joiningEmployeeTableRowClicked(items: IClientEmployeeMasterListItem[]) {

    this.setState({ showJoiningEmployeesPerDayDialog: true, JoiningEmployeesByDay: items });
  }
  public relevingEmployeeTableRowClicked(items: IClientEmployeeMasterListItem[]) {

    this.setState({ showRelevingEmployeesPerDayDialog: true, RelevingEmployeesByDay: items });
  }
  public calculateCount(items: IEmployeeDetails[]): number {
    let total: number = 0;
    for (let counter: number = 0; counter < items.length; counter++) {
      total += items[counter].Count;
    }

    return total;
  }
  public render(): React.ReactElement<IJoiningDetailsProps> {

    let joiningCount:number=this.calculateCount(this.state.JoiningDetails);
    let relevingCount:number=this.calculateCount(this.state.RelevingDetails);
    return (
      <div className="ms-Grid">
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
            <div className="card shadow mb-4">
                  <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between instructList-header">
                      <h6 className="m-0 font-weight-bold text-primary">Onboarding <span className="count">({joiningCount})</span>
                          <div><small>Showing data for next 90 days</small></div>
                      </h6>
                      <div className="comp-rightPanel">
                        <div className="searchBox">  
                          <input type="text" className="gp-SearchBox-field" id="searchJobDetails" placeholder="Search.."></input>
                          <Icon iconName='Search' style={{paddingLeft:4}} className="searchIcon"/>
                        </div>
                        <div className="dropdown no-arrow seeAllBtn">
                            <a className="dropdown-toggle" href="#" role="button">See All</a> 
                        </div>
                    </div>
                  </div>
                  <div className="card-body">
                      <EmployeePerDayDataTable dataTableName={"onboarding-datatable"} onRowClicked={this.joiningEmployeeTableRowClicked.bind(this)} employees={this.state.JoiningDetails}></EmployeePerDayDataTable>
                  </div>
              </div>
          </div>
          <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
              <div className="card shadow mb-4">
                  <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between instructList-header">
                      <h6 className="m-0 font-weight-bold text-primary">Upcoming Contract End Dates <span className="count">({relevingCount})</span>
                          <div><small>Showing data for next 90 days</small></div>
                      </h6>
                      <div className="comp-rightPanel">
                          <div className="searchBox">
                            <input type="text" className="gp-SearchBox-field" id="searchUpcomingContract" placeholder="Search.."></input>
                            <Icon iconName='Search' style={{paddingLeft:4}} className="searchIcon"/>
                          </div>
                          <div className="dropdown no-arrow seeAllBtn">
                              <a className="dropdown-toggle" href="#" role="button">See All</a> 
                          </div>
                      </div>
                  </div>
                  <div className="card-body">
                      <EmployeePerDayDataTable dataTableName={"upcomingcontract-datatable"} onRowClicked={this.relevingEmployeeTableRowClicked.bind(this)} employees={this.state.RelevingDetails}></EmployeePerDayDataTable>
                  </div>
              </div>
          </div>
        </div>


        <div className="ms-Grid-row">
          <CustomDialog heading="Employees" hideModal={this.hideJoiningEmployeeDetailsDialog.bind(this)} isModalOpen={this.state.showJoiningEmployeesPerDayDialog}>
            <DetailsList checkboxVisibility={CheckboxVisibility.hidden} columns={this._dialogListColumns} layoutMode={DetailsListLayoutMode.justified} items={this.state.JoiningEmployeesByDay}></DetailsList>
          </CustomDialog>
          <CustomDialog heading="Employees" hideModal={this.hideRelevingEmployeeDetailsDialog.bind(this)} isModalOpen={this.state.showRelevingEmployeesPerDayDialog}>
            <DetailsList checkboxVisibility={CheckboxVisibility.hidden} columns={this._dialogListColumns} layoutMode={DetailsListLayoutMode.justified} items={this.state.RelevingEmployeesByDay}></DetailsList>
          </CustomDialog>
        </div>

      </div>
    );
  }
}
