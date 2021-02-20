export interface ICountry{
    Id:number;
    Country:string;
}
export class Country implements ICountry{
   
    constructor(id:number,country:string) {
      this.Id=id;
      this.Country=country;
        
    }
   public   Id : number;
   public  Country : string;
}