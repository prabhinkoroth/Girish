import { IEmployee } from "../../../models/PayrollForm/IEmployee";
import {IEmployeeDetails} from "../models/IEmployeeDetails";
import {WebPartContext} from "@microsoft/sp-webpart-base";
export interface IEmployeeDetailsProps {
  description: string;
  context:WebPartContext;
}
export interface IEmployeeDetailsStats{
  employeeDetails:IEmployeeDetails;
}