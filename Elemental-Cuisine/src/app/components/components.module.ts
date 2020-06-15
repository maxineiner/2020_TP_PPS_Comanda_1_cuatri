import { NgModule } from '@Angular/core';
import { IonicModule } from '@ionic/angular';
import { MenuComponent } from './menu/menu.component';
import { CommonModule } from '@angular/common';
import { FeedbackComponent } from './feedback/feedback.component';
import { CustomHeaderComponent } from './custom-header/custom-header.component';
import { ClientHomeComponent } from './client-home/client-home.component';
import { WaiterHomeComponent } from './waiter-home/waiter-home.component';

@NgModule({
    declarations: [MenuComponent, FeedbackComponent, CustomHeaderComponent],
    exports: [MenuComponent, FeedbackComponent, CustomHeaderComponent],
    imports: [IonicModule, CommonModule]
})
export class ComponentsModule { }