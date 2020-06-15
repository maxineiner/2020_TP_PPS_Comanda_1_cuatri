import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TabBarComponent } from 'src/app/components/tab-bar/tab-bar.component';
import { TabsRoutingModule } from './tabs-routing.module';
import { IonicModule } from '@ionic/angular';
import { ListsPage } from './lists.page';
import { ComponentsModule } from 'src/app/components/components.module';

const routes: Routes = [
  {
    path: '',
    component: ListsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    TabsRoutingModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListsPage, TabBarComponent]
})
export class ListsPageModule { }
