export class User {
    id: string;
    email: string;
    password: string;
    profile: string;   
    name:string;
    surname:string;
    photo:string;
    dni:number;
    cuil:number;
    status:string;
    anonymous?:boolean = false;
}