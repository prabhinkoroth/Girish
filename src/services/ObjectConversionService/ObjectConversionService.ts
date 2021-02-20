import { IDropdownOption } from "office-ui-fabric-react";

export interface IDropdownProperties {
    key: string;
    text: string;
}
let convertToDropDownOptions = (items: any[], properties: IDropdownProperties = null): IDropdownOption[] => {
    let dropDownOptions: IDropdownOption[] = items.map((item): IDropdownOption => {
       
        if (properties == null) {
            return { key: item, text: item};
        } else {
           
            return { key: item[properties.key]+"", text: item[properties.text] };
        }
    });
    return dropDownOptions;
};
export { convertToDropDownOptions };