import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { ClientHomeComponent } from 'src/app/components/client-home/client-home.component';
import { WaiterHomeComponent } from 'src/app/components/waiter-home/waiter-home.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage, ClientHomeComponent, WaiterHomeComponent]
})
export class HomePageModule {}
