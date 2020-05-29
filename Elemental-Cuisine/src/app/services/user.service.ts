import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from "@angular/fire/firestore";
import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { User } from '../classes/user';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private db: AngularFirestore,
    private authService: AuthService,
    private dataService: DataService
  ) { }

  saveUserWithLogin(user) {
    return this.authService.createUser(user).then(createdUser => {
      user.id = createdUser.user.uid;
      this.saveUser(user);
    })
  }

  saveUser(user) {
    this.db.collection('usuarios').doc(user.id).set(Object.assign({}, user));
  }

  setDocument(collection: string, id: string, object: object): void {
    this.db.collection(collection).doc(id).set(object);
  }

  getUserById(userId) {
    return this.dataService.getOne('usuarios', userId);
  }

  getAllUsers(collection): Observable<DocumentChangeAction<User>[]> {
    return this.dataService.getAll(collection);
  }

  update(collection: string, id: string, object: any) {
    return this.dataService.update(collection, id, object);
  }

  deleteDocument(collection:string, user: any) {
    return this.dataService.deleteDocument(collection, user.id);
  }
}
