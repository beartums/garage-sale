export class User {
    key?: string;
    uid: string;
    displayName: string;
    email: string;
    phoneNumber: string;
    photoURL: string;
    lastLogin: string;
    favorites: string[]; // favorited item ids

    constructor(user?: any) {
        this.uid = user ? user.uid : null;
        this.displayName = user ? user.displayName : null;
        this.email = user ? user.email : null;
        this.phoneNumber = user ? user.phoneNumber : null;
        this.photoURL = user ? user.photoURL : null;
        //this.favorites = [];
        this.lastLogin = new Date().toISOString();
    }
}
