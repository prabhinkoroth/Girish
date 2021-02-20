import * as React from 'react';
import styles from './ClientInformation.module.scss';
import { IClientInformationProps, IClientInformationState } from './IClientInformationProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { ICardListItem } from "../models/ICardListItem";
import { sp } from "@pnp/sp/presets/all";
import { IClientInformationList } from "../models/IClientInformationList";

// import * as $ from 'jquery';
// import  * as bootstrap from "bootstrap";
import {SPComponentLoader} from "@microsoft/sp-loader";
require('../../../../node_modules/bootstrap/dist/css/bootstrap.min.css');

// import * as $ from "jquery";

// import * as bootstrap from "bootstrap";

require("../../../../node_modules/bootstrap/dist/css/bootstrap.min.css");
require("../../assets/applicationStyle.css");

import configuration from "../configuration";
import * as moment from "moment";
let imgRenewContracts: any = require("../../images/renew-contracts.png");
let imgActiveClients: any = require("../../images/active-clients.png");
let imgTotlaClients: any = require("../../images/total-clients.png");
let imgPayrollUpdates: any = require("../../images/payroll-updates.png");

require("../../assets/applicationStyle.css");
export default class ClientInformation extends React.Component<IClientInformationProps, IClientInformationState> {
  /**
   *
   */
  constructor(props: IClientInformationProps) {
    super(props);
    this.state = {
      activeClientsCount: 0, allClientsCount: 0, expiringClients: 0
    };
    
    
    //  SPComponentLoader.loadCss('https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css');
    SPComponentLoader.loadCss('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css');

    SPComponentLoader.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js', { globalExportsName: 'jQuery' }).then((jQuery: any): void => {
      SPComponentLoader.loadScript('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js',  { globalExportsName: 'jQuery' }).then((): void => {  
        debugger;
        ( jQuery("#addDropdown") ).dropdown();      
      });
    });

  }
  public componentDidMount(): void {
    sp.setup({
      spfxContext: this.props.context
    });
  
    this.getDataFromSharePoint();
  }
  public render(): React.ReactElement<IClientInformationProps> {

    return (

      <div className="dashboard-top dashboard-AddBtn">
        <div className="row button-row">
          <div className="dropdown yellow-btndropdown">
            <a href="#" className="yellow-btn dropdown-toggle" id="addDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <i className="fas fa-plus"></i>+Add
                </a>
            <div className="dropdown-menu dropdown-menu-right shadow" aria-labelledby="addDropdown" >
              <a className="dropdown-item" href={this.props.context.pageContext.web.absoluteUrl+"/SitePages/PayrollInputForm.aspx"}>
                <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                        Provide Payroll Instructions
                    </a>
              {/* <a className="dropdown-item" href="#">
                <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                        Settings
                    </a>
              <a className="dropdown-item" href="#">
                <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                        Activity Log
                    </a> */}
            </div>
          </div>
        </div>

        <div className="tab-content">
          <div className="tab-pane active" id="overview-tabs" role="tabpanel">

            <div className="row">

              <div className="col-xl-3 col-md-3 mb-4">
                <div className="card shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col-auto">
                        <img src={imgTotlaClients} alt="Total Clients" />
                      </div>
                      <div className="col ml-4">
                        <div className="text-xs mb-1">Total Clients</div>
                        <div className="h4 mb-0 text-gray-800">{this.state.allClientsCount}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-md-3 mb-4">
                <div className="card shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col-auto">
                        <img src={imgActiveClients} alt="Active Clients" />
                      </div>
                      <div className="col ml-4">
                        <div className="text-xs mb-1">Active Clients</div>
                        <div className="h4 mb-0 text-gray-800">{this.state.activeClientsCount}</div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-md-3 mb-4">
                <div className="card shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col-auto">
                        <img src={imgRenewContracts} alt="Renew Contracts" />
                      </div>
                      <div className="col ml-4">
                        <div className="text-xs mb-1">Renew Contracts</div>
                        <div className="h4 mb-0 text-gray-800">{this.state.expiringClients}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-md-3 mb-4">
                <div className="card shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col-auto">
                        <img src={imgPayrollUpdates} alt="Payroll Updates" />
                      </div>
                      <div className="col ml-4">
                        <div className="text-xs mb-1">Payroll Updates</div>
                        <div className="h4 mb-0 text-gray-800">250<small>/250 this month</small></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );

  }
  protected getMessages(): void {
    debugger;

  }
  protected async getDataFromSharePoint(): Promise<void> {
    let activeItems: IClientInformationList[] = await sp.web.lists.getByTitle(configuration.ListNameClientMaster).items.filter("IsActive eq 1").select("Title").getAll(5000);
    let allClientsCountData: any = await sp.web.lists.getByTitle(configuration.ListNameClientMaster).select("ItemCount").get();

    let momentTodayDate = moment(new Date());
    let momentDateAfter90Days = moment(new Date()).add(90, 'days');

    let todayString: string = momentTodayDate.format("YYYY-MM-DD");
    let afterSpecificTimeString: string = momentDateAfter90Days.format("YYYY-MM-DD");

    var currentDate = todayString + 'T00:00:00.0000000Z';
    var afterTimeFrameDate = afterSpecificTimeString + 'T00:00:00.0000000Z';

    let expiringItems: string[] = await sp.web.lists.getByTitle(configuration.ListNameEmployeeCLientMaster).items.filter(`(Expected_x0020_End_x0020_Date gt datetime'${currentDate}') and (Expected_x0020_End_x0020_Date le datetime'${afterTimeFrameDate}')`).select("Title").getAll();
    console.log(expiringItems);
    debugger;

    //  let newCardMessages:ICardListItem[]=[
    //    {message:`Active Clients : ${activeItems.length}`},
    //    {message:`All Clients : ${data.ItemCount}`},
    //    {message:`Expiring in 90 Days : ${expiringItems.length}`}
    //   ];
    this.setState({ allClientsCount: allClientsCountData.ItemCount, activeClientsCount: activeItems.length, expiringClients: expiringItems.length });

  }
}
