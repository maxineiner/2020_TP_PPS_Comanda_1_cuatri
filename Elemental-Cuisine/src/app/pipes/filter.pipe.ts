import { User } from 'src/app/classes/user';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(array: any[], text: string, field1: string): any {

    if (text === '' || text === undefined){
      return array;
    }

    text = text.toLowerCase();

    return array.filter( item => {
      return item[field1].toLowerCase().includes(text);
    });

  }

}
