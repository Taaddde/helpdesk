export class Ticket{

    constructor(
        public _id: string,
        public sub: string,
        public numTicket: number,
        public requester: string,
        public agent: string,
        public status: string,
        public lastActivity: string,
        public createDate: string,
        public resolveDate: string,
        public rating: number,
        public source: string,
        public tags: [string],
        public priority: string, 
    ){}
}