import { Item } from './item';

export interface Sale {
    id,
    name: string,
    descriptions: string,
    dateStart: Date,
    dateEnd: Date,
    items: Array<Item>
}
