import { Profiles } from 'src/app/classes/enums/profiles';
export class Product {
    id:string;
    name:string;
    description:string;
    preparationTime:number;
    price:number;
    photos:Array<string>;
    managerProfile: Profiles
}
