import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { DeliveryRouteComponent } from 'src/app/components/delivery-route/delivery-route.component';

import { IonicModule } from '@ionic/angular';

import { DeliveryPage } from './delivery.page';
import { ComponentsModule } from 'src/app/components/components.module';

const routes: Routes = [
  {
    path: '',
    component: DeliveryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DeliveryPage, DeliveryRouteComponent]
})
export class DeliveryPageModule { }
