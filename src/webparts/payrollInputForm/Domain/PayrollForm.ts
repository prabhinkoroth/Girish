import { IUrlService, UrlService } from "../../../services/URLService/UrlService";
import { IListOperationService } from "../../../services/ListOperationSerivices/IListOperationsService";
import { ListOperationService } from "../../../services/ListOperationSerivices/ListOperationService";
import { ClientEmployeeMasterListFields, ClientInstructionMasterListFields, ClientInstructionsListFields, ClientMasterListFields, EndClientMasterListFields, FieldName, ListName, Other } from "../components/Configuration/Configuration";
import { IField } from "@pnp/sp/fields";
import { Client, IClient } from "../../../models/PayrollForm/IClient";
import { Country, ICountry } from "../../../models/PayrollForm/Country";
import { EndClient, IEndClient } from "../../../models/PayrollForm/IEndClient";
import { Employee, IEmployee } from "../../../models/PayrollForm/IEmployee";
import { IPayrollCategory } from "../../../models/PayrollForm/IPayrollCategory";
import { IClientInstructionListItem } from "../../../models/PayrollForm/IClientInstructionListItem";
import { IPayrollFormValues } from "../../../models/PayrollForm/IPayrollFormValues";
import * as moment from "moment";
import { IItemAddResult, IItemUpdateResult } from "@pnp/sp/items";
import { IFileAddResult } from "@pnp/sp/files";
import { IFile } from "../../../models/PayrollForm/IPayrollFile";
export class PayrollFormManager {
    private _urlService: IUrlService = null;
    private _spListService: IListOperationService = null;
    public clientInstructionMasterItemID: string = "";
    public clientInstructionListItems: IClientInstructionListItem[] = [];
    public clients: IClient[] = [];
    public countries: ICountry[] = [];
    public endClients: IEndClient[] = [];
    public employees: IEmployee[] = [];
    public payrollCategoryOptions: string[] = [];
    public _webServerRelativeUrl: string = "";
    public  clientInstructionMasterItemStatus:string="";
    constructor(serverRelativeUrl: string) {
        this._urlService = new UrlService();
        this._spListService = new ListOperationService();
        this._webServerRelativeUrl = serverRelativeUrl;
    }
    public getClientInstructionMasterListItemIdFromUrl(): string {
        return this._urlService.getQueryString("itemid");
    }
    public async ProcessRequest(): Promise<void> {
        this.clientInstructionMasterItemID = this.getClientInstructionMasterListItemIdFromUrl();
        await this.getMasterData();
        await this.GetClientInstructionListData();
    }
    public async getMasterData(): Promise<void> {
        let countriesFromList: any = await this._spListService.GetAllItemsFromList(ListName.MiscellaneousMaster, "", [FieldName.Id, FieldName.Title], []);
        // let clientsFromList: any = await this._spListService.GetAllItemsFromList(ListName.ClientMaster, "", [FieldName.Id, FieldName.ClientName], []);
        // let endClientsFromList: any = await this._spListService.GetAllItemsFromList(ListName.EndClientMaster, "", [FieldName.Id, FieldName.Title], []);
        // let employeesFromList: any = await this._spListService.GetAllItemsFromList(ListName.ClientEmployeeMaster, "", [FieldName.Id, FieldName.LegalName, "Client_x0020_Name_x0020__x0028_D/Id", "Client_x0020_Name_x0020__x0028_D/Title"], ["Client_x0020_Name_x0020__x0028_D"]);
        let payrollCategoryField: IField = await this._spListService.GetListField(ListName.ClientInstructions, FieldName.PayrollCategory);
        await this.getClientInstructionMasterListItems();
        // this.convertMasterDataToModels(clientsFromList, countriesFromList, endClientsFromList, employeesFromList, payrollCategoryField["Choices"]);
        this.convertMasterDataToModels([], countriesFromList, [], [], payrollCategoryField["Choices"]);
    }
    public async  getClientInstructionMasterListItems():Promise<void>{
        if(this.clientInstructionMasterItemID!=null){
            let filter:string=`Id eq ${this.clientInstructionMasterItemID}`;
          let clientInstructionMasterData:any[]=  await this._spListService.GetAllItemsFromList(ListName.ClientInstructionMaster,filter,[ClientInstructionMasterListFields.Status],[]);
         if(clientInstructionMasterData.length>0){
             this.clientInstructionMasterItemStatus=clientInstructionMasterData[0][ClientInstructionMasterListFields.Status];
         }else{
            this.clientInstructionMasterItemStatus="";
         }
        }
    }
    public convertMasterDataToModels(clientsFromList: any[] = [], countriesFromList: any[] = [], endClientsFromList: any[] = [], employeesFromList: any[] = [], payrollCategoryOptions: string[] = []): void {
        // this.clients = clientsFromList.map((item) => {
        //     return new Client(item[FieldName.Id], item[FieldName.ClientName]);
        // });
        this.countries = countriesFromList.map((item) => {
            return new Country(item[FieldName.Id], item[FieldName.Title]);
        });
        // this.endClients = endClientsFromList.map((item) => {
        //     return new EndClient(item[FieldName.Id], item[FieldName.Title]);
        // });
        // this.employees = employeesFromList.map((item) => {
        //     return new Employee(
        //         item[FieldName.Id], 
        //         item[FieldName.LegalName], 
        //         item["Client_x0020_Name_x0020__x0028_D"]["Title"], item["Client_x0020_Name_x0020__x0028_D"]["Id"]);
        // });

        this.payrollCategoryOptions = payrollCategoryOptions;


    }
    public async GetClientInstructionListData(): Promise<void> {

        let payrollInstructionListItems: any[] = await this._spListService.GetAllItemsFromList(
            ListName.ClientInstructions, "",
            [`${ClientInstructionsListFields.InstructionMaster}/Id`, `${ClientInstructionsListFields.EndClient}/Title`, `${ClientInstructionsListFields.EndClient}/Id`, `${ClientInstructionsListFields.Employee}/Legal_x0020_Name`, `${ClientInstructionsListFields.Employee}/Id`, `${ClientInstructionsListFields.Country}/Title`, `${ClientInstructionsListFields.Country}/Id`, `${ClientInstructionsListFields.Client}/Client_x0020_Name`, `${ClientInstructionsListFields.Client}/Id`, ClientInstructionsListFields.PayrollCategory, ClientInstructionsListFields.Amount, FieldName.Id, ClientInstructionsListFields.Year, FieldName.Title, ClientInstructionsListFields.Month, ClientInstructionsListFields.Currency, ClientInstructionsListFields.Number, ClientInstructionsListFields.EffectiveDate, ClientInstructionsListFields.Remarks],
            [ClientInstructionsListFields.InstructionMaster, ClientInstructionsListFields.Country, ClientInstructionsListFields.Client, ClientInstructionsListFields.Employee, ClientInstructionsListFields.EndClient],
        );
        this.convertClientInstructionListDataToModel(payrollInstructionListItems);
        // this.setState({ ClientInstructionListItems: payrollInstructionListItemsModel });

    }
    private convertClientInstructionListDataToModel(clientInstructionListItems: any[]): void {
        this.clientInstructionListItems = [];
        clientInstructionListItems.forEach(item => {

            let clientItem: IClientInstructionListItem = {
                Id: item[ClientInstructionsListFields.Id],
                ClientId: item[ClientInstructionsListFields.Client]["Id"],
                Client: item[ClientInstructionsListFields.Client]["Client_x0020_Name"],
                CountryId: item[ClientInstructionsListFields.Country] ? item[ClientInstructionsListFields.Country]["Id"] : "",
                Country: item[ClientInstructionsListFields.Country] ? item[ClientInstructionsListFields.Country]["Title"] : "",
                Currency: item[ClientInstructionsListFields.Currency],
                EmployeeId: item[ClientInstructionsListFields.Employee] ? item[ClientInstructionsListFields.Employee]["Id"] : "",
                Employee: item[ClientInstructionsListFields.Employee] ? item[ClientInstructionsListFields.Employee]["Legal_x0020_Name"] : "",
                Month: item[ClientInstructionsListFields.Month],
                Number: item[ClientInstructionsListFields.Number],
                PayrollCategory: item[ClientInstructionsListFields.PayrollCategory],
                Year: item[ClientInstructionsListFields.Year],
                Amount: item[ClientInstructionsListFields.Amount],
                EffectiveDate: item[ClientInstructionsListFields.EffectiveDate]?moment(item[ClientInstructionsListFields.EffectiveDate]).format("DD-MM-yyyy"):"",
                EndClient: item[ClientInstructionsListFields.EndClient] ? item[ClientInstructionsListFields.EndClient]["Title"] : "",
                EndClientId: item[ClientInstructionsListFields.EndClient] ? item[ClientInstructionsListFields.EndClient]["Id"] : "",
                Instructions: item[ClientInstructionsListFields.Remarks] ? item[ClientInstructionsListFields.Remarks] : "",
                InstructionMasterId: item[ClientInstructionsListFields.InstructionMaster] ? item[ClientInstructionsListFields.InstructionMaster]["Id"] : "",

            };

            if (this.clientInstructionMasterItemID) {
                if (this.clientInstructionMasterItemID == String(clientItem.InstructionMasterId)) {
                    this.clientInstructionListItems.push(clientItem);
                }

            }
            // else {
            //     this.clientInstructionListItems.push(clientItem);
            // }



        });
        // this.clientInstructionListItems= clientInstructionListItems.map((item: any): IClientInstructionListItem => {
        //     debugger;
        //     return ;
        //   });

    }
    public async getFilteredEmployeeDetails(countryId: string, clientId: string = "", endClientId: string = ""): Promise<IEmployee[]> {

        let filter = `(${ClientEmployeeMasterListFields.Country}Id eq '${countryId}')`;
        if (clientId != "") {
            filter += `and (${ClientEmployeeMasterListFields.Client}Id eq '${clientId}')`;
        }
        if (endClientId != "") {
            filter += `and (${ClientEmployeeMasterListFields.EndClient}Id eq '${endClientId}')`;
        }
        // ,
        let selectFields = [
            `${ClientEmployeeMasterListFields.Client}/Id`,
            `${ClientEmployeeMasterListFields.Client}/Title`,
            FieldName.Id,
            ClientEmployeeMasterListFields.EmployeeNumber,
            ClientEmployeeMasterListFields.LegalName,
            `${ClientEmployeeMasterListFields.Country}/Title`,
            `${ClientEmployeeMasterListFields.Country}/Id`,
            `${ClientEmployeeMasterListFields.EndClient}/Title`,
            `${ClientEmployeeMasterListFields.EndClient}/Id`,
        ];
        let expandFields = [ClientEmployeeMasterListFields.Client, ClientEmployeeMasterListFields.EndClient, ClientEmployeeMasterListFields.Country];
        let employeesFromList: any[] = await this._spListService.GetAllItemsFromList(ListName.ClientEmployeeMaster, filter, selectFields, expandFields);
        this.employees = this.convertEmployeeListItemToEmployeeModel(employeesFromList);
        return this.employees;
    }
    private convertEmployeeListItemToEmployeeModel(employeesFromList: any[]): IEmployee[] {
        let employees: IEmployee[] = employeesFromList.map((item) => {
            let id: number = item[FieldName.Id];
            let legalName: string = item[FieldName.LegalName];
            let employeeNumber: string = item[ClientEmployeeMasterListFields.EmployeeNumber]?item[ClientEmployeeMasterListFields.EmployeeNumber]:"";
            let countryId: number = item[ClientEmployeeMasterListFields.Country] ? item[ClientEmployeeMasterListFields.Country]["Id"] : null;
            let countryTitle: string = item[ClientEmployeeMasterListFields.Country] ? item[ClientEmployeeMasterListFields.Country]["Title"] : "";

            let clientId: number = item[ClientEmployeeMasterListFields.Client] ? item[ClientEmployeeMasterListFields.Client]["Id"] : null;
            let clientName: string = item[ClientEmployeeMasterListFields.Client] ? item[ClientEmployeeMasterListFields.Client]["Title"] : "";

            let endClientId: number = item[ClientEmployeeMasterListFields.EndClient] ? item[ClientEmployeeMasterListFields.EndClient]["Id"] : null;
            let endClientName: string = item[ClientEmployeeMasterListFields.EndClient] ? item[ClientEmployeeMasterListFields.EndClient]["Title"] : "";

            return new Employee(id, employeeNumber, legalName, countryId, countryTitle, clientId, clientName, endClientId, endClientName);
        });
        return employees;
    }
    public async getFilteredClientDetails(countryId: string): Promise<IClient[]> {

        let employees: IEmployee[] = await this.getFilteredEmployeeDetails(countryId);
        let filterCollection: string[] = [];
        employees.forEach((item: IEmployee): void => {
            console.log(ClientMasterListFields);
            filterCollection.push(`(${ClientMasterListFields.Id} eq '${item.ClientId}')`);

        });

        let filter: string = filterCollection.join(" or ");
        if (filter == "") {
            return [];
        }
        let clientsFromList: any = await this._spListService.GetAllItemsFromList(ListName.ClientMaster, filter, [ClientMasterListFields.Id, ClientMasterListFields.ClientName], []);
        this.clients = clientsFromList.map((item) => {
            return new Client(item[ClientMasterListFields.Id], item[ClientMasterListFields.ClientName]);
        });
        return this.clients;

    }
    public async getFilteredEndClientDetails(countryId: string, clientId: string): Promise<IEndClient[]> {

        let employees: IEmployee[] = await this.getFilteredEmployeeDetails(countryId, clientId);
        let filterCollection: string[] = employees.map((item: IEmployee): string => {
            return `(${EndClientMasterListFields.Id} eq '${item.EndClientId}')`;

        });
        let filter: string = filterCollection.join(" or ");
        if (filter == "") {
            return [];
        }
        let clientsFromList: any = await this._spListService.GetAllItemsFromList(ListName.EndClientMaster, filter, [EndClientMasterListFields.Id, EndClientMasterListFields.Title], []);
        this.endClients = clientsFromList.map((item) => {
            return new EndClient(item[EndClientMasterListFields.Id], item[EndClientMasterListFields.Title]);
        });
        return this.endClients;

    }
    public async save(payrollFormValues: IPayrollFormValues): Promise<void> {

        for (let employeeCounter: number = 0; employeeCounter < payrollFormValues.Employee.length; employeeCounter++) {


            let effectiveDateMoment = moment(payrollFormValues.EffectiveDate);
            let monthInfo: string[] = payrollFormValues.Month.split("-");
            let year: string = monthInfo[0];
            let month: string = moment().month(monthInfo[1]).subtract(1, 'month').format("MMM");
            debugger;

            if (this.clientInstructionMasterItemID == null) {
                let addedItem: IItemAddResult = await this.AddItemsToClientInstructionMasterList(payrollFormValues.Client, month, year);
                this.clientInstructionMasterItemID = addedItem.data["Id"];
            }

            let itemId: number = await this.AddOrUpdateItemInClientInstructionsList(payrollFormValues, year, employeeCounter, effectiveDateMoment, month, this.clientInstructionMasterItemID);
            if (employeeCounter < payrollFormValues.Files.length) {
                await this.uploadFilesToClientInstructionDocumentsLibrary(itemId, payrollFormValues.Files[employeeCounter]);
            }

        }


    }
    private async AddOrUpdateItemInClientInstructionsList(payrollFormValues: IPayrollFormValues, year: string, employeeCounter: number, effectiveDateMoment: moment.Moment, month: string, instructionMasterId: string): Promise<number> {

        let clientInstructionAddResult: IItemAddResult = null;
        let item: any = {
            [ClientInstructionsListFields.Year]: year,
            [`${ClientInstructionsListFields.Country}Id`]: payrollFormValues.Country,
            [`${ClientInstructionsListFields.Client}Id`]: payrollFormValues.Client,
            [`${ClientInstructionsListFields.EndClient}Id`]: payrollFormValues.EndClient,
            [`${ClientInstructionsListFields.Employee}Id`]: payrollFormValues.Employee[employeeCounter]["id"],
            [ClientInstructionsListFields.Number]: payrollFormValues.Employee[employeeCounter]["name"].split("-")[0],
            [ClientInstructionsListFields.PayrollCategory]: payrollFormValues.PayrollCategory,
            [ClientInstructionsListFields.Currency]: payrollFormValues.Currency,
            [ClientInstructionsListFields.Remarks]: payrollFormValues.InstructionsForGoGoPal,
            [ClientInstructionsListFields.Amount]: payrollFormValues.Amount,
            [ClientInstructionsListFields.EffectiveDate]: effectiveDateMoment.toISOString(),
            [ClientInstructionsListFields.Month]: month
        };

        item[`${ClientInstructionsListFields.InstructionMaster}Id`] = instructionMasterId;
        // item["InstructionMasterId"] = instructionMasterId;
        let modifiedItemId:number=0;
        if (payrollFormValues.Id == 0) {
            clientInstructionAddResult = await this._spListService.AddItemsToList(ListName.ClientInstructions, item);
            modifiedItemId=clientInstructionAddResult.data["Id"];
        } else {
            clientInstructionAddResult = await this._spListService.UpdateItemInList(ListName.ClientInstructions, payrollFormValues.Id, item);
            modifiedItemId=payrollFormValues.Id;
        }
        return modifiedItemId;
    }
    private async uploadFilesToClientInstructionDocumentsLibrary(itemId: number, fileContent: any): Promise<void> {
        let libraryServerRelativeUrl: string = this._webServerRelativeUrl + "/" + Other.DocumentLibraryPath;
        let fileName: string = fileContent.name;
        let properties: any = { "InstructionId": itemId + "" };
        let fileResult: IFileAddResult = await this._spListService.AddItemsToDocumentLibrary(libraryServerRelativeUrl, fileName, fileContent, properties);


    }
    public async DeleteFileFromClientInstructionsDocumentLibrary(itemId:number):Promise<void>{
      await  this._spListService.DeleteItemFromList(ListName.ClientInstructionDocuments,itemId);
    }
    public async UpdateClientInstructionMasterListItemStatusToPublished(): Promise<IItemUpdateResult> {
        let item: any = {
           [ClientInstructionMasterListFields.Status] : "Publish"
        };
        let addedItem: IItemUpdateResult = await this._spListService.UpdateItemInList(ListName.ClientInstructionMaster, parseInt(this.clientInstructionMasterItemID), item);
        return addedItem;
    }
    public async GetFilesFromClientInstructionDocumentsLibrary(clientInstructionsItemId: number): Promise<IFile[]> {
        let filter: string = `InstructionId eq ${clientInstructionsItemId}`;
        let selectFields = ["Id", "FileRef", "FileLeafRef"];
        let files: IFile[] = await this._spListService.GetAllItemsFromList(ListName.ClientInstructionDocuments, filter, selectFields, []);
        return files;
    }


    private async AddItemsToClientInstructionMasterList(clientId: string, month: string, year: string): Promise<IItemAddResult> {
        let addedItem: IItemAddResult = await this._spListService.AddItemsToList(ListName.ClientInstructionMaster, {
            [`${ClientInstructionMasterListFields.Client}Id`]: clientId,
            [`${ClientInstructionMasterListFields.Month}`]: month,
            [`${ClientInstructionMasterListFields.Year}` ]: year
        });
        return addedItem;
    }
    public async refreshPage(includeInstructionMasterId: boolean = false): Promise<void> {
        if (includeInstructionMasterId) {
            window.location.href = this._urlService.updateQueryStringInUrl(window.location.href, "itemid", this.clientInstructionMasterItemID);
        }
    }
    public async deleteAllItems(selectedListItems:IClientInstructionListItem[]):Promise<void>{
      let deleteRequests:any[]=  selectedListItems.map((item:IClientInstructionListItem)=>{
          return  this._spListService.DeleteItemFromList(ListName.ClientInstructions, item.Id);
        });
       await Promise.all(deleteRequests);
        
         
    }

}
