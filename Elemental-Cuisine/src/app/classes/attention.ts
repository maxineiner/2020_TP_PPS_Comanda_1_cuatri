export class Attention {
    tableId: string;
    discount: boolean = false;
    freeDrink: boolean = false;
    freeDessert: boolean = false;
    billRequested: boolean = false;

    constructor(tableId: string) {
        this.tableId = tableId;
    }
}