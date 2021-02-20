import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IInstructionListItem } from "../../../models/InstructionList/IInstructionListItem";

export interface IInstructionListProps {
  description: string;
  context:WebPartContext;
}
export interface IInstructionListStates{
  instructionTableContent:IInstructionListItem[];
}
