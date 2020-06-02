import { Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private dataService: DataService
  ) { }

  getProduct(productId) {
    return this.dataService.getOne('productos', productId);
  }
  
  saveProduct(product){
    return this.dataService.add('productos', product);
  }

  getAllProducts(collection){
    return this.dataService.getAll(collection);
  }

  modifyProduct(productId, product) {
    return this.dataService.update('productos', productId, product);
  }

  deleteProduct(productId){
    this.dataService.deleteDocument('productos', productId);
  }
}
