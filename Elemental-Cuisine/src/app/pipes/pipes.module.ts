
import { BartenderMenuPipe } from './bartender-menu.pipe';
import { ChefMenuPipe } from './chef-menu.pipe';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [BartenderMenuPipe, ChefMenuPipe],
    exports: [BartenderMenuPipe, ChefMenuPipe],
    imports: [CommonModule]
})
export class PipesModule { }