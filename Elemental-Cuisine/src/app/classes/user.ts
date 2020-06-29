import { Profiles } from './enums/profiles';

export class User {
    id: string;
    email: string;
    password: string;
    profile: Profiles;
    name: string;
    surname: string;
    photo: string;
    dni: number;
    cuil: number;
    status: string;
    anonymous?: boolean = false;
    currentTable?: string;
}