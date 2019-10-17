export class TextBlock{

    constructor(
        public _id: string,
        public text: string,
        public user: string,
        public createDate: Date,
        public ticket: string,
        public type: string, //PRIVATE, PUBLIC, INFO
        public files: [string],
        public read: boolean,
    ){}
}