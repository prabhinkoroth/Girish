import * as moment from "moment";

export interface IClientEmployeeMasterListItem{
    Id:number;
    Title:string;
    Date:string;
    DateValue:Date;
    FirstName:string;
    LastName:string;
    Counter:number;
    ClientName:string;
    LegalName:string;
    Country:string;
}
export class ClientEmployeeMasterListItem implements  IClientEmployeeMasterListItem{
    
  
    constructor(id:number,title:string,date:string,firstName:string,lastName:string,clientName:string,legalName:string,country:string) {
        this.Title=title;
        // this.Date=date.split("T")[0];
        this.Date=moment(date).format("DD MMM, YYYY");
        this.Id=id;
        this.DateValue=new Date(date) ;
        this.FirstName=firstName;
        this.LastName=lastName;
        this.ClientName=clientName;
        this.LegalName=legalName;
        this. Country=country;

    }
  public  ClientName: string;
  public Country:string;
  public  LegalName: string;
  public Id: number;
  public Title: string;
  public Date: string;
  public DateValue:Date;
  public FirstName:string;
  public LastName:string;
  public Counter:number;



}