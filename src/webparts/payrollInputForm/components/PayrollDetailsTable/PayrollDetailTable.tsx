import * as React from "react";
import { Card } from "../../../components/Card/Card";
import { IPayrollDetailTableProps } from "./IPayrollDetailTableProps";
import * as $ from "jquery";
import 'DataTables.net';
import { Icon } from "office-ui-fabric-react";
import styles from "../PayrollInputForm.module.scss";
export default class PayrollDetailsTable extends React.Component<IPayrollDetailTableProps, {}>{
    private _dataTables: DataTables.Api = null;
    public componentDidUpdate(): void {

        this._dataTables = $("#payroll-datatable").DataTable({
            ordering: true,
            searching: true,
            scrollX: true,
            order: [[0, "desc"]],
            columnDefs: [
                {
                    "targets": [0],
                    "visible": false,
                    "searchable": false
                }
            ],
            lengthChange:false
        });
        $("#tbx-search-payroll-table").keyup( (event)=> {
        
           
           let value:any= $(event["target"]).val();
            // let value1=String(value);
            $("#payroll-datatable").DataTable().search(value).draw();
            // $("#payroll-datatable").DataTable().serch($(this).val()).draw();
        });
        $(".searchIcon").click(function () {
            $(this).prev().toggleClass("gp-SearchBox-field-open");
            $(this).prev().focus();
            $(this).hide();
        });

        $(".gp-SearchBox-field").focusout(function () {
            if ($(this).val() == "") {
                $(this).removeClass("gp-SearchBox-field-open");
                $(this).next().show();
            }
        });


    }
    public shouldComponentUpdate(nextProps: IPayrollDetailTableProps): boolean {

        return nextProps.RefreshTable;
    }
    private _checkBoxClicked = (): void => {
        
        if ($('.tableCheckbox:checkbox:checked').length > 0) {
            $('.deleteIcon').removeClass('hide');

        }
        else {
            $('.deleteIcon').addClass('hide');
        }
    }
    public render(): React.ReactElement<IPayrollDetailTableProps> {

        if (this._dataTables != null) {
            this._dataTables.destroy();
        }
        let items = this.props.ClientInstructionListItems.map(item => {
            return (
                <tr key={item.Id}>

                    <td>{item.Id}</td>
                    {this.props.showEditButton ? (
                        <td>
                            <div className="custom-checkbox">
                                 <input type="checkbox" className="tableCheckbox" name="activecb1" onChange={this._checkBoxClicked} onClick={(event) => this.props.selectItemButtonClick(event, item)} /> 
                            </div>
                        </td>) : ""}
                    {/* {this.props.showEditButton ?
                        <td>
                            <button className="btn btn-primary" onClick={(event) => this.props.editButtonClick(item)}>Edit</button>
                        </td> : ""
                    } */}

                    <td>
                        <button className="btn btn-primary" onClick={(event) => this.props.editButtonClick(item)}>Edit</button>
                    </td>
                    <td>{item.Month}</td>
                    <td>{item.Year}</td>
                    <td>{item.Employee}</td>
                    <td>{item.Number}</td>
                    <td>{item.PayrollCategory}</td>
                    <td>{item.Country}</td>
                    <td>{item.Currency}</td>
                    <td>{item.Client}</td>
                    <td>{item.EndClient}</td>
                    <td>{item.EffectiveDate}</td>
                    <td>{item.Amount}</td>
                    <td>{item.Instructions}</td>






                </tr>

            );
        });
        return (
            <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12">
                <div className="card shadow mb-4">
                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between instructList-header">
                        <h6 className="m-0 font-weight-bold text-primary">{this.props.Title}
                            <div><small>{this.props.SubTitle}</small></div>
                        </h6>
                        <div className="comp-rightPanel payrollSerach d-flex justify-content-between">
                            <div className="searchBox">
                                <input type="text" className="gp-SearchBox-field" id="tbx-search-payroll-table" placeholder="Search.."></input>
                                <Icon iconName='Search' style={{ paddingLeft: 4 }} className="searchIcon" />
                            </div>
                            {/* <div className="dropdown no-arrow seeAllBtn">
                                <a className="dropdown-toggle" href="#" role="button">See All</a>
                            </div> */}
                            <div className="operations btn-grp">
                                {this.props.showEditButton ? (<a className="deleteIcon hide" onClick={this.props.deleteButtonClick}><i data-icon-name="Delete" aria-hidden="true" className="ms-Icon root-43"></i></a>) : ""}
                                
                                {this.props.showEditButton ? (<a className="yellow-btn submitInstruction-btn" onClick={this.props.publishButtonClick}>Submit Payroll Instructions</a>) : ""}
                            </div>
                        </div>
                        
                    </div>
                    <div>
                            
                        </div>
                    <div className={"card-body payroll-form-list"}>
                        <table id="payroll-datatable" className="table display nowrap" style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    {this.props.showEditButton ? <th className="no-sort">
                                        <div className="custom-checkbox">

                                            <label >Select</label>
                                        </div>
                                    </th> : ""}
                                    {/* {this.props.showEditButton ? <th>Action</th> : ""} */}
                                    <th>Action</th>
                                    <th>Month</th>
                                    <th>Year</th>
                                    <th>Employee</th>
                                    <th>EENumber</th>
                                    <th>Payroll Category</th>
                                    <th>Country</th>
                                    <th>Currency</th>
                                    <th>Client</th>
                                    <th>End Client</th>
                                    <th>EffectiveDate</th>
                                    <th>Amount</th>
                                    <th>Instructions</th>


                                </tr>
                            </thead>
                            <tbody>
                                {...items}
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
            </div>
        );
    }
}