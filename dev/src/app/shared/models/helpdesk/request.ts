export class Request{

    constructor(
        public num: String,
        public module: String,
        public typeExt: String,
        public menu: String,
        public req: String,
        public desc: String,
        public createDate: String,
        public statusClient: String,
        public statusEnterprise: String,
        public priorityClient: String,

        //Viene por sistema
        public type: String,
        public priority: String,
        public revision: String,
        public environment: String,
        public old: String,
        public obs: String,
    ){}
}