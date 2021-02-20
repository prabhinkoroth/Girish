import { PrimaryButton, DefaultButton, DatePicker, Dropdown, IDropdownStyles, TextField, IDropdownOption } from "office-ui-fabric-react";
import * as React from "react";
import { IPayrollFormValues } from "../../../../models/PayrollForm/IPayrollFormValues";
import { IPayrollFormProps, IPayrollFormStats } from "./PayrollFormProps";

import { FilePicker, IFilePickerResult } from '@pnp/spfx-controls-react/lib';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import * as moment from "moment";
import { Card } from "../../../components/Card/Card";
import { Multiselect } from 'multiselect-react-dropdown';
import { PayrollFilesTable } from "../FileTable/PayrollFilesTable";
import { IValidationService } from "../../../../services/ValidationService/IValidaitonService";
import { ValidationService } from "../../../../services/ValidationService/ValidationService";
export default class PayrollForm extends React.Component<IPayrollFormProps, IPayrollFormStats>{
private _validationService:IValidationService;
    constructor(props: IPayrollFormProps) {
        super(props);
        this._validationService=new ValidationService();
        this.state = { InstructionErrorMessage: "", AmountErrorMessage: "", EffectiveDateErrorMessage: "", MonthErrorMessage: "", CountryValidationError: "", ClientValidationError: "", EmployeeValidationError: "", EndClientsValidationError: "", PayrollCategoryValidationError: "" };
    }
    public dropdownStyles: Partial<IDropdownStyles> = {
        dropdown: {
            //  width: 300,paddingRight:"5px" 
        },

    };

    public dropdownChangeHandler(event: React.FormEvent<HTMLDivElement>): void {
        let index =event.target["selectedIndex"];
        let label = event.target[index].text;
        this.props.updateFormValues(event.target["id"], event.target["value"],label);

    }
    private textboxChangeHandler(event: React.FormEvent<HTMLDivElement>): void {
        
        let value: string = event.target["value"];
        this.props.updateFormValues(event.target["id"], value);
    }
    @autobind
    private fileChangeHandler(event: React.FormEvent<HTMLDivElement>){
        
        let value: any[] = event.target["files"];
        this.props.updateFormValues(event.target["id"], value);
    }
    @autobind
    public onSelect(selectedList, selectedItem) {
        
        this.props.updateFormValues("ddlEmployee", selectedList);
    }
    @autobind
    public onRemove(selectedList, removedItem){
        
        this.props.updateFormValues("ddlEmployee", selectedList);
    }
    private saveButtonClickHandler(): void {
        let isFormValid: Boolean = true;
        let newState = { ...this.state };
        if (this.props.Country == "") {
            isFormValid = false;
            newState.CountryValidationError = "This field cannot be empty";
            // this.setState({ CountryValidationError: "" });
        } else {
            newState.CountryValidationError = "";
        }
        if (this.props.Client == "") {
            isFormValid = false;
            newState.ClientValidationError = "This field cannot be empty";
        } else {
            newState.ClientValidationError = "";
        }
        if (this.props.EndClient == "") {
            isFormValid = false;
            newState.EndClientsValidationError = "This field cannot be empty";
        } else {
            newState.EndClientsValidationError = "";
        }
        if (this.props.Employee.length==0) {
            isFormValid = false;
            newState.EmployeeValidationError = "This field cannot be empty";
        } else {
            newState.EmployeeValidationError = "";
        }
        
        if (this.props.Month == "") {
            isFormValid = false;
            newState.MonthErrorMessage = "This field cannot be empty";
        } else {
            newState.MonthErrorMessage = "";
        }
        // if (this.props.EffectiveDate == "") {
        //     isFormValid = false;
        //     newState.EffectiveDateErrorMessage = "This field cannot be empty";
        // } else {
        //     newState.EffectiveDateErrorMessage = "";
        // }
        if (this.props.PayrollCategory == "") {
            isFormValid = false;
            newState.PayrollCategoryValidationError = "This field cannot be empty";
        } else {
            newState.PayrollCategoryValidationError = "";
        }
        if (this.props.Amount == "") {
            isFormValid = false;
            newState.AmountErrorMessage = "This field cannot be empty";
        }else if(!this._validationService.isNumeric(this.props.Amount)){
            isFormValid = false;
            newState.AmountErrorMessage = "Not a valid number";
        } else {
            newState.AmountErrorMessage = "";
        }
        // if (this.props.InstructionsForGoGoPal == "") {
        //     isFormValid = false;

        //     newState.InstructionErrorMessage = "This field cannot be empty";
        // } else {
        //     newState.InstructionErrorMessage = "";
        // }
        this.setState({ ...newState });
        if (isFormValid) {
            
            this.props.saveItems();
        }

    }



    public render() {
        
        let employeeOptions: any[] = this.props.Employees.map((item) => {
            return { name:  (item["EmployeeNumber"]+"-"+item["LegalName"]), id: item["Id"] + "" };
        });
        let curDate=  new Date();
        let currentMonth= curDate.getFullYear()+'-'+(curDate.getMonth()+1);
        return (
            <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12">
            <Card heading="Payroll Input Form" subHeading="" key="main-form">
                <form className="form-wrapper">
                    <div className="row">
                        <div className="col-xl-3 col-lg-3 col-md-3">
                            <div className="form-group required mb-4">
                                <label className="control-label" >Country</label>
                                <select value={this.props.Country} onChange={this.dropdownChangeHandler.bind(this)} className="form-control" id="ddlCountry">
                                    <option value="">Select Country</option>
                                    {...this.props.Countries}
                                </select>
                                <label className="text-danger">{this.state.CountryValidationError}</label>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-3 col-md-3">
                            <div className="form-group required mb-4">
                                <label className="control-label" >Client</label>
                                <select value={this.props.Client} onChange={this.dropdownChangeHandler.bind(this)} className="form-control" id="ddlClient">
                                    <option value="">Select Client</option>
                                    {...this.props.Clients}
                                </select>
                                <label className="text-danger">{this.state.ClientValidationError}</label>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-3 col-md-3">
                            <div className="form-group required mb-4">
                                <label className="control-label" >End Client</label>
                                <select value={this.props.EndClient} onChange={this.dropdownChangeHandler.bind(this)} className="form-control" id="ddlEndClient">
                                    <option value="">Select End Client</option>
                                    {...this.props.EndCleints}
                                </select>
                                <label className="text-danger">{this.state.EndClientsValidationError}</label>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-3 col-md-3">
                            <div className="form-group selectEmployee required mb-4">
                                <label className="control-label" >Employee</label>
                                {/* <select value={this.props.Employee} onChange={this.dropdownChangeHandler.bind(this)} className="form-control" id="ddlEmployee">
                                    <option value="">Select Employee</option>
                                    {...this.props.Employees}
                                </select> */}
                                <Multiselect
                                    options={employeeOptions} // Options to display in the dropdown
                                    showCheckbox={true}
                                    selectedValues={this.props.Employee}
                                    // Preselected value to persist in dropdown
                                    onSelect={this.onSelect} // Function will trigger on select event
                                    onRemove={this.onRemove} // Function will trigger on remove event
                                    displayValue="name" // Property name to display in the dropdown options
                                    

                                />
                                <label className="text-danger">{this.state.EmployeeValidationError}</label>
                            </div>
                        </div>

                    </div>
                    <div className="row">
                        <div className="col-xl-3 col-lg-3 col-md-3">
                            <div className="form-group required mb-4">
                                <label className="control-label" >Payroll Month</label>
                                <input min={currentMonth} type="month" value={this.props.Month} className="form-control" id="tbxMonth" placeholder="Select Date" onChange={this.textboxChangeHandler.bind(this)} />
                                <label className="text-danger">{this.state.MonthErrorMessage}</label>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-3 col-md-3">
                            <div className="form-group mb-4">
                                <label className="control-label" >Effective Date</label>
                                <input type="date" value={this.props.EffectiveDate} className="form-control" id="tbxEffectuveDate" placeholder="Select Date" onChange={this.textboxChangeHandler.bind(this)} />
                                <label className="text-danger">{this.state.EffectiveDateErrorMessage}</label>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-3 col-md-3">
                            <div className="form-group required mb-4">
                                <label className="control-label" >Payroll Category</label>
                                <select value={this.props.PayrollCategory} onChange={this.dropdownChangeHandler.bind(this)} className="form-control" id="ddlPayrollCategory">
                                    <option value="">Select Category</option>
                                    {...this.props.PayrollCategories}
                                </select>
                                <label className="text-danger">{this.state.PayrollCategoryValidationError}</label>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-3 col-md-3">
                            <div className="form-group required mb-4">
                                <label className="control-label" >Amount</label>
                                <div className="form-control" id="formSelectAmount">
                                    <select className="amount-usd amountCurrency" value={this.props.Currency} onChange={this.dropdownChangeHandler.bind(this)} id="ddlCurrency">
                                    <option value="">Select</option>
                                        {...this.props.Currencies}
                                    </select>
                                    <input type="text" value={this.props.Amount} id="tbxAmount" onChange={this.textboxChangeHandler.bind(this)} className="amount-input" placeholder="Enter Amount" />
                                    <label className="text-danger">{this.state.AmountErrorMessage}</label>
                                </div>
                            </div>
                        </div>



                    </div>
                    <div className="row">
                        
                    </div>
                    <div className="row">
                        <div className="col-xl-8 col-lg-8">
                            <div className="row">
                                <div className="col-xl-6 col-lg-6 col-md-6">
                                    <div className="form-group">
                                        <label className="control-label" >Instruction for the Month to GoGlobal</label>
                                        <input type="text" value={this.props.InstructionsForGoGoPal} className="form-control" id="tbxInstructionsForTheMonthOfGoGopal" onChange={this.textboxChangeHandler.bind(this)} placeholder="Enter instructions" />
                                        <label className="text-danger">{this.state.InstructionErrorMessage}</label>
                                    </div>
                                </div>
                                <div className="col-xl-6 col-lg-6 col-md-6">
                                    <div className="form-group mb-4">
                                        <label className="control-label" >Attachments</label>
                                        <div className="attachment-formcontrol">
                                        <input type="file" id="filesPayroll" multiple={true} onChange={this.fileChangeHandler} className="" placeholder="File" aria-label="Tag Name" ></input>
                                            {/* <FilePicker
                                                label={'Select or upload file'}
                                                buttonClassName="ms-Button"
                                                buttonLabel={'Files'}
                                                accepts={[".pdf", ".docx", ".gif", ".jpg", ".jpeg", ".bmp", ".dib", ".tif", ".tiff", ".ico", ".png", ".jxr", ".svg"]}
                                                buttonIcon="Upload"
                                                onSave={this.props.fileSelectionChanged}
                                                onChanged={this.props.fileSelectionChanged}
                                                context={this.props.context}
                                            /> */}
                                            </div>

                                            <PayrollFilesTable Files={this.props.UploadedFiles} deleteButtonClicked={this.props.DeleteButtonClicked}></PayrollFilesTable>
                                        </div>
                                    </div>
                            </div>
                        </div>


                        <div className="col-xl-4 col-lg-4">
                            <div className="d-sm-flex align-items-center justify-content-end mt-4">
                                <button type="button" className="btn btn-primary" onClick={this.saveButtonClickHandler.bind(this)}>{this.props.Id?"Update":"Add"} to Payroll</button>
                                {/* <a href="#" className="btn btn-primary" onClick={this.saveButtonClickHandler.bind(this)}>Add to Payroll</a> */}
                            </div>
                        </div>
                    </div>
                </form>
            </Card>
        </div>
    </div>);

    }
}