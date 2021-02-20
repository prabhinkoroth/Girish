export interface IClient{
    Id:number;
    ClientName:string;
}
export class Client implements IClient{
    public  Id: number;
    public ClientName: string;
   
    constructor(id:number,clientName:string) {
       this.Id=id;
       this.ClientName=clientName;
        
    }
    
}