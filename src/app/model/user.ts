import { FirebaseAuth } from '@angular/fire';
import { FilterOptions } from '../shared/filter.service';

export class User {
    key?: string;
    uid: string;
    displayName: string = '';
    email: string;
    phoneNumber: string;
    photoURL: string = '';
    lastLogin: string;
    firstLogin; string;
    favorites: string[] = []; // favorited item ids
    settings = {
        username: null,
        newItemEmailTags: [],
        emailOnNewItem: false,
        emailOnFavoritedActivity: false,
        emailOnCommentThreadNewComment: false,
        emailFrequency: 'never',
        allowEmails: false,
        filters: {
            tagFilters: {
                included: [],
                excluded: [],
            },
            soldItemFilter: FilterOptions.exclude,
            featuredItemFilter: FilterOptions.ignore,
            favoritedItemFilter: FilterOptions.ignore,
            availableItemsFilter: FilterOptions.ignore
        }
    };

    get username() {
        return this.settings && this.settings.username && this.settings.username > '' ? this.settings.username : this.displayName;
    }

    constructor(user?: any) {
        if (!user) return;
        this.uid = user.uid;
        this.displayName = user.displayName;
        this.settings.username = (user.settings && 
                user.settings.username && user.settings.username > '') ? user.settings.username : user.displayName;
        this.email = user.email;
        this.phoneNumber = user.phoneNumber;
        this.photoURL = user.photoURL;
        //this.favorites = [];
        this.lastLogin = new Date().toISOString();
    }

    updateAuthUserData(authUser: firebase.User): boolean {
        let isChanged = false;
        ['uid','displayName','email','phoneNumber','photoURL'].forEach( prop => {
            if (this[prop] !== authUser[prop]) {
                this[prop] = authUser[prop];
                isChanged = true;
            }
        });
        return isChanged;
    }
}
