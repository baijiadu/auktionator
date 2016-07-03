import {Pipe} from '@angular/core';

@Pipe({name: 'str2date'})
export class Str2DatePipe {
  transform(value) {
    return value && new Date(value);
  }
}
