import { IDropdownOption } from "office-ui-fabric-react";
import { MasterDataCollection } from "../../../../models/userRegistration/IMasterListItems";
import { IUserRegistrationFormValidationValues, IUserRegistrationFormValues } from "../../../../models/userRegistration/IUserRegistrationFormValues";


export interface IUserFormProps {
    FormValues: IUserRegistrationFormValues;
    UserRegistrationFormMasterData: MasterDataCollection;
    clientTypeCheckboxCheckHandler(userType: string):void;
    textBoxChangeHandler(key: string, value: string):void;
    dropdownChangeHandler(key: string, value: IDropdownOption):void;
    toggleButtonChangeHandler(key:string,value:boolean):void;
    datepickerChangeHandler(key:string,value:Date):void;
    saveButtonClickHandler(): void;
}
export interface IUserFormStates {
    FormValidationValues: IUserRegistrationFormValidationValues;

}