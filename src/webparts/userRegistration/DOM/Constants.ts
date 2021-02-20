export  class ListFieldsClientMaster{
    public  static readonly Id:string="Id";
    public static readonly Title:string="Title";
}
export  class ListFieldsEndClientMaster{
    public static readonly Id:string="Id";
    public static readonly Title:string="Title";
}
export  class ListFieldsVendorMaster{
    public static readonly Id:string="Id";
    public static readonly Title:string="Title";
}
export class ListFieldsPortalUserMaster{
    
    public static readonly  Id:string="Id";
    public static readonly  Email:string="Email";
    public static readonly   Name:string="Name";
    public static readonly  PreferredLanguage:string="PreferredLanguage";
    public static readonly  Client:string="Client";
    public static readonly   Role:string="Role";
    public static readonly   Vendor:string="Vendor";
    public static readonly   Address:string="Address";
    public static readonly   IsActive:string="IsActive";
    public static readonly   Country:string="Country";
    public static readonly   EndDate:string="EndDate";
    public static readonly  Reason:string="Reason";
    public static readonly EndClient:string="EndClient";
}

export class ListNames{
    public static readonly CountryMaster:string="Country Master";
    public static readonly RoleMaster:string="Role Master";
    public static readonly ClientMaster:string="Client Master";
    public static readonly EndClientMaster="End Client Master";
    public static readonly VendorMaster="Vendor Master";
    public static readonly PortalUserMaster="Portal User Master";
}