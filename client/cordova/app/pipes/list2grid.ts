import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'list2gird'})
export class List2GridPipe implements PipeTransform {
  transform(list:Array<any>, cols = 4) {
    let grid = [], row = [];

    for (let i = 0; i < list.length;) {
      row.push(list[i]);

      i++;
      if (i % cols === 0) {
        grid.push(row);
        row = [];
      }
    }
    return grid;
  }
}
