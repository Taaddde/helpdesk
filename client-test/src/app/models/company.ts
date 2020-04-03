export class Company{

    constructor(
        public _id: string,
        public name: string,
        public email: string,
        public mailSender: boolean,
        public chat: boolean,
        public chatScheduleFrom: string,
        public chatScheduleTo: string,
        public password: string,
        public image: string,
    ){}
}