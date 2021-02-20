export interface IUserRegistrationListItem{
    Id:number;
    Email:string;
    Name:string;
    PreferredLanguage:string;
    ClientId:number;
    ClientName:string;
    RoleId:number;
    RoleName:string;
    VendorId:number;    
    VendorName:string;
    Address:string;
    IsActive:boolean;
    CountryId:number;
    CountryName:string;
    EndDate:Date;
    Reason:string;
}