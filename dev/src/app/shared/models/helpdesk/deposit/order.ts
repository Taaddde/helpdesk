export class Order{

    constructor(
        public _id: string,
        public numOrder: number,
        public date: Date,
        public dateRequired: Date,
        public uploadDate: Date,
        public company: string,
        public sectorDestiny: string,
        public justification: string,
        public obs: string,
        public status: string,
    ){}
}