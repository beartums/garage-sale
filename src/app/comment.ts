export class Comment {
    key?: string;
    itemId: string;
    userId: string;
    userName: string;
    dateTime: string;
    utcOffset: number;
    comment: string;

    constructor (comment: string, itemId: string, userId: string, userName: string) {
        this.itemId = itemId;
        this.userId = userId || '';
        this.userName = userName || '';
        this.dateTime = new Date().toISOString();
        this.utcOffset = new Date().getTimezoneOffset();
        this.comment = comment;
    }
}
