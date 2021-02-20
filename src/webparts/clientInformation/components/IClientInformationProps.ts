 import {ICardListItem} from "../models/ICardListItem";
 import {BaseWebPartContext} from "@microsoft/sp-webpart-base";
export interface IClientInformationProps {
  description: string;
  context:BaseWebPartContext;
}
export interface IClientInformationState{
  // cards:ICardListItem[];
  allClientsCount:number;
    activeClientsCount:number;
    expiringClients:number;


}
