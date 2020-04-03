export class Message{

    constructor(
        public _id: string,
        public text: string,
        public user: string,
        public chat: string,
        public date: string,
    ){}
}