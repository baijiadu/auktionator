import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'str2date'})
export class Str2DatePipe implements PipeTransform {
  transform(value:string) {
    return value && new Date(value);
  }
}
