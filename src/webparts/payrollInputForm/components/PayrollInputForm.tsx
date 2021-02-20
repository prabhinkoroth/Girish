import * as React from 'react';

import { IPayrollInputFormProps } from './IPayrollInputFormProps';
import { escape } from '@microsoft/sp-lodash-subset';
import PayrollForm from "./Form/PayrollForm";
import { IPayrollInputFormState } from './IPayrollInputFormState';
import { IPayrollFormProps } from './Form/PayrollFormProps';
import * as pnp from "@pnp/sp/presets/all";
import { IClient, Client } from '../../../models/PayrollForm/IClient';
import { ListName, FieldName, Other, ClientInstructionsListFields } from "./Configuration/Configuration";
import { autobind, IDropdownOption } from 'office-ui-fabric-react';
import { IDropdownProperties, convertToDropDownOptions } from "../../../services/ObjectConversionService/ObjectConversionService";
import { ICountry, Country } from '../../../models/PayrollForm/Country';
import { IEndClient, EndClient } from '../../../models/PayrollForm/IEndClient';
import { IEmployee, Employee } from '../../../models/PayrollForm/IEmployee';
import { IField, IItemAddResult, IItemUpdateResult } from '@pnp/sp/presets/all';
import { IFilePickerResult } from '@pnp/spfx-controls-react';
import * as moment from 'moment';
import { convertToHtmlDropdownOption } from '../../../services/ObjectConversionService/ObjectToHtmlConversionService';
import PayrollDetailsTable from './PayrollDetailsTable/PayrollDetailTable';
import { IClientInstructionListItem } from '../../../models/PayrollForm/IClientInstructionListItem';
import { IPayrollFormValues, PayrollFormDefaultValues } from '../../../models/PayrollForm/IPayrollFormValues';
import { IListOperationService } from "../../../services/ListOperationSerivices/IListOperationsService";
import { ListOperationService } from "../../../services/ListOperationSerivices/ListOperationService";
import { PayrollFormManager as FormManager } from "../Domain/PayrollForm";
import { IFile } from '../../../models/PayrollForm/IPayrollFile';
import * as $ from 'jquery';
import 'DataTables.net';
import { SPComponentLoader } from '@microsoft/sp-loader'; 
import { Icon } from 'office-ui-fabric-react';
import './PayrollInputForm.module.scss';
require("../../assets/applicationStyle.css");


SPComponentLoader.loadCss("https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css"); 


export default class PayrollInputForm extends React.Component<IPayrollInputFormProps, IPayrollInputFormState> {
  /**
   *
   */
  private _listOperationService: IListOperationService = null;
  private _selectedListItem: IClientInstructionListItem[] = [];
  private _formManager: FormManager = null;
  private _arrCountriesCurrency:object = {
    "Australia":"AUD","Belgium":"EUR","France":"EUR","Cambodia":"KHR","Israel":"ILS","Italy":"EUR","Sweden":"SEK","UK":"GBP","New Zealand":"NZD","Myanmar":"MMK",
    "Japan": "JPY", "India": "INR", "China": "CNY", "Korea": "KRW", "Malaysia": "MYR", "Thailand": "THB",
    "Hong Kong": "HKD", "Indonesia": "IDR", "Mongolia": "MNT", "Vietnam": "VND", "Philippines": "PHP", "Singapore": "SGD",
    "Taiwan": "TWD", "USA": "USD", "Europe": "EUR", "Britain": "GBP"
};

  constructor(props: IPayrollInputFormProps) {

    super(props);
    this._listOperationService = new ListOperationService();
    this._formManager = new FormManager(this.props.context.pageContext.web.serverRelativeUrl);

    this.state = {
      RefreshTable: true,
      ShowForm:true,
      Clients: [], PayrollCategories: [], Employees: [], EndCleints: [], Countries: [], ClientInstructionListItems: [],
      PayrollFormValues: { ...PayrollFormDefaultValues }
    };
  }


  public async componentDidMount(): Promise<void> {
    pnp.sp.setup({
      spfxContext: this.props.context
    });

    await this._formManager.ProcessRequest();
    let showForm:boolean=true;
    if(this._formManager.clientInstructionMasterItemStatus=="Publish"){
      showForm=false;
    }
    this.setState(
      {
        ShowForm:showForm,
        RefreshTable: true,
        Clients: this._formManager.clients,
        Countries: this._formManager.countries,
        EndCleints: this._formManager.endClients,
        Employees: this._formManager.employees,
        PayrollCategories: this._formManager.payrollCategoryOptions,
        ClientInstructionListItems: this._formManager.clientInstructionListItems
      });



  }
  public cancelForm(): void {

    this.setState(
      {
        RefreshTable: false,
        PayrollFormValues:
          { ...PayrollFormDefaultValues }
      });
  }
  private async processCountryChange(countryId: string,countryText?:string): Promise<void> {

    // let employees: IEmployee[] = await this._formManager.getFilteredEmployeeDetails(countryId);
    if (countryId == "") {
      this.setState({ RefreshTable: false, Clients: [], EndCleints: [], Employees: [] });
    } else {
      let clients: IClient[] = await this._formManager.getFilteredClientDetails(countryId);
      this.setState({ RefreshTable: false, Clients: clients, EndCleints: [], Employees: [] });
    }
    
  }
  public async processClientChange(clientId: string): Promise<void> {

    if (clientId == "") {

      this.setState({ RefreshTable: false, EndCleints: [], Employees: [] });
    } else {
      let endClients: IEndClient[] = await this._formManager.getFilteredEndClientDetails(this.state.PayrollFormValues.Country, clientId);
      this.setState({ RefreshTable: false, EndCleints: endClients, Employees: [] });
    }

  }
  public async processEndClientChange(endClientId): Promise<void> {

    if (endClientId == "") {
      this.setState({ RefreshTable: false, Employees: [] });
    } else {
      let employees: IEmployee[] = await this._formManager.getFilteredEmployeeDetails(
        this.state.PayrollFormValues.Country,
        this.state.PayrollFormValues.Client,
        endClientId
      );
      this.setState({ RefreshTable: false, Employees: employees });
    }

    // let endClients: IEndClient[] = await this._formManager.getFilteredEndClientDetails(value);
    // this.setState({ EndCleints: endClients });
  }
  @autobind
  public formFieldsChangeHandler(fieldId: string, value: any,text?:any): void {

    let newState = { ...this.state.PayrollFormValues };
    switch (fieldId) {
      case "filesPayroll":
        debugger;
        newState.Files = value;
        break;

      case "ddlCountry":
        newState.Country = value;
        newState.Client = "";
        newState.EndClient = "";
        newState.Employee = [];
        //Changing currency based on country selected
        if(text){
          let searchedCurrency=  this._arrCountriesCurrency[text];
          
          if(searchedCurrency){
            newState.Currency = searchedCurrency;
          }
        }
        this.processCountryChange(value,text);
        break;
      case "ddlClient":
        newState.Client = value;
        newState.EndClient = "";

        newState.Employee = [];
        this.processClientChange(value);
        break;
      case "ddlEndClient":
        newState.EndClient = value;
        newState.Employee = [];
        this.processEndClientChange(value);
        break;
      case "ddlEmployee":
        newState.Employee = value;


        break;
      case "ddlPayrollCategory":
        newState.PayrollCategory = value;
        break;
      case "tbxInstructionsForTheMonthOfGoGopal":
        newState.InstructionsForGoGoPal = value;
        break;
      case "tbxAmount":
        newState.Amount = value;
        break;
      case "tbxEffectuveDate":
        newState.EffectiveDate = value;
        break;
      case "tbxMonth":
        newState.Month = value;
        // newState.Month = "";
        break;
      case "ddlCurrency":
        newState.Currency = value;
        break;
      default:

    }

    this.setState({ RefreshTable: false, PayrollFormValues: newState });
  }

  @autobind
  private async fileSelectionHandler(file: IFilePickerResult) {

    this.setState({ RefreshTable: false, PayrollFormValues: { ...this.state.PayrollFormValues, ...{ File: file } } });

  }

  public async saveButtonClickHandler(): Promise<void> {
    debugger;
    await this._formManager.save(this.state.PayrollFormValues);
    

    if (this._formManager.clientInstructionMasterItemID==undefined) {

      await this._formManager.refreshPage(true);
    }else if(this.state.PayrollFormValues.Id==0){
      await this._formManager.refreshPage(true);
    } else {
      await this.refreshClientInstructionsTable();
      this.cancelForm();
    }


  }


  @autobind
  public async editButtonClickHandler(clientInstruction: IClientInstructionListItem): Promise<void> {

    let formValues: IPayrollFormValues = { ...this.state.PayrollFormValues };
    formValues.Id = clientInstruction.Id;
    formValues.Amount = clientInstruction.Amount + "";
    formValues.Currency = clientInstruction.Currency;
    formValues.PayrollCategory = clientInstruction.PayrollCategory;
    //2020-10
    let monthString: string = moment().month(clientInstruction.Month).format("MM");
    formValues.Month = clientInstruction.Year + "-" + monthString;
    formValues.Country = clientInstruction.CountryId + "";
    formValues.Client = clientInstruction.ClientId + "";
    formValues.EndClient = clientInstruction.EndClientId + "";

    let employeeNumber: string = clientInstruction.Number == null ? "" : clientInstruction.Number + "";
    formValues.Employee = [{ id: clientInstruction.EmployeeId + "", name: employeeNumber + "-" + clientInstruction.Employee }];
    let date = moment(clientInstruction.EffectiveDate).format("YYYY-MM-DD");
    formValues.EffectiveDate = date;
    formValues.InstructionsForGoGoPal = clientInstruction.Instructions;
    formValues.UploadedFiles = await this._formManager.GetFilesFromClientInstructionDocumentsLibrary(formValues.Id);

    this.setState({ RefreshTable: false, PayrollFormValues: formValues });
    this.processDropdowns(clientInstruction);


  }
  @autobind
  public async deleteFileButtonClickHandler(file: IFile): Promise<void> {
    await this._formManager.DeleteFileFromClientInstructionsDocumentLibrary(file.Id);
    let files: IFile[] = await this._formManager.GetFilesFromClientInstructionDocumentsLibrary(this.state.PayrollFormValues.Id);
    let newState: IPayrollFormValues = { ...this.state.PayrollFormValues, ...{ UploadedFiles: files } };
    this.setState({ PayrollFormValues: newState });
  }
  public async processDropdowns(clientInstructions: IClientInstructionListItem): Promise<void> {
    await this.processCountryChange(clientInstructions.CountryId + "");
    await this.processClientChange(clientInstructions.ClientId + "");
    await this.processEndClientChange(clientInstructions.EndClientId + "");

  }
  @autobind
  public selectButtonClickHandler(event:any,clientInstructionItem: IClientInstructionListItem): void {
    debugger;
    if(event["target"]["checked"]){
      this._selectedListItem.push( clientInstructionItem);
    }else{
      this._selectedListItem=this._selectedListItem.filter((item)=>{
          return item.Id!=clientInstructionItem.Id;
      });
    }
    
  }
  @autobind
  public publishButtonClickHandler(): void {
    if (this._formManager.clientInstructionMasterItemID == null) {
      alert("No Item available for publishing");
    } else {
      this.publishItem().then(() => {
        
        this._formManager.clientInstructionMasterItemStatus="Publish";
        this.setState({ShowForm:false,RefreshTable:true});
      }).catch(() => {
        alert("something went wrong.");
      });
    }
  }
  public async publishItem(): Promise<IItemUpdateResult> {

    let result = await this._formManager.UpdateClientInstructionMasterListItemStatusToPublished();
    return result;
  }
  public async refreshClientInstructionsTable(): Promise<void> {
    await this._formManager.GetClientInstructionListData();
    this.setState({ RefreshTable: true, ClientInstructionListItems: this._formManager.clientInstructionListItems });
  }

  @autobind
  public deleteButtonClickHandler(): void {
    if (this._selectedListItem .length!=0) {
      this._formManager.deleteAllItems(this._selectedListItem).then(()=>{
        this.refreshClientInstructionsTable();
      });
    
    } else {
      alert("Please select an item");
    }
  }
  public render(): React.ReactElement<IPayrollInputFormProps> {
    // let clientOptions:IDropdownOption[]=this.state.Clients.map((item):IDropdownOption=>{
    //   return {key:item.Id,text:item.ClientName};
    // })
    let contryOptions: any = convertToHtmlDropdownOption(this.state.Countries, { key: "Id", text: "Country" });
    let clientOptions = convertToHtmlDropdownOption(this.state.Clients, { key: "Id", text: "ClientName" });
    // let employeeOptions = convertToHtmlDropdownOption(this.state.Employees, { key: "Id", text: "LegalName" });
    let endClientOptions = convertToHtmlDropdownOption(this.state.EndCleints, { key: "Id", text: "ClientName" });
    // let countriesOptions = convertToDropDownOptions(this.state.Countries, { key: "Id", text: "Country" });
    let payrollCategoryOptions = convertToHtmlDropdownOption(this.state.PayrollCategories);
    let currencies = convertToHtmlDropdownOption(["AUD","CNY","EUR","GBP","HKD","IDR","ILS","INR","KHR","JPY","KRW","MMK","MNT","MYR","NTD","NZD","PHP","SEK","SGD","THB","TWD","USD","VND"]);
    return (
      <React.Fragment>
        {/* {this.state.ShowForm?(
        <PayrollForm
          cancelForm={this.cancelForm.bind(this)} context={this.props.context}
          fileSelectionChanged={this.fileSelectionHandler.bind(this)}
          saveItems={this.saveButtonClickHandler.bind(this)} DeleteButtonClicked={this.deleteFileButtonClickHandler}
          updateFormValues={this.formFieldsChangeHandler} {...this.state.PayrollFormValues} Clients={clientOptions} Countries={contryOptions} Employees={this.state.Employees} EndCleints={endClientOptions} PayrollCategories={payrollCategoryOptions} Currencies={currencies}>

        </PayrollForm>):""} */}
        
        <PayrollForm
          cancelForm={this.cancelForm.bind(this)} context={this.props.context}
          fileSelectionChanged={this.fileSelectionHandler.bind(this)}
          saveItems={this.saveButtonClickHandler.bind(this)} DeleteButtonClicked={this.deleteFileButtonClickHandler}
          updateFormValues={this.formFieldsChangeHandler} {...this.state.PayrollFormValues} Clients={clientOptions} Countries={contryOptions} Employees={this.state.Employees} EndCleints={endClientOptions} PayrollCategories={payrollCategoryOptions} Currencies={currencies}>

        </PayrollForm>
        <PayrollDetailsTable
        showEditButton={this.state.ShowForm}
          publishButtonClick={this.publishButtonClickHandler} deleteButtonClick={this.deleteButtonClickHandler}
          selectItemButtonClick={this.selectButtonClickHandler} editButtonClick={this.editButtonClickHandler}
          Title="Payroll Entries" SubTitle="" RefreshTable={this.state.RefreshTable}
          ClientInstructionListItems={this.state.ClientInstructionListItems}>

        </PayrollDetailsTable>
      </React.Fragment>
    );
  }
}
