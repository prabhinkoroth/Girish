import * as React from "react";
import { IFile } from "../../../../models/PayrollForm/IPayrollFile";

export interface IPayrollFilesTable{
    Files:IFile[];
    deleteButtonClicked:(file:IFile)=>void;
}
export const PayrollFilesTable: React.FunctionComponent<IPayrollFilesTable> = (props: IPayrollFilesTable) => {    
  let items=  props.Files.map((item)=>{
        return (
            <tr>
                <td>
                   <a href={item.FileRef}> {item.FileLeafRef}</a>
                </td>
                <td>
                    <button type="button" className="btn btn-danger btn-sm" onClick={()=>props.deleteButtonClicked(item)}>Delete</button>
                </td>
            </tr>
        );
    });
    let table=(
    <table className="table table-striped">
        <thead>
            <tr>
                <th>
                    File Name
                </th>
                <th>
                    Action
                </th>
            </tr>
        </thead>
        <tbody>
        {...items}
        </tbody>
    </table>
    );
    if(props.Files.length==0){
        table=null;
    }
    return (    
      table  
    );    
 }; 