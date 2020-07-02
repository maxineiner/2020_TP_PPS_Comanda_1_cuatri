import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrderPage } from './order.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { ProductDetailsComponent } from 'src/app/components/product-details/product-details.component';

const routes: Routes = [
  {
    path: '',
    component: OrderPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrderPage, ProductDetailsComponent],
  entryComponents: [ProductDetailsComponent]

})
export class OrderPageModule {}
