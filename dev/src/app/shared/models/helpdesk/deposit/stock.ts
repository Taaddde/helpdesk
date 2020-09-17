export class Stock{

    constructor(
        public _id: string,
        public item: string,
        public deposit: string,
        public cant: number,
        public cantMin: number
    ){}
}