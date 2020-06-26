
import { BartenderMenuPipe } from './bartender-menu.pipe';
import { ChefMenuPipe } from './chef-menu.pipe';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FilterPipe } from './filter.pipe';

@NgModule({
    declarations: [BartenderMenuPipe, ChefMenuPipe, FilterPipe],
    exports: [BartenderMenuPipe, ChefMenuPipe, FilterPipe],
    imports: [CommonModule]
})
export class PipesModule { }