import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PollEmployeeListPage } from './poll-employee-list.page';

const routes: Routes = [
  {
    path: '',
    component: PollEmployeeListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PollEmployeeListPage]
})
export class PollEmployeeListPageModule {}
