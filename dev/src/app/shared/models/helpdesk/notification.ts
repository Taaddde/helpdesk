export class Notification{

    constructor(
        public _id: string,
        public message: string,
        public icon: string,
        public date: string,
        public dateInit: string,
        public route: string,
        public color: string,
        public user: string,
        public event: string,
        public todo: string,

    ){}
}