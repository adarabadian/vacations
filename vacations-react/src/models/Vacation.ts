export class Vacation {
    public constructor(
        public id?: number,
        public description?: string,
        public destination?: string,
        public picture?: File,
        public fromDate?: string,
        public toDate?: string,
        public price?: number,
        public isLiked?: boolean,
        public followersAmount?: number 
    ){}
    
}