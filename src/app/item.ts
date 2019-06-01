export class Item {
    key?: string;
    saleKey: string;
    name: string;
    description: string;
    price: number;
    currency: "UGX" | "USD" = "UGX";
    usdExchangeRate: number;
    condition: string;
    dateAvailable: string;
    pictureUrl: string;
    tags: Array<string>;
    commentCount: number = 0;
    lastUpdated: string;
    favoritedBy: Array<string>; // user ids of users who have favorited this item
    oldVersions: Array<any>;
}
