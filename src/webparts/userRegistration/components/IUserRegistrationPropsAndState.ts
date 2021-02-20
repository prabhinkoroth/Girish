import { WebPartContext } from "@microsoft/sp-webpart-base";
import { MasterDataCollection } from "../../../models/userRegistration/IMasterListItems";
import { IUserRegistrationFormValues } from "../../../models/userRegistration/IUserRegistrationFormValues";
import { IUserRegistrationListItem } from "../../../models/userRegistration/IUserRegistrationListItem";

export interface IUserRegistrationProps {
  description: string;
  context:WebPartContext;
}
export interface IUserRegistrationState{
  UserRegistrationListData:IUserRegistrationListItem[];
  UserRegistrationFormMasterData:MasterDataCollection;
  UserRegistrationFormValues:IUserRegistrationFormValues;
}