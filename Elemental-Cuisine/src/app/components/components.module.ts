import { NgModule } from '@Angular/core';
import { IonicModule } from '@ionic/angular';
import { MenuComponent } from './menu/menu.component';
import { CommonModule } from '@angular/common';
import { FeedbackComponent } from './feedback/feedback.component';

@NgModule({
    declarations: [MenuComponent, FeedbackComponent],
    exports: [MenuComponent, FeedbackComponent],
    imports: [IonicModule, CommonModule]
})
export class ComponentsModule{}