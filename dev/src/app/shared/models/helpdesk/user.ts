export class User{

    constructor(
        public _id: string,
        public name: string,
        public surname: string,
        
        public userName: string,
        public password: string,
        public email: string,

        public image: string,

        public passToken: string,
    ){}
}