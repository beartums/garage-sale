export class Asset {
    key?: string;
    reference: string;
    usedBy: string[] = [];
    url: string;
    createDate: string;

    constructor(url?: string, ref?: string) {
        this.url = url;
        this.reference = ref;
        this.createDate = new Date().toISOString();
        // comment
    }
}
