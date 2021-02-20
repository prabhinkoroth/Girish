import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'PayrollInputFormWebPartStrings';
import PayrollInputForm from './components/PayrollInputForm';
import { IPayrollInputFormProps } from './components/IPayrollInputFormProps';

export interface IPayrollInputFormWebPartProps {
  description: string;
}

export default class PayrollInputFormWebPart extends BaseClientSideWebPart<IPayrollInputFormWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IPayrollInputFormProps> = React.createElement(
      PayrollInputForm,
      {
        context:this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
