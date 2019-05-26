export class Item {
    key?: string;
    saleKey: string;
    name: string;
    description: string;
    price: number;
    currency: "UGX" | "USD";
    usdExchangeRate: number;
    condition: string;
    dateAvailable: Date;
    pictureUrl: string;
    tags: Array<string>;
    favoritedBy: Array<string>; // user ids of users who have favorited this item
    oldVersions: Array<any>;
}
