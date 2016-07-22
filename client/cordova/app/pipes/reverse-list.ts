import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'reverseList'})
export class ReverseList implements PipeTransform {
    transform(list:Array<any>, args:string[]) : Array<any> {
        list = list || [];
        return list.reverse();
    }
}
