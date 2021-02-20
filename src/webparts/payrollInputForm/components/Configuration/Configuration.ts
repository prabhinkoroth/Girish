export class ListName {

    public static readonly ClientInstructions: string = "Client Instructions";
    public static readonly ClientInstructionMaster:string="Client Instruction Master";
    public static readonly MiscellaneousMaster: string = "Miscellaneous Master";
    public static readonly ClientMaster: string = "Client Master";
    public static readonly EndClientMaster: string = "End Client Master";
    public static readonly ClientEmployeeMaster: string = "Client Employee Master";
    public static readonly ClientInstructionDocuments:string="ClientInstructionsDocuments";

}

export class FieldName {


    public static readonly PayrollCategory: string = "PayrollCategory";
    public static readonly Id: string = "Id";
    public static readonly Title: string = "Title";
    // public static readonly ClientName: string = "Client_x0020_Name";
    public static readonly LegalName: string = "Legal_x0020_Name";
}
export class ClientEmployeeMasterListFields{
    public static readonly Client:string="Client_x0020_Name_x0020__x0028_D";
    public static readonly EndClient:string="End_x0020_Client";
    public static readonly Country:string="Worker_x0020_Country0";
    public static readonly LegalName:string="Legal_x0020_Name";
    public static readonly  EmployeeNumber:string="Title";
    
}
export class ClientMasterListFields{
    public static readonly  Id:string="Id";
    public static readonly ClientName:string="Client_x0020_Name";
}
export class EndClientMasterListFields{
    public static readonly  Id:string="Id";
    public static readonly Title:string="Title";
}
export class ClientInstructionsListFields {
    public static readonly Id: string = "Id";
    public static readonly Month: string = "Month";
    public static readonly Year: string = "Year";
    public static readonly Employee: string = "EmployeeName";
    public static readonly Number: string = "EENumber";
    public static readonly PayrollCategory: string = "PayrollCategory";
    public static readonly Country: string = "Country";
    public static readonly Currency: string = "Currency";
    public static readonly Client: string = "Client";
    public static readonly Amount: string = "Amount";
    public static readonly EndClient: string = "EndClient";
    public static readonly EffectiveDate:string="EffectiveDate";
    public static readonly InstructionMaster:string="InstructionMaster";
    public static readonly  Remarks:string="Remarks";


}
// new entries
export class InstructionMasterFields1111 {
    public static readonly Id: string = "Id";
    public static readonly Country: string = "Country";
    public static readonly Client: string = "Client";
    public static readonly EndClient: string = "EndClient";
    public static readonly Employee: string = "EmployeeName";
    public static readonly Month: string = "Month";
    public static readonly EffectiveDate: string = "EffectiveDate";
    public static readonly Category: string = "PayrollCategory";
    public static readonly Instructions: string = "Instructions";
}
export class ClientInstructionMasterListFields{
    public static readonly Client:string="Client";
    public static readonly Month:string="Month";
    public static readonly Year:string="Year";
    public static readonly Status:string="Status";
}
export class Other {
    public static readonly DocumentLibraryPath: string = "ClientInstructionsDocuments";
}