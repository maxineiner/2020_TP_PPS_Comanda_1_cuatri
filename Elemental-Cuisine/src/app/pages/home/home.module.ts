
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { ClientHomeComponent } from 'src/app/components/client-home/client-home.component';
import { WaiterHomeComponent } from 'src/app/components/waiter-home/waiter-home.component';
import { MaitreHomeComponent } from './../../components/maitre-home/maitre-home.component';
import { BartenderHomeComponent } from './../../components/bartender-home/bartender-home.component';
import { CheffHomeComponent } from './../../components/cheff-home/cheff-home.component';


@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage, ClientHomeComponent, WaiterHomeComponent, MaitreHomeComponent, BartenderHomeComponent, CheffHomeComponent]
})
export class HomePageModule { }
