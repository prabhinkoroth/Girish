import { IWebPartContext, WebPartContext } from "@microsoft/sp-webpart-base";
import { IFilePickerResult } from "@pnp/spfx-controls-react";
import { IDropdownOption } from "office-ui-fabric-react";
import { IFile } from "../../../../models/PayrollForm/IPayrollFile";
import { IPayrollFormValues } from "../../../../models/PayrollForm/IPayrollFormValues";

export interface IPayrollFormProps extends  IPayrollFormValues {
    Countries:any[];
    Clients:any[];
    EndCleints:any[];
    Employees:any[];
    PayrollCategories:any[];
    Currencies:any[];
    context:WebPartContext;
    updateFormValues:(field:string,value:any,text?:any)=>void;
    saveItems:()=>void;
     fileSelectionChanged: (file: IFilePickerResult)=>Promise<void>;
     cancelForm:()=>void;
     DeleteButtonClicked(file:IFile):Promise<void>;
    
}
export interface IPayrollFormStats {
    CountryValidationError:string;
    ClientValidationError:string;
    EndClientsValidationError:string;
    EmployeeValidationError:string;
    PayrollCategoryValidationError:string;
    MonthErrorMessage:string;
    EffectiveDateErrorMessage:string;
    AmountErrorMessage:string;
    InstructionErrorMessage:string;

}