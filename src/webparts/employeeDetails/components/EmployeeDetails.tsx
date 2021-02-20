import * as React from 'react';
import styles from './EmployeeDetails.module.scss';
import { IEmployeeDetailsProps, IEmployeeDetailsStats } from './IEmployeeDetailsPropsAndStates';
import { escape } from '@microsoft/sp-lodash-subset';
import * as pnp from "@pnp/sp/presets/all";
import { IEmployeeDetails } from '../models/IEmployeeDetails';
import { ClientEmployeeMaster as ClientMasterListDetails } from "../Configurations/Lists";
import { IUrlService, UrlService } from "../../../services/URLService/UrlService";
import * as $ from "jquery";

import * as bootstrap from "bootstrap";

require("../../../../node_modules/bootstrap/dist/css/bootstrap.min.css");

require("../../assets/goglobal-ui.css");
require("../../assets/applicationStyle.css");
require("../../../../node_modules/@fortawesome/fontawesome-free/css/all.min.css");
import {SPComponentLoader} from "@microsoft/sp-loader";
import * as moment from 'moment';

let logoImage=require("../../images/nouser.jpg"); 
export default class EmployeeDetails extends React.Component<IEmployeeDetailsProps, IEmployeeDetailsStats> {
  public _urlService: IUrlService;
  constructor(props: IEmployeeDetailsProps) {
    super(props);
    this.state = {

      employeeDetails: { Legal_x0020_Name: "", Start_x0020_Date: "", Expected_x0020_End_x0020_Date: "", First_x0020_name: "", Last_x0020_Name: "", CellPhone: "", Worker_x0020_Country0: null, EMail: "", End_x0020_Client: "", Client_x0020_Emp_x0020_ID: "", }
    };
    this._urlService = new UrlService();
    // SPComponentLoader.loadCss('https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css');
  }
  public componentDidMount(): void {
    pnp.sp.setup({
      spfxContext: this.props.context
    });
    let requestId: number = 0;
    let requestIdParam: string = this._urlService.getQueryString("Empid");
    if (requestIdParam != null) {
      requestId = parseInt(requestIdParam);
    }

    this.getRequestData(requestId);
  }
  public async getRequestData(requestId: number): Promise<void> {
    let employeeDetails: IEmployeeDetails = await pnp.sp.web.lists
    .getByTitle(ClientMasterListDetails.ListName).items.getById(requestId)
    .select(ClientMasterListDetails.FieldContactNumber, ClientMasterListDetails.FieldEmail, 
      ClientMasterListDetails.FieldStartDate, ClientMasterListDetails.FieldExpectedEndDate, 
      ClientMasterListDetails.FieldLegalName, ClientMasterListDetails.FieldClientEmpID,
       `${ClientMasterListDetails.FieldEndClient}/Title`, ClientMasterListDetails.FieldFirstName, 
       ClientMasterListDetails.FieldLastName, `${ClientMasterListDetails.FieldCountry}/Title`)
    .expand(ClientMasterListDetails.FieldEndClient,ClientMasterListDetails.FieldCountry).get();
    debugger;
    this.setState({ employeeDetails: employeeDetails });
  }
  public render(): React.ReactElement<IEmployeeDetailsProps> {
    debugger;
   
    return (
      <div className="card shadow mb-4">

        
        <div className="card-body">
          <div className="row">
            <div className="col-sm-3 profile-imgPic text-center">
              <a className="profile-img" href="#">
                <img src={""+logoImage} alt="image"  /></a>
    <h5 className="info-position text-secondary mt-2">{this.state.employeeDetails.Legal_x0020_Name}</h5>
            </div>
            <div className="col-sm-9">
              <div className="about-info row">
                <div className="col-sm-6 info-block">
                  <div className="info-icon hvr-trim"><i data-icon-name="UserFollowed" aria-hidden="true" className="ms-Icon root-43"></i></div>
                  <div className="info-text">
                    <span>End Client</span>
                    <div className="text-secondary">{this.state.employeeDetails.End_x0020_Client?this.state.employeeDetails.End_x0020_Client["Title"]:""}</div>
                  </div>
                </div>
                <div className="col-sm-6 info-block">
                  <div className="info-icon hvr-trim">
                  <i data-icon-name="UserWindow" aria-hidden="true" className="ms-Icon root-43"></i>
                    <i className="fa fa-pencil" title="Edit"></i> 
                    </div>
                  <div className="info-text">
                    <span>Client Employee ID</span>
                    <div className="text-secondary">{this.state.employeeDetails.Client_x0020_Emp_x0020_ID}</div>
                  </div>
                </div>

                <div className="col-sm-6 info-block">
                  <div className="info-icon hvr-trim"><i data-icon-name="Calendar" aria-hidden="true" className="ms-Icon root-43"></i></div>
                  <div className="info-text">
                    <span>Start Date</span>
                    <div className="text-secondary">{this.state.employeeDetails.Start_x0020_Date?moment(this.state.employeeDetails.Start_x0020_Date).format("DD-MM-yyyy"):""}</div>
                  </div>
                </div>
                <div className="col-sm-6 info-block">
                  <div className="info-icon hvr-trim"><i data-icon-name="Calendar" aria-hidden="true" className="ms-Icon root-43"></i> </div>
                  <div className="info-text">
                    <span>Expected End Date</span>
                    <div className="text-secondary">{this.state.employeeDetails.Expected_x0020_End_x0020_Date?moment(this.state.employeeDetails.Expected_x0020_End_x0020_Date).format("DD-MM-yyyy"):""}</div>
                  </div>
                </div>
                <div className="col-sm-6 info-block">
                  <div className="info-icon hvr-trim"><i data-icon-name="Mail" aria-hidden="true" className="ms-Icon root-43"></i></div>
                  <div className="info-text">
                    <span>Employee Email</span>
                    <div className="text-secondary">{this.state.employeeDetails.EMail}</div>
                  </div>
                </div>
                <div className="col-sm-6 info-block">
                  <div className="info-icon hvr-trim"><i data-icon-name="Phone" aria-hidden="true" className="ms-Icon root-43"></i> </div>
                  <div className="info-text">
                    <span>Employee Phone</span>
                    <div className="text-secondary">{this.state.employeeDetails.CellPhone}</div>
                  </div>
                </div>
                <div className="col-sm-6 info-block">
                  <div className="info-icon hvr-trim"><i data-icon-name="ContactCard" aria-hidden="true" className="ms-Icon root-43"></i> </div>
                  <div className="info-text">
                    <span>Worker Country</span>
                    <div className="text-secondary">{this.state.employeeDetails.Worker_x0020_Country0?this.state.employeeDetails.Worker_x0020_Country0["Title"]:""}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>);
  
  }
}
