export interface IEmployee {
    Id: number;
    LegalName: string;
    CountryId: number;
    CountryName: string;

    ClientName: string;
    ClientId: number;

    EndClientName:string;
    EndClientId:number;
    EmployeeNumber:string;
}
export class Employee implements IEmployee {
    public Id: number;
    public LegalName: string;
    public CountryId: number;
    public CountryName: string;
    public ClientName: string;
    public ClientId: number;
    public EndClientName:string;
    public EndClientId:number;
    public EmployeeNumber:string;
    constructor(id: number,employeeNumber:string, legalName: string, countryId: number, countryName: string, clientId: number, clientName: string,endClientId:number,endClientName:string) {
        this.Id = id;
        this.LegalName = legalName;
        this.EmployeeNumber=employeeNumber;
        this.CountryId = countryId;
        this.CountryName = countryName;
        this.ClientId = clientId;
        this.ClientName = clientName;
        this.EndClientId=endClientId;
        this.EndClientName=endClientName;
    }
}