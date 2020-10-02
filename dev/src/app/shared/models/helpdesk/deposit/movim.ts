export class Movim{

    constructor(
        public _id: string,
        public numMovim: number,
        public type: string,
        public deposit: string,
        public item: string,
        public company: string,
        public cant: number,
        public agent: string,
        public reason: string,
        public date: Date,
        public uploadDate: Date,

        public sector: string,
        public requester: string,
        public ticket: string,
        
        public depositDestiny: string,

        public obs: string
    ){}
}