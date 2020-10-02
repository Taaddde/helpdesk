export class Movim{

    constructor(
        public _id: string,
        public numMovim: number,
        public type: string,
        public reason: string,
        public stockA: string,
        public stockB: string,
        public cant: number,
        public date: string,
        public ticket: string,
        public userRes: string,
        public userReq: string,
    ){}
}