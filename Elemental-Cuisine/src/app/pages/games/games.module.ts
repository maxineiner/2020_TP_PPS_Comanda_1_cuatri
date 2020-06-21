import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GamesPage } from './games.page';
import { SimonComponent } from 'src/app/components/simon/simon.component';
import { TatetiComponent } from 'src/app/components/tateti/tateti.component';

const routes: Routes = [
  {
    path: '',
    component: GamesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GamesPage, SimonComponent, TatetiComponent]
})
export class GamesPageModule {}
