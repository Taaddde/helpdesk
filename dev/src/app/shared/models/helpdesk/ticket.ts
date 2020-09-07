export class Ticket{

    constructor(
        public _id: string,
        public sub: string,
        public numTicket: number,
        public requester: string,
        public agent: string,
        public team: string,
        public status: string,
        public lastActivity: string,
        public createDate: string,
        public resolveDate: string,
        public rating: number,
        public source: string,
        public tags: [string],
        public priority: string, 
        public company:string,
        public subTypeTicket: string,
        public cc: string[],
        public workTime: number,
        public realWorkTime: number,
        public obsWorkTime: string,
    ){}
}