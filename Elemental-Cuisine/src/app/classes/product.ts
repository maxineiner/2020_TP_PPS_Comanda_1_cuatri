import { Profiles } from 'src/app/classes/enums/profiles';
import { Categories } from './enums/categories';
export class Product {
    id:string;
    name:string;
    description:string;
    preparationTime:number;
    price:number;
    photos:Array<string>;
    category: Categories;
}
