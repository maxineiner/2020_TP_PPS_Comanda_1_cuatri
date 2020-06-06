import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Collections } from '../classes/enums/collections';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productCollection = Collections.Products;

  constructor(
    private dataService: DataService
  ) { }

  getProduct(productId) {
    return this.dataService.getOne(this.productCollection, productId);
  }
  
  saveProduct(product){
    return this.dataService.add(this.productCollection, product);
  }

  getAllProducts(){
    return this.dataService.getAll(this.productCollection);
  }

  modifyProduct(productId, product) {
    return this.dataService.update(this.productCollection, productId, product);
  }

  deleteProduct(productId){
    this.dataService.deleteDocument(this.productCollection, productId);
  }
}
