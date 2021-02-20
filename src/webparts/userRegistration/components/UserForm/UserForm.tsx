import * as React from "react";
import { IUserFormProps, IUserFormStates } from "./IUserFormProps";
import { Stack } from "office-ui-fabric-react/lib/Stack";
import { Checkbox } from "office-ui-fabric-react/lib/Checkbox";
import { autobind } from "office-ui-fabric-react/lib/Utilities";
import { Label } from 'office-ui-fabric-react/lib/Label';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Dropdown, IDropdownOption } from "office-ui-fabric-react/lib/Dropdown";
import { DatePicker } from "office-ui-fabric-react/lib/DatePicker";
import { Toggle } from "office-ui-fabric-react/lib/Toggle";
import { PrimaryButton, BaseButton, Button } from "office-ui-fabric-react/lib/Button";

import styles from "./form.module.scss";
import { convertToDropDownOptions, IDropdownProperties } from "../../../../services/ObjectConversionService/ObjectConversionService";
import { UserRegistrationFormValidationValues } from "../../../../models/userRegistration/IUserRegistrationFormValues";
import { IValidationService } from "../../../../services/ValidationService/IValidaitonService";
import { ValidationService } from "../../../../services/ValidationService/ValidationService";
const stackTokens = { childrenGap: 10 };
export default class UserForm extends React.Component<IUserFormProps, IUserFormStates>{
private _iValidationService:IValidationService=null;
    constructor(props: IUserFormProps) {
        super(props);
        this._iValidationService=new ValidationService();
        this.state = { FormValidationValues: new UserRegistrationFormValidationValues() };
    }
    @autobind
    private _checkboxUserTypeChecked(ev: React.FormEvent<HTMLElement>, isChecked: boolean): void {
        switch (ev.target["id"]) {
            case "chkBxClient":
                this.props.clientTypeCheckboxCheckHandler("Client");
                break;
            case "chkBxVendor":
                this.props.clientTypeCheckboxCheckHandler("Vendor");
                break;

            case "chkBxChannelPartner":
                this.props.clientTypeCheckboxCheckHandler("ChannelPartner");
                break;

            case "chkBxEndClient":
                this.props.clientTypeCheckboxCheckHandler("EndClient");
                break;


        }

    }

    @autobind
    private _textboxChanged(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void {
        this.props.textBoxChangeHandler(event.target["id"], newValue);
    }
    @autobind
    private _datepickerChanged(controlName: string, date: Date | null | undefined): void {
        debugger;
        this.props.datepickerChangeHandler(controlName, date);
    }
    @autobind
    private _toggleButtonChanged(ev: React.MouseEvent<HTMLElement>, checked: boolean) {
        this.props.toggleButtonChangeHandler(event.target["Id"], checked);
        console.log('toggle is ' + (checked ? 'checked' : 'not checked'));
    }
    @autobind
    private onFormatDate(date?: Date): string {
        debugger;
        if(date==null){
            return "";
        }
        
        return !date ? '' : date.getDate() + '/' + (date.getMonth() + 1) + '/' + (date.getFullYear() % 100);
    }
    @autobind
    private _dropdownChanged(event: React.FormEvent<HTMLDivElement>, option: IDropdownOption, index: number) {
        this.props.dropdownChangeHandler(event.target["id"], option);
    }
    @autobind
    private _validateForm(): boolean {
        debugger;
        let validationMessages: UserRegistrationFormValidationValues = new UserRegistrationFormValidationValues();
        let isFormValid: boolean = true;
        if (this.props.FormValues.UserType == "") {
            validationMessages.UserType = "Required";
            isFormValid = false;
        }
        if (this.props.FormValues.UserKey == "") {
            validationMessages.UserKey = "Required";
            isFormValid = false;
        }
        if(this.props.FormValues.RoleKey==""){
            validationMessages.RoleKey="Required";
            isFormValid=false;
        }
        if(this.props.FormValues.CountryKey==""){
            validationMessages.CountryKey="Required";
            isFormValid=false;
        }
        if (this.props.FormValues.Email == "") {
            validationMessages.Email = "Required";
            isFormValid = false;
        }else if(!this._iValidationService.isEmail(this.props.FormValues.Email)){
            validationMessages.Email="Not a valid email address";
            isFormValid=false;
        }
        if (this.props.FormValues.Name == "") {
            validationMessages.Name = "Required";
            isFormValid = false;
        }
        if (this.props.FormValues.Address == "") {
            validationMessages.Address = "Required";
            isFormValid = false;
        }
        
        this.setState({ FormValidationValues: validationMessages });
        return isFormValid;
    }
    @autobind
    private _buttonClicked(event: React.MouseEvent<BaseButton>): void {
        debugger;
        
        if (this._validateForm()) {
            this.props.saveButtonClickHandler();

        }
        switch (event.target["id"]) {
            case "btnSave":

                break;
        }

    }
    public render(): React.ReactElement<IUserFormProps> {
        let usersDropdownValue = [];
        let countriesDropdownValues = [];
        let rolesDropdownValues = [];
        switch (this.props.FormValues.UserType) {
            case "Client":
                usersDropdownValue = convertToDropDownOptions(this.props.UserRegistrationFormMasterData.clients, { key: "Id", text: "Title" });
                break;
            case "Vendor":
                usersDropdownValue = convertToDropDownOptions(this.props.UserRegistrationFormMasterData.vendors, { key: "Id", text: "Title" });
                break;
            case "ChannelPartner":
                usersDropdownValue = convertToDropDownOptions(this.props.UserRegistrationFormMasterData.endClients, { key: "Id", text: "Title" });
                break;
            case "EndClient":
                usersDropdownValue = convertToDropDownOptions(this.props.UserRegistrationFormMasterData.endClients, { key: "Id", text: "Title" });
                break;
        }
        countriesDropdownValues = convertToDropDownOptions(this.props.UserRegistrationFormMasterData.countries, { key: "Id", text: "Title" });
        rolesDropdownValues = convertToDropDownOptions(this.props.UserRegistrationFormMasterData.roles, { key: "Id", text: "Title" });

        return (
            <div>
                {/* <React.StrictMode> */}
                <div className={`ms-Grid form-section ${styles.formSection}`} dir="ltr">
                    <div className={`ms-Grid-row ${styles.formRow}`}>
                        <div className="ms-Grid-col ms-sm6 ms-xl6">
                            <Label required>Type</Label>
                        </div>
                        <div className="ms-Grid-col ms-sm6 ms-xl6">
                            <Stack tokens={stackTokens}>
                                <Checkbox id="chkBxClient" checked={this.props.FormValues.UserType == "Client"} label="Client" onChange={this._checkboxUserTypeChecked} />
                                <Checkbox id="chkBxVendor" checked={this.props.FormValues.UserType == "Vendor"} label="Vendor" onChange={this._checkboxUserTypeChecked} />
                                <Checkbox id="chkBxChannelPartner" checked={this.props.FormValues.UserType == "ChannelPartner"} label="Channel Partner" onChange={this._checkboxUserTypeChecked} />
                                <Checkbox id="chkBxEndClient" checked={this.props.FormValues.UserType == "EndClient"} label="EndClient" onChange={this._checkboxUserTypeChecked} />
                                <Label  >{this.state.FormValidationValues.UserType}</Label>
                            </Stack>
                        </div>
                    </div>

                    <div className={`ms-Grid-row ${styles.formRow}`}>
                        <div className="ms-Grid-col ms-sm6 ms-xl6">
                            <Label required>{this.props.FormValues.UserType==""?"Client":this.props.FormValues.UserType}</Label>
                        </div>
                        <div className="ms-Grid-col ms-sm6 ms-xl6">
                            <Dropdown
                                id="ddlTypeValues"

                                selectedKey={this.props.FormValues.UserKey}
                                // eslint-disable-next-line react/jsx-no-bind
                                onChange={this._dropdownChanged}
                                placeholder="Select an User Type"
                                options={usersDropdownValue}
                                errorMessage={this.state.FormValidationValues.UserKey}

                            />
                        </div>
                    </div>
                    <div className={`ms-Grid-row ${styles.formRow}`}>
                        <div className="ms-Grid-col ms-sm6 ms-xl6">
                            <Label required>Email</Label></div>
                        <div className="ms-Grid-col ms-sm6 ms-xl6">
                            <TextField
                                id="tbxEmail"

                                errorMessage={this.state.FormValidationValues.Email}
                                value={this.props.FormValues.Email}
                                onChange={this._textboxChanged}

                            />
                        </div>
                    </div>
                    <div className={`ms-Grid-row ${styles.formRow}`}>
                        <div className="ms-Grid-col ms-sm6 ms-xl6">
                            <Label required>Name</Label>
                        </div>
                        <div className="ms-Grid-col ms-sm6 ms-xl6">
                            <TextField
                                id="tbxName"

                                name="tbxName"
                                errorMessage={this.state.FormValidationValues.Name}
                                value={this.props.FormValues.Name}
                                onChange={this._textboxChanged}

                            />
                        </div>
                    </div>
                    <div className={`ms-Grid-row ${styles.formRow}`}>
                        <div className="ms-Grid-col ms-sm6 ms-xl6">
                            <Label required>Address</Label>
                        </div>
                        <div className="ms-Grid-col ms-sm6 ms-xl6">
                            <TextField
                                id="tbxAddress"

                                errorMessage={this.state.FormValidationValues.Address}
                                value={this.props.FormValues.Address}
                                onChange={this._textboxChanged}

                            />
                        </div>
                    </div>
                    <div className={`ms-Grid-row ${styles.formRow}`}>
                        <div className="ms-Grid-col ms-sm6 ms-xl6">
                            <Label required>Country</Label>
                        </div>
                        <div className="ms-Grid-col ms-sm6 ms-xl6">
                            <Dropdown
                                id="ddlCountry"
                                selectedKey={this.props.FormValues.CountryKey}
                                onChange={this._dropdownChanged}
                                placeholder="Select an User Type"
                                options={countriesDropdownValues}
                                errorMessage={this.state.FormValidationValues.CountryKey}

                            />

                        </div>
                    </div>
                    <div className={`ms-Grid-row ${styles.formRow}`}>
                        <div className="ms-Grid-col ms-sm6 ms-xl6">
                            <Label required>Role</Label>
                        </div>
                        <div className="ms-Grid-col ms-sm6 ms-xl6">
                            <Dropdown
                                id="ddlRole"
                                selectedKey={this.props.FormValues.RoleKey}
                                onChange={this._dropdownChanged}
                                placeholder="Select an User Type"
                                options={rolesDropdownValues}
                                errorMessage={this.state.FormValidationValues.RoleKey}

                            />

                        </div>
                    </div>
                    <div className={`ms-Grid-row ${styles.formRow}`}>
                        <div className="ms-Grid-col ms-sm6 ms-xl6">
                            <Label >End Date</Label>
                        </div>
                        <div className="ms-Grid-col ms-sm6 ms-xl6">
                            <DatePicker

                                id="dpEndDate"

                               
                                allowTextInput={true}

                                value={this.props.FormValues.EndDate}
                                // eslint-disable-next-line react/jsx-no-bind
                                onSelectDate={(value: Date) => { this._datepickerChanged("dpEndDate", value); }}
                                formatDate={this.onFormatDate}
                            // eslint-disable-next-line react/jsx-no-bind

                            />
                        </div>
                    </div>
                    <div className={`ms-Grid-row ${styles.formRow}`}>
                        <div className="ms-Grid-col ms-sm6 ms-xl6">
                            <Label required>Status</Label>
                        </div>
                        <div className="ms-Grid-col ms-sm6 ms-xl6">
                            <Toggle id="tglStatus" onChange={this._toggleButtonChanged} checked={this.props.FormValues.Status} defaultChecked onText="Active" offText="In Active" />
                        </div>
                    </div>
                    <div className={`ms-Grid-row ${styles.formRow}`}>
                        <div className="ms-Grid-col ms-sm6 ms-xl6">
                            <Label >Reason</Label>
                        </div>
                        <div className="ms-Grid-col ms-sm6 ms-xl6">
                            <TextField id="tbxReason" disabled={!this.props.FormValues.Status}
                                value={this.props.FormValues.Reason}
                                onChange={this._textboxChanged} ></TextField>
                        </div>
                    </div>
                    <div className={`ms-Grid-row ${styles.formRow}`}>

                        <div className="ms-Grid-col ms-sm6 ms-xl6">
                            <PrimaryButton id="btnSave" onClick={this._buttonClicked} text="Save" />
                        </div>
                    </div>

                </div>
                {/* </React.StrictMode> */}

            </div>
        );
    }

}