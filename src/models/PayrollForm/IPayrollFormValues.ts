import { Files } from "@pnp/sp/files";
import { IFilePickerResult } from "@pnp/spfx-controls-react";
import { IFile } from "./IPayrollFile";

export interface IPayrollFormValues {
    Id: number;
    Country: string;
    Client: string;
    EndClient: string;
    Employee: any[];
    Month: string;
    EffectiveDate: string;
    PayrollCategory: string;
    Currency: string;
    Amount: string;
    InstructionsForGoGoPal: string;
    FileUrl: string;
    File: IFilePickerResult;
    Files:any[];
    UploadedFiles:IFile[];
}
export const PayrollFormDefaultValues: IPayrollFormValues = {
    Id: 0,
    Currency: "",
    File: null,
    FileUrl: "",
    Amount: "",
    Client: "",
    Country: "",
    EffectiveDate: "",
    Employee: [],
    EndClient: "",
    InstructionsForGoGoPal: "",
    Month: "",
    PayrollCategory: "",
    Files:[],    
    UploadedFiles:[]
};