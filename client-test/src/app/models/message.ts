export class Message{

    constructor(
        public _id: string,
        public text: string,
        public readed: boolean,
        public user: string,
        public chat: string,
        public date: string,
    ){}
}