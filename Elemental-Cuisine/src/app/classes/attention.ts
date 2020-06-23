export class Attention {
    userId: string;
    tableId: string;
    discount: boolean = false;
    freeDrink: boolean = false;
    freeDessert: boolean = false;

    constructor(userId: string, tableId: string) {
        this.userId = userId;
        this.tableId = tableId;
    }
}