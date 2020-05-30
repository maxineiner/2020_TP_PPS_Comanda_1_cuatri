import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListsPage } from './lists.page';

const routes: Routes = [
  { path: '', component: ListsPage, children: [
    { path: 'usuarios', loadChildren: '../user-list/user-list.module#UserListPageModule' },
    { path: 'mesas', loadChildren: '../table-list/table-list.module#TableListPageModule' },
    { path: 'productos', loadChildren: '../product-list/product-list.module#ProductListPageModule' },
    { path: '', redirectTo: 'usuarios',pathMatch: 'full' }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsRoutingModule { }
