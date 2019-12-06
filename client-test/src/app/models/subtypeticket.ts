export class SubTypeTicket{

    constructor(
        public _id: string,
        public name: string,
        public team: string,
        public resolveDays: number,
        public typeTicket: string,
        public checks: string[],
        public goodChecks: number,
        public requireAttach: boolean,
        public desc: string,
        public autoSub: string,
        public autoDesc: string
    ){}
}