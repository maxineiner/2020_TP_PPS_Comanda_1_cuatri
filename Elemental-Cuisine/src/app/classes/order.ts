import { Status } from './enums/Status';

export class Order {
    id: string;
    statusFood: Status;
    statusDrink: Status;
    menu: Array<object> = new Array<object>();
    total: number = 0;
}

