import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction, QueryFn } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private db: AngularFirestore
  ) { }

  getAll(collection, queryFn?:QueryFn):Observable<DocumentChangeAction<any>[]>{
    return this.db.collection(collection, queryFn).snapshotChanges();
  }

  update(collection: string, id:string, objeto:any) {
    return this.db.doc<any>(`${collection}/${id}`).update(objeto);
  }

  deleteDocument(collection: string, id: string) {
    return this.db.doc<any>(`${collection}/${id}`).delete();
  }

  add(collection, object){
    return this.db.collection(collection).add(Object.assign({}, object));
  }

  getOne(collection, id){
    return this.db.collection(collection).doc(id).get().toPromise();
  }

  setData(collection, data){
    return this.db.collection(collection).doc(data.userId).set(data);
  }

  getByQuery(collection, query){

  }
}
