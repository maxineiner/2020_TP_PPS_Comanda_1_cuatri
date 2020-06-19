import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private db: AngularFirestore
  ) { }

  getAll(collection):Observable<DocumentChangeAction<any>[]>{
    return this.db.collection(collection).snapshotChanges();
  }

  update(collection: string, id:string, objeto:any) {
    return this.db.collection(collection).doc(id).update(objeto);
  }

  deleteDocument(collection: string, id: string) {
    return this.db.collection(collection).doc(id).delete();
  }

  add(collection, object){
    return this.db.collection(collection).add(Object.assign({}, object));
  }

  getOne(collection, id){
    return this.get(collection, id).toPromise();
  }

  get(collection, id){
    return this.db.collection(collection).doc(id).get();
  }

  setData(collection, id, data){
    return this.db.collection(collection).doc(id).set(Object.assign({}, data));
  }
 
  setStatus(collection, id, status){
    return this.update(collection, id, { 'status': status });
  }

}