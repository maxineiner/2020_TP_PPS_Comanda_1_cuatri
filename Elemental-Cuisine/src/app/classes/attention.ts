export class Attention {
    tableId: string;
    discount: boolean = false;
    freeDrink: boolean = false;
    freeDessert: boolean = false;

    constructor(tableId: string) {
        this.tableId = tableId;
    }
}