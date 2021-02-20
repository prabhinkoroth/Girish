import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'JoiningDetailsWebPartStrings';
import JoiningDetails from './components/JoiningDetails';
import { IJoiningDetailsProps } from './components/IJoiningDetailsProps';

export interface IJoiningDetailsWebPartProps {
  description: string;
}

export default class JoiningDetailsWebPart extends BaseClientSideWebPart<IJoiningDetailsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IJoiningDetailsProps> = React.createElement(
      JoiningDetails,
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
