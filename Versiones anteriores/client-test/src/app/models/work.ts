export class Work{

    constructor(
        public _id: string,
        public name: string,
        public desc: string,
        public createdBy: string,
        public teamWork: string,
        public userWork: string,
        public dateCreated: string,
        public dateWork: string,
        public dateLimit: string,
        public tag: string,
        public editable: boolean,
        public status: string,
        public free: boolean,
        public priority: string,
        public files: [string],
    ){}
}