export interface IEndClient {
    Id: number;
    ClientName: string;
}
export class EndClient implements IEndClient {
    public  Id: number;
    public ClientName: string;

    constructor(id: number, clientName: string) {
        this.Id = id;
        this.ClientName = clientName;

    }
}