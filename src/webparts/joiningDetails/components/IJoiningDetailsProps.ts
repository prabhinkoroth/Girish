import { BaseWebPartContext } from "@microsoft/sp-webpart-base";
import { IEmployeeDetails } from "../models/IJoiningDetails";
import { IClientEmployeeMasterListItem } from "../models/IListItems";
export interface IJoiningDetailsProps {
                                            
  context: BaseWebPartContext;
}
export interface IJoiningDetailsState {
  JoiningDetails: IEmployeeDetails[];
  RelevingDetails: IEmployeeDetails[];
  RelevingEmployeesByDay: IClientEmployeeMasterListItem[];
  JoiningEmployeesByDay: IClientEmployeeMasterListItem[];
  showJoiningEmployeesPerDayDialog: boolean;
  showRelevingEmployeesPerDayDialog: boolean;
}
