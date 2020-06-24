import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../classes/product';
import { Profiles } from '../classes/enums/profiles';
@Pipe({
  name: 'bartenderMenu'
})
export class BartenderMenuPipe implements PipeTransform {

  transform(menu: Product[]): any {
    return menu.filter(menuItem => menuItem.managerProfile == Profiles.Bartender);
  }

}