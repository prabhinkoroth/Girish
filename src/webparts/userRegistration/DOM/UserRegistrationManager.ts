import { IItem, Item } from "@pnp/sp/items";
import { List } from "@pnp/sp/lists";
import { ClientMasterListItem, CountryMasterListItem, EndClientMasterListItem, RoleMasterListItem, VendorMasterListItem } from "../../../models/userRegistration/IMasterListItems";
import { IUserRegistrationFormValues } from "../../../models/userRegistration/IUserRegistrationFormValues";
import { IUserRegistrationListItem } from "../../../models/userRegistration/IUserRegistrationListItem";
import { IListOperationService, ListOperationService } from "../../../services/ListOperationSerivices/IListOperationsService";
import { ListName } from "../../payrollInputForm/components/Configuration/Configuration";
import { ListFieldsClientMaster, ListFieldsPortalUserMaster, ListNames } from "./Constants";

export class UserRegistrationManager {

    private _listService: IListOperationService = null;
    public _clientMasterData: ClientMasterListItem[];
    public _endClientMasterData: EndClientMasterListItem[];
    public _vendorMasterData: VendorMasterListItem[];
    public _rolesMasterData: RoleMasterListItem[];
    public _countriesMasterData: CountryMasterListItem[];
    constructor() {
        this._listService = new ListOperationService();
        this._vendorMasterData = [];
        this._endClientMasterData = [];
        this._clientMasterData = [];
        this._countriesMasterData = [];
        this._rolesMasterData = [];
    }
    public async GetAllMasterData(): Promise<void> {
        this._clientMasterData = await this._listService.GetAllItemsFromList(ListNames.ClientMaster, "", [ListFieldsClientMaster.Id, ListFieldsClientMaster.Title], []);
        this._endClientMasterData = await this._listService.GetAllItemsFromList(ListNames.EndClientMaster, "", [ListFieldsClientMaster.Id, ListFieldsClientMaster.Title], []);
        this._vendorMasterData = await this._listService.GetAllItemsFromList(ListNames.VendorMaster, "", [ListFieldsClientMaster.Id, ListFieldsClientMaster.Title], []);
        this._countriesMasterData = await this._listService.GetAllItemsFromList(ListNames.CountryMaster, "", [ListFieldsClientMaster.Id, ListFieldsClientMaster.Title], []);
        this._rolesMasterData = await this._listService.GetAllItemsFromList(ListNames.RoleMaster, "", [ListFieldsClientMaster.Id, ListFieldsClientMaster.Title], []);

        return null;
    }
    public async GetAllMockMasterData(): Promise<void> {
        this._clientMasterData = [
            { Id: 1, Title: "Client 1" },
            { Id: 2, Title: "Client 2" },
            { Id: 3, Title: "Client 3" },
            { Id: 4, Title: "Client 4" },
        ];
        this._endClientMasterData = [
            { Id: 1, Title: "EndClient 1" },
            { Id: 2, Title: "EndClient 2" },
            { Id: 3, Title: "EndClient 3" },
            { Id: 4, Title: "EndClient 4" },
        ],
            this._vendorMasterData = [
                { Id: 1, Title: "Vendor 1" },
                { Id: 2, Title: "Vendor 2" },
                { Id: 3, Title: "Vendor 3" },
                { Id: 4, Title: "Vendor 4" },
            ];

        return null;
    }
    public async GetUserRegistrationsDataFromList(): Promise<IUserRegistrationListItem[]> {
        let selectFields: string[] = [
            ListFieldsPortalUserMaster.Id,

            ListFieldsPortalUserMaster.Email,
            ListFieldsPortalUserMaster.Name,
            ListFieldsPortalUserMaster.PreferredLanguage,

            ListFieldsPortalUserMaster.Address,
            ListFieldsPortalUserMaster.IsActive,

            ListFieldsPortalUserMaster.EndDate,
            ListFieldsPortalUserMaster.Reason,
            `${ListFieldsPortalUserMaster.Vendor}/Id`,
            `${ListFieldsPortalUserMaster.Vendor}/Title`,
            `${ListFieldsPortalUserMaster.Client}/Id`,
            `${ListFieldsPortalUserMaster.Client}/Title`,
            `${ListFieldsPortalUserMaster.Role}/Id`,
            `${ListFieldsPortalUserMaster.Role}/Title`,
            `${ListFieldsPortalUserMaster.Country}/Id`,
            `${ListFieldsPortalUserMaster.Country}/Title`
        ];
        let expandFields: string[] = [

            ListFieldsPortalUserMaster.Client,
            ListFieldsPortalUserMaster.Role,
            ListFieldsPortalUserMaster.Vendor,
            ListFieldsPortalUserMaster.Country,
        ];
        let items: [] = await this._listService.GetAllItemsFromList(ListNames.PortalUserMaster, "", selectFields, expandFields);
        return this.convertToIUserRegistrationListItem(items);

    }
    public convertToIUserRegistrationListItem(items: any[]): IUserRegistrationListItem[] {
        return items.map((item): IUserRegistrationListItem => {
            return {
                Id: item[ListFieldsPortalUserMaster.Id],
                Email: item[ListFieldsPortalUserMaster.Email],
                Name: item[ListFieldsPortalUserMaster.Name],
                PreferredLanguage: item[ListFieldsPortalUserMaster.PreferredLanguage],
                IsActive: item[ListFieldsPortalUserMaster.IsActive],
                EndDate: item[ListFieldsPortalUserMaster.EndDate]==null?null:new Date(item[ListFieldsPortalUserMaster.EndDate]),
                Reason: item[ListFieldsPortalUserMaster.Reason],
                Address: item[ListFieldsPortalUserMaster.Address],
                VendorName: item[ListFieldsPortalUserMaster.Vendor] ? item[ListFieldsPortalUserMaster.Vendor]["Title"] : "",
                VendorId: item[ListFieldsPortalUserMaster.Vendor] ? item[ListFieldsPortalUserMaster.Vendor]["Id"] : 0,
                ClientId: item[ListFieldsPortalUserMaster.Client] ? item[ListFieldsPortalUserMaster.Client]["Id"] : 0,
                ClientName: item[ListFieldsPortalUserMaster.Client] ? item[ListFieldsPortalUserMaster.Client]["Title"] : "",
                RoleName: item[ListFieldsPortalUserMaster.Role] ? item[ListFieldsPortalUserMaster.Role]["Title"] : "",
                RoleId: item[ListFieldsPortalUserMaster.Role] ? item[ListFieldsPortalUserMaster.Role]["Id"] : 0,
                CountryName: item[ListFieldsPortalUserMaster.Country] ? item[ListFieldsPortalUserMaster.Country]["Title"] : "",
                CountryId: item[ListFieldsPortalUserMaster.Country] ? item[ListFieldsPortalUserMaster.Country]["Id"] : 0
            };
        });
    }
    public GetUserRegistrationDataMockData(): Promise<IUserRegistrationListItem[]> {
        return new Promise<IUserRegistrationListItem[]>((resolve) => {
            resolve([
                { Id: 1, Name: "Girish1", Address: "", Email: "", EndDate: null, Reason: "", IsActive: false, ClientId: 1, ClientName: "", CountryId: 1, CountryName: "", PreferredLanguage: "", RoleId: 1, RoleName: "", VendorId: 1, VendorName: "" },
                { Id: 2, Name: "Girish2", Address: "", Email: "", EndDate: null, Reason: "", IsActive: false, ClientId: 1, ClientName: "", CountryId: 1, CountryName: "", PreferredLanguage: "", RoleId: 1, RoleName: "", VendorId: 1, VendorName: "" },
                { Id: 3, Name: "Girish3", Address: "", Email: "", EndDate: null, Reason: "", IsActive: false, ClientId: 1, ClientName: "", CountryId: 1, CountryName: "", PreferredLanguage: "", RoleId: 1, RoleName: "", VendorId: 1, VendorName: "" }
            ]);
        });
    }

    public async SaveItemsToPortalUserMasterList(userRegistrationValues: IUserRegistrationFormValues): Promise<void> {
        let item: any = {
            [ListFieldsPortalUserMaster.Email]: userRegistrationValues.Email,
            [ListFieldsPortalUserMaster.Name]: userRegistrationValues.Name,
            [ListFieldsPortalUserMaster.Address]: userRegistrationValues.Address,
            [ListFieldsPortalUserMaster.Reason]: userRegistrationValues.Reason,
            "Title": userRegistrationValues.UserType,
            [ListFieldsPortalUserMaster.Country + "Id"]: userRegistrationValues.CountryKey,
            [ListFieldsPortalUserMaster.Role + "Id"]: userRegistrationValues.RoleKey,
            [ListFieldsPortalUserMaster.IsActive]: userRegistrationValues.Status,
            [ListFieldsPortalUserMaster.EndDate]:userRegistrationValues.EndDate==null||userRegistrationValues.EndDate==undefined?null:userRegistrationValues.EndDate.toISOString()
        };
        switch (userRegistrationValues.UserType) {
            case "Client":
                item[`${ListFieldsPortalUserMaster.Client}Id`] = parseInt(userRegistrationValues.UserKey);
                break;
            case "Vendor":
                item[`${ListFieldsPortalUserMaster.Vendor}Id`] = parseInt(userRegistrationValues.UserKey);
                break;
            case "ChannelPartner":
                break;
            case "EndClient":
                item[`${ListFieldsPortalUserMaster.EndClient}Id`] = parseInt(userRegistrationValues.UserKey);
                break;
        }

        if (userRegistrationValues.Id == 0) {
            await this._listService.AddItemsToList(ListNames.PortalUserMaster, item);
        } else {
           await this._listService.UpdateItemInList(ListNames.PortalUserMaster, userRegistrationValues.Id, item);
        }
        return null;
    }
    public async GetItemFromPortalUserMasterList(Id: string): Promise<IUserRegistrationFormValues> {
        debugger;
        let item: IItem = await this._listService.GetItemById(ListNames.PortalUserMaster, parseInt(Id));

        let userType: string = "";
        let userKey: string = "";
        if (item[ListFieldsPortalUserMaster.Client + "Id"] != null) {
            userType = "Client";
            userKey = item[ListFieldsPortalUserMaster.Client + "Id"] + "";
        } else if (item[ListFieldsPortalUserMaster.Vendor + "Id"] != null) {
            userType = "Vendor";
            userKey = item[ListFieldsPortalUserMaster.Vendor + "Id"] + "";
        } else if (item[ListFieldsPortalUserMaster.EndClient + "Id"] != null) {
            userType = "EndClient";
            userKey = item[ListFieldsPortalUserMaster.EndClient + "Id"] + "";
        }
        let value: IUserRegistrationFormValues = {
            Id: item[ListFieldsPortalUserMaster.Id],
            Email: item[ListFieldsPortalUserMaster.Email],
            Name: item[ListFieldsPortalUserMaster.Name],
            Address: item[ListFieldsPortalUserMaster.Address],
            EndDate: item[ListFieldsPortalUserMaster.EndDate],
            Reason: item[ListFieldsPortalUserMaster.Reason],
            RoleKey: item[ListFieldsPortalUserMaster.Role + "Id"] + "",
            RoleValue: "",
            Status: item[ListFieldsPortalUserMaster.IsActive],
            UserType: userType,
            UserKey: userKey,
            UserValue: "",
            CountryKey: item[ListFieldsPortalUserMaster.Country + "Id"] + "",
            CountryValue: ""
        };
        return value;

    }


}