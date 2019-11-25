export class Company{

    constructor(
        public _id: string,
        public name: string,
        public email: string,
        public mailSender: boolean,
        public password: string,
    ){}
}