import {IClientEmployeeMasterListItem} from "./IListItems";
export interface IEmployeeDetails{
    Date:string;
    Count:number;
    Employees:IClientEmployeeMasterListItem[];
}