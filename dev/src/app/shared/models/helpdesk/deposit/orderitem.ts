export class OrderItem{

    constructor(
        public _id: string,
        public order: string,
        public item: string,
        public cant: number,
        public obs: string,
        public code: string,
        public costSector: string,
    ){}
}