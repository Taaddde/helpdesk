export class WorkObservation{

    constructor(
        public _id: string,
        public work: string,
        public text: string,
        public user: string,
        public date: string,
        public files: [string],
        public read: boolean,

    ){}
}