export interface IUserRegistrationFormValues {
  Id: number;
  UserType: string;
  UserKey: string;
  UserValue: string;
  Email: string;
  Name: string;
  Address: string;
  RoleKey: string;
  RoleValue: string;
  CountryKey:string;
  CountryValue:string;
  EndDate: Date;
  Status: boolean;
  Reason: string;
}
export class UserRegistrationFormValues implements IUserRegistrationFormValues {
  public CountryKey: string="";
  public CountryValue: string="";
  public RoleKey: string="";
  public RoleValue: string="";
  public UserKey: string = "";
  public UserValue: string = "";
  public Id: number = 0;
  public UserType: string = "";
  public Email: string = "";
  public Name: string = "";
  public Address: string = "";
 
  public EndDate: Date = null;
  public Status: boolean = true;
  public Reason: string = "";


}
export interface IUserRegistrationFormValidationValues {
  Id: string;
  UserType: string;
  UserKey: string;
  UserValue: string;
  Email: string;
  Name: string;
  Address: string;
  RoleKey: string;
  CountryKey:string;
  EndDate: string;
  Status: string;
  Reason: string;
}
export class UserRegistrationFormValidationValues implements IUserRegistrationFormValidationValues {
  public UserKey: string = "";
  public UserValue: string = "";
  public Id: string = "";
  public UserType: string = "";
  public Email: string = "";
  public Name: string = "";
  public Address: string = "";
  public RoleKey: string = "";
  public CountryKey:string="";
  public EndDate: string = "";
  public Status: string = "";
  public Reason: string = "";


}