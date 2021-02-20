import * as React from "react";

import { IEmployeeDetails } from "../../models/IJoiningDetails";
import { IClientEmployeeMasterListItem } from "../../models/IListItems";

export interface IEmployeePerDayDataTable {
    employees: IEmployeeDetails[];
    dataTableName: String;
    onRowClicked:(items:IClientEmployeeMasterListItem[])=> void;
}

const fnDate = (dt) =>{
    return Date.parse(dt);
};

export const EmployeePerDayDataTable: React.FunctionComponent<IEmployeePerDayDataTable> = (props: IEmployeePerDayDataTable) => {
    let employeePerDayCountDetails = props.employees.map((item) => {
        return (
            <tr key={item.Date} onClick={()=>props.onRowClicked(item.Employees)}>
               
                <td><span className="d-none">{fnDate(item.Date)}</span>{item.Date}</td>
                <td>{item.Count}</td>

            </tr>
        );
    });
    return (
        <div className="onboarding-datatableMain">
            <table  className={`table display dataTable no-footer home-datatable ${props.dataTableName}`}>
                <thead>
                    <tr>
                        
                        <th>Date</th>
                        <th>Count</th>

                    </tr>
                </thead>
                <tbody>
                    {...employeePerDayCountDetails}
                </tbody>
            </table>
        </div>

    );
};   