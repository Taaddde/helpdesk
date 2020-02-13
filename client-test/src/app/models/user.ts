export class User{

    constructor(
        public _id: string,
        public name: string,
        public surname: string,
        public userName: string,
        public password: string,
        public email: string,

        public sector: string,
        public sectorRef: boolean,

        public role: string,
        public sign: string,
        public image: string,
        public company: string,
        public receiveMail: boolean,
        public passToken: string
    ){}
}