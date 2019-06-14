import { Asset } from './asset';
import { User } from './user';

export class Item {
    key?: string;
    // saleKey: string;
    name: string;
    description: string;
    price: number;
    currency: "UGX" | "USD" = "UGX";
    usdExchangeRate: number;
    condition: string;
    dateAvailable: string;
    pictureUrl: string;
    additionalPics: string[] = [];
    primaryAsset: Asset;
    additionalAssets: Asset[];
    tags: Array<string>;
    commentCount: number = 0;
    lastUpdated: string;
    datePosted: string;
    isHidden: boolean = false;
    isSold: boolean;
    isFeatured: boolean;
    priority: number; // higher means more important, heigher up in the list
    soldTo: string; // name
    soldToEmail: string; //
    soldToId: string // userId (if any);
    soldDate: string;
    soldPriceUgx: string;
    favoritedBy: Array<string>; // user ids of users who have favorited this item
    favoritedByUsers?: Array<User> // Reference Array of users who have favorited.  Created at read-time
    oldVersions: Array<any>;
}
