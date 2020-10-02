export class Chat{

    constructor(
        public _id: string,
        public num: number,
        public agent: string,
        public requester: string,
        public team: string,
        public company: string,
        public rating: number,
        public finishedAgent: boolean,
        public finishedRequester: boolean,

    ){}
}