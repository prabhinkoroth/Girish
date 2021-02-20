import { IUserRegistrationListItem } from "../../../../models/userRegistration/IUserRegistrationListItem";


export interface IUserListProps{
    userRegistrationListItems:IUserRegistrationListItem[];
    onEditButtonClicked(Id:string):Promise<void>;
}