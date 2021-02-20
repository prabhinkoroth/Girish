import { IClientInstructionListItem } from "../../../../models/PayrollForm/IClientInstructionListItem";

export interface IPayrollDetailTableProps{
    Title:string;
    SubTitle:string;
    RefreshTable:boolean;
    ClientInstructionListItems: IClientInstructionListItem[] ;
    editButtonClick:(clientInstruction:IClientInstructionListItem)=>void;
    deleteButtonClick:()=>void;
    publishButtonClick:()=>void;
    selectItemButtonClick:(event:any,clientInstruction:IClientInstructionListItem)=>void;
    showEditButton:boolean;
}