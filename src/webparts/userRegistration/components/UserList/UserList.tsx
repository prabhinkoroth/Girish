import * as React from "react";
import { IUserListProps } from "./IUserListProps";
import { DetailsList, DetailsListLayoutMode, Selection, IColumn } from "office-ui-fabric-react/lib/DetailsList";
import { IUserRegistrationListItem } from "../../../../models/userRegistration/IUserRegistrationListItem";
import { autobind } from "office-ui-fabric-react";
import { Image } from "office-ui-fabric-react/lib/Image";
import { Link } from "office-ui-fabric-react/lib/Link";


export default class UserList extends React.Component<IUserListProps, {}>{
  private _columns: IColumn[] = [];
  private _selection: Selection = null;
  constructor(props: IUserListProps) {
    super(props);
    this._columns = [
      { key: 'Id', name: 'Name', fieldName: 'Name', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'Id', name: 'Client', fieldName: 'Client', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'Id', name: 'Email', fieldName: 'Email', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'Id', name: 'Address', fieldName: 'Address', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'Id', name: 'Role', fieldName: 'RoleName', minWidth: 100, maxWidth: 200, isResizable: true },
      // { key: 'Id', name: 'EndDate', fieldName: 'EndDate', minWidth: 100, maxWidth: 200, isResizable: true },
      {
        key: 'Id', name: 'IsActive', fieldName: 'IsActive', minWidth: 100, maxWidth: 200, isResizable: true,
        onRender: (item: IUserRegistrationListItem, index: number, column: IColumn) => {
          let value: string = item.IsActive ? "Yes" : "No";
          return value;
        }
      },
      { key: 'Id', name: 'Reason', fieldName: 'Reason', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'Id', name: 'Action', fieldName: 'Id', minWidth: 100, maxWidth: 200, isResizable: true }
    ];
    this._selection = new Selection({
      onSelectionChanged: this.itemSelected
    });
  }
  public itemSelected(): void {
    alert("item being selected");
    const selectionCount = this._selection.getSelectedCount();
    let test = (this._selection.getSelection()[0] as IUserRegistrationListItem).Name;
  }
  @autobind
  private _onItemInvoked(item: IUserRegistrationListItem): void {
    // alert(`Item invoked: ${item.Name}`);
  }
  @autobind
  private _onRenderItemColumn(item: any, index: number, column: IColumn): JSX.Element {
    if (column.fieldName === 'Id') {

      return <Link data-selection-invoke={true} onClick={() => this._onEditButtonClicked(item)} >{"Edit"}</Link>;
    }
    return item[column.fieldName];
  }
  @autobind
  private async _onEditButtonClicked(item: any): Promise<void> {
    debugger;
    await this.props.onEditButtonClicked(item["Id"]);
  }
  public render(): React.ReactElement<IUserListProps> {
    return (
      <div>
        <DetailsList
          items={this.props.userRegistrationListItems}
          columns={this._columns}
          setKey="set"
          layoutMode={DetailsListLayoutMode.justified}
          selection={this._selection}
          selectionPreservedOnEmptyClick={true}
          ariaLabelForSelectionColumn="Toggle selection"
          ariaLabelForSelectAllCheckbox="Toggle selection for all items"
          checkButtonAriaLabel="Row checkbox"
          onItemInvoked={this._onItemInvoked}
          onRenderItemColumn={this._onRenderItemColumn}
        />
      </div>
    );
  }

}