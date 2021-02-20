
export interface DefaultListItem{
    Id:number;
    Title:string;
}
export interface IMasterDataCollection{
    clients:ClientMasterListItem[];
    endClients:EndClientMasterListItem[];
    vendors:VendorMasterListItem[];
    countries:CountryMasterListItem[];
    roles:RoleMasterListItem[]
}
export class MasterDataCollection implements IMasterDataCollection{
    public  countries: CountryMasterListItem[]=[];
    public  roles: RoleMasterListItem[]=[];
    public clients: ClientMasterListItem[]=[];
    public  endClients: EndClientMasterListItem[]=[];
    public  vendors: VendorMasterListItem[]=[];
     

}
export interface ClientMasterListItem extends DefaultListItem{
    
}
export interface EndClientMasterListItem extends DefaultListItem{
    
}
export interface VendorMasterListItem extends DefaultListItem{
    
}
export interface CountryMasterListItem extends DefaultListItem{

}
export interface RoleMasterListItem extends DefaultListItem{

}