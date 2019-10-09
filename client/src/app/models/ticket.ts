export class Ticket{

    constructor(
        public _id: string,
        public num: number,
        public requester: string,
        public agent: string,
        public status: string,
        public lastActivity: Date,
        public createDate: Date,
        public rating: number,
        public source: string,
        public tags: [string],
    ){}
}