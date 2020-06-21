export class Order {
    id: string;
    status: string;
    menu: Array<object> = new Array<object>();
    total: number = 0;
}

