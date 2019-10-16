export class Team{

    constructor(
        public _id: string,
        public name: string,
        public users: [string],
        public image: string,
        public createDate: string
    ){}
}