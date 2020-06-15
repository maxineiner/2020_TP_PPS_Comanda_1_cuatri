import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { RegisterPage } from './register.page';
import { ProductFormComponent } from 'src/app/components/product-form/product-form.component';
import { TableFormComponent } from 'src/app/components/table-form/table-form.component';
import { UserFormComponent } from 'src/app/components/user-form/user-form.component';
import { ComponentsModule } from 'src/app/components/components.module';

const routes: Routes = [
  {
    path: '',
    component: RegisterPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RegisterPage, ProductFormComponent, TableFormComponent, UserFormComponent]
})
export class RegisterPageModule {}
