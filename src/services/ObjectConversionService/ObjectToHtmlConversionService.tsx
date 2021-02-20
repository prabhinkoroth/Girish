import { IDropdownProperties } from "../ObjectConversionService/ObjectConversionService";
import * as React from "react";


let convertToHtmlDropdownOption= (items: any[], properties: IDropdownProperties = null): JSX.Element[] => {
    let dropDownOptions: any[] = items.map((item): any => {
        if (properties == null) {
            return <option key={item} value={item}>{item}</option> ;
        } else {
            return <option key={item[properties.key]} value={item[properties.key]}>{item[properties.text] }</option>;
            
        }
        
    });
    return dropDownOptions;
};
export {convertToHtmlDropdownOption};