import * as React from 'react';
import styles from './InstructionList.module.scss';
import { IInstructionListProps, IInstructionListStates } from './IInstructionListProps';
import * as pnp from "@pnp/sp/presets/all";
import { escape } from '@microsoft/sp-lodash-subset';
import { Card } from '../../components/Card/Card';
import * as $ from "jquery";
import 'DataTables.net';
import { InstructionListManager } from "../Domain/Domain";
import { IInstructionListItem } from '../../../models/InstructionList/IInstructionListItem';
import { Log } from '@microsoft/sp-core-library';
require ("../../assets/applicationStyle.css");
let imgnext: any = require("../../images/next.png");
let imgprev: any = require("../../images/prev.png");

export default class InstructionList extends React.Component<IInstructionListProps, IInstructionListStates> {
  private _dataTables: DataTables.Api = null;
  private _appManager: InstructionListManager = null;

  constructor(props: IInstructionListProps) {
    super(props);
    this.state = {
      instructionTableContent: []
    };
    this._appManager = new InstructionListManager();
  }
  public componentDidMount(): void {
    pnp.sp.setup({
      spfxContext: this.props.context
    });

    this._appManager.getInstructionListData().then((value: IInstructionListItem[]) => {
      this.setState({ instructionTableContent: value });
    }).catch((error) => {
      debugger;

      alert("something went wrong ");
    });

  }
  public componentDidUpdate(): void {
    this._dataTables = $("#clientI-instructions-datatable").DataTable({
      ordering: true,
      pageLength: 5,
      lengthChange: false,
      lengthMenu: [[5, 10, 20, -1], [5, 10, 20, 'Todos']],
      searching: true,
      dom: "<'row'<'col-sm-12 col-md-4'l><'col-sm-12 col-md-8'<'filterOptions'fip>>>" +
                    "<'row'<'col-xl-12 col-lg-12 col-sm-12'tr>>",
      infoCallback: function (settings, start, end, max, total, pre) {
                    return (!isNaN(total))
                          ? "" + start + " - " + end + " of " + total + ""
                          + ((total !== max) ? " " + "" + " " : "")
                          : "Showing " + start + " to " + (start + this.api().data().length - 1);
      },
     //Language: { search: '<a class="btn searchBtn" id="searchBtn"><i class="fa fa-search"></i></a>' },
    });
    

  }

  public render(): React.ReactElement<IInstructionListProps> {
    let tableRows = this.state.instructionTableContent.map((item) => {

      return (<tr>
        <td><a href={this.props.context.pageContext.web.absoluteUrl+"/SitePages/PayrollInputForm.aspx?itemid="+item.Id}>{item.InstructionDate}</a> </td>
        
        <td>{item.EndClient}</td>
        <td>{item.Status}</td>
      </tr>);

    });
    return (
      <Card heading="Instructions List" subHeading="Showing data for last 90 days">
        <table id="clientI-instructions-datatable" className="table display nowrap" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Instruction Date</th>
              
              <th>Client</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tableRows}
          </tbody>
        </table>
      </Card>
    );
  }
}
