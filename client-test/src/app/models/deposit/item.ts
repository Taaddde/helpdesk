export class Item{

    constructor(
        public _id: string,
        public name: string,
        public brand: string,
        public desc: string,
        public date: string,
        public deleted: boolean,
    ){}
}