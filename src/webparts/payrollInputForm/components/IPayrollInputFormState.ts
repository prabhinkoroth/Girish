import {ICountry} from "../../../models/PayrollForm/Country";
import {IClient} from "../../../models/PayrollForm/IClient";
import { IClientInstructionListItem } from "../../../models/PayrollForm/IClientInstructionListItem";
import { IEmployee } from "../../../models/PayrollForm/IEmployee";
import {IEndClient} from "../../../models/PayrollForm/IEndClient";
import { IPayrollCategory } from "../../../models/PayrollForm/IPayrollCategory";
import { IPayrollFormValues } from "../../../models/PayrollForm/IPayrollFormValues";
export interface IPayrollInputFormState{
    Countries:ICountry[];
    Clients:IClient[];
    EndCleints:IEndClient[];
    Employees:IEmployee[];
    PayrollCategories:string[];
    PayrollFormValues:IPayrollFormValues;
    ClientInstructionListItems:IClientInstructionListItem[];
    RefreshTable:boolean;
    ShowForm:boolean;
}