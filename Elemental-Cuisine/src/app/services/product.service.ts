import { Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private dataService: DataService
  ) { }

  saveProduct(product){
    return this.dataService.add('productos', product);
  }

  getAllProducts(collection){
    return this.dataService.getAll(collection);
  }

  deleteProduct(productId){
    this.dataService.deleteDocument('productos', productId);
  }
}
