import * as React from 'react';
import styles from './UserRegistration.module.scss';
import { IUserRegistrationProps, IUserRegistrationState } from './IUserRegistrationPropsAndState';
import { escape } from '@microsoft/sp-lodash-subset';
import UserForm from './UserForm/UserForm';
import UserList from './UserList/UserList';
import { UserRegistrationManager } from '../DOM/UserRegistrationManager';
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import { IUserRegistrationFormValues, UserRegistrationFormValues } from '../../../models/userRegistration/IUserRegistrationFormValues';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { MasterDataCollection } from '../../../models/userRegistration/IMasterListItems';
import * as pnp from "@pnp/sp/presets/all";
import { IUserRegistrationListItem } from '../../../models/userRegistration/IUserRegistrationListItem';
import { IDropdownOption } from 'office-ui-fabric-react';

export default class UserRegistration extends React.Component<IUserRegistrationProps, IUserRegistrationState> {

  private _userRegistrationManager: UserRegistrationManager;
private _heading:any;
  constructor(props: IUserRegistrationProps) {
    super(props);
    this.state = {
      UserRegistrationListData: [],
      UserRegistrationFormValues: new UserRegistrationFormValues(),
      UserRegistrationFormMasterData: new MasterDataCollection()
    };
    this._userRegistrationManager = new UserRegistrationManager();
  }
  public async componentDidMount(): Promise<void> {
debugger;
    pnp.sp.setup({
      spfxContext: this.props.context
    });
    let userRegistrationListItems: IUserRegistrationListItem[];
    let masterData: MasterDataCollection = new MasterDataCollection();
    if (Environment.type == EnvironmentType.Local) {
      userRegistrationListItems = await this._userRegistrationManager.GetUserRegistrationDataMockData();
      await this._userRegistrationManager.GetAllMockMasterData();
    } else {
      userRegistrationListItems = await this._userRegistrationManager.GetUserRegistrationsDataFromList();
      await this._userRegistrationManager.GetAllMasterData();

    }
    masterData.clients = this._userRegistrationManager._clientMasterData;
    masterData.endClients = this._userRegistrationManager._endClientMasterData;
    masterData.vendors = this._userRegistrationManager._vendorMasterData;
    masterData.roles = this._userRegistrationManager._rolesMasterData;
    masterData.countries = this._userRegistrationManager._countriesMasterData;
    this.setState({ UserRegistrationListData: userRegistrationListItems, UserRegistrationFormMasterData: masterData });
  }
  @autobind
  public clientTypeCheckboxCheckHandler(userType: string) {
    let formValues = { ...this.state.UserRegistrationFormValues };
    formValues.UserType = userType;
    this.setState({ UserRegistrationFormValues: formValues });
  }
  @autobind
  public textBoxChangeHandler(key: string, value: string) {
    let formValues = { ...this.state.UserRegistrationFormValues };
    switch (event.target["id"]) {
      case "tbxEmail":
        formValues.Email = value;
        break;
      case "tbxName":
        formValues.Name = value;
        break;
      case "tbxAddress":
        formValues.Address = value;
        break;
      case "tbxRole":
        formValues.RoleKey = value;
        break;
        case "tbxReason":
          formValues.Reason=value;
          break;
    }
    this.setState({ UserRegistrationFormValues: formValues });
  }
  @autobind
  public dropdownChangeHandler(key: string, value: IDropdownOption) {
    let formValues = { ...this.state.UserRegistrationFormValues };

    switch (key) {
      case "ddlTypeValues":
        formValues.UserKey = value.key.toString();
        break;
      case "ddlRole":
        formValues.RoleKey = value.key.toString();
        break;
      case "ddlCountry":
        formValues.CountryKey = value.key.toString();
        break;
    }
    this.setState({ UserRegistrationFormValues: formValues });
  }
  @autobind
  public toggleButtonChangeHandler(key: string, value: boolean):void {
    debugger;
    let formValues = { ...this.state.UserRegistrationFormValues };
    formValues.Status = value;
    this.setState({ UserRegistrationFormValues: formValues });
  }
  @autobind
  public datepickerChangeHandler(key:string,value:Date):void{
    debugger;
    let formValues={...this.state.UserRegistrationFormValues};
    formValues.EndDate=value;
    this.setState({UserRegistrationFormValues:formValues});
  }
  @autobind
  public async editButtonClickHandler(Id: string): Promise<void> {
    let value = await this._userRegistrationManager.GetItemFromPortalUserMasterList(Id);
    this.setState({ UserRegistrationFormValues: value });
    this._heading.focus();
  }
  
  @autobind
  public async saveButtonClickHandler(): Promise<void> {

    debugger;
    await this._userRegistrationManager.SaveItemsToPortalUserMasterList(this.state.UserRegistrationFormValues);

    let data: IUserRegistrationListItem[] = await this._userRegistrationManager.GetUserRegistrationsDataFromList();
    this.setState({ UserRegistrationListData: data, UserRegistrationFormValues: new UserRegistrationFormValues() });
    alert("item has been saved successfully");
    
  }
  public render(): React.ReactElement<IUserRegistrationProps> {
    return (
      <div className={styles.userRegistration}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <span ref={this._heading} className={styles.title}>User Regisration</span>
              <UserForm 
                FormValues={this.state.UserRegistrationFormValues}
                UserRegistrationFormMasterData={this.state.UserRegistrationFormMasterData}
                clientTypeCheckboxCheckHandler={this.clientTypeCheckboxCheckHandler}
                textBoxChangeHandler={this.textBoxChangeHandler}
                dropdownChangeHandler={this.dropdownChangeHandler}
                toggleButtonChangeHandler={this.toggleButtonChangeHandler}
                datepickerChangeHandler={this.datepickerChangeHandler}
                saveButtonClickHandler={this.saveButtonClickHandler}

              ></UserForm> 
              <UserList onEditButtonClicked={this.editButtonClickHandler} userRegistrationListItems={this.state.UserRegistrationListData}></UserList>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
