import { Item } from './item';
import { User } from './user';

export class Message {
    key?: string;
    entryDateTime: string;
    fromEmail: string;
    fromName: string;
    fromUserId: string;
    toUserId: string;
    isRead: boolean = false;
    reason: string;
    message: string;
    item: Item;
    user: User;
}
