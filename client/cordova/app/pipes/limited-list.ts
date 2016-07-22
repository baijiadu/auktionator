import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'limitedList'})
export class LimitedList implements PipeTransform {
    transform(list:Array<any>, args:number[]) : Array<any> {
        list = list || [];

        let start = args[0] || 1;
        let end = args[1] || 1;
        // TODO
        return list.reverse();
    }
}
